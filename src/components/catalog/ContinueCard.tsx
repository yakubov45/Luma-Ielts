"use client";

import Link from "next/link";
import { ArrowRight, Clock, Play, RotateCcw, Sparkles } from "lucide-react";

interface ContinueCardProps {
  title: string;
  subtitle: string;
  progressPercent?: number;
  durationLabel?: string;
  badgeText?: string;
  actionHref?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export function ContinueCard({
  title,
  subtitle,
  progressPercent,
  durationLabel,
  badgeText = "Jarayonda",
  actionHref,
  onAction,
  actionLabel = "Davom ettirish",
}: ContinueCardProps) {
  const content = (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-[var(--surface-subtle)] to-[var(--surface)] border-2 border-[var(--primary)]/30 hover:border-[var(--primary)] transition-all shadow-sm group">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--primary)] text-white shadow-xs">
            <Sparkles className="w-3 h-3" />
            Oxirgi mashg‘ulot
          </span>
          <span className="text-[11px] font-semibold text-[var(--muted)]">
            {badgeText}
          </span>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
            {title}
          </h3>
          <p className="text-xs text-[var(--secondary)] mt-0.5 line-clamp-1">
            {subtitle}
          </p>
        </div>

        {durationLabel && (
          <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {durationLabel}
            </span>
            {progressPercent !== undefined && (
              <span className="font-semibold text-[var(--primary)]">
                {progressPercent}% bajarildi
              </span>
            )}
          </div>
        )}
      </div>

      <div className="shrink-0 flex items-center gap-2">
        {actionHref ? (
          <Link
            href={actionHref}
            className="btn-primary !py-2.5 !px-5 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm whitespace-nowrap cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="btn-primary !py-2.5 !px-5 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm whitespace-nowrap cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </div>
    </div>
  );

  return content;
}
