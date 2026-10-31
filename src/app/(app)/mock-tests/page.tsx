"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Layers,
  Sparkles,
  Crown,
  CheckCircle2,
  Clock,
  ArrowRight,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  Award,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { fetchUserAttempts, TestAttempt } from "@/lib/services/attempts-service";
import { CatalogHeader } from "@/components/catalog/CatalogHeader";

interface PackDefinition {
  id: string;
  title: string;
  testCount: number;
  isFree: boolean;
  gradient: string;
  description: string;
  tests: Array<{
    id: string;
    number: number;
    title: string;
    readingId: string;
    durationMinutes: number;
    tags: string[];
  }>;
}

const PACKS: PackDefinition[] = [
  {
    id: "academic-practice-set-1",
    title: "IELTS Academic Practice Set 1",
    testCount: 4,
    isFree: true,
    gradient: "from-indigo-600 via-purple-600 to-pink-500",
    description: "IELTS-style to‘liq amaliyot: Listening, Reading (40 ta savol, 3 ta matn), Writing va Speaking",
    tests: [
      {
        id: "mock-set-1-t1",
        number: 1,
        title: "Academic Full Test 1 (History, Urban Ag, Ice Age)",
        readingId: "rd-mock-1",
        durationMinutes: 160,
        tags: ["history", "agriculture", "climate"],
      },
      {
        id: "mock-set-1-t2",
        number: 2,
        title: "Academic Full Test 2 (Silk, Bilingual Brain, Extinction)",
        readingId: "rd-mock-2",
        durationMinutes: 160,
        tags: ["textiles", "linguistics", "paleontology"],
      },
      {
        id: "mock-set-1-t3",
        number: 3,
        title: "Academic Full Test 3 (Antarctica, Farming, Bird Songs)",
        readingId: "rd-mock-3",
        durationMinutes: 160,
        tags: ["exploration", "urban-planning", "biology"],
      },
      {
        id: "mock-set-1-t4",
        number: 4,
        title: "Academic Full Test 4 (Marine, Renewable Grids, Literature)",
        readingId: "rd-mock-4",
        durationMinutes: 160,
        tags: ["marine", "renewable-energy", "literature"],
      },
    ],
  },
  {
    id: "academic-practice-set-2",
    title: "IELTS Academic Practice Set 2",
    testCount: 4,
    isFree: false,
    gradient: "from-blue-600 via-indigo-600 to-purple-700",
    description: "Murakkab ilmiy mavzular va 40 savolli akademik o‘qish simulyatsiyalari",
    tests: [
      {
        id: "mock-set-2-t5",
        number: 5,
        title: "Academic Full Test 5 (Architecture, Botany, Linguistics)",
        readingId: "rd-mock-5",
        durationMinutes: 160,
        tags: ["architecture", "botany", "linguistics"],
      },
      {
        id: "mock-set-2-t6",
        number: 6,
        title: "Academic Full Test 6 (Transport, Climate Physics, Ecology)",
        readingId: "rd-mock-6",
        durationMinutes: 160,
        tags: ["transport", "physics", "ecology"],
      },
      {
        id: "mock-set-2-t7",
        number: 7,
        title: "Academic Full Test 7 (Geology, AI Ethics, Human Cognition)",
        readingId: "rd-mock-7",
        durationMinutes: 160,
        tags: ["geology", "ai", "cognition"],
      },
      {
        id: "mock-set-2-t8",
        number: 8,
        title: "Academic Full Test 8 (Aviation, Deep Sea, Anthropology)",
        readingId: "rd-mock-8",
        durationMinutes: 160,
        tags: ["aviation", "oceanography", "anthropology"],
      },
    ],
  },
  {
    id: "academic-practice-set-3",
    title: "IELTS Academic Practice Set 3",
    testCount: 2,
    isFree: false,
    gradient: "from-purple-600 via-pink-600 to-rose-600",
    description: "Ilg‘or darajadagi sintaksis va Band 7.5+ talabchan savol turlari",
    tests: [
      {
        id: "mock-set-3-t9",
        number: 9,
        title: "Academic Full Test 9 (Neuroscience, Space, Sociology)",
        readingId: "rd-mock-9",
        durationMinutes: 160,
        tags: ["neuroscience", "astronomy", "sociology"],
      },
      {
        id: "mock-set-3-t10",
        number: 10,
        title: "Academic Full Test 10 (Global Trade, Microclimates, Heritage)",
        readingId: "rd-mock-10",
        durationMinutes: 160,
        tags: ["trade", "meteorology", "archaeology"],
      },
    ],
  },
];

