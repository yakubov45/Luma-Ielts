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
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import {
  fetchTodayStudyPlan,
  toggleTaskCompletion,
  DayStudyPlan,
} from "@/lib/services/study-plan-service";

export default function StudyPlanPage() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<DayStudyPlan | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPlan = async () => {
    setLoading(true);
    const data = await fetchTodayStudyPlan(user?.uid);
    setPlan(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPlan();
  }, [user?.uid]);

  const handleToggle = async (taskId: string) => {
    const updated = await toggleTaskCompletion(user?.uid, taskId);
    setPlan(updated);
  };

  const tasks = plan?.tasks || [];
  const completedMinutes = plan?.completedMinutes || 0;
  const totalMinutes = plan?.totalMinutes || 30;
  const percentComplete = Math.min(100, Math.round((completedMinutes / totalMinutes) * 100));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="eyebrow">Kunlik O‘quv Rejasi</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
            Daily Study Schedule
          </h1>
          <p className="text-sm text-[var(--secondary)] mt-0.5">
            Har kuni 30 daqiqa aniq maqsadli amaliyot.
          </p>
        </div>

        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
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
      </div>

      {loading ? (
        <div className="card p-12 text-center text-sm text-[var(--muted)]">
          Kunlik reja yuklanmoqda…
        </div>
      ) : (
        <>
          {/* Today's Tasks Checklist */}
          <div className="card p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h2 className="text-base font-bold text-[var(--foreground)]">Bugungi Vazifalar</h2>
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
                      className="mt-0.5 cursor-pointer text-[var(--primary)]"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
                      ) : (
                        <Circle className="w-5 h-5 text-[var(--muted)] hover:text-[var(--primary)]" />
                      )}
                    </button>
                    <div>
                      <h3
                        className={`text-sm font-bold text-[var(--foreground)] ${
                          task.completed ? "line-through text-[var(--muted)]" : ""
                        }`}
                      >
                        {task.title}
                      </h3>
                      <p className="text-xs text-[var(--muted)] mt-0.5">{task.description}</p>
                      <span className="text-[11px] font-semibold text-[var(--secondary)] mt-1 inline-block">
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

          {/* Weekly Schedule Row */}
          <div className="card p-6 space-y-4">
            <h2 className="text-base font-bold text-[var(--foreground)]">Haftalik Reja Taqvimi</h2>

            <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
              {[
                { day: "Dus", min: 30, active: true },
                { day: "Ses", min: 30, active: false },
                { day: "Cho", min: 30, active: false },
                { day: "Pay", min: 30, active: false },
                { day: "Jum", min: 30, active: false },
                { day: "Sha", min: 30, active: false },
                { day: "Yak", min: 30, active: false },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    item.active
                      ? "bg-[var(--nav-active-bg)] border-[var(--primary)] text-[var(--nav-active-text)] font-bold shadow-xs"
                      : "bg-[var(--surface-subtle)] border-[var(--border)] text-[var(--muted)]"
                  }`}
                >
                  <p className="text-xs font-semibold">{item.day}</p>
                  <p className="text-xs mt-1 tabular">{item.min} min</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
