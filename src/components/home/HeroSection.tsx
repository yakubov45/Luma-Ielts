import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { HeroBrandIllustration } from "./HeroBrandIllustration";

export function HeroSection() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 pt-10 pb-14 sm:pt-16 sm:pb-20 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Heading, Copy, and Actions */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--nav-active-bg)] border border-[var(--primary)]/20 text-xs font-bold text-[var(--nav-active-text)] shadow-xs mx-auto lg:mx-0">
            <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>IELTS Academic & General Platformasi</span>
            <span className="opacity-40">·</span>
            <span>Ro‘yxatsiz sinab ko‘ring</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[var(--foreground)] leading-[1.12]">
            IELTS’ga har kuni <span className="text-[var(--primary)]">aniq bir qadam</span>.
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-[var(--secondary)] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
            To‘rtta ko‘nikmani mashq qiling, xatolaringizni tushuning va o‘zingizga mos reja bilan tayyorlaning.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
            <a
              href="#practice-sample"
              className="btn-primary w-full sm:w-auto !py-3.5 !px-7 text-sm font-bold shadow-md shadow-orange-500/20 text-center justify-center"
            >
              <span>Bepul mashqni boshlash</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </a>

            <Link
              href="/onboarding"
              className="secondary-button w-full sm:w-auto !py-3.5 !px-6 text-sm font-bold text-center justify-center !m-0"
            >
              Shaxsiy reja tuzish
            </Link>
          </div>

          {/* Trust points */}
          <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-[var(--secondary)] font-medium">
            <div className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Ro‘yxatdan o‘tmasdan sinash</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Cambridge 10-19 rasmiy formati</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Xatolarni dalil bilan tahlil qilish</span>
            </div>
          </div>
        </div>

        {/* Right Column: Compact Animated Brand Illustration */}
        <div className="lg:col-span-5 w-full flex justify-center">
          <HeroBrandIllustration />
        </div>

      </div>
    </section>
  );
}
