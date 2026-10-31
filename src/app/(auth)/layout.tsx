import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-x-hidden bg-[#FAF6F0] dark:bg-[#0c0a09]">
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
      <header className="w-full px-5 sm:px-8 py-3.5 flex items-center justify-between relative z-10 border-b border-black/5 dark:border-white/10 bg-white/40 dark:bg-[#121214]/60 backdrop-blur-md">
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
          On Desktop: 3D book visible on left, auth card cleanly on right
          On Mobile: 3D book visible at top, auth card centered below
          ========================================================================= */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 flex flex-col justify-center relative z-10">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Desktop Left Decorative Corner Info (Bottom left, leaves the 3D book 100% visible) */}
          <div className="hidden lg:flex flex-col justify-end max-w-sm space-y-3.5 select-none self-end pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-md border border-[var(--primary)]/30 text-[var(--primary)] text-xs font-bold w-fit shadow-xs">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-[var(--primary)]" />
              <span>AI Bilan Kuchaytirilgan Platforma</span>
            </div>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed drop-shadow-xs">
              Orzuingizdagi Band 7.5+ natijaga erishish uchun Cambridge mocklar va individual AI tahlili.
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 pt-1">
              <span className="inline-flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Tezkor AI tahlil
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Cambridge Mocklar
              </span>
            </div>
          </div>

          {/* Right/Center Column: Auth Card (Offset on mobile to showcase the 3D animated book) */}
          <div className="w-full max-w-[430px] mx-auto lg:mx-0 lg:ml-auto mt-24 sm:mt-20 lg:mt-0 pb-8 lg:pb-0">
            {children}
          </div>

        </div>
      </main>

      {/* =========================================================================
          BOTTOM FOOTER
          ========================================================================= */}
      <footer className="w-full py-3.5 px-6 text-center text-xs text-zinc-500 dark:text-zinc-400 relative z-10 border-t border-black/5 dark:border-white/10 bg-white/30 dark:bg-[#121214]/50 backdrop-blur-md">
        © 2026 lumoielts.uz • Lumo IELTS Platformasi
      </footer>
    </div>
  );
}
