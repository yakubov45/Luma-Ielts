"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  LayoutList,
  LayoutGrid,
  Bookmark,
  Check,
  RotateCcw,
} from "lucide-react";

export type StatusFilter = "all" | "not_started" | "in_progress" | "completed" | "saved";
export type LengthFilter = "all" | "short" | "medium" | "long";
export type SortOption = "test_number" | "newest" | "oldest" | "title_az" | "shortest";

export interface SkillFilterOption {
  id: string;
  label: string;
}

interface CatalogFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  typeFilter?: {
    label: string;
    options: SkillFilterOption[];
    selected: string;
    onChange: (val: string) => void;
  };
  lengthFilter: LengthFilter;
  onLengthChange: (len: LengthFilter) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalCount: number;
  filteredCount: number;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
  onResetFilters: () => void;
}

export function CatalogFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  lengthFilter,
  onLengthChange,
  sortBy,
  onSortChange,
  totalCount,
  filteredCount,
  viewMode,
  onViewModeChange,
  onResetFilters,
}: CatalogFilterBarProps) {
  const [localInput, setLocalInput] = useState(searchQuery);

  // Open dropdown state
  const [openDropdown, setOpenDropdown] = useState<"status" | "type" | "length" | "sort" | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localInput !== searchQuery) {
        onSearchChange(localInput);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [localInput, onSearchChange, searchQuery]);

  // Click outside listener to close dropdowns
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const statusOptions: Array<{ id: StatusFilter; label: string }> = [
    { id: "all", label: "All Status (Barchasi)" },
    { id: "not_started", label: "Not Started (Boshlanmagan)" },
    { id: "in_progress", label: "In Progress (Jarayonda)" },
    { id: "completed", label: "Completed (Yakunlangan)" },
    { id: "saved", label: "Saved (Saqlangan)" },
  ];

  const lengthOptions: Array<{ id: LengthFilter; label: string }> = [
    { id: "all", label: "All Lengths (Barchasi)" },
    { id: "short", label: "Short (< 10 daqiqa)" },
    { id: "medium", label: "Medium (10–25 daqiqa)" },
    { id: "long", label: "Full Test (30+ daqiqa)" },
  ];

  const sortOptions: Array<{ id: SortOption; label: string }> = [
    { id: "test_number", label: "Test number" },
    { id: "newest", label: "Newest first" },
    { id: "oldest", label: "Oldest first" },
    { id: "title_az", label: "Title A–Z" },
    { id: "shortest", label: "Shortest first" },
  ];

  const currentSortLabel =
    sortOptions.find((s) => s.id === sortBy)?.label || "Test number";

  const currentStatusLabel =
    statusFilter === "all"
      ? "All Status"
      : statusOptions.find((s) => s.id === statusFilter)?.label.split(" ")[0] || "Status";

  const currentTypeLabel =
    typeFilter?.selected === "all"
      ? typeFilter.label
      : typeFilter?.options.find((o) => o.id === typeFilter.selected)?.label || typeFilter?.label || "All Types";

  const currentLengthLabel =
    lengthFilter === "all"
      ? "All Lengths"
      : lengthOptions.find((l) => l.id === lengthFilter)?.label.split(" ")[0] || "Length";

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    statusFilter !== "all" ||
    (typeFilter && typeFilter.selected !== "all") ||
    lengthFilter !== "all" ||
    sortBy !== "test_number";

  return (
    <div ref={containerRef} className="space-y-3.5">
      {/* Top Controls Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" />
          <input
            type="text"
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            placeholder="Nomi yoki kalit so‘z..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-hidden focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
          />
          {localInput && (
            <button
              onClick={() => {
                setLocalInput("");
                onSearchChange("");
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters & Sort Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 1. All Status Dropdown */}
          <div className="relative">
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "status" ? null : "status")
              }
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                statusFilter !== "all"
                  ? "bg-[var(--primary)] text-white border-[var(--primary)] font-bold shadow-xs"
                  : "bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--muted)]"
              }`}
            >
              <span>{currentStatusLabel}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  openDropdown === "status" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown === "status" && (
              <div className="absolute left-0 top-full mt-1.5 w-52 p-1.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl z-30 space-y-0.5">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onStatusChange(opt.id);
                      setOpenDropdown(null);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                      statusFilter === opt.id
                        ? "bg-orange-50 dark:bg-orange-950/50 text-[var(--primary)] font-bold"
                        : "text-[var(--foreground)] hover:bg-[var(--surface-subtle)]"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {statusFilter === opt.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Type / Topic Dropdown */}
          {typeFilter && (
            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "type" ? null : "type")
                }
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer max-w-[180px] truncate ${
                  typeFilter.selected !== "all"
                    ? "bg-[var(--foreground)] text-[var(--surface)] border-[var(--foreground)] font-bold shadow-xs"
                    : "bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--muted)]"
                }`}
              >
                <span className="truncate">{currentTypeLabel}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                    openDropdown === "type" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openDropdown === "type" && (
                <div className="absolute left-0 top-full mt-1.5 w-60 max-h-64 overflow-y-auto p-1.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl z-30 space-y-0.5">
                  {typeFilter.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        typeFilter.onChange(opt.id);
                        setOpenDropdown(null);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                        typeFilter.selected === opt.id
                          ? "bg-orange-50 dark:bg-orange-950/50 text-[var(--primary)] font-bold"
                          : "text-[var(--foreground)] hover:bg-[var(--surface-subtle)]"
                      }`}
                    >
                      <span className="truncate">{opt.label}</span>
                      {typeFilter.selected === opt.id && (
                        <Check className="w-3.5 h-3.5 shrink-0 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. All Lengths Dropdown */}
          <div className="relative">
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "length" ? null : "length")
              }
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                lengthFilter !== "all"
                  ? "bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs"
                  : "bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--muted)]"
              }`}
            >
              <span>{currentLengthLabel}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  openDropdown === "length" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown === "length" && (
              <div className="absolute left-0 top-full mt-1.5 w-52 p-1.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl z-30 space-y-0.5">
                {lengthOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onLengthChange(opt.id);
                      setOpenDropdown(null);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                      lengthFilter === opt.id
                        ? "bg-orange-50 dark:bg-orange-950/50 text-[var(--primary)] font-bold"
                        : "text-[var(--foreground)] hover:bg-[var(--surface-subtle)]"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {lengthFilter === opt.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. Sort Popover (Exact match to User Image 1) */}
          <div className="relative">
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "sort" ? null : "sort")
              }
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                openDropdown === "sort"
                  ? "bg-[var(--surface)] border-[var(--primary)] text-[var(--primary)] font-bold shadow-xs"
                  : "bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--muted)]"
              }`}
            >
              <span className="text-[var(--muted)]">Sort ·</span>
              <span>{currentSortLabel}</span>
              {openDropdown === "sort" ? (
                <ChevronUp className="w-3.5 h-3.5 text-[var(--primary)]" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {openDropdown === "sort" && (
              <div className="absolute right-0 top-full mt-1.5 w-56 p-2 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl z-40 space-y-1">
                {sortOptions.map((opt) => {
                  const isChecked = sortBy === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        onSortChange(opt.id);
                        setOpenDropdown(null);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer group ${
                        isChecked
                          ? "text-[var(--primary)] font-bold bg-orange-50/60 dark:bg-orange-950/40"
                          : "text-[var(--foreground)] hover:bg-[var(--surface-subtle)]"
                      }`}
                    >
                      {/* Custom Radio Button */}
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                          isChecked
                            ? "border-[var(--primary)] bg-white dark:bg-neutral-900"
                            : "border-[var(--muted)] group-hover:border-[var(--foreground)]"
                        }`}
                      >
                        {isChecked && (
                          <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                        )}
                      </span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 5. View Mode Switcher (List vs Grid) */}
          <div className="flex items-center p-1 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)]">
            <button
              onClick={() => onViewModeChange("list")}
              title="Qatorli ko‘rinish (List)"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-[var(--surface)] text-[var(--primary)] shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("grid")}
              title="Katakchali ko‘rinish (Grid)"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-[var(--surface)] text-[var(--primary)] shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              title="Filtrlarni tozalash"
              className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Subtitle Count Bar (Exact match to User Image 1: "Showing X of Y tests") */}
      <div className="flex items-center justify-between pt-1 border-b border-[var(--border)]/70 pb-2 text-xs">
        <div className="text-[var(--secondary)] font-medium">
          Showing <span className="font-bold text-[var(--foreground)]">{filteredCount}</span> of{" "}
          <span className="font-bold text-[var(--foreground)]">{totalCount}</span> tests
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-[11px] font-bold text-[var(--primary)] hover:underline cursor-pointer"
          >
            Filtrlarni bekor qilish
          </button>
        )}
      </div>
    </div>
  );
}
