"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSection() {
  const faqs: FaqItem[] = [
    {
      question: "Ro‘yxatdan o‘tmasdan mashqlarni sinab ko‘rsam bo‘ladimi?",
      answer:
        "Ha, albatta. Platformadagi Reading, mini-mashqlar va lug‘at qidiruvidan hisob ochmasdan erkin foydalanishingiz mumkin. Ro‘yxatdan o‘tish faqat natijalaringizni bulutda saqlab borish uchun kerak.",
    },
    {
      question: "Hisob yaratganda qanday ma’lumotlarim saqlanadi?",
      answer:
        "Hisobingizda bajargan mock testlaringiz, xatolar daftari, lug‘atga kiritgan so‘zlaringiz (intervalli takrorlash bilan) va shaxsiy o‘quv rejangiz progressi xavfsiz saqlanadi.",
    },
    {
      question: "AI orqali baholash rasmiy IELTS bali hisoblanadimi?",
      answer:
        "Yo‘q. Sun’iy intellekt tahlili rasmiy IELTS imtihon mezonlariga tayangan holda sizning grammatik, leksik va tuzilmaviy kamchiliklaringizni ko‘rsatib, taxminiy yo‘nalish beradi. Rasmiy ball faqat akkreditatsiyalangan IELTS markazlarida beriladi.",
    },
    {
      question: "Kunlik o‘quv rejasi qanday tuziladi?",
      answer:
        "Siz 8 ta savoldan iborat rejalashtirish so‘rovnomasida maqsadingiz, imtihon sanangiz, haftada qaysi kunlar va kuniga necha daqiqa ajrata olishingizni belgilaysiz. Tizim sizning vaqtingizga mos mashg‘ulotlar ketma-ketligini tuzib beradi.",
    },
    {
      question: "Platformadan telefonda foydalansa bo‘ladimi?",
      answer:
        "Ha. Platforma smartfon, planshet va noutbuk ekranlariga to‘liq moslashtirilgan. Reading, Listening audio pleyeri va so‘z takrorlash mobil brauzerda ham qulay ishlaydi.",
    },
    {
      question: "O‘qituvchilar bilan guruhli o‘qish qanday ishlaydi?",
      answer:
        "O‘qituvchi 5 tadan 15 tagacha o‘quvchidan iborat guruh tuzib, o‘quvchilarga maxsus kirish kodi orqali a’zo bo‘lish imkonini beradi. O‘qituvchi guruhga mock vazifalar yuklaydi va kim qachon topshirganini tekshirib boradi.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="px-4 sm:px-6 lg:px-8 py-14 sm:py-20 max-w-4xl mx-auto scroll-mt-20">
      <div className="text-center space-y-2.5 mb-10">
        <span className="eyebrow">Savol-Javoblar</span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[var(--foreground)]">
          Ko‘p Beriladigan Savollar
        </h2>
        <p className="text-xs sm:text-sm text-[var(--secondary)] leading-relaxed">
          Platformaning ishlash tartibi va imkoniyatlari haqida aniq ma’lumotlar
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.question}
              className="card p-0 rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden transition-all"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggle(idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors cursor-pointer gap-4"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[var(--muted)] shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-[var(--primary)]" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm leading-relaxed text-[var(--secondary)] border-t border-[var(--border)]/60 bg-[var(--surface-subtle)]/40 animate-fade-in">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
