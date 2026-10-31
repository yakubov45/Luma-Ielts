"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Volume2,
  AlertCircle,
  CheckCircle2,
  Download,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  HelpCircle,
  FileEdit,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
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
import {
  ALL_SPEAKING_TOPICS,
  SpeakingTopicItem,
  UsefulChunk,
} from "@/lib/speaking/sample-data";
import {
  fetchSpeakingTopics,
  syncSpeakingTopicsToFirestore,
  saveChunkToUserVocabulary,
} from "@/lib/services/speaking-service";

export type SpeakingCategoryTab = "all" | "part1" | "part2" | "part3" | "full_mock" | "my_recordings";
export type { SpeakingTopicItem, UsefulChunk };

const TOPIC_FILTER_OPTIONS: SkillFilterOption[] = [
  { id: "all", label: "Barcha mavzular" },
  { id: "daily_life", label: "Daily Life (Kundalik hayot)" },
  { id: "technology", label: "Technology & AI" },
  { id: "study_work", label: "Study & Work" },
  { id: "art_culture", label: "Art & Music" },
  { id: "travel", label: "Travel & Cars" },
  { id: "environment", label: "Environment & Parks" },
];


export type SpeakingAttempt = {
  id: string;
  part: number | string;
  topic: string;
  durationSeconds: number;
  audioUrl: string;
  createdAt: number;
};

const LOCAL_STORAGE_RECORDINGS_KEY = "ielts_focus_speaking_recordings";

