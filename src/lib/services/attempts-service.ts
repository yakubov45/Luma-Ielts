import { db } from "@/lib/firebase/client";
import { collection, doc, getDocs, setDoc, query, orderBy, limit } from "firebase/firestore";

export type TestAttempt = {
  id: string;
  testId: string;
  testTitle: string;
  skill: "reading" | "listening" | "writing" | "speaking";
  correctCount: number;
  totalQuestions: number;
  accuracy: number;
  estimatedBand: number;
  durationSeconds: number;
  submittedAt: number;
  answers: Record<string, string>;
  questionBreakdown?: Array<{
    questionId: string;
    type: string;
    correct: boolean;
  }>;
};

const LOCAL_STORAGE_KEY = "ielts_focus_user_attempts";

export const DEFAULT_SAMPLE_ATTEMPTS: TestAttempt[] = [
  {
    id: "att_sample_1",
    testId: "urban-gardens-drill",
    testTitle: "Urban Gardens: A Short Academic Drill",
    skill: "reading",
    correctCount: 2,
    totalQuestions: 3,
    accuracy: 67,
    estimatedBand: 6.5,
    durationSeconds: 380,
    submittedAt: Date.now() - 86400000,
    answers: { q1: "a", q2: "true", q3: "plants" },
    questionBreakdown: [
      { questionId: "q1", type: "Single Choice", correct: true },
      { questionId: "q2", type: "True / False / Not Given", correct: false },
      { questionId: "q3", type: "Sentence Completion", correct: false },
    ],
  },
  {
    id: "att_sample_2",
    testId: "cognitive-bilingualism",
    testTitle: "Cognitive Advantages of Bilingualism",
    skill: "reading",
    correctCount: 3,
    totalQuestions: 3,
    accuracy: 100,
    estimatedBand: 8.0,
    durationSeconds: 420,
    submittedAt: Date.now() - 3600000 * 5,
    answers: { q1: "b", q2: "true", q3: "cognitive reserve" },
    questionBreakdown: [
      { questionId: "q1", type: "Single Choice", correct: true },
      { questionId: "q2", type: "True / False / Not Given", correct: true },
      { questionId: "q3", type: "Sentence Completion", correct: true },
    ],
  },
];

export function calculateIeltsBand(accuracyPercent: number): number {
  if (accuracyPercent >= 93) return 8.5;
  if (accuracyPercent >= 86) return 8.0;
  if (accuracyPercent >= 78) return 7.5;
  if (accuracyPercent >= 70) return 7.0;
  if (accuracyPercent >= 62) return 6.5;
  if (accuracyPercent >= 52) return 6.0;
  if (accuracyPercent >= 42) return 5.5;
  return 5.0;
}

function getLocalAttempts(): TestAttempt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalAttempts(attempts: TestAttempt[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(attempts));
  } catch {}
}

export function clearGuestAttempts() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {}
}

export function getGuestAttemptsList(): TestAttempt[] {
  return getLocalAttempts();
}

export async function fetchUserAttempts(uid: string | null | undefined): Promise<TestAttempt[]> {
  if (!uid) {
    return getLocalAttempts();
  }

  try {
    const colRef = collection(db, `users/${uid}/attempts`);
    const q = query(colRef, orderBy("submittedAt", "desc"), limit(50));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map((docSnap) => {
      const d = docSnap.data();
      const accuracy = Number(d.accuracy ?? 0);
      const total = Number(d.totalQuestions ?? d.total ?? 0);
      return {
        id: docSnap.id,
        testId: d.testId || d.contentId || "",
        testTitle: d.testTitle || "IELTS Test",
        skill: d.skill || "reading",
        correctCount: Number(d.correctCount ?? 0),
        totalQuestions: total,
        accuracy,
        estimatedBand: total >= 10 ? Number(d.estimatedBand ?? calculateIeltsBand(accuracy)) : 0,
        durationSeconds: Number(d.durationSeconds ?? 0),
        submittedAt: typeof d.submittedAt === "number" ? d.submittedAt : d.submittedAt?.toMillis?.() || Date.now(),
        answers: d.answers || d.draftAnswers || {},
        questionBreakdown: d.questionBreakdown || [],
      };
    });
  } catch (err) {
    console.warn("fetchUserAttempts error:", err);
    return [];
  }
}

