"use client";

import type { User } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export async function ensureUserProfile(user: User): Promise<{ isNew: boolean; onboardingCompleted: boolean }> {
  try {
    const ref = doc(db, "users", user.uid);
    const existing = await getDoc(ref);
    if (existing.exists()) {
      const data = existing.data();
      return {
        isNew: false,
        onboardingCompleted: Boolean(data?.onboardingCompleted),
      };
    }

    await setDoc(
      ref,
      {
        displayName: user.displayName || user.email?.split("@")[0] || "IELTS learner",
        email: user.email || "",
        targetBand: null,
        examDate: null,
        dailyStudyMinutes: 30,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Tashkent",
        locale: "uz",
        preferences: { theme: "system" },
        onboardingCompleted: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return { isNew: true, onboardingCompleted: false };
  } catch (error) {
    console.warn("ensureUserProfile: Firestore sync deferred or denied:", error);
    return { isNew: false, onboardingCompleted: false };
  }
}
