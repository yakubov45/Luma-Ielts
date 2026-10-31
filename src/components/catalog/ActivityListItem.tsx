"use client";

import Link from "next/link";
import {
  Clock,
  Bookmark,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { isBookmarked, toggleBookmark } from "@/lib/services/bookmarks-service";
import { ActivityCardData } from "./ActivityCard";

interface ActivityListItemProps {
  item: ActivityCardData;
  index: number;
}

export function ActivityListItem({ item, index }: ActivityListItemProps) {
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
    <div className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)]/60 hover:shadow-md transition-all">
      {/* Left: Index Box + Title & Metas */}
      <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
        {/* Index Number Badge */}
        <div className="w-10 h-10 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--muted)] group-hover:text-[var(--primary)] group-hover:border-[var(--primary)]/40 font-black text-xs sm:text-sm flex items-center justify-center shrink-0 transition-colors">
          {(index + 1).toString().padStart(2, "0")}
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          {/* Metadata Chips Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold border tracking-wide uppercase ${getBadgeStyle(
                item.typeBadgeColor
              )}`}
            >
              {item.typeBadge}
            </span>

            {item.topic && (
              <span className="text-[11px] font-medium text-[var(--secondary)] truncate">
                • {item.topic}
              </span>
            )}

            <span className="flex items-center gap-1 text-[11px] font-medium text-[var(--muted)]">
              <Clock className="w-3 h-3" />
              {item.durationMinutes} daqiqa
            </span>

            {item.itemCountLabel && (
              <span className="text-[11px] text-[var(--muted)] hidden sm:inline">
                • {item.itemCountLabel}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors truncate">
            {item.title}
          </h3>
        </div>
      </div>

      {/* Right: Status/Score + Bookmark + Primary Action Button */}
      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[var(--border)]/70">
        {/* User Status / Score Badge */}
        <div className="min-w-[90px] text-left md:text-right">
          {item.status === "completed" && item.bestBand !== undefined ? (
            <div className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-black text-xs bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-300/50">
              <Award className="w-3.5 h-3.5" />
              <span>Band {item.bestBand.toFixed(1)}</span>
            </div>
          ) : item.status === "in_progress" ? (
            <div className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold text-xs bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-lg border border-amber-300/50">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Jarayonda</span>
            </div>
          ) : (
            <span className="text-xs font-semibold text-[var(--muted)]">
              Boshlanmagan
            </span>
          )}
        </div>

        {/* Bookmark Icon Button */}
        <button
          onClick={handleBookmarkToggle}
          title={saved ? "Saqlangandan o‘chirish" : "Mashqni saqlash"}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            saved
              ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-600 dark:text-amber-400 shadow-xs"
              : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-subtle)]"
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
        </button>

        {/* Action Button */}
        {item.actionHref ? (
          <Link
            href={item.actionHref}
            className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
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
            className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
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
