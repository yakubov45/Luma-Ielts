import { db } from "@/lib/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { fetchUserVocabulary } from "./vocabulary-service";
import { fetchUserMistakes } from "./mistakes-service";

export type DailyTask = {
  id: string;
  title: string;
  duration: number; // minutes
  category: "reading" | "vocabulary" | "mistakes" | "listening" | "writing" | "speaking";
  completed: boolean;
  link: string;
  description: string;
};

export type DayStudyPlan = {
  dateKey: string; // YYYY-MM-DD
  tasks: DailyTask[];
  completedMinutes: number;
  totalMinutes: number;
};

const LOCAL_STORAGE_KEY_PREFIX = "ielts_focus_study_day_";

export function getTodayKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function fetchTodayStudyPlan(uid: string | null | undefined): Promise<DayStudyPlan> {
  const dateKey = getTodayKey();

  // Check Firestore first if logged in
  if (uid) {
    try {
      const snap = await getDoc(doc(db, `users/${uid}/studyDays`, dateKey));
      if (snap.exists()) {
        const data = snap.data();
        return {
          dateKey,
          tasks: data.tasks || [],
          completedMinutes: Number(data.completedMinutes || 0),
          totalMinutes: Number(data.totalMinutes || 30),
        };
      }
    } catch (e) {
      console.warn("fetchTodayStudyPlan error, using dynamic generator:", e);
    }
  }

  // Check local storage
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${dateKey}`);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {}
  }

  // Generate dynamic plan based on real due vocabulary and real pending mistakes!
  const vocabWords = await fetchUserVocabulary(uid);
  const now = Date.now();
  const dueVocab = vocabWords.filter((w) => w.dueAt <= now);

  const mistakes = await fetchUserMistakes(uid);
  const pendingMistakes = mistakes.filter((m) => m.status === "pending");

  const generatedTasks: DailyTask[] = [
    {
      id: "task_reading_drill",
      title: "Reading Drill: Urban Gardens (Academic Text)",
      duration: 8,
      category: "reading",
      completed: false,
      link: "/reading/urban-gardens-drill",
      description: "True/False/Not Given va qisqa matn tahlili mashqi.",
    },
    {
      id: "task_vocab_review",
      title: `${Math.max(dueVocab.length, 3)} ta Spaced Repetition so‘zlarini takrorlash`,
      duration: 10,
      category: "vocabulary",
      completed: false,
      link: "/vocabulary",
      description: "Intervallik takrorlash navbatidagi faol lug‘at.",
    },
    {
      id: "task_mistake_review",
      title: `Xatolar daftaridagi ${Math.max(pendingMistakes.length, 2)} ta savolni qayta ko‘rish`,
      duration: 12,
      category: "mistakes",
      completed: false,
      link: "/mistakes",
      description: "Oldingi mashqlarda yo‘l qo‘yilgan xatolarni tahlil qilish.",
    },
  ];

  const totalMinutes = generatedTasks.reduce((acc, t) => acc + t.duration, 0);

  const newPlan: DayStudyPlan = {
    dateKey,
    tasks: generatedTasks,
    completedMinutes: 0,
    totalMinutes,
  };

  // Cache locally
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${dateKey}`, JSON.stringify(newPlan));
    } catch {}
  }

  return newPlan;
}

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

  // Update local storage
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
      await setDoc(doc(db, `users/${uid}/studyDays`, currentPlan.dateKey), {
        dateKey: currentPlan.dateKey,
        tasks: updatedTasks,
        completedMinutes,
        totalMinutes: currentPlan.totalMinutes,
        updatedAt: Date.now(),
      });
    } catch (e) {
      console.warn("Failed to persist study day plan in Firestore:", e);
    }
  }

  return updatedPlan;
}
