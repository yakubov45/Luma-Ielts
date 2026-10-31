import { db } from "@/lib/firebase/client";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import {
  ALL_SPEAKING_TOPICS,
  SpeakingTopicItem,
  UsefulChunk,
} from "@/lib/speaking/sample-data";
import { addWordToVocabulary } from "./vocabulary-service";

const SPEAKING_TOPICS_COLLECTION = "speakingTopics";

/**
 * Fetch speaking topics from Firestore, falling back to local preloaded sample data.
 */
export async function fetchSpeakingTopics(): Promise<SpeakingTopicItem[]> {
  try {
    const colRef = collection(db, SPEAKING_TOPICS_COLLECTION);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items: SpeakingTopicItem[] = [];
      snap.forEach((d) => {
        items.push(d.data() as SpeakingTopicItem);
      });
      // Sort: Part 1, Part 2, Part 3, Full mock
      return items.sort((a, b) => {
        const order = { 1: 1, 2: 2, 3: 3, full_mock: 4 };
        const orderA = order[a.part] || 99;
        const orderB = order[b.part] || 99;
        if (orderA !== orderB) return orderA - orderB;
        return a.title.localeCompare(b.title);
      });
    }
  } catch (err) {
    console.warn("fetchSpeakingTopics from Firestore failed, using static catalog:", err);
  }
  return ALL_SPEAKING_TOPICS;
}

/**
 * Sync all speaking topics (including all 12 Part 1 topics & useful chunks) into Firestore.
 */
export async function syncSpeakingTopicsToFirestore(): Promise<{
  success: boolean;
  syncedCount: number;
  message: string;
}> {
  try {
    let synced = 0;
    for (const topic of ALL_SPEAKING_TOPICS) {
      const docRef = doc(db, SPEAKING_TOPICS_COLLECTION, topic.id);
      await setDoc(
        docRef,
        {
          ...topic,
          syncedAt: Timestamp.now(),
          status: "published",
        },
        { merge: true }
      );
      synced++;
    }
    return {
      success: true,
      syncedCount: synced,
      message: `${synced} ta Speaking mavzulari va foydali iboralar ma'lumotlar bazasiga muvaffaqiyatli yuklandi!`,
    };
  } catch (err: unknown) {
    console.error("syncSpeakingTopicsToFirestore error:", err);
    return {
      success: false,
      syncedCount: 0,
      message: (err as Error)?.message || "DB ga yuklashda xatolik yuz berdi.",
    };
  }
}

/**
 * Save a useful chunk directly to the student's personal SRS Vocabulary notebook.
 */
export async function saveChunkToUserVocabulary(
  chunk: UsefulChunk,
  topicTitle: string,
  uid?: string | null
): Promise<{ success: boolean; message: string }> {
  try {
    await addWordToVocabulary(uid, {
      word: chunk.phrase,
      partOfSpeech: "phrase / chunk",
      definition: chunk.meaning,
      uzbekNote: chunk.meaning,
      example: `Used in IELTS Speaking Part 1 topic: ${topicTitle}`,
      source: `Speaking: ${topicTitle}`,
    });
    return {
      success: true,
      message: `"${chunk.phrase}" shaxsiy lug'atingizga muvaffaqiyatli qo'shildi!`,
    };
  } catch (err: unknown) {
    console.error("saveChunkToUserVocabulary error:", err);
    return {
      success: false,
      message: "Lug'atga saqlashda xatolik yuz berdi.",
    };
  }
}

// ==========================================
// RECORDING LIFECYCLE & PERSISTENCE (Section 7)
// ==========================================

export type SpeakingRecordingStatus =
  | "saved_on_device"
  | "uploading"
  | "saved_to_account"
  | "upload_failed"
  | "deleting";

export interface SpeakingAttempt {
  id: string;
  part: number | string;
  topic: string;
  prompt?: string;
  durationSeconds: number;
  audioUrl?: string;
  storagePath?: string;
  mimeType: string;
  createdAt: number;
  status: SpeakingRecordingStatus;
  isUserCreated?: boolean;
}

const DB_NAME = "ielts_focus_offline";
const DB_VERSION = 1;
const STORE_NAME = "speaking_recordings";

function openRecordingsDB(): Promise<IDBDatabase | null> {
  if (typeof window === "undefined" || !window.indexedDB) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function saveLocalRecordingBlob(
  id: string,
  blob: Blob,
  mimeType: string
): Promise<void> {
  const db = await openRecordingsDB();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.put({ id, blob, mimeType, createdAt: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function getLocalRecordingBlob(id: string): Promise<Blob | null> {
  const db = await openRecordingsDB();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result ? req.result.blob : null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function deleteLocalRecordingBlob(id: string): Promise<void> {
  const db = await openRecordingsDB();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

/**
 * Upload an audio recording to Firebase Storage under:
 * private-users/{uid}/recordings/{recordingId}/audio.{ext}
 * and write metadata to Firestore.
 */
export async function uploadSpeakingRecording(
  uid: string,
  attempt: SpeakingAttempt,
  blob: Blob
): Promise<{ success: boolean; storagePath?: string; downloadUrl?: string; error?: string }> {
  try {
    const { storage } = await import("@/lib/firebase/client");
    const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");

    const extension = attempt.mimeType.includes("mp4") ? "m4a" : "webm";
    const storagePath = `private-users/${uid}/recordings/${attempt.id}/audio.${extension}`;
    const storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, blob, {
      contentType: attempt.mimeType || "audio/webm",
      customMetadata: {
        ownerUid: uid,
        attemptId: attempt.id,
        topic: attempt.topic,
        duration: String(attempt.durationSeconds),
      },
    });

    const downloadUrl = await getDownloadURL(storageRef);

    // Save metadata to Firestore
    const metaRef = doc(db, `users/${uid}/recordings`, attempt.id);
    await setDoc(metaRef, {
      id: attempt.id,
      part: attempt.part,
      topic: attempt.topic,
      durationSeconds: attempt.durationSeconds,
      storagePath,
      downloadUrl,
      mimeType: attempt.mimeType,
      createdAt: attempt.createdAt,
      status: "saved_to_account",
      isUserCreated: attempt.isUserCreated ?? false,
    });

    return { success: true, storagePath, downloadUrl };
  } catch (err: unknown) {
    console.error("uploadSpeakingRecording error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Audio faylni hisobga yuklab bo‘lmadi.",
    };
  }
}

/**
 * Delete a recording from both Cloud Storage and Firestore (or local IndexedDB).
 */
export async function deleteSpeakingRecording(
  id: string,
  storagePath?: string,
  uid?: string
): Promise<{ success: boolean; error?: string }> {
  // Always clean up local IndexedDB copy
  await deleteLocalRecordingBlob(id);

  if (uid && storagePath) {
    try {
      const { storage } = await import("@/lib/firebase/client");
      const { ref, deleteObject } = await import("firebase/storage");
      const { deleteDoc } = await import("firebase/firestore");

      // Delete storage file
      try {
        const fileRef = ref(storage, storagePath);
        await deleteObject(fileRef);
      } catch (storageErr) {
        console.warn("Storage deletion warning:", storageErr);
      }

      // Delete Firestore document
      const metaRef = doc(db, `users/${uid}/recordings`, id);
      await deleteDoc(metaRef);
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Hisobdan o‘chirishda xatolik yuz berdi.",
      };
    }
  }

  return { success: true };
}
