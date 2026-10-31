"use client";

import { AlertCircle, FilterX, BookmarkX, RotateCcw } from "lucide-react";

interface EmptyCatalogStateProps {
  type?: "no_results" | "no_saved" | "no_submissions";
  onReset?: () => void;
  title?: string;
  description?: string;
}

export function EmptyCatalogState({
  type = "no_results",
  onReset,
  title,
  description,
}: EmptyCatalogStateProps) {
  let defaultTitle = "Natijalar topilmadi";
  let defaultDesc = "Tanlangan filtrlar yoki qidiruv so‘rovi bo‘yicha hech qanday mashq topilmadi.";
  let Icon = FilterX;

  if (type === "no_saved") {
    defaultTitle = "Saqlangan mashqlar yo‘q";
    defaultDesc = "Siz hali hech qanday mashg‘ulotni saqlab qo‘ymagansiz. Kartaning burchagidagi xatcho‘p tugmasi orqali saqlashingiz mumkin.";
    Icon = BookmarkX;
  } else if (type === "no_submissions") {
    defaultTitle = "Topshirilgan insholar yo‘q";
    defaultDesc = "Siz hali insho topshirmagansiz. Biror mavzuni tanlab, yozishni boshlang.";
    Icon = AlertCircle;
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-[var(--surface)] border border-dashed border-[var(--border)] space-y-4 my-6">
      <div className="w-12 h-12 rounded-2xl bg-[var(--surface-subtle)] text-[var(--muted)] flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>

      <div className="space-y-1 max-w-md">
        <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)]">
          {title || defaultTitle}
        </h3>
        <p className="text-xs sm:text-sm text-[var(--secondary)] leading-relaxed">
          {description || defaultDesc}
        </p>
      </div>

      {onReset && (
        <button
          onClick={onReset}
          className="btn-secondary !py-2 !px-4 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Barcha mashqlarni ko‘rish</span>
        </button>
      )}
    </div>
  );
}
