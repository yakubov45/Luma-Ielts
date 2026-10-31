import { doc, collection, getDocs, setDoc, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export type QualityReportType = "question_incorrect" | "feedback_incorrect" | "audio_mismatch" | "typo" | "other";

export type QualityReportStatus = "pending" | "investigating" | "resolved" | "dismissed";

export interface QualityReport {
  id: string;
  reportType: QualityReportType;
  skill: "reading" | "listening" | "writing" | "speaking";
  contentVersion: string;
  itemReference: string; // e.g. question ID or test ID
  itemPrompt: string;
  expectedAnswer?: string;
  reporterUid?: string;
  reporterEmail?: string;
  reason: string;
  status: QualityReportStatus;
  adminNotes?: string;
  resolvedAt?: number;
  createdAt: number;
}

const LOCAL_STORAGE_REPORTS_KEY = "ielts_quality_reports_queue";

export async function submitQualityReport(
  report: Omit<QualityReport, "id" | "createdAt" | "status">
): Promise<QualityReport> {
  const id = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const fullReport: QualityReport = {
    ...report,
    id,
    status: "pending",
    createdAt: Date.now(),
  };

  // Local storage cache
  if (typeof window !== "undefined") {
    try {
      const existingStr = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
      const list: QualityReport[] = existingStr ? JSON.parse(existingStr) : [];
      list.unshift(fullReport);
      localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  // Firestore attempt
  try {
    await setDoc(doc(db, "qualityReports", id), fullReport);
  } catch (e) {
    console.warn("Firestore report submission error:", e);
  }

  return fullReport;
}

export async function fetchQualityReports(): Promise<QualityReport[]> {
  const results: QualityReport[] = [];

  // Try Firestore first
  try {
    const q = query(collection(db, "qualityReports"), orderBy("createdAt", "desc"), limit(50));
    const snap = await getDocs(q);
    snap.forEach((d) => {
      results.push(d.data() as QualityReport);
    });
  } catch {
    // fallback
  }

  if (results.length > 0) return results;

  // Local storage fallback
  if (typeof window !== "undefined") {
    try {
      const localStr = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
      if (localStr) return JSON.parse(localStr);
    } catch {
      // ignore
    }
  }

  // Default seed if empty so admin can inspect
  return [
    {
      id: "rep-demo-1",
      reportType: "question_incorrect",
      skill: "reading",
      contentVersion: "v1.2",
      itemReference: "q-1-urban-farming",
      itemPrompt: "Which heading best summarizes the core theme?",
      reporterEmail: "student@example.com",
      reason: "Heading 3 ham to'g'ri keladigandek tuyuldi, chunki unda xarajatlar tilga olingan.",
      status: "pending",
      createdAt: Date.now() - 3600_000 * 4,
    },
    {
      id: "rep-demo-2",
      reportType: "feedback_incorrect",
      skill: "writing",
      contentVersion: "v2.0",
      itemReference: "task1-internet-access",
      itemPrompt: "European Household Internet Access",
      reporterEmail: "dilshod@example.com",
      reason: "Lexical Resource bo'yicha berilgan maslahat Task 2 ga tegishli ko'rindi.",
      status: "investigating",
      adminNotes: "Tekshirilmoqda, Task 1 rubrikasi moslashtiriladi.",
      createdAt: Date.now() - 3600_000 * 24,
    },
  ];
}

export async function updateQualityReportStatus(
  reportId: string,
  status: QualityReportStatus,
  adminNotes?: string
): Promise<void> {
  const updates: Partial<QualityReport> = {
    status,
    ...(adminNotes !== undefined ? { adminNotes } : {}),
    ...(status === "resolved" ? { resolvedAt: Date.now() } : {}),
  };

  // Local storage update
  if (typeof window !== "undefined") {
    try {
      const localStr = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
      if (localStr) {
        const list: QualityReport[] = JSON.parse(localStr);
        const updated = list.map((r) => (r.id === reportId ? { ...r, ...updates } : r));
        localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(updated));
      }
    } catch {
      // ignore
    }
  }

  try {
    await setDoc(doc(db, "qualityReports", reportId), updates, { merge: true });
  } catch {
    // ignore
  }
}
