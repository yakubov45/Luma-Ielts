import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";

export function HomeFooter() {
  return (
    <div className="w-full mt-auto">
      {/* Final Call to Action Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 max-w-5xl mx-auto w-full text-center">
        <div className="card p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border-2 border-[var(--border)] shadow-sm space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--nav-active-bg)] border border-[var(--primary)]/20 text-xs font-bold text-[var(--nav-active-text)] shadow-xs mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>IELTS Tayyorgarligini Bugun Boshlang</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[var(--foreground)] tracking-tight">
            IELTS’ga har kuni <span className="text-[var(--primary)]">aniq bir qadam</span> tashlang.
          </h2>

          <p className="text-xs sm:text-sm text-[var(--secondary)] max-w-lg mx-auto leading-relaxed">
            Reading mashqlarini ro‘yxatdan o‘tmasdan bajaring yoki shaxsiy o‘quv rejangizni tuzib, tizimli shug‘ullaning.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/reading"
              className="btn-primary w-full sm:w-auto !py-3.5 !px-8 text-sm font-bold shadow-md shadow-orange-500/20 text-center justify-center"
            >
              <span>Birinchi mashg‘ulotni boshlash</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>

            <Link
              href="/onboarding"
              className="secondary-button w-full sm:w-auto !py-3.5 !px-7 text-sm font-bold text-center justify-center !m-0"
            >
              Shaxsiy reja tuzish
            </Link>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)]/60 py-12 px-4 sm:px-6 lg:px-8 text-xs text-[var(--secondary)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <img
                src="/logo.png"
                alt="Lumo IELTS"
                className="w-8 h-8 rounded-xl object-contain shadow-xs shrink-0 group-hover:scale-105 transition-transform"
              />
              <span className="font-extrabold text-base tracking-tight text-[var(--foreground)]">
                lumo<span className="text-[var(--primary)]">ielts</span>
                <span className="text-xs text-[var(--muted)] font-bold">.uz</span>
              </span>
            </Link>
            <p className="text-xs text-[var(--secondary)] leading-relaxed max-w-sm">
              Lumo IELTS — xatolarni chuqur tahlil qilish, intervalli so‘z yodlash va rasmiy Cambridge formatidagi akademik mashqlar platformasi.
            </p>
            <p className="text-[11px] text-[var(--muted)]">
              Tinch, diqqatni jamlovchi va xavfsiz akademik o‘quv maydoni.
            </p>
          </div>

          {/* Quick Links: Modullar */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--foreground)]">
              IELTS Modullari
            </h4>
            <ul className="space-y-1.5 text-xs text-[var(--secondary)]">
              <li>
                <Link href="/reading" className="hover:text-[var(--primary)] transition-colors">
                  Reading Moduli
                </Link>
              </li>
              <li>
                <Link href="/listening" className="hover:text-[var(--primary)] transition-colors">
                  Listening Moduli
                </Link>
              </li>
              <li>
                <Link href="/writing" className="hover:text-[var(--primary)] transition-colors">
                  Writing Moduli
                </Link>
              </li>
              <li>
                <Link href="/speaking" className="hover:text-[var(--primary)] transition-colors">
                  Speaking Moduli
                </Link>
              </li>
              <li>
                <Link href="/vocabulary" className="hover:text-[var(--primary)] transition-colors">
                  Intervalli Lug‘at (SM-2)
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links: Platforma */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--foreground)]">
              Platforma & Yordam
            </h4>
            <ul className="space-y-1.5 text-xs text-[var(--secondary)]">
              <li>
                <Link href="/onboarding" className="hover:text-[var(--primary)] transition-colors">
                  Shaxsiy O‘quv Rejasi (8 savol)
                </Link>
              </li>
              <li>
                <Link href="/groups" className="hover:text-[var(--primary)] transition-colors">
                  O‘qituvchi va Guruhlar
                </Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-[var(--primary)] transition-colors">
                  Ko‘p Beriladigan Savollar (FAQ)
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-[var(--primary)] transition-colors">
                  Tizimga Kirish
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-[var(--primary)] transition-colors">
                  Yangi Hisob Ochish
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[var(--muted)]">
          <p>© 2026 lumoielts.uz • Barcha huquqlar himoyalangan.</p>
          <p>IELTS Cambridge Academic & General mashqlari.</p>
        </div>
      </footer>
    </div>
  );
}
