import { BookOpen, HelpCircle, RotateCcw, TrendingUp } from "lucide-react";

export function LearningLoopSection() {
  const steps = [
    {
      num: "01",
      title: "Mashq qilish",
      subtitle: "Practice",
      icon: BookOpen,
      desc: "Cambridge 10-19 standartidagi akademik matnlar, audioler va savollar to‘plami.",
      example: "Academic Passage 1-3 · 40 ta savol",
    },
    {
      num: "02",
      title: "Xatoni tushunish",
      subtitle: "Understand",
      icon: HelpCircle,
      desc: "Variant nima uchun to‘g‘ri yoki xato ekanini matndagi aniq dalil jumlasi orqali bilish.",
      example: "Matndagi dalil ta’kidlanadi",
    },
    {
      num: "03",
      title: "Takrorlash",
      subtitle: "Review",
      icon: RotateCcw,
      desc: "SM-2 intervalli takrorlash algoritmi bilan unutilishi mumkin bo‘lgan so‘zlarni esga solish.",
      example: "5 daqiqalik intervalli qaytarish",
    },
    {
      num: "04",
      title: "Progressni o‘lchash",
      subtitle: "Measure",
      icon: TrendingUp,
      desc: "Xatolar tahlili va ko‘nikmalar bo‘yicha aniq band o‘sish monitoringi.",
      example: "Band 6.0 → 7.5 dinamikasi",
    },
  ];

  return (
    <section id="loop" className="px-4 sm:px-6 lg:px-8 py-14 sm:py-20 max-w-7xl mx-auto scroll-mt-20">
      <div className="text-center space-y-2.5 max-w-3xl mx-auto mb-12">
        <span className="eyebrow">O‘rganish Metodologiyasi</span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[var(--foreground)]">
          Lumo IELTS O‘rganish Zanjiri
        </h2>
        <p className="text-xs sm:text-sm text-[var(--secondary)] leading-relaxed">
          Shunchaki test yechish emas, balki xatolarni chuqur tahlil qilib, ularni doimiy o‘sishga aylantirish tizimi.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="card p-6 flex flex-col justify-between space-y-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden"
            >
              {/* Subtle Step Number in background */}
              <span className="text-4xl font-black text-[var(--primary)]/15 select-none absolute top-3 right-4">
                {step.num}
              </span>

              <div className="space-y-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-[var(--nav-active-bg)] text-[var(--nav-active-text)] border border-[var(--primary)]/20 flex items-center justify-center font-bold">
                  <Icon className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-[var(--foreground)]">
                    {step.title}
                  </h3>
                  <span className="text-[11px] font-bold text-[var(--primary)] uppercase tracking-wider">
                    {step.subtitle}
                  </span>
                </div>

                <p className="text-xs text-[var(--secondary)] leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="pt-2.5 border-t border-[var(--border)] text-[11px] font-medium text-[var(--muted)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                <span>{step.example}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
