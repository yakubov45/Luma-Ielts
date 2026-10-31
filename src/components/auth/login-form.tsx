"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { FormEvent, useState } from "react";
import { auth } from "@/lib/firebase/client";
import { ensureUserProfile } from "@/lib/auth/profile";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      // Non-blocking profile check
      try {
        await ensureUserProfile(credential.user);
      } catch (err) {
        console.warn("Profile sync deferred on login:", err);
      }
      router.push("/dashboard");
    } catch (error) {
      const code = error instanceof FirebaseError ? error.code : "unknown";
      console.error("Login failure", { code, error });
      const known: Record<string, string> = {
        "auth/wrong-password": "Parol noto‘g‘ri kiritildi.",
        "auth/user-not-found": "Bunday email bilan hisob topilmadi.",
        "auth/invalid-credential": "Email yoki parol noto‘g‘ri.",
        "auth/invalid-email": "Email formati noto‘g‘ri.",
        "auth/too-many-requests": "Urinishlar ko‘payib ketdi. Birozdan so‘ng qayta urinib ko‘ring.",
      };
      setMessage(known[code] ?? `Kirishda xatolik yuz berdi (${code}).`);
    } finally {
      setBusy(false);
    }
  }

  async function reset() {
    if (!email) return setMessage("Avval email manzilingizni kiriting.");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Parolni tiklash havolasi yuborildi.");
    } catch {
      setMessage("Tiklash havolasini yuborib bo‘lmadi.");
    }
  }

  async function google() {
    setBusy(true);
    setMessage("");
    try {
      const credential = await signInWithPopup(auth, new GoogleAuthProvider());
      await ensureUserProfile(credential.user);
      router.push("/dashboard");
    } catch (error) {
      console.error("Google sign-in error", error);
      setMessage("Google orqali kirib bo‘lmadi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="card space-y-4">
      <label>
        Email
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="misol@gmail.com" />
      </label>
      <label>
        Parol
        <input required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
      </label>
      {message && <p role="status" className="text-sm font-semibold text-rose-500">{message}</p>}
      <button disabled={busy} className="button w-full">
        {busy ? "Kirilmoqda…" : "Kirish"}
      </button>
      <button type="button" className="google-button" disabled={busy} onClick={google}>
        Google bilan davom etish
      </button>
      <div className="flex justify-between items-center text-sm pt-1">
        <button type="button" className="link text-xs" onClick={reset}>
          Parolni unutdingizmi?
        </button>
        <p>
          Hisob yo‘qmi? <Link href="/signup" className="link">Ro‘yxatdan o‘tish</Link>
        </p>
      </div>
      <div className="pt-2 border-t border-[var(--border)] text-center">
        <Link href="/" className="text-xs text-[var(--muted)] hover:underline">
          ← Bosh sahifaga qaytish (ro‘yxatdan o‘tmasdan ko‘rish)
        </Link>
      </div>
    </form>
  );
}
