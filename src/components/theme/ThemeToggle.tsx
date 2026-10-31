"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./theme-provider";

interface ThemeToggleProps {
  variant?: "icon" | "segmented";
  className?: string;
}

export function ThemeToggle({ variant = "icon", className = "" }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Avoid layout shift during hydration
    return (
      <div
        className={`w-9 h-9 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] ${className}`}
        aria-hidden="true"
      />
    );
  }

  if (variant === "segmented") {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] gap-1 ${className}`}
        role="group"
        aria-label="Mavzu tanlash"
      >
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            theme === "light"
              ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs border border-[var(--border)]"
              : "text-[var(--secondary)] hover:text-[var(--foreground)]"
          }`}
          title="Yorug‘ rejim"
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Yorug‘</span>
        </button>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            theme === "dark"
              ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs border border-[var(--border)]"
              : "text-[var(--secondary)] hover:text-[var(--foreground)]"
          }`}
          title="Qora rejim (Dark mode)"
        >
          <Moon className="w-3.5 h-3.5 text-indigo-400" />
          <span>Qorong‘i</span>
        </button>
        <button
          type="button"
          onClick={() => setTheme("system")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            theme === "system"
              ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs border border-[var(--border)]"
              : "text-[var(--secondary)] hover:text-[var(--foreground)]"
          }`}
          title="Tizim sozlamasi"
        >
          <Monitor className="w-3.5 h-3.5 text-[var(--muted)]" />
          <span>Tizim</span>
        </button>
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Yorug‘ rejimga o‘tish" : "Qora rejimga o‘tish (Dark mode)"}
      title={isDark ? "Yorug‘ rejimga o‘tish" : "Qora rejimga o‘tish (Dark mode)"}
      className={`p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-[var(--foreground)] transition-all cursor-pointer flex items-center justify-center relative shadow-xs hover:border-[var(--primary)]/50 group ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
}
