"use client";

import type { User } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export async function ensureUserProfile(user: User) {
  try {
    const ref = doc(db, "users", user.uid);
    const existing = await getDoc(ref);
    if (existing.exists()) return;
    await setDoc(ref, {
      displayName: user.displayName || "IELTS learner",
      email: user.email || "",
      targetBand: null,
      examDate: null,
      dailyStudyMinutes: 30,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Tashkent",
      locale: "uz",
      preferences: { theme: "system" },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn("ensureUserProfile: Firestore sync deferred or denied:", error);
  }
}
