"use client";

import { useState, useEffect, useMemo } from "react";
import {
  PenTool,
  Clock,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Send,
  RotateCcw,
  History,
  Award,
  AlertTriangle,
  X,
  Info,
  ArrowRight,
  ArrowLeft,
  FileText,
  BarChart3,
  LineChart,
  PieChart,
  Table as TableIcon,
  GitBranch,
  MapPin,
  HelpCircle,
  PlusCircle,
  MessageSquare,
  Flag,
  Maximize2,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import {
  submitEssay,
  getWritingDraft,
  saveWritingDraft,
  fetchUserWritingSubmissions,
  WritingSubmission,
  WritingFeedback,
} from "@/lib/services/writing-service";
import { getBookmarks } from "@/lib/services/bookmarks-service";
import { CatalogHeader } from "@/components/catalog/CatalogHeader";
import { ContinueCard } from "@/components/catalog/ContinueCard";
import { CategoryTabs } from "@/components/catalog/CategoryTabs";
import {
  CatalogFilterBar,
  StatusFilter,
  SkillFilterOption,
  LengthFilter,
  SortOption,
} from "@/components/catalog/CatalogFilterBar";
import { ActivityCard, ActivityCardData } from "@/components/catalog/ActivityCard";
import { ActivityListItem } from "@/components/catalog/ActivityListItem";
import { EmptyCatalogState } from "@/components/catalog/EmptyCatalogState";
import { WritingSelfCorrection } from "@/components/writing/WritingSelfCorrection";
import { AskAboutThisModal, ContextualHelpData } from "@/components/common/AskAboutThisModal";
import { ReportIssueModal } from "@/components/common/ReportIssueModal";
import {
  fetchUserCustomWritingTasks,
  saveUserCustomWritingTask,
  CustomWritingTask,
} from "@/lib/services/custom-tasks-service";
import { fetchPlatformWritingTasks } from "@/lib/services/writing-tasks-service";
import { PlatformWritingTask } from "@/lib/types/writing";
import defaultWritingTasksData from "@/data/writing-tasks.json";

export type WritingCategoryTab = "all" | "task1" | "task2" | "my_submissions";

export interface WritingTaskItem {
  id: string;
  taskType: "task1" | "task2";
  title: string;
  categoryTag: string; // e.g. "bar_chart", "discuss_both_views"
  categoryLabel: string;
  prompt: string;
  imageUrl?: string;
  visualDescription?: string;
  modelAnswer?: string;
  suggestedMinutes: number;
  wordRequirement: number;
  isUserCreated?: boolean;
}

const WRITING_TASKS: WritingTaskItem[] = defaultWritingTasksData as unknown as WritingTaskItem[];

const TASK1_FILTER_OPTIONS: SkillFilterOption[] = [
  { id: "all", label: "Barcha turlar" },
  { id: "bar_chart", label: "Bar Chart" },
  { id: "line_graph", label: "Line Graph" },
  { id: "pie_chart", label: "Pie Chart" },
  { id: "table", label: "Table" },
  { id: "process", label: "Process" },
  { id: "map", label: "Map" },
];

const TASK2_FILTER_OPTIONS: SkillFilterOption[] = [
  { id: "all", label: "Barcha turlar" },
  { id: "discuss_both_views", label: "Discuss Both Views" },
  { id: "opinion", label: "Opinion (Agree/Disagree)" },
  { id: "problems_solutions", label: "Problems & Solutions" },
  { id: "advantages_disadvantages", label: "Advantages & Disadvantages" },
  { id: "two_part", label: "Two-Part Questions" },
];

export default function WritingPage() {
  const { user } = useAuth();

  // Mode: Catalog vs Workspace
  const [activeTask, setActiveTask] = useState<WritingTaskItem | null>(null);

  // Catalog State
  const [activeCategory, setActiveCategory] = useState<WritingCategoryTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedSubtype, setSelectedSubtype] = useState("all");
  const [lengthFilter, setLengthFilter] = useState<LengthFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("test_number");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Workspace Editor State
  const [essay, setEssay] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeResult, setActiveResult] = useState<WritingSubmission | null>(null);
  const [pastSubmissions, setPastSubmissions] = useState<WritingSubmission[]>([]);
  const [minWordsWarning, setMinWordsWarning] = useState(false);

  // Platform Writing Tasks (from Firestore & Admin R2 CMS)
  const [platformTasks, setPlatformTasks] = useState<PlatformWritingTask[]>([]);
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  // Section 11: Custom Tasks State
  const [customTasks, setCustomTasks] = useState<CustomWritingTask[]>([]);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTaskType, setCustomTaskType] = useState<"task1" | "task2">("task2");
  const [customTitle, setCustomTitle] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [customVisual, setCustomVisual] = useState("");
  const [savingCustom, setSavingCustom] = useState(false);

  // Section 10 & 13: Contextual AI and Quality Reports
  const [activeHelpContext, setActiveHelpContext] = useState<ContextualHelpData | null>(null);
  const [activeReportContext, setActiveReportContext] = useState<{
    skill: "reading" | "listening" | "writing" | "speaking";
    contentVersion?: string;
    itemReference: string;
    itemPrompt: string;
    expectedAnswer?: string;
  } | null>(null);

  // Load submissions, bookmarks, platform tasks, and custom tasks
  useEffect(() => {
    fetchUserWritingSubmissions(user?.uid).then((list) => {
      setPastSubmissions(list);
    });
    fetchUserCustomWritingTasks(user?.uid).then((list) => {
      setCustomTasks(list);
    });

    const loadPlatformTasks = () => {
      fetchPlatformWritingTasks().then((pTasks) => {
        setPlatformTasks(pTasks);
      });
    };
    loadPlatformTasks();

    setBookmarkedIds(getBookmarks().map((b) => b.id));

    const onSync = () => setBookmarkedIds(getBookmarks().map((b) => b.id));
    window.addEventListener("ielts-bookmarks-updated", onSync);
    window.addEventListener("ielts-writing-tasks-updated", loadPlatformTasks);
    return () => {
      window.removeEventListener("ielts-bookmarks-updated", onSync);
      window.removeEventListener("ielts-writing-tasks-updated", loadPlatformTasks);
    };
  }, [user?.uid]);

  // Merge platform admin tasks, user custom tasks, and default catalog tasks
  const allTasks = useMemo<WritingTaskItem[]>(() => {
    const formattedCustom: WritingTaskItem[] = customTasks.map((ct) => ({
      ...ct,
      isUserCreated: true,
    }));
    const combined = [...platformTasks, ...formattedCustom, ...WRITING_TASKS];
    const seen = new Set<string>();
    return combined.filter((t) => {
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    });
  }, [platformTasks, customTasks]);

  // Support ?task=ID URL parameter
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const taskId = params.get("task");
      if (taskId && allTasks.length > 0) {
        const found = allTasks.find((t) => t.id === taskId);
        if (found) {
          setActiveTask(found);
        }
      }
    }
  }, [allTasks]);

  // Load draft when task is selected
  useEffect(() => {
    if (activeTask) {
      const draft = getWritingDraft(activeTask.taskType);
      setEssay(draft);
      setActiveResult(null);
    }
  }, [activeTask]);

  // Silent autosave (WITHOUT displaying annoying "Avtomatik qoralama saqlandi" text!)
  useEffect(() => {
    if (!activeTask) return;
    const timer = setTimeout(() => {
      saveWritingDraft(activeTask.taskType, essay);
    }, 600);
    return () => clearTimeout(timer);
  }, [essay, activeTask]);

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;
  const targetWords = activeTask ? activeTask.wordRequirement : 250;

  const handleSubmit = async () => {
    if (wordCount < 10) {
      setMinWordsWarning(true);
      return;
    }
    setSubmitting(true);
    const result = await submitEssay(user?.uid, {
      taskType: activeTask?.taskType || "task2",
      prompt: activeTask?.prompt || "",
      essay,
    });
    setActiveResult(result);
    setPastSubmissions((prev) => [result, ...prev]);
    setSubmitting(false);
  };

  const handleCreateCustomTask = async () => {
    if (!customTitle.trim() || !customPrompt.trim()) return;
    setSavingCustom(true);
    const created = await saveUserCustomWritingTask(user?.uid, {
      taskType: customTaskType,
      title: customTitle.trim(),
      categoryTag: customTaskType === "task1" ? "user_visual" : "user_essay",
      categoryLabel: customTaskType === "task1" ? "Shaxsiy Grafik / Vizual" : "Shaxsiy Insho",
      prompt: customPrompt.trim(),
      visualDescription: customVisual.trim() || undefined,
      suggestedMinutes: customTaskType === "task1" ? 20 : 40,
      wordRequirement: customTaskType === "task1" ? 150 : 250,
    });
    setCustomTasks((prev) => [created, ...prev]);
    setShowCustomModal(false);
    setCustomTitle("");
    setCustomPrompt("");
    setCustomVisual("");
    setSavingCustom(false);
    setActiveTask(created);
  };

  // Tab counters
  const tabCounts = useMemo(() => {
    return {
      all: allTasks.length,
      task1: allTasks.filter((t) => t.taskType === "task1").length,
      task2: allTasks.filter((t) => t.taskType === "task2").length,
      my_submissions: pastSubmissions.length,
    };
  }, [allTasks, pastSubmissions]);

  const tabs = [
    { id: "all", label: "Barcha Topshiriqlar", count: tabCounts.all },
    { id: "task1", label: "Task 1 (Akademik)", count: tabCounts.task1 },
    { id: "task2", label: "Task 2 (Insho)", count: tabCounts.task2 },
    { id: "my_submissions", label: "Mening Insholarim", count: tabCounts.my_submissions },
  ];

  // Filtering for Catalog
  const filteredTasks = useMemo(() => {
    const list = allTasks.filter((task) => {
      if (activeCategory === "task1" && task.taskType !== "task1") return false;
      if (activeCategory === "task2" && task.taskType !== "task2") return false;

      if (selectedSubtype !== "all" && task.categoryTag !== selectedSubtype) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesPrompt = task.prompt.toLowerCase().includes(q);
        const matchesTag = task.categoryLabel.toLowerCase().includes(q);
        if (!matchesTitle && !matchesPrompt && !matchesTag) return false;
      }

      // Length filter
      if (lengthFilter === "short" && task.suggestedMinutes > 20) return false;
      if (lengthFilter === "medium" && task.suggestedMinutes !== 20) return false;
      if (lengthFilter === "long" && task.suggestedMinutes <= 20) return false;

      const submission = pastSubmissions.find((s) => s.prompt === task.prompt);
      const isSaved = bookmarkedIds.includes(task.id);
      if (statusFilter === "saved" && !isSaved) return false;
      if (statusFilter === "completed" && !submission) return false;
      if (statusFilter === "not_started" && submission) return false;

      return true;
    });

    const sorted = [...list];
    if (sortBy === "newest") sorted.reverse();
    else if (sortBy === "title_az") sorted.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === "shortest") sorted.sort((a, b) => a.suggestedMinutes - b.suggestedMinutes);

    return sorted;
  }, [activeCategory, selectedSubtype, lengthFilter, sortBy, searchQuery, statusFilter, pastSubmissions, bookmarkedIds]);

  const resetAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSelectedSubtype("all");
    setLengthFilter("all");
    setSortBy("test_number");
    setActiveCategory("all");
  };

  // Recent submission or draft for ContinueCard
  const recentSubmission = pastSubmissions[0] || null;

  // WORKSPACE VIEW
  if (activeTask) {
    return (
      <div className="space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <button
            onClick={() => setActiveTask(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Writing Katalogiga qaytish</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[var(--primary)] border border-orange-200/50">
              {activeTask.taskType === "task1" ? "Academic Task 1" : "Academic Task 2"}
            </span>
            <span className="text-xs font-semibold text-[var(--muted)]">
              {activeTask.categoryLabel}
            </span>
          </div>
        </div>

        {/* Min Words Alert Modal */}
        {minWordsWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="card max-w-md w-full p-6 space-y-4 shadow-xl border-2 border-amber-400 bg-[var(--surface)]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-6 h-6 shrink-0" />
                  <h3 className="text-base font-bold text-[var(--foreground)]">
                    Insho juda qisqa
                  </h3>
                </div>
                <button
                  onClick={() => setMinWordsWarning(false)}
                  className="p-1 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[var(--secondary)] leading-relaxed">
                Iltimos, insho tekshirish uchun yuborishdan oldin <strong>kamida 10 ta so‘z</strong> yozing. Hozirda kiritilgan so‘zlar:{" "}
                <span className="font-bold text-[var(--foreground)]">{wordCount} ta</span>.
              </p>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setMinWordsWarning(false)}
                  className="btn-primary !py-2 !px-4 text-xs font-bold cursor-pointer"
                >
                  Tushundim, davom etaman
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Task Prompt & Visual Guidance */}
          <div className="lg:col-span-5 space-y-4">
            <div className="card p-6 space-y-4 bg-[var(--surface)] border border-[var(--border)]">
              <div className="space-y-1">
                <span className="eyebrow text-[11px]">{activeTask.categoryLabel}</span>
                <h2 className="text-lg font-black text-[var(--foreground)] tracking-tight">
                  {activeTask.title}
                </h2>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-xs sm:text-sm text-[var(--foreground)] leading-relaxed">
                {activeTask.prompt}
              </div>

              {/* Cloudflare R2 Chart Image with Zoom Lightbox */}
              {activeTask.imageUrl && (
                <div className="space-y-2">
                  <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] bg-white dark:bg-stone-900 group shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeTask.imageUrl}
                      alt={activeTask.title}
                      className="w-full max-h-72 object-contain mx-auto p-2 cursor-zoom-in"
                      onClick={() => setZoomImageUrl(activeTask.imageUrl || null)}
                    />
                    <button
                      type="button"
                      onClick={() => setZoomImageUrl(activeTask.imageUrl || null)}
                      className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-black/75 hover:bg-black text-white text-xs font-bold backdrop-blur-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Kattalashtirish (Zoom)</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-[var(--muted)] text-center">
                    Grafik raqamlari va yozuvlarini aniq ko‘rish uchun rasm ustiga bosing
                  </p>
                </div>
              )}

              {activeTask.visualDescription && (
                <div className="p-3.5 rounded-xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-900/40 text-xs text-[var(--foreground)] space-y-1">
                  <div className="font-bold text-[var(--primary)] flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4" />
                    <span>Vizual ma‘lumot tasviri:</span>
                  </div>
                  <p className="text-[11px] text-[var(--secondary)] leading-relaxed">
                    {activeTask.visualDescription}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-[var(--muted)] pt-2 border-t border-[var(--border)]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {activeTask.suggestedMinutes} daqiqa tavsiya etiladi
                </span>
                <span className="font-semibold text-[var(--foreground)]">
                  Min. {activeTask.wordRequirement} ta so‘z
                </span>
              </div>
            </div>
          </div>

          {/* Right: Writing Area & Editor */}
          <div className="lg:col-span-7 space-y-4">
            <div className="card p-5 sm:p-6 space-y-4 bg-[var(--surface)] border border-[var(--border)]">
              {/* Word counter and progress */}
              <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--foreground)]">
                    So‘zlar soni:
                  </span>
                  <span
                    className={`text-sm font-black tabular ${
                      wordCount >= targetWords
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-[var(--primary)]"
                    }`}
                  >
                    {wordCount}
                  </span>
                  <span className="text-xs text-[var(--muted)]">/ {targetWords}</span>
                </div>

                {wordCount >= targetWords && (
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Kerakli hajm yetarli
                  </span>
                )}
              </div>

              {/* Textarea */}
              <textarea
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                placeholder="Inshongizni shu yerga yozishni boshlang..."
                rows={14}
                className="w-full !min-h-[320px] resize-y leading-relaxed text-sm p-4 font-normal rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--foreground)] focus:outline-hidden focus:border-[var(--primary)]"
              />

              {/* AI Ustoz & System Notice Banner */}
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 text-[11px] text-amber-900 dark:text-amber-200">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="leading-snug">
                  <strong>Eslatma:</strong> Insho hozircha <strong>tizim tomonidan tekshiriladi</strong> (tizim adashishi mumkin). <strong>AI Ustoz tekshiruvi</strong> ishlab chiqilmoqda.
                </span>
              </div>

              {/* Clean Action Row (NO annoying autosave text!) */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-[var(--border)]">
                <button
                  onClick={() => setEssay("")}
                  disabled={submitting || essay.length === 0}
                  className="text-xs text-[var(--muted)] hover:text-rose-600 cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Matnni tozalash</span>
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn-primary text-xs sm:text-sm font-bold shadow-sm cursor-pointer !py-2.5 !px-6 flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Tahlil qilinmoqda…" : "Inshoni yuborish va tahlil"}</span>
                </button>
              </div>
            </div>

            {/* Real Feedback Panel */}
            {activeResult && (
              <>
                <div className="card p-6 md:p-8 space-y-6 border-2 border-[var(--primary)] shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
                  <div>
                    <span className="eyebrow text-xs">Baholash Natijasi</span>
                    <h2 className="text-xl md:text-2xl font-black text-[var(--foreground)] tracking-tight">
                      IELTS Writing Tahlili & Mezonlar
                    </h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[11px] block text-[var(--muted)] font-semibold">Tizimli baho:</span>
                      <span className="text-2xl font-black text-[var(--primary)] tabular">
                        Band {activeResult.feedback.overallBand.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4 Criteria Scores */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Task Achievement", score: activeResult.feedback.taskAchievement.band },
                    { label: "Coherence & Cohesion", score: activeResult.feedback.coherenceCohesion.band },
                    { label: "Lexical Resource", score: activeResult.feedback.lexicalResource.band },
                    { label: "Grammar & Accuracy", score: activeResult.feedback.grammaticalRange.band },
                  ].map((crit, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-1">
                      <span className="text-[10px] font-bold text-[var(--muted)] uppercase block leading-tight">
                        {crit.label}
                      </span>
                      <span className="text-lg font-black text-[var(--foreground)] tabular">
                        Band {crit.score.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Strengths & Improvements */}
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Kuchli jihatlar
                    </h4>
                    <ul className="space-y-1 text-xs text-[var(--secondary)] list-disc pl-4">
                      {activeResult.feedback.strengths.map((str, i) => (
                        <li key={i}>{str}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Tavsiyalar & Rivojlantirish
                    </h4>
                    <ul className="space-y-1 text-xs text-[var(--secondary)] list-disc pl-4">
                      {activeResult.feedback.improvements.map((imp, i) => (
                        <li key={i}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Model Answer (Band 8-9 Sample) */}
                {activeTask.modelAnswer && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Band 8.5–9.0 Namunaviy Insho (Model Answer)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowModelAnswer(!showModelAnswer)}
                        className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        {showModelAnswer ? "Yashirish" : "Ko‘rsatish"}
                      </button>
                    </div>
                    {showModelAnswer && (
                      <p className="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-line pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40">
                        {activeTask.modelAnswer}
                      </p>
                    )}
                  </div>
                )}

                {/* Section 10 & 13 Actions */}
                <div className="pt-3 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveHelpContext({
                        skill: "writing",
                        taskTitle: activeTask.title,
                        questionPrompt: activeTask.prompt,
                        userAnswer: activeResult.essay,
                        feedbackSummary: `Overall Band ${activeResult.feedback.overallBand.toFixed(1)}: ${activeResult.feedback.improvements.join(" ")}`,
                      })
                    }
                    className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Shu feedback haqida so‘rash (Ask about this)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveReportContext({
                        skill: "writing",
                        contentVersion: "v2.0",
                        itemReference: activeTask.id,
                        itemPrompt: activeTask.prompt,
                      })
                    }
                    className="text-xs text-[var(--muted)] hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Baholashda xatolik bormi?</span>
                  </button>
                </div>
              </div>

              {/* Section 9: Writing Self-Correction Mode */}
              <WritingSelfCorrection
                essay={activeResult.essay}
                taskTitle={activeTask.title}
              />
            </>
          )}
          </div>
        </div>

        {/* Chart Zoom Lightbox */}
        {zoomImageUrl && (
          <div
            onClick={() => setZoomImageUrl(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-zoom-out animate-fade-in"
          >
            <div className="relative max-w-5xl max-h-[92vh]">
              <button
                onClick={() => setZoomImageUrl(null)}
                className="absolute -top-10 right-0 text-white hover:text-[var(--primary)] text-sm font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-5 h-5" />
                <span>Yopish</span>
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zoomImageUrl}
                alt="Zoomed chart view"
                className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl object-contain bg-white dark:bg-stone-900 p-2 border border-white/20"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // SUBMISSIONS TAB VIEW
  if (activeCategory === "my_submissions") {
    return (
      <div className="space-y-6">
        <CatalogHeader
          eyebrow="IELTS WRITING MODULI"
          title="Mening Insholarim"
          description="Siz yozgan va tizim tomonidan tahlil qilingan insholar tarixi va ballar."
          icon={PenTool}
          stats={[
            { label: "Topshirilgan", value: pastSubmissions.length },
          ]}
        />

        <CategoryTabs
          tabs={tabs}
          activeTab={activeCategory}
          onChange={(id: string) => setActiveCategory(id as WritingCategoryTab)}
        />

        {pastSubmissions.length === 0 ? (
          <EmptyCatalogState
            type="no_submissions"
            onReset={() => setActiveCategory("all")}
          />
        ) : (
          <div className="space-y-4">
            {pastSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="card p-5 sm:p-6 space-y-4 border border-[var(--border)] bg-[var(--surface)] rounded-2xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[var(--surface-subtle)] text-[var(--primary)] border border-[var(--border)] uppercase">
                        {sub.taskType === "task1" ? "Task 1" : "Task 2"}
                      </span>
                      <span className="text-xs text-[var(--muted)]">
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[var(--foreground)] line-clamp-1">
                      {sub.prompt}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-[var(--muted)] block">
                        Baho:
                      </span>
                      <span className="text-xl font-black text-[var(--primary)] tabular">
                        Band {sub.feedback.overallBand.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-[var(--secondary)] line-clamp-2 bg-[var(--surface-subtle)] p-3 rounded-xl italic">
                  "{sub.essay}"
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--muted)] tabular">
                    So‘zlar soni: <strong>{sub.wordCount}</strong> ta
                  </span>

                  <button
                    onClick={() => {
                      const matchedTask = WRITING_TASKS.find((t) => t.prompt === sub.prompt);
                      if (matchedTask) {
                        setActiveTask(matchedTask);
                        setEssay(sub.essay);
                        setActiveResult(sub);
                      }
                    }}
                    className="btn-secondary !py-1.5 !px-3 text-xs font-bold cursor-pointer"
                  >
                    Batafsil ko‘rish / Qayta yozish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // MAIN CATALOG VIEW
  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <CatalogHeader
        eyebrow="IELTS WRITING MODULI"
        title="IELTS Academic Writing"
        description="Task 1 vizual tahlillari (grafik, jadval, jarayon) va Task 2 argumentli akademik insholar katalogi."
        icon={PenTool}
        stats={[
          { label: "Mavzular", value: WRITING_TASKS.length },
          { label: "Topshirilgan", value: pastSubmissions.length },
        ]}
      />

      {/* 2. Continue Card if recent submission or draft exists */}
      {recentSubmission && (
        <ContinueCard
          title={recentSubmission.prompt}
          subtitle={`Oxirgi topshirilgan: Band ${recentSubmission.feedback.overallBand.toFixed(1)} (${recentSubmission.wordCount} ta so‘z)`}
          durationLabel={`${recentSubmission.taskType === "task1" ? "20" : "40"} daqiqalik topshiriq`}
          badgeText="Oxirgi insho"
          onAction={() => {
            const matchedTask = WRITING_TASKS.find((t) => t.prompt === recentSubmission.prompt) || WRITING_TASKS[0];
            setActiveTask(matchedTask);
            setEssay(recentSubmission.essay);
            setActiveResult(recentSubmission);
          }}
          actionLabel="Tahlilni ko‘rish / Qayta ishlash"
        />
      )}

      {/* 3. Category Tabs & Custom Task Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <CategoryTabs
          tabs={tabs}
          activeTab={activeCategory}
          onChange={(id: string) => {
            setActiveCategory(id as WritingCategoryTab);
            setSelectedSubtype("all");
          }}
        />

        <button
          onClick={() => setShowCustomModal(true)}
          className="btn-primary !py-2 !px-4 text-xs font-bold self-start sm:self-auto flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Shaxsiy topshiriq yaratish</span>
        </button>
      </div>

      {/* 4. Filter Bar with Dropdowns and Sort */}
      <CatalogFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={
          activeCategory === "task1"
            ? {
                label: "All Visual Types (Vizual turlar)",
                options: TASK1_FILTER_OPTIONS,
                selected: selectedSubtype,
                onChange: setSelectedSubtype,
              }
            : activeCategory === "task2"
            ? {
                label: "All Essay Types (Insho turlari)",
                options: TASK2_FILTER_OPTIONS,
                selected: selectedSubtype,
                onChange: setSelectedSubtype,
              }
            : undefined
        }
        lengthFilter={lengthFilter}
        onLengthChange={setLengthFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={allTasks.length}
        filteredCount={filteredTasks.length}
        onResetFilters={resetAllFilters}
      />

      {/* 5. Content: List View (default) or Grid View */}
      {filteredTasks.length === 0 ? (
        <EmptyCatalogState
          type={statusFilter === "saved" ? "no_saved" : "no_results"}
          onReset={resetAllFilters}
        />
      ) : viewMode === "list" ? (
        <div className="space-y-2.5">
          {filteredTasks.map((task, idx) => {
            const sub = pastSubmissions.find((s) => s.prompt === task.prompt);
            const status = sub ? "completed" : "not_started";

            const cardData: ActivityCardData = {
              id: task.id,
              skill: "writing",
              title: task.title,
              topic: task.imageUrl ? `${task.categoryLabel} · 📷 Rasmli grafik` : task.categoryLabel,
              typeBadge: task.isUserCreated
                ? "Shaxsiy mashq (Custom)"
                : task.taskType === "task1"
                ? "Task 1 (Akademik)"
                : "Task 2 (Insho)",
              typeBadgeColor: task.isUserCreated ? "amber" : task.taskType === "task1" ? "emerald" : "indigo",
              itemCountLabel: `Kamida ${task.wordRequirement} ta so‘z talab etiladi`,
              durationMinutes: task.suggestedMinutes,
              status,
              bestBand: sub?.feedback.overallBand,
              onAction: () => setActiveTask(task),
              actionLabel: sub ? "Inshoni ko‘rish" : "Yozishni boshlash",
            };

            return <ActivityListItem key={task.id} item={cardData} index={idx} />;
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => {
            const sub = pastSubmissions.find((s) => s.prompt === task.prompt);
            const status = sub ? "completed" : "not_started";

            const cardData: ActivityCardData = {
              id: task.id,
              skill: "writing",
              title: task.title,
              topic: task.imageUrl ? `${task.categoryLabel} · 📷 Rasmli grafik` : task.categoryLabel,
              typeBadge: task.isUserCreated
                ? "Shaxsiy mashq (Custom)"
                : task.taskType === "task1"
                ? "Task 1 (Akademik)"
                : "Task 2 (Insho)",
              typeBadgeColor: task.isUserCreated ? "amber" : task.taskType === "task1" ? "emerald" : "indigo",
              itemCountLabel: `Kamida ${task.wordRequirement} ta so‘z talab etiladi`,
              durationMinutes: task.suggestedMinutes,
              status,
              bestBand: sub?.feedback.overallBand,
              onAction: () => setActiveTask(task),
              actionLabel: sub ? "Inshoni ko‘rish" : "Yozishni boshlash",
            };

            return <ActivityCard key={task.id} item={cardData} />;
          })}
        </div>
      )}

      {/* Section 11: Custom Task Creation Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="card max-w-lg w-full p-6 space-y-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-[var(--primary)] flex items-center justify-center">
                  <PenTool className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[var(--foreground)]">
                    Shaxsiy Writing Mashqi Yaratish
                  </h3>
                  <p className="text-[11px] text-[var(--muted)]">
                    O‘zingiz istagan mavzuni kiritib insho yozing va tahlil oling
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCustomModal(false)}
                className="p-1 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[var(--foreground)] block mb-1">
                  Vazifa turi (Task Type):
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomTaskType("task2")}
                    className={`flex-1 p-2.5 rounded-xl border font-bold text-center cursor-pointer transition-all ${
                      customTaskType === "task2"
                        ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                        : "bg-[var(--surface-subtle)] text-[var(--secondary)] border-[var(--border)]"
                    }`}
                  >
                    Task 2: Essay (250+ so‘z)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomTaskType("task1")}
                    className={`flex-1 p-2.5 rounded-xl border font-bold text-center cursor-pointer transition-all ${
                      customTaskType === "task1"
                        ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                        : "bg-[var(--surface-subtle)] text-[var(--secondary)] border-[var(--border)]"
                    }`}
                  >
                    Task 1: Report (150+ so‘z)
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-[var(--foreground)] block mb-1">
                  Mavzu sarlavhasi (Title):
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Masalan: Environmental impact of fast fashion"
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--foreground)]"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--foreground)] block mb-1">
                  Topshiriq savoli / Prompt:
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="IELTS savolini to‘liq yozing..."
                  rows={4}
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--foreground)]"
                />
              </div>

              {customTaskType === "task1" && (
                <div>
                  <label className="font-bold text-[var(--foreground)] block mb-1">
                    Vizual ma'lumot tavsifi (Grafik yoki jadval sonlari):
                  </label>
                  <textarea
                    value={customVisual}
                    onChange={(e) => setCustomVisual(e.target.value)}
                    placeholder="Grafikdagi asosiy tendensiyalar va raqamlarni yozing..."
                    rows={3}
                    className="w-full p-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--foreground)]"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="btn-secondary !py-2 !px-4 text-xs cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={handleCreateCustomTask}
                  disabled={savingCustom || !customTitle.trim() || !customPrompt.trim()}
                  className="btn-primary !py-2 !px-5 text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {savingCustom ? "Saqlanmoqda…" : "Yaratish va Yozish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contextual Ask About This Modal (Section 10) */}
      <AskAboutThisModal
        isOpen={Boolean(activeHelpContext)}
        onClose={() => setActiveHelpContext(null)}
        contextData={activeHelpContext}
      />

      {/* Quality Reporting Modal (Section 13) */}
      <ReportIssueModal
        isOpen={Boolean(activeReportContext)}
        onClose={() => setActiveReportContext(null)}
        reportContext={activeReportContext}
      />
    </div>
  );
}
