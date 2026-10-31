import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export interface DiagnosticQuestion {
  id: string;
  skill: "reading" | "listening" | "writing" | "speaking";
  questionType: string;
  passageOrPrompt: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

export interface LearningPathItem {
  id: string;
  skill: "reading" | "listening" | "writing" | "speaking" | "vocabulary";
  title: string;
  topic: string;
  estimatedMinutes: number;
  reason: string;
  actionHref: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  skipped: boolean;
}

export interface DiagnosticResult {
  takenAt: number;
  estimatedBand: number;
  targetBand: number;
  dailyMinutes: number;
  examWeeksAway: number;
  skillScores: {
    reading: number; // percentage
    listening: number;
    writing: number;
    speaking: number;
  };
  weaknesses: {
    skill: string;
    questionType: string;
    explanation: string;
  }[];
  learningPath: LearningPathItem[];
}

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  // 1. Reading - Matching Headings
  {
    id: "diag-r1",
    skill: "reading",
    questionType: "Matching Headings",
    passageOrPrompt:
      "Passage excerpt: 'Urban vertical farms utilize stacked indoor growing trays under artificial LED illumination. By controlling temperature, humidity, and nutrient delivery through closed-loop hydroponics, crop yields per square meter are reported to increase up to twenty-fold compared to traditional arable fields, regardless of seasonal weather disruptions.'",
    question: "Which heading best summarizes the core theme of this passage excerpt?",
    options: [
      { id: "A", text: "The environmental hazards of excessive LED illumination" },
      { id: "B", text: "Technological mechanisms and high yield benefits of vertical farming" },
      { id: "C", text: "Comparing the construction costs of traditional greenhouses" },
      { id: "D", text: "Seasonal agricultural workforce migration patterns" },
    ],
    correctAnswer: "B",
    explanation:
      "Matn vertikal fermalarning yopiq tizimi va sun'iy sharoitda an'anaviy dalalarga nisbatan 20 barobargacha yuqori hosil berishini (mechanisms and yield benefits) yoritadi.",
  },
  // 2. Reading - True / False / Not Given
  {
    id: "diag-r2",
    skill: "reading",
    questionType: "True / False / Not Given",
    passageOrPrompt:
      "Passage excerpt: 'While early electric vehicles struggled with limited battery capacity, modern solid-state innovations have significantly reduced recharge durations. However, the international supply chain for lithium remains concentrated in a handful of developing nations, causing unpredictable raw material price surges.'",
    question:
      "Statement: 'The price fluctuations of electric vehicle batteries are primarily influenced by international transportation tariffs.'",
    options: [
      { id: "TRUE", text: "TRUE (To‘g‘ri)" },
      { id: "FALSE", text: "FALSE (Noto‘g‘ri)" },
      { id: "NOT_GIVEN", text: "NOT GIVEN (Matnda berilmagan)" },
    ],
    correctAnswer: "NOT GIVEN",
    explanation:
      "Matnda narx tebranishlari xomashyo (litiy) yetkazib berish zanjirining kam sonli davlatlarda jamlanganligi bilan izohlangan, ammo 'transportation tariffs' (transport bojlari) haqida hech narsa aytilmagan.",
  },
  // 3. Listening - Numerical / Note Completion
  {
    id: "diag-l1",
    skill: "listening",
    questionType: "Note Completion",
    passageOrPrompt:
      "Audio Transcript: 'Officer: Good morning, Campus Housing. How can I help? Student: Hi, I am calling to inquire about the postgraduate studio flats on West Avenue. Officer: Certainly. Standard single studio rent is 680 pounds per calendar month, which includes water and broadband, though electricity requires a prepaid meter.'",
    question: "What is the monthly rental fee for the postgraduate single studio?",
    options: [
      { id: "A", text: "£580 per month" },
      { id: "B", text: "£680 per month" },
      { id: "C", text: "£780 per month" },
      { id: "D", text: "£600 per month" },
    ],
    correctAnswer: "B",
    explanation:
      "Audio suhbatda xodim aniq aytadi: 'Standard single studio rent is 680 pounds per calendar month'.",
  },
  // 4. Listening - Multiple Choice (Distractor Identification)
  {
    id: "diag-l2",
    skill: "listening",
    questionType: "Multiple Choice",
    passageOrPrompt:
      "Audio Transcript: 'Tutor: For the seminar next Tuesday, don't worry about reading the entire 40-page report. Chapter 3 on methodology was originally scheduled, but we have postponed that. Please focus exclusively on Chapter 5's case study.'",
    question: "Which chapter must the students read for Tuesday's seminar?",
    options: [
      { id: "A", text: "The entire 40-page report" },
      { id: "B", text: "Chapter 3 on methodology" },
      { id: "C", text: "Chapter 5's case study" },
      { id: "D", text: "None, it was cancelled" },
    ],
    correctAnswer: "C",
    explanation:
      "O'qituvchi 3-bob qoldirilganini ('postponed that') aytadi va faqat 5-bobdagi keys-stadiga diqqat qaratishni ('focus exclusively on Chapter 5') buyuradi.",
  },
  // 5. Writing - Academic Cohesion & Error Identification
  {
    id: "diag-w1",
    skill: "writing",
    questionType: "Cohesion & Accuracy",
    passageOrPrompt:
      "Sample sentence from Task 2 essay: 'On the other hand, rapid industrial expansion brings economic prosperity; ____, it inevitably precipitates severe environmental degradation unless strictly regulated.'",
    question: "Which academic cohesive device most accurately contrasts these two clauses?",
    options: [
      { id: "A", text: "furthermore" },
      { id: "B", text: "nonetheless" },
      { id: "C", text: "as a consequence" },
      { id: "D", text: "for instance" },
    ],
    correctAnswer: "B",
    explanation:
      "'Nonetheless' (shunga qaramay) iqtisodiy foyda va ekologik zarar o'rtasidagi kontrasni akademik tarzda bog'laydi.",
  },
  // 6. Speaking & Vocabulary - Collocation & Fluency
  {
    id: "diag-s1",
    skill: "speaking",
    questionType: "Lexical Collocations",
    passageOrPrompt:
      "IELTS Speaking Part 3 prompt on Technology: 'Do you believe automated machines will make human jobs obsolete?'",
    question: "Which idiomatic/collocational phrase represents IELTS Band 7.5+ Lexical Resource?",
    options: [
      { id: "A", text: "They will make very big problems for people." },
      { id: "B", text: "They pose a substantial threat to routine occupations, yet foster novel creative niches." },
      { id: "C", text: "People will not have jobs and get sad." },
      { id: "D", text: "It is good because robots are very fast and smart." },
    ],
    correctAnswer: "B",
    explanation:
      "'Pose a substantial threat', 'routine occupations', va 'foster novel creative niches' yuqori darajadagi akademik leksikani namoyon etadi.",
  },
];

