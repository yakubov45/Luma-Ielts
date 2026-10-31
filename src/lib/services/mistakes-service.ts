import { db } from "@/lib/firebase/client";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

export type Mistake = {
  id: string;
  skill: "reading" | "listening";
  questionType: string;
  drillTitle: string;
  drillId: string;
  prompt: string;
  yourAnswer: string;
  correctAnswer: string;
  reason: string;
  status: "pending" | "reviewed";
  createdAt: number;
};

const LOCAL_STORAGE_KEY = "ielts_focus_user_mistakes";

export const DEFAULT_SAMPLE_MISTAKES: Mistake[] = [
  {
    id: "m1",
    skill: "reading",
    questionType: "True / False / Not Given",
    drillTitle: "Urban Gardens: A Short Academic Drill",
    drillId: "urban-gardens-drill",
    prompt: "Every urban garden is intended to replace commercial farms.",
    yourAnswer: "True",
    correctAnswer: "False",
    reason: "Matnda 'The primary purpose is not always to replace large-scale commercial farming' deyilgan. 'Every' so‘zi matndagi ma’noga zid.",
    status: "pending",
    createdAt: Date.now() - 3600000,
  },
  {
    id: "m2",
    skill: "reading",
    questionType: "Sentence Completion",
    drillTitle: "Urban Gardens: A Short Academic Drill",
    drillId: "urban-gardens-drill",
    prompt: "Volunteers can learn about soil and _____.",
    yourAnswer: "plants",
    correctAnswer: "water / water management",
    reason: "Matndagi ro‘yxat: 'seasons, soil and water affect plants'. Bo‘sh joyga 'water' mos keladi.",
    status: "reviewed",
    createdAt: Date.now() - 7200000,
  },
  {
    id: "m3",
    skill: "reading",
    questionType: "Single Choice",
    drillTitle: "Cognitive Advantages of Bilingualism",
    drillId: "cognitive-bilingualism",
    prompt: "What was the prevalent belief during most of the 20th century regarding bilingual children?",
    yourAnswer: "A. They possessed innate advantages",
    correctAnswer: "B. Bilingualism was likely to impede progress",
    reason: "20-asrda psixologlar bilingvizm miyani chalg‘itadi deb hisoblashgan ('cautioned that raising children in a bilingual environment would create mental confusion').",
    status: "pending",
    createdAt: Date.now() - 86400000,
  },
];

function getLocalMistakes(): Mistake[] {
  if (typeof window === "undefined") return DEFAULT_SAMPLE_MISTAKES;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SAMPLE_MISTAKES));
      return DEFAULT_SAMPLE_MISTAKES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SAMPLE_MISTAKES;
  }
}

function saveLocalMistakes(mistakes: Mistake[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mistakes));
  } catch {}
}

export async function fetchUserMistakes(uid: string | null | undefined): Promise<Mistake[]> {
  if (!uid) {
    return getLocalMistakes();
  }

  try {
    const colRef = collection(db, `users/${uid}/mistakes`);
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Seed default sample mistakes for new account
      const initial = getLocalMistakes();
      for (const item of initial) {
        await setDoc(doc(db, `users/${uid}/mistakes`, item.id), item);
      }
      return initial;
    }

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        skill: data.skill || "reading",
        questionType: data.questionType || "General",
        drillTitle: data.drillTitle || "Academic Drill",
        drillId: data.drillId || "urban-gardens-drill",
        prompt: data.prompt || "",
        yourAnswer: data.yourAnswer || "(Bo‘sh)",
        correctAnswer: data.correctAnswer || "",
        reason: data.reason || "",
        status: data.status === "reviewed" ? "reviewed" : "pending",
        createdAt: typeof data.createdAt === "number" ? data.createdAt : data.createdAt?.toMillis?.() || Date.now(),
      };
    });
  } catch (err) {
    console.warn("fetchUserMistakes error, fallback to local:", err);
    return getLocalMistakes();
  }
}

export async function toggleMistakeStatus(
  uid: string | null | undefined,
  mistakeId: string,
  currentStatus: "pending" | "reviewed"
): Promise<"pending" | "reviewed"> {
  const newStatus: "pending" | "reviewed" = currentStatus === "pending" ? "reviewed" : "pending";

  // Update local
  const current = getLocalMistakes();
  const updated: Mistake[] = current.map((m) => (m.id === mistakeId ? { ...m, status: newStatus } : m));
  saveLocalMistakes(updated);

  if (uid) {
    try {
      await updateDoc(doc(db, `users/${uid}/mistakes`, mistakeId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn("Failed to update mistake status in Firestore:", e);
    }
  }

  return newStatus;
}

export async function recordMistakesFromTest(
  uid: string | null | undefined,
  params: {
    drillId: string;
    drillTitle: string;
    skill: "reading" | "listening";
    failedQuestions: Array<{
      questionId: string;
      prompt: string;
      questionType: string;
      yourAnswer: string;
      correctAnswer: string;
      reason: string;
    }>;
  }
): Promise<void> {
  const now = Date.now();
  const newMistakes: Mistake[] = params.failedQuestions.map((q) => ({
    id: `m_${now}_${q.questionId}`,
    skill: params.skill,
    questionType: q.questionType,
    drillTitle: params.drillTitle,
    drillId: params.drillId,
    prompt: q.prompt,
    yourAnswer: q.yourAnswer,
    correctAnswer: q.correctAnswer,
    reason: q.reason,
    status: "pending",
    createdAt: now,
  }));

  if (newMistakes.length === 0) return;

  // Local update
  const current = getLocalMistakes();
  saveLocalMistakes([...newMistakes, ...current]);

  // Firestore update
  if (uid) {
    for (const m of newMistakes) {
      try {
        await setDoc(doc(db, `users/${uid}/mistakes`, m.id), m);
      } catch (e) {
        console.warn("Failed to save mistake to Firestore:", e);
      }
    }
  }
}
