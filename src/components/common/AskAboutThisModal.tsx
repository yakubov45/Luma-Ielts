"use client";

import { useState } from "react";
import { MessageSquare, X, Sparkles, Send, HelpCircle, AlertCircle, BookOpen } from "lucide-react";

export interface ContextualHelpData {
  skill: "reading" | "listening" | "writing" | "speaking";
  taskTitle: string;
  questionPrompt?: string;
  userAnswer?: string;
  correctAnswer?: string;
  passageExcerpt?: string;
  feedbackSummary?: string;
}

interface AskAboutThisModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextData: ContextualHelpData | null;
}

export function AskAboutThisModal({ isOpen, onClose, contextData }: AskAboutThisModalProps) {
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [customQuestion, setCustomQuestion] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "assistant"; text: string }>>([]);

  if (!isOpen || !contextData) return null;

  const quickPrompts = [
    "Nima uchun mening javobim noto‘g‘ri deb baholandi?",
    "Matndagi aynan qaysi gap bunga asosiy dalil bo‘la oladi?",
    "Bunday turdagi savollarda qanday kalit so‘z strategiyasini qo‘llash kerak?",
    "To‘g‘ri javob va matn o‘rtasidagi parafrazni tushuntirib bering.",
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const query = text.trim();
    const newHistory = [...messages, { sender: "user" as const, text: query }];
    setMessages(newHistory);
    setCustomQuestion("");
    setIsAnswering(true);

    setTimeout(() => {
      let responseText = "";

      if (contextData.skill === "reading" || contextData.skill === "listening") {
        responseText = `Ushbu savol bo‘yicha tahlil:\n\n• **Savol:** "${contextData.questionPrompt}"\n• **Sizning javobingiz:** "${contextData.userAnswer}"\n• **To‘g‘ri javob:** "${contextData.correctAnswer}"\n\n📌 **Matndan dalil:**\n"${contextData.passageExcerpt || "Matnda berilgan kontekst asosida"}"\n\n💡 **Mantiqiy tushuntirish:**\nIELTS imtihonida to‘g‘ridan-to‘g‘ri matndagi so‘zlar emas, balki ularning ma'nodoshlari (paraphrasing) ishlatiladi. Siz tanlagan variant kontekstdagi asosiy shartga zid yoki matnda aniq tasdiqlanmagan. To‘g‘ri javob esa matndagi dalil bilan to‘liq mos keladi.`;
      } else {
        responseText = `Writing/Speaking bo‘yicha tahlil:\n\n• **Mavzu:** ${contextData.taskTitle}\n• **Kiritilgan fikr:** "${contextData.userAnswer?.slice(0, 150)}..."\n\n💡 **Tavsiya va baho asosi:**\n${contextData.feedbackSummary || "Mezonlar bo‘yicha aniqlik va bog‘liqlikni oshirish talab etiladi."}\n\nUshbu fikrni yanada kuchliroq akademik darajada (Band 7.5+) ifodalash uchun murakkab grammatik strukturalar (masalan, inversiya yoki passive voice) hamda rasmiy akademik bog‘lovchilardan (Furthermore, In light of this) foydalanish tavsiya etiladi.`;
      }

      setMessages([...newHistory, { sender: "assistant" as const, text: responseText }]);
      setIsAnswering(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="card max-w-xl w-full p-6 space-y-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--nav-active-bg)] text-[var(--primary)] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[var(--foreground)]">
                Shu savol haqida so‘rash (Ask about this)
              </h3>
              <p className="text-xs text-[var(--muted)]">
                {contextData.taskTitle} · {contextData.skill.toUpperCase()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-subtle)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Authorized Context Summary (Section 10) */}
        <div className="p-3.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-xs space-y-1.5 shrink-0">
          {contextData.questionPrompt && (
            <p className="text-[var(--foreground)] font-bold">
              Savol: <span className="font-medium">{contextData.questionPrompt}</span>
            </p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
            {contextData.userAnswer && (
              <span className="text-rose-700 dark:text-rose-400">
                Sizning javob: <strong>{contextData.userAnswer}</strong>
              </span>
            )}
            {contextData.correctAnswer && (
              <span className="text-emerald-700 dark:text-emerald-400">
                To‘g‘ri javob: <strong>{contextData.correctAnswer}</strong>
              </span>
            )}
          </div>
          {contextData.passageExcerpt && (
            <p className="text-[11px] text-[var(--muted)] italic pt-0.5 line-clamp-2">
              Dalil: "{contextData.passageExcerpt}"
            </p>
          )}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
          {messages.length === 0 ? (
            <div className="py-6 text-center space-y-3">
              <HelpCircle className="w-8 h-8 text-[var(--primary)] mx-auto opacity-70" />
              <p className="text-[var(--secondary)] font-medium">
                Savol bo‘yicha nimani tushunmadingiz? Quyidagi tayyor savollardan birini tanlang yoki
                o‘zingiz yozing:
              </p>
              <div className="flex flex-col gap-1.5 pt-2 text-left">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] hover:border-[var(--primary)] text-[var(--foreground)] transition-all cursor-pointer text-xs"
                  >
                    💬 {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[88%] whitespace-pre-line leading-relaxed ${
                    m.sender === "user"
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--foreground)]"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))
          )}
          {isAnswering && (
            <div className="p-3 rounded-xl bg-[var(--surface-subtle)] text-[var(--muted)] animate-pulse">
              Javob tayyorlanmoqda…
            </div>
          )}
        </div>

        {/* Input Row */}
        <div className="pt-2 border-t border-[var(--border)] flex items-center gap-2">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend(customQuestion);
            }}
            placeholder="Shu savol bo‘yicha qo‘shimcha savolingizni yozing..."
            className="flex-1 text-xs !py-2.5 px-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--foreground)]"
          />
          <button
            onClick={() => handleSend(customQuestion)}
            disabled={!customQuestion.trim() || isAnswering}
            className="btn-primary !py-2.5 !px-4 text-xs font-bold cursor-pointer disabled:opacity-50 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
