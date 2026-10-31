"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification, signInWithPopup, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { FormEvent, useState } from "react";
import { auth, db } from "@/lib/firebase/client";
import { ensureUserProfile } from "@/lib/auth/profile";
import { syncGuestDataToAccount } from "@/lib/services/sync-service";

function friendlyError(error: unknown, stage: string) {
  const code = error instanceof FirebaseError ? error.code : "unknown";
  const known: Record<string, string> = {
    "auth/operation-not-allowed": "Firebase Console’da Authentication → Sign-in method ichidan Email/Password providerini yoqing.",
    "auth/email-already-in-use": "Bu email uchun hisob allaqachon yaratilgan. Kirish sahifasidan foydalaning.",
    "auth/weak-password": "Parol kamida 6 belgidan iborat bo‘lishi kerak.",
    "auth/invalid-api-key": "Firebase API key noto‘g‘ri yoki dev server .env.local o‘zgarishidan keyin qayta ishga tushmagan.",
    "permission-denied": "Hisob yaratildi, ammo Firestore profilini saqlash rad etildi. Firestore Database yaratilgani va firestore.rules deploy qilinganini tekshiring.",
    "unavailable": stage === "Firestore profile save"
      ? "Auth ishladi, lekin Firestore profilini saqlab bo‘lmadi. Firebase Console → Firestore Database orqali database yarating, keyin firestore.rules ni deploy qiling."
      : "Firebase bilan bog‘lanib bo‘lmadi. Internet va loyiha konfiguratsiyasini tekshiring.",
  };
  return known[code] ?? `Xatolik (${stage}): ${code}. Browser Console’dagi xabarni yuboring.`;
}

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    let stage = "account creation";
    try {
      // 1. Create user in Firebase Auth
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);

      // 2. Set display name
      if (name.trim()) {
        try {
          await updateProfile(credential.user, { displayName: name.trim() });
        } catch (e) {
          console.warn("Could not set displayName on auth user:", e);
        }
      }

      // 3. Save profile to Firestore (non-blocking if rules not yet deployed)
      try {
        await setDoc(doc(db, "users", credential.user.uid), {
          displayName: name.trim(),
          email: email.trim(),
          targetBand: null,
          examDate: null,
          dailyStudyMinutes: 30,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Tashkent",
          locale: "uz",
          preferences: { theme: "system" },
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn("Firestore profile save deferred:", err);
      }

      // 4. Send verification email (non-blocking)
      try {
        await sendEmailVerification(credential.user);
      } catch (err) {
        console.warn("Verification email deferred:", err);
      }

      // 5. Migrate any pre-signup guest progress
      try {
        await syncGuestDataToAccount(credential.user.uid);
      } catch (err) {
        console.warn("Guest data sync deferred on signup:", err);
      }

      setSuccess(true);
      router.push("/onboarding");
    } catch (error) {
      console.error("Signup failure", { stage, error });
      setMessage(friendlyError(error, stage));
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true);
    setMessage("");
    try {
      const credential = await signInWithPopup(auth, new GoogleAuthProvider());
      const profileStatus = await ensureUserProfile(credential.user);
      await syncGuestDataToAccount(credential.user.uid);
      if (profileStatus.isNew || !profileStatus.onboardingCompleted) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setMessage(friendlyError(error, "Google sign-in"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="card space-y-4">
      <label>
        Ism
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Yoqub" />
      </label>
      <label>
        Email
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="misol@gmail.com" />
      </label>
      <label>
        Parol (kamida 6 belgi)
        <input required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
      </label>
      {message && <p role="alert" className="text-sm font-semibold text-rose-500">{message}</p>}
      {success && <p className="text-sm font-semibold text-emerald-600">Hisobingiz yaratildi! Yo‘naltirilmoqda…</p>}
      <button disabled={busy} className="button w-full">
        {busy ? "Yaratilmoqda…" : "Hisob yaratish"}
      </button>
      <button type="button" className="google-button" disabled={busy} onClick={google}>
        Google bilan davom etish
      </button>
      <p className="text-center text-sm">
        Hisobingiz bormi? <Link href="/login" className="link">Kiring</Link>
      </p>
      <div className="pt-2 border-t border-[var(--border)] text-center">
        <Link href="/" className="text-xs text-[var(--muted)] hover:underline">
          ← Bosh sahifaga qaytish (ro‘yxatdan o‘tmasdan ko‘rish)
        </Link>
      </div>
    </form>
  );
}
