"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Award,
  Target,
  BookOpen,
  Clock,
  Calendar,
  CheckCircle2,
  FileText,
  RotateCcw,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Headphones,
  PenTool,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import {
  fetchUserAttempts,
  computeProgressStats,
  TestAttempt,
  UserProgressStats,
} from "@/lib/services/attempts-service";
import { fetchUserVocabulary, VocabWord } from "@/lib/services/vocabulary-service";
import { fetchUserMistakes, Mistake } from "@/lib/services/mistakes-service";
import { fetchUserWritingSubmissions, WritingSubmission } from "@/lib/services/writing-service";

export default function ProgressPage() {
  const { user } = useAuth();
  const [activeMainTab, setActiveMainTab] = useState<"analytics" | "weekly_report">("analytics");
  const [filter, setFilter] = useState<"all" | "first" | "retake">("all");
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [vocabulary, setVocabulary] = useState<VocabWord[]>([]);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [writingSubs, setWritingSubs] = useState<WritingSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [userAttempts, userVocab, userMistakes, userWriting] = await Promise.all([
        fetchUserAttempts(user?.uid),
        fetchUserVocabulary(user?.uid),
        fetchUserMistakes(user?.uid),
        fetchUserWritingSubmissions(user?.uid),
      ]);
      setAttempts(userAttempts);
      setVocabulary(userVocab);
      setMistakes(userMistakes);
      setWritingSubs(userWriting);
      setLoading(false);
    }
    loadData();
  }, [user?.uid]);

  const filteredAttempts = attempts.filter((a) => {
    if (filter === "all") return true;
    if (filter === "retake") return a.testId.includes("retake");
    return !a.testId.includes("retake");
  });

  const stats: UserProgressStats = computeProgressStats(filteredAttempts);

  // Weekly Report State (Section 12 - calculated on client mount)
  const [weeklyData, setWeeklyData] = useState({
    startOfWeekFormatted: "",
    endOfWeekFormatted: "",
    totalActivities: 0,
    thisWeekAttempts: [] as TestAttempt[],
    thisWeekWriting: [] as WritingSubmission[],
    firstAttemptsCount: 0,
    retakesCount: 0,
    dueVocabCount: 0,
    totalVocabCount: 0,
    pendingMistakesCount: 0,
    nextSteps: [] as string[],
  });

  useEffect(() => {
    const now = new Date();
    // Monday of current week
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(now.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const startTs = startOfWeek.getTime();
    const endTs = endOfWeek.getTime();

    const thisWeekAttempts = attempts.filter((a) => a.submittedAt >= startTs && a.submittedAt <= endTs);
    const thisWeekWriting = writingSubs.filter((w) => w.submittedAt >= startTs && w.submittedAt <= endTs);

    const firstAttempts = thisWeekAttempts.filter((a) => !a.testId.includes("retake"));
    const retakes = thisWeekAttempts.filter((a) => a.testId.includes("retake"));

    const dueVocab = vocabulary.filter((v) => v.dueAt <= Date.now());
    const pendingMistakes = mistakes.filter((m) => m.status === "pending");

    // 3 Practical Next Steps (Section 12 requirement)
    const nextSteps = [
      dueVocab.length > 0
        ? `Lug‘at takrori: Sizda ${dueVocab.length} ta takrorlanishi kerak bo‘lgan so‘z bor. Bugun 10 daqiqa sarflab ularni ko‘rib chiqing.`
        : "Lug‘at: Haftalik reja bo‘yicha yangi 5 ta akademik so‘z qo‘shing.",
      pendingMistakes.length > 0
        ? `Xatolarni tahlil qilish: Xatolar daftarida ${pendingMistakes.length} ta ko‘rib chiqilmagan savol bor. Ulardan 1 tasini qayta ishlang.`
        : "Reading mashqi: O‘tgan haftadagi 1 ta o‘rta qiyinlikdagi akademik matnni qayta ishlang.",
      thisWeekWriting.length > 0
        ? "Writing qayta ko‘rib chiqish: 'Correct It Yourself' rejimi orqali oxirgi inshongizdagi xatolarni mustaqil tuzating."
        : "Writing mashqi: Band 7.0 talablariga mos Task 2 bo‘yicha 250 ta so‘zli insho yozib ko‘ring.",
    ];

    setWeeklyData({
      startOfWeekFormatted: startOfWeek.toLocaleDateString(),
      endOfWeekFormatted: endOfWeek.toLocaleDateString(),
      totalActivities: thisWeekAttempts.length + thisWeekWriting.length,
      thisWeekAttempts,
      thisWeekWriting,
      firstAttemptsCount: firstAttempts.length,
      retakesCount: retakes.length,
      dueVocabCount: dueVocab.length,
      totalVocabCount: vocabulary.length,
      pendingMistakesCount: pendingMistakes.length,
      nextSteps,
    });
  }, [attempts, writingSubs, vocabulary, mistakes]);

  const daysOfWeek = ["Dush", "Sesh", "Cho", "Pay", "Jum", "Shan", "Yak"];
  const maxWeeklyMinutes = Math.max(
    ...Object.values(stats.weeklyMinutes),
    40
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="eyebrow">Statistika va O‘sish</span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
          Learning Progress & Analytics
        </h1>
        <p className="text-sm text-[var(--secondary)] mt-0.5">
          Haqiqiy topshirilgan mashqlar asosida hisoblangan ob’ektiv natijalar va haftalik xulosalar.
        </p>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
        <button
          onClick={() => setActiveMainTab("analytics")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeMainTab === "analytics"
              ? "bg-[var(--primary)] text-white shadow-xs"
              : "bg-[var(--surface-subtle)] text-[var(--secondary)] hover:text-[var(--foreground)]"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Umumiy Tahlil & Natijalar</span>
        </button>

        <button
          onClick={() => setActiveMainTab("weekly_report")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeMainTab === "weekly_report"
              ? "bg-[var(--primary)] text-white shadow-xs"
              : "bg-[var(--surface-subtle)] text-[var(--secondary)] hover:text-[var(--foreground)]"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Haftalik Hisobot (Weekly Report)</span>
        </button>
      </div>

      {loading ? (
        <div className="card p-12 text-center text-sm text-[var(--muted)]">
          Statistika yuklanmoqda…
        </div>
      ) : activeMainTab === "weekly_report" ? (
        /* SECTION 12: IN-APP WEEKLY PROGRESS REPORT */
        <div className="space-y-6">
          {/* Week Banner */}
          <div className="card p-6 md:p-8 bg-gradient-to-r from-[var(--surface)] to-[var(--surface-subtle)] border-2 border-[var(--primary)] rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
              <div>
                <span className="eyebrow text-xs">Joriy Davr Hisoboti</span>
                <h2 className="text-xl md:text-2xl font-black text-[var(--foreground)] tracking-tight">
                  Haftalik O‘quv Xulosasi
                </h2>
              </div>
              <span className="px-3 py-1.5 rounded-full bg-[var(--nav-active-bg)] text-[var(--nav-active-text)] text-xs font-bold self-start sm:self-auto">
                {weeklyData.startOfWeekFormatted} – {weeklyData.endOfWeekFormatted}
              </span>
            </div>
            <p className="text-xs text-[var(--secondary)] leading-relaxed">
              Ushbu haftada platformadagi faolligingiz, birinchi urinishlar va qayta ishlangan testlar
              taqqoslanishi hamda kelgusi haftaning 3 ta asosiy qadami.
            </p>
          </div>

          {/* Weekly KPI Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="card p-5 space-y-1">
              <span className="text-xs text-[var(--muted)] font-semibold">Tugallangan Mashqlar</span>
              <p className="text-3xl font-black text-[var(--foreground)] tabular">
                {weeklyData.totalActivities} ta
              </p>
              <p className="text-[11px] text-[var(--muted)]">
                {weeklyData.thisWeekAttempts.length} test + {weeklyData.thisWeekWriting.length} insho
              </p>
            </div>

            <div className="card p-5 space-y-1">
              <span className="text-xs text-[var(--muted)] font-semibold">Urinishlar Nisbati</span>
              <p className="text-2xl font-black text-[var(--primary)] tabular">
                {weeklyData.firstAttemptsCount} / {weeklyData.retakesCount}
              </p>
              <p className="text-[11px] text-[var(--muted)]">Birinchi urinish / Qayta ishlangan</p>
            </div>

            <div className="card p-5 space-y-1">
              <span className="text-xs text-[var(--muted)] font-semibold">Lug‘at Holati</span>
              <p className="text-3xl font-black text-[var(--foreground)] tabular">
                {weeklyData.totalVocabCount}
              </p>
              <p className="text-[11px] text-amber-600 font-semibold">
                {weeklyData.dueVocabCount} ta so‘z takrorlanishi zarur
              </p>
            </div>

            <div className="card p-5 space-y-1">
              <span className="text-xs text-[var(--muted)] font-semibold">Kutilayotgan Xatolar</span>
              <p className="text-3xl font-black text-rose-600 tabular">
                {weeklyData.pendingMistakesCount} ta
              </p>
              <p className="text-[11px] text-[var(--muted)]">Tahlil qilinishi kerak</p>
            </div>
          </div>

          {/* Section 12: 3 Practical Next Steps */}
          <div className="card p-6 md:p-8 space-y-4 border border-[var(--border)] rounded-2xl bg-[var(--surface)]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--primary)]" />
              <h3 className="text-lg font-bold text-[var(--foreground)] tracking-tight">
                Kelgusi hafta uchun 3 ta amaliy qadam (Three Practical Next Steps)
              </h3>
            </div>
            <p className="text-xs text-[var(--muted)]">
              Haftalik natijalaringizdan kelib chiqqan holda shaxsiy sun'iy intellekt tavsiyalari:
            </p>

            <div className="space-y-3 pt-1">
              {weeklyData.nextSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-lg bg-[var(--primary)] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1 text-xs text-[var(--foreground)] leading-relaxed">
                    {step}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 flex flex-wrap gap-3">
              <Link href="/vocabulary" className="btn-secondary text-xs !py-2 !px-4">
                Lug‘atni takrorlash →
              </Link>
              <Link href="/mistakes" className="btn-secondary text-xs !py-2 !px-4">
                Xatolar daftariga o‘tish →
              </Link>
              <Link href="/reading" className="btn-primary text-xs !py-2 !px-4">
                Yangi test boshlash →
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Filter Tabs for Analytics View */}
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
            <button
              onClick={() => setFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                filter === "all"
                  ? "bg-[var(--nav-active-bg)] text-[var(--nav-active-text)]"
                  : "text-[var(--secondary)] hover:bg-[var(--surface-subtle)]"
              }`}
            >
              Barcha urinishlar ({attempts.length})
            </button>
            <button
              onClick={() => setFilter("first")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                filter === "first"
                  ? "bg-[var(--nav-active-bg)] text-[var(--nav-active-text)]"
                  : "text-[var(--secondary)] hover:bg-[var(--surface-subtle)]"
              }`}
            >
              Faqat birinchi urinishlar
            </button>
            <button
              onClick={() => setFilter("retake")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                filter === "retake"
                  ? "bg-[var(--nav-active-bg)] text-[var(--nav-active-text)]"
                  : "text-[var(--secondary)] hover:bg-[var(--surface-subtle)]"
              }`}
            >
              Qayta ishlanganlar (Retakes)
            </button>
          </div>

          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="card p-5 space-y-1">
              <span className="text-xs text-[var(--muted)] font-semibold">Baholangan Band</span>
              <p className="text-3xl font-black text-[var(--primary)] tabular">
                {stats.hasOfficialBand && stats.estimatedBand !== null
                  ? stats.estimatedBand.toFixed(1)
                  : "—"}
              </p>
              <p className="text-xs text-[var(--muted)]">
                {stats.hasOfficialBand
                  ? "Haqiqiy aniqlik asosida"
                  : "Kamida 10 ta savol talab etiladi"}
              </p>
            </div>

            <div className="card p-5 space-y-1">
              <span className="text-xs text-[var(--muted)] font-semibold">Umumiy aniqlik</span>
              <p className="text-3xl font-black text-[var(--foreground)] tabular">
                {stats.overallAccuracy !== null ? `${stats.overallAccuracy}%` : "—"}
              </p>
              <p className="text-xs text-[var(--muted)]">
                {stats.totalAttempts > 0
                  ? `${stats.totalAttempts} ta mashq bo‘yicha`
                  : "Hali urinishlar yo‘q"}
              </p>
            </div>

            <div className="card p-5 space-y-1">
              <span className="text-xs text-[var(--muted)] font-semibold">Yechilgan mashqlar</span>
              <p className="text-3xl font-black text-[var(--foreground)] tabular">
                {stats.totalAttempts} ta
              </p>
              <p className="text-xs text-[var(--muted)]">{stats.totalQuestions} ta savol yechildi</p>
            </div>

            <div className="card p-5 space-y-1">
              <span className="text-xs text-[var(--muted)] font-semibold">O‘rganilgan so‘zlar</span>
              <p className="text-3xl font-black text-[var(--foreground)] tabular">
                {vocabulary.length}
              </p>
              <p className="text-xs text-[var(--muted)]">Lug‘atga saqlandi</p>
            </div>
          </div>

          {/* Detailed Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Accuracy by Question Type */}
            <div className="card p-6 space-y-4">
              <h2 className="text-base font-bold text-[var(--foreground)]">
                Savol turlari bo‘yicha aniqlik
              </h2>

              <div className="space-y-4">
                {Object.entries(stats.questionTypeStats).map(([typeName, item]) => (
                  <div key={typeName} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[var(--foreground)]">{typeName}</span>
                      <span className="text-[var(--muted)] tabular">
                        {item.percentage}% ({item.correct}/{item.total})
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[var(--surface-subtle)] border border-[var(--border)] overflow-hidden">
                      <div
                        className="h-full bg-[var(--primary)] rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Study Minutes Chart */}
            <div className="card p-6 space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[var(--foreground)]">
                  Haftalik mashg‘ulot daqiqalari
                </h2>
                <span className="text-xs text-[var(--muted)]">Oxirgi 7 kun</span>
              </div>

              <div className="pt-8 pb-2 flex items-end justify-between gap-2 h-40">
                {daysOfWeek.map((day) => {
                  const minutes = stats.weeklyMinutes[day] || 0;
                  const heightPercent = Math.min(100, Math.max(15, (minutes / maxWeeklyMinutes) * 100));
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[10px] text-[var(--muted)] font-semibold">{minutes}m</span>
                      <div
                        className="w-full max-w-[28px] rounded-t-lg bg-[var(--nav-active-bg)] border border-[var(--primary)] transition-all"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-xs font-medium text-[var(--secondary)]">{day}</span>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-center text-[var(--muted)] border-t border-[var(--border)] pt-3">
                Haftalik maqsad: kuniga o‘rtacha 30 daqiqa sifatli amaliyot.
              </p>
            </div>
          </div>

          {/* Recent Attempts History Table */}
          <div className="card p-6 space-y-4">
            <h2 className="text-base font-bold text-[var(--foreground)]">
              So‘nggi topshirilgan mashqlar tarixi
            </h2>

            {attempts.length === 0 ? (
              <p className="text-xs text-[var(--muted)]">Hozircha topshirilgan testlar yo‘q.</p>
            ) : (
              <div className="divide-y divide-[var(--border)] text-xs">
                {attempts.slice(0, 5).map((att) => (
                  <div key={att.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="font-bold text-[var(--foreground)]">{att.testTitle}</p>
                      <p className="text-[var(--muted)]">
                        {new Date(att.submittedAt).toLocaleDateString()} · {Math.round(att.durationSeconds / 60)} daqiqa
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="text-[var(--primary)] font-bold text-sm block tabular">
                          Band {att.estimatedBand.toFixed(1)}
                        </span>
                        <span className="text-[var(--muted)]">{att.accuracy}% aniqlik</span>
                      </div>
                      <Link
                        href={`/reading/${att.testId}`}
                        className="btn-secondary text-xs !py-1.5 !px-3"
                      >
                        Qayta ishlash
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
