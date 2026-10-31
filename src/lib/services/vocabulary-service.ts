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
  Timestamp,
} from "firebase/firestore";

export type VocabWord = {
  id: string;
  word: string;
  partOfSpeech: string;
  definition: string;
  uzbekNote: string;
  example: string;
  source: string;
  intervalDays: number;
  repetition: number;
  easeFactor: number;
  dueAt: number; // timestamp ms
  createdAt: number;
  lastReviewedAt?: number;
};

const LOCAL_STORAGE_KEY = "ielts_focus_vocab_words";

export const DEFAULT_SAMPLE_WORDS: VocabWord[] = [
  {
    id: "w1",
    word: "Proximity",
    partOfSpeech: "noun",
    definition: "Nearness in space, time, or relationship.",
    uzbekNote: "Yaqinlik, yaqin masofada joylashganlik",
    example: "Gardens produce food in close proximity to urban dwellers.",
    source: "Urban gardens drill",
    intervalDays: 1,
    repetition: 1,
    easeFactor: 2.5,
    dueAt: Date.now() - 1000,
    createdAt: Date.now() - 86400000,
  },
  {
    id: "w2",
    word: "Inhibitory",
    partOfSpeech: "adjective",
    definition: "Having the effect of restraining or holding back an action.",
    uzbekNote: "To‘xtatuvchi, jilovlovchi",
    example: "The speaker engages inhibitory control to suppress the unintended language.",
    source: "Bilingualism drill",
    intervalDays: 1,
    repetition: 1,
    easeFactor: 2.5,
    dueAt: Date.now() - 1000,
    createdAt: Date.now() - 86400000,
  },
  {
    id: "w3",
    word: "Respite",
    partOfSpeech: "noun",
    definition: "A short period of rest or relief from something difficult.",
    uzbekNote: "Hordiq, qisqa tanaffus",
    example: "Community green spaces offer vital psychological respite.",
    source: "Urban gardens drill",
    intervalDays: 7,
    repetition: 3,
    easeFactor: 2.6,
    dueAt: Date.now() + 7 * 86400000,
    createdAt: Date.now() - 14 * 86400000,
  },
  {
    id: "w4",
    word: "Plasticity",
    partOfSpeech: "noun",
    definition: "The adaptability of an organism or tissue to change.",
    uzbekNote: "Moslashuvchanlik, o‘zgaruvchanlik",
    example: "Neuroplasticity enables the brain to build cognitive reserve.",
    source: "Bilingualism drill",
    intervalDays: 1,
    repetition: 1,
    easeFactor: 2.5,
    dueAt: Date.now() - 1000,
    createdAt: Date.now() - 86400000,
  },
];

function getLocalWords(): VocabWord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function clearGuestVocabulary() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {}
}

export function getGuestVocabularyWords(): VocabWord[] {
  return getLocalWords();
}

function saveLocalWords(words: VocabWord[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(words));
  } catch {}
}

export async function fetchUserVocabulary(uid: string | null | undefined): Promise<VocabWord[]> {
  if (!uid) {
    return getLocalWords();
  }

  try {
    const colRef = collection(db, `users/${uid}/vocabulary`);
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        word: data.word || "",
        partOfSpeech: data.partOfSpeech || "noun",
        definition: data.definition || "",
        uzbekNote: data.uzbekNote || "",
        example: data.example || "",
        source: data.source || "IELTS Reading",
        intervalDays: Number(data.intervalDays ?? 1),
        repetition: Number(data.repetition ?? 0),
        easeFactor: Number(data.easeFactor ?? 2.5),
        dueAt: typeof data.dueAt === "number" ? data.dueAt : data.dueAt?.toMillis?.() || Date.now(),
        createdAt: typeof data.createdAt === "number" ? data.createdAt : data.createdAt?.toMillis?.() || Date.now(),
        lastReviewedAt: data.lastReviewedAt ? (typeof data.lastReviewedAt === "number" ? data.lastReviewedAt : data.lastReviewedAt.toMillis?.()) : undefined,
      };
    });
  } catch (err) {
    console.warn("fetchUserVocabulary Firestore error:", err);
    return [];
  }
}

