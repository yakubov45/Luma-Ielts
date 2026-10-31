import { db } from "@/lib/firebase/client";
import { collection, doc, getDocs, setDoc, query, orderBy } from "firebase/firestore";

export type WritingFeedback = {
  overallBand: number;
  taskAchievement: { band: number; comment: string };
  coherenceCohesion: { band: number; comment: string };
  lexicalResource: { band: number; comment: string };
  grammaticalRange: { band: number; comment: string };
  strengths: string[];
  improvements: string[];
};

export type WritingSubmission = {
  id: string;
  taskType: "task1" | "task2";
  prompt: string;
  essay: string;
  wordCount: number;
  submittedAt: number;
  feedback: WritingFeedback;
};

const LOCAL_STORAGE_KEY = "ielts_focus_writing_submissions";
const DRAFT_KEY_PREFIX = "ielts_focus_writing_draft_";

const COMMON_ENGLISH_WORDS = new Set([
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he",
  "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
  "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about",
  "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know",
  "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then",
  "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how",
  "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day",
  "most", "us", "education", "university", "school", "students", "employment", "job", "future", "purpose",
  "society", "country", "governments", "development", "benefit", "problem", "solution", "believe", "agree",
  "disagree", "opinion", "argument", "however", "furthermore", "moreover", "consequently", "conclusion",
  "important", "essential", "access", "internet", "percentage", "households", "countries", "increase", "decrease"
]);

