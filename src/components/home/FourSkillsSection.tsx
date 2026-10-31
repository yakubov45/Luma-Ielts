import Link from "next/link";
import { BookOpen, Headphones, PenTool, Mic, ArrowRight } from "lucide-react";

export function FourSkillsSection() {
  const skills = [
    {
      id: "reading",
      title: "Reading Moduli",
      icon: BookOpen,
      iconBg: "bg-orange-500/10 text-[var(--primary)] border-[var(--primary)]/20",
      benefit: "Javobni toping va matndagi dalilni tushuning.",
      features: "Passage 1-3, Cambridge mocklar, tezkor kalit so‘z qidiruvi",
      href: "/reading",
      badge: "Faol",
    },
    {
      id: "listening",
      title: "Listening Moduli",
      icon: Headphones,
      iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      benefit: "Tinglang, javob bering va transkript bilan tahlil qiling.",
      features: "Audio pleyer, transkript belgilari, chalg‘ituvchi variantlar",
      href: "/listening",
      badge: "Faol",
    },
    {
      id: "writing",
      title: "Writing Moduli",
      icon: PenTool,
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      benefit: "Yozing, fikr-mulohaza oling va matningizni yaxshilang.",
      features: "Task 1 & Task 2, so‘z sanagich va rasmiy baholash mezonlari",
      href: "/writing",
      badge: "Faol",
    },
    {
      id: "speaking",
      title: "Speaking Moduli",
      icon: Mic,
      iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      benefit: "Gapiring, ovozingizni yozing va qayta tinglang.",
      features: "Part 1-3 mavzulari, audio yozish va foydali birikmalar",
      href: "/speaking",
      badge: "Faol",
    },
  ];

  return (
    <section id="skills" className="px-4 sm:px-6 lg:px-8 py-14 sm:py-20 max-w-7xl mx-auto scroll-mt-20">
      <div className="text-center space-y-2.5 max-w-3xl mx-auto mb-10">
        <span className="eyebrow">To‘rtta Asosiy Ko‘nikma</span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[var(--foreground)]">
          Har Bir Modul Uchun Aniq Yondashuv
        </h2>
        <p className="text-xs sm:text-sm text-[var(--secondary)] leading-relaxed">
          IELTS imtihonining to‘rtta bo‘limi bo‘yicha rasmiy Cambridge standartidagi muhit va chuqur tahlil
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {skills.map((skill) => {
          const Icon = skill.icon;
          return (
            <Link
              key={skill.id}
              href={skill.href}
              className="card p-6 flex flex-col justify-between space-y-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${skill.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] bg-[var(--surface-subtle)] px-2 py-0.5 rounded-md border border-[var(--border)]">
                    {skill.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                    {skill.title}
                  </h3>
                  <p className="text-xs font-semibold text-[var(--foreground)] leading-snug">
                    “{skill.benefit}”
                  </p>
                </div>

                <p className="text-[11px] text-[var(--secondary)] leading-relaxed">
                  {skill.features}
                </p>
              </div>

              <div className="pt-2 border-t border-[var(--border)] flex items-center text-xs font-bold text-[var(--primary)] group-hover:translate-x-1 transition-transform">
                <span>Mashqlarga o‘tish</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
