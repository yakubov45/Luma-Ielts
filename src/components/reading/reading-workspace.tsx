"use client";

import Link from "next/link";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Flag,
  Highlighter,
  MessageSquare,
  BookMarked,
  Volume2,
  X,
  Sparkles,
  HelpCircle,
  ThumbsUp,
  HelpCircle as QuestionIcon,
  ChevronLeft,
  ChevronRight,
  Eye,
  ListOrdered,
  BookOpen,
  FileText,
} from "lucide-react";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { SAMPLE_READING_TESTS, SampleReadingTest, ReadingPassageData } from "@/lib/reading/sample-data";
import { addWordToVocabulary } from "@/lib/services/vocabulary-service";
import { recordMistakesFromTest } from "@/lib/services/mistakes-service";
import { saveTestAttempt, calculateIeltsBand } from "@/lib/services/attempts-service";
import { AskAboutThisModal, ContextualHelpData } from "@/components/common/AskAboutThisModal";
import { ReportIssueModal } from "@/components/common/ReportIssueModal";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

type Question = {
  id: string;
  type: string;
  prompt: string;
  instructions: string;
  options?: { id: string; text: string }[];
  wordLimit?: number;
};

type Section = {
  title: string;
  paragraphs: { id: string; text: string }[];
  questions: Question[];
};

export type ConfidenceCategory =
  | "correct_confident"
  | "correct_unsure"
  | "incorrect_confident"
  | "incorrect_unsure";

type GuestResult = {
  correctCount: number;
  total: number;
  details: {
    questionId: string;
    prompt: string;
    userAnswer: string;
    accepted: string[];
    correct: boolean;
    confidence?: "confident" | "unsure";
    category: ConfidenceCategory;
    explanation: string;
    evidence: string;
  }[];
};

type DictEntry = {
  word: string;
  phonetic?: string;
  partOfSpeech?: string;
  definition?: string;
};

