"use client";

import { LucideIcon } from "lucide-react";

interface CatalogHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  stats?: Array<{ label: string; value: string | number }>;
  actions?: React.ReactNode;
}

export function CatalogHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  stats,
  actions,
}: CatalogHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="w-6 h-6 rounded-md bg-[var(--primary)] text-white flex items-center justify-center shrink-0">
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
          <span className="eyebrow">{eyebrow}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-[var(--foreground)] tracking-tight">
          {title}
        </h1>
        <p className="text-xs md:text-sm text-[var(--secondary)] max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {stats && stats.length > 0 && (
          <div className="flex items-center gap-2 sm:gap-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3.5 py-2">
            {stats.map((stat, i) => (
              <div key={i} className="text-center sm:text-right">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)] block">
                  {stat.label}
                </span>
                <span className="text-sm sm:text-base font-black text-[var(--foreground)]">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        )}
        {actions}
      </div>
    </div>
  );
}
