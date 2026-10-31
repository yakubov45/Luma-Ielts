"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Layers,
  Award,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { saveTestAttempt, calculateIeltsBand, fetchUserAttempts, TestAttempt } from "@/lib/services/attempts-service";
import { recordMistakesFromTest } from "@/lib/services/mistakes-service";
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
import { ListeningWorkspace } from "@/components/listening/ListeningWorkspace";

interface TranscriptSegment {
  id: number;
  speaker: "Adviser" | "Student";
  text: string;
  startSec: number;
  endSec: number;
}

const TRANSCRIPT_SEGMENTS: TranscriptSegment[] = [
  {
    id: 1,
    speaker: "Adviser",
    text: "Good morning, Student Accommodation Office. How can I help you today?",
    startSec: 0,
    endSec: 5,
  },
  {
    id: 2,
    speaker: "Student",
    text: "Hello. I am starting my postgraduate degree next month and I need to register for a hall of residence if possible.",
    startSec: 5,
    endSec: 13,
  },
  {
    id: 3,
    speaker: "Adviser",
    text: "Certainly. What is your expected monthly budget for rent and utilities?",
    startSec: 13,
    endSec: 19,
  },
  {
    id: 4,
    speaker: "Student",
    text: "Well, my scholarship gives me a strict limit of four hundred and fifty pounds per month.",
    startSec: 19,
    endSec: 26,
  },
  {
    id: 5,
    speaker: "Adviser",
    text: "Understood. 450 pounds. And for your shared kitchen, do you have any specific dietary requirements?",
    startSec: 26,
    endSec: 34,
  },
  {
    id: 6,
    speaker: "Student",
    text: "Yes, I would strongly prefer a Halal kitchen if one is currently available.",
    startSec: 34,
    endSec: 41,
  },
  {
    id: 7,
    speaker: "Adviser",
    text: "Noted. And could you please confirm your contact telephone extension number?",
    startSec: 41,
    endSec: 48,
  },
  {
    id: 8,
    speaker: "Student",
    text: "It is extension two eight four.",
    startSec: 48,
    endSec: 54,
  },
  {
    id: 9,
    speaker: "Adviser",
    text: "Great, 284. I have entered that into our accommodation portal.",
    startSec: 54,
    endSec: 60,
  },
];

const TOTAL_DURATION = 60; // 60 seconds

export type ListeningCategoryTab = "all" | "full_tests" | "section_practice" | "dictation";

interface ListeningCatalogItem {
  id: string;
  category: "full_tests" | "section_practice" | "dictation";
  title: string;
  topic: string;
  sectionNumber?: number;
  typeBadge: string;
  typeBadgeColor?: "primary" | "indigo" | "emerald" | "amber" | "purple";
  itemCountLabel: string;
  durationMinutes: number;
  isPlayable: boolean;
}

