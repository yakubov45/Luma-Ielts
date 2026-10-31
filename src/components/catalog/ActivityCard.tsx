"use client";

import Link from "next/link";
import {
  Clock,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Bookmark,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
} from "lucide-react";
import { useState, useEffect } from "react";
import { isBookmarked, toggleBookmark } from "@/lib/services/bookmarks-service";

export interface ActivityCardData {
  id: string;
  skill: "reading" | "listening" | "writing" | "speaking";
  title: string;
  topic?: string;
  typeBadge: string;
  typeBadgeColor?: "primary" | "indigo" | "emerald" | "amber" | "purple";
  itemCountLabel?: string; // e.g. "3 ta matn · 40 savol"
  durationMinutes: number;
  status: "not_started" | "in_progress" | "completed";
  bestBand?: number;
  accuracy?: number;
  actionHref?: string;
  onAction?: () => void;
  actionLabel?: string;
  tags?: string[];
}

export function ActivityCard({ item }: { item: ActivityCardData }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isBookmarked(item.id));
    const onSync = () => setSaved(isBookmarked(item.id));
    window.addEventListener("ielts-bookmarks-updated", onSync);
    return () => window.removeEventListener("ielts-bookmarks-updated", onSync);
  }, [item.id]);

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextSaved = toggleBookmark({
      id: item.id,
      skill: item.skill,
      title: item.title,
    });
    setSaved(nextSaved);
  };

  const getBadgeStyle = (color?: ActivityCardData["typeBadgeColor"]) => {
    switch (color) {
      case "emerald":
        return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/60";
      case "indigo":
        return "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200/60";
      case "amber":
        return "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/60";
      case "purple":
        return "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200/60";
      default:
        return "bg-orange-50 dark:bg-orange-950/40 text-[var(--primary)] border-orange-200/60";
    }
  };

  const defaultActionLabel =
    item.status === "completed"
      ? "Natijani ko‘rish"
      : item.status === "in_progress"
      ? "Davom ettirish"
      : "Boshlash";

  const actionLabel = item.actionLabel || defaultActionLabel;

  return (
    <div className="card p-5 flex flex-col justify-between gap-4 border border-[var(--border)] hover:border-[var(--primary)]/50 hover:shadow-md transition-all group relative bg-[var(--surface)] rounded-2xl">
      {/* Top Header: Badge, Topic & Bookmark */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-wide ${getBadgeStyle(
                item.typeBadgeColor
              )}`}
            >
              {item.typeBadge}
            </span>
            {item.topic && (
              <span className="text-[11px] font-medium text-[var(--muted)]">
                • {item.topic}
              </span>
            )}
          </div>

          <button
            onClick={handleBookmarkToggle}
            title={saved ? "Saqlangandan o‘chirish" : "Mashqni saqlash"}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              saved
                ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-600 dark:text-amber-400"
                : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-subtle)]"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-base font-bold text-[var(--foreground)] tracking-tight group-hover:text-[var(--primary)] transition-colors line-clamp-2">
            {item.title}
          </h3>
          {item.itemCountLabel && (
            <p className="text-xs text-[var(--secondary)] mt-1">
              {item.itemCountLabel}
            </p>
          )}
        </div>
      </div>

      {/* Middle Status / Score row */}
      <div className="pt-3 border-t border-[var(--border)]/70 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-[var(--muted)]">
          <Clock className="w-3.5 h-3.5" />
          <span className="tabular">{item.durationMinutes} daqiqa</span>
        </div>

        <div>
          {item.status === "completed" && item.bestBand !== undefined ? (
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200/50">
              <Award className="w-3 h-3" />
              <span>Band {item.bestBand.toFixed(1)}</span>
            </div>
          ) : item.status === "in_progress" ? (
            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold text-[11px] bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200/50">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Jarayonda</span>
            </div>
          ) : (
            <span className="text-[11px] font-medium text-[var(--muted)]">
              Boshlanmagan
            </span>
          )}
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-1">
        {item.actionHref ? (
          <Link
            href={item.actionHref}
            className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              item.status === "completed"
                ? "bg-[var(--surface-subtle)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--surface)] hover:border-[var(--primary)]"
                : "btn-primary shadow-xs"
            }`}
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <button
            onClick={item.onAction}
            className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              item.status === "completed"
                ? "bg-[var(--surface-subtle)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--surface)] hover:border-[var(--primary)]"
                : "btn-primary shadow-xs"
            }`}
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </div>
    </div>
  );
}
