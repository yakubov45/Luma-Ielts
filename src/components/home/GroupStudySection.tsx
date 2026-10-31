import Link from "next/link";
import { Users, CheckCircle, ArrowRight, ClipboardCheck, MessageSquare, Shield } from "lucide-react";

export function GroupStudySection() {
  return (
    <section id="groups" className="px-4 sm:px-6 lg:px-8 py-14 sm:py-20 max-w-7xl mx-auto scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Group System Explanation */}
        <div className="lg:col-span-6 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--nav-active-bg)] border border-[var(--primary)]/20 text-xs font-bold text-[var(--nav-active-text)] shadow-xs">
            <Users className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>O‘qituvchi va O‘quvchilar Uchun</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[var(--foreground)] leading-tight">
            Kichik Guruhlar Bilan <span className="text-[var(--primary)]">Tizimli O‘qish</span>
          </h2>

          <p className="text-xs sm:text-sm text-[var(--secondary)] leading-relaxed">
            IELTS o‘qituvchilari 5 tadan 15 tagacha o‘quvchini bitta guruhga birlashtirishi, maxsus mock vazifalar berishi va har bir o‘quvchining yechimlarini real vaqtda tekshirishi mumkin.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[var(--foreground)] font-medium">
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)]">
              <Users className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">5–15 O‘quvchi</span>
                <span className="text-[11px] text-[var(--secondary)]">Optimal o‘quv muhiti</span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)]">
              <ClipboardCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Topshiriqlar Nazorati</span>
                <span className="text-[11px] text-[var(--secondary)]">Kim qachon topshirdi</span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)]">
              <MessageSquare className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Shaxsiy Fikr-Mulohaza</span>
                <span className="text-[11px] text-[var(--secondary)]">Ustozdan to‘g‘ridan-to‘g‘ri feedback</span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)]">
              <Shield className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Xavfsiz Kirish Kodingiz</span>
                <span className="text-[11px] text-[var(--secondary)]">Faqat taklifnoma orqali</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/groups"
              className="btn-primary inline-flex items-center gap-1.5 !py-3 !px-6 text-xs sm:text-sm font-bold shadow-sm"
            >
              <span>Guruhlar bo‘limiga o‘tish</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Column: Sample Interface Preview */}
        <div className="lg:col-span-6 w-full">
          <div className="card p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[var(--nav-active-bg)] text-[var(--primary)] flex items-center justify-center font-bold text-xs">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[var(--foreground)]">
                    Target 7.5+ Morning Group
                  </h4>
                  <span className="text-[11px] text-[var(--muted)]">12 ta o‘quvchi faol</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Faol Guruh
              </span>
            </div>

            {/* Fictional Sample Assignment Card */}
            <div className="p-3.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--foreground)]">
                  Topshiriq: Cambridge 18 · Test 2 Reading
                </span>
                <span className="text-[10px] font-semibold text-[var(--muted)]">Muddati: Bugun 20:00</span>
              </div>
              
              <div className="w-full bg-[var(--border)] rounded-full h-2 overflow-hidden">
                <div className="bg-[var(--primary)] h-2 rounded-full w-[75%]" />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[var(--secondary)]">
                <span>Topshirdi: 9 / 12 o‘quvchi</span>
                <span className="font-bold text-[var(--primary)]">75% tayyor</span>
              </div>
            </div>

            <p className="text-[10px] text-center text-[var(--muted)] italic">
              * Bu o‘qituvchi va o‘quvchi interfeysi uchun namunaviy ko‘rinish.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
