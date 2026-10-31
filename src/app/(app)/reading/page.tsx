"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  Filter,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { fetchUserAttempts, TestAttempt } from "@/lib/services/attempts-service";
import { getBookmarks } from "@/lib/services/bookmarks-service";
import {
  ALL_READING_CATALOG_ITEMS,
  ReadingCatalogItem,
} from "@/lib/reading/passages-data";
import { syncReadingPassagesToFirestore } from "@/lib/services/reading-service";
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

export type ReadingCategoryTab =
  | "all"
  | "full_tests"
  | "passage_1"
  | "passage_2"
  | "passage_3"
  | "question_type";

const QUESTION_TYPE_OPTIONS: SkillFilterOption[] = [
  { id: "all", label: "Barchasi" },
  { id: "tfng", label: "True / False / Not Given" },
  { id: "sentence_completion", label: "Sentence Completion" },
  { id: "multiple_choice", label: "Multiple Choice" },
  { id: "matching_headings", label: "Matching Headings" },
];

export default function ReadingCatalogPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ReadingCategoryTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedQuestionType, setSelectedQuestionType] = useState("all");
  const [lengthFilter, setLengthFilter] = useState<LengthFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("test_number");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchUserAttempts(user?.uid).then((res) => {
      setAttempts(res.filter((a) => a.skill === "reading"));
    });
    setBookmarkedIds(getBookmarks().map((b) => b.id));

    const onSync = () => {
      setBookmarkedIds(getBookmarks().map((b) => b.id));
    };
    window.addEventListener("ielts-bookmarks-updated", onSync);
    return () => window.removeEventListener("ielts-bookmarks-updated", onSync);
  }, [user?.uid]);

  const handleSyncToFirestore = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await syncReadingPassagesToFirestore();
      setSyncStatus(res.message);
      setTimeout(() => setSyncStatus(null), 6000);
    } catch (err: unknown) {
      setSyncStatus("Xatolik: " + ((err as Error)?.message || "Bazaga yuklashda muammo yuz berdi."));
    } finally {
      setIsSyncing(false);
    }
  };

  // Find recent unfinished or recent activity for ContinueCard
  const recentAttempt = useMemo(() => {
    if (!attempts.length) return null;
    return attempts[0];
  }, [attempts]);

  // Tab counters
  const tabCounts = useMemo(() => {
    return {
      all: ALL_READING_CATALOG_ITEMS.length,
      full_tests: ALL_READING_CATALOG_ITEMS.filter((i) => i.category === "full_tests").length,
      passage_1: ALL_READING_CATALOG_ITEMS.filter(
        (i) => i.targetTestId.startsWith("rd-p1-") || i.title.startsWith("Passage 1")
      ).length,
      passage_2: ALL_READING_CATALOG_ITEMS.filter(
        (i) => i.targetTestId.startsWith("rd-p2-") || i.title.startsWith("Passage 2")
      ).length,
      passage_3: ALL_READING_CATALOG_ITEMS.filter(
        (i) => i.targetTestId.startsWith("rd-p3-") || i.title.startsWith("Passage 3")
      ).length,
      question_type: ALL_READING_CATALOG_ITEMS.filter((i) => i.category === "question_type").length,
    };
  }, []);

  const tabs = [
    { id: "all", label: "Barchasi", count: tabCounts.all },
    { id: "full_tests", label: "To‘liq Testlar (Mock)", count: tabCounts.full_tests },
    { id: "passage_1", label: "Passage 1", count: tabCounts.passage_1 },
    { id: "passage_2", label: "Passage 2", count: tabCounts.passage_2 },
    { id: "passage_3", label: "Passage 3", count: tabCounts.passage_3 },
    { id: "question_type", label: "Savol Turlari", count: tabCounts.question_type },
  ];

  // Filtering
  const filteredItems = useMemo(() => {
    const list = ALL_READING_CATALOG_ITEMS.filter((item) => {
      // Category tab
      if (activeTab === "full_tests" && item.category !== "full_tests") return false;
      if (
        activeTab === "passage_1" &&
        !(item.targetTestId.startsWith("rd-p1-") || item.title.startsWith("Passage 1"))
      )
        return false;
      if (
        activeTab === "passage_2" &&
        !(item.targetTestId.startsWith("rd-p2-") || item.title.startsWith("Passage 2"))
      )
        return false;
      if (
        activeTab === "passage_3" &&
        !(item.targetTestId.startsWith("rd-p3-") || item.title.startsWith("Passage 3"))
      )
        return false;
      if (activeTab === "question_type" && item.category !== "question_type") return false;

      // Question-type filter
      if (
        selectedQuestionType !== "all" &&
        item.questionTypeTag &&
        item.questionTypeTag !== selectedQuestionType
      ) {
        return false;
      }

      // Search query (title, topic, typeBadge)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesTopic = item.topic.toLowerCase().includes(q);
        const matchesBadge = item.typeBadge.toLowerCase().includes(q);
        if (!matchesTitle && !matchesTopic && !matchesBadge) {
          return false;
        }
      }

      // Length filter
      if (lengthFilter === "short" && item.durationMinutes >= 15) return false;
      if (lengthFilter === "medium" && (item.durationMinutes < 15 || item.durationMinutes > 30))
        return false;
      if (lengthFilter === "long" && item.durationMinutes <= 30) return false;

      // Status filter
      const attemptMatch = attempts.find(
        (a) => a.testId === item.id || a.testId === item.targetTestId
      );
      const isSaved = bookmarkedIds.includes(item.id);

      if (statusFilter === "saved" && !isSaved) {
        return false;
      }
      if (statusFilter === "completed" && !attemptMatch) {
        return false;
      }
      if (statusFilter === "not_started" && attemptMatch) {
        return false;
      }

      return true;
    });

    const sorted = [...list];
    if (sortBy === "newest") sorted.reverse();
    else if (sortBy === "title_az") sorted.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === "shortest") sorted.sort((a, b) => a.durationMinutes - b.durationMinutes);

    return sorted;
  }, [
    activeTab,
    selectedQuestionType,
    lengthFilter,
    sortBy,
    searchQuery,
    statusFilter,
    attempts,
    bookmarkedIds,
  ]);

  const resetAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSelectedQuestionType("all");
    setLengthFilter("all");
    setSortBy("test_number");
    setActiveTab("all");
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with title & supporting sentence */}
      <CatalogHeader
        eyebrow="IELTS READING MODULI"
        title="IELTS Academic Reading"
        description="Akademik matnlar tahlili, rasmiy qoliplardagi to‘liq mock testlar (40 ta savol) va alohida Passage 1, 2, 3 mashqlari."
        icon={BookOpen}
        stats={[
          { label: "Barcha Testlar", value: ALL_READING_CATALOG_ITEMS.length },
          { label: "Topshirilgan", value: attempts.length },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncToFirestore}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[var(--primary)] text-white hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
              title="30 ta passage va 10 ta to‘liq mock testni Firebase Firestore bazasiga sinxronlash"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Yuklanmoqda..." : "DB ga yuklash (Sync)"}</span>
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
      {syncStatus && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* 2. Continue Card if recent/unfinished activity exists */}
      {recentAttempt && (
        <ContinueCard
          title={recentAttempt.testTitle}
          subtitle={`Oldingi natijangiz: Band ${recentAttempt.estimatedBand.toFixed(1)} (${recentAttempt.accuracy}% aniqlik)`}
          durationLabel={`${Math.round(recentAttempt.durationSeconds / 60)} daqiqa sarflandi`}
          badgeText="So‘nggi ishlangan"
          actionHref={`/reading/${recentAttempt.testId}`}
          actionLabel="Qayta ishlash / Tahlil"
        />
      )}

      {/* 3. Category Tabs */}
      <CategoryTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as ReadingCategoryTab)}
      />

      {/* 4. Search and Filter Bar with Dropdowns and Sort */}
      <CatalogFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={
          activeTab === "question_type" || activeTab === "all"
            ? {
                label: "All Question Types",
                options: QUESTION_TYPE_OPTIONS,
                selected: selectedQuestionType,
                onChange: setSelectedQuestionType,
              }
            : undefined
        }
        lengthFilter={lengthFilter}
        onLengthChange={setLengthFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={ALL_READING_CATALOG_ITEMS.length}
        filteredCount={filteredItems.length}
        onResetFilters={resetAllFilters}
      />

      {/* 5. Content: List View (default) or Grid View */}
      {filteredItems.length === 0 ? (
        <EmptyCatalogState
          type={statusFilter === "saved" ? "no_saved" : "no_results"}
          onReset={resetAllFilters}
        />
      ) : viewMode === "list" ? (
        <div className="space-y-2.5">
          {filteredItems.map((item, idx) => {
            const attempt = attempts.find(
              (a) => a.testId === item.id || a.testId === item.targetTestId
            );
            const status = attempt ? "completed" : "not_started";

            const cardData: ActivityCardData = {
              id: item.id,
              skill: "reading",
              title: item.title,
              topic: item.topic,
              typeBadge: item.typeBadge,
              typeBadgeColor: item.typeBadgeColor,
              itemCountLabel: item.itemCountLabel,
              durationMinutes: item.durationMinutes,
              status,
              bestBand: attempt?.estimatedBand,
              accuracy: attempt?.accuracy,
              actionHref: `/reading/${item.targetTestId}`,
              actionLabel: attempt ? "Natijani ko‘rish" : "Mashqni boshlash",
            };

            return <ActivityListItem key={item.id} item={cardData} index={idx} />;
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const attempt = attempts.find(
              (a) => a.testId === item.id || a.testId === item.targetTestId
            );
            const status = attempt ? "completed" : "not_started";

            const cardData: ActivityCardData = {
              id: item.id,
              skill: "reading",
              title: item.title,
              topic: item.topic,
              typeBadge: item.typeBadge,
              typeBadgeColor: item.typeBadgeColor,
              itemCountLabel: item.itemCountLabel,
              durationMinutes: item.durationMinutes,
              status,
              bestBand: attempt?.estimatedBand,
              accuracy: attempt?.accuracy,
              actionHref: `/reading/${item.targetTestId}`,
              actionLabel: attempt ? "Natijani ko‘rish" : "Mashqni boshlash",
            };

            return <ActivityCard key={item.id} item={cardData} />;
          })}
        </div>
      )}
    </div>
  );
}
