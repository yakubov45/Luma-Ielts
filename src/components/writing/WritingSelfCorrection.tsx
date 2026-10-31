"use client";

import { useState } from "react";
import { CheckCircle2, Sparkles, HelpCircle, ArrowRight, Eye, RotateCcw, AlertTriangle, Check } from "lucide-react";
import { AskAboutThisModal, ContextualHelpData } from "@/components/common/AskAboutThisModal";

export interface ErrorItem {
  id: string;
  originalSnippet: string;
  errorType: string;
  hint: string;
  suggestedCorrection: string;
  acceptablePatterns?: string[];
  solved?: boolean;
}

interface WritingSelfCorrectionProps {
  essay: string;
  taskTitle: string;
  onSavedReview?: (solvedCount: number) => void;
}

export function WritingSelfCorrection({ essay, taskTitle, onSavedReview }: WritingSelfCorrectionProps) {
  // Dynamically extract or provide realistic errors based on the essay content
  const [errors, setErrors] = useState<ErrorItem[]>(() => {
    const list: ErrorItem[] = [];

    // Analyze common essay errors
    const lower = essay.toLowerCase();
    if (lower.includes("people was") || lower.includes("they was")) {
      list.push({
        id: "err-1",
        originalSnippet: "...people was...",
        errorType: "Subject-Verb Agreement (Grammar)",
        hint: "'People' ko‘plikdagi ot (plural noun) hisoblanadi. O‘tgan zamonda 'was' emas, 'were' ishlatiladi.",
        suggestedCorrection: "...people were...",
        acceptablePatterns: ["people were", "individuals were", "citizens were"],
      });
    }

    if (lower.includes("make research") || lower.includes("do a research")) {
      list.push({
        id: "err-2",
        originalSnippet: "...make research...",
        errorType: "Collocation & Lexical Resource",
        hint: "Ingliz tilida 'research' so‘zi bilan 'make' emas, balki 'conduct', 'carry out', yoki 'undertake' fe'llari akademik tarzda qo‘llanadi.",
        suggestedCorrection: "...conduct research...",
        acceptablePatterns: ["conduct research", "carry out research", "undertake research"],
      });
    }

    if (lower.includes("in the other hand")) {
      list.push({
        id: "err-3",
        originalSnippet: "...in the other hand...",
        errorType: "Preposition & Cohesive Device",
        hint: "Bog‘lovchi ibora 'on the other hand' shaklida qo‘llaniladi ('in' predlogi noto‘g‘ri).",
        suggestedCorrection: "...on the other hand...",
        acceptablePatterns: ["on the other hand", "conversely", "in contrast"],
      });
    }

    if (lower.includes("increase rapid") || lower.includes("grow dramatic")) {
      list.push({
        id: "err-4",
        originalSnippet: "...increase rapid...",
        errorType: "Adjective vs Adverb",
        hint: "Fe'lni tasvirlash uchun sifat (rapid) emas, ravish (rapidly) zarur.",
        suggestedCorrection: "...increased rapidly...",
        acceptablePatterns: ["increased rapidly", "grew rapidly", "rose dramatically"],
      });
    }

    // Default pedagogical items if student essay is short or standard
    if (list.length === 0) {
      list.push(
        {
          id: "err-def-1",
          originalSnippet: "The chart shows the number of people who uses internet.",
          errorType: "Relative Clause Agreement",
          hint: "'People' ko‘plik bo‘lgani uchun ergash gapdagi fe'l ham ko‘plikda bo‘lishi kerak ('use', 'uses' emas).",
          suggestedCorrection: "The chart shows the number of people who use the internet.",
          acceptablePatterns: ["who use the internet", "who use internet", "using the internet"],
        },
        {
          id: "err-def-2",
          originalSnippet: "It can be seen that there was a dramatical rise in 2020.",
          errorType: "Word Formation (Sifat shakli)",
          hint: "'dramatical' degan so‘z IELTSda norasmiy hisoblanadi. To‘g‘ri akademik sifat — 'dramatic'.",
          suggestedCorrection: "It can be seen that there was a dramatic rise in 2020.",
          acceptablePatterns: ["dramatic rise", "significant rise", "sharp increase"],
        }
      );
    }

    return list;
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState<{ status: "correct" | "needs_work" | null; message: string }>({
    status: null,
    message: "",
  });
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [activeHelpContext, setActiveHelpContext] = useState<ContextualHelpData | null>(null);

  const currentError = errors[activeIndex];

  const handleValidate = () => {
    if (!userInput.trim() || !currentError) return;

    const trimmed = userInput.trim().toLowerCase();
    const patterns = currentError.acceptablePatterns || [currentError.suggestedCorrection.toLowerCase()];

    // Flexible evaluation (Section 9: Do not use exact-string equality as the only correctness check)
    const matchesPattern = patterns.some((p) => trimmed.includes(p.toLowerCase()));

    if (matchesPattern) {
      setFeedback({
        status: "correct",
        message: "Ajoyib! Xatoni to‘g‘ri tuzatdingiz. Akademik mezonlarga to‘liq mos keladi.",
      });
      setErrors((prev) =>
        prev.map((e, idx) => (idx === activeIndex ? { ...e, solved: true } : e))
      );
      if (onSavedReview) {
        onSavedReview(errors.filter((e) => e.solved).length + 1);
      }
    } else {
      setFeedback({
        status: "needs_work",
        message:
          "Variantingiz ma'noni qisman ifodalaydi, ammo asosiy grammatik yoki leksik xatolik to‘liq bartaraf etilmadi. Maslahatni yana bir bor o‘qib ko‘ring.",
      });
    }
  };

  const handleReveal = () => {
    if (!currentError) return;
    setRevealed((prev) => ({ ...prev, [currentError.id]: true }));
  };

  return (
    <div className="card p-6 md:p-8 space-y-6 bg-[var(--surface)] border-2 border-[var(--primary)] rounded-2xl shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--nav-active-bg)] text-[var(--primary)] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="eyebrow text-xs">Interaktiv O‘z-o‘zini Tahlil Qilish</span>
            <h3 className="text-xl font-extrabold text-[var(--foreground)] tracking-tight">
              “Correct It Yourself” (O‘zingiz tuzating) rejimi
            </h3>
          </div>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--secondary)]">
          {errors.filter((e) => e.solved).length} / {errors.length} tuzatildi
        </span>
      </div>

      <p className="text-xs text-[var(--secondary)] leading-relaxed">
        IELTS Writingda eng tez o‘sish o‘z xatolaringizni mustaqil tahlil qilish orqali bo‘ladi.
        Quyidagi xatolikni maslahat asosida o‘zingiz to‘g‘rilang, keyin esa to‘g‘ri namunani tekshiring.
      </p>

      {/* Error tabs */}
      <div className="flex flex-wrap gap-2">
        {errors.map((err, idx) => (
          <button
            key={err.id}
            onClick={() => {
              setActiveIndex(idx);
              setUserInput("");
              setFeedback({ status: null, message: "" });
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              idx === activeIndex
                ? "bg-[var(--primary)] text-white shadow-xs"
                : err.solved
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "bg-[var(--surface-subtle)] text-[var(--secondary)] hover:text-[var(--foreground)]"
            }`}
          >
            {err.solved ? <Check className="w-3.5 h-3.5" /> : <span>{idx + 1}</span>}
            <span>{err.errorType.split("(")[0]}</span>
          </button>
        ))}
      </div>

      {/* Active Error Card */}
      {currentError && (
        <div className="space-y-4 p-5 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border)]">
          {/* Original Snippet */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase">
              Asl matndagi xato qism:
            </span>
            <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 text-rose-900 dark:text-rose-200 font-semibold text-xs md:text-sm">
              "{currentError.originalSnippet}"
            </div>
          </div>

          {/* Pedagogical Hint */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[var(--primary)] uppercase flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              Maslahat & Qoida:
            </span>
            <p className="text-xs text-[var(--foreground)] leading-relaxed bg-[var(--surface)] p-3 rounded-xl border border-[var(--border)]">
              {currentError.hint}
            </p>
          </div>

          {/* Student Input */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-bold text-[var(--foreground)] block">
              Sizning tuzatilgan variantingiz:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleValidate();
                }}
                placeholder="To‘g‘ri gap yoki iborani shu yerga yozing..."
                className="flex-1 text-xs md:text-sm p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] focus:border-[var(--primary)]"
              />
              <button
                type="button"
                onClick={handleValidate}
                disabled={!userInput.trim()}
                className="btn-primary !py-2.5 !px-6 text-xs font-bold cursor-pointer disabled:opacity-50 shrink-0"
              >
                Tekshirish
              </button>
            </div>
          </div>

          {/* Feedback message */}
          {feedback.status && (
            <div
              className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                feedback.status === "correct"
                  ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 border border-emerald-300"
                  : "bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200 border border-amber-300"
              }`}
            >
              {feedback.status === "correct" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Reveal Suggested Option on Request */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={handleReveal}
              className="text-xs text-[var(--secondary)] hover:text-[var(--primary)] font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>To‘g‘ri tavsiya qilingan variantni ko‘rish</span>
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveHelpContext({
                  skill: "writing",
                  taskTitle,
                  questionPrompt: currentError.errorType,
                  userAnswer: userInput || currentError.originalSnippet,
                  correctAnswer: currentError.suggestedCorrection,
                  feedbackSummary: currentError.hint,
                })
              }
              className="text-xs text-[var(--primary)] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Shu xatolik haqida so‘rash</span>
            </button>
          </div>

          {revealed[currentError.id] && (
            <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                Tavsiya etilgan akademik variant:
              </span>
              <p className="font-bold text-sm">"{currentError.suggestedCorrection}"</p>
            </div>
          )}
        </div>
      )}

      {/* Contextual Ask Modal */}
      <AskAboutThisModal
        isOpen={Boolean(activeHelpContext)}
        onClose={() => setActiveHelpContext(null)}
        contextData={activeHelpContext}
      />
    </div>
  );
}
