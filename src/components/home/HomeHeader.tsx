"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Menu, X, ArrowRight, User } from "lucide-react";

export function HomeHeader() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--surface)]/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <img
            src="/logo.png"
            alt="Lumo IELTS"
            className="w-8 h-8 rounded-xl object-contain shadow-xs shrink-0 group-hover:scale-105 transition-transform"
          />
          <span className="font-extrabold text-base sm:text-lg tracking-tight text-[var(--foreground)]">
            lumo<span className="text-[var(--primary)]">ielts</span>
            <span className="text-xs text-[var(--muted)] font-bold">.uz</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold text-[var(--secondary)]">
          <a href="#practice-sample" className="hover:text-[var(--primary)] transition-colors">
            Amaliyot
          </a>
          <a href="#skills" className="hover:text-[var(--primary)] transition-colors">
            Ko‘nikmalar
          </a>
          <a href="#loop" className="hover:text-[var(--primary)] transition-colors">
            Metodologiya
          </a>
          <a href="#study-plan" className="hover:text-[var(--primary)] transition-colors">
            Shaxsiy reja
          </a>
          <a href="#groups" className="hover:text-[var(--primary)] transition-colors">
            Guruhlar
          </a>
          <a href="#faq" className="hover:text-[var(--primary)] transition-colors">
            FAQ
          </a>
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <Link
              href="/dashboard"
              className="btn-primary !py-2 !px-4 text-xs font-bold shadow-xs inline-flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="secondary-button !py-2 !px-3.5 text-xs font-bold !min-h-0"
              >
                Kirish
              </Link>
              <Link
                href="/reading"
                className="btn-primary !py-2 !px-4 text-xs font-bold shadow-xs !min-h-0"
              >
                Bepul boshlash
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger & Theme Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Menyu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[var(--foreground)] hover:bg-[var(--surface-subtle)] border border-[var(--border)] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-[var(--border)] bg-[var(--surface)] px-4 py-5 space-y-4 animate-fade-in shadow-xl">
          <nav className="flex flex-col space-y-3 text-sm font-semibold text-[var(--foreground)]">
            <a
              href="#practice-sample"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[var(--primary)] transition-colors"
            >
              Amaliyot (Mini Demo)
            </a>
            <a
              href="#skills"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[var(--primary)] transition-colors"
            >
              To‘rtta Ko‘nikma
            </a>
            <a
              href="#loop"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[var(--primary)] transition-colors"
            >
              O‘rganish Metodologiyasi
            </a>
            <a
              href="#study-plan"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[var(--primary)] transition-colors"
            >
              Shaxsiy O‘quv Rejasi
            </a>
            <a
              href="#groups"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[var(--primary)] transition-colors"
            >
              Guruhli O‘qish
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[var(--primary)] transition-colors"
            >
              Ko‘p Beriladigan Savollar
            </a>
          </nav>

          <div className="pt-3 border-t border-[var(--border)] flex flex-col gap-2.5">
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary w-full !py-2.5 text-center text-xs font-bold justify-center"
              >
                Dashboardga o‘tish →
              </Link>
            ) : (
              <>
                <Link
                  href="/reading"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary w-full !py-2.5 text-center text-xs font-bold justify-center"
                >
                  Bepul mashqni boshlash
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="secondary-button w-full !py-2.5 text-center text-xs font-bold justify-center"
                >
                  Kirish
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
