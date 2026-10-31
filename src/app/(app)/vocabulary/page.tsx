"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Volume2,
  Sparkles,
  Plus,
  Check,
  RotateCcw,
  BookOpen,
  Calendar,
  X,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import {
  fetchUserVocabulary,
  addWordToVocabulary,
  reviewWordSM2,
  loadSampleVocabulary,
  VocabWord,
  ReviewGrade,
} from "@/lib/services/vocabulary-service";

export default function VocabularyPage() {
  const { user } = useAuth();
  const [words, setWords] = useState<VocabWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New word form state
  const [newWord, setNewWord] = useState("");
  const [newPos, setNewPos] = useState("noun");
  const [newDef, setNewDef] = useState("");
  const [newUz, setNewUz] = useState("");
  const [newEx, setNewEx] = useState("");

  const [clientNow, setClientNow] = useState<number>(0);

  const loadData = async () => {
    setLoading(true);
    setClientNow(Date.now());
    const list = await fetchUserVocabulary(user?.uid);
    setWords(list);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user?.uid]);

  const dueWords = clientNow > 0 ? words.filter((w) => w.dueAt <= clientNow) : words;
  const filteredWords = words.filter(
    (w) =>
      w.word.toLowerCase().includes(search.toLowerCase()) ||
      w.uzbekNote.toLowerCase().includes(search.toLowerCase()) ||
      w.definition.toLowerCase().includes(search.toLowerCase())
  );

  const speakWord = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRating = async (grade: ReviewGrade) => {
    const currentWord = dueWords[reviewIndex];
    if (currentWord) {
      await reviewWordSM2(user?.uid, currentWord.id, grade);
    }

    if (reviewIndex + 1 < dueWords.length) {
      setReviewIndex(reviewIndex + 1);
      setRevealed(false);
    } else {
      setReviewMode(false);
      setReviewIndex(0);
      setRevealed(false);
      loadData();
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newDef.trim()) return;

    await addWordToVocabulary(user?.uid, {
      word: newWord.trim(),
      partOfSpeech: newPos,
      definition: newDef.trim(),
      uzbekNote: newUz.trim(),
      example: newEx.trim(),
      source: "Qo‘lda kiritilgan",
    });

    setNewWord("");
    setNewDef("");
    setNewUz("");
    setNewEx("");
    setAddModalOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="eyebrow">So‘z Boyligi</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
            IELTS Academic Vocabulary
          </h1>
          <p className="text-sm text-[var(--secondary)] mt-0.5">
            Matnlardan saqlangan so‘zlar va Spaced Repetition (intervalli takrorlash) tizimi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddModalOpen(true)}
            className="btn-secondary text-xs sm:text-sm whitespace-nowrap !py-2.5 !px-3.5"
          >
            <Plus className="w-4 h-4 mr-1 text-[var(--primary)]" />
            Yangi so‘z qo‘shish
          </button>

          {dueWords.length > 0 && !reviewMode && (
            <button
              onClick={() => {
                setReviewIndex(0);
                setRevealed(false);
                setReviewMode(true);
              }}
              className="btn-primary whitespace-nowrap shadow-sm text-xs sm:text-sm !py-2.5 !px-4"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Takrorlash ({dueWords.length})
            </button>
          )}
        </div>
      </div>

      {/* Flashcard Review Screen (design.md Section 10) */}
      {reviewMode && dueWords.length > 0 && (
        <div className="card border-2 border-[var(--primary)] p-6 md:p-8 space-y-6 max-w-2xl mx-auto shadow-md">
          <div className="flex items-center justify-between text-xs text-[var(--muted)] font-semibold border-b border-[var(--border)] pb-3">
            <span>
              Kartochka {reviewIndex + 1} / {dueWords.length}
            </span>
            <button
              onClick={() => setReviewMode(false)}
              className="text-[var(--secondary)] hover:text-[var(--primary)] underline cursor-pointer"
            >
              Chiqish
            </button>
          </div>

          <div className="text-center py-6 space-y-3">
            <span className="eyebrow text-xs">{dueWords[reviewIndex].partOfSpeech}</span>
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-3xl md:text-4xl font-black text-[var(--foreground)] tracking-tight">
                {dueWords[reviewIndex].word}
              </h2>
              <button
                onClick={() => speakWord(dueWords[reviewIndex].word)}
                title="Talaffuzni eshitish"
                className="p-1.5 rounded-full hover:bg-[var(--surface-subtle)] text-[var(--primary)] cursor-pointer"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[var(--muted)] italic">
              Manba: &quot;{dueWords[reviewIndex].source}&quot;
            </p>

            {revealed ? (
              <div className="pt-4 space-y-3 text-left bg-[var(--surface-subtle)] p-4 rounded-xl border border-[var(--border)]">
                <div>
                  <p className="text-xs font-semibold text-[var(--muted)]">Ta’rif (EN):</p>
                  <p className="text-sm text-[var(--foreground)] font-medium">
                    {dueWords[reviewIndex].definition}
                  </p>
                </div>
                {dueWords[reviewIndex].uzbekNote && (
                  <div>
                    <p className="text-xs font-semibold text-[var(--muted)]">O‘zbekcha ma’nosi:</p>
                    <p className="text-sm text-[var(--primary)] font-bold">
                      {dueWords[reviewIndex].uzbekNote}
                    </p>
                  </div>
                )}
                {dueWords[reviewIndex].example && (
                  <div>
                    <p className="text-xs font-semibold text-[var(--muted)]">Matndagi kontekst:</p>
                    <p className="text-xs text-[var(--secondary)] italic">
                      &quot;{dueWords[reviewIndex].example}&quot;
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setRevealed(true)}
                className="btn-secondary !py-2.5 !px-6 text-sm cursor-pointer mt-4"
              >
                Javobni ko‘rsatish
              </button>
            )}
          </div>

          {/* Spaced Repetition Buttons: Again, Hard, Good, Easy (design.md Section 10) */}
          {revealed && (
            <div className="pt-2 border-t border-[var(--border)] space-y-2">
              <p className="text-center text-xs text-[var(--muted)]">
                Bu so‘zni qay darajada eslay oldingiz?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleRating("again")}
                  className="py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all text-center cursor-pointer"
                >
                  Again
                  <span className="block text-[10px] font-normal text-rose-500">1 kundan so‘ng</span>
                </button>
                <button
                  onClick={() => handleRating("hard")}
                  className="py-2.5 px-3 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold transition-all text-center cursor-pointer"
                >
                  Hard
                  <span className="block text-[10px] font-normal text-amber-600">Qiyinroq</span>
                </button>
                <button
                  onClick={() => handleRating("good")}
                  className="py-2.5 px-3 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold transition-all text-center cursor-pointer"
                >
                  Good
                  <span className="block text-[10px] font-normal text-blue-600">Yaxshi</span>
                </button>
                <button
                  onClick={() => handleRating("easy")}
                  className="py-2.5 px-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all text-center cursor-pointer"
                >
                  Easy
                  <span className="block text-[10px] font-normal text-emerald-600">Oson</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="So‘z, ma’no yoki ta’rif bo‘yicha qidiring..."
          className="w-full pl-10 pr-4"
        />
      </div>

      {/* Vocabulary List */}
      {loading ? (
        <div className="card p-12 text-center text-sm text-[var(--muted)]">
          Lug‘at ma’lumotlari yuklanmoqda…
        </div>
      ) : filteredWords.length === 0 ? (
        <div className="card p-12 text-center space-y-3">
          <BookOpen className="w-8 h-8 text-[var(--muted)] mx-auto" />
          <h3 className="font-bold text-base text-[var(--foreground)]">
            {words.length === 0 ? "Hozircha saqlangan so‘zlar yo‘q" : "Qidiruv bo‘yicha so‘z topilmadi"}
          </h3>
          <p className="text-xs text-[var(--muted)] max-w-md mx-auto">
            {words.length === 0
              ? "Reading matnlaridan so‘zlarni tanlab saqlang, yuqoridagi tugma orqali yangi so‘z kiriting yoki namuna kartochkalarini yuklang."
              : "Qidiruv so‘zini o‘zgartiring yoki filtrni tozalang."}
          </p>
          {words.length === 0 && (
            <button
              onClick={async () => {
                await loadSampleVocabulary(user?.uid);
                loadData();
              }}
              className="btn-secondary !py-2 !px-4 text-xs font-semibold mx-auto inline-flex items-center gap-1.5 cursor-pointer mt-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
              Namuna kartochkalarini yuklash
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWords.map((word) => {
            const isDue = clientNow > 0 ? word.dueAt <= clientNow : false;
            return (
              <div
                key={word.id}
                className="card p-5 space-y-3 flex flex-col justify-between hover:border-[var(--primary)] transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-[var(--foreground)]">{word.word}</h3>
                      <button
                        onClick={() => speakWord(word.word)}
                        title="Eshitish"
                        className="p-1 rounded-md hover:bg-[var(--surface-subtle)] text-[var(--primary)] cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <span className="px-2 py-0.5 rounded-md bg-[var(--surface-subtle)] text-[var(--muted)] text-xs border border-[var(--border)]">
                        {word.partOfSpeech}
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isDue
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-[var(--surface-subtle)] text-[var(--muted)]"
                      }`}
                    >
                      {isDue ? "Bugun navbatda" : `Har ${word.intervalDays} kunda`}
                    </span>
                  </div>

                  <p className="text-sm text-[var(--secondary)] leading-relaxed">
                    {word.definition}
                  </p>

                  {word.uzbekNote && (
                    <div className="p-2.5 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)] text-xs text-[var(--foreground)]">
                      <span className="font-bold text-[var(--primary)] mr-1">UZ:</span>
                      {word.uzbekNote}
                    </div>
                  )}

                  {word.example && (
                    <p className="text-xs text-[var(--muted)] italic">&quot;{word.example}&quot;</p>
                  )}
                </div>

                <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted)]">
                  <span>Manba: {word.source}</span>
                  <span>Takrorlashlar: {word.repetition}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Word Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="card p-6 space-y-4 w-full max-w-md shadow-2xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h2 className="text-lg font-bold text-[var(--foreground)]">Yangi so‘z qo‘shish</h2>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[var(--surface-subtle)] text-[var(--muted)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <label>
                So‘z (English) *
                <input
                  type="text"
                  required
                  placeholder="masalan, Substantial"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  className="w-full mt-1"
                />
              </label>

              <label>
                So‘z turkumi (Part of Speech)
                <select
                  value={newPos}
                  onChange={(e) => setNewPos(e.target.value)}
                  className="w-full mt-1"
                >
                  <option value="noun">Noun (Ot)</option>
                  <option value="verb">Verb (Fe’l)</option>
                  <option value="adjective">Adjective (Sifat)</option>
                  <option value="adverb">Adverb (Ravish)</option>
                </select>
              </label>

              <label>
                Inglizcha ta’rifi (Definition) *
                <textarea
                  required
                  rows={2}
                  placeholder="Of considerable importance, size, or worth."
                  value={newDef}
                  onChange={(e) => setNewDef(e.target.value)}
                  className="w-full mt-1 resize-y"
                />
              </label>

              <label>
                O‘zbekcha tarjimasi / izohi
                <input
                  type="text"
                  placeholder="Sezilarli, salmoqli, katta"
                  value={newUz}
                  onChange={(e) => setNewUz(e.target.value)}
                  className="w-full mt-1"
                />
              </label>

              <label>
                Misol jumla (Context)
                <input
                  type="text"
                  placeholder="A substantial amount of research was conducted."
                  value={newEx}
                  onChange={(e) => setNewEx(e.target.value)}
                  className="w-full mt-1"
                />
              </label>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="btn-secondary text-sm !py-2 !px-4"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="btn-primary text-sm !py-2 !px-5"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
