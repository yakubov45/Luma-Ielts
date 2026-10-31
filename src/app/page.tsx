import Link from "next/link";
import { BookOpen, Headphones, PenTool, Mic, ArrowRight, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { SAMPLE_READING_TESTS } from "@/lib/reading/sample-data";

export default function Home() {
  const featuredDrill = SAMPLE_READING_TESTS[0];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      {/* Top Header */}
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)] px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 font-black text-lg tracking-tight text-[var(--foreground)]">
            <img
              src="/logo.png"
              alt="Lumo IELTS"
              className="w-8 h-8 rounded-xl object-contain shadow-xs shrink-0"
            />
            <span className="font-extrabold text-lg tracking-tight text-[var(--foreground)]">
              lumo<span className="text-[var(--primary)]">ielts</span><span className="text-xs text-[var(--muted)] font-bold">.uz</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-sm font-semibold text-[var(--secondary)]">
            <Link href="/reading" className="hover:text-[var(--primary)] transition-colors">
              Reading
            </Link>
            <Link href="/vocabulary" className="hover:text-[var(--primary)] transition-colors">
              Lug‘at
            </Link>
            <a href="#modules" className="hover:text-[var(--primary)] transition-colors">
              IELTS Modullari
            </a>
            <a href="#loop" className="hover:text-[var(--primary)] transition-colors">
              Metodologiya
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/login"
            className="secondary-button text-xs md:text-sm !py-2 !px-4 !min-h-[38px]"
          >
            Kirish
          </Link>
          <Link
            href="/signup"
            className="btn-primary text-xs md:text-sm !py-2 !px-4 !min-h-[38px]"
          >
            Ro‘yxatdan o‘tish
          </Link>
        </div>
      </header>

      {/* Hero Section (design.md: calm, welcoming, focused learning environment) */}
      <section className="px-4 pt-12 pb-16 md:pt-20 md:pb-24 max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--nav-active-bg)] border border-[#FED7AA] text-xs font-bold text-[var(--nav-active-text)]">
          <span>IELTS Academic 2026</span>
          <span className="opacity-40">·</span>
          <span>Ro‘yxatdan o‘tmasdan sinab ko‘ring</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.12] text-[var(--foreground)]">
          Tizimli mashq va xatoni tushunish orqali{" "}
          <span className="text-[var(--primary)]">IELTS 7.5+</span> natijasi.
        </h1>

        <p className="text-base md:text-lg text-[var(--secondary)] max-w-2xl mx-auto leading-relaxed">
          Lumo IELTS (lumoielts.uz) — xatoni chuqur tahlil qilish, intervalli so‘z yodlash va rasmiy formatdagi
          akademik mashqlar maydoni. Saytni erkin kezishingiz mumkin; ro‘yxatdan o‘tish — faqat xohishingizga ko‘ra.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/reading"
            className="btn-primary text-sm md:text-base !py-3.5 !px-8 w-full sm:w-auto shadow-sm"
          >
            Mashqlarni sinab ko‘rish (Bepul) <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
          <Link
            href="/signup"
            className="secondary-button text-sm md:text-base !py-3.5 !px-8 w-full sm:w-auto !m-0"
          >
            Hisob yaratish (Ixtiyoriy)
          </Link>
        </div>
      </section>

      {/* Featured Live Practice Drill (design.md Section 5 & 6) */}
      <section className="px-4 pb-14 max-w-4xl mx-auto w-full">
        <div className="card border-2 border-[var(--border)] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[var(--surface)]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="eyebrow text-xs">Tezkor mashq · Ro‘yxatsiz</span>
              <span className="text-xs text-[var(--muted)]">· 8 daqiqa</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-[var(--foreground)] tracking-tight">
              {featuredDrill.title}
            </h2>
            <p className="text-sm text-[var(--secondary)] max-w-lg leading-relaxed">
              Academic matnni o‘qib, True/False/Not Given savollarini yeching va tezkor natijani ko‘ring.
            </p>
          </div>
          <Link
            href={`/reading/${featuredDrill.id}`}
            className="btn-primary whitespace-nowrap !py-3 !px-6 text-sm shrink-0"
          >
            Hozir yechish →
          </Link>
        </div>
      </section>

      {/* IELTS 4 Core Modules */}
      <section id="modules" className="px-4 py-12 max-w-5xl mx-auto w-full space-y-6">
        <div className="text-center space-y-1">
          <span className="eyebrow">Imtihon modullari</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
            To‘rtta Asosiy IELTS Moduli
          </h2>
          <p className="text-sm text-[var(--secondary)]">
            Har bir bo‘lim uchun rasmiy mezonlarga moslashtirilgan o‘quv muhiti
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <Link
            href="/reading"
            className="card p-6 space-y-3 hover:border-[var(--primary)] transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--nav-active-bg)] text-[var(--nav-active-text)] flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
              Reading Moduli (Faol)
            </h3>
            <p className="text-xs md:text-sm text-[var(--secondary)] leading-relaxed">
              Yonma-yon matn va savollar paneli, floating toolbar, kalit so‘zlarni ta’kidlash va qat’iy tekshiruv.
            </p>
            <span className="text-xs font-semibold text-[var(--primary)] inline-flex items-center gap-1 pt-1">
              Mashqlarga o‘tish →
            </span>
          </Link>

          <Link
            href="/listening"
            className="card p-6 space-y-3 hover:border-[var(--primary)] transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 flex items-center justify-center font-bold">
              <Headphones className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
              Listening Moduli
            </h3>
            <p className="text-xs md:text-sm text-[var(--secondary)] leading-relaxed">
              Audio pleyer, transkript belgilari, chalg‘ituvchi variantlar tahlili va diktant amaliyoti.
            </p>
            <span className="text-xs font-semibold text-[var(--secondary)] inline-flex items-center gap-1 pt-1">
              Ko‘rish →
            </span>
          </Link>

          <Link
            href="/writing"
            className="card p-6 space-y-3 hover:border-[var(--primary)] transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/30 text-orange-800 dark:text-orange-200 flex items-center justify-center font-bold">
              <PenTool className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
              Writing Moduli
            </h3>
            <p className="text-xs md:text-sm text-[var(--secondary)] leading-relaxed">
              Task 1 grafiklar va Task 2 insho muharriri, so‘z sanagich va rasmiy baholash mezonlari.
            </p>
            <span className="text-xs font-semibold text-[var(--secondary)] inline-flex items-center gap-1 pt-1">
              Ko‘rish →
            </span>
          </Link>

          <Link
            href="/speaking"
            className="card p-6 space-y-3 hover:border-[var(--primary)] transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center font-bold">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
              Speaking Moduli
            </h3>
            <p className="text-xs md:text-sm text-[var(--secondary)] leading-relaxed">
              Cue card savollari, audio yozib olish va nutq ravonligini baholash.
            </p>
            <span className="text-xs font-semibold text-[var(--secondary)] inline-flex items-center gap-1 pt-1">
              Ko‘rish →
            </span>
          </Link>
        </div>
      </section>

      {/* The Learning Loop (Section 2 from plan.md / design.md) */}
      <section id="loop" className="px-4 py-12 max-w-5xl mx-auto w-full space-y-6">
        <div className="text-center space-y-1">
          <span className="eyebrow">O‘rganish zanjiri</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
            IELTS Focus Metodologiyasi
          </h2>
          <p className="text-sm text-[var(--secondary)]">
            Amaliyot → Xatoni tushunish → Maqsadli takrorlash → Progressni o‘lchash.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="card p-5 space-y-2">
            <span className="text-2xl font-black text-[var(--primary)]">01</span>
            <h3 className="font-bold text-sm text-[var(--foreground)]">Amaliyot</h3>
            <p className="text-xs text-[var(--secondary)] leading-relaxed">
              Akademik leksika va rasmiy imtihon formatidagi matnlar.
            </p>
          </div>
          <div className="card p-5 space-y-2">
            <span className="text-2xl font-black text-[var(--primary)]">02</span>
            <h3 className="font-bold text-sm text-[var(--foreground)]">Xatoni tushunish</h3>
            <p className="text-xs text-[var(--secondary)] leading-relaxed">
              Variant nima uchun to‘g‘ri yoki noto‘g‘ri ekanini matndagi dalil orqali aniqlash.
            </p>
          </div>
          <div className="card p-5 space-y-2">
            <span className="text-2xl font-black text-[var(--primary)]">03</span>
            <h3 className="font-bold text-sm text-[var(--foreground)]">Takrorlash</h3>
            <p className="text-xs text-[var(--secondary)] leading-relaxed">
              Spaced repetition usuli bilan unutilishi mumkin bo‘lgan so‘zlarni eslatish.
            </p>
          </div>
          <div className="card p-5 space-y-2">
            <span className="text-2xl font-black text-[var(--primary)]">04</span>
            <h3 className="font-bold text-sm text-[var(--foreground)]">Haqiqiy o‘sish</h3>
            <p className="text-xs text-[var(--secondary)] leading-relaxed">
              Xatolar daftari va qobiliyat tahlili orqali barqaror band ko‘tarilishi.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="px-4 py-16 max-w-3xl mx-auto w-full text-center space-y-6">
        <div className="card p-8 md:p-10 space-y-4 bg-[var(--surface)] border-2 border-[var(--border)]">
          <h2 className="text-2xl font-extrabold text-[var(--foreground)] tracking-tight">
            IELTS tayyorgarligini hozir boshlang
          </h2>
          <p className="text-sm text-[var(--secondary)] max-w-md mx-auto">
            Reading mashqlarini ro‘yxatdan o‘tmasdan bajaring yoki hisob ochib o‘quv tarixingizni saqlang.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/reading" className="btn-primary !py-3 !px-6 text-sm">
              Reading mashqlari (Ro‘yxatsiz) →
            </Link>
            <Link href="/signup" className="secondary-button !py-3 !px-6 text-sm !m-0">
              Hisob yaratish
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[var(--border)] py-8 px-4 text-center text-xs text-[var(--muted)]">
        <p>© 2026 lumoielts.uz. Lumo IELTS platformasi.</p>
        <p className="mt-1">Tinch, qulay va xavfsiz akademik o‘quv platformasi.</p>
      </footer>
    </div>
  );
}


