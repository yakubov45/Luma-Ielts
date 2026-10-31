import { NextRequest, NextResponse } from "next/server";

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  partOfSpeech?: string;
  definition?: string;
  example?: string;
  sourceUrls?: string[];
  license?: { name: string; url: string };
  cached?: boolean;
}

interface CacheItem {
  data: DictionaryEntry | null;
  notFound: boolean;
  expiresAt: number;
}

// In-memory process cache with TTL (24h for valid, 1h for 404s)
// Process-local cache limitation: each server worker maintains its own memory.
const CACHE_TTL_SUCCESS_MS = 24 * 60 * 60 * 1000;
const CACHE_TTL_NOT_FOUND_MS = 60 * 60 * 1000;
const MAX_CACHE_ENTRIES = 1000;

const cache = new Map<string, CacheItem>();
const inFlightRequests = new Map<string, Promise<{ data: DictionaryEntry | null; notFound: boolean }>>();

// Rate limiting: 60 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 60) {
    return false;
  }
  entry.count += 1;
  return true;
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "rate_limited", message: "Juda ko‘p so‘rov yuborildi. Iltimos, bir daqiqadan so‘ng urinib ko‘ring." },
      { status: 429 }
    );
  }

  const rawWord = req.nextUrl.searchParams.get("word") || req.nextUrl.searchParams.get("term") || "";

  // 1. Strict validation & bounded input (newplan.md Section 9)
  const trimmed = rawWord.trim();
  if (!trimmed) {
    return NextResponse.json(
      { error: "invalid_input", message: "Qidirilayotgan so‘z kiritilmadi." },
      { status: 400 }
    );
  }

  if (trimmed.length > 45) {
    return NextResponse.json(
      { error: "word_too_long", message: "So‘z uzunligi 45 belgidan oshmasligi kerak." },
      { status: 400 }
    );
  }

  // Reject URL schemes, path traversal, injection attempts
  if (/[:\/\\]/.test(trimmed)) {
    return NextResponse.json(
      { error: "invalid_format", message: "Yaroqsiz so‘z formati (faqat so‘zlar qabul qilinadi)." },
      { status: 400 }
    );
  }

  // Normalize: lowercase, collapse internal whitespace, preserve legitimate hyphens/apostrophes
  const normalized = trimmed.toLowerCase().replace(/[^a-z\-']/g, "");
  if (!normalized) {
    return NextResponse.json(
      { error: "invalid_format", message: "Faqat ingliz tili harflaridan iborat so‘z kiritilishi lozim." },
      { status: 400 }
    );
  }

  const now = Date.now();

  // 2. Check cache
  const cached = cache.get(normalized);
  if (cached && cached.expiresAt > now) {
    if (cached.notFound) {
      return NextResponse.json(
        { error: "not_found", message: `"${normalized}" so‘zi uchun ta’rif topilmadi.` },
        { status: 404, headers: { "X-Cache": "HIT-404" } }
      );
    }
    return NextResponse.json(
      { ...cached.data, cached: true },
      { status: 200, headers: { "X-Cache": "HIT" } }
    );
  }

  // 3. In-flight request deduplication
  let inFlight = inFlightRequests.get(normalized);
  if (!inFlight) {
    inFlight = (async () => {
      const upstreamUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(normalized)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second upstream timeout

      try {
        const response = await fetch(upstreamUrl, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        clearTimeout(timeoutId);

        if (response.status === 404) {
          return { data: null, notFound: true };
        }

        if (!response.ok) {
          throw new Error(`Upstream returned ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
          return { data: null, notFound: true };
        }

        const entry = data[0];
        const meaning = entry.meanings?.[0];
        const defObj = meaning?.definitions?.[0];
        const phoneticText = entry.phonetic || entry.phonetics?.find((p: any) => p.text)?.text;

        const result: DictionaryEntry = {
          word: entry.word || normalized,
          phonetic: phoneticText,
          partOfSpeech: meaning?.partOfSpeech || "noun",
          definition: defObj?.definition || "Ta’rif topilmadi.",
          example: defObj?.example,
          sourceUrls: entry.sourceUrls,
          license: entry.license,
        };

        return { data: result, notFound: false };
      } catch (err: unknown) {
        clearTimeout(timeoutId);
        throw err;
      }
    })();

    inFlightRequests.set(normalized, inFlight);
  }

  try {
    const { data, notFound } = await inFlight;
    inFlightRequests.delete(normalized);

    // Evict oldest if cache exceeded limit
    if (cache.size >= MAX_CACHE_ENTRIES) {
      const firstKey = cache.keys().next().value;
      if (firstKey) cache.delete(firstKey);
    }

    cache.set(normalized, {
      data,
      notFound,
      expiresAt: now + (notFound ? CACHE_TTL_NOT_FOUND_MS : CACHE_TTL_SUCCESS_MS),
    });

    if (notFound) {
      return NextResponse.json(
        { error: "not_found", message: `"${normalized}" so‘zi uchun ta’rif topilmadi.` },
        { status: 404, headers: { "X-Cache": "MISS-404" } }
      );
    }

    return NextResponse.json(
      { ...data, cached: false },
      { status: 200, headers: { "X-Cache": "MISS" } }
    );
  } catch (err: unknown) {
    inFlightRequests.delete(normalized);

    // Stale-cache fallback if upstream outage occurs
    if (cached && cached.data) {
      return NextResponse.json(
        { ...cached.data, cached: true, stale: true },
        { status: 200, headers: { "X-Cache": "STALE" } }
      );
    }

    const isTimeout = err instanceof Error && (err.name === "AbortError" || err.message.includes("abort"));
    if (isTimeout) {
      return NextResponse.json(
        {
          error: "timeout",
          message: "Tashqi lug‘at serveri javob berish muddati tugadi (5s timeout). Iltimos, qayta urinib ko‘ring.",
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        error: "upstream_error",
        message: "Lug‘at serveri bilan bog‘lanishda vaqtinchalik uzilish yuz berdi.",
      },
      { status: 502 }
    );
  }
}
