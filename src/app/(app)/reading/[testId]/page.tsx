import { Suspense } from "react";
import { ReadingWorkspace } from "@/components/reading/reading-workspace";

export default function ReadingTestPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-sm text-[var(--muted)]">Mashq yuklanmoqda…</p>}>
      <ReadingWorkspace />
    </Suspense>
  );
}

