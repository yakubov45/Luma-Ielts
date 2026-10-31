import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--background)] relative overflow-hidden">
      {/* Background ambient warm decorative glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[540px] h-[360px] bg-[var(--primary)]/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Top minimal brand bar */}
      <header className="w-full px-6 py-4 flex items-center justify-between relative z-10 border-b border-[var(--border)]/60 bg-[var(--surface)]/60 backdrop-blur-md">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <img
            src="/logo.png"
            alt="Lumo IELTS"
            className="w-8 h-8 rounded-xl object-contain shadow-xs shrink-0"
          />
          <span className="font-extrabold text-base tracking-tight text-[var(--foreground)]">
            lumo<span className="text-[var(--primary)]">ielts</span>
            <span className="text-xs text-[var(--muted)] font-bold">.uz</span>
          </span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Centered Main Content Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 relative z-10">
        <div className="w-full max-w-[440px] mx-auto animate-fade-in">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-6 text-center text-xs text-[var(--muted)] relative z-10 border-t border-[var(--border)]/40">
        © 2026 lumoielts.uz • Lumo IELTS Platformasi
      </footer>
    </div>
  );
}
