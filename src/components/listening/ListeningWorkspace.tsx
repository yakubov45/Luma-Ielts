"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Headphones,
  Sparkles,
  Info,
  Flag,
  HelpCircle,
  MessageSquare,
  Award,
  Layers,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { saveTestAttempt, calculateIeltsBand, TestAttempt } from "@/lib/services/attempts-service";
import { recordMistakesFromTest } from "@/lib/services/mistakes-service";
import {
  ListeningTestData,
  OYSTER_BAY_TEST,
  LISTENING_TESTS,
} from "@/lib/listening/sample-tests";
import { AskAboutThisModal, ContextualHelpData } from "@/components/common/AskAboutThisModal";
import { ReportIssueModal } from "@/components/common/ReportIssueModal";

interface ListeningWorkspaceProps {
  testId?: string;
  onExit: () => void;
}

export function ListeningWorkspace({ testId = "oyster-bay-sailing-club", onExit }: ListeningWorkspaceProps) {
  const { user } = useAuth();
  const testData: ListeningTestData = LISTENING_TESTS[testId] || OYSTER_BAY_TEST;

  // Audio Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const [speed, setSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [practiceMode, setPracticeMode] = useState<"standard" | "exam">("standard");

  // User Answers & Flags
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});

  // Submission & Results
  const [submitted, setSubmitted] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [showTranscriptAfterSubmit, setShowTranscriptAfterSubmit] = useState(false);
  const [showBreakdownAfterSubmit, setShowBreakdownAfterSubmit] = useState(true);

  // Active question highlight for keyboard / navigation
  const [activeQuestionNum, setActiveQuestionNum] = useState<number>(1);

  // Modals for AI Contextual Assistance & Quality Reports
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [contextualData, setContextualData] = useState<ContextualHelpData | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportContext, setReportContext] = useState<{
    skill: "listening";
    contentVersion: string;
    itemReference: string;
    itemPrompt: string;
    expectedAnswer?: string;
  } | null>(null);

  // Audio timers & speech refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Count answered questions
  const answeredCount = useMemo(() => {
    return Object.values(answers).filter((val) => val && val.trim().length > 0).length;
  }, [answers]);

  // Clean voice speak helper
  const speakSegment = (index: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    if (index >= testData.segments.length) {
      setIsPlaying(false);
      return;
    }

    if (isMuted) return;

    const seg = testData.segments[index];
    const utterance = new SpeechSynthesisUtterance(seg.text);
    utterance.rate = speed;
    utterance.lang = "en-GB";

    // Modulate pitch slightly between Woman/Adviser and Man/Student
    if (
      seg.speaker.toLowerCase().includes("woman") ||
      seg.speaker.toLowerCase().includes("adviser") ||
      seg.speaker.toLowerCase().includes("emily")
    ) {
      utterance.pitch = 1.15;
    } else {
      utterance.pitch = 0.95;
    }

    utterance.onend = () => {
      if (isPlaying && index + 1 < testData.segments.length) {
        setActiveSegmentIndex(index + 1);
        setCurrentTime(testData.segments[index + 1].startSec);
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

  const handleRestart = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setActiveSegmentIndex(0);
    setCurrentTime(0);
    if (isPlaying) {
      speakSegment(0);
    }
  };

  // Timer simulation for scrubber progress
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;
          if (next >= testData.totalDuration) {
            setIsPlaying(false);
            return testData.totalDuration;
          }
          const segIdx = testData.segments.findIndex(
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
  }, [isPlaying, speed, activeSegmentIndex, testData]);

  // Clean up speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (practiceMode === "exam") return; // No seeking in exam mode
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    const segIdx = testData.segments.findIndex(
      (s) => newTime >= s.startSec && newTime < s.endSec
    );
    const targetIdx = segIdx !== -1 ? segIdx : 0;
    setActiveSegmentIndex(targetIdx);
    if (isPlaying) {
      speakSegment(targetIdx);
    }
  };

  const handleAnswerChange = (qId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: value,
    }));
  };

  const toggleFlag = (qNum: number) => {
    setFlags((prev) => ({
      ...prev,
      [qNum]: !prev[qNum],
    }));
  };

  const scrollToQuestion = (qNum: number) => {
    setActiveQuestionNum(qNum);
    const el = document.getElementById(`input-q${qNum}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.focus();
    }
  };

  // Check correctness of answer
  const isQuestionCorrect = (q: typeof testData.questions[0]): boolean => {
    const userVal = (answers[q.id] || "").trim().toLowerCase();
    if (!userVal) return false;
    return q.acceptedAnswers.some((accepted) => {
      const cleanAccepted = accepted.toLowerCase().trim();
      return (
        userVal === cleanAccepted ||
        userVal.replace(/^(a|an|the)\s+/, "") === cleanAccepted.replace(/^(a|an|the)\s+/, "") ||
        userVal.replace(/[£$€,.]/g, "") === cleanAccepted.replace(/[£$€,.]/g, "")
      );
    });
  };

  const handleSubmit = async () => {
    setEvaluating(true);

    let correctCount = 0;
    const questionBreakdown = testData.questions.map((q) => {
      const correct = isQuestionCorrect(q);
      if (correct) correctCount++;
      return {
        questionId: q.id,
        type: q.type,
        correct,
      };
    });

    setScore(correctCount);
    const totalQuestions = testData.questions.length;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);
    const band = calculateIeltsBand(accuracy);

    // Save attempt to service
    try {
      await saveTestAttempt(user?.uid, {
        testId: testData.id,
        testTitle: testData.title,
        skill: "listening",
        correctCount,
        totalQuestions,
        accuracy,
        estimatedBand: band,
        durationSeconds: currentTime,
        submittedAt: Date.now(),
        answers,
        questionBreakdown,
      });

      // Record any mistakes
      const failedQuestions = testData.questions
        .filter((q) => !isQuestionCorrect(q))
        .map((q) => ({
          questionId: q.id,
          prompt: q.prompt,
          questionType:
            q.type === "table_completion"
              ? "Table Completion"
              : q.type === "multiple_choice"
              ? "Multiple Choice"
              : "Note Completion",
          yourAnswer: answers[q.id] || "(Javob berilmagan)",
          correctAnswer: q.acceptedAnswers[0],
          reason: q.explanation,
        }));

      if (failedQuestions.length > 0) {
        await recordMistakesFromTest(user?.uid, {
          drillId: testData.id,
          drillTitle: testData.title,
          skill: "listening",
          failedQuestions,
        });
      }
    } catch (err) {
      console.error("Error saving attempt:", err);
    }

    setSubmitted(true);
    setEvaluating(false);
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
    setShowTranscriptAfterSubmit(false);
    handleRestart();
  };

  const handleOpenAskModal = (q: typeof testData.questions[0]) => {
    const userAns = answers[q.id] || "(Javob berilmagan)";
    const relatedSeg = testData.segments.find((s) => s.relatedQuestion === q.num);
    setContextualData({
      skill: "listening",
      taskTitle: testData.title,
      questionPrompt: q.prompt,
      userAnswer: userAns,
      correctAnswer: q.acceptedAnswers[0],
      passageExcerpt: relatedSeg ? `${relatedSeg.speaker}: "${relatedSeg.text}"` : undefined,
      feedbackSummary: q.explanation,
    });
    setAskModalOpen(true);
  };

  const handleOpenReportModal = (q: typeof testData.questions[0]) => {
    setReportContext({
      skill: "listening",
      contentVersion: "v1.0",
      itemReference: `${testData.id}-q${q.num}`,
      itemPrompt: q.prompt,
      expectedAnswer: q.acceptedAnswers[0],
    });
    setReportModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-28">
      {/* 1. TOP STICKY AUDIO & CONTROL BAR */}
      <div className="sticky top-14 z-20 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Katalog</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[var(--foreground)] truncate max-w-[200px] sm:max-w-md">
                {testData.title}
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[var(--nav-active-bg)] text-[var(--nav-active-text)]">
                Section {testData.sectionNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Center & Right: Audio Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {practiceMode === "standard" && (
            <button
              onClick={handleRestart}
              className="p-2 rounded-xl border border-[var(--border)] text-[var(--secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer"
              title="Audioni boshidan boshlash"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handlePlayToggle}
            className="btn-primary !p-2.5 !min-h-[38px] rounded-xl flex items-center justify-center shadow-xs cursor-pointer hover:opacity-95 transition-all"
            title={isPlaying ? "Pauza" : "Play (Tinglash)"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          {/* Sound Wave Animation indicator */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)]">
            <div className="flex items-end gap-0.5 h-3 w-4">
              <span className={`w-0.5 bg-[var(--primary)] rounded-full transition-all ${isPlaying ? "h-3 animate-pulse" : "h-1"}`} />
              <span className={`w-0.5 bg-[var(--primary)] rounded-full transition-all ${isPlaying ? "h-2 animate-pulse delay-75" : "h-1.5"}`} />
              <span className={`w-0.5 bg-[var(--primary)] rounded-full transition-all ${isPlaying ? "h-3 animate-pulse delay-150" : "h-2"}`} />
              <span className={`w-0.5 bg-[var(--primary)] rounded-full transition-all ${isPlaying ? "h-1.5 animate-pulse" : "h-1"}`} />
            </div>
            <span className="text-xs font-mono font-bold text-[var(--foreground)] tabular">
              {formatTime(currentTime)} / {formatTime(testData.totalDuration)}
            </span>
          </div>

          {/* Scrubber slider */}
          <input
            type="range"
            min={0}
            max={testData.totalDuration}
            value={currentTime}
            onChange={handleSeek}
            disabled={practiceMode === "exam"}
            className="w-16 sm:w-28 h-1.5 bg-[var(--surface-subtle)] accent-[var(--primary)] rounded-lg cursor-pointer"
            title="Audio vaqti"
          />

          {/* Speed Selector */}
          <div className="hidden md:flex items-center gap-1 bg-[var(--surface-subtle)] p-0.5 rounded-xl border border-[var(--border)] text-[11px] font-bold">
            {[0.75, 1.0, 1.25].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-0.5 rounded-lg cursor-pointer transition-colors ${
                  speed === s
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "text-[var(--secondary)] hover:text-[var(--foreground)]"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <ThemeToggle />

          {/* Submit button on top bar */}
          <button
            onClick={handleSubmit}
            disabled={submitted || evaluating}
            className="btn-primary !py-2 !px-4 !min-h-[38px] text-xs font-bold"
          >
            {evaluating ? "Tekshirilmoqda…" : submitted ? "Natijalar" : `Topshirish (${answeredCount}/${testData.questions.length})`}
          </button>
        </div>
      </div>

      {/* 2. OFFICIAL IELTS LISTENING NOTICE */}
      <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border)] text-xs text-[var(--secondary)]">
        <div className="flex items-center gap-2.5">
          <Headphones className="w-4 h-4 text-[var(--primary)] shrink-0" />
          <p className="leading-snug">
            <strong className="text-[var(--foreground)]">IELTS Listening imtihon muhiti:</strong> Audioni tinglagan holda quyidagi jadval va eslatmalarni to‘ldiring. Haqiqiy imtihon talabi bo‘yicha <strong>audio matni (transkript) test davomida ko‘rsatilmaydi</strong>.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-[var(--muted)]">
          <span>{answeredCount} / {testData.questions.length} yechildi</span>
        </div>
      </div>

      {/* 3. POST-SUBMISSION RESULTS BANNER */}
      {submitted && score !== null && (
        <div className="card p-6 border-2 border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Test topshirildi!</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[var(--foreground)]">
                Natijangiz: {score} / {testData.questions.length} ta to‘g‘ri (
                {Math.round((score / testData.questions.length) * 100)}% aniqlik)
              </h3>
              <p className="text-xs text-[var(--secondary)]">
                Taxminiy IELTS Listening Band bali:{" "}
                <span className="font-bold text-[var(--primary)]">
                  Band {calculateIeltsBand(Math.round((score / testData.questions.length) * 100)).toFixed(1)}
                </span>
                . Xatolaringiz xatolar daftarchangizga avtomatik qayd etildi.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTranscriptAfterSubmit(!showTranscriptAfterSubmit)}
                className="btn-secondary !py-2 !px-4 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <span>{showTranscriptAfterSubmit ? "Transkriptni yashirish" : "Audio Transkriptini ko‘rish"}</span>
                {showTranscriptAfterSubmit ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleRetry}
                className="btn-primary !py-2 !px-4 text-xs font-bold cursor-pointer"
              >
                Qayta ishlash
              </button>
            </div>
          </div>

          {/* Collapsible Audio Script with highlighted evidence */}
          {showTranscriptAfterSubmit && (
            <div className="pt-4 border-t border-[var(--border)] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                To‘liq Audio Transkripti va Savol Tahlili:
              </h4>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-2 text-xs">
                {testData.segments.map((seg) => {
                  return (
                    <div
                      key={seg.id}
                      className={`p-3 rounded-xl border leading-relaxed ${
                        seg.relatedQuestion
                          ? "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/50"
                          : "bg-[var(--surface)] border-[var(--border)]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[var(--foreground)]">{seg.speaker}:</span>
                        {seg.relatedQuestion && (
                          <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-[var(--primary)] text-white">
                            Savol {seg.relatedQuestion} dalili
                          </span>
                        )}
                      </div>
                      <p className="text-[var(--secondary)]">{seg.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. MAIN TEST AREA: DYNAMIC IELTS TABLE & NOTES RENDERER */}
      <div className="card p-5 sm:p-8 space-y-8 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xs">
        {/* Test Section Header */}
        <div className="space-y-2 text-center pb-4 border-b border-[var(--border)]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-subtle)] border border-[var(--border)] text-xs font-bold text-[var(--secondary)]">
            <span>Section {testData.sectionNumber}</span>
            <span>·</span>
            <span>{testData.topic}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-[var(--foreground)] tracking-tight">
            {testData.title}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--primary)] font-bold max-w-2xl mx-auto">
            {testData.instructionsPart1}
          </p>
        </div>

        {/* 4.A: OYSTER BAY SAILING CLUB — AUTHENTIC CAMBRIDGE TABLE & NOTES */}
        {testData.id === "oyster-bay-sailing-club" && (
          <div className="space-y-8">
            {/* Table Completion (Questions 1–6) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Jadvalni to‘ldiring (Savollar 1–6)
                </span>
                <span className="text-xs text-[var(--muted)]">Ko‘pi bilan 2 ta so‘z va/yoki raqam</span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[var(--border)] shadow-xs">
                <table className="w-full text-left border-collapse min-w-[720px] bg-[var(--surface)]">
                  <thead>
                    <tr className="bg-[var(--surface-subtle)] border-b border-[var(--border)] text-xs font-black text-[var(--foreground)]">
                      <th className="p-4 w-[20%] border-r border-[var(--border)]">
                        Name of course
                      </th>
                      <th className="p-4 w-[32%] border-r border-[var(--border)]">
                        What you learn
                      </th>
                      <th className="p-4 w-[24%] border-r border-[var(--border)]">
                        Cost
                      </th>
                      <th className="p-4 w-[24%]">
                        Other information
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[var(--border)] text-xs sm:text-sm">
                    {/* Row 1: Taster Day */}
                    <tr className="hover:bg-[var(--surface-subtle)]/40 transition-colors">
                      <td className="p-4 font-bold border-r border-[var(--border)] align-top text-[var(--foreground)]">
                        Taster day
                      </td>
                      <td className="p-4 border-r border-[var(--border)] align-top text-[var(--secondary)]">
                        introduction to sailing
                      </td>
                      <td className="p-4 border-r border-[var(--border)] align-top text-[var(--secondary)] font-medium">
                        £120 if booking one place
                      </td>
                      <td className="p-4 align-top text-[var(--foreground)]">
                        <div className="leading-relaxed">
                          small groups (<span className="whitespace-nowrap">max {renderInlineInput(1, "q1", 55)}</span> people)
                        </div>
                      </td>
                    </tr>

                    {/* Row 2: Level 1 */}
                    <tr className="hover:bg-[var(--surface-subtle)]/40 transition-colors">
                      <td className="p-4 font-bold border-r border-[var(--border)] align-top text-[var(--foreground)]">
                        Level 1
                      </td>
                      {/* What you learn */}
                      <td className="p-4 border-r border-[var(--border)] align-top space-y-3">
                        <div className="flex items-start gap-2.5 leading-relaxed">
                          <span className="text-[var(--primary)] font-bold text-sm shrink-0 mt-1">•</span>
                          <div className="flex-1 text-[var(--foreground)]">
                            basic theory e.g. understanding the {renderInlineInput(2, "q2", 80)} and tides
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5 leading-relaxed">
                          <span className="text-[var(--primary)] font-bold text-sm shrink-0 mt-1">•</span>
                          <div className="flex-1 text-[var(--foreground)]">
                            basic sailing skills including {renderInlineInput(3, "q3", 75)} information
                          </div>
                        </div>
                      </td>

                      {/* Cost */}
                      <td className="p-4 border-r border-[var(--border)] align-top space-y-3">
                        <div className="flex items-center gap-2.5 leading-relaxed">
                          <span className="text-[var(--primary)] font-bold text-sm shrink-0">•</span>
                          <span className="font-semibold text-[var(--foreground)]">£200</span>
                        </div>
                        <div className="flex items-start gap-2.5 leading-relaxed">
                          <span className="text-[var(--primary)] font-bold text-sm shrink-0 mt-1">•</span>
                          <div className="flex-1 text-[var(--foreground)]">
                            {renderInlineInput(4, "q4", 75)} available for club members
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5 leading-relaxed">
                          <span className="text-[var(--primary)] font-bold text-sm shrink-0 mt-1">•</span>
                          <div className="flex-1 text-[var(--foreground)]">
                            all inclusive (plus a <span className="whitespace-nowrap">useful {renderInlineInput(5, "q5", 80)})</span>
                          </div>
                        </div>
                      </td>

                      {/* Other information */}
                      <td className="p-4 align-top text-[var(--foreground)]">
                        <div className="leading-relaxed">
                          <span className="whitespace-nowrap">a {renderInlineInput(6, "q6", 80)}</span> at the end of the course for all participants
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Part 2: Note Completion (Questions 7–10) */}
            <div className="space-y-4 pt-4 border-t border-[var(--border)]">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-[var(--foreground)]">
                  General Information
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[var(--primary)]">
                  {testData.instructionsPart2 || "Questions 7–10: Complete the notes below. Write ONE WORD ONLY for each answer."}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--foreground)]">
                <div className="flex items-start gap-2.5">
                  <span className="text-[var(--primary)] font-bold text-sm shrink-0 mt-0.5">•</span>
                  <span className="flex-1">Participants must be able to swim.</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[var(--primary)] font-bold text-sm shrink-0 mt-1">•</span>
                  <div className="flex-1">
                    Bring suitable clothing, <span className="whitespace-nowrap">a {renderInlineInput(7, "q7", 80)}</span> and toiletries (e.g. shampoo).
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[var(--primary)] font-bold text-sm shrink-0 mt-1">•</span>
                  <div className="flex-1">
                    There is <span className="whitespace-nowrap">a {renderInlineInput(8, "q8", 75)}</span> at the club.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[var(--primary)] font-bold text-sm shrink-0 mt-1">•</span>
                  <div className="flex-1">
                    Online <span className="whitespace-nowrap">training {renderInlineInput(9, "q9", 75)}</span> are recommended.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[var(--primary)] font-bold text-sm shrink-0 mt-1">•</span>
                  <div className="flex-1">
                    <span className="whitespace-nowrap">{renderInlineInput(10, "q10", 80)}</span> are available for course participants.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4.B: SECTION 1 — STUDENT ACCOMMODATION REGISTRATION */}
        {testData.id === "section-1-accommodation" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--foreground)]">
              <h3 className="text-base font-bold text-[var(--foreground)] mb-2">
                Registration Notes (Questions 1–4)
              </h3>
              <div className="flex items-start gap-2.5">
                <span className="text-[var(--primary)] font-bold text-sm shrink-0 mt-0.5">•</span>
                <div className="flex-1">
                  Type of accommodation preferred: {renderInlineInput(1, "q1", 120)}
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-[var(--primary)] font-bold text-sm shrink-0 mt-0.5">•</span>
                <div className="flex-1">
                  Maximum monthly budget: £{renderInlineInput(2, "q2", 80)}
                </div>
              </div>

              <div className="pt-2 pb-2">
                <div className="font-bold text-[var(--foreground)] mb-2">
                  Question 3: Kitchen dietary preference?
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: "A", text: "Vegetarian only" },
                    { id: "B", text: "Halal kitchen" },
                    { id: "C", text: "Standard shared" },
                  ].map((opt) => {
                    const isSelected = answers["q3"] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleAnswerChange("q3", opt.id)}
                        disabled={submitted}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                          isSelected
                            ? "border-[var(--primary)] bg-[var(--nav-active-bg)] text-[var(--nav-active-text)] font-bold ring-1 ring-[var(--primary)]"
                            : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] text-[var(--foreground)]"
                        }`}
                      >
                        <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0">
                          {opt.id}
                        </span>
                        <span>{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-[var(--primary)] font-bold text-sm shrink-0 mt-0.5">•</span>
                <div className="flex-1">
                  Telephone extension number: {renderInlineInput(4, "q4", 80)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4.C: SECTION 2 — CAMPUS FACILITIES & SPORTS COMPLEX TABLE & NOTES */}
        {testData.id === "section-2-campus-facilities" && (
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Sports Complex Comparison Table (Questions 1–6)
              </span>

              <div className="overflow-x-auto rounded-2xl border border-[var(--border)] shadow-xs">
                <table className="w-full text-left border-collapse min-w-[700px] bg-[var(--surface)] text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-subtle)] border-b border-[var(--border)] text-xs font-black text-[var(--foreground)]">
                      <th className="p-4 w-[24%] border-r border-[var(--border)]">Facility / Service</th>
                      <th className="p-4 w-[36%] border-r border-[var(--border)]">Schedule & Peak Hours</th>
                      <th className="p-4 w-[40%]">Pricing & Booking Requirements</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    <tr className="hover:bg-[var(--surface-subtle)]/40">
                      <td className="p-4 font-bold border-r border-[var(--border)] align-top text-[var(--foreground)]">
                        Olympic Pool
                      </td>
                      <td className="p-4 border-r border-[var(--border)] align-top text-[var(--foreground)]">
                        Opens 6:30 am on weekdays; free for students before {renderInlineInput(1, "q1", 75)}
                      </td>
                      <td className="p-4 align-top text-[var(--secondary)]">
                        Included in standard sports pass
                      </td>
                    </tr>
                    <tr className="hover:bg-[var(--surface-subtle)]/40">
                      <td className="p-4 font-bold border-r border-[var(--border)] align-top text-[var(--foreground)]">
                        Fitness Suite
                      </td>
                      <td className="p-4 border-r border-[var(--border)] align-top text-[var(--foreground)]">
                        Peak workout hours between 5 pm and {renderInlineInput(2, "q2", 70)}
                      </td>
                      <td className="p-4 align-top text-[var(--foreground)]">
                        Silver membership: £25 monthly including {renderInlineInput(3, "q3", 95)} and yoga
                      </td>
                    </tr>
                    <tr className="hover:bg-[var(--surface-subtle)]/40">
                      <td className="p-4 font-bold border-r border-[var(--border)] align-top text-[var(--foreground)]">
                        Badminton & Squash
                      </td>
                      <td className="p-4 border-r border-[var(--border)] align-top text-[var(--foreground)]">
                        Reserve at least {renderInlineInput(4, "q4", 80)} in advance via app
                      </td>
                      <td className="p-4 align-top text-[var(--foreground)]">
                        Rackets supplied; must bring own {renderInlineInput(5, "q5", 90)}
                      </td>
                    </tr>
                    <tr className="hover:bg-[var(--surface-subtle)]/40">
                      <td className="p-4 font-bold border-r border-[var(--border)] align-top text-[var(--foreground)]">
                        Changing Rooms
                      </td>
                      <td className="p-4 border-r border-[var(--border)] align-top text-[var(--secondary)]">
                        Open all day
                      </td>
                      <td className="p-4 align-top text-[var(--foreground)]">
                        Lockers require a refundable {renderInlineInput(6, "q6", 60)} coin
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[var(--border)]">
              <h3 className="text-base font-black text-[var(--foreground)]">
                Health & Safety Guidelines (Questions 7–10)
              </h3>
              <div className="p-6 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-3.5 text-xs sm:text-sm text-[var(--foreground)]">
                <div className="flex items-start gap-2.5">
                  <span className="text-[var(--primary)] font-bold text-sm shrink-0 mt-0.5">•</span>
                  <div className="flex-1">
                    All new gym users must complete a compulsory {renderInlineInput(7, "q7", 110)} before free weights.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[var(--primary)] font-bold text-sm shrink-0 mt-0.5">•</span>
                  <div className="flex-1">
                    Clean indoor {renderInlineInput(8, "q8", 80)} is strictly mandatory in dance studios.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[var(--primary)] font-bold text-sm shrink-0 mt-0.5">•</span>
                  <div className="flex-1">
                    Non-student guest passes cost £{renderInlineInput(9, "q9", 50)} per visit.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[var(--primary)] font-bold text-sm shrink-0 mt-0.5">•</span>
                  <div className="flex-1">
                    Campus {renderInlineInput(10, "q10", 100)} visits occur on Tuesdays and Thursdays.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4.D: SECTION 3 — RESEARCH ASSIGNMENT TABLE & NOTES */}
        {testData.id === "section-3-research-assignment" && (
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Research Methodology Timeline (Questions 1–6)
              </span>

              <div className="overflow-x-auto rounded-2xl border border-[var(--border)] shadow-xs">
                <table className="w-full text-left border-collapse min-w-[700px] bg-[var(--surface)] text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-subtle)] border-b border-[var(--border)] text-xs font-black text-[var(--foreground)]">
                      <th className="p-4 w-[25%] border-r border-[var(--border)]">Stage</th>
                      <th className="p-4 w-[35%] border-r border-[var(--border)]">Target / Focus</th>
                      <th className="p-4 w-[40%]">Key Methodology & Protocol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    <tr className="hover:bg-[var(--surface-subtle)]/40">
                      <td className="p-4 font-bold border-r border-[var(--border)] align-top text-[var(--foreground)]">
                        Subject Selection
                      </td>
                      <td className="p-4 border-r border-[var(--border)] align-top text-[var(--foreground)]">
                        Children acquiring English and {renderInlineInput(1, "q1", 80)} simultaneously
                      </td>
                      <td className="p-4 align-top text-[var(--secondary)]">Aged between 3 and 4 years</td>
                    </tr>
                    <tr className="hover:bg-[var(--surface-subtle)]/40">
                      <td className="p-4 font-bold border-r border-[var(--border)] align-top text-[var(--foreground)]">
                        Data Capture
                      </td>
                      <td className="p-4 border-r border-[var(--border)] align-top text-[var(--foreground)]">
                        Primary tool: parent-recorded {renderInlineInput(2, "q2", 95)}
                      </td>
                      <td className="p-4 align-top text-[var(--foreground)]">
                        Pilot phase includes {renderInlineInput(3, "q3", 50)} families
                      </td>
                    </tr>
                    <tr className="hover:bg-[var(--surface-subtle)]/40">
                      <td className="p-4 font-bold border-r border-[var(--border)] align-top text-[var(--foreground)]">
                        Compliance
                      </td>
                      <td className="p-4 border-r border-[var(--border)] align-top text-[var(--foreground)]">
                        Formal {renderInlineInput(4, "q4", 75)} approval required
                      </td>
                      <td className="p-4 align-top text-[var(--secondary)]">Signed off by department review</td>
                    </tr>
                    <tr className="hover:bg-[var(--surface-subtle)]/40">
                      <td className="p-4 font-bold border-r border-[var(--border)] align-top text-[var(--foreground)]">
                        Analysis
                      </td>
                      <td className="p-4 border-r border-[var(--border)] align-top text-[var(--foreground)]">
                        Must follow standard {renderInlineInput(5, "q5", 80)} symbols
                      </td>
                      <td className="p-4 align-top text-[var(--foreground)]">
                        CLAN software with automatic {renderInlineInput(6, "q6", 75)} tagging
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[var(--border)]">
              <h3 className="text-base font-black text-[var(--foreground)]">
                Thesis Requirements & Deadlines (Questions 7–10)
              </h3>
              <div className="p-6 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-3.5 text-xs sm:text-sm text-[var(--foreground)]">
                <div className="flex items-start gap-2.5">
                  <span className="text-[var(--primary)] font-bold text-sm shrink-0 mt-0.5">•</span>
                  <div className="flex-1">
                    Literature review requires at least {renderInlineInput(7, "q7", 50)} peer-reviewed sources.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[var(--primary)] font-bold text-sm shrink-0 mt-0.5">•</span>
                  <div className="flex-1">
                    Preliminary findings presentation date: {renderInlineInput(8, "q8", 60)} November.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[var(--primary)] font-bold text-sm shrink-0 mt-0.5">•</span>
                  <div className="flex-1">
                    Exhibition display format: an {renderInlineInput(9, "q9", 50)} poster summary.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[var(--primary)] font-bold text-sm shrink-0 mt-0.5">•</span>
                  <div className="flex-1">
                    Peer review feedback is strictly {renderInlineInput(10, "q10", 95)}.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4.E: SECTION 4 & OTHER TESTS — THEMATIC LECTURE NOTES & FORM COMPLETION */}
        {(testData.id === "section-4-grid-lecture" ||
          (!["oyster-bay-sailing-club", "section-1-accommodation", "section-2-campus-facilities", "section-3-research-assignment"].includes(testData.id))) && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-5 text-xs sm:text-sm leading-relaxed text-[var(--foreground)]">
              <h3 className="text-base font-black text-[var(--foreground)] border-b border-[var(--border)] pb-2">
                Lecture Notes & Detailed Summary (Questions 1–10)
              </h3>

              <div className="space-y-4">
                {testData.questions.map((q) => {
                  const cleanedPrompt = q.prompt.replace(/\[\d+\]/g, "");
                  return (
                    <div key={q.id} className="flex items-start gap-2.5">
                      <span className="text-[var(--primary)] font-bold text-sm shrink-0 mt-0.5">•</span>
                      <div className="flex-1 text-[var(--foreground)]">
                        {cleanedPrompt}
                        {renderInlineInput(q.num, q.id, 90)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. DETAILED QUESTION-BY-QUESTION BREAKDOWN WITH EVIDENCE (POST-SUBMIT) */}
      {submitted && (
        <div className="card p-6 border border-[var(--border)] bg-[var(--surface)] space-y-4 rounded-2xl">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[var(--primary)]" />
              <h3 className="font-extrabold text-sm sm:text-base text-[var(--foreground)]">
                Barcha Savollar Tahlili va To‘g‘ri Javoblar (Detailed Breakdown)
              </h3>
            </div>
            <button
              onClick={() => setShowBreakdownAfterSubmit(!showBreakdownAfterSubmit)}
              className="text-xs font-bold text-[var(--secondary)] hover:text-[var(--foreground)] cursor-pointer flex items-center gap-1"
            >
              <span>{showBreakdownAfterSubmit ? "Yashirish" : "Ko‘rsatish"}</span>
              {showBreakdownAfterSubmit ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showBreakdownAfterSubmit && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {testData.questions.map((q) => {
                const userAns = answers[q.id] || "(Javob berilmagan)";
                const isCorrect = isQuestionCorrect(q);
                const relatedSeg = testData.segments.find((s) => s.relatedQuestion === q.num);

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border space-y-2 text-xs transition-all ${
                      isCorrect
                        ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
                        : "bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-black text-[var(--foreground)]">
                        Savol {q.num}: {q.prompt}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          isCorrect
                            ? "bg-emerald-600 text-white"
                            : "bg-rose-600 text-white"
                        }`}
                      >
                        {isCorrect ? "To‘g‘ri" : "Noto‘g‘ri"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[var(--border)]">
                      <div>
                        <span className="text-[10px] font-bold text-[var(--muted)] uppercase">
                          Sizning javobingiz:
                        </span>
                        <p className={`font-bold ${isCorrect ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}`}>
                          {userAns}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[var(--muted)] uppercase">
                          Qabul qilingan javob:
                        </span>
                        <p className="font-bold text-emerald-700 dark:text-emerald-300">
                          {q.acceptedAnswers.join(" / ")}
                        </p>
                      </div>
                    </div>

                    {relatedSeg && (
                      <div className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[11px] leading-relaxed">
                        <strong className="text-[var(--primary)]">{relatedSeg.speaker}:</strong> "{relatedSeg.text}"
                      </div>
                    )}

                    <p className="text-[11px] text-[var(--secondary)] leading-relaxed">
                      {q.explanation}
                    </p>

                    {/* Action buttons: Ask about this & Report Issue */}
                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-[var(--border)]">
                      <button
                        onClick={() => handleOpenAskModal(q)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-[var(--primary)] bg-[var(--nav-active-bg)] hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Shu savol haqida so‘rash</span>
                      </button>
                      <button
                        onClick={() => handleOpenReportModal(q)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-[var(--muted)] hover:text-rose-600 transition-colors cursor-pointer"
                        title="Xatolik haqida xabar berish"
                      >
                        <Flag className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 6. STICKY BOTTOM QUESTION NAVIGATOR (Questions 1–N) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--border)] px-4 py-2.5 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Question Bubbles 1..N */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1">
            <span className="text-[11px] font-bold text-[var(--muted)] hidden sm:inline mr-1">
              Savollar:
            </span>
            {testData.questions.map((q) => {
              const isAnswered = (answers[q.id] || "").trim().length > 0;
              const isFlagged = flags[q.num];
              const isCorrect = submitted ? isQuestionCorrect(q) : null;

              let btnStyle = "bg-[var(--surface-subtle)] text-[var(--foreground)] border-[var(--border)]";
              if (submitted) {
                btnStyle = isCorrect
                  ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                  : "bg-rose-600 text-white border-rose-600 font-bold";
              } else if (isAnswered) {
                btnStyle = "bg-[var(--primary)] text-white border-[var(--primary)] font-bold shadow-xs";
              }

              return (
                <button
                  key={q.num}
                  type="button"
                  onClick={() => scrollToQuestion(q.num)}
                  className={`w-8 h-8 rounded-xl border text-xs font-bold flex items-center justify-center cursor-pointer transition-all hover:scale-105 shrink-0 ${btnStyle} ${
                    activeQuestionNum === q.num ? "ring-2 ring-[var(--primary)] ring-offset-1" : ""
                  }`}
                  title={`Savol ${q.num}: ${isAnswered ? "Javob berilgan" : "Hali javob berilmagan"}`}
                >
                  {q.num}
                </button>
              );
            })}
          </div>

          {/* Right: Answered Progress & Submit Button */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-bold text-[var(--secondary)] hidden md:inline">
              {answeredCount} / {testData.questions.length} belgilandi
            </span>

            {submitted ? (
              <button
                onClick={handleRetry}
                className="btn-secondary !py-2 !px-4 text-xs font-bold cursor-pointer"
              >
                Qayta urinish
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={evaluating}
                className="btn-primary !py-2 !px-5 text-xs font-bold shadow-md cursor-pointer hover:opacity-95"
              >
                Topshirish ({answeredCount}/{testData.questions.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 7. MODALS */}
      <AskAboutThisModal
        isOpen={askModalOpen}
        onClose={() => setAskModalOpen(false)}
        contextData={contextualData}
      />

      <ReportIssueModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        reportContext={reportContext}
      />
    </div>
  );

  // Helper component to render integrated IELTS CD-input field
  function renderInlineInput(num: number, qId: string, minWidth: number = 80) {
    const q = testData.questions.find((x) => x.id === qId);
    const value = answers[qId] || "";
    const isCorrect = submitted && q ? isQuestionCorrect(q) : null;
    const isFlagged = flags[num];

    return (
      <span className="inline-flex items-center align-middle mx-1 my-0.5">
        <span
          className={`inline-flex items-center rounded-lg border transition-all ${
            submitted
              ? isCorrect
                ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200"
                : "border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200"
              : activeQuestionNum === num
              ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20 bg-[var(--surface)]"
              : value
              ? "border-[var(--primary)]/60 bg-[var(--surface)] shadow-2xs"
              : "border-[var(--border)] bg-[var(--surface-subtle)] hover:border-[var(--muted)]"
          }`}
        >
          {/* Question Number Badge / Flag Button */}
          <button
            type="button"
            onClick={() => toggleFlag(num)}
            title={`Savol ${num} ${isFlagged ? "(Belgilangan)" : "(Belgilash uchun bosing)"}`}
            className={`px-2 py-1 text-[11px] font-black rounded-l-[7px] border-r border-[var(--border)] transition-colors select-none cursor-pointer ${
              isFlagged
                ? "bg-amber-400 text-stone-900"
                : "bg-[var(--surface)] text-[var(--secondary)] hover:text-[var(--primary)]"
            }`}
          >
            {num}
          </button>

          {/* Actual Input Field */}
          <input
            id={`input-q${num}`}
            type="text"
            value={value}
            disabled={submitted}
            onChange={(e) => handleAnswerChange(qId, e.target.value)}
            onFocus={() => setActiveQuestionNum(num)}
            placeholder=""
            autoComplete="off"
            spellCheck="false"
            style={{ width: `${Math.max(65, minWidth)}px` }}
            className={`px-2 py-1 text-xs sm:text-sm font-semibold bg-transparent text-[var(--foreground)] outline-none ${
              submitted && !isCorrect ? "line-through text-rose-600 dark:text-rose-400" : ""
            }`}
          />
        </span>

        {/* Post-submission correct answer inline tag */}
        {submitted && q && !isCorrect && (
          <span className="ml-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-400 dark:border-emerald-700 whitespace-nowrap">
            ✓ {q.acceptedAnswers[0]}
          </span>
        )}
      </span>
    );
  }
}
