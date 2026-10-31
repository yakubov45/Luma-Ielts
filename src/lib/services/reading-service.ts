import { db } from "@/lib/firebase/client";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import {
  ALL_READING_TESTS,
  FULL_MOCK_TESTS,
  PASSAGE_1_TESTS,
  PASSAGE_2_TESTS,
  PASSAGE_3_TESTS,
} from "@/lib/reading/passages-data";
import { SampleReadingTest } from "@/lib/reading/sample-data";

const READING_PASSAGES_COLLECTION = "readingPassages";

/**
 * Fetch all reading tests from Firestore, falling back to local preloaded sample data.
 */
export async function fetchReadingPassages(): Promise<SampleReadingTest[]> {
  try {
    const colRef = collection(db, READING_PASSAGES_COLLECTION);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items: SampleReadingTest[] = [];
      snap.forEach((d) => {
        items.push(d.data() as SampleReadingTest);
      });
      return items;
    }
  } catch (err) {
    console.warn("fetchReadingPassages from Firestore failed, using static preloaded tests:", err);
  }
  return ALL_READING_TESTS;
}

function cleanForFirestore(obj: any): any {
  if (obj === undefined) return null;
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(cleanForFirestore);
  const res: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) {
      res[k] = cleanForFirestore(v);
    }
  }
  return res;
}

/**
 * Sync all 30 passages and 10 full mock tests into Firestore.
 * Pushes to:
 * 1) readingPassages/{test.id}
 * 2) content/{test.id} (metadata)
 * 3) content/{test.id}/versions/v1/sections/section-1
 */
export async function syncReadingPassagesToFirestore(): Promise<{
  success: boolean;
  syncedCount: number;
  message: string;
}> {
  try {
    let synced = 0;

    for (const test of ALL_READING_TESTS) {
      const cleanTest = cleanForFirestore(test);
      // 1. Direct collection document
      const passageDocRef = doc(db, READING_PASSAGES_COLLECTION, test.id);
      await setDoc(
        passageDocRef,
        {
          id: test.id,
          title: test.title,
          skill: "reading",
          examTrack: "academic",
          tags: test.tags,
          estimatedDuration: test.estimatedDuration,
          passageNumber: test.passageNumber || null,
          topic: test.topic || "",
          status: "published",
          section: cleanTest.section,
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );

      // 2. Content collection metadata
      const contentDocRef = doc(db, "content", test.id);
      await setDoc(
        contentDocRef,
        {
          id: test.id,
          title: test.title,
          skill: "reading",
          examTrack: "academic",
          tags: test.tags,
          status: "published",
          publishedVersion: "v1",
          estimatedDuration: test.estimatedDuration,
          passageNumber: test.passageNumber || null,
          topic: test.topic || "",
          creator: "IELTS Focus",
          license: "CC BY 4.0",
          attribution: "Official IELTS Simulator Reading Passage",
          aiGenerated: false,
          reviewedBy: "seed",
          reviewedAt: new Date().toISOString(),
          schemaVersion: 1,
        },
        { merge: true }
      );

      // 3. Section document
      const sectionDocRef = doc(db, `content/${test.id}/versions/v1/sections/section-1`);
      await setDoc(
        sectionDocRef,
        {
          title: test.section.title,
          paragraphs: test.section.paragraphs,
          questions: cleanTest.section.questions,
        },
        { merge: true }
      );

      synced++;
    }

    return {
      success: true,
      syncedCount: synced,
      message: `${synced} ta Reading testi muvaffaqiyatli Firestore bazasiga yuklandi!`,
    };
  } catch (err: any) {
    console.error("syncReadingPassagesToFirestore failed:", err);
    return {
      success: false,
      syncedCount: 0,
      message: err.message || "Sinxronlashda xatolik yuz berdi.",
    };
  }
}
