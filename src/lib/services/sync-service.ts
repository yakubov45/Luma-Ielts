import { db } from "@/lib/firebase/client";
import { doc, setDoc } from "firebase/firestore";
import { getGuestAttemptsList, clearGuestAttempts } from "./attempts-service";
import { getGuestVocabularyWords, clearGuestVocabulary } from "./vocabulary-service";
import { getGuestMistakesList, clearGuestMistakes } from "./mistakes-service";
import { getGuestWritingData, clearGuestWriting } from "./writing-service";

export interface GuestDataSummary {
  attemptCount: number;
  vocabCount: number;
  mistakeCount: number;
  writingCount: number;
  hasDrafts: boolean;
}

export function inspectGuestData(): GuestDataSummary {
  const attempts = getGuestAttemptsList();
  const vocab = getGuestVocabularyWords();
  const mistakes = getGuestMistakesList();
  const writing = getGuestWritingData();

  const hasDrafts = Boolean(writing.task1Draft || writing.task2Draft);

  return {
    attemptCount: attempts.length,
    vocabCount: vocab.length,
    mistakeCount: mistakes.length,
    writingCount: writing.submissions.length,
    hasDrafts,
  };
}

export function hasPendingGuestData(): boolean {
  const summary = inspectGuestData();
  return (
    summary.attemptCount > 0 ||
    summary.vocabCount > 0 ||
    summary.mistakeCount > 0 ||
    summary.writingCount > 0 ||
    summary.hasDrafts
  );
}

/**
 * Migrates local guest activity (attempts, vocab, mistakes, writing) into the user's
 * Firestore account upon login. Only clears local guest storage once all remote writes succeed.
 */
export async function syncGuestDataToAccount(uid: string): Promise<{
  success: boolean;
  migratedAttempts: number;
  migratedVocab: number;
  migratedMistakes: number;
  migratedWriting: number;
  error?: string;
}> {
  if (!uid) {
    return { success: false, migratedAttempts: 0, migratedVocab: 0, migratedMistakes: 0, migratedWriting: 0 };
  }

  const attempts = getGuestAttemptsList();
  const vocab = getGuestVocabularyWords();
  const mistakes = getGuestMistakesList();
  const writing = getGuestWritingData();

  let migratedAttempts = 0;
  let migratedVocab = 0;
  let migratedMistakes = 0;
  let migratedWriting = 0;

  try {
    // 1. Sync Attempts
    for (const att of attempts) {
      await setDoc(doc(db, `users/${uid}/attempts`, att.id), att, { merge: true });
      migratedAttempts++;
    }

    // 2. Sync Vocabulary
    for (const word of vocab) {
      await setDoc(doc(db, `users/${uid}/vocabulary`, word.id), word, { merge: true });
      migratedVocab++;
    }

    // 3. Sync Mistakes
    for (const mistake of mistakes) {
      await setDoc(doc(db, `users/${uid}/mistakes`, mistake.id), mistake, { merge: true });
      migratedMistakes++;
    }

    // 4. Sync Writing Submissions
    for (const sub of writing.submissions) {
      await setDoc(doc(db, `users/${uid}/writingAttempts`, sub.id), sub, { merge: true });
      migratedWriting++;
    }

    // 5. Migrate Writing Drafts if user doesn't already have one
    if (typeof window !== "undefined") {
      if (writing.task1Draft) {
        const userKey1 = `ielts_focus_draft_${uid}_task1`;
        if (!localStorage.getItem(userKey1)) {
          localStorage.setItem(userKey1, writing.task1Draft);
        }
      }
      if (writing.task2Draft) {
        const userKey2 = `ielts_focus_draft_${uid}_task2`;
        if (!localStorage.getItem(userKey2)) {
          localStorage.setItem(userKey2, writing.task2Draft);
        }
      }

      // 6. Migrate Guest Questionnaire Preferences if present
      try {
        const rawPrefs = localStorage.getItem("ielts_focus_questionnaire_preferences");
        if (rawPrefs) {
          const parsed = JSON.parse(rawPrefs);
          const numericTarget =
            parsed.targetBand === "8.0+"
              ? 8.0
              : parsed.targetBand === "not_sure"
              ? null
              : parseFloat(parsed.targetBand) || 6.5;

          await setDoc(
            doc(db, "users", uid),
            {
              targetBand: numericTarget,
              dailyStudyMinutes: parsed.dailyStudyMinutes || 30,
              examDate: parsed.examDate || null,
              timezone: parsed.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Tashkent",
              onboardingCompleted: true,
              questionnaire: parsed,
              studyPlanPreferences: parsed,
              updatedAt: Date.now(),
            },
            { merge: true }
          );
        }
      } catch (prefErr) {
        console.warn("Could not sync guest questionnaire to Firestore:", prefErr);
      }
    }

    // 7. All writes succeeded without network failure: safely clear guest caches
    clearGuestAttempts();
    clearGuestVocabulary();
    clearGuestMistakes();
    clearGuestWriting();

    return {
      success: true,
      migratedAttempts,
      migratedVocab,
      migratedMistakes,
      migratedWriting,
    };
  } catch (err) {
    console.warn("Guest data sync to Firestore encountered an error. Guest local data preserved for safety:", err);
    return {
      success: false,
      migratedAttempts,
      migratedVocab,
      migratedMistakes,
      migratedWriting,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Clears private cached data on sign-out to ensure Account B or an anonymous user
 * never inherits Account A's private drafts or history.
 */
export function clearSessionDataOnSignOut() {
  if (typeof window === "undefined") return;
  try {
    clearGuestAttempts();
    clearGuestVocabulary();
    clearGuestMistakes();
    clearGuestWriting();
    localStorage.removeItem("ielts_focus_onboarding_draft");
    localStorage.removeItem("ielts_focus_questionnaire_preferences");
    localStorage.removeItem("ielts_focus_onboarding_completed");
  } catch {}
}
