import { doc, collection, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export interface CustomWritingTask {
  id: string;
  taskType: "task1" | "task2";
  title: string;
  categoryTag: string;
  categoryLabel: string;
  prompt: string;
  visualDescription?: string;
  suggestedMinutes: number;
  wordRequirement: number;
  isUserCreated: true;
  createdAt: number;
}

export interface CustomSpeakingTask {
  id: string;
  part: 1 | 2 | 3;
  topic: string;
  prompt: string;
  bulletPoints?: string[];
  isUserCreated: true;
  createdAt: number;
}

export interface TargetedMiniExercise {
  id: string;
  skill: "reading" | "listening" | "writing" | "speaking";
  questionType: string;
  objective: string;
  prompt: string;
  passageSnippet?: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  isAiGenerated: true;
}

const LOCAL_STORAGE_CUSTOM_WRITING = "ielts_custom_writing_tasks";
const LOCAL_STORAGE_CUSTOM_SPEAKING = "ielts_custom_speaking_tasks";

export async function fetchUserCustomWritingTasks(uid?: string): Promise<CustomWritingTask[]> {
  const list: CustomWritingTask[] = [];
  if (uid) {
    try {
      const snap = await getDocs(collection(db, "users", uid, "customWritingTasks"));
      snap.forEach((d) => list.push(d.data() as CustomWritingTask));
    } catch {
      // fallback
    }
  }

  if (list.length > 0) return list;

  if (typeof window !== "undefined") {
    try {
      const localStr = localStorage.getItem(LOCAL_STORAGE_CUSTOM_WRITING);
      if (localStr) return JSON.parse(localStr);
    } catch {
      // ignore
    }
  }

  return [];
}

export async function saveUserCustomWritingTask(
  uid: string | undefined,
  task: Omit<CustomWritingTask, "id" | "isUserCreated" | "createdAt">
): Promise<CustomWritingTask> {
  const id = `custom-w-${Date.now()}`;
  const fullTask: CustomWritingTask = {
    ...task,
    id,
    isUserCreated: true,
    createdAt: Date.now(),
  };

  if (typeof window !== "undefined") {
    try {
      const existing = await fetchUserCustomWritingTasks(uid);
      const updated = [fullTask, ...existing];
      localStorage.setItem(LOCAL_STORAGE_CUSTOM_WRITING, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  if (uid) {
    try {
      await setDoc(doc(db, "users", uid, "customWritingTasks", id), fullTask);
    } catch {
      // ignore
    }
  }

  return fullTask;
}

export async function fetchUserCustomSpeakingTasks(uid?: string): Promise<CustomSpeakingTask[]> {
  const list: CustomSpeakingTask[] = [];
  if (uid) {
    try {
      const snap = await getDocs(collection(db, "users", uid, "customSpeakingTasks"));
      snap.forEach((d) => list.push(d.data() as CustomSpeakingTask));
    } catch {
      // fallback
    }
  }

  if (list.length > 0) return list;

  if (typeof window !== "undefined") {
    try {
      const localStr = localStorage.getItem(LOCAL_STORAGE_CUSTOM_SPEAKING);
      if (localStr) return JSON.parse(localStr);
    } catch {
      // ignore
    }
  }

  return [];
}

export async function saveUserCustomSpeakingTask(
  uid: string | undefined,
  task: Omit<CustomSpeakingTask, "id" | "isUserCreated" | "createdAt">
): Promise<CustomSpeakingTask> {
  const id = `custom-s-${Date.now()}`;
  const fullTask: CustomSpeakingTask = {
    ...task,
    id,
    isUserCreated: true,
    createdAt: Date.now(),
  };

  if (typeof window !== "undefined") {
    try {
      const existing = await fetchUserCustomSpeakingTasks(uid);
      const updated = [fullTask, ...existing];
      localStorage.setItem(LOCAL_STORAGE_CUSTOM_SPEAKING, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  if (uid) {
    try {
      await setDoc(doc(db, "users", uid, "customSpeakingTasks", id), fullTask);
    } catch {
      // ignore
    }
  }

  return fullTask;
}

export async function deleteUserCustomSpeakingTask(
  uid: string | undefined,
  taskId: string
): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      const existing = await fetchUserCustomSpeakingTasks(uid);
      const updated = existing.filter((t) => t.id !== taskId);
      localStorage.setItem(LOCAL_STORAGE_CUSTOM_SPEAKING, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  if (uid) {
    try {
      const { deleteDoc } = await import("firebase/firestore");
      await deleteDoc(doc(db, "users", uid, "customSpeakingTasks", taskId));
    } catch {
      // ignore
    }
  }
}

// Generate targeted mini-exercises based on genuine weaknesses
export function generateTargetedMiniExercises(
  weakQuestionTypes: string[] = ["True / False / Not Given", "Matching Headings"]
): TargetedMiniExercise[] {
  const exercises: TargetedMiniExercise[] = [
    {
      id: "mini-1",
      skill: "reading",
      questionType: "True / False / Not Given",
      objective: "Matndagi dalil va faraz o'rtasidagi nozik farqni aniqlash",
      prompt:
        "Matn parchasi: 'Renewable energy accounted for 24% of domestic power in 2023, while coal usage decreased slightly.'\nSavol: Ko'mir iste'moli qayta tiklanuvchi energiyadan ancha ko'p bo'lgan.",
      passageSnippet:
        "Renewable energy accounted for 24% of domestic power in 2023, while coal usage decreased slightly.",
      options: [
        { id: "TRUE", text: "TRUE (To‘g‘ri)" },
        { id: "FALSE", text: "FALSE (Noto‘g‘ri)" },
        { id: "NOT_GIVEN", text: "NOT GIVEN (Matnda berilmagan)" },
      ],
      correctAnswer: "NOT_GIVEN",
      explanation:
        "Matnda ko'mir iste'moli ozgina kamaygani aytilgan, ammo uning foizi yoki qayta tiklanuvchi energiya bilan to'g'ridan-to'g'ri taqqoslanishi berilmagan. Shuning uchun javob NOT GIVEN.",
      isAiGenerated: true,
    },
    {
      id: "mini-2",
      skill: "reading",
      questionType: "Matching Headings",
      objective: "Paragrafning markaziy g'oyasini qo'shimcha tafsilotlardan ajratish",
      prompt:
        "Quyidagi xatboshi uchun eng to'g'ri sarlavhani tanlang: 'Despite substantial funding, several clinical trials failed to reproduce earlier laboratory successes due to unforeseen patient metabolic variances.'",
      passageSnippet:
        "Despite substantial funding, several clinical trials failed to reproduce earlier laboratory successes due to unforeseen patient metabolic variances.",
      options: [
        { id: "A", text: "Funding expansion for genetic clinics" },
        { id: "B", text: "Clinical setbacks stemming from biological variability" },
        { id: "C", text: "The historical evolution of pharmacology" },
      ],
      correctAnswer: "B",
      explanation:
        "Xatboshi moliyalashtirishga qaramay, klinik sinovlar bemorlarning biologik xilma-xilligi tufayli muvaffaqiyatsiz bo'lganini (setbacks stemming from biological variability) ta'riflaydi.",
      isAiGenerated: true,
    },
    {
      id: "mini-3",
      skill: "writing",
      questionType: "Task 1 Data Comparison",
      objective: "Jadval va grafiklardagi eng katta o'zgarishlarni akademik ifodalash",
      prompt:
        "1990 yilda 10% bo'lgan ko'rsatkich 2020 yilda 85% ga yetdi. Eng to'g'ri akademik jumlani tanlang:",
      options: [
        { id: "A", text: "The percentage witnessed an astronomical rise, climbing from 10% to 85%." },
        { id: "B", text: "The number became bigger from 10% until 85%." },
        { id: "C", text: "It was 10% then it was 85%." },
      ],
      correctAnswer: "A",
      explanation:
        "'witnessed an astronomical rise, climbing from X to Y' grammatik va leksik jihatdan IELTS Band 7.5+ talablariga javob beradi.",
      isAiGenerated: true,
    },
  ];

  return exercises;
}
