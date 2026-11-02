import { db } from "@/lib/firebase/client";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { fetchUserVocabulary } from "./vocabulary-service";
import { fetchUserMistakes } from "./mistakes-service";
import { fetchUserAttempts } from "./attempts-service";
import {
  QuestionnaireData,
  DayStudyPlan,
  PlannedDailyTask,
  DEFAULT_QUESTIONNAIRE_PLAN,
  WeekDaySummary,
} from "@/lib/types/study-plan";
import {
  generateDayPlan,
  generateWeekSummary,
  formatDateKey,
  LearningStateContext,
} from "@/lib/study-plan/planning-engine";

export type DailyTask = PlannedDailyTask;
export type { DayStudyPlan, QuestionnaireData };

const LOCAL_STORAGE_KEY_PREFIX = "ielts_focus_study_day_";
const PREFERENCES_STORAGE_KEY = "ielts_focus_questionnaire_preferences";
const ONBOARDING_COMPLETED_KEY = "ielts_focus_onboarding_completed";

export function getTodayKey(): string {
  return formatDateKey(new Date());
}

/**
 * Loads the user's questionnaire preferences from Firestore or localStorage
 */
export async function fetchQuestionnairePreferences(
  uid: string | null | undefined
): Promise<QuestionnaireData> {
  // 1. Try Firestore if authenticated
  if (uid) {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        const data = snap.data();
        if (data.questionnaire) {
          return data.questionnaire as QuestionnaireData;
        }
        // If legacy flat fields exist, build questionnaire object
        if (data.targetBand || data.dailyStudyMinutes) {
          return {
            ...DEFAULT_QUESTIONNAIRE_PLAN,
            targetBand: data.targetBand ? String(data.targetBand) as any : "6.5",
            dailyStudyMinutes: Number(data.dailyStudyMinutes) as any || 30,
            examDate: data.examDate || null,
            timezone: data.timezone || "Asia/Tashkent",
          };
        }
      }
    } catch (e) {
      console.warn("fetchQuestionnairePreferences Firestore error:", e);
    }
  }

  // 2. Try localStorage (for guests or offline)
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {}
  }

  return DEFAULT_QUESTIONNAIRE_PLAN;
}

/**
 * Saves questionnaire preferences and generates an initial plan
 */
