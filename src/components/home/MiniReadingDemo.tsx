"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  BookmarkPlus,
  Check,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { addWordToVocabulary } from "@/lib/services/vocabulary-service";
import { useAuth } from "@/components/auth/auth-provider";

interface DictResult {
  word: string;
  phonetic?: string;
  partOfSpeech?: string;
  definition?: string;
  example?: string;
}

export function MiniReadingDemo() {
  const { user } = useAuth();

  // Question State
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Dictionary Lookup State
  const [activeWord, setActiveWord] = useState<string | null>("pivotal");
  const [dictLoading, setDictLoading] = useState(false);
  const [dictError, setDictError] = useState(false);
  const [dictData, setDictData] = useState<DictResult | null>({
    word: "pivotal",
    phonetic: "/ˈpɪv.ə.təl/",
    partOfSpeech: "adjective",
    definition: "Of crucial importance in relation to the development or success of something else.",
    example: "Urban vegetation plays a pivotal role in moderating localized microclimates.",
  });
  const [savedWord, setSavedWord] = useState(false);

  async function lookupWord(wordToLookup: string) {
    const clean = wordToLookup.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim().toLowerCase();
    if (!clean) return;

    setActiveWord(clean);
    setDictLoading(true);
    setDictError(false);
    setSavedWord(false);

    try {
      const res = await fetch(`/api/dictionary?word=${encodeURIComponent(clean)}`);
      if (!res.ok) {
        throw new Error("Dictionary lookup failed");
      }
      const data = await res.json();
      setDictData({
        word: data.word || clean,
        phonetic: data.phonetic || "",
        partOfSpeech: data.partOfSpeech || "word",
        definition: data.definition || "Definition available in context.",
        example: data.example || "",
      });
    } catch (err) {
      console.warn("Dictionary lookup fallback:", err);
      setDictError(true);
      // Honest fallback state
      setDictData(null);
    } finally {
      setDictLoading(false);
    }
  }

  async function handleSaveWord() {
    if (!dictData || !activeWord) return;
    try {
      await addWordToVocabulary(
        user?.uid,
        {
          word: dictData.word,
          partOfSpeech: dictData.partOfSpeech || "noun",
          definition: dictData.definition || "",
          uzbekNote: "",
          example: dictData.example || "",
          source: "Mini Reading Namoyishi",
        }
      );
      setSavedWord(true);
    } catch (err) {
      console.error("Vocabulary save failed:", err);
    }
  }

  function handleReset() {
    setSelectedAnswer(null);
    setSubmitted(false);
  }

  const isCorrect = selectedAnswer === "FALSE";

  return (
    <section id="practice-sample" className="px-4 sm:px-6 lg:px-8 py-14 sm:py-20 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="text-center space-y-2.5 max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--nav-active-bg)] border border-[var(--primary)]/20 text-xs font-bold text-[var(--nav-active-text)] shadow-xs">
          <BookOpen className="w-3.5 h-3.5 text-[var(--primary)]" />
          <span>Jonli Namoyish · Ro‘yxatdan o‘tmasdan sinab ko‘ring</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[var(--foreground)]">
          Reading Modulini Hozir Sinab Ko‘ring
        </h2>

        <p className="text-xs sm:text-sm text-[var(--secondary)] leading-relaxed">
          Matndan biror so‘zni bosing va lug‘at ta’rifini ko‘ring. Savolga javob berib, to‘g‘ri javobning matndagi dalilini aniqlang.
        </p>

        <p className="text-[11px] text-[var(--muted)] font-medium">
          * Bu kichik interaktiv namoyish bo‘lib, to‘liq IELTS testi yoki rasmiy band bahosi hisoblanmaydi.
        </p>
      </div>

      {/* Main Interactive Container: Side-by-side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Academic Reading Passage (7 cols) */}
        <div className="lg:col-span-7 card p-5 sm:p-7 space-y-4 bg-[var(--surface)] border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div>
              <span className="eyebrow text-[11px]">Academic Reading · Passage Sample</span>
              <h3 className="text-base sm:text-lg font-black text-[var(--foreground)]">
                The Architecture of Urban Microclimates
              </h3>
            </div>
            <div className="text-xs font-semibold text-[var(--muted)] bg-[var(--surface-subtle)] px-2.5 py-1 rounded-lg border border-[var(--border)]">
              120 so‘z
            </div>
          </div>

          {/* Quick Word Lookup Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-semibold text-[var(--muted)] mr-1">So‘zni tekshirish:</span>
            {["pivotal", "evapotranspiration", "mitigate", "dissipates"].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => lookupWord(w)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                  activeWord === w
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-[var(--surface-subtle)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--primary)]"
                }`}
              >
                {w}
              </button>
            ))}
          </div>

          {/* Passage Content with Evidence Highlight */}
          <div className="text-sm leading-relaxed text-[var(--foreground)] space-y-3 font-normal">
            <p>
              Urban vegetation plays a{" "}
              <button
                type="button"
                onClick={() => lookupWord("pivotal")}
                className="underline decoration-dotted decoration-[var(--primary)] text-[var(--primary)] font-semibold cursor-pointer"
                title="Lug‘atda ko‘rish"
              >
                pivotal
              </button>{" "}
              role in moderating localized microclimates within dense metropolitan zones. Extensive research demonstrates that leafy tree canopies decrease surface temperatures by intercepting incoming solar radiation and facilitating{" "}
              <button
                type="button"
                onClick={() => lookupWord("evapotranspiration")}
                className="underline decoration-dotted decoration-[var(--primary)] text-[var(--primary)] font-semibold cursor-pointer"
                title="Lug‘atda ko‘rish"
              >
                evapotranspiration
              </button>
              . Consequently, shaded pavements maintain substantially cooler conditions than exposed asphalt surfaces during peak daylight hours.
            </p>

            <p>
              Moreover, vertical green facades{" "}
              <button
                type="button"
                onClick={() => lookupWord("mitigate")}
                className="underline decoration-dotted decoration-[var(--primary)] text-[var(--primary)] font-semibold cursor-pointer"
                title="Lug‘atda ko‘rish"
              >
                mitigate
              </button>{" "}
              the urban heat island phenomenon by insulating building envelopes.{" "}
              {/* Evidence Sentence - Highlighted when submitted */}
              <span
                className={`transition-colors duration-500 rounded px-1 ${
                  submitted
                    ? "bg-amber-100 dark:bg-amber-950/60 font-medium text-amber-950 dark:text-amber-200 border-b-2 border-amber-500"
                    : ""
                }`}
              >
                Unlike conventional reflective concrete facades, biological foliage{" "}
                <button
                  type="button"
                  onClick={() => lookupWord("dissipates")}
                  className="underline decoration-dotted decoration-[var(--primary)] text-[var(--primary)] font-semibold cursor-pointer"
                  title="Lug‘atda ko‘rish"
                >
                  dissipates
                </button>{" "}
                accumulated thermal energy without radiating heat back into adjacent pedestrian corridors.
              </span>
            </p>
          </div>

          {submitted && (
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>Sariq rang bilan ta’kidlangan jumla — savolning matndagi to‘g‘ridan-to‘g‘ri dalili.</span>
            </div>
          )}
        </div>

        {/* Right Column: Question & Interactive Dictionary (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Question Card */}
          <div className="card p-5 space-y-4 bg-[var(--surface)] border border-[var(--border)] shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <span className="eyebrow text-[11px]">1-savol · True / False / Not Given</span>
              <span className="text-xs font-bold text-[var(--primary)]">1 ball</span>
            </div>

            <p className="text-sm font-semibold text-[var(--foreground)] leading-snug">
              According to the passage, vertical green facades absorb and radiate more heat into pedestrian corridors than concrete facades.
            </p>

            {/* Answer Options */}
            <div className="grid grid-cols-3 gap-2">
              {["TRUE", "FALSE", "NOT GIVEN"].map((option) => (
                <button
                  key={option}
                  type="button"
                  disabled={submitted}
                  onClick={() => setSelectedAnswer(option)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center ${
                    selectedAnswer === option
                      ? "border-[var(--primary)] bg-[var(--nav-active-bg)] text-[var(--primary)] shadow-xs"
                      : "border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--foreground)] hover:border-[var(--primary)]"
                  } ${submitted ? "opacity-80 cursor-default" : ""}`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Submit Action */}
            {!submitted ? (
              <button
                type="button"
                disabled={!selectedAnswer}
                onClick={() => setSubmitted(true)}
                className="btn-primary w-full !py-2.5 text-xs font-bold justify-center disabled:opacity-50 cursor-pointer"
              >
                Javobni tekshirish →
              </button>
            ) : (
              <div className="space-y-3 pt-1 animate-fade-in">
                {/* Result Feedback Banner */}
                <div
                  className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                    isCorrect
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                      : "bg-red-500/10 border-red-500/30 text-red-800 dark:text-red-300"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>To‘g‘ri javob! (FALSE)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span>Noto‘g‘ri. To‘g‘ri javob: FALSE</span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] leading-relaxed text-zinc-700 dark:text-zinc-300">
                    Matnda ko‘rsatilishicha, yashil fasadlar issiqlikni atrofdagi yo‘laklarga qayta nurlantirmasdan tarqatadi (without radiating heat back). Shuning uchun savoldagi jumla noto‘g‘ri (FALSE).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="secondary-button flex-1 !py-2 text-xs font-bold justify-center"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" /> Qayta urinish
                  </button>
                  <Link
                    href="/reading"
                    className="btn-primary flex-1 !py-2 text-xs font-bold justify-center text-center"
                  >
                    To‘liq testlar →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Live Dictionary Card */}
          <div className="card p-4 space-y-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded-2xl text-xs">
            <div className="flex items-center justify-between">
              <span className="eyebrow text-[10px]">Interaktiv Lug‘at</span>
              {dictLoading && <span className="text-[10px] text-[var(--muted)] animate-pulse">Yuklanmoqda…</span>}
            </div>

            {dictError ? (
              <div className="p-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-800 dark:text-amber-300 text-[11px]">
                Lug‘at ta’rifini yuklab bo‘lmadi. Internet aloqasini tekshiring yoki boshqa so‘zni bosing.
              </div>
            ) : dictData ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-sm text-[var(--foreground)]">{dictData.word}</span>
                    {dictData.phonetic && (
                      <span className="text-[11px] text-[var(--muted)] ml-2">{dictData.phonetic}</span>
                    )}
                    {dictData.partOfSpeech && (
                      <span className="text-[10px] font-bold text-[var(--primary)] bg-[var(--nav-active-bg)] px-1.5 py-0.5 rounded ml-2">
                        {dictData.partOfSpeech}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    disabled={savedWord}
                    onClick={handleSaveWord}
                    className="secondary-button !py-1 !px-2.5 text-[11px] font-semibold !min-h-0 cursor-pointer"
                  >
                    {savedWord ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600 mr-1" /> Saqlandi
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="w-3 h-3 mr-1" /> Lug‘atga saqlash
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-[var(--foreground)] leading-relaxed">
                  {dictData.definition}
                </p>
                {dictData.example && (
                  <p className="text-[10px] text-[var(--secondary)] italic border-l-2 border-[var(--primary)]/40 pl-2">
                    “{dictData.example}”
                  </p>
                )}
              </div>
            ) : (
              <p className="text-[11px] text-[var(--muted)]">
                Matndan biror so‘z ustiga bosing va uning ta’rifini o‘rganing.
              </p>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