export async function loadSampleVocabulary(uid: string | null | undefined): Promise<VocabWord[]> {
  if (!uid) {
    saveLocalWords(DEFAULT_SAMPLE_WORDS);
    return DEFAULT_SAMPLE_WORDS;
  }
  for (const item of DEFAULT_SAMPLE_WORDS) {
    await setDoc(doc(db, `users/${uid}/vocabulary`, item.id), item);
  }
  return DEFAULT_SAMPLE_WORDS;
}

export async function addWordToVocabulary(
  uid: string | null | undefined,
  wordData: {
    word: string;
    partOfSpeech?: string;
    definition: string;
    uzbekNote?: string;
    example?: string;
    source?: string;
  }
): Promise<VocabWord> {
  const cleanWord = wordData.word.trim();
  const id = `w_${Date.now()}_${cleanWord.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
  const now = Date.now();

  const newWord: VocabWord = {
    id,
    word: cleanWord,
    partOfSpeech: wordData.partOfSpeech || "noun",
    definition: wordData.definition.trim(),
    uzbekNote: wordData.uzbekNote?.trim() || "",
    example: wordData.example?.trim() || "",
    source: wordData.source || "Reading matni",
    intervalDays: 1,
    repetition: 0,
    easeFactor: 2.5,
    dueAt: now, // immediately due for initial review
    createdAt: now,
  };

  if (!uid) {
    // Guest word: store in guest localStorage
    const currentLocal = getLocalWords();
    const updatedLocal = [newWord, ...currentLocal.filter((w) => w.word.toLowerCase() !== cleanWord.toLowerCase())];
    saveLocalWords(updatedLocal);
  } else {
    // Authenticated user: store in private Firestore collection
    try {
      await setDoc(doc(db, `users/${uid}/vocabulary`, id), newWord);
    } catch (e) {
      console.warn("Failed to persist word to Firestore:", e);
    }
  }

  return newWord;
}

export type ReviewGrade = "again" | "hard" | "good" | "easy";

export async function reviewWordSM2(
  uid: string | null | undefined,
  wordId: string,
  grade: ReviewGrade
): Promise<{ nextInterval: number; nextDueAt: number }> {
  const now = Date.now();
  const currentWords = uid ? await fetchUserVocabulary(uid) : getLocalWords();
  const target = currentWords.find((w) => w.id === wordId);

  let repetition = target?.repetition || 0;
  let easeFactor = target?.easeFactor || 2.5;
  let intervalDays = target?.intervalDays || 1;

  // SM-2 Spaced Repetition Algorithm (design.md & plan.md section 9)
  if (grade === "again") {
    repetition = 0;
    intervalDays = 1;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  } else if (grade === "hard") {
    repetition += 1;
    intervalDays = Math.max(1, Math.round(intervalDays * 1.2));
    easeFactor = Math.max(1.3, easeFactor - 0.15);
  } else if (grade === "good") {
    if (repetition === 0) intervalDays = 1;
    else if (repetition === 1) intervalDays = 3;
    else intervalDays = Math.round(intervalDays * easeFactor);
    repetition += 1;
  } else if (grade === "easy") {
    if (repetition === 0) intervalDays = 3;
    else if (repetition === 1) intervalDays = 6;
    else intervalDays = Math.round(intervalDays * easeFactor * 1.3);
    repetition += 1;
    easeFactor = Math.min(3.0, easeFactor + 0.15);
  }

  const nextDueAt = now + intervalDays * 24 * 60 * 60 * 1000;

  if (!uid) {
    const updatedLocal = currentWords.map((w) =>
      w.id === wordId
        ? { ...w, repetition, easeFactor, intervalDays, dueAt: nextDueAt, lastReviewedAt: now }
        : w
    );
    saveLocalWords(updatedLocal);
  } else {
    try {
      await updateDoc(doc(db, `users/${uid}/vocabulary`, wordId), {
        repetition,
        easeFactor,
        intervalDays,
        dueAt: nextDueAt,
        lastReviewedAt: now,
      });

      // Append immutable review event per plan.md section 6
      const eventDoc = doc(collection(db, `users/${uid}/reviewEvents`));
      await setDoc(eventDoc, {
        wordId,
        grade,
        intervalDays,
        reviewedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn("Failed to update word review in Firestore:", e);
    }
  }

  return { nextInterval: intervalDays, nextDueAt };
}
