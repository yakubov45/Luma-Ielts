"use client";

import Link from "next/link";
import { useAuth } from "./auth-provider";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 border-3 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[var(--muted)]">Yuklanmoqda…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto my-12 p-8 card text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-[rgb(100,88,232,0.12)] flex items-center justify-center text-2xl text-[var(--accent)]">
          🔒
        </div>
        <p className="eyebrow">Shaxsiy maydon</p>
        <h2 className="text-2xl font-bold">Ushbu bo‘lim hisob talab qiladi</h2>
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          Statistikangiz, xatolar daftari va kunlik o‘quv rejangizni saqlash uchun
          hisobingizga kiring yoki yangi hisob oching. Saytdagi Reading mashqlarini esa
          ro‘yxatdan o‘tmasdan ham erkin bajarishingiz mumkin.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link href="/login" className="secondary-button !m-0">
            Kirish
          </Link>
          <Link href="/signup" className="button !m-0">
            Hisob yaratish
          </Link>
        </div>
        <div className="pt-3 border-t border-[var(--border)]">
          <Link href="/reading" className="text-xs font-semibold text-[var(--accent)] hover:underline">
            ← Reading mashqlarini ro‘yxatdan o‘tmasdan sinab ko‘rish
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

