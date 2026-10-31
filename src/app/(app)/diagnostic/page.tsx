"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Calendar,
  Clock,
  Target,
  Sparkles,
  Info,
  Check,
  X,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import {
  DIAGNOSTIC_QUESTIONS,
  DiagnosticResult,
  getSavedDiagnostic,
  saveDiagnosticResult,
  updateLearningPathItem,
} from "@/lib/services/diagnostic-service";

export default function DiagnosticPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);

  // Diagnostic Quiz State
  const [isTaking, setIsTaking] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Goal settings
  const [targetBand, setTargetBand] = useState<number>(7.0);
  const [dailyMinutes, setDailyMinutes] = useState<number>(30);
  const [examWeeksAway, setExamWeeksAway] = useState<number>(8);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const saved = await getSavedDiagnostic(user?.uid);
      if (saved) {
        setDiagnosticResult(saved);
        setTargetBand(saved.targetBand || 7.0);
        setDailyMinutes(saved.dailyMinutes || 30);
        setExamWeeksAway(saved.examWeeksAway || 8);
      }
      setLoading(false);
    }
    init();
  }, [user?.uid]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleFinishDiagnostic = async () => {
    setIsSubmitting(true);
    const res = await saveDiagnosticResult(
      user?.uid,
      selectedAnswers,
      targetBand,
      dailyMinutes,
      examWeeksAway
    );
    setDiagnosticResult(res);
    setIsTaking(false);
    setIsSubmitting(false);
  };

  const handleToggleTaskStatus = async (itemId: string, currentCompleted: boolean) => {
    if (!diagnosticResult) return;
    const updated = await updateLearningPathItem(user?.uid, diagnosticResult, itemId, {
      completed: !currentCompleted,
    });
    setDiagnosticResult(updated);
  };

  const handleSkipTask = async (itemId: string) => {
    if (!diagnosticResult) return;
    const updated = await updateLearningPathItem(user?.uid, diagnosticResult, itemId, {
      skipped: true,
    });
    setDiagnosticResult(updated);
  };

  if (loading) {
    return (
      <div className="card p-12 text-center text-sm text-[var(--muted)]">
        Diagnostika ma'lumotlari yuklanmoqda…
      </div>
    );
  }

  // 1. QUIZ TAKING VIEW
  if (isTaking) {
    const currentQ = DIAGNOSTIC_QUESTIONS[currentQIndex];
    const progressPct = Math.round(((currentQIndex + 1) / DIAGNOSTIC_QUESTIONS.length) * 100);
    const hasAnsweredCurrent = Boolean(selectedAnswers[currentQ.id]);

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Progress Header */}
        <div className="card p-5 space-y-3 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[var(--foreground)]">
              Savol {currentQIndex + 1} / {DIAGNOSTIC_QUESTIONS.length}
            </span>
            <span className="font-semibold text-[var(--primary)] uppercase text-[11px]">
              {currentQ.skill} · {currentQ.questionType}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--surface-subtle)] overflow-hidden">
            <div
              className="h-full bg-[var(--primary)] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="card p-6 md:p-8 space-y-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm">
          {/* Passage or Excerpt */}
          <div className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-xs md:text-sm text-[var(--foreground)] leading-relaxed italic">
            {currentQ.passageOrPrompt}
          </div>

          {/* Question text */}
          <h3 className="font-extrabold text-base md:text-lg text-[var(--foreground)]">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt) => {
              const isSelected = selectedAnswers[currentQ.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(currentQ.id, opt.id)}
                  className={`w-full text-left p-4 rounded-xl border text-xs md:text-sm font-medium transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-[var(--nav-active-bg)] border-[var(--primary)] text-[var(--foreground)] shadow-xs"
                      : "bg-[var(--surface)] border-[var(--border)] text-[var(--secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {opt.id.length <= 2 && (
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-[var(--primary)] text-white"
                            : "bg-[var(--surface-subtle)] text-[var(--muted)] border border-[var(--border)]"
                        }`}
                      >
                        {opt.id}
                      </span>
                    )}
                    <span>{opt.text}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[var(--primary)] shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between gap-3">
            <button
              onClick={() => {
                if (currentQIndex > 0) setCurrentQIndex((i) => i - 1);
                else setIsTaking(false);
              }}
              className="btn-secondary text-xs !py-2 !px-4 cursor-pointer"
            >
              {currentQIndex === 0 ? "Bekor qilish" : "Oldingi savol"}
            </button>

            {currentQIndex < DIAGNOSTIC_QUESTIONS.length - 1 ? (
              <button
                onClick={() => setCurrentQIndex((i) => i + 1)}
                disabled={!hasAnsweredCurrent}
                className="btn-primary text-xs !py-2.5 !px-5 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>Keyingi savol</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishDiagnostic}
                disabled={!hasAnsweredCurrent || isSubmitting}
                className="btn-primary text-xs !py-2.5 !px-6 flex items-center gap-2 cursor-pointer font-bold disabled:opacity-50"
              >
                <span>{isSubmitting ? "Baholanmoqda…" : "Natijani chiqarish"}</span>
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. WELCOME / START VIEW (IF NO RESULT YET)
  if (!diagnosticResult) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <span className="eyebrow">Dastlabki Baholash</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
            IELTS Dastlabki Diagnostika & O‘quv Yo‘li
          </h1>
          <p className="text-sm text-[var(--secondary)] mt-1">
            Qisqa (taxminan 8 daqiqalik) 4 ko‘nikmali test orqali zaif tomonlaringizni aniqlang va
            individual dars rejasiga ega bo‘ling.
          </p>
        </div>

        {/* Disclaimer Banner per Section 7 */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
          <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Rasmiy Ogohlantirish (Disclaimer):</p>
            <p className="leading-relaxed">
              Ushbu qisqa diagnostik test faqat <strong>dastlabki o‘quv indikatori</strong> bo‘lib,
              IELTS rasmiy sertifikati yoki kafolatlangan band bahosi hisoblanmaydi. Maqsad —
              kamchiliklarni ko‘rsatib, to‘g‘ri mashqlarni tanlashda yordam berish.
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card p-5 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-[var(--primary)] flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-[var(--foreground)]">4 Ko‘nikmali Tahlil</h3>
            <p className="text-xs text-[var(--secondary)] leading-relaxed">
              Reading, Listening, Writing va Speaking bo‘yicha eng xarakterli IELTS savol turlari
              tekshiriladi.
            </p>
          </div>

          <div className="card p-5 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-[var(--foreground)]">Aniq Sababli Tavsiyalar</h3>
            <p className="text-xs text-[var(--secondary)] leading-relaxed">
              "Matching headingsda xato qildingiz, shuning uchun ushbu qisqa mashq tavsiya etildi"
              kabi tushunarli mantiq.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="card p-6 md:p-8 text-center space-y-4 bg-gradient-to-b from-[var(--surface)] to-[var(--surface-subtle)] border border-[var(--border)] rounded-2xl">
          <h2 className="text-lg font-black text-[var(--foreground)]">
            Diagnostikani boshlashga tayyormisiz?
          </h2>
          <p className="text-xs text-[var(--muted)] max-w-md mx-auto">
            Test 6 ta savoldan iborat bo‘lib, har bir savol real IELTS akademik manbalaridan
            saralangan.
          </p>
          <div>
            <button
              onClick={() => {
                setSelectedAnswers({});
                setCurrentQIndex(0);
                setIsTaking(true);
              }}
              className="btn-primary text-sm !py-3 !px-8 font-bold cursor-pointer inline-flex items-center gap-2 shadow-sm"
            >
              <Compass className="w-4 h-4" />
              <span>Diagnostikani boshlash (8 daqiqa)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. RESULTS & PERSONAL LEARNING PATH VIEW
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="eyebrow">Shaxsiy Rivojlanish Xaritasi</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
            IELTS Diagnostika Natijasi & O‘quv Yo‘li
          </h1>
          <p className="text-sm text-[var(--secondary)] mt-0.5">
            Diagnostika sanasi: {new Date(diagnosticResult.takenAt).toLocaleDateString()}
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedAnswers({});
            setCurrentQIndex(0);
            setIsTaking(true);
          }}
          className="btn-secondary text-xs !py-2 !px-4 self-start flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Diagnostikani qayta topshirish</span>
        </button>
      </div>

      {/* Official Disclaimer Banner */}
      <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>
          <strong>Dastlabki indikator:</strong> Ushbu natija rasmiy IELTS band sertifikati emas,
          balki platformadagi o‘quv yo‘lingizni moslashtirish uchun mo‘ljallangan yo‘naltiruvchi
          bahodir.
        </span>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-5 space-y-1">
          <span className="text-xs text-[var(--muted)] font-semibold">Baholangan Dastlabki Band</span>
          <p className="text-3xl font-black text-[var(--primary)] tabular">
            {diagnosticResult.estimatedBand.toFixed(1)}
          </p>
          <p className="text-[11px] text-[var(--muted)]">6 ta ko‘nikma savoli asosida</p>
        </div>

        <div className="card p-5 space-y-1">
          <span className="text-xs text-[var(--muted)] font-semibold">Maqsad Qilingan Band</span>
          <p className="text-3xl font-black text-[var(--foreground)] tabular">
            {diagnosticResult.targetBand.toFixed(1)}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold">
            +{(diagnosticResult.targetBand - diagnosticResult.estimatedBand).toFixed(1)} band o‘sish
            zarur
          </p>
        </div>

        <div className="card p-5 space-y-1">
          <span className="text-xs text-[var(--muted)] font-semibold">Kunlik Mashg‘ulot Rejasi</span>
          <p className="text-3xl font-black text-[var(--foreground)] tabular">
            {diagnosticResult.dailyMinutes} daq
          </p>
          <p className="text-[11px] text-[var(--muted)]">Haftasiga 5 kunlik maqsad</p>
        </div>

        <div className="card p-5 space-y-1">
          <span className="text-xs text-[var(--muted)] font-semibold">Imtihongacha Qolgan Vaqt</span>
          <p className="text-3xl font-black text-[var(--foreground)] tabular">
            {diagnosticResult.examWeeksAway} hafta
          </p>
          <p className="text-[11px] text-[var(--muted)]">
            Taxminan {diagnosticResult.examWeeksAway * 7} kun
          </p>
        </div>
      </div>

      {/* Skill Diagnostic Bars */}
      <div className="card p-6 space-y-4">
        <h2 className="text-base font-bold text-[var(--foreground)]">
          Ko‘nikmalar bo‘yicha natijalar
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Reading", score: diagnosticResult.skillScores.reading, icon: BookOpen },
            { label: "Listening", score: diagnosticResult.skillScores.listening, icon: Headphones },
            { label: "Writing", score: diagnosticResult.skillScores.writing, icon: PenTool },
            { label: "Speaking", score: diagnosticResult.skillScores.speaking, icon: Mic },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[var(--foreground)]">
                  <span className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span>{item.label}</span>
                  </span>
                  <span className="tabular">{item.score}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      item.score >= 80
                        ? "bg-emerald-500"
                        : item.score >= 50
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weaknesses Detected */}
      {diagnosticResult.weaknesses.length > 0 && (
        <div className="card p-6 space-y-3 border-l-4 border-l-amber-500">
          <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Aniqlangan zaif nuqtalar va e'tibor qaratish kerak bo‘lgan sohalar</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {diagnosticResult.weaknesses.map((w, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 space-y-1"
              >
                <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
                  <span className="px-1.5 py-0.5 rounded bg-amber-200/50 dark:bg-amber-900/50 text-[10px] uppercase">
                    {w.skill}
                  </span>
                  <span>{w.questionType}</span>
                </div>
                <p className="text-[var(--secondary)] leading-relaxed">{w.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PERSONAL LEARNING PATH (Section 7) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-[var(--foreground)] tracking-tight">
              Shaxsiy O‘quv Yo‘li (Personal Learning Path)
            </h2>
            <p className="text-xs text-[var(--secondary)]">
              Diagnostika natijangiz va maqsadingiz asosida tanlangan, aniq sabab bilan berilgan
              tavsiyalar.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {diagnosticResult.learningPath.map((item) => {
            if (item.skipped) return null;
            return (
              <div
                key={item.id}
                className={`card p-5 md:p-6 space-y-3 border transition-all ${
                  item.completed
                    ? "bg-[var(--surface-subtle)]/60 opacity-80 border-dashed border-[var(--border)]"
                    : "bg-[var(--surface)] border-[var(--border)] shadow-xs"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        item.priority === "high"
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
                      }`}
                    >
                      {item.priority === "high" ? "Muhim / Prioritet" : "Rejali"}
                    </span>
                    <span className="text-xs font-bold text-[var(--primary)] uppercase">
                      {item.skill}
                    </span>
                    <span className="text-xs text-[var(--muted)]">· {item.topic}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.estimatedMinutes} daqiqa</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3
                    className={`font-bold text-sm md:text-base text-[var(--foreground)] ${
                      item.completed ? "line-through text-[var(--muted)]" : ""
                    }`}
                  >
                    {item.title}
                  </h3>

                  {/* Section 7 Plain Reason requirement */}
                  <div className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-xs text-[var(--secondary)] flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--primary)] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      <strong>Nima uchun tavsiya etildi:</strong> {item.reason}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleTaskStatus(item.id, item.completed)}
                      className="text-xs text-[var(--secondary)] hover:text-[var(--foreground)] font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          item.completed ? "text-emerald-600 fill-emerald-100" : "text-[var(--muted)]"
                        }`}
                      />
                      <span>{item.completed ? "Bajarildi deb belgilangan" : "Bajarildi deb belgilash"}</span>
                    </button>

                    <button
                      onClick={() => handleSkipTask(item.id)}
                      className="text-xs text-[var(--muted)] hover:text-rose-600 cursor-pointer"
                    >
                      O‘tkazib yuborish (Skip)
                    </button>
                  </div>

                  {!item.completed && (
                    <Link
                      href={item.actionHref}
                      className="btn-primary text-xs !py-1.5 !px-4 flex items-center gap-1.5"
                    >
                      <span>Mashqni boshlash</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