export function evaluateEssayDeterministic(
  essayText: string,
  taskType: "task1" | "task2"
): WritingFeedback {
  const text = essayText.trim();
  const rawWords = text ? text.split(/\s+/) : [];
  const wordCount = rawWords.length;
  const targetWords = taskType === "task1" ? 150 : 250;

  const cleanWords = rawWords
    .map((w) => w.toLowerCase().replace(/[^a-z]/g, ""))
    .filter(Boolean);

  // 1. Gibberish & Non-English Detection
  const wordsWithVowels = cleanWords.filter((w) => /[aeiouy]/.test(w)).length;
  const recognizedCount = cleanWords.filter((w) => COMMON_ENGLISH_WORDS.has(w)).length;

  const isVowelDeficient = cleanWords.length > 0 && wordsWithVowels / cleanWords.length < 0.6;
  const isGibberish =
    cleanWords.length >= 8 &&
    (isVowelDeficient || (cleanWords.length >= 10 && recognizedCount / cleanWords.length < 0.15));

  if (cleanWords.length === 0 || isGibberish) {
    return {
      overallBand: 1.0,
      taskAchievement: {
        band: 1.0,
        comment: "Kiritilgan matn inglizcha insho talabiga javob bermaydi yoki tasodifiy harflardan iborat.",
      },
      coherenceCohesion: {
        band: 1.0,
        comment: "Mantiqiy jumlalar va fikrlar ketma-ketligi mavjud emas.",
      },
      lexicalResource: {
        band: 1.0,
        comment: "Haqiqiy inglizcha leksika aniqlanmadi.",
      },
      grammaticalRange: {
        band: 1.0,
        comment: "Grammatik struktura va mazmunli gaplar mavjud emas.",
      },
      strengths: ["Haqiqiy insho matnini kiritish zarur."],
      improvements: [
        "Ingliz tilida to‘liq jumlalardan iborat insho yozing.",
        `Mavzuga oid kamida ${targetWords} ta so‘z yozishga harakat qiling.`,
        "Harflarni tasodifiy bosmasdan ma’noli fikrlar bayon qiling.",
      ],
    };
  }

  // 2. Severe Underlength Check (< 40 words)
  if (wordCount < 40) {
    return {
      overallBand: 2.5,
      taskAchievement: {
        band: 2.5,
        comment: `Insho hajmi o‘ta qisqa (${wordCount} ta so‘z). Talab qilingan ${targetWords} ta so‘zlik minimal mezon bajarilmagan.`,
      },
      coherenceCohesion: {
        band: 2.5,
        comment: "Fikrlar to‘liq shakllanmagan va paragraflarga ajratilmagan.",
      },
      lexicalResource: {
        band: 3.0,
        comment: "Leksik zaxira juda cheklangan va fikrni ochib berishga yetmaydi.",
      },
      grammaticalRange: {
        band: 3.0,
        comment: "Faqat qisqa yoki tugallanmagan jumlalar kiritilgan.",
      },
      strengths: ["Dastlabki kirish jumlalari boshlangan."],
      improvements: [
        `Kamida ${targetWords} ta so‘z yozishga e’tibor qarating (hozirda bor-yo‘g‘i ${wordCount} ta).`,
        "Inshoni to‘liq 4 ta paragrafga (Introduction, Body 1, Body 2, Conclusion) ajrating.",
        "Mavzuga doir aniq misol va dalillar keltiring.",
      ],
    };
  }

  // 3. Underlength Check (40 - 119 words)
  if (wordCount < 120) {
    return {
      overallBand: 4.0,
      taskAchievement: {
        band: 3.5,
        comment: `So‘zlar soni (${wordCount} ta) minimal talabdan ancha kam. Argumentlar to‘liq asoslanmagan.`,
      },
      coherenceCohesion: {
        band: 4.0,
        comment: "Fikrlar o‘rtasida bog‘liqlik bor, lekin insho tugallanmagan.",
      },
      lexicalResource: {
        band: 4.5,
        comment: "Asosiy tushunchalar ifodalangan, biroq so‘z takrori ko‘p.",
      },
      grammaticalRange: {
        band: 4.5,
        comment: "Sodda jumlalar to‘g‘ri, ammo murakkab sintaksis yetarli emas.",
      },
      strengths: ["Mavzuning asosiy yo‘nalishi tanlangan."],
      improvements: [
        `Inshoni kamida ${targetWords} ta so‘zga yetkazing (hozirda ${wordCount} ta).`,
        "Har bir argumentni 'For instance' yoki 'This is because' orqali kengaytiring.",
        "Paragraflar sonini 3-4 taga chiqaring.",
      ],
    };
  }

  // 4. Normal Length & Comprehensive Evaluation
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const paragraphCount = paragraphs.length;

  const cohesiveDevices = [
    "furthermore", "moreover", "in addition", "consequently", "however",
    "on the other hand", "nevertheless", "in contrast", "for instance",
    "for example", "specifically", "therefore", "as a result", "in conclusion",
    "to illustrate", "ultimately", "significant", "substantial", "demonstrates"
  ];
  const lowerText = text.toLowerCase();
  const foundDevices = cohesiveDevices.filter((d) => lowerText.includes(d));

  // Task Achievement
  let taBand = 5.5;
  let taComment = `So‘zlar soni (${wordCount} ta) minimal talabdan (${targetWords}) kam. Bu bandni tushirishi mumkin.`;
  if (wordCount >= targetWords && paragraphCount >= 3) {
    taBand = 7.0;
    taComment = `So‘zlar soni talabga javob beradi (${wordCount} ta so‘z) va asosiy fikrlar aniq paragraflarga ajratilgan.`;
    if (wordCount >= targetWords + 30 && paragraphCount >= 4) {
      taBand = 7.5;
      taComment = `Insho chuqur va to‘liq ochib berilgan (${wordCount} ta so‘z), har bir argument batafsil dalillangan.`;
    }
  } else if (wordCount >= targetWords - 30) {
    taBand = 6.0;
    taComment = `Insho hajmi yetarli darajaga yaqin (${wordCount} ta so‘z), biroq yana bir oz to‘ldirish talab etiladi.`;
  }

  // Coherence & Cohesion
  let ccBand = 5.5;
  let ccComment = "Fikrlar o‘rtasidagi bog‘lovchi so‘zlar (linking words) sonini ko‘paytirish lozim.";
  if (foundDevices.length >= 4 && paragraphCount >= 3) {
    ccBand = 7.0;
    ccComment = `Mantiqiy bog‘lovchilar (${foundDevices.slice(0, 3).join(", ")}) to‘g‘ri qo‘llangan, o‘qish oson va ravon.`;
  } else if (foundDevices.length >= 2 && paragraphCount >= 2) {
    ccBand = 6.0;
    ccComment = "Paragraflar o‘rtasida mantiqiy bog‘liqlik mavjud.";
  }

  // Lexical Resource
  const uniqueWords = new Set(cleanWords);
  const lexicalDiversity = cleanWords.length > 0 ? uniqueWords.size / cleanWords.length : 0;
  let lrBand = 5.5;
  let lrComment = "Bir xil so‘zlarni takrorlash o‘rniga sinonimlardan ko‘proq foydalaning.";
  if (lexicalDiversity >= 0.52 && wordCount >= 140) {
    lrBand = 7.0;
    lrComment = "Keng so‘z boyligi va akademik iboralar muvaffaqiyatli qo‘llangan.";
  } else if (lexicalDiversity >= 0.42) {
    lrBand = 6.0;
    lrComment = "Umumiy leksika to‘g‘ri ishlatilgan, akademik terminlar mavjud.";
  }

  // Grammatical Range
  let grBand = 6.0;
  let grComment = "Sodda va qo‘shma gaplar qo‘llangan.";
  const hasComplex =
    lowerText.includes("which") ||
    lowerText.includes("although") ||
    lowerText.includes("while") ||
    lowerText.includes("whereas") ||
    lowerText.includes("despite") ||
    lowerText.includes("if");

  if (hasComplex && paragraphCount >= 3) {
    grBand = 7.0;
    grComment = "Ergashgan qo‘shma gaplar va turli grammatik strukturalar to‘g‘ri kiritilgan.";
  }

  const overallBand = Math.round(((taBand + ccBand + lrBand + grBand) / 4) * 2) / 2;

  const strengths = [
    paragraphCount >= 3 ? "Inshoning aniq kirish, asosiy qism va xulosaga ega tuzilishi." : "Asosiy fikrning shakllanganligi.",
    foundDevices.length >= 3 ? "Mantiqiy bog‘lovchi so‘zlarning mavjudligi." : "Fikrlar ketma-ketligi.",
    wordCount >= targetWords ? "Belgilangan hajm talabining bajarilganligi." : "Mavzuga yo‘naltirilganlik.",
  ];

  const improvements = [
    wordCount < targetWords
      ? `Kamida ${targetWords} ta so‘z yozishga e’tibor qarating (hozirda ${wordCount} ta).`
      : "Har bir paragraf boshida aniq 'Topic sentence' (mavzu jumlasi) berishni mustahkamlang.",
    foundDevices.length < 4
      ? "Paragraflar o‘rtasida 'Furthermore', 'Consequently', 'In contrast' kabi bog‘lovchilarni qo‘shing."
      : "Akademik kollokatsiyalar (masalan, 'profound impact', 'crucial factor') ulushini oshiring.",
    "Imlo va tinish belgilarini oxirida 3 daqiqa davomida qayta tekshirib chiqing.",
  ];

  return {
    overallBand,
    taskAchievement: { band: taBand, comment: taComment },
    coherenceCohesion: { band: ccBand, comment: ccComment },
    lexicalResource: { band: lrBand, comment: lrComment },
    grammaticalRange: { band: grBand, comment: grComment },
    strengths,
    improvements,
  };
}

