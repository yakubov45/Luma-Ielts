"use client";

import React, { useState } from "react";
import { MapPin, Flag, CheckCircle2, XCircle, HelpCircle } from "lucide-react";

export interface MapTarget {
  id: string; // e.g. "q11"
  num: number;
  label: string; // e.g. "Fitness Suite"
  acceptedLetter: string; // e.g. "B"
  xPercent: number; // 0 to 100 relative coordinate
  yPercent: number; // 0 to 100 relative coordinate
}

export interface MapOption {
  letter: string; // "A", "B", "C"...
  label: string;  // "Main Hall", "Reception"...
  xPercent: number;
  yPercent: number;
}

export interface MapDiagramLabellingProps {
  title: string;
  instructions?: string;
  targets: MapTarget[];
  options: MapOption[];
  answers: Record<string, string>;
  onAnswerChange: (targetId: string, letter: string) => void;
  flags?: Record<string, boolean>;
  onToggleFlag?: (targetId: string) => void;
  showResults?: boolean;
  disabled?: boolean;
}

export function MapDiagramLabelling({
  title,
  instructions = "Label the map below. Choose the correct letter (A–H) for each location.",
  targets,
  options,
  answers,
  onAnswerChange,
  flags = {},
  onToggleFlag,
  showResults = false,
  disabled = false,
}: MapDiagramLabellingProps) {
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(targets[0]?.id || null);

  const handleSelectOptionForActive = (letter: string) => {
    if (disabled || !selectedTargetId) return;
    onAnswerChange(selectedTargetId, letter);
  };

  return (
    <div className="space-y-6 card p-5 md:p-7 border border-[var(--border)] bg-[var(--surface)] rounded-3xl shadow-xs">
      {/* Title & Instructions */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4 text-[var(--primary)]" />
          <span className="eyebrow !mb-0">Map & Plan Labelling</span>
        </div>
        <h3 className="text-lg md:text-xl font-extrabold text-[var(--foreground)] tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-[var(--secondary)] mt-1 leading-relaxed">
          {instructions}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 1. Interactive Vector Map Area (7 cols on large) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="relative w-full aspect-[4/3] rounded-2xl bg-amber-50/50 dark:bg-stone-900/60 border-2 border-[var(--border)] overflow-hidden shadow-inner select-none">
            {/* Architectural Grid & Campus Elements (Vector SVG) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 400 300"
            >
              {/* Floorplan walls & paths */}
              <rect x="20" y="20" width="360" height="260" rx="12" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--border)]" />
              <rect x="30" y="30" width="160" height="110" rx="6" fill="currentColor" className="text-[var(--surface-subtle)] opacity-70" />
              <rect x="210" y="30" width="160" height="110" rx="6" fill="currentColor" className="text-[var(--surface-subtle)] opacity-70" />
              <rect x="30" y="160" width="160" height="110" rx="6" fill="currentColor" className="text-[var(--surface-subtle)] opacity-70" />
              <rect x="210" y="160" width="160" height="110" rx="6" fill="currentColor" className="text-[var(--surface-subtle)] opacity-70" />

              {/* Corridor / Walkways */}
              <line x1="20" y1="145" x2="380" y2="145" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="text-[var(--muted)] opacity-50" />
              <line x1="200" y1="20" x2="200" y2="280" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="text-[var(--muted)] opacity-50" />

              {/* Entrance indicator */}
              <text x="200" y="295" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor" className="text-[var(--muted)] uppercase tracking-wider">
                ▲ Main Entrance
              </text>
            </svg>

            {/* Positional Letter Markers (A, B, C...) */}
            {options.map((opt) => {
              const isAssigned = Object.values(answers).includes(opt.letter);
              return (
                <button
                  key={opt.letter}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelectOptionForActive(opt.letter)}
                  style={{ left: `${opt.xPercent}%`, top: `${opt.yPercent}%` }}
                  title={`${opt.letter}: ${opt.label}`}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full font-black text-xs flex items-center justify-center transition-all cursor-pointer shadow-md focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)] ${
                    isAssigned
                      ? "bg-[var(--primary)] text-white scale-110 ring-4 ring-[var(--primary)]/20"
                      : "bg-[var(--surface)] text-[var(--foreground)] border-2 border-[var(--border)] hover:border-[var(--primary)] hover:scale-105"
                  }`}
                >
                  {opt.letter}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[var(--muted)] px-1">
            <span>Xaritadagi harfni bosing yoki o‘ng tomondan tanlang.</span>
            <span>A–H belgilari</span>
          </div>
        </div>

        {/* 2. Accessible Question & Select List (5 cols on large) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold text-[var(--secondary)] block uppercase tracking-wider">
            Savollar (Questions {targets[0]?.num}–{targets[targets.length - 1]?.num})
          </span>

          <div className="space-y-2.5">
            {targets.map((target) => {
              const currentVal = answers[target.id] || "";
              const isSelected = selectedTargetId === target.id;
              const isFlagged = flags[target.id] || false;
              const isCorrect = showResults && currentVal.toUpperCase() === target.acceptedLetter.toUpperCase();

              return (
                <div
                  key={target.id}
                  onClick={() => setSelectedTargetId(target.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "border-[var(--primary)] bg-orange-50/40 dark:bg-orange-950/20 ring-1 ring-[var(--primary)]"
                      : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  {/* Left: Question Number and Label */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-[var(--nav-active-bg)] text-[var(--nav-active-text)] text-xs font-black flex items-center justify-center shrink-0">
                      {target.num}
                    </span>
                    <span className="text-xs font-bold text-[var(--foreground)] truncate">
                      {target.label}
                    </span>
                  </div>

                  {/* Right: Dropdown / Assigned Letter */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Accessible Native Select for Screen Readers / Keyboard */}
                    <select
                      value={currentVal}
                      disabled={disabled}
                      onChange={(e) => onAnswerChange(target.id, e.target.value)}
                      aria-label={`Question ${target.num} ${target.label}`}
                      className="px-2.5 py-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-bold text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
                    >
                      <option value="">Tanlang...</option>
                      {options.map((opt) => (
                        <option key={opt.letter} value={opt.letter}>
                          {opt.letter}
                        </option>
                      ))}
                    </select>

                    {/* Result indicator */}
                    {showResults && (
                      <span className="shrink-0">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        )}
                      </span>
                    )}

                    {/* Flag button */}
                    {onToggleFlag && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFlag(target.id);
                        }}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isFlagged
                            ? "text-[var(--accent-orange)] bg-orange-50 dark:bg-orange-950/40"
                            : "text-[var(--muted)] hover:text-[var(--foreground)]"
                        }`}
                        title="Savolni belgilash (Flag)"
                      >
                        <Flag className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
