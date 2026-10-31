"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import {
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { FormEvent, useState } from "react";
import { auth } from "@/lib/firebase/client";
import { ensureUserProfile } from "@/lib/auth/profile";
import { syncGuestDataToAccount } from "@/lib/services/sync-service";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setIsSuccessMessage(false);

    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);

      // Non-blocking profile check and guest data synchronization
      try {
        const profileStatus = await ensureUserProfile(credential.user);
        await syncGuestDataToAccount(credential.user.uid);
        if (profileStatus.isNew || !profileStatus.onboardingCompleted) {
          router.push("/onboarding");
          return;
        }
      } catch (err) {
        console.warn("Profile / guest sync deferred on login:", err);
      }

      router.push("/dashboard");
    } catch (error) {
      const code = error instanceof FirebaseError ? error.code : "unknown";
      console.error("Login failure", { code, error });
      const known: Record<string, string> = {
        "auth/wrong-password": "Parol noto‘g‘ri kiritildi.",
        "auth/user-not-found": "Bunday email bilan hisob topilmadi.",
        "auth/invalid-credential": "Email yoki parol noto‘g‘ri kiritildi.",
        "auth/invalid-email": "Email formati noto‘g‘ri.",
        "auth/too-many-requests": "Urinishlar ko‘payib ketdi. Birozdan so‘ng qayta urinib ko‘ring.",
      };
      setIsSuccessMessage(false);
      setMessage(known[code] ?? `Kirishda xatolik yuz berdi (${code}).`);
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword() {
    if (!email.trim()) {
      setIsSuccessMessage(false);
      setMessage("Parolni tiklash uchun avval email manzilingizni kiriting.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setIsSuccessMessage(true);
      setMessage("Parolni tiklash havolasi emailingizga yuborildi. Qutini tekshiring.");
    } catch (err) {
      setIsSuccessMessage(false);
      setMessage("Tiklash havolasini yuborib bo‘lmadi. Emailni to‘g‘ri kiritganingizni tekshiring.");
    }
  }

  async function googleSignIn() {
    setBusy(true);
    setMessage("");
    setIsSuccessMessage(false);
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
      console.error("Google sign-in error", error);
      setIsSuccessMessage(false);
      setMessage("Google orqali kirib bo‘lmadi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-6 sm:p-8 space-y-6 shadow-xl border border-[var(--border)] bg-[var(--surface)] backdrop-blur-md">
      {/* Brand Header Inside Card */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-block group mb-1">
          <img
            src="/logo.png"
            alt="Lumo IELTS"
            className="w-12 h-12 rounded-2xl mx-auto object-contain shadow-sm group-hover:scale-105 transition-transform"
          />
        </Link>
        <span className="eyebrow block">IELTS Academic & General</span>
        <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
          O‘qishni davom ettiring
        </h1>
        <p className="text-xs text-[var(--secondary)]">
          Shaxsiy o‘quv rejangiz va natijalaringizni ko‘rish uchun kiring.
        </p>
      </div>

      {/* Google Sign-in Button */}
      <div>
        <button
          type="button"
          disabled={busy}
          onClick={googleSignIn}
          className="google-button w-full shadow-xs cursor-pointer hover:border-[var(--primary)] transition-all"
        >
          {/* Official 4-color Google G SVG icon */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Google bilan davom etish</span>
        </button>
      </div>

      {/* Or Divider */}
      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-[var(--border)]" />
        <span className="absolute bg-[var(--surface)] px-3 text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider">
          yoki email orqali
        </span>
      </div>

      {/* Main Email/Password Form */}
      <form onSubmit={submit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--foreground)]">
            Email manzil
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--muted)]">
              <Mail className="w-4 h-4" />
            </div>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ism@misol.uz"
              className="w-full !pl-10 text-sm"
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[var(--foreground)]">
              Parol
            </label>
            <button
              type="button"
              onClick={resetPassword}
              className="text-[11px] font-semibold text-[var(--primary)] hover:underline cursor-pointer"
            >
              Parolni unutdingizmi?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--muted)]">
              <Lock className="w-4 h-4" />
            </div>
            <input
              required
              minLength={6}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full !pl-10 !pr-10 text-sm"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
              title={showPassword ? "Parolni yashirish" : "Parolni ko‘rsatish"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Message Alert Banner */}
        {message && (
          <div
            className={`p-3 rounded-xl border text-xs font-medium flex items-start gap-2 animate-fade-in ${
              isSuccessMessage
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
            }`}
          >
            {isSuccessMessage ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
            )}
            <p className="leading-snug">{message}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          disabled={busy}
          type="submit"
          className="btn-primary w-full !py-3 font-bold text-sm shadow-sm cursor-pointer justify-center"
        >
          {busy ? (
            <span>Kirilmoqda…</span>
          ) : (
            <>
              <span>Kirish</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </form>

      {/* Footer Navigation */}
      <div className="pt-2 border-t border-[var(--border)] text-center space-y-2.5">
        <p className="text-xs text-[var(--secondary)]">
          Hisobingiz yo‘qmi?{" "}
          <Link
            href="/signup"
            className="font-bold text-[var(--primary)] hover:underline ml-1"
          >
            Ro‘yxatdan o‘tish
          </Link>
        </p>

        <div>
          <Link
            href="/"
            className="text-[11px] text-[var(--muted)] hover:text-[var(--foreground)] hover:underline transition-colors"
          >
            ← Bosh sahifaga qaytish (ro‘yxatdan o‘tmasdan ko‘rish)
          </Link>
        </div>
      </div>
    </div>
  );
}
