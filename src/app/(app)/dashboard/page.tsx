"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  ArrowRight,
  Clock,
  CheckCircle2,
  Calendar,
  Flame,
  Languages,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { AuthGuard } from "@/components/auth/auth-guard";
import { fetchTodayStudyPlan, DayStudyPlan } from "@/lib/services/study-plan-service";
import { fetchUserVocabulary, VocabWord } from "@/lib/services/vocabulary-service";
import { fetchUserAttempts, TestAttempt, computeProgressStats } from "@/lib/services/attempts-service";
import { fetchUserMistakes, Mistake } from "@/lib/services/mistakes-service";

export default function DashboardPage() {
  const { user } = useAuth();
  const userName = user?.displayName ? user.displayName.split(" ")[0] : "O‘quvchi";

  const [studyPlan, setStudyPlan] = useState<DayStudyPlan | null>(null);
  const [vocabWords, setVocabWords] = useState<VocabWord[]>([]);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [clientNow, setClientNow] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      setClientNow(Date.now());
      const [plan, vocab, atts, mists] = await Promise.all([
        fetchTodayStudyPlan(user?.uid),
        fetchUserVocabulary(user?.uid),
        fetchUserAttempts(user?.uid),
        fetchUserMistakes(user?.uid),
      ]);
      setStudyPlan(plan);
      setVocabWords(vocab);
      setAttempts(atts);
      setMistakes(mists);
      setLoading(false);
    }
    loadDashboardData();
  }, [user?.uid]);

  const dueVocabCount = clientNow > 0 ? vocabWords.filter((w) => w.dueAt <= clientNow).length : vocabWords.length;
  const completedTasksCount = studyPlan?.tasks.filter((t) => t.completed).length || 0;
  const totalTasksCount = studyPlan?.tasks.length || 3;
  const pendingMistakesCount = mistakes.filter((m) => m.status === "pending").length;

  const stats = computeProgressStats(attempts);

  // Dynamic explainable next activity recommendation (newplan.md Section 8)
  const nextRecommendation = (() => {
    // 1. Unfinished attempt
    const inProgress = attempts.find((a) => (a as any).status === "in_progress");
    if (inProgress) {
      return {
        badge: "Chala qolgan urinish",
        title: inProgress.testTitle || "Davom ettirilayotgan test",
        reason: "Siz avval boshlagan va hali yakunlamagan amaliyotingiz mavjud. Natijangizni qayd etish uchun uni yakunlang.",
        durationMinutes: 10,
        skill: "Reading Moduli",
        url: `/reading/${inProgress.testId}`,
        buttonText: "Davom ettirish",
      };
    }

    // 2. Due vocabulary
    if (dueVocabCount > 0) {
      return {
        badge: "Lug‘at takrori",
        title: `${dueVocabCount} ta so‘zni takrorlash vaqti keldi`,
        reason: "Spaced repetition (interval takrorlash) bo‘yicha bugun takrorlanishi zarur so‘zlar mavjud.",
        durationMinutes: Math.min(15, Math.max(5, Math.round(dueVocabCount * 1.5))),
        skill: "Vocabulary Moduli",
        url: "/vocabulary",
        buttonText: "So‘zlarni takrorlash",
      };
    }

    // 3. Pending mistakes
    if (pendingMistakesCount > 0) {
      return {
        badge: "Xatolar tahlili",
        title: `${pendingMistakesCount} ta xato ustida ishlash`,
        reason: "Oldingi mashqlarda yo‘l qo‘yilgan xatolarni qayta tahlil qilib, tushuntirishlar yordamida mustahkamlang.",
        durationMinutes: Math.min(20, pendingMistakesCount * 3),
        skill: "Mistakes Notebook",
        url: "/mistakes",
        buttonText: "Xatolarni ko‘rish",
      };
    }

    // 4. Initial Diagnostic if 0 attempts
    if (attempts.length === 0) {
      return {
        badge: "Boshlang‘ich tavsiya",
        title: "IELTS Diagnostic Test: Boshlang‘ich darajani aniqlash",
        reason: "Hali hech qanday test topshirmagansiz. Kuchli va zaif tomonlaringizni aniqlab, individual rejani tuzish uchun diagnostikadan o‘ting.",
        durationMinutes: 15,
        skill: "Diagnostic Moduli",
        url: "/diagnostic",
        buttonText: "Diagnostikani boshlash",
      };
    }

    // 5. Default next practice
    return {
      badge: "Navbatdagi amaliyot",
      title: "IELTS Reading Academic: Mock Test #1",
      reason: "O‘quv rejangizga muvofiq navbatdagi to‘liq imtihon formati.",
      durationMinutes: 60,
      skill: "Reading Moduli",
      url: "/reading/mock-test-1",
      buttonText: "Testni boshlash",
    };
  })();

  return (
    <AuthGuard>
      <div className="space-y-8">
        {/* 1. Compact greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
              Salom, {userName}! 👋
            </h1>
            <p className="text-sm text-[var(--secondary)] mt-0.5">
              Bugungi IELTS maqsadingiz: 30 daqiqa sifatli amaliyot.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold text-[var(--secondary)]">
            <Flame className="w-4 h-4 text-[var(--accent-orange)]" />
            <span>{attempts.length > 0 ? `${attempts.length} ta topshirilgan mashq` : "Hali test yo‘q"}</span>
          </div>
        </div>

        {/* 2. Prominent “Continue studying” card (Explainable recommendation) */}
        <section className="card border-2 border-[var(--border)] bg-gradient-to-br from-[var(--surface)] via-[var(--surface)] to-[var(--surface-subtle)] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-xl">
            <span className="eyebrow">{nextRecommendation.badge}</span>
            <h2 className="text-xl md:text-2xl font-black text-[var(--foreground)] tracking-tight">
              {nextRecommendation.title}
            </h2>
            <p className="text-sm text-[var(--secondary)] leading-relaxed">
              {nextRecommendation.reason}
            </p>
            <div className="flex items-center gap-3 text-xs text-[var(--muted)] pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> ~{nextRecommendation.durationMinutes} daqiqa
              </span>
              <span>·</span>
              <span>{nextRecommendation.skill}</span>
              <span>·</span>
              <span>Individual tavsiya</span>
            </div>
          </div>
          <Link
            href={nextRecommendation.url}
            className="btn-primary whitespace-nowrap !py-3.5 !px-6 text-sm md:text-base shrink-0 shadow-sm"
          >
            {nextRecommendation.buttonText} <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </section>

        {/* 3. Small summary cards (Honest Real Data) */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card p-5 space-y-1">
            <div className="flex items-center justify-between text-xs text-[var(--muted)] font-semibold">
              <span>Bugun yakunlangan</span>
              <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
            </div>
            <p className="text-2xl font-black tabular text-[var(--foreground)]">
              {completedTasksCount} / {totalTasksCount}
            </p>
            <p className="text-xs text-[var(--muted)]">rejalashtirilgan vazifa</p>
          </div>

          <div className="card p-5 space-y-1">
            <div className="flex items-center justify-between text-xs text-[var(--muted)] font-semibold">
              <span>Qaytariladigan so‘zlar</span>
              <Languages className="w-4 h-4 text-[var(--primary)]" />
            </div>
            <p className="text-2xl font-black tabular text-[var(--foreground)]">
              {dueVocabCount} ta
            </p>
            <p className="text-xs text-[var(--muted)]">Spaced repetition navbatida</p>
          </div>

          <div className="card p-5 space-y-1">
            <div className="flex items-center justify-between text-xs text-[var(--muted)] font-semibold">
              <span>So‘nggi Reading aniqligi</span>
              {stats.latestAttempt ? (
                <span className="text-[var(--primary)] font-bold text-xs">
                  {stats.latestAttempt.totalQuestions >= 10 && stats.latestAttempt.estimatedBand
                    ? `Band ${stats.latestAttempt.estimatedBand.toFixed(1)}`
                    : "Amaliy drill"}
                </span>
              ) : (
                <span className="text-[var(--muted)] font-medium text-xs">Test yo‘q</span>
              )}
            </div>
            <p className="text-2xl font-black tabular text-[var(--foreground)]">
              {stats.latestAttempt ? `${stats.latestAttempt.accuracy}%` : "—"}
            </p>
            <p className="text-xs text-[var(--muted)]">
              {stats.latestAttempt ? stats.latestAttempt.testTitle : "Hali test topshirilmagan"}
            </p>
          </div>
        </section>

        {/* Main Content Area & Planning Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 4. Four clear skill cards (2 cols on large screen) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight">
                IELTS Ko‘nikmalari
              </h2>
              <Link href="/reading" className="text-xs font-semibold text-[var(--primary)] hover:underline">
                Barcha mashqlar →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Reading Card */}
              <Link
                href="/reading"
                className="card p-5 hover:border-[var(--primary)] transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[var(--primary)]">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                      Reading
                    </h3>
                    <p className="text-xs text-[var(--secondary)] mt-1 leading-relaxed">
                      Academic matnlar, yonma-yon savollar paneli, floating izoh va tezkor tekshiruv.
                    </p>
                  </div>
                </div>
                <div className="pt-4 flex items-center text-xs font-semibold text-[var(--primary)]">
                  <span>Mashqlarga o‘tish</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Listening Card */}
              <Link
                href="/listening"
                className="card p-5 hover:border-[var(--primary)] transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                      Listening
                    </h3>
                    <p className="text-xs text-[var(--secondary)] mt-1 leading-relaxed">
                      Real audio pleyer, transkript belgilari va chalg‘ituvchi variantlar tahlili.
                    </p>
                  </div>
                </div>
                <div className="pt-4 flex items-center text-xs font-semibold text-[var(--secondary)] group-hover:text-[var(--primary)]">
                  <span>Mashqlarga o‘tish</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Writing Card */}
              <Link
                href="/writing"
                className="card p-5 hover:border-[var(--primary)] transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                    <PenTool className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                      Writing
                    </h3>
                    <p className="text-xs text-[var(--secondary)] mt-1 leading-relaxed">
                      Task 1 grafiklar va Task 2 insho muharriri, so‘z sanagich va mezonlar.
                    </p>
                  </div>
                </div>
                <div className="pt-4 flex items-center text-xs font-semibold text-[var(--secondary)] group-hover:text-[var(--primary)]">
                  <span>Insho yozish</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Speaking Card */}
              <Link
                href="/speaking"
                className="card p-5 hover:border-[var(--primary)] transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-stone-100 border border-[var(--border)] flex items-center justify-center text-[var(--foreground)]">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                      Speaking
                    </h3>
                    <p className="text-xs text-[var(--secondary)] mt-1 leading-relaxed">
                      Cue card savollari, audio yozib olish va ravonlik ko‘rsatkichlari.
                    </p>
                  </div>
                </div>
                <div className="pt-4 flex items-center text-xs font-semibold text-[var(--secondary)] group-hover:text-[var(--primary)]">
                  <span>Ovoz yozish</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>

          {/* 5. Today's study plan & recent activity (Right column) */}
          <div className="space-y-4">
            <div className="card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <h3 className="font-bold text-base text-[var(--foreground)]">Bugungi Reja</h3>
                <span className="text-xs text-[var(--muted)] font-semibold">
                  {studyPlan?.isRestDay ? "Dam olish kuni" : `${studyPlan?.totalMinutes || 0} daqiqa`}
                </span>
              </div>

              {studyPlan?.isRestDay ? (
                <div className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-center space-y-1">
                  <p className="text-xs font-bold text-[var(--foreground)]">Bugun Dam Olish Kuni</p>
                  <p className="text-[11px] text-[var(--muted)]">
                    Haftalik jadvalingiz bo‘yicha bugun o‘qish kuni emas.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {studyPlan?.tasks.map((task, idx) => (
                    <Link
                      key={task.id}
                      href={task.link}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors block"
                    >
                      <div className="w-6 h-6 rounded-md bg-[var(--surface)] text-[var(--primary)] font-bold text-xs flex items-center justify-center border border-[var(--border)] shrink-0">
                        {task.completed ? "✓" : idx + 1}
                      </div>
                      <div className="overflow-hidden min-w-0">
                        <p
                          className={`text-xs font-bold text-[var(--foreground)] truncate ${
                            task.completed ? "line-through text-[var(--muted)]" : ""
                          }`}
                        >
                          {task.title}
                        </p>
                        <p className="text-[11px] text-[var(--muted)]">{task.duration} daqiqa</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <Link
                href="/study-plan"
                className="btn-secondary w-full text-xs font-semibold flex items-center justify-center gap-1.5 !py-2.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>To‘liq reja taqvimi</span>
              </Link>
            </div>

            {/* Quick mistake review box */}
            <div className="card p-5 space-y-2 bg-[var(--surface-subtle)] border border-[var(--border)]">
              <span className="eyebrow text-[11px]">Xatolar Daftari</span>
              <p className="text-xs text-[var(--secondary)] leading-relaxed">
                {pendingMistakesCount > 0
                  ? `${pendingMistakesCount} ta xato tahlil uchun kutmoqda. Ularni qayta ishlab mustahkamlang.`
                  : "Barcha xatolaringiz muvaffaqiyatli tahlil qilindi!"}
              </p>
              <Link
                href="/mistakes"
                className="text-xs font-bold text-[var(--primary)] hover:underline inline-block pt-1"
              >
                Xatolarni ko‘rish →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
