"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  TargetBandOption,
  LevelSourceOption,
  SkillCategory,
  WeakSkillOption,
  ExamTimelineOption,
  DailyTimeOption,
  WeekdayOption,
  SessionPreferenceOption,
  SupportingActivityOption,
  QuestionnaireData,
  DEFAULT_QUESTIONNAIRE_PLAN,
  validateQuestionnaireStep,
} from "@/lib/types/study-plan";
import {
  saveQuestionnairePreferences,
} from "@/lib/services/study-plan-service";
import {
  buildFullSchedule,
} from "@/lib/study-plan/planning-engine";
import { useAuth } from "@/components/auth/auth-provider";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  Sparkles,
  Layers,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

const DRAFT_STORAGE_KEY = "ielts_focus_onboarding_draft";

export function OnboardingWizard() {
  const router = useRouter();
  const { user } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [data, setData] = useState<QuestionnaireData>(DEFAULT_QUESTIONNAIRE_PLAN);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // 1. Restore draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData((prev) => ({ ...prev, ...parsed }));
      }
    } catch {}
  }, []);

  // 2. Persist draft on changes
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data]);

  const updateData = (patch: Partial<QuestionnaireData>) => {
    setErrorMessage("");
    setData((prev) => ({ ...prev, ...patch, isDefaultPlan: false }));
  };

  const handleNext = () => {
    const validation = validateQuestionnaireStep(step, data);
    if (!validation.valid) {
      setErrorMessage(validation.error || "Iltimos, maydonni to‘ldiring.");
      return;
    }
    setErrorMessage("");
    setStep((prev) => Math.min(prev + 1, 9));
  };

  const handleBack = () => {
    setErrorMessage("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSkipToDefault = async () => {
    setIsSaving(true);
    try {
      await saveQuestionnairePreferences(user?.uid, DEFAULT_QUESTIONNAIRE_PLAN);
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      router.push("/study-plan");
    } catch (err) {
      console.warn("Error saving default plan:", err);
      router.push("/dashboard");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmPlan = async () => {
    setIsSaving(true);
    try {
      await saveQuestionnairePreferences(user?.uid, {
        ...data,
        completedAt: Date.now(),
        updatedAt: Date.now(),
      });
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      // Route directly to study plan so learner can review and start their first task
      router.push("/study-plan");
    } catch (err) {
      console.warn("Error saving confirmed plan:", err);
      router.push("/dashboard");
    } finally {
      setIsSaving(false);
    }
  };

  const [clientDate, setClientDate] = useState<Date | null>(null);

  useEffect(() => {
    setClientDate(new Date());
  }, []);

  // Preview schedule calculation for Step 9
  const previewSchedule = useMemo(() => {
    // Stable baseline date for SSR prerender to prevent Next.js dynamic Date() prerender failure
    const dateToUse = clientDate || new Date(2026, 9, 31, 12, 0, 0);
    return buildFullSchedule(
      data,
      {
        dueVocabCount: 5,
        pendingMistakesCount: 3,
        attemptsCount: 0,
      },
      dateToUse
    );
  }, [data, clientDate]);

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6">
      {/* Brand Header */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-[var(--border)]">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <img
            src="/logo.png"
            alt="Lumo IELTS"
            className="w-7 h-7 rounded-lg object-contain shadow-xs shrink-0"
          />
          <span className="font-extrabold text-base tracking-tight text-[var(--foreground)]">
            lumo<span className="text-[var(--primary)]">ielts</span><span className="text-xs text-[var(--muted)] font-bold">.uz</span>
          </span>
        </Link>
        <span className="text-xs text-[var(--muted)] font-medium hidden sm:inline">
          O‘quv Rejasi So‘rovnomasi
        </span>
      </div>

      {/* Top Header & Progress */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--primary)] text-white shadow-xs">
              {step <= 8 ? `Savol ${step} / 8` : "Reja Ko‘rigi"}
            </span>
            <span className="text-xs text-[var(--muted)] font-medium">
              Taxminan 2 daqiqa
            </span>
          </div>

          {step <= 8 && (
            <button
              type="button"
              onClick={() => setShowExitConfirm(true)}
              className="text-xs text-[var(--secondary)] hover:text-[var(--primary)] font-medium transition-colors cursor-pointer"
            >
              Keyinroq to‘ldirish
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[var(--surface-subtle)] border border-[var(--border)] overflow-hidden">
          <div
            className="h-full bg-[var(--primary)] transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, (step / 8) * 100)}%` }}
          />
        </div>
      </div>

      {/* Exit / Skip Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="card max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-[var(--foreground)]">
              So‘rovnomani keyinroq to‘ldirasizmi?
            </h3>
            <p className="text-sm text-[var(--secondary)] leading-relaxed">
              Standart umumiy o‘quv rejasi (kuniga 30 daqiqa, 5 kunlik jadval) faollashtiriladi.
              Istalgan vaqtda <strong>Sozlamalar</strong> orqali o‘zgartirishingiz mumkin.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="btn-secondary text-xs"
              >
                Davom ettirish
              </button>
              <button
                type="button"
                onClick={handleSkipToDefault}
                disabled={isSaving}
                className="btn-primary text-xs"
              >
                {isSaving ? "Saqlanmoqda…" : "Standart reja bilan boshlash"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Form Content */}
      <div className="card p-6 sm:p-8 space-y-6 shadow-sm">
        {/* STEP 1: TARGET BAND */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <span className="eyebrow">1-qadam: Maqsad</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
                Qaysi IELTS baliga erishmoqchisiz?
              </h2>
              <p className="text-xs sm:text-sm text-[var(--secondary)] mt-1">
                Maqsadli balingiz mashqlar murakkabligini to‘g‘ri taqsimlashga yordam beradi.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(["5.5", "6.0", "6.5", "7.0", "7.5", "8.0+", "not_sure"] as TargetBandOption[]).map(
                (band) => {
                  const isSelected = data.targetBand === band;
                  return (
                    <button
                      key={band}
                      type="button"
                      onClick={() => updateData({ targetBand: band })}
                      className={`p-4 rounded-xl border text-center font-bold text-sm transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md scale-102"
                          : "bg-[var(--surface)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--primary)]"
                      }`}
                    >
                      {band === "not_sure" ? "Hozircha aniq emas" : `Band ${band}`}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* STEP 2: CURRENT LEVEL */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <span className="eyebrow">2-qadam: Boshlang‘ich Daraja</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
                Joriy darajangiz haqida nimalarni bilasiz?
              </h2>
              <p className="text-xs sm:text-sm text-[var(--secondary)] mt-1">
                Bu faqat rejalashtirish uchun; tasdiqlangan rasmiy natija sifatida ko‘rilmaydi.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: "official", label: "Rasmiy IELTS natijam bor", desc: "TRF yoki rasmiy test topshirganman" },
                { id: "mock", label: "Mock-test natijam bor", desc: "O‘quv markazi yoki onlayn mock topshirganman" },
                { id: "estimate", label: "O‘z darajamni taxmin qilaman", desc: "Taxminiy umumiy ballimni bilaman" },
                { id: "unknown", label: "Hozircha bilmayman", desc: "Darajamni aniqlash uchun test topshirmaganman" },
              ].map((opt) => {
                const isSelected = data.currentLevelSource === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => updateData({ currentLevelSource: opt.id as LevelSourceOption })}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[var(--surface-subtle)] border-2 border-[var(--primary)] shadow-sm"
                        : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--primary)]"
                    }`}
                  >
                    <p className="font-bold text-sm text-[var(--foreground)]">{opt.label}</p>
                    <p className="text-xs text-[var(--muted)] mt-1">{opt.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Conditional Sub-fields */}
            {(data.currentLevelSource === "official" || data.currentLevelSource === "mock") && (
              <div className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-4">
                <p className="text-xs font-semibold text-[var(--secondary)]">
                  Ixtiyoriy: Ma'lum bo‘lgan ballaringizni kiriting (0–9 gacha, masalan 6.0 yoki 6.5)
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <label className="text-xs">
                    Umumiy (Overall)
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="9"
                      placeholder="6.5"
                      value={data.currentLevelScores?.overall ?? ""}
                      onChange={(e) =>
                        updateData({
                          currentLevelScores: {
                            ...data.currentLevelScores,
                            overall: e.target.value ? parseFloat(e.target.value) : null,
                          },
                        })
                      }
                      className="w-full mt-1 text-center"
                    />
                  </label>
                  <label className="text-xs">
                    Reading
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="9"
                      placeholder="6.0"
                      value={data.currentLevelScores?.reading ?? ""}
                      onChange={(e) =>
                        updateData({
                          currentLevelScores: {
                            ...data.currentLevelScores,
                            reading: e.target.value ? parseFloat(e.target.value) : null,
                          },
                        })
                      }
                      className="w-full mt-1 text-center"
                    />
                  </label>
                  <label className="text-xs">
                    Listening
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="9"
                      placeholder="6.5"
                      value={data.currentLevelScores?.listening ?? ""}
                      onChange={(e) =>
                        updateData({
                          currentLevelScores: {
                            ...data.currentLevelScores,
                            listening: e.target.value ? parseFloat(e.target.value) : null,
                          },
                        })
                      }
                      className="w-full mt-1 text-center"
                    />
                  </label>
                  <label className="text-xs">
                    Writing
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="9"
                      placeholder="5.5"
                      value={data.currentLevelScores?.writing ?? ""}
                      onChange={(e) =>
                        updateData({
                          currentLevelScores: {
                            ...data.currentLevelScores,
                            writing: e.target.value ? parseFloat(e.target.value) : null,
                          },
                        })
                      }
                      className="w-full mt-1 text-center"
                    />
                  </label>
                  <label className="text-xs">
                    Speaking
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="9"
                      placeholder="6.0"
                      value={data.currentLevelScores?.speaking ?? ""}
                      onChange={(e) =>
                        updateData({
                          currentLevelScores: {
                            ...data.currentLevelScores,
                            speaking: e.target.value ? parseFloat(e.target.value) : null,
                          },
                        })
                      }
                      className="w-full mt-1 text-center"
                    />
                  </label>
                </div>
              </div>
            )}

            {data.currentLevelSource === "estimate" && (
              <div className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-2">
                <label className="text-xs">
                  Taxminiy ballingiz (ixtiyoriy)
                  <select
                    value={data.currentLevelScores?.estimatedBand ?? ""}
                    onChange={(e) =>
                      updateData({
                        currentLevelScores: {
                          ...data.currentLevelScores,
                          estimatedBand: e.target.value ? parseFloat(e.target.value) : null,
                        },
                      })
                    }
                    className="w-full mt-1"
                  >
                    <option value="">Tanlang...</option>
                    {[4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0].map((b) => (
                      <option key={b} value={b}>
                        Band {b}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}

            {data.currentLevelSource === "unknown" && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
                💡 Rejangiz tasdiqlangach, istasangiz platformada 15 daqiqalik bepul IELTS diagnostikadan o‘tib, aniq holatingizni bilib olishingiz mumkin bo‘ladi.
              </div>
            )}
          </div>
        )}

        {/* STEP 3: PERCEIVED WEAK SKILLS */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <span className="eyebrow">3-qadam: Zaif Ko‘nikmalar</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
                Qaysi ko‘nikmalar sizga ko‘proq qiyinchilik tug‘diradi?
              </h2>
              <p className="text-xs sm:text-sm text-[var(--secondary)] mt-1">
                Bir nechta variantni tanlashingiz mumkin. Bu ko‘nikmalarga haftalik rejada ustuvorlik beriladi.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: "reading", label: "Reading (O‘qish)", icon: BookOpen },
                { id: "listening", label: "Listening (Tinglash)", icon: Headphones },
                { id: "writing", label: "Writing (Yozish)", icon: PenTool },
                { id: "speaking", label: "Speaking (Gapirish)", icon: Mic },
                { id: "not_sure", label: "Hozircha aniq emas", icon: Sparkles },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = data.perceivedWeakSkills?.includes(item.id as WeakSkillOption);

                const toggleSkill = () => {
                  let updated: WeakSkillOption[];
                  if (item.id === "not_sure") {
                    // Exclusive selection
                    updated = ["not_sure"];
                  } else {
                    const withoutNotSure = (data.perceivedWeakSkills || []).filter(
                      (s): s is SkillCategory => s !== "not_sure"
                    );
                    const targetSkill = item.id as SkillCategory;
                    if (withoutNotSure.includes(targetSkill)) {
                      updated = withoutNotSure.filter((s) => s !== targetSkill);
                    } else {
                      updated = [...withoutNotSure, targetSkill];
                    }
                  }
                  updateData({ perceivedWeakSkills: updated });
                };

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={toggleSkill}
                    className={`p-4 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[var(--surface-subtle)] border-2 border-[var(--primary)] text-[var(--foreground)] shadow-xs"
                        : "bg-[var(--surface)] border-[var(--border)] text-[var(--secondary)] hover:border-[var(--primary)]"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? "text-[var(--primary)]" : "text-[var(--muted)]"}`} />
                    <span className="font-bold text-sm text-[var(--foreground)]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: EXAM TIMELINE */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <span className="eyebrow">4-qadam: Imtihon Rejasi</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
                IELTS imtihonini qachon topshirmoqchisiz?
              </h2>
              <p className="text-xs sm:text-sm text-[var(--secondary)] mt-1">
                Muddat o‘quv jadvalining intensivligini belgilash uchun zarur.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: "within_1_month", label: "1 oy ichida", desc: "Tezkor intensiv tayyorgarlik" },
                { id: "2_to_3_months", label: "2–3 oy ichida", desc: "O‘rtacha muddatli o‘quv rejasi" },
                { id: "3_to_6_months", label: "3–6 oy ichida", desc: "Batafsil fundamental tayyorgarlik" },
                { id: "exact", label: "Aniq sana tanlash", desc: "Imtihon kuni oldindan ma'lum" },
                { id: "not_scheduled", label: "Hali rejalashtirilmagan", desc: "Shoshilmasdan o‘rganish" },
              ].map((opt) => {
                const isSelected = data.examTimelineType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => updateData({ examTimelineType: opt.id as ExamTimelineOption })}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[var(--surface-subtle)] border-2 border-[var(--primary)] shadow-sm"
                        : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--primary)]"
                    }`}
                  >
                    <p className="font-bold text-sm text-[var(--foreground)]">{opt.label}</p>
                    <p className="text-xs text-[var(--muted)] mt-1">{opt.desc}</p>
                  </button>
                );
              })}
            </div>

            {data.examTimelineType === "exact" && (
              <div className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-2">
                <label className="text-xs font-semibold">
                  Imtihon sanasi (kelgusi sana bo‘lishi lozim)
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={data.examDate || ""}
                    onChange={(e) => updateData({ examDate: e.target.value })}
                    className="w-full mt-1"
                  />
                </label>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: DAILY AVAILABLE TIME */}
        {step === 5 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <span className="eyebrow">5-qadam: Kunlik Vaqt</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
                Bir kunda qancha vaqt ajrata olasiz?
              </h2>
              <p className="text-xs sm:text-sm text-[var(--secondary)] mt-1">
                Bu har bir modul uchun emas, kunlik jami o‘quv byudjetingizdir.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { min: 15, label: "15 daqiqa", desc: "Tezkor micro-learning" },
                { min: 30, label: "30 daqiqa", desc: "Tavsiya etiladi (muvozanatli)" },
                { min: 45, label: "45 daqiqa", desc: "Fokuslangan amaliyot" },
                { min: 60, label: "60 daqiqa", desc: "Chuqur va to‘liq mashg‘ulot" },
                { min: 90, label: "90 daqiqa", desc: "Maksimal intensiv tayyorgarlik" },
              ].map((item) => {
                const isSelected = data.dailyStudyMinutes === item.min;
                return (
                  <button
                    key={item.min}
                    type="button"
                    onClick={() => updateData({ dailyStudyMinutes: item.min as DailyTimeOption })}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md"
                        : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--primary)]"
                    }`}
                  >
                    <p className="font-bold text-base">{item.label}</p>
                    <p className={`text-xs mt-1 ${isSelected ? "text-orange-100" : "text-[var(--muted)]"}`}>
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: STUDY DAYS */}
        {step === 6 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <span className="eyebrow">6-qadam: O‘quv Kunlari</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
                Haftaning qaysi kunlari o‘qiy olasiz?
              </h2>
              <p className="text-xs sm:text-sm text-[var(--secondary)] mt-1">
                Kamida 1 kunni tanlang. Belgilanmagan kunlar dam olish kuni bo‘lib, hech qanday jarima yuklanmaydi.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: "mon", label: "Dushanba" },
                { id: "tue", label: "Seshanba" },
                { id: "wed", label: "Chorshanba" },
                { id: "thu", label: "Payshanba" },
                { id: "fri", label: "Juma" },
                { id: "sat", label: "Shanba" },
                { id: "sun", label: "Yakshanba" },
              ].map((day) => {
                const isSelected = data.studyDays?.includes(day.id as WeekdayOption);

                const toggleDay = () => {
                  const current = data.studyDays || [];
                  const updated = isSelected
                    ? current.filter((d) => d !== day.id)
                    : [...current, day.id as WeekdayOption];
                  updateData({ studyDays: updated });
                };

                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={toggleDay}
                    className={`p-3.5 rounded-xl border font-bold text-sm text-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm"
                        : "bg-[var(--surface)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--primary)]"
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 7: SESSION PREFERENCE */}
        {step === 7 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <span className="eyebrow">7-qadam: Dars Taqsimoti</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
                Kunlik vaqtingizni qanday bo‘lishni ma'qul ko‘rasiz?
              </h2>
              <p className="text-xs sm:text-sm text-[var(--secondary)] mt-1">
                Umumiy kunlik vaqtingiz o‘zgarmaydi, faqat vazifalar bir yoki bir nechta qismga ajratiladi.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: "single",
                  label: "Bitta mashg‘ulot",
                  desc: "Bir o‘tirishda to‘liq bajarish (Uzilishlarsiz)",
                },
                {
                  id: "two_sessions",
                  label: "Ikkita qisqa qism",
                  desc: "Masalan: ertalab va kechqurun",
                },
                {
                  id: "multiple_short",
                  label: "Bir nechta kichik qism",
                  desc: "Kun davomida qisqa 5–10 daqiqalik intervallar",
                },
              ].map((opt) => {
                const isSelected = data.sessionPreference === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => updateData({ sessionPreference: opt.id as SessionPreferenceOption })}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[var(--surface-subtle)] border-2 border-[var(--primary)] shadow-sm"
                        : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--primary)]"
                    }`}
                  >
                    <p className="font-bold text-sm text-[var(--foreground)]">{opt.label}</p>
                    <p className="text-xs text-[var(--muted)] mt-1">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 8: SUPPORTING ACTIVITIES */}
        {step === 8 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <span className="eyebrow">8-qadam: Qo‘shimcha Mashg‘ulotlar</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
                Rejangizga qanday faoliyatlar kiritilsin?
              </h2>
              <p className="text-xs sm:text-sm text-[var(--secondary)] mt-1">
                Barcha 4 ta asosiy modul o‘quv dasturida qoladi; bu tanlovlar qo‘shimcha mashqlarni moslashtiradi.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: "vocabulary",
                  label: "Lug‘at takrorlash (Spaced Repetition)",
                  desc: "Intervalli takrorlash orqali yangi so‘zlarni xotirada mustahkamlash",
                },
                {
                  id: "mistakes",
                  label: "Xatolar tahlili (Mistakes Notebook)",
                  desc: "Avval xato qilingan savollarni qayta ishlab tahlil qilish",
                },
                {
                  id: "speaking",
                  label: "Nutq yozib mashq qilish (Speaking Recorder)",
                  desc: "Og‘zaki audio javoblarni yozib o‘z nutqingizni sinash",
                },
                {
                  id: "writing",
                  label: "Yozish mashqlari (Writing Practice)",
                  desc: "Qisqa insho rejalari va tezkor overview yozish mashqlari",
                },
              ].map((opt) => {
                const isSelected = data.supportingActivities?.includes(opt.id as SupportingActivityOption);

                const toggleAct = () => {
                  const current = data.supportingActivities || [];
                  const updated = isSelected
                    ? current.filter((a) => a !== opt.id)
                    : [...current, opt.id as SupportingActivityOption];
                  updateData({ supportingActivities: updated });
                };

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={toggleAct}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[var(--surface-subtle)] border-2 border-[var(--primary)] shadow-xs"
                        : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--primary)]"
                    }`}
                  >
                    <p className="font-bold text-sm text-[var(--foreground)]">{opt.label}</p>
                    <p className="text-xs text-[var(--muted)] mt-1">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 9: PLAN PREVIEW & CONFIRMATION */}
        {step === 9 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-[var(--border)] pb-4">
              <span className="eyebrow">Tayyor Reja</span>
              <h2 className="text-xl sm:text-2xl font-black text-[var(--foreground)] tracking-tight">
                Sizning Shaxsiy O‘quv Rejangiz
              </h2>
              <p className="text-xs sm:text-sm text-[var(--secondary)] mt-1">
                Javoblaringiz asosida yaratilgan haftalik va kunlik reja quyidagicha tuzildi.
              </p>
            </div>

            {/* Rationale explanation card */}
            <div className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-xs text-[var(--foreground)] leading-relaxed flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5" />
              <div>
                <strong className="block mb-1 text-[var(--primary)]">Reja qanday tuzildi?</strong>
                {previewSchedule.today.explanation}
              </div>
            </div>

            {/* Summary parameter badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
                <span className="text-[11px] text-[var(--muted)] block">Maqsad</span>
                <span className="text-sm font-bold text-[var(--foreground)]">
                  {data.targetBand === "not_sure" ? "Aniq emas" : `Band ${data.targetBand}`}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
                <span className="text-[11px] text-[var(--muted)] block">Kunlik Vaqt</span>
                <span className="text-sm font-bold text-[var(--foreground)]">
                  {data.dailyStudyMinutes} daqiqa
                </span>
              </div>
              <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
                <span className="text-[11px] text-[var(--muted)] block">O‘quv Kunlari</span>
                <span className="text-sm font-bold text-[var(--foreground)]">
                  Haftada {data.studyDays.length} kun
                </span>
              </div>
              <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
                <span className="text-[11px] text-[var(--muted)] block">Dars Taqsimoti</span>
                <span className="text-sm font-bold text-[var(--foreground)]">
                  {data.sessionPreference === "single"
                    ? "1 ta qism"
                    : data.sessionPreference === "two_sessions"
                    ? "2 ta qism"
                    : "Qisqa qismlar"}
                </span>
              </div>
            </div>

            {/* 7-Day Calendar Overview */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">
                Haftalik Taqvim Ko‘rinishi
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
                {previewSchedule.weekDays.map((d) => (
                  <div
                    key={d.dayKey}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      d.isStudyDay
                        ? "bg-[var(--surface)] border-[var(--primary)] text-[var(--foreground)] shadow-xs"
                        : "bg-[var(--surface-subtle)] border-[var(--border)] text-[var(--muted)]"
                    }`}
                  >
                    <p className="text-xs font-bold">{d.dayLabelUz.slice(0, 3)}</p>
                    <p className="text-[11px] mt-1 font-semibold">
                      {d.isStudyDay ? `${d.plannedMinutes} min` : "Dam"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Tasks Preview */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">
                {previewSchedule.today.isRestDay ? "Navbatdagi Vazifalar" : "Bugungi Rejalashtirilgan Vazifalar"}
              </h3>

              {previewSchedule.today.isRestDay ? (
                <div className="p-4 rounded-xl border border-dashed border-[var(--border)] text-center text-xs text-[var(--muted)]">
                  Bugun dam olish kuni. Navbatdagi mashg‘ulot kuni reja bo‘yicha amalga oshiriladi.
                </div>
              ) : (
                <div className="space-y-2">
                  {previewSchedule.today.tasks.map((task, idx) => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-xs font-bold text-[var(--foreground)]">
                          {idx + 1}. {task.title}
                        </p>
                        <p className="text-[11px] text-[var(--muted)] mt-0.5">{task.reason}</p>
                      </div>
                      <span className="text-xs font-bold text-[var(--primary)] whitespace-nowrap">
                        ⏱ {task.duration} min
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Validation Error Message */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="btn-secondary text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Orqaga
            </button>
          ) : (
            <div />
          )}

          {step < 9 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              Davom etish <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-secondary text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Javoblarni tahrirlash
              </button>
              <button
                type="button"
                onClick={handleConfirmPlan}
                disabled={isSaving}
                className="btn-primary text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                {isSaving ? "Saqlanmoqda…" : "Rejani tasdiqlash va boshlash"} <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
