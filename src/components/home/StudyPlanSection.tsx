import Link from "next/link";
import { Calendar, Clock, ArrowRight, CheckCircle2, Sparkles, BookOpen, RotateCcw, AlertTriangle } from "lucide-react";

export function StudyPlanSection() {
  return (
    <section id="study-plan" className="px-4 sm:px-6 lg:px-8 py-14 sm:py-20 max-w-7xl mx-auto scroll-mt-20">
      <div className="card p-6 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Questionnaire Explanation */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--nav-active-bg)] border border-[var(--primary)]/20 text-xs font-bold text-[var(--nav-active-text)] shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>8 Bosqichli Rejalashtirish So‘rovnomasi</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[var(--foreground)] leading-tight">
            Kunlik Vaqtingizga Mos <span className="text-[var(--primary)]">Shaxsiy Reja</span>
          </h2>

          <p className="text-xs sm:text-sm text-[var(--secondary)] leading-relaxed">
            Har kimning imkoniyati har xil: kimdadir kuniga 15 daqiqa, kimdadir 1 soat bor. Bizning 8 bosqichli so‘rovnomamiz sizning maqsadli ballingiz, imtihon sanangiz va haftalik bo‘sh vaqtingizni tahlil qilib, erishish mumkin bo‘lgan real o‘quv jadvalini tuzib beradi.
          </p>

          <div className="space-y-2 text-xs text-[var(--foreground)] font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Haftalik dars va dam olish kunlarini o‘zingiz belgilaysiz</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Vaqt yetmasligida mashg‘ulotlar qismlarga bo‘linadi</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Zaif bo‘limlarga ko‘proq e’tibor qaratiladi</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3.5">
            <Link
              href="/onboarding"
              className="btn-primary w-full sm:w-auto !py-3 !px-7 text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 text-center justify-center"
            >
              <span>Shaxsiy reja tuzish (2 daqiqa)</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>

            <span className="text-[11px] text-[var(--muted)]">
              * So‘rovnoma ingliz tili darajasini emas, kunlik vaqtingizni rejalashtiradi.
            </span>
          </div>
        </div>

        {/* Right Column: Illustrative Example Plan Preview */}
        <div className="lg:col-span-5 w-full">
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider block">
                  Misol uchun tuzilgan reja
                </span>
                <span className="text-sm font-black text-[var(--foreground)]">
                  Bugungi Kunlik Vazifalar (30 daqiqa)
                </span>
              </div>
              <span className="text-xs font-bold text-[var(--primary)] bg-[var(--nav-active-bg)] px-2.5 py-1 rounded-lg border border-[var(--primary)]/20">
                3 ta vazifa
              </span>
            </div>

            {/* Task 1 */}
            <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-[var(--primary)] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[var(--foreground)] truncate">
                    Lug‘at takrorlash (Spaced Repetition)
                  </h4>
                  <span className="text-[10px] font-semibold text-[var(--muted)]">5 daqiqa</span>
                </div>
                <p className="text-[11px] text-[var(--secondary)]">
                  Oldingi mashqlardan saqlangan 8 ta so‘zni esga solish
                </p>
              </div>
            </div>

            {/* Task 2 */}
            <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[var(--foreground)] truncate">
                    Academic Reading Mini-Mock
                  </h4>
                  <span className="text-[10px] font-semibold text-[var(--muted)]">15 daqiqa</span>
                </div>
                <p className="text-[11px] text-[var(--secondary)]">
                  Passage 1 matni va 13 ta savolni vaqt bilan ishlash
                </p>
              </div>
            </div>

            {/* Task 3 */}
            <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[var(--foreground)] truncate">
                    Xatolar daftari tahlili
                  </h4>
                  <span className="text-[10px] font-semibold text-[var(--muted)]">10 daqiqa</span>
                </div>
                <p className="text-[11px] text-[var(--secondary)]">
                  True/False savollaridagi noto‘g‘ri variantlar tahlili
                </p>
              </div>
            </div>

            <p className="text-[10px] text-center text-[var(--muted)] italic">
              * Haqiqiy rejangiz so‘rovnomadagi javoblaringiz asosida avtomatik hisoblanadi.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