export function ReadingWorkspace() {
  const { testId } = useParams<{ testId: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const [section, setSection] = useState<Section>();
  const [sampleTest, setSampleTest] = useState<SampleReadingTest | null>(null);
  const [attempt, setAttempt] = useState<string>();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState("Tayyor");
  const [deadline, setDeadline] = useState<number>();
  const [remaining, setRemaining] = useState(0);
  const [guestResult, setGuestResult] = useState<GuestResult | null>(null);

  // Passage Pagination State (Passage 1, 2, 3)
  const [activePassageIdx, setActivePassageIdx] = useState(0);

  // Question View Mode: "single" (Bitta-bitta / Fokus rejimi) or "all" (Ketma-ket)
  const [questionViewMode, setQuestionViewMode] = useState<"single" | "all">("single");
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  // Mobile Layout Tab: "passage" vs "questions"
  const [mobileTab, setMobileTab] = useState<"passage" | "questions">("questions");

  // Section 8 & 10 & 13 states: Answer-confidence, Contextual AI Help, and Quality Reporting
  const [confidence, setConfidence] = useState<Record<string, "confident" | "unsure">>({});
  const [resultCategoryFilter, setResultCategoryFilter] = useState<string>("all");
  const [activeHelpContext, setActiveHelpContext] = useState<ContextualHelpData | null>(null);
  const [activeReportContext, setActiveReportContext] = useState<{
    skill: "reading" | "listening" | "writing" | "speaking";
    contentVersion?: string;
    itemReference: string;
    itemPrompt: string;
    expectedAnswer?: string;
  } | null>(null);

  // Selection & Floating Toolbar state (design.md Section 6)
  const [toolbarPos, setToolbarPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = useState("");
  const [dictPopover, setDictPopover] = useState<DictEntry | null>(null);
  const [savedWords, setSavedWords] = useState<string[]>([]);
  const passageRef = useRef<HTMLDivElement>(null);

  // Passages derivation: Multi-passage (Passage 1, 2, 3) or fallback single passage
  const passages: ReadingPassageData[] = useMemo(() => {
    if (sampleTest?.passages && sampleTest.passages.length > 0) {
      return sampleTest.passages;
    }
    if (section) {
      return [
        {
          passageNumber: (sampleTest?.passageNumber as 1 | 2 | 3) || 1,
          title: section.title,
          timeGuidance: `You should spend about 20 minutes on Questions 1-${section.questions.length}, which are based on Reading Passage ${sampleTest?.passageNumber || 1}.`,
          paragraphs: section.paragraphs,
          questionRange: { start: 1, end: section.questions.length },
        },
      ];
    }
    return [];
  }, [sampleTest, section]);

  const safePassageIdx = Math.min(
    Math.max(0, activePassageIdx),
    Math.max(0, passages.length - 1)
  );
  const activePassage = passages[safePassageIdx] || passages[0];

  // Active passage questions with their global index (1..40)
  const activeQuestionsWithGlobalIndex = useMemo(() => {
    if (!section || !activePassage) return [];
    const start = activePassage.questionRange.start;
    const end = activePassage.questionRange.end;
    return section.questions
      .slice(start - 1, end)
      .map((q, localIdx) => ({
        question: q,
        globalNum: start + localIdx,
        localIdx,
      }));
  }, [section, activePassage]);

  // Active Question for Single (Focus) Mode
  const currentQuestionItem = useMemo(() => {
    if (!activeQuestionsWithGlobalIndex.length) return null;
    if (activeQuestionId) {
      const found = activeQuestionsWithGlobalIndex.find(
        (item) => item.question.id === activeQuestionId
      );
      if (found) return found;
    }
    return activeQuestionsWithGlobalIndex[0];
  }, [activeQuestionsWithGlobalIndex, activeQuestionId]);

  const currentLocalIndex = activeQuestionsWithGlobalIndex.findIndex(
    (item) => item.question.id === currentQuestionItem?.question.id
  );

  const hasPrevQuestion = currentLocalIndex > 0 || safePassageIdx > 0;
  const hasNextQuestion =
    currentLocalIndex < activeQuestionsWithGlobalIndex.length - 1 ||
    safePassageIdx < passages.length - 1;

  const handlePrevQuestion = () => {
    if (currentLocalIndex > 0) {
      const prev = activeQuestionsWithGlobalIndex[currentLocalIndex - 1];
      setActiveQuestionId(prev.question.id);
    } else if (safePassageIdx > 0) {
      const prevPIdx = safePassageIdx - 1;
      setActivePassageIdx(prevPIdx);
      const prevP = passages[prevPIdx];
      const prevLastQ = section?.questions[prevP.questionRange.end - 1];
      if (prevLastQ) {
        setActiveQuestionId(prevLastQ.id);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentLocalIndex < activeQuestionsWithGlobalIndex.length - 1) {
      const next = activeQuestionsWithGlobalIndex[currentLocalIndex + 1];
      setActiveQuestionId(next.question.id);
    } else if (safePassageIdx < passages.length - 1) {
      const nextPIdx = safePassageIdx + 1;
      setActivePassageIdx(nextPIdx);
      const nextP = passages[nextPIdx];
      const nextFirstQ = section?.questions[nextP.questionRange.start - 1];
      if (nextFirstQ) {
        setActiveQuestionId(nextFirstQ.id);
      }
    }
  };

  // Passage navigation handler
  const handleSelectPassage = (idx: number) => {
    setActivePassageIdx(idx);
    setActiveQuestionId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (passageRef.current) {
      passageRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Question navigation handler (auto switches passage if needed)
  const handleJumpToQuestion = (qId: string, targetPassageIdx: number) => {
    if (targetPassageIdx !== safePassageIdx) {
      setActivePassageIdx(targetPassageIdx);
    }
    setActiveQuestionId(qId);
    if (questionViewMode === "all") {
      setTimeout(() => {
        const el = document.getElementById(`question-${qId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("ring-2", "ring-[var(--primary)]");
          setTimeout(() => el.classList.remove("ring-2", "ring-[var(--primary)]"), 1500);
        }
      }, 120);
    }
  };

  // Sync passage from URL hash if loaded with #question-qXX
  useEffect(() => {
    if (typeof window === "undefined" || !section || passages.length === 0) return;
    const hash = window.location.hash;
    if (hash && hash.startsWith("#question-")) {
      const qId = hash.replace("#question-", "");
      const qIdx = section.questions.findIndex((q) => q.id === qId);
      if (qIdx >= 0) {
        const qNum = qIdx + 1;
        const targetPIdx = passages.findIndex(
          (p) => qNum >= p.questionRange.start && qNum <= p.questionRange.end
        );
        if (targetPIdx >= 0 && targetPIdx !== safePassageIdx) {
          setActivePassageIdx(targetPIdx);
        }
      }
    }
  }, [section, passages, safePassageIdx]);

  // Load content
  useEffect(() => {
    const local = SAMPLE_READING_TESTS.find((t) => t.id === testId) || SAMPLE_READING_TESTS[0];
    if (local) {
      setSampleTest(local);
      setSection(local.section);
      const defaultDuration = (local.estimatedDuration || 8) * 60_000;
      setDeadline(Date.now() + defaultDuration);
    }

    getDoc(doc(db, `content/${testId}`))
      .then(async (meta) => {
        if (!meta.exists()) return;
        const v = meta.data().publishedVersion;
        const s = await getDoc(doc(db, `content/${testId}/versions/${v}/sections/section-1`));
        if (s.exists()) {
          setSection(s.data() as Section);
        }
      })
      .catch(() => {});

    if (user) {
      user.getIdToken()
        .then((token) =>
          fetch("/api/attempts/start", {
            method: "POST",
            headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
            body: JSON.stringify({ contentId: testId, mode: "practice" }),
          })
        )
        .then((res) => (res.ok ? res.json() : null))
        .then((body) => {
          if (body) {
            setAttempt(body.attemptId);
            setDeadline(body.deadlineAt);
            setMessage("Sinxronlandi");
          }
        })
        .catch(() => {});
    }
  }, [testId, user]);

  // Timer countdown
  useEffect(() => {
    if (!deadline) return;
    const timer = window.setInterval(() => {
      setRemaining(Math.max(0, deadline - Date.now()));
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  // Draft autosave
  useEffect(() => {
    if (!attempt || !user) return;
    const timer = window.setTimeout(() => {
      updateDoc(doc(db, `users/${user.uid}/attempts/${attempt}`), {
        draftAnswers: answers,
        revision: Date.now(),
      })
        .then(() => setMessage("Saqlandi"))
        .catch(() => setMessage("Lokal saqlandi"));
    }, 600);
    return () => clearTimeout(timer);
  }, [answers, attempt, user]);

  const timeFormatted = useMemo(() => {
    const mins = Math.floor(remaining / 60000).toString().padStart(2, "0");
    const secs = Math.floor((remaining % 60000) / 1000).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  }, [remaining]);

  // Handle Text Selection for Floating Toolbar
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setToolbarPos(null);
      return;
    }
    const text = selection.toString().trim();
    if (text.length > 0 && text.length < 200) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectedText(text);
      const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 400;
      setToolbarPos({
        x: Math.min(Math.max(10, rect.left + rect.width / 2 - 110), Math.max(10, viewportWidth - 230)),
        y: Math.max(10, rect.top - 48 + window.scrollY),
      });
    } else {
      setToolbarPos(null);
    }
  };

  const applyHighlight = (color: "yellow" | "green" | "purple") => {
    setToolbarPos(null);
    // Visual confirmation
    setMessage(`Ajratildi: ${selectedText.slice(0, 15)}…`);
  };

  const lookupDefinition = async () => {
    setToolbarPos(null);
    const cleanWord = selectedText.replace(/[^a-zA-Z\-']/g, "").toLowerCase().trim();
    if (!cleanWord) return;
    try {
      const res = await fetch(`/api/dictionary?word=${encodeURIComponent(cleanWord)}`);
      const data = await res.json();
      if (res.ok) {
        setDictPopover({
          word: data.word || cleanWord,
          phonetic: data.phonetic,
          partOfSpeech: data.partOfSpeech,
          definition: data.definition,
        });
      } else {
        setDictPopover({
          word: cleanWord,
          definition: data.message || "Ta’rif topilmadi. Qayta urinib ko‘ring.",
        });
      }
    } catch {
      setDictPopover({
        word: cleanWord,
        definition: "Lug‘at xizmatiga ulanishda xatolik yuz berdi.",
      });
    }
  };

  const saveWord = async () => {
    setToolbarPos(null);
    setSavedWords((prev) => [...prev, selectedText]);
    setMessage(`Lug‘atga qo‘shildi: "${selectedText}"`);
    try {
      await addWordToVocabulary(user?.uid, {
        word: selectedText,
        partOfSpeech: dictPopover?.partOfSpeech || "noun",
        definition: dictPopover?.definition || "IELTS Reading matnidan saqlangan so‘z.",
        example: selectedText,
        source: sampleTest?.title || "Reading drill",
      });
    } catch (e) {
      console.warn("Failed to save word:", e);
    }
    setTimeout(() => setDictPopover(null), 1200);
  };

  const toggleFlag = (qId: string) => {
    setFlags((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  async function submit() {
    setMessage("Tekshirilmoqda…");
    const questions = sampleTest?.section.questions || [];
    let correct = 0;
    const failedQuestions: Array<{
      questionId: string;
      prompt: string;
      questionType: string;
      yourAnswer: string;
      correctAnswer: string;
      reason: string;
    }> = [];
    const questionBreakdown: Array<{
      questionId: string;
      type: string;
      correct: boolean;
    }> = [];

    const details = questions.map((q) => {
      const userAns = (answers[q.id] || "").trim().toLowerCase();
      const isCorrect = q.accepted.some((a) => a.toLowerCase() === userAns);
      const qTypeName =
        q.type === "trueFalseNotGiven"
          ? "True / False / Not Given"
          : q.type === "singleChoice"
          ? "Single Choice"
          : "Sentence Completion";

      const userConf = confidence[q.id];
      let category: ConfidenceCategory;
      if (isCorrect) {
        category = userConf === "unsure" ? "correct_unsure" : "correct_confident";
      } else {
        category = userConf === "confident" ? "incorrect_confident" : "incorrect_unsure";
      }

      if (isCorrect) {
        correct++;
      } else {
        failedQuestions.push({
          questionId: q.id,
          prompt: q.prompt,
          questionType: qTypeName,
          yourAnswer: answers[q.id] || "(Javob berilmadi)",
          correctAnswer: q.accepted.join(" / "),
          reason: q.explanation || "To‘g‘ri javob matn dalili asosida tasdiqlangan.",
        });
      }

      questionBreakdown.push({
        questionId: q.id,
        type: qTypeName,
        correct: isCorrect,
      });

      return {
        questionId: q.id,
        prompt: q.prompt,
        userAnswer: answers[q.id] || "(Javob berilmadi)",
        accepted: q.accepted,
        correct: isCorrect,
        confidence: userConf,
        category,
        explanation: q.explanation,
        evidence: q.evidence,
      };
    });

    const accuracy = questions.length ? Math.round((correct / questions.length) * 100) : 0;
    const estimatedBand = calculateIeltsBand(accuracy);

    // Save mistakes to real data
    if (failedQuestions.length > 0) {
      try {
        await recordMistakesFromTest(user?.uid, {
          drillId: testId,
          drillTitle: sampleTest?.title || "Reading Drill",
          skill: "reading",
          failedQuestions,
        });
      } catch (e) {
        console.warn("Failed to record mistakes:", e);
      }
    }

    // Save test attempt to real data
    try {
      await saveTestAttempt(user?.uid, {
        testId,
        testTitle: sampleTest?.title || "Reading Drill",
        skill: "reading",
        correctCount: correct,
        totalQuestions: questions.length,
        accuracy,
        estimatedBand,
        durationSeconds: Math.max(30, Math.round(((sampleTest?.estimatedDuration || 8) * 60_000 - remaining) / 1000)),
        submittedAt: Date.now(),
        answers,
        questionBreakdown,
      });
    } catch (e) {
      console.warn("Failed to record attempt:", e);
    }

    setGuestResult({
      correctCount: correct,
      total: questions.length,
      details,
    });
    setMessage("Natija saqlandi va hisoblandi!");
  }

  const renderQuestionCard = (
    item: { question: Question; globalNum: number; localIdx: number },
    isSingleMode: boolean
  ) => {
    const { question: q, globalNum, localIdx } = item;
    const cleanPrompt = q.prompt.replace(/^\d+[\.\)]\s*/, "");
    const uniqueOptions = q.options
      ? Array.from(new Map(q.options.map((o) => [o.id.toLowerCase(), o])).values())
      : undefined;

    return (
      <fieldset
        id={`question-${q.id}`}
        key={`fieldset-${q.id}-${globalNum}-${localIdx}`}
        className={`card p-5 space-y-4 scroll-mt-24 transition-all ${
          isSingleMode ? "border-2 border-[var(--primary)]/30 shadow-md ring-1 ring-[var(--primary)]/10" : ""
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            {isSingleMode && (
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--nav-active-bg)] text-[var(--primary)] inline-block">
                Savol {globalNum} / {section?.questions.length || 40} ({localIdx + 1}/{activeQuestionsWithGlobalIndex.length})
              </span>
            )}
            <legend className="font-bold text-sm md:text-base text-[var(--foreground)] leading-snug">
              {globalNum}. {cleanPrompt}
            </legend>
          </div>
          <button
            type="button"
            onClick={() => toggleFlag(q.id)}
            title="Savolni belgilash (Flag)"
            className={`p-1.5 rounded-lg border text-xs cursor-pointer shrink-0 ${
              flags[q.id]
                ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border-amber-300"
                : "text-[var(--muted)] border-[var(--border)] hover:bg-[var(--surface-subtle)]"
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
          </button>
        </div>

        {q.instructions &&
          !/spend about 20 minutes/i.test(q.instructions) &&
          !/based on Reading Passage/i.test(q.instructions) && (
            <p className="text-xs text-[var(--muted)] font-medium leading-relaxed bg-[var(--surface-subtle)] px-3 py-1.5 rounded-lg border border-[var(--border)]">
              {q.instructions}
            </p>
          )}

        {uniqueOptions ? (
          <div className="space-y-2 pt-1">
            {uniqueOptions.map((o, optIdx) => {
              const isSelected = answers[q.id] === o.id;
              const cleanText = o.text
                .replace(
                  new RegExp(`^(?:\\(?${o.id}\\)?[\\s\\:\\.\\—\\-]+|${o.id}\\s+)`, "i"),
                  ""
                )
                .trim();
              return (
                <div
                  key={`opt-${q.id}-${o.id}-${optIdx}`}
                  onClick={() => setAnswers({ ...answers, [q.id]: o.id })}
                  className={`group flex items-start gap-3 px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer select-none text-xs md:text-sm ${
                    isSelected
                      ? "bg-[var(--nav-active-bg)] border-[var(--primary)] ring-1 ring-[var(--primary)]/30 shadow-xs"
                      : "bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-subtle)] hover:border-[var(--secondary)]/40"
                  }`}
                >
                  {/* Compact Letter Badge & Radio Indicator */}
                  <div className="flex items-center gap-2 pt-0.5 shrink-0">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-[var(--primary)] text-white shadow-xs"
                          : "bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--secondary)] group-hover:text-[var(--foreground)]"
                      }`}
                    >
                      {o.id.toUpperCase()}
                    </span>
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-[var(--primary)] bg-[var(--surface)]"
                          : "border-[var(--muted)]/40 bg-[var(--surface)] group-hover:border-[var(--muted)]"
                      }`}
                    >
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                      )}
                    </span>
                  </div>

                  {/* Option text */}
                  <span
                    className={`flex-1 leading-snug pt-0.5 ${
                      isSelected
                        ? "font-semibold text-[var(--foreground)]"
                        : "text-[var(--foreground)]"
                    }`}
                  >
                    {cleanText}
                  </span>
                </div>
              );
            })}
          </div>
        ) : q.type.includes("true") || q.type.includes("True") ? (
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { val: "true", label: "True" },
              { val: "false", label: "False" },
              { val: "not given", label: "Not Given" },
            ].map((opt) => {
              const isSelected = (answers[q.id] || "").toLowerCase() === opt.val;
              return (
                <button
                  key={`tf-${q.id}-${opt.val}`}
                  type="button"
                  onClick={() => setAnswers({ ...answers, [q.id]: opt.val })}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? "bg-[var(--nav-active-bg)] border-[var(--primary)] text-[var(--primary)] shadow-xs ring-1 ring-[var(--primary)]/30"
                      : "bg-[var(--surface)] border-[var(--border)] text-[var(--secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected
                        ? "bg-[var(--primary)]"
                        : "border border-[var(--muted)] bg-transparent"
                    }`}
                  />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <input
            aria-label={q.prompt}
            value={answers[q.id] ?? ""}
            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            placeholder={q.wordLimit ? `${q.wordLimit} so‘zdan oshmasin` : "Javobingizni yozing"}
            className="w-full text-xs md:text-sm mt-1"
          />
        )}

        {/* Answer Confidence Tracking */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-[var(--border)] text-xs">
          <span className="text-[11px] text-[var(--muted)] font-medium">Javobingizga ishonchingiz:</span>
          <div className="inline-flex rounded-lg p-0.5 bg-[var(--surface-subtle)] border border-[var(--border)]">
            <button
              type="button"
              onClick={() =>
                setConfidence((prev) => ({
                  ...prev,
                  [q.id]: prev[q.id] === "confident" ? (undefined as any) : "confident",
                }))
              }
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                confidence[q.id] === "confident"
                  ? "bg-[var(--primary)] text-white shadow-xs"
                  : "text-[var(--secondary)] hover:text-[var(--foreground)]"
              }`}
            >
              ✓ Ishonchim komil
            </button>
            <button
              type="button"
              onClick={() =>
                setConfidence((prev) => ({
                  ...prev,
                  [q.id]: prev[q.id] === "unsure" ? (undefined as any) : "unsure",
                }))
              }
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                confidence[q.id] === "unsure"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-[var(--secondary)] hover:text-[var(--foreground)]"
              }`}
            >
              ? Ikkilanyapman / Taxmin
            </button>
          </div>
        </div>

        {/* Single Mode Navigation Controls: Oldingi / Keyingi savol */}
        {isSingleMode && (
          <div className="flex items-center justify-between gap-3 pt-3.5 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={handlePrevQuestion}
              disabled={!hasPrevQuestion}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-subtle)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Oldingi savol</span>
            </button>

            <div className="text-[11px] font-bold text-[var(--muted)]">
              {localIdx + 1} / {activeQuestionsWithGlobalIndex.length}
            </div>

            {hasNextQuestion ? (
              <button
                type="button"
                onClick={handleNextQuestion}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  answers[q.id]
                    ? "bg-[var(--primary)] text-white shadow-md ring-2 ring-[var(--primary)]/30 hover:opacity-95"
                    : "bg-[var(--primary)] text-white hover:opacity-95 shadow-xs"
                }`}
              >
                <span>Keyingi savol</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 shadow-md cursor-pointer transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Topshirish</span>
              </button>
            )}
          </div>
        )}
      </fieldset>
    );
  };

  if (!section) {
    return <div className="p-12 text-center text-sm text-[var(--muted)]">Mashq yuklanmoqda…</div>;
  }

  return (
    <div className="space-y-4">
      {/* 1. Compact Dedicated Top Bar (design.md Section 6) */}
      <div className="sticky top-14 z-20 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/reading"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--secondary)] hover:bg-[var(--surface-subtle)]"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Chiqish
          </Link>
          <span className="font-bold text-sm text-[var(--foreground)] truncate max-w-[200px] md:max-w-md">
            {section.title}
          </span>
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[var(--nav-active-bg)] text-[var(--nav-active-text)]">
            Practice Mode
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline-block text-xs text-[var(--muted)]">{message}</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-xs font-bold tabular text-[var(--foreground)]">
            <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>{timeFormatted}</span>
          </div>
          <ThemeToggle />
          <button
            onClick={submit}
            className="btn-primary !py-2 !px-5 !min-h-[36px] text-xs font-bold"
          >
            Topshirish
          </button>
        </div>
      </div>

      {/* Floating Toolbar on Text Selection (design.md Section 6) */}
      {toolbarPos && (
        <div
          style={{ top: `${toolbarPos.y}px`, left: `${toolbarPos.x}px`, position: "absolute" }}
          className="z-50 flex items-center gap-1 p-1 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xl"
        >
          <button
            onClick={() => applyHighlight("yellow")}
            title="Sariq ajratish"
            className="w-7 h-7 rounded-lg bg-[#FEF08A] hover:opacity-80 flex items-center justify-center text-[11px] font-bold text-stone-900 cursor-pointer"
          >
            A
          </button>
          <button
            onClick={() => applyHighlight("green")}
            title="Yashil ajratish"
            className="w-7 h-7 rounded-lg bg-[#BBF7D0] hover:opacity-80 flex items-center justify-center text-[11px] font-bold text-stone-900 cursor-pointer"
          >
            A
          </button>
          <button
            onClick={() => applyHighlight("purple")}
            title="Binafsha ajratish"
            className="w-7 h-7 rounded-lg bg-[#E9D5FF] hover:opacity-80 flex items-center justify-center text-[11px] font-bold text-stone-900 cursor-pointer"
          >
            A
          </button>
          <div className="w-[1px] h-4 bg-[var(--border)] mx-1" />
          <button
            onClick={lookupDefinition}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold hover:bg-[var(--surface-subtle)] text-[var(--primary)] cursor-pointer"
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>Lug‘at</span>
          </button>
          <button
            onClick={saveWord}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold hover:bg-[var(--surface-subtle)] text-[var(--secondary)] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-orange)]" />
            <span>Saqlash</span>
          </button>
        </div>
      )}

      {/* Dictionary Popover Modal */}
      {dictPopover && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
          <div className="card max-w-sm w-full p-5 space-y-3 bg-[var(--surface)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg capitalize">{dictPopover.word}</h3>
                {dictPopover.phonetic && (
                  <span className="text-xs text-[var(--muted)]">{dictPopover.phonetic}</span>
                )}
              </div>
              <button
                onClick={() => setDictPopover(null)}
                className="text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {dictPopover.partOfSpeech && (
              <span className="inline-block text-[11px] px-2 py-0.5 rounded bg-[var(--surface-subtle)] font-semibold text-[var(--primary)] italic">
                {dictPopover.partOfSpeech}
              </span>
            )}
            <p className="text-xs text-[var(--secondary)] leading-relaxed">
              {dictPopover.definition}
            </p>
            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={saveWord}
                className="btn-primary !py-1.5 !px-3 text-xs"
              >
                So‘zni yodlashga qo‘shish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Display with 4 Learning Categories (Section 8) */}
      {guestResult && (
        <div className="card border-2 border-[var(--primary)] p-6 space-y-5 bg-[var(--surface)] shadow-lg rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
            <div>
              <span className="eyebrow">Mashq yakunlandi & Tahlil</span>
              <h2 className="text-2xl font-black text-[var(--foreground)]">
                {guestResult.correctCount} / {guestResult.total} to‘g‘ri javob
              </h2>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                Ishonch darajasi (Confidence Tracking) bo‘yicha o‘quv tavsiyalari shakllantirildi.
              </p>
            </div>
            <span className="text-sm font-bold px-3.5 py-1.5 rounded-full bg-[var(--nav-active-bg)] text-[var(--nav-active-text)] self-start sm:self-auto">
              {Math.round((guestResult.correctCount / guestResult.total) * 100)}% Aniqlik
            </span>
          </div>

          {/* 4 Learning Categories Filters (Section 8) */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] pb-3">
            {[
              { id: "all", label: `Barchasi (${guestResult.details.length})` },
              {
                id: "correct_confident",
                label: `To‘g‘ri & Ishonchli (${guestResult.details.filter((d) => d.category === "correct_confident").length})`,
              },
              {
                id: "correct_unsure",
                label: `To‘g‘ri, ammo ikkilangan (${guestResult.details.filter((d) => d.category === "correct_unsure").length})`,
              },
              {
                id: "incorrect_confident",
                label: `Tushunmovchilik (${guestResult.details.filter((d) => d.category === "incorrect_confident").length})`,
              },
              {
                id: "incorrect_unsure",
                label: `Qoidani o‘rganish (${guestResult.details.filter((d) => d.category === "incorrect_unsure").length})`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setResultCategoryFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  resultCategoryFilter === tab.id
                    ? "bg-[var(--nav-active-bg)] text-[var(--nav-active-text)] font-bold"
                    : "text-[var(--secondary)] hover:bg-[var(--surface-subtle)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Details list */}
          <div className="space-y-3">
            {guestResult.details
              .filter((item) => resultCategoryFilter === "all" || item.category === resultCategoryFilter)
              .map((item, idx) => {
                const categoryBadge = {
                  correct_confident: {
                    label: "✓ To‘g‘ri va ishonchli",
                    desc: "Ajoyib! Bu ko‘nikma mustahkam o‘zlashtirilgan.",
                    style: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
                  },
                  correct_unsure: {
                    label: "⚠️ To‘g‘ri, lekin ikkilangan",
                    desc: "Tasodifiy to‘g‘ri bo‘lishi mumkin — yangi mashq bilan tasdiqlash zarur.",
                    style: "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
                  },
                  incorrect_confident: {
                    label: "❌ Tushunmovchilik (Misconception)",
                    desc: "Javobingizga ishongan edingiz, ammo xato. Matndagi dalilga chuqurroq qarang.",
                    style: "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300",
                  },
                  incorrect_unsure: {
                    label: "❓ Noaniq va noto‘g‘ri",
                    desc: "Ushbu savol turi bo‘yicha fundamental qoidalarni takrorlash lozim.",
                    style: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
                  },
                }[item.category];

                const qGlobalIdx = (section?.questions.findIndex((q) => q.id === item.questionId) ?? -1) + 1;
                const questionLabel = qGlobalIdx > 0 ? `${qGlobalIdx}-savol` : `${idx + 1}-savol`;

                return (
                  <div
                    key={`result-${item.questionId}-${idx}`}
                    className={`p-4 rounded-2xl border text-sm space-y-2.5 transition-all ${
                      item.correct
                        ? "bg-emerald-50/30 border-emerald-200 dark:bg-emerald-950/20"
                        : "bg-rose-50/30 border-rose-200 dark:bg-rose-950/20"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-bold text-xs text-[var(--foreground)]">
                        {item.correct ? "✅" : "❌"} {questionLabel}: {item.prompt}
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${categoryBadge.style}`}>
                        {categoryBadge.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                        <span className="text-[10px] text-[var(--muted)] font-bold block">Sizning javobingiz:</span>
                        <span className="font-semibold">{item.userAnswer}</span>
                        {item.confidence && (
                          <span className="ml-2 text-[10px] text-[var(--muted)]">
                            ({item.confidence === "confident" ? "Ishongan" : "Ikkilangan"})
                          </span>
                        )}
                      </div>
                      <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                        <span className="text-[10px] text-[var(--muted)] font-bold block">To‘g‘ri javob kaliti:</span>
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                          {item.accepted.join(" / ")}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--secondary)] leading-relaxed">
                      <strong>Tahlil:</strong> {item.explanation}
                    </p>
                    <p className="text-[11px] italic text-[var(--muted)]">
                      📌 Matnda: &quot;{item.evidence}&quot;
                    </p>
                    <p className="text-[11px] text-[var(--primary)] font-semibold bg-[var(--surface-subtle)] p-2 rounded-xl">
                      💡 <strong>O‘quv xulosasi:</strong> {categoryBadge.desc}
                    </p>

                    {/* Section 10 & 13 Actions */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)]">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveHelpContext({
                            skill: "reading",
                            taskTitle: sampleTest?.title || "Reading Practice",
                            questionPrompt: item.prompt,
                            userAnswer: item.userAnswer,
                            correctAnswer: item.accepted.join(" / "),
                            passageExcerpt: item.evidence,
                          })
                        }
                        className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Shu savol haqida so‘rash (Ask about this)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setActiveReportContext({
                            skill: "reading",
                            contentVersion: "v1.2",
                            itemReference: item.questionId,
                            itemPrompt: item.prompt,
                            expectedAnswer: item.accepted.join(" / "),
                          })
                        }
                        className="text-xs text-[var(--muted)] hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                      >
                        <Flag className="w-3.5 h-3.5" />
                        <span>Xatolik bormi?</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Mobile-Only Tab Switcher (< lg screens) per Section 12 */}
      <div className="lg:hidden sticky top-16 z-30 bg-[var(--background)]/95 backdrop-blur-md p-1.5 rounded-2xl border border-[var(--border)] shadow-xs flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMobileTab("passage")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mobileTab === "passage"
              ? "bg-[var(--primary)] text-white shadow-xs"
              : "bg-[var(--surface-subtle)] text-[var(--secondary)] hover:text-[var(--foreground)]"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Matn (Passage {activePassage.passageNumber})</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab("questions")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mobileTab === "questions"
              ? "bg-[var(--primary)] text-white shadow-xs"
              : "bg-[var(--surface-subtle)] text-[var(--secondary)] hover:text-[var(--foreground)]"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Savollar ({Object.keys(answers).length}/{section?.questions.length || 40})</span>
        </button>
      </div>

      {/* Side-by-Side Study Layout (Passage & Questions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-8">
        {/* Left: Reading Passage (7 cols) - Official IELTS CD Layout */}
        <section
          ref={passageRef}
          onMouseUp={handleMouseUp}
          className={`lg:col-span-7 card reading-passage p-6 md:p-8 space-y-5 ${
            mobileTab === "passage" ? "block" : "hidden lg:block"
          }`}
        >
          {/* Official IELTS Passage Header (per design screenshot) */}
          <div className="border-b border-[var(--border)] pb-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black tracking-widest uppercase px-3 py-1 rounded-lg bg-[var(--surface-subtle)] text-[var(--primary)] border border-[var(--border)]">
                PASSAGE {activePassage.passageNumber}
              </span>
              {passages.length > 1 && (
                <span className="text-xs text-[var(--muted)] font-semibold">
                  {safePassageIdx + 1} / {passages.length}-bo‘lim
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-[var(--secondary)] italic leading-relaxed pt-1">
              {activePassage.timeGuidance ||
                `You should spend about 20 minutes on Questions ${activePassage.questionRange.start}–${activePassage.questionRange.end}, which are based on Reading Passage ${activePassage.passageNumber}.`}
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-[var(--foreground)] tracking-tight pt-2">
              {activePassage.title}
            </h2>
          </div>

          {/* Active Passage Paragraphs Only */}
          <div className="pt-2 space-y-4">
            {activePassage.paragraphs.map((p, pIdx) => (
              <p
                key={`para-${p.id || pIdx}-${pIdx}`}
                id={p.id}
                className="text-[15px] md:text-base leading-relaxed text-[var(--foreground)]"
              >
                {p.text}
              </p>
            ))}
          </div>
        </section>

        {/* Right: Active Passage Questions (5 cols) - Sticky so it stays right in front of the user while reading */}
        <section
          className={`lg:col-span-5 space-y-4 lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto pr-1 ${
            mobileTab === "questions" ? "block" : "hidden lg:block"
          }`}
        >
          {/* Active Passage Question Navigator & Mode Switcher */}
          <div className="card p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[var(--secondary)]">
              <div>
                <span className="font-bold text-[var(--foreground)]">
                  Passage {activePassage.passageNumber} savollari ({activePassage.questionRange.start}–{activePassage.questionRange.end})
                </span>
                <span className="text-[11px] text-[var(--muted)] block">
                  Jami: {Object.keys(answers).length} / {section.questions.length} belgilandi
                </span>
              </div>

              {/* Mode Switcher: Bitta-bitta (Fokus) vs Ketma-ket */}
              <div className="inline-flex items-center p-0.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] gap-0.5">
                <button
                  type="button"
                  onClick={() => setQuestionViewMode("single")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    questionViewMode === "single"
                      ? "bg-[var(--primary)] text-white shadow-xs"
                      : "text-[var(--secondary)] hover:text-[var(--foreground)]"
                  }`}
                  title="Savollarni bitta-bitta ko‘rsatish (Fokus rejimi)"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Bitta-bitta</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuestionViewMode("all")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    questionViewMode === "all"
                      ? "bg-[var(--primary)] text-white shadow-xs"
                      : "text-[var(--secondary)] hover:text-[var(--foreground)]"
                  }`}
                  title="Barcha savollarni ketma-ket ko‘rsatish"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>Ketma-ket</span>
                </button>
              </div>
            </div>

            {/* Question numbers grid */}
            <div className="flex flex-wrap gap-1.5">
              {activeQuestionsWithGlobalIndex.map(({ question: q, globalNum }, navIdx) => {
                const isAnswered = !!answers[q.id];
                const isFlagged = !!flags[q.id];
                const isCurrent = currentQuestionItem?.question.id === q.id;
                return (
                  <button
                    key={`nav-btn-${q.id}-${globalNum}-${navIdx}`}
                    type="button"
                    onClick={() => handleJumpToQuestion(q.id, safePassageIdx)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold border transition-all cursor-pointer relative ${
                      isCurrent
                        ? "bg-[var(--primary)] text-white border-[var(--primary)] ring-2 ring-[var(--primary)]/30 scale-105 shadow-sm font-black z-10"
                        : isFlagged
                        ? "border-[var(--accent-orange)] bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200"
                        : isAnswered
                        ? "bg-[var(--nav-active-bg)] border-[var(--primary)]/50 text-[var(--primary)] font-black"
                        : "bg-[var(--surface-subtle)] border-[var(--border)] text-[var(--secondary)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {globalNum}
                    {isFlagged && !isCurrent && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Passage Question List or Single Focus Card */}
          {questionViewMode === "single" ? (
            currentQuestionItem && renderQuestionCard(currentQuestionItem, true)
          ) : (
            <div className="space-y-4">
              {activeQuestionsWithGlobalIndex.map((item) => renderQuestionCard(item, false))}
            </div>
          )}

          {/* Bottom passage switch buttons in right column */}
          {questionViewMode === "all" && (
            <div className="card p-4 flex items-center justify-between gap-3">
              {safePassageIdx > 0 ? (
                <button
                  type="button"
                  onClick={() => handleSelectPassage(safePassageIdx - 1)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--foreground)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Oldingi bo‘lim (Passage {passages[safePassageIdx - 1]?.passageNumber})</span>
                </button>
              ) : (
                <div />
              )}

              {safePassageIdx < passages.length - 1 ? (
                <button
                  type="button"
                  onClick={() => handleSelectPassage(safePassageIdx + 1)}
                  className="btn-primary !py-2 !px-4 text-xs font-bold flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  <span>Keyingi bo‘lim (Passage {passages[safePassageIdx + 1]?.passageNumber})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submit}
                  className="btn-primary !py-2.5 !px-5 text-xs font-black flex items-center gap-1.5 cursor-pointer ml-auto shadow-md"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Testni yakunlash & topshirish</span>
                </button>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Sticky Bottom Bar (Official Computer-Delivered IELTS Style) */}
      <div className="sticky bottom-0 z-30 -mx-4 md:-mx-8 px-4 md:px-8 py-3 bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--border)] shadow-2xl mt-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Katakchalar: Passage 1, 2, 3 Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider hidden sm:inline mr-1">
              Passage:
            </span>
            {passages.map((p, pIdx) => {
              const isActive = pIdx === safePassageIdx;
              const pQuestions = section.questions.slice(p.questionRange.start - 1, p.questionRange.end);
              const answeredInPassage = pQuestions.filter((q) => !!answers[q.id]).length;
              const totalInPassage = pQuestions.length;
              const allAnswered = answeredInPassage === totalInPassage && totalInPassage > 0;

              return (
                <button
                  key={`bottom-passage-${p.passageNumber ?? pIdx}-${pIdx}`}
                  type="button"
                  onClick={() => handleSelectPassage(pIdx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md ring-2 ring-[var(--primary)]/20"
                      : "bg-[var(--surface-subtle)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface)] hover:border-[var(--primary)]/50"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                      isActive
                        ? "bg-white text-[var(--primary)]"
                        : "bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)]"
                    }`}
                  >
                    {p.passageNumber}
                  </span>
                  <span className="whitespace-nowrap">Passage {p.passageNumber}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : allAnswered
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                        : "bg-[var(--surface)] text-[var(--muted)]"
                    }`}
                  >
                    {answeredInPassage}/{totalInPassage}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Passage Question Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
            <span className="text-[11px] font-bold text-[var(--muted)] mr-1 hidden lg:inline">
              Savollar:
            </span>
            {activeQuestionsWithGlobalIndex.map(({ question: q, globalNum }, stripIdx) => {
              const isAnswered = !!answers[q.id];
              const isFlagged = !!flags[q.id];
              const isCurrent = currentQuestionItem?.question.id === q.id;
              return (
                <button
                  key={`bottom-strip-${q.id}-${globalNum}-${stripIdx}`}
                  type="button"
                  onClick={() => handleJumpToQuestion(q.id, safePassageIdx)}
                  className={`w-7 h-7 rounded-lg text-[11px] font-bold flex items-center justify-center transition-all cursor-pointer relative shrink-0 ${
                    isCurrent
                      ? "bg-[var(--primary)] text-white border-[var(--primary)] ring-2 ring-[var(--primary)]/30 font-black scale-105 z-10 shadow-xs"
                      : isFlagged
                      ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-400"
                      : isAnswered
                      ? "bg-[var(--nav-active-bg)] text-[var(--primary)] border border-[var(--primary)]/40 font-black"
                      : "bg-[var(--surface-subtle)] text-[var(--secondary)] border border-[var(--border)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                  }`}
                  title={`Savol ${globalNum}${isAnswered ? " (Belgilangan)" : ""}${isFlagged ? " (Flag)" : ""}`}
                >
                  {globalNum}
                  {isFlagged && !isCurrent && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Prev/Next arrows & Submit Button */}
          <div className="flex items-center gap-2 shrink-0">
            {passages.length > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={safePassageIdx === 0}
                  onClick={() => handleSelectPassage(safePassageIdx - 1)}
                  className="p-1.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--secondary)] hover:bg-[var(--surface-subtle)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Oldingi passage"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={safePassageIdx === passages.length - 1}
                  onClick={() => handleSelectPassage(safePassageIdx + 1)}
                  className="p-1.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--secondary)] hover:bg-[var(--surface-subtle)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Keyingi passage"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <button
              onClick={submit}
              className="btn-primary !py-1.5 !px-4 !min-h-[34px] text-xs font-bold"
            >
              Topshirish ({Object.keys(answers).length}/{section.questions.length})
            </button>
          </div>
        </div>
      </div>

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


