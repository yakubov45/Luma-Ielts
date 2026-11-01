import { db } from "@/lib/firebase/client";
import { collection, doc, getDocs, setDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { PlatformWritingTask } from "@/lib/types/writing";

const STORAGE_KEY = "ielts_platform_writing_tasks";

export async function fetchPlatformWritingTasks(): Promise<PlatformWritingTask[]> {
  const remoteList: PlatformWritingTask[] = [];

  try {
    const q = query(collection(db, "writing_tasks"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    snap.forEach((d) => {
      remoteList.push(d.data() as PlatformWritingTask);
    });
  } catch (err) {
    // Firestore might be offline, unauthenticated, or permission-restricted
    console.warn("Could not fetch remote writing_tasks from Firestore, falling back to local cache:", err);
  }

  if (remoteList.length > 0) {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteList));
      } catch {
        // ignore
      }
    }
    return remoteList;
  }

  // Fallback to localStorage cache
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore
    }
  }

  return [];
}

export async function savePlatformWritingTask(
  taskData: Omit<PlatformWritingTask, "id" | "createdAt"> & { id?: string; createdAt?: number }
): Promise<PlatformWritingTask> {
  const id = taskData.id || `task1-${Date.now()}`;
  const createdAt = taskData.createdAt || Date.now();

  const fullTask: PlatformWritingTask = {
    ...taskData,
    id,
    createdAt,
    status: taskData.status || "published",
  };

  // 1. Save to local storage for immediate reactivity
  if (typeof window !== "undefined") {
    try {
      const existing = await fetchPlatformWritingTasks();
      const filtered = existing.filter((t) => t.id !== id);
      const updated = [fullTask, ...filtered];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("ielts-writing-tasks-updated"));
    } catch {
      // ignore
    }
  }

  // 2. Save to Firestore
  try {
    await setDoc(doc(db, "writing_tasks", id), fullTask, { merge: true });
  } catch (err) {
    console.warn("Error saving writing task to Firestore:", err);
  }

  return fullTask;
}

export async function deletePlatformWritingTask(id: string): Promise<void> {
  // 1. Remove from localStorage
  if (typeof window !== "undefined") {
    try {
      const existing = await fetchPlatformWritingTasks();
      const updated = existing.filter((t) => t.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("ielts-writing-tasks-updated"));
    } catch {
      // ignore
    }
  }

  // 2. Remove from Firestore
  try {
    await deleteDoc(doc(db, "writing_tasks", id));
  } catch (err) {
    console.warn("Error deleting writing task from Firestore:", err);
  }
}
