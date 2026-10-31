"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  BookOpen,
  Languages,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Settings,
  Coffee,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import {
  fetchTodayStudyPlan,
  fetchWeeklySchedule,
  fetchQuestionnairePreferences,
  toggleTaskCompletion,
  DayStudyPlan,
} from "@/lib/services/study-plan-service";
import { WeekDaySummary, QuestionnaireData } from "@/lib/types/study-plan";

export default function StudyPlanPage() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<DayStudyPlan | null>(null);
  const [weekSchedule, setWeekSchedule] = useState<WeekDaySummary[]>([]);
  const [preferences, setPreferences] = useState<QuestionnaireData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [planData, weekData, prefs] = await Promise.all([
      fetchTodayStudyPlan(user?.uid),
      fetchWeeklySchedule(user?.uid),
      fetchQuestionnairePreferences(user?.uid),
    ]);
    setPlan(planData);
    setWeekSchedule(weekData);
    setPreferences(prefs);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user?.uid]);

  const handleToggle = async (taskId: string) => {
    const updated = await toggleTaskCompletion(user?.uid, taskId);
    setPlan(updated);
  };

  const tasks = plan?.tasks || [];
  const completedMinutes = plan?.completedMinutes || 0;
  const totalMinutes = plan?.totalMinutes || preferences?.dailyStudyMinutes || 30;
  const percentComplete =
    totalMinutes > 0 ? Math.min(100, Math.round((completedMinutes / totalMinutes) * 100)) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2">
            <span className="eyebrow">Shaxsiy O‘quv Rejasi</span>
            {preferences?.isDefaultPlan && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                Standart reja
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
            Daily Study Schedule
          </h1>
          <p className="text-sm text-[var(--secondary)] mt-0.5">
            {preferences?.targetBand && preferences.targetBand !== "not_sure"
              ? `Maqsad: Band ${preferences.targetBand} • `
              : ""}
            Kunlik reja: {preferences?.dailyStudyMinutes || 30} daqiqa (Haftada {preferences?.studyDays?.length || 5} kun).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/onboarding"
            className="btn-secondary text-xs !py-2 !px-3.5 inline-flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" /> Rejani o‘zgartirish
          </Link>

          {!plan?.isRestDay && (
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
              <Clock className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-sm font-bold text-[var(--foreground)] tabular">
                {completedMinutes} / {totalMinutes} daqiqa
              </span>
              <div className="w-16 h-2 rounded-full bg-[var(--surface-subtle)] border border-[var(--border)] overflow-hidden">
                <div
                  className="h-full bg-[var(--primary)] rounded-full transition-all"
                  style={{ width: `${percentComplete}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="card p-12 text-center text-sm text-[var(--muted)]">
          Kunlik o‘quv rejasi yuklanmoqda…
        </div>
      ) : (
        <>
          {/* Explanation / Rationale Banner */}
          {plan?.explanation && (
            <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--foreground)] flex items-start gap-3 shadow-xs">
              <Sparkles className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[var(--primary)] font-bold block mb-0.5">Reja asoslanishi:</strong>
                <p className="text-[var(--secondary)] leading-relaxed">{plan.explanation}</p>
              </div>
            </div>
          )}

          {/* Rest Day State */}
          {plan?.isRestDay ? (
            <div className="card p-8 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Coffee className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h2 className="text-lg font-bold text-[var(--foreground)]">Bugun Dam Olish Kuni</h2>
                <p className="text-xs text-[var(--secondary)] leading-relaxed">
                  Sizning haftalik jadvalingiz bo‘yicha bugun mashg‘ulot belgilanmagan. O‘rganilgan mavzularni miyada tartibga solish uchun dam olish ham o‘qishning bir qismidir.
                </p>
                {plan.nextScheduledDateKey && (
                  <p className="text-xs font-semibold text-[var(--primary)] pt-1">
                    Navbatdagi o‘quv kuni: {plan.nextScheduledDateKey}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Link
                  href="/reading"
                  className="btn-secondary text-xs inline-flex items-center gap-1.5"
                >
                  Ixtiyoriy yengil mashq bajarish <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            /* Active Day Task Checklist */
            <div className="card p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <div>
                  <h2 className="text-base font-bold text-[var(--foreground)]">Bugungi Vazifalar</h2>
                  <p className="text-xs text-[var(--muted)]">
                    Vazifani tugatgach, belgini bosing yoki bevosita mashq sahifasiga o‘ting.
                  </p>
                </div>
                <span className="text-xs text-[var(--muted)] font-semibold">
                  {tasks.filter((t) => t.completed).length} / {tasks.length} bajarildi
                </span>
              </div>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      task.completed
                        ? "bg-[var(--surface-subtle)] border-[var(--border)] opacity-85"
                        : "bg-[var(--surface)] border-2 border-[var(--border)] hover:border-[var(--primary)]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggle(task.id)}
                        className="mt-0.5 cursor-pointer text-[var(--primary)] shrink-0"
                        title={task.completed ? "Bajarilmagan deb belgilash" : "Bajarildi deb belgilash"}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
                        ) : (
                          <Circle className="w-5 h-5 text-[var(--muted)] hover:text-[var(--primary)]" />
                        )}
                      </button>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`text-sm font-bold text-[var(--foreground)] ${
                              task.completed ? "line-through text-[var(--muted)]" : ""
                            }`}
                          >
                            {task.title}
                          </h3>
                          {task.sessionIndex && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--secondary)]">
                              {task.sessionIndex}-qism
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--muted)]">{task.description}</p>
                        <p className="text-[11px] text-[var(--primary)] font-medium">
                          💡 Sabab: {task.reason}
                        </p>
                        <span className="text-[11px] font-semibold text-[var(--secondary)] inline-block">
                          ⏱ {task.duration} daqiqa
                        </span>
                      </div>
                    </div>

                    <Link
                      href={task.link}
                      className={`btn-secondary text-xs !py-2 !px-3.5 whitespace-nowrap self-end sm:self-center ${
                        task.completed ? "opacity-60" : ""
                      }`}
                    >
                      Bajarish <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weekly Schedule Row */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <h2 className="text-base font-bold text-[var(--foreground)]">Haftalik O‘quv Taqvimi</h2>
                <p className="text-xs text-[var(--muted)]">
                  Tanlangan o‘quv kunlaringiz bo‘yicha umumiy reja taqsimoti.
                </p>
              </div>
              <span className="text-xs text-[var(--muted)] font-semibold">
                {weekSchedule.filter((d) => d.isStudyDay).length} ta faol kun
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
              {weekSchedule.map((item) => (
                <div
                  key={item.dayKey}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    item.isToday
                      ? "ring-2 ring-[var(--primary)] bg-[var(--surface)] text-[var(--foreground)] font-bold shadow-sm"
                      : item.isStudyDay
                      ? "bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)]"
                      : "bg-[var(--surface-subtle)] border-[var(--border)] text-[var(--muted)] opacity-60"
                  }`}
                >
                  <p className="text-xs font-bold">{item.dayLabelUz.slice(0, 3)}</p>
                  <p className="text-xs mt-1 tabular font-semibold">
                    {item.isStudyDay ? `${item.plannedMinutes} min` : "Dam olish"}
                  </p>
                  <p className="text-[10px] text-[var(--muted)] mt-1 truncate">
                    {item.primaryFocus}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