export async function saveTestAttempt(
  uid: string | null | undefined,
  attempt: Omit<TestAttempt, "id">
): Promise<TestAttempt> {
  const id = `att_${Date.now()}`;
  const fullAttempt: TestAttempt = { ...attempt, id };

  if (!uid) {
    // Guest attempt -> save to guest local storage
    const current = getLocalAttempts();
    saveLocalAttempts([fullAttempt, ...current]);
  } else {
    // Authenticated user -> save directly to Firestore
    try {
      await setDoc(doc(db, `users/${uid}/attempts`, id), fullAttempt);
    } catch (e) {
      console.warn("Failed to save attempt to Firestore:", e);
    }
  }

  return fullAttempt;
}

export type UserProgressStats = {
  totalAttempts: number;
  totalQuestions: number;
  overallAccuracy: number | null;
  estimatedBand: number | null;
  hasOfficialBand: boolean;
  questionTypeStats: Record<string, { correct: number; total: number; percentage: number }>;
  weeklyMinutes: Record<string, number>; // "Dush", "Sesh", etc.
  latestAttempt?: TestAttempt;
};

export function computeProgressStats(attempts: TestAttempt[]): UserProgressStats {
  const initialWeeklyMinutes: Record<string, number> = {
    Dush: 0,
    Sesh: 0,
    Cho: 0,
    Pay: 0,
    Jum: 0,
    Shan: 0,
    Yak: 0,
  };

  if (!attempts.length) {
    return {
      totalAttempts: 0,
      totalQuestions: 0,
      overallAccuracy: null,
      estimatedBand: null,
      hasOfficialBand: false,
      questionTypeStats: {},
      weeklyMinutes: initialWeeklyMinutes,
    };
  }

  let totalCorrect = 0;
  let totalQuestions = 0;
  const questionTypeStats: Record<string, { correct: number; total: number; percentage: number }> = {};
  const weeklyMinutes = { ...initialWeeklyMinutes };

  const dayMap: Record<number, string> = {
    1: "Dush",
    2: "Sesh",
    3: "Cho",
    4: "Pay",
    5: "Jum",
    6: "Shan",
    0: "Yak",
  };

  for (const a of attempts) {
    totalCorrect += a.correctCount;
    totalQuestions += a.totalQuestions;

    const dayOfWeek = new Date(a.submittedAt).getDay();
    const dayName = dayMap[dayOfWeek] || "Dush";
    weeklyMinutes[dayName] = (weeklyMinutes[dayName] || 0) + Math.round((a.durationSeconds || 0) / 60);

    if (a.questionBreakdown) {
      for (const q of a.questionBreakdown) {
        if (!questionTypeStats[q.type]) {
          questionTypeStats[q.type] = { correct: 0, total: 0, percentage: 0 };
        }
        questionTypeStats[q.type].total += 1;
        if (q.correct) questionTypeStats[q.type].correct += 1;
      }
    }
  }

  for (const key of Object.keys(questionTypeStats)) {
    const item = questionTypeStats[key];
    item.percentage = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
  }

  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : null;
  const hasOfficialBand = totalQuestions >= 10 && overallAccuracy !== null;
  const estimatedBand = hasOfficialBand ? calculateIeltsBand(overallAccuracy!) : null;

  return {
    totalAttempts: attempts.length,
    totalQuestions,
    overallAccuracy,
    estimatedBand,
    hasOfficialBand,
    questionTypeStats,
    weeklyMinutes,
    latestAttempt: attempts[0],
  };
}
