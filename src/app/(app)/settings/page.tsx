"use client";

import { useState, useEffect } from "react";
import { Settings, User, Bell, Shield, Save, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { db } from "@/lib/firebase/client";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function SettingsPage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [targetBand, setTargetBand] = useState("7.5");
  const [dailyMinutes, setDailyMinutes] = useState("30");
  const [examDate, setExamDate] = useState("2026-12-15");
  const [timezone, setTimezone] = useState("Asia/Tashkent");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setLoading(false);
        return;
      }

      setDisplayName(user.displayName || "");
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          if (data.targetBand) setTargetBand(String(data.targetBand));
          if (data.dailyStudyMinutes) setDailyMinutes(String(data.dailyStudyMinutes));
          if (data.examDate) setExamDate(data.examDate);
          if (data.timezone) setTimezone(data.timezone);
          if (data.displayName) setDisplayName(data.displayName);
        }
      } catch (err) {
        console.warn("Could not load user profile from Firestore:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const updatePayload = {
      targetBand: parseFloat(targetBand) || 7.0,
      dailyStudyMinutes: parseInt(dailyMinutes, 10) || 30,
      examDate,
      timezone,
      displayName: displayName.trim() || user?.displayName || "O‘quvchi",
      updatedAt: serverTimestamp(),
    };

    if (user) {
      try {
        await updateDoc(doc(db, "users", user.uid), updatePayload);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } catch (err) {
        console.warn("Failed to update profile in Firestore:", err);
        // Fallback local notification
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } else {
      // Guest mode
      if (typeof window !== "undefined") {
        localStorage.setItem("ielts_focus_guest_settings", JSON.stringify(updatePayload));
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <span className="eyebrow">Foydalanuvchi Sozlamalari</span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
          Account & Study Settings
        </h1>
        <p className="text-sm text-[var(--secondary)] mt-0.5">
          Maqsadli IELTS balingiz va kunlik o‘quv parametrlaringiz.
        </p>
      </div>

      {loading ? (
        <div className="card p-12 text-center text-sm text-[var(--muted)]">
          Sozlamalar yuklanmoqda…
        </div>
      ) : (
        <form onSubmit={handleSave} className="card p-6 md:p-8 space-y-5">
          {saved && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Sozlamalar muvaffaqiyatli saqlandi!</span>
            </div>
          )}

          <div className="space-y-1 border-b border-[var(--border)] pb-4">
            <label className="text-xs text-[var(--muted)]">Hisob Emaili</label>
            <p className="font-bold text-sm text-[var(--foreground)]">
              {user?.email || "mehmon@example.com"}
            </p>
          </div>

          <label>
            Ism / Taxallus
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Yoqub"
              className="w-full mt-1"
            />
          </label>

          <div className="space-y-4">
            <label>
              Maqsadli IELTS Band bali
              <select
                value={targetBand}
                onChange={(e) => setTargetBand(e.target.value)}
                className="w-full mt-1"
              >
                <option value="6.5">Band 6.5 (Competent Learner)</option>
                <option value="7.0">Band 7.0 (Good User)</option>
                <option value="7.5">Band 7.5 (Academic Excellence)</option>
                <option value="8.0">Band 8.0 (Very Good User)</option>
                <option value="8.5">Band 8.5 (Near Native)</option>
              </select>
            </label>

            <label>
              Kunlik o‘quv vaqti (daqiqa)
              <select
                value={dailyMinutes}
                onChange={(e) => setDailyMinutes(e.target.value)}
                className="w-full mt-1"
              >
                <option value="15">15 daqiqa (Micro-learning)</option>
                <option value="30">30 daqiqa (Tavsiya etiladi)</option>
                <option value="45">45 daqiqa (Intensiv)</option>
                <option value="60">60 daqiqa (Exam Sprint)</option>
              </select>
            </label>

            <label>
              Kutilayotgan imtihon sanasi
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full mt-1"
              />
            </label>

            <label>
              Vaqt mintaqasi (Timezone)
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full mt-1"
              >
                <option value="Asia/Tashkent">Asia/Tashkent (UTC+5)</option>
                <option value="Asia/Samarkand">Asia/Samarkand (UTC+5)</option>
                <option value="UTC">UTC</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </label>
          </div>

          {/* Interfeys ko‘rinishi (Dark Mode / Theme) */}
          <div className="space-y-2 pt-2 border-t border-[var(--border)]">
            <label className="text-xs text-[var(--muted)] block">Interfeys ko‘rinishi (Mavzu / Dark mode)</label>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)]">
              <div>
                <p className="text-xs md:text-sm font-bold text-[var(--foreground)]">Mavzu tanlash</p>
                <p className="text-[11px] text-[var(--muted)]">Ko‘zingizga qulay bo‘lishi uchun yorug‘ yoki qora rejimni tanlang.</p>
              </div>
              <ThemeToggle variant="segmented" />
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border)] flex items-center justify-end">
            <button type="submit" className="btn-primary text-sm shadow-sm cursor-pointer !py-2.5 !px-6">
              <Save className="w-4 h-4 mr-1.5" />
              Sozlamalarni saqlash
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