export default function MockTestsPage() {
  const { user } = useAuth();
  const [selectedPackId, setSelectedPackId] = useState<string>("academic-practice-set-1");
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);

  useEffect(() => {
    fetchUserAttempts(user?.uid).then((res) => {
      setAttempts(res);
    });
  }, [user?.uid]);

  const activePack = PACKS.find((p) => p.id === selectedPackId) || PACKS[0];

  const getReadingBand = (readingId: string): number | null => {
    const match = attempts.find((a) => a.testId === readingId);
    return match ? match.estimatedBand : null;
  };

  return (
    <div className="space-y-6">
      {/* Catalog Header */}
      <CatalogHeader
        eyebrow="IELTS TO‘LIQ MOCK IMTIHONLARI"
        title="IELTS Mock Testlar"
        description="Barcha 4 ta modulni (Listening, Reading, Writing, Speaking) o‘z ichiga olgan haqiqiy imtihon simulyatsiyasi to‘plamlari."
        icon={Layers}
        stats={[
          { label: "To‘plamlar", value: PACKS.length },
          { label: "Jami Mock", value: PACKS.length * 4 },
        ]}
      />

      {/* Pack Selector Row */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">
              To‘plamlar (Packs)
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] font-semibold">
              {PACKS.length} to‘plam
            </span>
          </div>
          <span className="text-xs text-[var(--muted)]">Birini tanlang</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PACKS.map((pack) => {
            const isSelected = pack.id === selectedPackId;
            return (
              <button
                key={pack.id}
                onClick={() => setSelectedPackId(pack.id)}
                className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex items-center gap-3 ${
                  isSelected
                    ? "bg-[var(--surface)] border-2 border-[var(--primary)] shadow-md"
                    : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--muted)] hover:shadow-xs"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pack.gradient} text-white flex flex-col items-center justify-center shrink-0 shadow-xs`}
                >
                  <span className="text-[9px] font-black tracking-tight leading-none uppercase">
                    {pack.isFree ? "Free" : "Pro"}
                  </span>
                  <span className="text-[10px] font-bold opacity-90">4T</span>
                  <Layers className="w-3.5 h-3.5 mt-0.5 opacity-90" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-[var(--foreground)] truncate">
                      {pack.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-[var(--muted)] truncate mt-0.5">
                    {pack.testCount} tests · 4 Modul
                  </p>
                  {isSelected && (
                    <span className="inline-block mt-1 text-[10px] font-bold text-[var(--primary)]">
                      Faol to‘plam •
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Pack Tests Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[var(--border)] pb-3">
          <div>
            <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight">
              {activePack.title} — Testlar
            </h2>
            <p className="text-xs text-[var(--secondary)]">
              {activePack.description}
            </p>
          </div>
          <span className="text-xs font-medium text-[var(--muted)]">
            4 ta modul · Natijalar kartaning yuqori o‘ng burchagida
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {activePack.tests.map((test) => {
            const readingBand = getReadingBand(test.readingId);

            return (
              <div
                key={test.id}
                className="card p-5 flex flex-col justify-between gap-4 border border-[var(--border)] hover:border-[var(--primary)]/60 transition-all shadow-xs group bg-[var(--surface)] rounded-2xl relative"
              >
                {/* Header with Title and Result Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-[var(--primary)]">
                      Test {test.number}
                    </span>
                    <h3 className="text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors line-clamp-1 mt-0.5">
                      {test.title}
                    </h3>
                  </div>

                  {readingBand !== null ? (
                    <div
                      title="Reading natijasi"
                      className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/50 rounded-lg px-2 py-0.5 text-xs font-black shrink-0"
                    >
                      <Award className="w-3 h-3" />
                      <span>{readingBand.toFixed(1)}</span>
                    </div>
                  ) : (
                    <div
                      title="Natija yo‘q"
                      className="text-[11px] font-bold text-[var(--muted)] bg-[var(--surface-subtle)] px-2 py-0.5 rounded-lg border border-[var(--border)] shrink-0"
                    >
                      —
                    </div>
                  )}
                </div>

                {/* 4 Skill Modules List */}
                <div className="space-y-1.5 py-1 text-xs">
                  {/* Listening */}
                  <Link
                    href={`/listening?mockId=${test.id}`}
                    className="flex items-center justify-between p-2 rounded-xl bg-[var(--surface-subtle)] hover:bg-[var(--surface)] hover:text-[var(--primary)] transition-colors border border-transparent hover:border-[var(--border)]"
                  >
                    <div className="flex items-center gap-2">
                      <Headphones className="w-3.5 h-3.5 text-[var(--muted)]" />
                      <span className="font-semibold text-[var(--foreground)]">Listening</span>
                    </div>
                    <span className="text-[11px] text-[var(--muted)] group-hover:text-[var(--primary)] font-medium">
                      Boshlash
                    </span>
                  </Link>

                  {/* Reading */}
                  <Link
                    href={`/reading/${test.readingId}`}
                    className="flex items-center justify-between p-2 rounded-xl bg-[var(--surface-subtle)] hover:bg-[var(--surface)] hover:text-[var(--primary)] transition-colors border border-transparent hover:border-[var(--border)]"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-[var(--primary)]" />
                      <span className="font-semibold text-[var(--foreground)]">Reading</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[var(--primary)]">
                      {readingBand !== null ? "Qayta" : "Boshlash"}
                    </span>
                  </Link>

                  {/* Writing */}
                  <Link
                    href={`/writing?mockId=${test.id}`}
                    className="flex items-center justify-between p-2 rounded-xl bg-[var(--surface-subtle)] hover:bg-[var(--surface)] hover:text-[var(--primary)] transition-colors border border-transparent hover:border-[var(--border)]"
                  >
                    <div className="flex items-center gap-2">
                      <PenTool className="w-3.5 h-3.5 text-[var(--muted)]" />
                      <span className="font-semibold text-[var(--foreground)]">Writing</span>
                    </div>
                    <span className="text-[11px] text-[var(--muted)] group-hover:text-[var(--primary)] font-medium">
                      Boshlash
                    </span>
                  </Link>

                  {/* Speaking */}
                  <Link
                    href={`/speaking?mockId=${test.id}`}
                    className="flex items-center justify-between p-2 rounded-xl bg-[var(--surface-subtle)] hover:bg-[var(--surface)] hover:text-[var(--primary)] transition-colors border border-transparent hover:border-[var(--border)]"
                  >
                    <div className="flex items-center gap-2">
                      <Mic className="w-3.5 h-3.5 text-[var(--muted)]" />
                      <span className="font-semibold text-[var(--foreground)]">Speaking</span>
                    </div>
                    <span className="text-[11px] text-[var(--muted)] group-hover:text-[var(--primary)] font-medium">
                      Boshlash
                    </span>
                  </Link>
                </div>

                {/* Primary Action Button */}
                <Link
                  href={`/reading/${test.readingId}`}
                  className="btn-primary !py-2.5 !px-4 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Testni boshlash</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
