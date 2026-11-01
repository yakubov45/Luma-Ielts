import { db } from "@/lib/firebase/client";
import { collection, doc, getDocs, setDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { PlatformWritingTask } from "@/lib/types/writing";

const STORAGE_KEY = "ielts_platform_writing_tasks";

export async function fetchPlatformWritingTasks(): Promise<PlatformWritingTask[]> {
  // 1. Try our Next.js API route first (fast, reliable, zero permission issues)
  try {
    const res = await fetch("/api/writing-tasks");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.tasks) && data.tasks.length > 0) {
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.tasks));
          } catch {
            // ignore
          }
        }
        return data.tasks;
      }
    }
  } catch {
    // fallback
  }

  // 2. Try Firestore if online & allowed (silent catch without console errors)
  try {
    const q = query(collection(db, "writing_tasks"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const remoteList: PlatformWritingTask[] = [];
    snap.forEach((d) => {
      remoteList.push(d.data() as PlatformWritingTask);
    });
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
  } catch {
    // Silently fall back to local cache if Firestore rules aren't deployed yet
  }

  // 3. Fallback to localStorage cache
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

  // 2. Save via Next.js persistent API
  try {
    await fetch("/api/writing-tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullTask),
    });
  } catch {
    // ignore
  }

  // 3. Save to Firestore (silent catch if rules don't permit client write)
  try {
    await setDoc(doc(db, "writing_tasks", id), fullTask, { merge: true });
  } catch {
    // silent
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

  // 2. Remove via API
  try {
    await fetch(`/api/writing-tasks?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  } catch {
    // ignore
  }

  // 3. Remove from Firestore
  try {
    await deleteDoc(doc(db, "writing_tasks", id));
  } catch {
    // silent
  }
}