const LISTENING_CATALOG_ITEMS: ListeningCatalogItem[] = [
  // Full Tests
  {
    id: "listening-mock-1",
    category: "full_tests",
    title: "IELTS Academic Listening Full Test 1",
    topic: "Accommodation, City Tours, University Tutorial & Solar Energy",
    typeBadge: "To‘liq Test",
    typeBadgeColor: "primary",
    itemCountLabel: "4 ta bo‘lim · 40 ta savol",
    durationMinutes: 30,
    isPlayable: true,
  },
  {
    id: "listening-mock-2",
    category: "full_tests",
    title: "IELTS Academic Listening Full Test 2",
    topic: "Library Registration, Local Heritage, Marine Biology & Geothermal Tech",
    typeBadge: "To‘liq Test",
    typeBadgeColor: "primary",
    itemCountLabel: "4 ta bo‘lim · 40 ta savol",
    durationMinutes: 30,
    isPlayable: true,
  },
  // Section Practice
  {
    id: "oyster-bay-sailing-club",
    category: "section_practice",
    sectionNumber: 1,
    title: "Oyster Bay Sailing Club Courses (Cambridge IELTS)",
    topic: "Beginner Sailing Courses & Practical Information (Table & Notes)",
    typeBadge: "Jadval & Eslatma",
    typeBadgeColor: "emerald",
    itemCountLabel: "1 ta audio · 10 ta savol (1–10)",
    durationMinutes: 4,
    isPlayable: true,
  },
  {
    id: "section-1-accommodation",
    category: "section_practice",
    sectionNumber: 1,
    title: "Section 1: Student Accommodation Office Registration",
    topic: "Social & Daily Living",
    typeBadge: "1-Bo‘lim (Dialog)",
    typeBadgeColor: "emerald",
    itemCountLabel: "1 ta audio · 4 ta savol",
    durationMinutes: 5,
    isPlayable: true,
  },
  {
    id: "section-2-campus-facilities",
    category: "section_practice",
    sectionNumber: 2,
    title: "Section 2: Campus Facilities & Sports Complex Orientation",
    topic: "Public Information Monologue",
    typeBadge: "2-Bo‘lim (Monolog)",
    typeBadgeColor: "indigo",
    itemCountLabel: "1 ta audio · 10 ta savol",
    durationMinutes: 7,
    isPlayable: true,
  },
  {
    id: "section-3-research-assignment",
    category: "section_practice",
    sectionNumber: 3,
    title: "Section 3: Academic Tutorial on Cognitive Linguistics Research",
    topic: "Academic Discussion (2-3 speakers)",
    typeBadge: "3-Bo‘lim (Akademik)",
    typeBadgeColor: "amber",
    itemCountLabel: "1 ta audio · 10 ta savol",
    durationMinutes: 8,
    isPlayable: true,
  },
  {
    id: "section-4-grid-lecture",
    category: "section_practice",
    sectionNumber: 4,
    title: "Section 4: University Lecture on Renewable Grid Battery Storage",
    topic: "Academic Lecture",
    typeBadge: "4-Bo‘lim (Ma‘ruza)",
    typeBadgeColor: "purple",
    itemCountLabel: "1 ta audio · 10 ta savol",
    durationMinutes: 10,
    isPlayable: true,
  },
  // Dictation
  {
    id: "listening-dictation-studio",
    category: "dictation",
    title: "Akademik IELTS Diktant & Eshitib Yozish Studiyasi",
    topic: "Fonetik tahlil va so‘zlarni to‘g‘ri yozish mashqi",
    typeBadge: "Diktant",
    typeBadgeColor: "purple",
    itemCountLabel: "Gapma-gap tinglash · Jonli baholash",
    durationMinutes: 10,
    isPlayable: true,
  },
];

const SECTION_OPTIONS: SkillFilterOption[] = [
  { id: "all", label: "Barcha bo‘limlar" },
  { id: "sec1", label: "Section 1 (Kundalik dialog)" },
  { id: "sec2", label: "Section 2 (Monolog)" },
  { id: "sec3", label: "Section 3 (Akademik bahs)" },
  { id: "sec4", label: "Section 4 (Ma‘ruza)" },
];