const LOCAL_STORAGE_DIAGNOSTIC_KEY = "ielts_user_diagnostic_data";

export async function getSavedDiagnostic(uid?: string): Promise<DiagnosticResult | null> {
  if (uid) {
    try {
      const snap = await getDoc(doc(db, "users", uid, "private", "diagnostic"));
      if (snap.exists()) {
        return snap.data() as DiagnosticResult;
      }
    } catch {
      // fallback to localStorage
    }
  }

  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_DIAGNOSTIC_KEY);
      if (local) return JSON.parse(local);
    } catch {
      // ignore
    }
  }
  return null;
}

export async function saveDiagnosticResult(
  uid: string | undefined,
  answers: Record<string, string>,
  targetBand = 7.0,
  dailyMinutes = 30,
  examWeeksAway = 8
): Promise<DiagnosticResult> {
  let readingCorrect = 0;
  let listeningCorrect = 0;
  let writingCorrect = 0;
  let speakingCorrect = 0;
  const weaknesses: DiagnosticResult["weaknesses"] = [];

  for (const q of DIAGNOSTIC_QUESTIONS) {
    const userAns = answers[q.id];
    const isCorrect = userAns === q.correctAnswer;
    if (q.skill === "reading") {
      if (isCorrect) readingCorrect++;
      else {
        weaknesses.push({
          skill: "Reading",
          questionType: q.questionType,
          explanation: `Siz ${q.questionType} savolida noaniqlikka yo‘l qo‘ydingiz. Matn detallarini farqlash ustida ishlash tavsiya etiladi.`,
        });
      }
    } else if (q.skill === "listening") {
      if (isCorrect) listeningCorrect++;
      else {
        weaknesses.push({
          skill: "Listening",
          questionType: q.questionType,
          explanation: `Siz ${q.questionType} turida chalg‘ituvchi (distractor) ma'lumotni to‘g‘ri javob deb o‘yladingiz.`,
        });
      }
    } else if (q.skill === "writing") {
      if (isCorrect) writingCorrect++;
      else {
        weaknesses.push({
          skill: "Writing",
          questionType: q.questionType,
          explanation: "Akademik bog‘lovchilar va Coherence mezonida xatolik aniqlandi.",
        });
      }
    } else if (q.skill === "speaking") {
      if (isCorrect) speakingCorrect++;
      else {
        weaknesses.push({
          skill: "Speaking",
          questionType: q.questionType,
          explanation: "Band 7.0+ kollokatsiyalar va leksikani kengaytirish talab etiladi.",
        });
      }
    }
  }

  const readingPct = Math.round((readingCorrect / 2) * 100);
  const listeningPct = Math.round((listeningCorrect / 2) * 100);
  const writingPct = Math.round((writingCorrect / 1) * 100);
  const speakingPct = Math.round((speakingCorrect / 1) * 100);

  const totalCorrect = readingCorrect + listeningCorrect + writingCorrect + speakingCorrect;
  // Estimated band: baseline 5.0 + fraction of 3.5
  const estimatedBand = Number((5.0 + (totalCorrect / DIAGNOSTIC_QUESTIONS.length) * 3.0).toFixed(1));

  // Build Personalized Learning Path with Plain Reasons (Section 7 requirement)
  const learningPath: LearningPathItem[] = [
    {
      id: "lp-1",
      skill: "reading",
      title: "Matching Headings & Main Ideas Drill",
      topic: "Academic Science & Tech",
      estimatedMinutes: 15,
      reason:
        readingPct < 100
          ? "Diagnostikada sarlavhalarni moslashtirishda xatolik bo‘ldi. Qisqa parcha bilan mavzu fikrini ajratishni mashq qiling."
          : "Siz bu turda to‘g‘ri bajardingiz. Band 8+ tezlikni saqlab qolish uchun 1 ta mashq bajaring.",
      actionHref: "/reading/reading-academic-01",
      priority: readingPct < 100 ? "high" : "medium",
      completed: false,
      skipped: false,
    },
    {
      id: "lp-2",
      skill: "listening",
      title: "Distractor & Number Trap Listening Practice",
      topic: "Campus Life & Housing",
      estimatedMinutes: 20,
      reason:
        listeningPct < 100
          ? "Tinglab tushunishda chalg‘ituvchi raqamlar va sanalarni to‘g‘ri ajratish bo‘yicha mashq tavsiya etildi."
          : "Listening ko‘rsatkichi yaxshi. Yangi akademik ma'ruza orqali eshitish tushunchasini mustahkamlang.",
      actionHref: "/listening",
      priority: listeningPct < 100 ? "high" : "medium",
      completed: false,
      skipped: false,
    },
    {
      id: "lp-3",
      skill: "writing",
      title: "Task 2: Cohesion & Complex Sentences",
      topic: "Technology & Society",
      estimatedMinutes: 30,
      reason:
        "Insholarda 'nonetheless', 'conversely' kabi bog‘lovchilardan to‘g‘ri foydalanib 250 ta so‘zli insho yozish.",
      actionHref: "/writing",
      priority: "high",
      completed: false,
      skipped: false,
    },
    {
      id: "lp-4",
      skill: "vocabulary",
      title: "High-Frequency IELTS Academic Collocations",
      topic: "Environment & Urban Planning",
      estimatedMinutes: 10,
      reason:
        "Lug‘at boyligini Band 7.5 talablariga moslashtirish uchun 10 ta asosiy akademik iborani takrorlash.",
      actionHref: "/vocabulary",
      priority: "medium",
      completed: false,
      skipped: false,
    },
    {
      id: "lp-5",
      skill: "speaking",
      title: "Part 2 Cue Card: Modern Technology",
      topic: "2 daqiqa gapirish va audio yozib olish",
      estimatedMinutes: 15,
      reason:
        "Fikrni to‘xtovsiz bayon qilish va murakkab grammatik tuzilmalarni og‘zaki nutqda ishlatish.",
      actionHref: "/speaking",
      priority: "medium",
      completed: false,
      skipped: false,
    },
  ];

  const result: DiagnosticResult = {
    takenAt: Date.now(),
    estimatedBand,
    targetBand,
    dailyMinutes,
    examWeeksAway,
    skillScores: {
      reading: readingPct,
      listening: listeningPct,
      writing: writingPct,
      speaking: speakingPct,
    },
    weaknesses,
    learningPath,
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_DIAGNOSTIC_KEY, JSON.stringify(result));
    } catch {
      // ignore
    }
  }

  if (uid) {
    try {
      await setDoc(doc(db, "users", uid, "private", "diagnostic"), result, { merge: true });
    } catch {
      // ignore
    }
  }

  return result;
}

export async function updateLearningPathItem(
  uid: string | undefined,
  currentResult: DiagnosticResult,
  itemId: string,
  update: { completed?: boolean; skipped?: boolean }
): Promise<DiagnosticResult> {
  const updatedPath = currentResult.learningPath.map((item) =>
    item.id === itemId ? { ...item, ...update } : item
  );

  const updatedResult: DiagnosticResult = {
    ...currentResult,
    learningPath: updatedPath,
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_DIAGNOSTIC_KEY, JSON.stringify(updatedResult));
    } catch {
      // ignore
    }
  }

  if (uid) {
    try {
      await setDoc(doc(db, "users", uid, "private", "diagnostic"), updatedResult, { merge: true });
    } catch {
      // ignore
    }
  }

  return updatedResult;
}