export default function SpeakingPage() {
  const { user } = useAuth();

  // Mode: Catalog vs Studio
  const [activeTopic, setActiveTopic] = useState<SpeakingTopicItem | null>(null);

  // Topics and DB sync
  const [topics, setTopics] = useState<SpeakingTopicItem[]>(ALL_SPEAKING_TOPICS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [savedChunkKeys, setSavedChunkKeys] = useState<Set<string>>(new Set());
  const [chunkSearch, setChunkSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch speaking topics from Firestore or fallback
  useEffect(() => {
    fetchSpeakingTopics().then((res) => {
      if (res && res.length > 0) {
        setTopics(res);
      }
    });
  }, []);

  const handleSyncToFirestore = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await syncSpeakingTopicsToFirestore();
      setSyncMessage(res.message);
      if (res.success) {
        const updated = await fetchSpeakingTopics();
        if (updated && updated.length > 0) setTopics(updated);
      }
      setTimeout(() => setSyncMessage(null), 6000);
    } catch (err: unknown) {
      setSyncMessage("Xatolik: " + ((err as Error)?.message || "DB ga yuklashda muammo yuz berdi."));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveChunk = async (chunk: UsefulChunk) => {
    if (!activeTopic) return;
    const res = await saveChunkToUserVocabulary(chunk, activeTopic.title, user?.uid);
    if (res.success) {
      setSavedChunkKeys((prev) => new Set(prev).add(chunk.phrase));
      setToastMessage(res.message);
      setTimeout(() => setToastMessage(null), 4000);
    } else {
      setToastMessage(res.message);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };


  // Catalog State
  const [activeCategory, setActiveCategory] = useState<SpeakingCategoryTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedTopicTag, setSelectedTopicTag] = useState("all");
  const [lengthFilter, setLengthFilter] = useState<LengthFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("test_number");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [pastRecordings, setPastRecordings] = useState<SpeakingAttempt[]>([]);

  // Studio / Recording State
  const [prepSecondsLeft, setPrepSecondsLeft] = useState<number | null>(null);
  const [prepNotes, setPrepNotes] = useState("");
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const prepTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load recordings and bookmarks from storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_RECORDINGS_KEY);
      if (raw) setPastRecordings(JSON.parse(raw));
    } catch {}
    setBookmarkedIds(getBookmarks().map((b) => b.id));

    const onSync = () => setBookmarkedIds(getBookmarks().map((b) => b.id));
    window.addEventListener("ielts-bookmarks-updated", onSync);
    return () => window.removeEventListener("ielts-bookmarks-updated", onSync);
  }, []);

  // Save recordings
  const persistRecordings = (updated: SpeakingAttempt[]) => {
    setPastRecordings(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_RECORDINGS_KEY, JSON.stringify(updated));
    } catch {}
  };

  // Recording Timer
  useEffect(() => {
    let timer: number;
    if (recording) {
      timer = window.setInterval(() => setElapsed((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [recording]);

  // Clean up streams on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (prepTimerRef.current) clearInterval(prepTimerRef.current);
    };
  }, []);

  // Part 2: 60-second preparation timer
  const startPrepTimer = () => {
    setPrepSecondsLeft(60);
    if (prepTimerRef.current) clearInterval(prepTimerRef.current);
    prepTimerRef.current = setInterval(() => {
      setPrepSecondsLeft((prev) => {
        if (prev === null || prev <= 1) {
          if (prepTimerRef.current) clearInterval(prepTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = async () => {
    setMicError(null);
    setAudioUrl(null);
    setAudioBlob(null);
    audioChunksRef.current = [];

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Brauzeringiz mikrofon orqali audio yozishni qo‘llab-quvvatlamaydi.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "";

      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType || "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);

        const newAttempt: SpeakingAttempt = {
          id: `spk_${Date.now()}`,
          part: activeTopic ? activeTopic.part : 2,
          topic: activeTopic ? activeTopic.title : "IELTS Speaking Practice",
          durationSeconds: elapsed,
          audioUrl: url,
          createdAt: Date.now(),
        };

        persistRecordings([newAttempt, ...pastRecordings]);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setRecording(true);
      setElapsed(0);
    } catch (err: any) {
      console.error("Microphone error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setMicError("Mikrofon ruxsati berilmadi. Iltimos, brauzer manzil satridagi qulf belgisidan mikrofonni yoqing.");
      } else {
        setMicError(err.message || "Mikrofonni ishga tushirishda xatolik yuz berdi.");
      }
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const resetRecording = () => {
    setAudioUrl(null);
    setAudioBlob(null);
    setElapsed(0);
    setRecording(false);
    setPrepSecondsLeft(null);
    setPrepNotes("");
  };

  const handleDeleteRecording = (id: string) => {
    const next = pastRecordings.filter((r) => r.id !== id);
    persistRecordings(next);
  };

  // Tab counters
  const tabCounts = useMemo(() => {
    return {
      all: topics.length,
      part1: topics.filter((t) => t.part === 1).length,
      part2: topics.filter((t) => t.part === 2).length,
      part3: topics.filter((t) => t.part === 3).length,
      full_mock: topics.filter((t) => t.part === "full_mock").length,
      my_recordings: pastRecordings.length,
    };
  }, [topics, pastRecordings]);

  const tabs = [
    { id: "all", label: "Barchasi", count: tabCounts.all },
    { id: "part1", label: "Part 1 (Kirish)", count: tabCounts.part1 },
    { id: "part2", label: "Part 2 (Cue Card)", count: tabCounts.part2 },
    { id: "part3", label: "Part 3 (Munozara)", count: tabCounts.part3 },
    { id: "full_mock", label: "Full Mock", count: tabCounts.full_mock },
    { id: "my_recordings", label: "Mening Yozuvlarim", count: tabCounts.my_recordings },
  ];

  // Filtering for Catalog
  const filteredTopics = useMemo(() => {
    const list = topics.filter((item) => {
      if (activeCategory === "part1" && item.part !== 1) return false;
      if (activeCategory === "part2" && item.part !== 2) return false;
      if (activeCategory === "part3" && item.part !== 3) return false;
      if (activeCategory === "full_mock" && item.part !== "full_mock") return false;

      if (selectedTopicTag !== "all" && item.topicTag !== selectedTopicTag) {
        return false;
      }

      // Length filter
      if (lengthFilter === "short" && item.durationMinutes >= 5) return false;
      if (lengthFilter === "medium" && (item.durationMinutes < 5 || item.durationMinutes > 10)) return false;
      if (lengthFilter === "long" && item.durationMinutes <= 10) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesTag = item.topicLabel.toLowerCase().includes(q);
        if (!matchesTitle && !matchesTag) return false;
      }

      const hasRecord = pastRecordings.some((r) => r.topic === item.title);
      const isSaved = bookmarkedIds.includes(item.id);
      if (statusFilter === "saved" && !isSaved) return false;
      if (statusFilter === "completed" && !hasRecord) return false;
      if (statusFilter === "not_started" && hasRecord) return false;

      return true;
    });

    const sorted = [...list];
    if (sortBy === "newest") sorted.reverse();
    else if (sortBy === "title_az") sorted.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === "shortest") sorted.sort((a, b) => a.durationMinutes - b.durationMinutes);

    return sorted;
  }, [activeCategory, selectedTopicTag, lengthFilter, sortBy, searchQuery, statusFilter, pastRecordings, bookmarkedIds]);

  const resetAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSelectedTopicTag("all");
    setLengthFilter("all");
    setSortBy("test_number");
    setActiveCategory("all");
  };

  const recentRecording = pastRecordings[0] || null;

  // STUDIO VIEW
  if (activeTopic) {
    const minsStr = Math.floor(elapsed / 60).toString().padStart(2, "0");
    const secsStr = (elapsed % 60).toString().padStart(2, "0");

    return (
      <div className="space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <button
            onClick={() => {
              resetRecording();
              setActiveTopic(null);
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Speaking Katalogiga qaytish</span>
          </button>

          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[var(--primary)] border border-orange-200/50">
            {activeTopic.part === "full_mock" ? "To‘liq Mock" : `Speaking Part ${activeTopic.part}`}
          </span>
        </div>

        {/* In-Studio Toast notification */}
        {toastMessage && (
          <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-900/50 text-xs font-bold text-green-800 dark:text-green-200 flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>{toastMessage}</span>
            </div>
            <Link href="/vocabulary" className="underline text-[11px] hover:opacity-80">
              Lug‘atga o‘tish →
            </Link>
          </div>
        )}

        {/* Studio Card */}
        <div className="card p-6 md:p-8 space-y-6 bg-[var(--surface)] border-2 border-[var(--border)] shadow-sm">
          <div className="space-y-2">
            <span className="eyebrow text-xs">{activeTopic.topicLabel}</span>
            <h2 className="text-xl md:text-2xl font-black text-[var(--foreground)] tracking-tight">
              {activeTopic.title}
            </h2>
            <p className="text-xs text-[var(--secondary)]">
              {activeTopic.questionsOrCueCard.leadIn}
            </p>
          </div>

          {/* Part 2 Cue Card Points */}
          {activeTopic.questionsOrCueCard.points && (
            <div className="p-5 rounded-2xl bg-[var(--surface-subtle)] border-2 border-[var(--primary)]/30 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                IELTS Speaking Part 2 Cue Card
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-[var(--foreground)] list-disc pl-5">
                {activeTopic.questionsOrCueCard.points.map((pt, i) => (
                  <li key={i} className="leading-relaxed">
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Part 1 & 3 Follow-up Questions */}
          {activeTopic.questionsOrCueCard.followUpQuestions && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                Imtihonchi savollari:
              </h4>
              <div className="space-y-2">
                {activeTopic.questionsOrCueCard.followUpQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-xs sm:text-sm text-[var(--foreground)] flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Useful Chunks of Language */}
          {activeTopic.questionsOrCueCard.usefulChunks &&
            activeTopic.questionsOrCueCard.usefulChunks.length > 0 && (
              <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border-2 border-amber-300/60 dark:border-amber-800/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 dark:border-amber-900/40 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-amber-950 dark:text-amber-200 flex items-center gap-2">
                        <span>Foydali iboralar va kollokatsiyalar (Useful chunks of language)</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                          {activeTopic.questionsOrCueCard.usefulChunks.length} ta
                        </span>
                      </h4>
                      <p className="text-[11px] text-[var(--muted)]">
                        Part 1 da yuqori ball (Lexical Resource 7.0+) olish uchun nutqingizda qo‘llang.
                      </p>
                    </div>
                  </div>

                  {activeTopic.questionsOrCueCard.usefulChunks.length > 6 && (
                    <input
                      type="text"
                      value={chunkSearch}
                      onChange={(e) => setChunkSearch(e.target.value)}
                      placeholder="Iboralarni qidirish..."
                      className="px-2.5 py-1 text-xs rounded-lg bg-[var(--surface)] border border-amber-300/50 dark:border-amber-900/50 text-[var(--foreground)] w-full sm:w-48 placeholder:text-[var(--muted)]"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
                  {activeTopic.questionsOrCueCard.usefulChunks
                    .filter((c) => {
                      if (!chunkSearch.trim()) return true;
                      const q = chunkSearch.toLowerCase().trim();
                      const phrase = typeof c === "string" ? c : c.phrase;
                      const meaning = typeof c === "string" ? "" : c.meaning;
                      return phrase.toLowerCase().includes(q) || meaning.toLowerCase().includes(q);
                    })
                    .map((chunk, cIdx) => {
                      const phrase = typeof chunk === "string" ? chunk : chunk.phrase;
                      const meaning = typeof chunk === "string" ? "" : chunk.meaning;
                      const isSaved = savedChunkKeys.has(phrase);

                      return (
                        <div
                          key={cIdx}
                          className="p-3 rounded-xl bg-[var(--surface)] border border-amber-200/50 dark:border-amber-900/40 hover:border-[var(--primary)] flex items-start justify-between gap-2.5 transition-all shadow-xs"
                        >
                          <div className="min-w-0 space-y-0.5">
                            <span className="text-xs font-bold text-[var(--foreground)] block">
                              {phrase}
                            </span>
                            {meaning && (
                              <span className="text-[11px] text-[var(--muted)] block leading-snug">
                                {meaning}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleSaveChunk(
                                typeof chunk === "string" ? { phrase, meaning: "" } : chunk
                              )
                            }
                            disabled={isSaved}
                            title={isSaved ? "Lug‘atda saqlangan" : "Shaxsiy lug‘at daftaringizga saqlash"}
                            className={`shrink-0 px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                              isSaved
                                ? "bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300"
                                : "bg-orange-100 hover:bg-orange-200 dark:bg-orange-950/50 text-[var(--primary)]"
                            }`}
                          >
                            {isSaved ? (
                              <>
                                <Check className="w-3 h-3 text-green-600" />
                                <span>Saqlandi</span>
                              </>
                            ) : (
                              <>
                                <span>+ Lug‘atga</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}


          {/* Part 2: Preparation Timer & Scratchpad */}
          {activeTopic.part === 2 && (
            <div className="p-4 rounded-xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200/50 dark:border-orange-900/40 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-[var(--foreground)] block">
                    1 Daqiqalik Tayyorgarlik Vaqti (Part 2)
                  </span>
                  <span className="text-[11px] text-[var(--muted)]">
                    Qog‘ozga reja tuzish va kalit so‘zlarni yozib olish imkoniyati.
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {prepSecondsLeft !== null ? (
                    <span className="text-lg font-black text-[var(--primary)] tabular">
                      {prepSecondsLeft} soniya
                    </span>
                  ) : (
                    <button
                      onClick={startPrepTimer}
                      className="btn-secondary !py-1.5 !px-3 text-xs font-bold cursor-pointer"
                    >
                      Tayyorgarlikni boshlash (60s)
                    </button>
                  )}
                </div>
              </div>

              <textarea
                value={prepNotes}
                onChange={(e) => setPrepNotes(e.target.value)}
                placeholder="Tayyorgarlik qoralamasi (kalit so‘zlar, idiomalar)..."
                rows={3}
                className="w-full p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--foreground)]"
              />
            </div>
          )}

          {/* Microphone Permission Info */}
          <div className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-[11px] text-[var(--muted)] flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[var(--primary)] shrink-0" />
            <span>
              <strong>Nima uchun mikrofon kerak?</strong> Javobingiz faqat brauzeringizda yoziladi va o‘zingiz eshitib, ravonlikni tahlil qilishingiz uchun saqlanadi.
            </span>
          </div>

          {/* Mic Error */}
          {micError && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{micError}</span>
            </div>
          )}

          {/* Recording Control Center */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div
                className={`w-3.5 h-3.5 rounded-full ${
                  recording ? "bg-rose-500 animate-pulse" : "bg-[var(--muted)]"
                }`}
              />
              <span className="text-2xl font-black font-mono text-[var(--foreground)] tabular">
                {minsStr}:{secsStr}
              </span>
              <span className="text-xs text-[var(--muted)]">
                {recording ? "Yozib olinmoqda…" : "Yozuv to‘xtatilgan"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {!recording ? (
                <button
                  onClick={startRecording}
                  className="btn-primary !py-2.5 !px-5 text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Mic className="w-4 h-4" />
                  <span>{audioUrl ? "Qayta yozish" : "Audio yozishni boshlash"}</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="!py-2.5 !px-5 text-xs sm:text-sm font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Yozishni tugatish</span>
                </button>
              )}
            </div>
          </div>

          {/* Audio Playback Card */}
          {audioUrl && (
            <div className="p-5 rounded-2xl bg-orange-50/40 dark:bg-orange-950/20 border border-[var(--primary)]/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Audio muvaffaqiyatli saqlandi!
                </span>
                <a
                  href={audioUrl}
                  download={`ielts-speaking-${Date.now()}.webm`}
                  className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1 font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Yuklab olish</span>
                </a>
              </div>

              <audio controls src={audioUrl} className="w-full" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // MY RECORDINGS VIEW
  if (activeCategory === "my_recordings") {
    return (
      <div className="space-y-6">
        <CatalogHeader
          eyebrow="IELTS SPEAKING MODULI"
          title="Mening Yozuvlarim"
          description="Siz yozib olgan Speaking javoblari, audio yozuvlar va ravonlik tahlillari."
          icon={Mic}
          stats={[
            { label: "Yozuvlar", value: pastRecordings.length },
          ]}
        />

        <CategoryTabs
          tabs={tabs}
          activeTab={activeCategory}
          onChange={(id) => setActiveCategory(id as SpeakingCategoryTab)}
        />

        {pastRecordings.length === 0 ? (
          <EmptyCatalogState
            type="no_submissions"
            title="Yozib olingan audiolar yo‘q"
            description="Siz hali biror mavzu bo‘yicha nutq yozib olmadingiz. Mavzuni tanlab, mikrofon orqali mashq qiling."
            onReset={() => setActiveCategory("all")}
          />
        ) : (
          <div className="space-y-3">
            {pastRecordings.map((rec) => (
              <div
                key={rec.id}
                className="card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[var(--border)] bg-[var(--surface)] rounded-2xl"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--surface-subtle)] text-[var(--primary)] border border-[var(--border)] uppercase">
                      {rec.part === "full_mock" ? "Full Mock" : `Part ${rec.part}`}
                    </span>
                    <span className="text-xs text-[var(--muted)]">
                      {new Date(rec.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[var(--foreground)]">
                    {rec.topic}
                  </h4>
                  <span className="text-xs text-[var(--muted)] block">
                    Davomiyligi: {Math.floor(rec.durationSeconds / 60)} daqiqa {rec.durationSeconds % 60} soniya
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {rec.audioUrl && (
                    <audio controls src={rec.audioUrl} className="h-8 max-w-[200px]" />
                  )}

                  <button
                    onClick={() => handleDeleteRecording(rec.id)}
                    className="p-2 rounded-lg text-[var(--muted)] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                    title="O‘chirish"
                  >
                    <Trash2 className="w-4 h-4" />
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
        eyebrow="IELTS SPEAKING MODULI"
        title="IELTS Academic Speaking"
        description="Part 1 kundalik savollari, Part 2 mustaqil nutq (Cue Card) va Part 3 analitik munozara katalogi."
        icon={Mic}
        stats={[
          { label: "Mavzular", value: topics.length },
          { label: "Yozuvlar", value: pastRecordings.length },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncToFirestore}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 text-[var(--primary)] border border-orange-200/60 dark:border-orange-900/40 transition-colors cursor-pointer disabled:opacity-60"
              title="Barcha Speaking Part 1 savollari va foydali iboralarini Firestore bazasiga yuklash"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "DB ga yuklanmoqda..." : "DB ga push qilish"}</span>
            </button>

            <Link
              href="/mock-tests"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[var(--surface-subtle)] hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>4 Modulli Mock Testlar</span>
            </Link>
          </div>
        }
      />

      {/* Sync Status Banner */}
      {syncMessage && (
        <div className="p-3.5 rounded-xl bg-orange-50 dark:bg-orange-950/50 border border-orange-200 text-xs font-bold text-[var(--primary)] flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{syncMessage}</span>
          </div>
          <button
            onClick={() => setSyncMessage(null)}
            className="text-[11px] underline cursor-pointer hover:opacity-80 shrink-0"
          >
            Yopish
          </button>
        </div>
      )}


      {/* 2. Continue Card if recent recording exists */}
      {recentRecording && (
        <ContinueCard
          title={recentRecording.topic}
          subtitle={`So‘nggi audio: ${Math.floor(recentRecording.durationSeconds / 60)} daq ${recentRecording.durationSeconds % 60} soniya`}
          durationLabel={`${new Date(recentRecording.createdAt).toLocaleDateString()} da yozilgan`}
          badgeText="Oxirgi yozuv"
          onAction={() => setActiveCategory("my_recordings")}
          actionLabel="Yozuvlarni eshitish"
        />
      )}

      {/* 3. Category Tabs */}
      <CategoryTabs
        tabs={tabs}
        activeTab={activeCategory}
        onChange={(id) => {
          setActiveCategory(id as SpeakingCategoryTab);
          setSelectedTopicTag("all");
        }}
      />

      {/* 4. Filter Bar with Dropdowns and Sort */}
      <CatalogFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={
          activeCategory !== "full_mock"
            ? {
                label: "All Topics (Barcha mavzular)",
                options: TOPIC_FILTER_OPTIONS,
                selected: selectedTopicTag,
                onChange: setSelectedTopicTag,
              }
            : undefined
        }
        lengthFilter={lengthFilter}
        onLengthChange={setLengthFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={topics.length}
        filteredCount={filteredTopics.length}
        onResetFilters={resetAllFilters}
      />

      {/* 5. Content: List View (default) or Grid View */}
      {filteredTopics.length === 0 ? (
        <EmptyCatalogState
          type={statusFilter === "saved" ? "no_saved" : "no_results"}
          onReset={resetAllFilters}
        />
      ) : viewMode === "list" ? (
        <div className="space-y-2.5">
          {filteredTopics.map((topic, idx) => {
            const hasRec = pastRecordings.some((r) => r.topic === topic.title);
            const status = hasRec ? "completed" : "not_started";

            const cardData: ActivityCardData = {
              id: topic.id,
              skill: "speaking",
              title: topic.title,
              topic: topic.topicLabel,
              typeBadge:
                topic.part === "full_mock"
                  ? "Full Mock"
                  : topic.part === 2
                  ? "Part 2 (Cue Card)"
                  : `Part ${topic.part}`,
              typeBadgeColor:
                topic.part === 1
                  ? "emerald"
                  : topic.part === 2
                  ? "primary"
                  : topic.part === 3
                  ? "indigo"
                  : "purple",
              itemCountLabel:
                topic.part === 2
                  ? "1 daqiqa tayyorgarlik · 2 daqiqa nutq"
                  : `${topic.questionCount} ta savol${
                      topic.questionsOrCueCard.usefulChunks
                        ? ` · ${topic.questionsOrCueCard.usefulChunks.length} ta ibora`
                        : ""
                    }`,
              durationMinutes: topic.durationMinutes,
              status,
              onAction: () => setActiveTopic(topic),
              actionLabel: hasRec ? "Qayta yozib olish" : "Mashqni boshlash",
            };

            return <ActivityListItem key={topic.id} item={cardData} index={idx} />;
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map((topic) => {
            const hasRec = pastRecordings.some((r) => r.topic === topic.title);
            const status = hasRec ? "completed" : "not_started";

            const cardData: ActivityCardData = {
              id: topic.id,
              skill: "speaking",
              title: topic.title,
              topic: topic.topicLabel,
              typeBadge:
                topic.part === "full_mock"
                  ? "Full Mock"
                  : topic.part === 2
                  ? "Part 2 (Cue Card)"
                  : `Part ${topic.part}`,
              typeBadgeColor:
                topic.part === 1
                  ? "emerald"
                  : topic.part === 2
                  ? "primary"
                  : topic.part === 3
                  ? "indigo"
                  : "purple",
              itemCountLabel:
                topic.part === 2
                  ? "1 daqiqa tayyorgarlik · 2 daqiqa nutq"
                  : `${topic.questionCount} ta savol${
                      topic.questionsOrCueCard.usefulChunks
                        ? ` · ${topic.questionsOrCueCard.usefulChunks.length} ta ibora`
                        : ""
                    }`,
              durationMinutes: topic.durationMinutes,
              status,
              onAction: () => setActiveTopic(topic),
              actionLabel: hasRec ? "Qayta yozib olish" : "Mashqni boshlash",
            };

            return <ActivityCard key={topic.id} item={cardData} />;
          })}
        </div>
      )}
    </div>
  );
}
