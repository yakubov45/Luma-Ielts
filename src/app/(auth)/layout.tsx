import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Zap, BookOpen } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 w-full h-[100dvh] overflow-hidden flex flex-col justify-between bg-[#FAF6F0] dark:bg-[#0c0a09] select-none">
      {/* =========================================================================
          BACKGROUND ANIMATED VIDEOS (Responsive: Desktop vs Mobile)
          ========================================================================= */}
      {/* Desktop Video (>= 768px): 3D book on left side */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="hidden md:block fixed inset-0 w-full h-full object-cover pointer-events-none z-0 dark:brightness-[0.4] dark:contrast-[1.1] transition-[filter] duration-500"
      >
        <source src="/videos/auth-desktop.mp4" type="video/mp4" />
      </video>

      {/* Mobile Video (< 768px): 3D book at top center */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="block md:hidden fixed inset-0 w-full h-full object-cover pointer-events-none z-0 dark:brightness-[0.4] dark:contrast-[1.1] transition-[filter] duration-500"
      >
        <source src="/videos/auth-mobile.mp4" type="video/mp4" />
      </video>

      {/* Ambient gradient overlay for seamless contrast and readability */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-t from-[#FAF6F0]/40 via-transparent to-[#FAF6F0]/20 dark:from-black/75 dark:via-black/45 dark:to-black/65" />

      {/* =========================================================================
          TOP BRAND HEADER BAR
          ========================================================================= */}
      <header className="w-full px-5 sm:px-8 py-2.5 shrink-0 flex items-center justify-between relative z-10 border-b border-black/5 dark:border-white/10 bg-white/40 dark:bg-[#121214]/60 backdrop-blur-md">
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
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      {/* =========================================================================
          MAIN AUTH SECTION
          Strictly Non-Scrollable (fixed within 100dvh)
          ========================================================================= */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between relative z-10 overflow-hidden">
        
        {/* Desktop Left Info: Placed strictly AT THE BOTTOM BELOW the 3D looping animation */}
        <div className="hidden lg:flex flex-col justify-end max-w-md space-y-2 select-none absolute bottom-8 left-8 lg:left-12 xl:left-16 z-10 pointer-events-none">
          <h2 className="text-xl lg:text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-snug drop-shadow-xs">
            Orzuingizdagi natijaga <span className="text-[var(--primary)]">tizimli</span> tayyorlaning.
          </h2>
          
          <p className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-sm drop-shadow-xs">
            Cambridge mock testlari va sun’iy intellekt orqali Writing hamda Speaking bo‘yicha batafsil tahlil.
          </p>
          
          <div className="flex flex-wrap items-center gap-2 pt-1 pointer-events-auto">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/70 dark:bg-white/10 backdrop-blur-md border border-black/5 dark:border-white/10 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 shadow-xs">
              <BookOpen className="w-3.5 h-3.5 text-[var(--primary)]" /> Cambridge 10-19 Mocklar
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/70 dark:bg-white/10 backdrop-blur-md border border-black/5 dark:border-white/10 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 shadow-xs">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Tezkor AI Tahlil
            </span>
          </div>
        </div>

        {/* Right/Center Column: Auth Card (Vertically centered, glassmorphic) */}
        <div className="w-full max-w-[400px] mx-auto lg:mx-0 lg:ml-auto my-auto relative z-10">
          {children}
        </div>

      </main>

      {/* =========================================================================
          BOTTOM FOOTER
          ========================================================================= */}
      <footer className="w-full py-2.5 px-6 shrink-0 text-center text-xs text-zinc-500 dark:text-zinc-400 relative z-10 border-t border-black/5 dark:border-white/10 bg-white/30 dark:bg-[#121214]/50 backdrop-blur-md">
        © 2026 lumoielts.uz • Lumo IELTS Platformasi
      </footer>
    </div>
  );
}
