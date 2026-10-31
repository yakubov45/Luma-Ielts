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
