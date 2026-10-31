"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { db } from "@/lib/firebase/client";

type Result = {
  correctCount: number;
  total: number;
  questions: {
    questionId: string;
    correct: boolean;
    explanation: string;
    evidence: string;
  }[];
};

function ResultsContent() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const { user } = useAuth();
  const [result, setResult] = useState<Result>();

  useEffect(() => {
    if (user && attemptId) {
      getDoc(doc(db, `users/${user.uid}/attempts/${attemptId}/results/final`))
        .then((s) => setResult(s.data() as Result))
        .catch(() => {});
    }
  }, [user, attemptId]);

  if (!result) return <p className="p-8 text-center text-sm text-[var(--muted)]">Natija yuklanmoqda…</p>;

  return (
    <>
      <p className="eyebrow">Natija</p>
      <h1>{result.correctCount} / {result.total}</h1>
      <p>Bu qisqa drill aniqligi; IELTS band bahosi emas.</p>
      {result.questions.map((q, i) => (
        <article className="card my-3" key={q.questionId}>
          <h2>{i + 1}-savol: {q.correct ? "To‘g‘ri" : "Qayta ko‘ring"}</h2>
          <p>{q.explanation}</p>
          <p><em>Dalil: {q.evidence}</em></p>
        </article>
      ))}
      <div className="pt-4">
        <Link className="button" href="/reading">
          Boshqa mashq
        </Link>
      </div>
    </>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-sm text-[var(--muted)]">Natija yuklanmoqda…</p>}>
      <ResultsContent />
    </Suspense>
  );
}