export async function saveQuestionnairePreferences(
  uid: string | null | undefined,
  preferences: QuestionnaireData
): Promise<void> {
  const payload: QuestionnaireData = {
    ...preferences,
    updatedAt: Date.now(),
    completedAt: preferences.completedAt || Date.now(),
  };

  // 1. Save to localStorage
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(payload));
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
    } catch {}
  }

  // 2. Save to Firestore if authenticated
  if (uid) {
    try {
      const userRef = doc(db, "users", uid);
      // Legacy compatibility: parse targetBand to number if possible for legacy readers
      const numericTargetBand =
        payload.targetBand === "8.0+"
          ? 8.0
          : payload.targetBand === "not_sure"
          ? null
          : parseFloat(payload.targetBand) || 6.5;

      await setDoc(
        userRef,
        {
          displayName: "IELTS learner",
          targetBand: numericTargetBand,
          dailyStudyMinutes: payload.dailyStudyMinutes,
          examDate: payload.examDate,
          timezone: payload.timezone,
          onboardingCompleted: true,
          questionnaire: payload,
          studyPlanPreferences: payload,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      console.warn("Failed to persist questionnaire in Firestore:", e);
    }
  }

  // 3. Immediately regenerate today's plan with new preferences
  await regenerateTodayPlan(uid, payload);
}

/**
 * Assembles current learning state context from services
 */
async function getLearningState(uid: string | null | undefined): Promise<LearningStateContext> {
  try {
    const [vocabWords, mistakes, attempts] = await Promise.all([
      fetchUserVocabulary(uid),
      fetchUserMistakes(uid),
      fetchUserAttempts(uid),
    ]);

    const now = Date.now();
    const dueVocabCount = vocabWords.filter((w) => w.dueAt <= now).length;
    const pendingMistakesCount = mistakes.filter((m) => m.status === "pending").length;

    // Check for unfinished attempt
    const inProgress = attempts.find((a: any) => a.status === "in_progress");
    const unfinishedAttempt = inProgress
      ? {
          id: inProgress.id,
          title: inProgress.testTitle || "Boshlangan mashq",
          skill: inProgress.skill || "reading",
          link: `/reading/${inProgress.testId || ""}`,
        }
      : null;

    return {
      dueVocabCount,
      pendingMistakesCount,
      attemptsCount: attempts.length,
      unfinishedAttempt,
      hasDiagnosticResult: attempts.some((a) => a.testId?.includes("diagnostic")),
    };
  } catch (err) {
    console.warn("Error collecting learning state for study plan:", err);
    return {
      dueVocabCount: 0,
      pendingMistakesCount: 0,
      attemptsCount: 0,
      unfinishedAttempt: null,
      hasDiagnosticResult: false,
    };
  }
}

/**
 * Fetches today's study plan.
 * Returns existing plan if already generated today, preserving completed tasks.
 */
export async function fetchTodayStudyPlan(uid: string | null | undefined): Promise<DayStudyPlan> {
  const dateKey = getTodayKey();

  // 1. Check Firestore first if logged in
  if (uid) {
    try {
      const snap = await getDoc(doc(db, `users/${uid}/studyDays`, dateKey));
      if (snap.exists()) {
        const data = snap.data();
        return {
          dateKey,
          isRestDay: Boolean(data.isRestDay),
          tasks: data.tasks || [],
          completedMinutes: Number(data.completedMinutes || 0),
          totalMinutes: Number(data.totalMinutes || 0),
          explanation: data.explanation || "",
          nextScheduledDateKey: data.nextScheduledDateKey,
        };
      }
    } catch (e) {
      console.warn("fetchTodayStudyPlan error reading Firestore:", e);
    }
  }

  // 2. Check localStorage
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${dateKey}`);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {}
  }

  // 3. Not generated yet today: generate deterministic plan
  const preferences = await fetchQuestionnairePreferences(uid);
  return regenerateTodayPlan(uid, preferences);
}

/**
 * Regenerates today's plan using latest learning state and preferences
 */
export async function regenerateTodayPlan(
  uid: string | null | undefined,
  preferences?: QuestionnaireData
): Promise<DayStudyPlan> {
  const dateKey = getTodayKey();
  const prefs = preferences || (await fetchQuestionnairePreferences(uid));
  const state = await getLearningState(uid);

  const newPlan = generateDayPlan(prefs, state, new Date());

  // Save to localStorage
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${dateKey}`, JSON.stringify(newPlan));
    } catch {}
  }

  // Save to Firestore if authenticated
  if (uid) {
    try {
      await setDoc(
        doc(db, `users/${uid}/studyDays`, dateKey),
        {
          dateKey,
          isRestDay: newPlan.isRestDay,
          tasks: newPlan.tasks,
          completedMinutes: newPlan.completedMinutes,
          totalMinutes: newPlan.totalMinutes,
          explanation: newPlan.explanation,
          nextScheduledDateKey: newPlan.nextScheduledDateKey || null,
          updatedAt: Date.now(),
        },
        { merge: true }
      );
    } catch (e) {
      console.warn("Failed to persist new study plan to Firestore:", e);
    }
  }

  return newPlan;
}

/**
 * Toggles a task completion state and updates total completed minutes
 */
export async function toggleTaskCompletion(
  uid: string | null | undefined,
  taskId: string
): Promise<DayStudyPlan> {
  const currentPlan = await fetchTodayStudyPlan(uid);
  const updatedTasks = currentPlan.tasks.map((t) =>
    t.id === taskId ? { ...t, completed: !t.completed } : t
  );

  const completedMinutes = updatedTasks
    .filter((t) => t.completed)
    .reduce((acc, t) => acc + t.duration, 0);

  const updatedPlan: DayStudyPlan = {
    ...currentPlan,
    tasks: updatedTasks,
    completedMinutes,
  };

  // Update localStorage
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        `${LOCAL_STORAGE_KEY_PREFIX}${currentPlan.dateKey}`,
        JSON.stringify(updatedPlan)
      );
    } catch {}
  }

  // Update Firestore
  if (uid) {
    try {
      await setDoc(
        doc(db, `users/${uid}/studyDays`, currentPlan.dateKey),
        {
          dateKey: currentPlan.dateKey,
          isRestDay: currentPlan.isRestDay,
          tasks: updatedTasks,
          completedMinutes,
          totalMinutes: currentPlan.totalMinutes,
          explanation: currentPlan.explanation,
          updatedAt: Date.now(),
        },
        { merge: true }
      );
    } catch (e) {
      console.warn("Failed to update task completion in Firestore:", e);
    }
  }

  return updatedPlan;
}

/**
 * Fetches the 7-day schedule summary for weekly calendar
 */
export async function fetchWeeklySchedule(
  uid: string | null | undefined
): Promise<WeekDaySummary[]> {
  const prefs = await fetchQuestionnairePreferences(uid);
  return generateWeekSummary(prefs, new Date());
}
