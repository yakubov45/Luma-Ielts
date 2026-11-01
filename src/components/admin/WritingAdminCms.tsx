"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  PenTool,
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ExternalLink,
  Search,
  Plus,
  X,
  Clock,
  FileText,
  BarChart3,
  Layers,
  Sparkles,
  Eye,
  RefreshCw,
  Maximize2,
} from "lucide-react";
import {
  PlatformWritingTask,
  TASK1_CATEGORIES,
  TASK2_CATEGORIES,
  WritingTaskType,
} from "@/lib/types/writing";
import {
  fetchPlatformWritingTasks,
  savePlatformWritingTask,
  deletePlatformWritingTask,
} from "@/lib/services/writing-tasks-service";

export function WritingAdminCms() {
  const [tasks, setTasks] = useState<PlatformWritingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "task1" | "task2">("all");
  const [filterCategory, setFilterCategory] = useState("all");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Lightbox Preview State
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Form State
  const [taskType, setTaskType] = useState<WritingTaskType>("task1");
  const [title, setTitle] = useState("");
  const [categoryTag, setCategoryTag] = useState("bar_chart");
  const [prompt, setPrompt] = useState("");
  const [visualDescription, setVisualDescription] = useState("");
  const [modelAnswer, setModelAnswer] = useState("");
  const [suggestedMinutes, setSuggestedMinutes] = useState(20);
  const [wordRequirement, setWordRequirement] = useState(150);

  // Image Upload State (Cloudflare R2)
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");
  const [imageDragOver, setImageDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Tasks
  const loadTasks = async () => {
    setLoading(true);
    try {
      const list = await fetchPlatformWritingTasks();
      setTasks(list);
    } catch (err) {
      console.error("Error loading writing tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
    const handleUpdate = () => loadTasks();
    window.addEventListener("ielts-writing-tasks-updated", handleUpdate);
    return () => window.removeEventListener("ielts-writing-tasks-updated", handleUpdate);
  }, []);

  // When switching task type, adjust defaults
  const handleTaskTypeChange = (type: WritingTaskType) => {
    setTaskType(type);
    if (type === "task1") {
      setCategoryTag("bar_chart");
      setSuggestedMinutes(20);
      setWordRequirement(150);
    } else {
      setCategoryTag("discuss_both_views");
      setSuggestedMinutes(40);
      setWordRequirement(250);
      setImageUrl("");
    }
  };

  // Image Upload Handler
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Faqat rasm fayllari (PNG, JPG, WEBP, SVG) qabul qilinadi.");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg("Rasm hajmi 15MB dan oshmasligi kerak.");
      return;
    }

    setErrorMsg("");
    setUploadingImage(true);
    setUploadProgressText("Cloudflare R2 ga yuklanmoqda...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "writing-task1");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Rasm yuklashda xatolik yuz berdi");
      }

      setImageUrl(data.url);
      setUploadProgressText("Muvaffaqiyatli yuklandi!");
    } catch (err: any) {
      setErrorMsg(err.message || "Rasm yuklanmadi. Qaytadan urinib ko‘ring.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setImageDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !prompt.trim()) {
      setErrorMsg("Sarlavha va savol matni kiritilishi shart.");
      return;
    }

    if (taskType === "task1" && !imageUrl.trim() && !visualDescription.trim()) {
      setErrorMsg("Task 1 uchun Cloudflare R2 ga rasm yuklang yoki vizual tasvir kiriting.");
      return;
    }

    setErrorMsg("");
    setSaving(true);

    try {
      const selectedCatList = taskType === "task1" ? TASK1_CATEGORIES : TASK2_CATEGORIES;
      const foundCat = (selectedCatList as readonly { id: string; label: string }[]).find(
        (c) => c.id === categoryTag
      );
      const categoryLabel = foundCat ? foundCat.label : categoryTag;

      await savePlatformWritingTask({
        taskType,
        title: title.trim(),
        categoryTag,
        categoryLabel,
        prompt: prompt.trim(),
        imageUrl: imageUrl.trim() || undefined,
        visualDescription: visualDescription.trim() || undefined,
        modelAnswer: modelAnswer.trim() || undefined,
        suggestedMinutes: Number(suggestedMinutes) || (taskType === "task1" ? 20 : 40),
        wordRequirement: Number(wordRequirement) || (taskType === "task1" ? 150 : 250),
        status: "published",
      });

      setModalOpen(false);
      resetForm();
      await loadTasks();
    } catch (err: any) {
      setErrorMsg(err.message || "Vazifani saqlashda xatolik yuz berdi.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, taskTitle: string) => {
    if (!confirm(`"${taskTitle}" topshirig'ini rostdan ham o'chirmoqchimisiz?`)) {
      return;
    }
    await deletePlatformWritingTask(id);
    await loadTasks();
  };

  const resetForm = () => {
    setTitle("");
    setPrompt("");
    setVisualDescription("");
    setModelAnswer("");
    setImageUrl("");
    setErrorMsg("");
    setUploadProgressText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Filtered List
  const filteredTasks = tasks.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.prompt.toLowerCase().includes(search.toLowerCase()) ||
      t.categoryLabel.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || t.taskType === filterType;
    const matchCat = filterCategory === "all" || t.categoryTag === filterCategory;
    return matchSearch && matchType && matchCat;
  });

  const task1Count = tasks.filter((t) => t.taskType === "task1").length;
  const task2Count = tasks.filter((t) => t.taskType === "task2").length;
  const withImagesCount = tasks.filter((t) => Boolean(t.imageUrl)).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="card p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider block">
            Jami Writing Vazifalar
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-[var(--foreground)] tabular">{tasks.length}</span>
            <PenTool className="w-5 h-5 text-[var(--primary)] opacity-80" />
          </div>
        </div>

        <div className="card p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider block">
            Task 1 (Hisobot & Grafika)
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400 tabular">{task1Count}</span>
            <BarChart3 className="w-5 h-5 text-amber-600 dark:text-amber-400 opacity-80" />
          </div>
        </div>

        <div className="card p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider block">
            R2 Rasm Yuklanganlar
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular">{withImagesCount}</span>
            <ImageIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 opacity-80" />
          </div>
        </div>

        <div className="card p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl space-y-1">
          <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider block">
            Cloudflare R2 Bucket
          </span>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              lumina (Ulangan)
            </span>
            <UploadCloud className="w-5 h-5 text-emerald-600 dark:text-emerald-400 opacity-80" />
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="card p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Vazifa nomi yoki so‘rov bo‘yicha..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--foreground)]"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="text-xs py-1.5 px-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--foreground)] font-semibold"
          >
            <option value="all">Barcha Turlar</option>
            <option value="task1">Faqat Task 1 (Grafiklar)</option>
            <option value="task2">Faqat Task 2 (Insholar)</option>
          </select>

          <button
            onClick={loadTasks}
            className="p-2 rounded-xl bg-[var(--surface-subtle)] hover:bg-[var(--border)] text-[var(--muted)] transition-colors cursor-pointer"
            title="Yangilash"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="btn-primary text-xs font-bold !py-2 !px-4 shadow-sm cursor-pointer inline-flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Writing Task Joylash</span>
        </button>
      </div>

      {/* Task Grid / Table */}
      {loading ? (
        <div className="min-h-[240px] flex flex-col items-center justify-center gap-2">
          <div className="w-7 h-7 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[var(--secondary)]">Vazifalar yuklanmoqda...</span>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="card p-12 text-center bg-[var(--surface)] border border-[var(--border)] rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 mx-auto flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[var(--foreground)]">Vazifalar topilmadi</h3>
          <p className="text-xs text-[var(--secondary)] max-w-sm mx-auto">
            Hozircha admin orqali kiritilgan topshiriqlar yo‘q yoki filtrga mos kelmadi.
          </p>
          <button
            onClick={() => {
              resetForm();
              setModalOpen(true);
            }}
            className="btn-primary text-xs !py-2 !px-4 inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Birinchi Task 1 ni joylash</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((t) => (
            <div
              key={t.id}
              className="card p-5 bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex flex-col justify-between hover:shadow-md transition-shadow group relative"
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${
                        t.taskType === "task1"
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                          : "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
                      }`}
                    >
                      {t.taskType === "task1" ? "Task 1" : "Task 2"}
                    </span>
                    <span className="text-[10px] font-semibold text-[var(--muted)]">
                      {t.categoryLabel}
                    </span>
                  </div>

                  <span className="text-[10px] text-[var(--muted)] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {t.suggestedMinutes}m
                  </span>
                </div>

                {/* Image Thumbnail for Task 1 */}
                {t.imageUrl && (
                  <div
                    onClick={() => setPreviewImageUrl(t.imageUrl || null)}
                    className="relative w-full h-36 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface-subtle)] cursor-pointer group/img"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.imageUrl}
                      alt={t.title}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                      <Maximize2 className="w-4 h-4" />
                      <span>Kattalashtirish</span>
                    </div>
                  </div>
                )}

                {/* Title & Prompt */}
                <div>
                  <h4 className="text-sm font-bold text-[var(--foreground)] line-clamp-1 group-hover:text-[var(--primary)] transition-colors">
                    {t.title}
                  </h4>
                  <p className="text-xs text-[var(--secondary)] line-clamp-3 mt-1 leading-relaxed">
                    {t.prompt}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 mt-3 border-t border-[var(--border)] flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-[var(--muted)]">
                  Min. {t.wordRequirement} so‘z
                </span>

                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/writing?task=${t.id}`}
                    target="_blank"
                    className="btn-secondary !py-1 !px-2.5 text-xs inline-flex items-center gap-1"
                    title="Saytda ochish va sinab ko‘rish"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Sinab ko‘rish</span>
                  </Link>

                  <button
                    onClick={() => handleDelete(t.id, t.title)}
                    className="p-1.5 rounded-lg text-[var(--muted)] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="O‘chirish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="card p-6 space-y-5 w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl bg-[var(--surface)] border border-[var(--border)] rounded-3xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <span className="eyebrow text-[10px]">Cloudflare R2 Integratsiyasi</span>
                <h2 className="text-lg font-black text-[var(--foreground)] tracking-tight">
                  Yangi IELTS Writing Vazifasi Joylash
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-[var(--surface-subtle)] text-[var(--muted)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Task Type Switch */}
              <div className="space-y-1.5">
                <label className="font-bold text-[var(--foreground)]">Vazifa Turi (Task Type) *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleTaskTypeChange("task1")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      taskType === "task1"
                        ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs"
                        : "bg-[var(--surface-subtle)] border-[var(--border)] text-[var(--secondary)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    <span className="font-bold block text-sm">Task 1: Academic Report</span>
                    <span className="text-[10px] opacity-90 block mt-0.5">
                      Grafik, jadval, diagramma yoki xarita (Rasm bilan)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTaskTypeChange("task2")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      taskType === "task2"
                        ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs"
                        : "bg-[var(--surface-subtle)] border-[var(--border)] text-[var(--secondary)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    <span className="font-bold block text-sm">Task 2: Essay</span>
                    <span className="text-[10px] opacity-90 block mt-0.5">
                      Fikr bildirish, muammo va yechim insholari
                    </span>
                  </button>
                </div>
              </div>

              {/* TASK 1: CLOUDFLARE R2 IMAGE UPLOADER */}
              {taskType === "task1" && (
                <div className="p-4 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--foreground)] flex items-center gap-1.5">
                      <UploadCloud className="w-4 h-4 text-[var(--primary)]" />
                      <span>Task 1 Rasmini Tanlang & Yuklang (Cloudflare R2) *</span>
                    </span>
                    <span className="text-[10px] text-[var(--muted)]">PNG, JPG, WEBP (Max 15MB)</span>
                  </div>

                  {/* Drop zone / Upload box */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setImageDragOver(true);
                    }}
                    onDragLeave={() => setImageDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                      imageDragOver
                        ? "border-[var(--primary)] bg-[var(--primary)]/5"
                        : imageUrl
                        ? "border-emerald-500/40 bg-emerald-500/5"
                        : "border-[var(--border)] hover:border-[var(--primary)] bg-[var(--surface)]"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                    />

                    {uploadingImage ? (
                      <div className="flex flex-col items-center justify-center gap-2 py-3">
                        <div className="w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-semibold text-[var(--primary)]">
                          {uploadProgressText}
                        </span>
                      </div>
                    ) : imageUrl ? (
                      <div className="space-y-3">
                        <div className="relative max-h-48 rounded-lg overflow-hidden border border-[var(--border)] inline-block">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imageUrl}
                            alt="Uploaded chart preview"
                            className="max-h-48 object-contain mx-auto"
                          />
                        </div>
                        <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Rasm Cloudflare R2 ga muvaffaqiyatli yuklandi</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageUrl("");
                          }}
                          className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                        >
                          Rasmni almashtirish
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 py-2">
                        <div className="w-10 h-10 rounded-xl bg-[var(--surface-subtle)] text-[var(--primary)] mx-auto flex items-center justify-center">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-bold text-[var(--foreground)]">
                            Kompyuterdan rasm tanlash uchun bosing
                          </span>
                          <span className="text-[11px] text-[var(--muted)] block">
                            yoki rasmni shu yerga sudrab tashlang (Drag & Drop)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Manual URL fallback */}
                  <div className="pt-1">
                    <label className="text-[11px] text-[var(--muted)] flex items-center justify-between">
                      <span>Yoki to‘g‘ridan-to‘g‘ri rasm havolasini (URL) kiriting:</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://pub-7625...r2.dev/writing-task1/chart.png"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full mt-1 py-1.5 px-3 text-xs rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)]"
                    />
                  </div>
                </div>
              )}

              {/* Title & Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="space-y-1">
                  <span className="font-bold text-[var(--foreground)]">Topshiriq Nomi (Title) *</span>
                  <input
                    type="text"
                    required
                    placeholder={
                      taskType === "task1"
                        ? "masalan: European Household Internet Access (2010–2024)"
                        : "masalan: Artificial Intelligence in Workplaces"
                    }
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full py-2 px-3 text-xs rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--foreground)]"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-bold text-[var(--foreground)]">Kategoriya / Vizual Turi *</span>
                  <select
                    value={categoryTag}
                    onChange={(e) => setCategoryTag(e.target.value)}
                    className="w-full py-2 px-3 text-xs rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--foreground)] font-semibold"
                  >
                    {(taskType === "task1" ? TASK1_CATEGORIES : TASK2_CATEGORIES).map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Prompt */}
              <label className="space-y-1 block">
                <span className="font-bold text-[var(--foreground)]">Rasmiy Savol Matni (Prompt) *</span>
                <textarea
                  required
                  rows={4}
                  placeholder={
                    taskType === "task1"
                      ? "The bar chart illustrates the percentage of households with access to high-speed internet across four European nations between 2010 and 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant."
                      : "Some people believe that universities should focus exclusively on preparing students for future employment, while others think education has a broader purpose. Discuss both views and give your opinion."
                  }
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full py-2 px-3 text-xs rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--foreground)] leading-relaxed"
                />
              </label>

              {/* Visual Description (Optional, for Task 1) */}
              {taskType === "task1" && (
                <label className="space-y-1 block">
                  <span className="font-bold text-[var(--foreground)]">
                    Vizual Ma’lumot Tasviri (Asosiy tendensiyalar / Ekranni o‘qish uchun)
                  </span>
                  <textarea
                    rows={2}
                    placeholder="Bar chart showing growth from 45% to 92% in Germany, 40% to 88% in France..."
                    value={visualDescription}
                    onChange={(e) => setVisualDescription(e.target.value)}
                    className="w-full py-2 px-3 text-xs rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--foreground)] leading-relaxed"
                  />
                </label>
              )}

              {/* Model Answer (Optional Band 8-9 Sample) */}
              <label className="space-y-1 block">
                <span className="font-bold text-[var(--foreground)] flex items-center justify-between">
                  <span>Namunaviy Band 8-9 Insho (Model Answer - ixtiyoriy)</span>
                  <span className="text-[10px] text-[var(--muted)] font-normal">
                    O‘quvchilar tahlil qilingach solishtirishlari uchun
                  </span>
                </span>
                <textarea
                  rows={4}
                  placeholder="The provided chart delineates the proportion of households having high-speed digital connectivity..."
                  value={modelAnswer}
                  onChange={(e) => setModelAnswer(e.target.value)}
                  className="w-full py-2 px-3 text-xs rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--foreground)] leading-relaxed"
                />
              </label>

              {/* Time and Words row */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <label className="space-y-1">
                  <span className="font-bold text-[var(--foreground)]">Tavsiya Vaqti (Daqiqa)</span>
                  <input
                    type="number"
                    value={suggestedMinutes}
                    onChange={(e) => setSuggestedMinutes(Number(e.target.value))}
                    className="w-full py-1.5 px-3 text-xs rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--foreground)]"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-bold text-[var(--foreground)]">Minimal So‘zlar Soni</span>
                  <input
                    type="number"
                    value={wordRequirement}
                    onChange={(e) => setWordRequirement(Number(e.target.value))}
                    className="w-full py-1.5 px-3 text-xs rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--foreground)]"
                  />
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary !py-2 !px-4 text-xs font-semibold cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="btn-primary !py-2 !px-5 text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Nashr qilinmoqda...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Nashr qilish (Publish)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL */}
      {previewImageUrl && (
        <div
          onClick={() => setPreviewImageUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-zoom-out animate-fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setPreviewImageUrl(null)}
              className="absolute -top-10 right-0 text-white hover:text-[var(--primary)] text-sm font-bold flex items-center gap-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
              <span>Yopish</span>
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImageUrl}
              alt="Full chart view"
              className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl object-contain border border-white/10"
            />
          </div>
        </div>
      )}
    </div>
  );
}
