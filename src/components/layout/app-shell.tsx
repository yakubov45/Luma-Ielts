"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { Suspense, useState } from "react";
import { clearSessionDataOnSignOut } from "@/lib/services/sync-service";
import {
  LayoutDashboard,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Languages,
  AlertCircle,
  TrendingUp,
  Calendar,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Layers,
  Users,
  Compass,
} from "lucide-react";
import { auth } from "@/lib/firebase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/reading", label: "Reading", icon: BookOpen },
  { href: "/listening", label: "Listening", icon: Headphones },
  { href: "/writing", label: "Writing", icon: PenTool },
  { href: "/speaking", label: "Speaking", icon: Mic },
  { href: "/mock-tests", label: "Mock Testlar", icon: Layers },
  { href: "/groups", label: "Guruhlar", icon: Users },
  { href: "/diagnostic", label: "Diagnostika", icon: Compass },
  { href: "/vocabulary", label: "Vocabulary", icon: Languages },
  { href: "/mistakes", label: "Mistakes", icon: AlertCircle },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/study-plan", label: "Study Plan", icon: Calendar },
  { href: "/admin", label: "Admin CMS", icon: ShieldCheck },
] as const;

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  return (
    <div className="flex flex-col h-full bg-[var(--surface)] border-r border-[var(--border)] text-[var(--foreground)]">
      {/* Brand header */}
      <div className="p-5 flex items-center justify-between border-b border-[var(--border)]">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2.5 font-black text-lg tracking-tight text-[var(--foreground)] group"
        >
          <img
            src="/logo.png"
            alt="Lumo IELTS"
            className="w-8 h-8 rounded-xl object-contain shadow-xs shrink-0"
          />
          <span className="font-extrabold text-base tracking-tight text-[var(--foreground)]">
            lumo<span className="text-[var(--primary)]">ielts</span><span className="text-xs text-[var(--muted)] font-bold">.uz</span>
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg hover:bg-[var(--surface-subtle)] text-[var(--muted)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || Boolean(pathname?.startsWith(`${item.href}/`));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[var(--nav-active-bg)] text-[var(--nav-active-text)] font-semibold"
                  : "text-[var(--secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--foreground)]"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom controls */}
      <div className="p-3 border-t border-[var(--border)] space-y-1">
        <div className="flex items-center justify-between gap-1">
          <Link
            href="/settings"
            onClick={onClose}
            className={`flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              pathname === "/settings"
                ? "bg-[var(--nav-active-bg)] text-[var(--nav-active-text)] font-semibold"
                : "text-[var(--secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--foreground)]"
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Sozlamalar</span>
          </Link>
          <ThemeToggle />
        </div>

        {loading ? (
          <div className="p-3 text-xs text-[var(--muted)]">Yuklanmoqda…</div>
        ) : user ? (
          <div className="pt-2 border-t border-[var(--border)] mt-2 pb-3">
            <div className="px-2.5 py-2 flex items-center justify-between gap-2 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)]">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[var(--nav-active-bg)] text-[var(--primary)] font-bold text-xs flex items-center justify-center shrink-0">
                  {(user.displayName ? user.displayName[0] : user.email ? user.email[0] : "U").toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[var(--foreground)] truncate">
                    {user.displayName || "IELTS Learner"}
                  </p>
                  <p className="text-[10px] text-[var(--muted)] truncate max-w-[105px]">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  clearSessionDataOnSignOut();
                  signOut(auth);
                }}
                title="Chiqish"
                className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--error)] hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-2 border-t border-[var(--border)] mt-2 flex flex-col gap-1.5">
            <Link
              href="/login"
              onClick={onClose}
              className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface-subtle)]"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Kirish</span>
            </Link>
            <Link
              href="/signup"
              onClick={onClose}
              className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Ro‘yxatdan o‘tish</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function PageTitle() {
  const pathname = usePathname();
  const found = navigationItems.find((n) => n.href === pathname);
  if (found) return <span>{found.label}</span>;
  if (pathname === "/settings") return <span>Sozlamalar</span>;
  if (pathname?.startsWith("/groups/")) return <span>Guruh Xonasi</span>;
  if (pathname?.startsWith("/diagnostic")) return <span>IELTS Diagnostika</span>;
  if (pathname?.startsWith("/reading/")) return <span>Reading Mashqi</span>;
  if (pathname?.startsWith("/results/")) return <span>Mashq Natijasi</span>;
  return <span>IELTS Academic</span>;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      {/* Desktop Left Sidebar (240px wide per design.md Section 4) */}
      <aside className="hidden md:block w-[240px] shrink-0 sticky top-0 h-screen">
        <Suspense fallback={<div className="w-[240px] h-screen bg-[var(--surface)] border-r border-[var(--border)]" />}>
          <SidebarContent />
        </Suspense>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-[260px] max-w-[80vw] h-full z-10 shadow-2xl">
            <Suspense fallback={null}>
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </Suspense>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (design.md Section 4) */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border)] px-4 md:px-8 py-3.5 bg-[var(--surface)]/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base md:text-lg font-bold text-[var(--foreground)] tracking-tight">
              <Suspense fallback={<span>lumoielts.uz</span>}>
                <PageTitle />
              </Suspense>
            </h1>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-[var(--muted)]">
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full bg-[var(--surface-subtle)] border border-[var(--border)] font-medium text-[var(--secondary)]">
              IELTS Academic · UZ
            </span>
            <Link
              href="/reading"
              className="font-semibold text-[var(--primary)] hover:underline hidden md:inline"
            >
              Matnlar katalogi
            </Link>
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

