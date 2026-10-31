"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, CheckCircle2, Filter, BookOpen } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { fetchUserMistakes, toggleMistakeStatus, Mistake } from "@/lib/services/mistakes-service";

export default function MistakesPage() {
  const { user } = useAuth();
  const [filterType, setFilterType] = useState<string>("all");
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const list = await fetchUserMistakes(user?.uid);
    setMistakes(list);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user?.uid]);

  const handleToggle = async (id: string, currentStatus: "pending" | "reviewed") => {
    const nextStatus = await toggleMistakeStatus(user?.uid, id, currentStatus);
    setMistakes((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: nextStatus } : m))
    );
  };

  const filtered = mistakes.filter((m) => {
    if (filterType === "all") return true;
    if (filterType === "pending") return m.status === "pending";
    if (filterType === "reviewed") return m.status === "reviewed";
    return m.questionType.toLowerCase().includes(filterType.toLowerCase());
  });

  const pendingCount = mistakes.filter((m) => m.status === "pending").length;
  const reviewedCount = mistakes.filter((m) => m.status === "reviewed").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="eyebrow">Xatolar Daftari</span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
          Mistake Notebook
        </h1>
        <p className="text-sm text-[var(--secondary)] mt-0.5">
          Qilingan har bir xato — keyingi ballingiz uchun eng qimmatli dars.
        </p>
      </div>

      {/* Filter Tabs (design.md Section 10) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] pb-3">
        <button
          onClick={() => setFilterType("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            filterType === "all"
              ? "bg-[var(--nav-active-bg)] text-[var(--nav-active-text)]"
              : "text-[var(--secondary)] hover:bg-[var(--surface-subtle)]"
          }`}
        >
          Barchasi ({mistakes.length})
        </button>
        <button
          onClick={() => setFilterType("pending")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            filterType === "pending"
              ? "bg-[var(--nav-active-bg)] text-[var(--nav-active-text)]"
              : "text-[var(--secondary)] hover:bg-[var(--surface-subtle)]"
          }`}
        >
          Kutilayotgan ({pendingCount})
        </button>
        <button
          onClick={() => setFilterType("reviewed")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            filterType === "reviewed"
              ? "bg-[var(--nav-active-bg)] text-[var(--nav-active-text)]"
              : "text-[var(--secondary)] hover:bg-[var(--surface-subtle)]"
          }`}
        >
          Tahlil qilingan ({reviewedCount})
        </button>
      </div>

      {/* Mistakes List */}
      {loading ? (
        <div className="card p-12 text-center text-sm text-[var(--muted)]">
          Xatolar daftari yuklanmoqda…
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-[var(--success)] mx-auto" />
          <h3 className="font-bold text-base text-[var(--foreground)]">
            Hozircha xatoliklar mavjud emas!
          </h3>
          <p className="text-xs text-[var(--muted)]">
            Yangi Reading yoki Listening mashqlarini bajarganingizda noto‘g‘ri javoblar avtomatik shu yerda tahlil uchun jamlanadi.
          </p>
          <div className="pt-3">
            <Link href="/reading" className="btn-primary text-xs !py-2 !px-4">
              Reading mashqini boshlash →
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`card p-6 space-y-4 transition-all ${
                item.status === "reviewed" ? "opacity-85 border-[var(--border)]" : "border-2 border-[var(--border)]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-[var(--surface-subtle)] text-xs font-bold text-[var(--muted)] uppercase">
                    {item.skill}
                  </span>
                  <span className="text-xs font-bold text-[var(--primary)]">
                    {item.questionType}
                  </span>
                  <span className="text-xs text-[var(--muted)]">· {item.drillTitle}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      item.status === "reviewed"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {item.status === "reviewed" ? "✓ Tahlil qilindi" : "⏳ Qayta ko‘rish kerak"}
                  </span>
                </div>
              </div>

              {/* Question text */}
              <p className="font-bold text-sm md:text-base text-[var(--foreground)] leading-relaxed">
                {item.prompt}
              </p>

              {/* Answer comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-800 space-y-1">
                  <p className="font-bold text-[11px] text-rose-600">Sizning javobingiz:</p>
                  <p className="font-semibold">{item.yourAnswer}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-800 space-y-1">
                  <p className="font-bold text-[11px] text-emerald-600">To‘g‘ri javob:</p>
                  <p className="font-semibold">{item.correctAnswer}</p>
                </div>
              </div>

              {/* Explanation / Reason */}
              {item.reason && (
                <div className="p-3.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-xs text-[var(--secondary)] space-y-1">
                  <p className="font-bold text-[var(--foreground)]">Nima uchun noto‘g‘ri bo‘ldi?</p>
                  <p className="leading-relaxed">{item.reason}</p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => handleToggle(item.id, item.status)}
                  className="text-xs text-[var(--secondary)] hover:text-[var(--primary)] font-semibold underline cursor-pointer"
                >
                  {item.status === "reviewed" ? "Kutilayotganlarga qaytarish" : "Tahlil qilindi deb belgilash"}
                </button>

                <Link
                  href={`/reading/${item.drillId}`}
                  className="btn-primary text-xs !py-2 !px-4 shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  Mashqni qayta ishlash
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
