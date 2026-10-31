import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { requireUser, handleAuthError, AuthError } from "@/lib/auth/server";
import { adminDb } from "@/lib/firebase/admin";
import { gradeQuestion } from "@/lib/reading/grading";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const user = await requireUser(request);
    const { attemptId } = await params;

    const ref = adminDb.doc(`users/${user.uid}/attempts/${attemptId}`);
    const existing = await ref.get();

    if (!existing.exists) {
      return NextResponse.json({ error: "Urinish topilmadi (Not found)" }, { status: 404 });
    }

    const data = existing.data()!;

    // Idempotent retry: return the existing result instead of duplicating or erroring
    if (data.status === "submitted") {
      const existingResult = await ref.collection("results").doc("final").get();
      if (existingResult.exists) {
        const resData = existingResult.data()!;
        return NextResponse.json({
          resultId: "final",
          duplicate: true,
          correctCount: resData.correctCount,
          total: resData.total,
          accuracy: resData.accuracy,
          questions: resData.questions,
        });
      }
      return NextResponse.json({ resultId: "final", duplicate: true });
    }

    const body = await request.json().catch(() => ({}));
    const answers = (body.answers || {}) as Record<string, unknown>;

    // Enforce exam-mode deadline
    if (data.mode === "exam" && data.deadlineAt) {
      const deadline =
        typeof data.deadlineAt.toDate === "function"
          ? data.deadlineAt.toDate()
          : new Date(data.deadlineAt);
      if (deadline < new Date()) {
        return NextResponse.json(
          { error: "Urinish muddati tugagan (Attempt expired)" },
          { status: 409 }
        );
      }
    }

    // Retrieve server-controlled answer key pinned to content and version
    const keyRef = adminDb.doc(
      `contentKeys/${data.contentId}_${data.versionId}/sections/${data.currentSection}`
    );
    const key = await keyRef.get();

    if (!key.exists) {
      return NextResponse.json(
        { error: "Ushbu test versiyasi uchun server javob kaliti topilmadi." },
        { status: 400 }
      );
    }

    const answerKey = key.data()!.answers as Record<
      string,
      {
        accepted: string[];
        type: string;
        wordLimit?: number;
        explanation: string;
        evidence: string;
      }
    >;

    const grades = Object.entries(answerKey).map(([questionId, item]) => ({
      questionId,
      ...gradeQuestion({ answer: answers?.[questionId], ...item }),
      explanation: item.explanation,
      evidence: item.evidence,
    }));

    const correctCount = grades.filter((g) => g.correct).length;
    const total = grades.length;
    const accuracy = total > 0 ? correctCount / total : 0;

    const resultDoc = ref.collection("results").doc("final");

    await adminDb.runTransaction(async (tx) => {
      tx.set(resultDoc, {
        correctCount,
        total,
        accuracy,
        questions: grades,
        gradedAt: FieldValue.serverTimestamp(),
      });
      tx.update(ref, {
        status: "submitted",
        submittedAt: FieldValue.serverTimestamp(),
      });
    });

    return NextResponse.json({
      resultId: "final",
      duplicate: false,
      correctCount,
      total,
      accuracy,
      questions: grades,
    });
  } catch (err: unknown) {
    if (err instanceof AuthError) {
      return handleAuthError(err);
    }
    const message = err instanceof Error ? err.message : "Urinishni topshirishda server xatosi yuz berdi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
