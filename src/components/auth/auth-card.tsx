"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { FormEvent, useEffect, useState } from "react";
import { auth } from "@/lib/firebase/client";
import { ensureUserProfile } from "@/lib/auth/profile";
import { syncGuestDataToAccount } from "@/lib/services/sync-service";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface AuthCardProps {
  initialMode?: "login" | "signup";
}

export function AuthCard({ initialMode = "login" }: AuthCardProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [busy, setBusy] = useState(false);

  // Sync mode with browser history without triggering harsh page reloads or scroll jumps
  const switchMode = (newMode: "login" | "signup") => {
    if (newMode === mode) return;
    setMode(newMode);
    setMessage("");
    setIsSuccessMessage(false);
    window.history.replaceState(null, "", newMode === "login" ? "/login" : "/signup");
  };

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        if (path === "/signup") setMode("signup");
        else if (path === "/login") setMode("login");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setIsSuccessMessage(false);

    if (mode === "signup" && !name.trim()) {
      setBusy(false);
      setMessage("Iltimos, to‘liq ismingizni kiriting.");
      return;
    }

    if (password.length < 6) {
      setBusy(false);
      setMessage("Parol kamida 6 ta belgidan iborat bo‘lishi kerak.");
      return;
    }

    try {
      if (mode === "login") {
        // --- LOGIN FLOW ---
        const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
        try {
          const profileStatus = await ensureUserProfile(credential.user);
          await syncGuestDataToAccount(credential.user.uid);
          if (profileStatus.isNew || !profileStatus.onboardingCompleted) {
            router.push("/onboarding");
            return;
          }
        } catch (err) {
          console.warn("Profile check deferred on login:", err);
        }
        router.push("/dashboard");
      } else {
        // --- SIGNUP FLOW ---
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        try {
          await updateProfile(credential.user, { displayName: name.trim() });
        } catch (err) {
          console.warn("Display name update deferred:", err);
        }

        try {
          await ensureUserProfile(credential.user);
          await syncGuestDataToAccount(credential.user.uid);
        } catch (err) {
          console.warn("Guest data sync deferred on signup:", err);
        }

        router.push("/onboarding");
      }
    } catch (error) {
      const code = error instanceof FirebaseError ? error.code : "unknown";
      console.error("Auth failure", { mode, code, error });

      const knownErrors: Record<string, string> = {
        "auth/wrong-password": "Parol noto‘g‘ri kiritildi.",
        "auth/user-not-found": "Bunday email bilan hisob topilmadi.",
        "auth/invalid-credential": "Email yoki parol noto‘g‘ri kiritildi.",
        "auth/email-already-in-use": "Bu email bilan ro‘yxatdan o‘tilgan. Kirishni bosing.",
        "auth/invalid-email": "Email formati noto‘g‘ri.",
        "auth/weak-password": "Parol kamida 6 ta belgidan iborat bo‘lishi lozim.",
        "auth/too-many-requests": "Urinishlar ko‘payib ketdi. Birozdan so‘ng qayta urinib ko‘ring.",
      };

      setIsSuccessMessage(false);
      setMessage(
        knownErrors[code] ??
          (mode === "login"
            ? `Kirishda xatolik yuz berdi (${code}).`
            : `Ro‘yxatdan o‘tishda xatolik yuz berdi (${code}).`)
      );
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
      setMessage("Parolni tiklash havolasi emailingizga yuborildi. Pochtangizni tekshiring.");
    } catch (err) {
      setIsSuccessMessage(false);
      setMessage("Tiklash havolasini yuborib bo‘lmadi. Email to‘g‘ri kiritilganini tekshiring.");
    }
  }

  async function googleAuth() {
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
      console.error("Google auth error", error);
      setIsSuccessMessage(false);
      setMessage("Google orqali ulanib bo‘lmadi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative p-5 sm:p-7 space-y-4 rounded-3xl shadow-[0_8px_32px_0_rgba(194,65,12,0.07),0_20px_50px_rgba(0,0,0,0.06),inset_0_1px_1px_0_rgba(255,255,255,0.85)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.12)] border border-white/70 dark:border-white/15 bg-white/40 dark:bg-[#121214]/50 backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300">
      {/* Top Glass Shimmer Border Line */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none rounded-t-3xl" />

      {/* Brand Header Inside Card */}
      <div className="text-center space-y-1.5">
        <div className="w-10 h-10 rounded-2xl p-1 bg-white/70 dark:bg-white/10 backdrop-blur-md border border-white/80 dark:border-white/15 shadow-xs mx-auto flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Lumo IELTS"
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--primary)] block">
          IELTS Academic & General
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight transition-all duration-200">
          {mode === "login" ? "O‘qishni davom ettiring" : "Yangi hisob ochish"}
        </h1>
        <p className="text-xs text-zinc-600 dark:text-zinc-300 transition-all duration-200">
          {mode === "login"
            ? "Shaxsiy o‘quv rejangiz va natijalaringizni ko‘rish uchun kiring."
            : "Platforma imkoniyatlaridan to‘liq foydalanish uchun ro‘yxatdan o‘ting."}
        </p>
      </div>

      {/* =========================================================================
          SMOOTH GLASS SEGMENTED SWITCHER (KIRISH <-> RO'YXATDAN O'TISH)
          ========================================================================= */}
      <div className="p-1 rounded-2xl bg-black/[0.04] dark:bg-white/[0.04] border border-white/50 dark:border-white/10 backdrop-blur-md flex relative z-10">
        <button
          id="auth-tab-login"
          type="button"
          onClick={() => switchMode("login")}
          className={`flex-1 py-1.5 sm:py-2 text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
            mode === "login"
              ? "text-[var(--primary)] bg-white/95 dark:bg-zinc-800/90 shadow-sm border border-white/80 dark:border-white/10"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          <span>Kirish</span>
        </button>
        <button
          id="auth-tab-signup"
          type="button"
          onClick={() => switchMode("signup")}
          className={`flex-1 py-1.5 sm:py-2 text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
            mode === "signup"
              ? "text-[var(--primary)] bg-white/95 dark:bg-zinc-800/90 shadow-sm border border-white/80 dark:border-white/10"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          <span>Ro‘yxatdan o‘tish</span>
        </button>
      </div>

      {/* Google Sign-in Glass Button */}
      <div>
        <button
          type="button"
          disabled={busy}
          onClick={googleAuth}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-100 bg-white/60 dark:bg-white/[0.06] hover:bg-white/85 dark:hover:bg-white/10 border border-white/80 dark:border-white/15 shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-none backdrop-blur-md transition-all cursor-pointer active:scale-[0.99] disabled:opacity-60"
        >
          {/* Official 4-color Google G icon */}
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

      {/* Glass Or Divider */}
      <div className="relative flex items-center justify-center py-1">
        <div className="w-full border-t border-white/60 dark:border-white/10" />
        <span className="absolute px-3 py-0.5 rounded-full text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider bg-white/70 dark:bg-zinc-900/80 backdrop-blur-md border border-white/50 dark:border-white/10">
          yoki email orqali
        </span>
      </div>

      {/* Main Email / Password Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Full Name Field (Smooth Accordion for Signup Mode) */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            mode === "signup"
              ? "max-h-20 opacity-100 scale-100"
              : "max-h-0 opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">
              Ismingiz
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                tabIndex={mode === "signup" ? 0 : -1}
                required={mode === "signup"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masalan, Anvar"
                className="w-full !pl-10 text-sm py-2.5 rounded-xl border border-white/80 dark:border-white/15 bg-white/55 dark:bg-white/[0.05] text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] focus:outline-none focus:border-[var(--primary)] focus:bg-white/85 dark:focus:bg-white/10 focus:ring-4 focus:ring-[var(--primary)]/15 transition-all"
                autoComplete="name"
              />
            </div>
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">
            Email manzil
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ism@misol.uz"
              className="w-full !pl-10 text-sm py-2.5 rounded-xl border border-white/80 dark:border-white/15 bg-white/55 dark:bg-white/[0.05] text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] focus:outline-none focus:border-[var(--primary)] focus:bg-white/85 dark:focus:bg-white/10 focus:ring-4 focus:ring-[var(--primary)]/15 transition-all"
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">
              Parol
            </label>
            {mode === "login" && (
              <button
                type="button"
                onClick={resetPassword}
                className="text-[11px] font-semibold text-[var(--primary)] hover:underline cursor-pointer"
              >
                Parolni unutdingizmi?
              </button>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              required
              minLength={6}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kamida 6 ta belgi"
              className="w-full !pl-10 !pr-10 text-sm py-2.5 rounded-xl border border-white/80 dark:border-white/15 bg-white/55 dark:bg-white/[0.05] text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] focus:outline-none focus:border-[var(--primary)] focus:bg-white/85 dark:focus:bg-white/10 focus:ring-4 focus:ring-[var(--primary)]/15 transition-all"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              title={showPassword ? "Parolni yashirish" : "Parolni ko‘rsatish"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Message Alert Banner */}
        {message && (
          <div
            className={`p-3 rounded-xl border text-xs font-medium flex items-start gap-2 transition-all ${
              isSuccessMessage
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-800 dark:text-emerald-300 backdrop-blur-md"
                : "bg-red-500/15 border-red-500/30 text-red-700 dark:text-red-400 backdrop-blur-md"
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

        {/* Submit Glass Button */}
        <button
          disabled={busy}
          type="submit"
          className="w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg shadow-orange-500/25 bg-gradient-to-r from-[var(--primary)] via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
        >
          {busy ? (
            <span>Iltimos, kuting…</span>
          ) : (
            <>
              <span>{mode === "login" ? "Kirish" : "Ro‘yxatdan o‘tish"}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Navigation */}
      <div className="pt-2 border-t border-white/50 dark:border-white/10 text-center space-y-2">
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          {mode === "login" ? "Hisobingiz yo‘qmi?" : "Allaqachon hisobingiz bormi?"}{" "}
          <button
            id="auth-switch-link"
            type="button"
            onClick={() => switchMode(mode === "login" ? "signup" : "login")}
            className="font-bold text-[var(--primary)] hover:underline ml-1 cursor-pointer bg-transparent border-none p-0 inline"
          >
            {mode === "login" ? "Ro‘yxatdan o‘tish" : "Kirish"}
          </button>
        </p>

        <div>
          <Link
            href="/"
            className="text-[11px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:underline transition-colors"
          >
            ← Bosh sahifaga qaytish (ro‘yxatdan o‘tmasdan ko‘rish)
          </Link>
        </div>
      </div>
    </div>
  );
}