export default function ListeningPage() {
  const { user } = useAuth();

  // Mode: Catalog vs Active Player
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null);
  const [practiceMode, setPracticeMode] = useState<"practice" | "exam">("practice");

  // Catalog State
  const [activeCategory, setActiveCategory] = useState<ListeningCategoryTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedSection, setSelectedSection] = useState("all");
  const [lengthFilter, setLengthFilter] = useState<LengthFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("test_number");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Audio Playback State (for active activity)
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const [speed, setSpeed] = useState<number>(1.0);
  const [activeTab, setActiveTab] = useState<"questions" | "dictation">("questions");

  // Questions and Form State
  const [answers, setAnswers] = useState<Record<string, string>>({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Dictation state
  const [dictationInput, setDictationInput] = useState("");
  const [dictationResult, setDictationResult] = useState<{
    accuracy: number;
    wordsDiff: Array<{ word: string; status: "match" | "missed" | "extra" }>;
  } | null>(null);

  // Timer Ref for audio simulation
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    fetchUserAttempts(user?.uid).then((res) => {
      setAttempts(res.filter((a) => a.skill === "listening"));
    });
    setBookmarkedIds(getBookmarks().map((b) => b.id));

    const onSync = () => setBookmarkedIds(getBookmarks().map((b) => b.id));
    window.addEventListener("ielts-bookmarks-updated", onSync);
    return () => window.removeEventListener("ielts-bookmarks-updated", onSync);
  }, [user?.uid]);

  // Speech synthesis helper
  const speakSegment = (index: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    if (index >= TRANSCRIPT_SEGMENTS.length) {
      setIsPlaying(false);
      return;
    }

    const seg = TRANSCRIPT_SEGMENTS[index];
    const utterance = new SpeechSynthesisUtterance(seg.text);
    utterance.rate = speed;
    utterance.lang = "en-GB";

    utterance.onend = () => {
      if (isPlaying && index + 1 < TRANSCRIPT_SEGMENTS.length) {
        setActiveSegmentIndex(index + 1);
        setCurrentTime(TRANSCRIPT_SEGMENTS[index + 1].startSec);
        speakSegment(index + 1);
      } else {
        setIsPlaying(false);
      }
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      setIsPlaying(true);
      speakSegment(activeSegmentIndex);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;
          if (next >= TOTAL_DURATION) {
            setIsPlaying(false);
            return TOTAL_DURATION;
          }
          const segIdx = TRANSCRIPT_SEGMENTS.findIndex(
            (s) => next >= s.startSec && next < s.endSec
          );
          if (segIdx !== -1 && segIdx !== activeSegmentIndex) {
            setActiveSegmentIndex(segIdx);
          }
          return next;
        });
      }, 1000 / speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, activeSegmentIndex]);

  const jumpToSegment = (idx: number) => {
    if (practiceMode === "exam") return; // Exam mode prevents scrubbing
    setActiveSegmentIndex(idx);
    setCurrentTime(TRANSCRIPT_SEGMENTS[idx].startSec);
    if (isPlaying) {
      speakSegment(idx);
    }
  };

  const handleRestart = () => {
    if (practiceMode === "exam") return;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setActiveSegmentIndex(0);
    setCurrentTime(0);
    if (isPlaying) {
      speakSegment(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmitAnswers = async () => {
    setEvaluating(true);

    const q1Ans = (answers.q1 || "").trim().toLowerCase();
    const q1Correct =
      q1Ans === "hall of residence" ||
      q1Ans === "residence hall" ||
      q1Ans === "hall of residences";

    const q2Ans = (answers.q2 || "").trim().replace(/[£,]/g, "");
    const q2Correct = q2Ans === "450" || q2Ans === "four hundred and fifty";

    const q3Ans = (answers.q3 || "").trim().toUpperCase();
    const q3Correct = q3Ans === "B";

    const q4Ans = (answers.q4 || "").trim();
    const q4Correct = q4Ans === "284" || q4Ans === "two eight four";

    let correctCount = 0;
    if (q1Correct) correctCount++;
    if (q2Correct) correctCount++;
    if (q3Correct) correctCount++;
    if (q4Correct) correctCount++;

    setScore(correctCount);
    const totalQuestions = 4;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);
    const band = calculateIeltsBand(accuracy);

    const attempt = await saveTestAttempt(user?.uid, {
      testId: activeActivityId || "section-1-accommodation",
      testTitle: "Section 1: Student Accommodation Office Registration",
      skill: "listening",
      correctCount,
      totalQuestions,
      accuracy,
      estimatedBand: band,
      durationSeconds: currentTime,
      submittedAt: Date.now(),
      answers,
      questionBreakdown: [
        { questionId: "q1", type: "Note Completion", correct: q1Correct },
        { questionId: "q2", type: "Note Completion", correct: q2Correct },
        { questionId: "q3", type: "Multiple Choice", correct: q3Correct },
        { questionId: "q4", type: "Short Answer", correct: q4Correct },
      ],
    });

    const failedQuestions = [
      {
        questionId: "q1",
        prompt: "Type of accommodation preferred: (1) _____.",
        questionType: "Note Completion",
        yourAnswer: answers.q1 || "(Javob berilmagan)",
        correctAnswer: "hall of residence",
        reason: "Talaba 'I need to register for a hall of residence if possible' deb aniq aytadi.",
        correct: q1Correct,
      },
      {
        questionId: "q2",
        prompt: "Maximum monthly budget: £(2) _____.",
        questionType: "Note Completion",
        yourAnswer: answers.q2 || "(Javob berilmagan)",
        correctAnswer: "450",
        reason: "Talaba o‘z stipendiyasi chegarasi 450 funt ekanini ta‘kidlaydi.",
        correct: q2Correct,
      },
      {
        questionId: "q3",
        prompt: "Kitchen dietary preference?",
        questionType: "Multiple Choice",
        yourAnswer: answers.q3 || "(Javob berilmagan)",
        correctAnswer: "B",
        reason: "Talaba 'strongly prefer a Halal kitchen' deb javob beradi.",
        correct: q3Correct,
      },
      {
        questionId: "q4",
        prompt: "Telephone extension number: (4) _____.",
        questionType: "Short Answer",
        yourAnswer: answers.q4 || "(Javob berilmagan)",
        correctAnswer: "284",
        reason: "Talaba 'extension two eight four' deb aytadi.",
        correct: q4Correct,
      },
    ]
      .filter((m) => !m.correct)
      .map(({ questionId, prompt, questionType, yourAnswer, correctAnswer, reason }) => ({
        questionId,
        prompt,
        questionType,
        yourAnswer,
        correctAnswer,
        reason,
      }));

    if (failedQuestions.length > 0) {
      await recordMistakesFromTest(user?.uid, {
        drillId: activeActivityId || "section-1-accommodation",
        drillTitle: "Section 1: Student Accommodation Office Registration",
        skill: "listening",
        failedQuestions,
      });
    }

    setAttempts((prev) => [attempt, ...prev]);
    setSubmitted(true);
    setEvaluating(false);
    setSavedSuccess(true);
  };

  const handleEvaluateDictation = () => {
    const targetText = TRANSCRIPT_SEGMENTS[activeSegmentIndex].text;
    const cleanTarget = targetText.toLowerCase().replace(/[^\w\s]/g, "");
    const cleanUser = dictationInput.toLowerCase().replace(/[^\w\s]/g, "");

    const targetWords = cleanTarget.split(/\s+/).filter(Boolean);
    const userWords = cleanUser.split(/\s+/).filter(Boolean);

    let matchCount = 0;
    const wordsDiff: Array<{ word: string; status: "match" | "missed" | "extra" }> = [];

    targetWords.forEach((tw, idx) => {
      const uw = userWords[idx];
      if (uw === tw) {
        matchCount++;
        wordsDiff.push({ word: tw, status: "match" });
      } else {
        wordsDiff.push({ word: tw, status: "missed" });
      }
    });

    const accuracy = Math.round((matchCount / Math.max(targetWords.length, 1)) * 100);
    setDictationResult({ accuracy, wordsDiff });
  };

  // Filtering for catalog
  const filteredCatalog = useMemo(() => {
    const list = LISTENING_CATALOG_ITEMS.filter((item) => {
      if (activeCategory !== "all" && item.category !== activeCategory) {
        return false;
      }
      if (selectedSection !== "all") {
        if (selectedSection === "sec1" && item.sectionNumber !== 1) return false;
        if (selectedSection === "sec2" && item.sectionNumber !== 2) return false;
        if (selectedSection === "sec3" && item.sectionNumber !== 3) return false;
        if (selectedSection === "sec4" && item.sectionNumber !== 4) return false;
      }
      // Length filter
      if (lengthFilter === "short" && item.durationMinutes >= 10) return false;
      if (lengthFilter === "medium" && (item.durationMinutes < 10 || item.durationMinutes > 20)) return false;
      if (lengthFilter === "long" && item.durationMinutes <= 20) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesTopic = item.topic.toLowerCase().includes(q);
        if (!matchesTitle && !matchesTopic) return false;
      }
      const attempt = attempts.find((a) => a.testId === item.id);
      const isSaved = bookmarkedIds.includes(item.id);
      if (statusFilter === "saved" && !isSaved) return false;
      if (statusFilter === "completed" && !attempt) return false;
      if (statusFilter === "not_started" && attempt) return false;

      return true;
    });

    const sorted = [...list];
    if (sortBy === "newest") sorted.reverse();
    else if (sortBy === "title_az") sorted.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === "shortest") sorted.sort((a, b) => a.durationMinutes - b.durationMinutes);

    return sorted;
  }, [activeCategory, selectedSection, lengthFilter, sortBy, searchQuery, statusFilter, attempts, bookmarkedIds]);

  const tabs = [
    { id: "all", label: "Barchasi", count: LISTENING_CATALOG_ITEMS.length },
    { id: "full_tests", label: "To‘liq Testlar", count: 2 },
    { id: "section_practice", label: "Bo‘lim Mashqlari", count: 4 },
    { id: "dictation", label: "Diktant", count: 1 },
  ];

  const resetAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSelectedSection("all");
    setLengthFilter("all");
    setSortBy("test_number");
    setActiveCategory("all");
  };

  const handleStartActivity = (activityId: string) => {
    setActiveActivityId(activityId);
    if (activityId === "listening-dictation-studio") {
      setActiveTab("dictation");
    } else {
      setActiveTab("questions");
    }
  };

  const handleExitActivity = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    }
    setActiveActivityId(null);
  };

  // RENDER ACTIVE PLAYER WORKSPACE IF SELECTED
  if (activeActivityId) {
    if (activeActivityId !== "listening-dictation-studio") {
      return (
        <ListeningWorkspace
          testId={activeActivityId}
          onExit={handleExitActivity}
        />
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <button
            onClick={handleExitActivity}
            className="inline-flex items-center gap-2 text-xs font-bold text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Listening Katalogiga qaytish</span>
          </button>
        </div>

        {/* Tab 2: Dictation Studio */}
        {activeTab === "dictation" && (
          <div className="card p-6 md:p-8 space-y-6">
            <div>
              <span className="eyebrow">Diktant Mashqi</span>
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Joriy gapni eshitib yozing
              </h3>
              <p className="text-xs text-[var(--secondary)] mt-0.5">
                Yuqoridagi audiodan joriy gapni tinglang va eshitgan matningizni so‘zma-so‘z kiriting.
              </p>
            </div>

            <textarea
              value={dictationInput}
              onChange={(e) => setDictationInput(e.target.value)}
              placeholder="Eshitgan jumlani ingliz tilida yozing..."
              rows={4}
              className="w-full p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-hidden focus:border-[var(--primary)]"
            />

            <div className="flex items-center justify-between">
              <button
                onClick={() => speakSegment(activeSegmentIndex)}
                className="btn-secondary !py-2 !px-4 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Gapni qayta eshitish</span>
              </button>

              <button
                onClick={handleEvaluateDictation}
                className="btn-primary !py-2.5 !px-5 text-xs font-bold cursor-pointer"
              >
                Diktantni tekshirish
              </button>
            </div>

            {dictationResult && (
              <div className="p-4 rounded-xl bg-orange-50/60 dark:bg-orange-950/30 border border-[var(--primary)]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--foreground)]">
                    Diktant Aniqligi:
                  </span>
                  <span className="text-base font-black text-[var(--primary)] tabular">
                    {dictationResult.accuracy}%
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 text-xs font-medium">
                  {dictationResult.wordsDiff.map((wd, i) => (
                    <span
                      key={i}
                      className={`px-2 py-0.5 rounded-md ${
                        wd.status === "match"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold"
                          : "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 line-through"
                      }`}
                    >
                      {wd.word}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // RENDER MAIN CATALOG VIEW
  const recentAttempt = attempts[0] || null;

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <CatalogHeader
        eyebrow="IELTS LISTENING MODULI"
        title="IELTS Academic Listening"
        description="Jonli audio simulyatsiyasi, rasmiy 4 ta bo‘lim qoliplari, to‘liq testlar va gapma-gap diktant mashqlari."
        icon={Headphones}
        stats={[
          { label: "Barcha Mashqlar", value: LISTENING_CATALOG_ITEMS.length },
          { label: "Topshirilgan", value: attempts.length },
        ]}
        actions={
          <Link
            href="/mock-tests"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[var(--surface-subtle)] hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>4 Modulli Mock Testlar</span>
          </Link>
        }
      />

      {/* 2. Continue Card if user has unfinished or recent listening activity */}
      {recentAttempt && (
        <ContinueCard
          title={recentAttempt.testTitle}
          subtitle={`Oldingi natijangiz: Band ${recentAttempt.estimatedBand.toFixed(1)} (${recentAttempt.accuracy}% aniqlik)`}
          durationLabel={`${Math.round(recentAttempt.durationSeconds / 60)} daqiqa sarflandi`}
          badgeText="Oxirgi ishlangan"
          onAction={() => handleStartActivity(recentAttempt.testId)}
          actionLabel="Qayta ishlash / Tahlil"
        />
      )}

      {/* 3. Category Tabs */}
      <CategoryTabs
        tabs={tabs}
        activeTab={activeCategory}
        onChange={(id) => setActiveCategory(id as ListeningCategoryTab)}
      />

      {/* 4. Filter Bar with Dropdowns and Sort */}
      <CatalogFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={
          activeCategory === "section_practice" || activeCategory === "all"
            ? {
                label: "All Sections (Barcha bo‘limlar)",
                options: SECTION_OPTIONS,
                selected: selectedSection,
                onChange: setSelectedSection,
              }
            : undefined
        }
        lengthFilter={lengthFilter}
        onLengthChange={setLengthFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={LISTENING_CATALOG_ITEMS.length}
        filteredCount={filteredCatalog.length}
        onResetFilters={resetAllFilters}
      />

      {/* 5. Content: List View (default) or Grid View */}
      {filteredCatalog.length === 0 ? (
        <EmptyCatalogState
          type={statusFilter === "saved" ? "no_saved" : "no_results"}
          onReset={resetAllFilters}
        />
      ) : viewMode === "list" ? (
        <div className="space-y-2.5">
          {filteredCatalog.map((item, idx) => {
            const attempt = attempts.find((a) => a.testId === item.id);
            const status = attempt ? "completed" : "not_started";

            const cardData: ActivityCardData = {
              id: item.id,
              skill: "listening",
              title: item.title,
              topic: item.topic,
              typeBadge: item.typeBadge,
              typeBadgeColor: item.typeBadgeColor,
              itemCountLabel: item.itemCountLabel,
              durationMinutes: item.durationMinutes,
              status,
              bestBand: attempt?.estimatedBand,
              accuracy: attempt?.accuracy,
              onAction: () => handleStartActivity(item.id),
              actionLabel: attempt ? "Qayta tinglash" : "Mashqni boshlash",
            };

            return <ActivityListItem key={item.id} item={cardData} index={idx} />;
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCatalog.map((item) => {
            const attempt = attempts.find((a) => a.testId === item.id);
            const status = attempt ? "completed" : "not_started";

            const cardData: ActivityCardData = {
              id: item.id,
              skill: "listening",
              title: item.title,
              topic: item.topic,
              typeBadge: item.typeBadge,
              typeBadgeColor: item.typeBadgeColor,
              itemCountLabel: item.itemCountLabel,
              durationMinutes: item.durationMinutes,
              status,
              bestBand: attempt?.estimatedBand,
              accuracy: attempt?.accuracy,
              onAction: () => handleStartActivity(item.id),
              actionLabel: attempt ? "Qayta tinglash" : "Mashqni boshlash",
            };

            return <ActivityCard key={item.id} item={cardData} />;
          })}
        </div>
      )}
    </div>
  );
}