export function getWritingDraft(taskType: "task1" | "task2"): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(`${DRAFT_KEY_PREFIX}${taskType}`) || "";
  } catch {
    return "";
  }
}

export function saveWritingDraft(taskType: "task1" | "task2", text: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${DRAFT_KEY_PREFIX}${taskType}`, text);
  } catch {}
}

export async function fetchUserWritingSubmissions(uid: string | null | undefined): Promise<WritingSubmission[]> {
  if (typeof window === "undefined") return [];

  // Local storage check
  let localList: WritingSubmission[] = [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) localList = JSON.parse(raw);
  } catch {}

  if (!uid) return localList;

  try {
    const colRef = collection(db, `users/${uid}/writingAttempts`);
    const q = query(colRef, orderBy("submittedAt", "desc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => d.data() as WritingSubmission);
    }
  } catch (e) {
    console.warn("fetchUserWritingSubmissions Firestore error:", e);
  }

  return localList;
}

export async function submitEssay(
  uid: string | null | undefined,
  params: {
    taskType: "task1" | "task2";
    prompt: string;
    essay: string;
  }
): Promise<WritingSubmission> {
  const wordCount = params.essay.trim() ? params.essay.trim().split(/\s+/).length : 0;
  const feedback = evaluateEssayDeterministic(params.essay, params.taskType);
  const now = Date.now();
  const id = `writing_${now}`;

  const submission: WritingSubmission = {
    id,
    taskType: params.taskType,
    prompt: params.prompt,
    essay: params.essay,
    wordCount,
    submittedAt: now,
    feedback,
  };

  // Clear draft
  saveWritingDraft(params.taskType, "");

  // Save local
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([submission, ...list]));
    } catch {}
  }

  // Save Firestore
  if (uid) {
    try {
      await setDoc(doc(db, `users/${uid}/writingAttempts`, id), submission);
    } catch (e) {
      console.warn("Failed to persist writing submission in Firestore:", e);
    }
  }

  return submission;
}
