import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, setDoc, Timestamp } from "firebase/firestore";
import fs from "fs";
import path from "path";
import {
  PASSAGE_1_SPECS,
  PASSAGE_2_SPECS,
  PASSAGE_3_SPECS,
  parseSpec,
} from "./generate-passages-data.mjs";

// Load .env.local if not already in process.env
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBln3Ff7hG2jkp2gYnq6J2K6WQQx81EM38",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ielts-prep-77429.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "ielts-prep-77429",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ielts-prep-77429.firebasestorage.app",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

async function seed() {
  console.log("=================================================");
  console.log("Parsing all 30 IELTS Reading passages...");
  const p1Tests = PASSAGE_1_SPECS.map(s => parseSpec(s, 1));
  const p2Tests = PASSAGE_2_SPECS.map(s => parseSpec(s, 2));
  const p3Tests = PASSAGE_3_SPECS.map(s => parseSpec(s, 3));

  console.log(`Parsed: P1=${p1Tests.length}, P2=${p2Tests.length}, P3=${p3Tests.length}`);

  // Combine into 10 Full Mock Tests (40 questions each)
  const mockTests = [];
  for (let i = 0; i < 10; i++) {
    const p1 = p1Tests[i];
    const p2 = p2Tests[i];
    const p3 = p3Tests[i];

    const mockNum = i + 1;
    const mockId = `rd-mock-${mockNum}`;
    const mockTitle = `IELTS Academic Reading Mock Test ${mockNum}`;
    const mockTopic = `${p1.title} · ${p2.title} · ${p3.title}`;

    const combinedParagraphs = [
      { id: `mock-${mockNum}-p1-header`, text: `=== READING PASSAGE 1: ${p1.title.toUpperCase()} ===` },
      ...p1.section.paragraphs.map((p, idx) => ({ id: `m${mockNum}-p1-${idx + 1}`, text: p.text })),
      { id: `mock-${mockNum}-p2-header`, text: `=== READING PASSAGE 2: ${p2.title.toUpperCase()} ===` },
      ...p2.section.paragraphs.map((p, idx) => ({ id: `m${mockNum}-p2-${idx + 1}`, text: p.text })),
      { id: `mock-${mockNum}-p3-header`, text: `=== READING PASSAGE 3: ${p3.title.toUpperCase()} ===` },
      ...p3.section.paragraphs.map((p, idx) => ({ id: `m${mockNum}-p3-${idx + 1}`, text: p.text })),
    ];

    const combinedQuestions = [
      ...p1.section.questions.map((q, qIdx) => ({ ...q, id: `q${qIdx + 1}` })),
      ...p2.section.questions.map((q, qIdx) => ({ ...q, id: `q${13 + qIdx + 1}` })),
      ...p3.section.questions.map((q, qIdx) => ({ ...q, id: `q${26 + qIdx + 1}` })),
    ];

    mockTests.push({
      id: mockId,
      title: mockTitle,
      topic: mockTopic,
      tags: ["full_mock", "academic", "timed_60min"],
      skill: "reading",
      examTrack: "academic",
      estimatedDuration: 60,
      section: {
        title: mockTitle,
        paragraphs: combinedParagraphs,
        questions: combinedQuestions,
      },
    });
  }

function cleanForFirestore(obj) {
  if (obj === undefined) return null;
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(cleanForFirestore);
  const res = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) {
      res[k] = cleanForFirestore(v);
    }
  }
  return res;
}

  const allTests = [...mockTests, ...p1Tests, ...p2Tests, ...p3Tests];
  console.log(`Total tests to push: ${allTests.length} (10 Full Mocks + 30 Passages, 400 questions total)`);
  console.log(`Target Firebase project: ${firebaseConfig.projectId}`);
  console.log("=================================================");

  let count = 0;
  for (const test of allTests) {
    try {
      const cleanTest = cleanForFirestore(test);
      // 1. readingPassages/{testId}
      const passageRef = doc(db, "readingPassages", test.id);
      await setDoc(
        passageRef,
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
          passages: cleanTest.passages || null,
          section: cleanTest.section,
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );

      // 2. content/{testId}
      const contentRef = doc(db, "content", test.id);
      await setDoc(
        contentRef,
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

      // 3. content/{testId}/versions/v1/sections/section-1
      const sectionRef = doc(db, `content/${test.id}/versions/v1/sections/section-1`);
      await setDoc(
        sectionRef,
        {
          title: test.section.title,
          paragraphs: test.section.paragraphs,
          questions: cleanTest.section.questions,
        },
        { merge: true }
      );

      count++;
      console.log(`[${count}/${allTests.length}] Pushed: ${test.id} (${test.title})`);
    } catch (err) {
      console.error(`Failed to push ${test.id}:`, err.message);
    }
  }

  console.log("=================================================");
  console.log(`Successfully seeded ${count}/${allTests.length} tests to Firestore!`);
  console.log("=================================================");
}

seed().catch(err => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});
