import type {
  QuestionnaireData,
  DayStudyPlan,
  PlannedDailyTask,
  WeekDaySummary,
  WeekdayOption,
  FullStudySchedule,
} from "../types/study-plan";
import { DEFAULT_QUESTIONNAIRE_PLAN } from "../types/study-plan";

export interface LearningStateContext {
  unfinishedAttempt?: {
    id: string;
    title: string;
    skill: string;
    link: string;
  } | null;
  dueVocabCount: number;
  pendingMistakesCount: number;
  attemptsCount: number;
  hasDiagnosticResult?: boolean;
}

const WEEKDAY_KEYS: WeekdayOption[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const WEEKDAY_NAMES_UZ: Record<WeekdayOption, string> = {
  mon: "Dushanba",
  tue: "Seshanba",
  wed: "Chorshanba",
  thu: "Payshanba",
  fri: "Juma",
  sat: "Shanba",
  sun: "Yakshanba",
};

const WEEKDAY_NAMES_EN: Record<WeekdayOption, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

/**
 * Returns the weekday key for a given Date or YYYY-MM-DD string
 */
export function getWeekdayFromDate(dateInput: Date | string): WeekdayOption {
  const d = typeof dateInput === "string" ? new Date(`${dateInput}T12:00:00`) : dateInput;
  const dayIndex = d.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  const map: WeekdayOption[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return map[dayIndex];
}

/**
 * Formats a Date object to YYYY-MM-DD
 */
export function formatDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Finds the next scheduled study date starting from tomorrow
 */
export function getNextStudyDate(currentDate: Date, studyDays: WeekdayOption[]): { dateKey: string; dayNameUz: string } {
  for (let i = 1; i <= 7; i++) {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + i);
    const dayKey = getWeekdayFromDate(next);
    if (studyDays.includes(dayKey)) {
      return {
        dateKey: formatDateKey(next),
        dayNameUz: WEEKDAY_NAMES_UZ[dayKey],
      };
    }
  }
  return {
    dateKey: formatDateKey(currentDate),
    dayNameUz: "Belgilanmagan",
  };
}

/**
 * Generates an explainable reason for the plan
 */
function buildExplanation(
  plan: QuestionnaireData,
  isRestDay: boolean,
  state: LearningStateContext
): string {
  if (isRestDay) {
    return "Bugun siz tanlagan o‘quv jadvali bo‘yicha dam olish kuni. O‘zlashtirgan bilimlarni miyada mustahkamlash uchun dam olish muhimdir. Agar xohlasangiz, ixtiyoriy yengil mashq bajarishingiz mumkin.";
  }

  const weakSkillsList = plan.perceivedWeakSkills.filter((s) => s !== "not_sure");
  const weakSkillsStr =
    weakSkillsList.length > 0
      ? weakSkillsList.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")
      : "barcha 4 ta modul";

  const parts: string[] = [];
  parts.push(`Kunlik ${plan.dailyStudyMinutes} daqiqalik vaqt byudjetingiz hisobga olindi.`);

  if (state.dueVocabCount > 0 && plan.supportingActivities.includes("vocabulary")) {
    parts.push(`Bugun takrorlash navbatida ${state.dueVocabCount} ta faol so‘z borligi uchun lug‘at bloki kiritildi.`);
  }

  if (state.pendingMistakesCount > 0 && plan.supportingActivities.includes("mistakes")) {
    parts.push(`Xatolar daftarida ${state.pendingMistakesCount} ta tahlil talab savol mavjud.`);
  }

  if (plan.currentLevelSource === "unknown" && !state.hasDiagnosticResult && state.attemptsCount === 0) {
    parts.push("Boshlang‘ich darajangizni aniqlash uchun dastlab qisqa 15 daqiqalik diagnostika tavsiya etiladi.");
  } else {
    parts.push(`Asosiy e’tibor qiyin deb belgilangan yo‘nalishlarga (${weakSkillsStr}) qaratildi.`);
  }

  return parts.join(" ");
}

/**
 * Deterministic study task generator
 */
export function generateDayPlan(
  plan: QuestionnaireData = DEFAULT_QUESTIONNAIRE_PLAN,
  state: LearningStateContext,
  targetDate: Date = new Date()
): DayStudyPlan {
  const dateKey = formatDateKey(targetDate);
  const currentWeekday = getWeekdayFromDate(targetDate);
  const isStudyDay = plan.studyDays.includes(currentWeekday);

  // If today is a rest day
  if (!isStudyDay) {
    const nextStudy = getNextStudyDate(targetDate, plan.studyDays);
    return {
      dateKey,
      isRestDay: true,
      tasks: [],
      completedMinutes: 0,
      totalMinutes: 0,
      nextScheduledDateKey: nextStudy.dateKey,
      explanation: `Bugun dam olish kuni. Navbatdagi rejalashtirilgan mashg‘ulot kuni: ${nextStudy.dayNameUz} (${nextStudy.dateKey}). Dam olish kuni uchun yuklama berilmaydi.`,
    };
  }

  const budget = plan.dailyStudyMinutes;
  const tasks: PlannedDailyTask[] = [];
  let allocatedMinutes = 0;

  // 1. Check for unfinished attempt
  if (state.unfinishedAttempt && allocatedMinutes < budget) {
    const taskMinutes = Math.min(15, budget - allocatedMinutes);
    tasks.push({
      id: `task_${dateKey}_unfinished`,
      title: `Chala qolgan testni yakunlash: ${state.unfinishedAttempt.title}`,
      duration: taskMinutes,
      category: (state.unfinishedAttempt.skill.toLowerCase() as any) || "reading",
      link: state.unfinishedAttempt.link,
      description: "Oldin boshlangan amaliyotni to‘liq topshirib, natija va tahlilni oling.",
      reason: "Boshlangan testni chala qoldirmaslik xatolarni o‘z vaqtida aniqlashga yordam beradi.",
      completionCondition: "Testni submit qilib natijani ko‘rish",
      completed: false,
      sessionIndex: 1,
      policyVersion: 1,
    });
    allocatedMinutes += taskMinutes;
  }

  // 2. Check for unknown level / initial diagnostic
  const needsDiagnostic =
    plan.currentLevelSource === "unknown" &&
    !state.hasDiagnosticResult &&
    state.attemptsCount === 0 &&
    !tasks.some((t) => t.category === "diagnostic");

  if (needsDiagnostic && allocatedMinutes < budget) {
    const diagMinutes = Math.min(15, budget - allocatedMinutes);
    tasks.push({
      id: `task_${dateKey}_diagnostic`,
      title: "IELTS Diagnostic Test: Boshlang‘ich darajani aniqlash",
      duration: diagMinutes,
      category: "diagnostic",
      link: "/diagnostic",
      description: "15 daqiqalik mini-test: kuchli va zaif ko‘nikmalaringizni aniqlash.",
      reason: "Darajangiz aniqlanmagan. To‘g‘ri individual yuklama belgilash uchun diagnostika zarur.",
      completionCondition: "Diagnostik testni to‘liq yakunlash",
      completed: false,
      sessionIndex: tasks.length + 1,
      policyVersion: 1,
    });
    allocatedMinutes += diagMinutes;
  }

  // 3. Due Spaced Repetition Vocabulary (only if real due words exist)
  if (
    state.dueVocabCount > 0 &&
    plan.supportingActivities.includes("vocabulary") &&
    budget - allocatedMinutes >= 5
  ) {
    const vocabMinutes = Math.min(10, Math.max(5, budget - allocatedMinutes >= 15 ? 10 : 5));
    tasks.push({
      id: `task_${dateKey}_vocab`,
      title: `${Math.min(state.dueVocabCount, 15)} ta faol so‘zni takrorlash (Spaced Repetition)`,
      duration: vocabMinutes,
      category: "vocabulary",
      link: "/vocabulary",
      description: "Interval takrorlash algoritmi bo‘yicha eslab qolish darajasini oshirish.",
      reason: "So‘zlarni o‘z vaqtida takrorlash uzoq muddatli xotiraga o‘tishini ta'minlaydi.",
      completionCondition: "Navbatdagi lug‘at kartochkalarini yakunlash",
      completed: false,
      sessionIndex: tasks.length + 1,
      policyVersion: 1,
    });
    allocatedMinutes += vocabMinutes;
  }

  // 4. Pending Mistakes Review (only if real pending mistakes exist)
  if (
    state.pendingMistakesCount > 0 &&
    plan.supportingActivities.includes("mistakes") &&
    budget - allocatedMinutes >= 5
  ) {
    const mistakeMinutes = Math.min(10, Math.max(5, budget - allocatedMinutes >= 15 ? 10 : 5));
    tasks.push({
      id: `task_${dateKey}_mistakes`,
      title: `Xatolar daftaridagi ${Math.min(state.pendingMistakesCount, 5)} ta savolni qayta ishlash`,
      duration: mistakeMinutes,
      category: "mistakes",
      link: "/mistakes",
      description: "Oldingi testlarda xato qilingan savollar izohlarini tahlil qilish.",
      reason: "Xatoni qayta tahlil qilish xuddi shu turdagi savolda yana xato qilishning oldini oladi.",
      completionCondition: "Xatolarni ko‘rib chiqib tahlilni belgilash",
      completed: false,
      sessionIndex: tasks.length + 1,
      policyVersion: 1,
    });
    allocatedMinutes += mistakeMinutes;
  }

  // 5. Core Skill Practice: Reading, Listening, Writing, Speaking
  // Select primary skill based on weakSkills and day rotation
  const weakSkills = plan.perceivedWeakSkills.filter((s) => s !== "not_sure") as Array<"reading" | "listening" | "writing" | "speaking">;
  const candidateSkills: Array<"reading" | "listening" | "writing" | "speaking"> =
    weakSkills.length > 0 ? weakSkills : ["reading", "listening", "writing", "speaking"];

  // Rotate based on day of month to avoid monotonous repetitive assignments
  const dayNum = targetDate.getDate();
  const primarySkill = candidateSkills[dayNum % candidateSkills.length];

  while (allocatedMinutes < budget) {
    const remaining = budget - allocatedMinutes;

    if (primarySkill === "reading" || (tasks.length === 0 && remaining <= 20)) {
      const duration = Math.min(remaining, 20);
      tasks.push({
        id: `task_${dateKey}_reading_${tasks.length + 1}`,
        title: duration <= 10 ? "Reading Micro-drill: Sentence & Heading Match" : "Reading Drill: Urban Gardens Academic Text",
        duration,
        category: "reading",
        link: "/reading/urban-gardens-drill",
        description: "Matnni skanerlash va True/False/Not Given savollari amaliyoti.",
        reason: "O‘qish tezligi va kalit so‘zlarni topish qobiliyatini mustahkamlaydi.",
        completionCondition: "Mashq savollariga javob berib tekshirish",
        completed: false,
        sessionIndex: tasks.length + 1,
        policyVersion: 1,
      });
      allocatedMinutes += duration;
    } else if (primarySkill === "listening") {
      const duration = Math.min(remaining, 20);
      tasks.push({
        id: `task_${dateKey}_listening_${tasks.length + 1}`,
        title: "Listening Section 1: Note & Form Completion",
        duration,
        category: "listening",
        link: "/listening/listening-test-1",
        description: "Audio yozuvni tinglab, jadval va bo‘sh o‘rinlarni to‘ldirish.",
        reason: "Diqqatni jamlash va audio kalit so‘zlarni ilg‘ash ko‘nikmasini oshiradi.",
        completionCondition: "Audio qismni tinglab savollarni topshirish",
        completed: false,
        sessionIndex: tasks.length + 1,
        policyVersion: 1,
      });
      allocatedMinutes += duration;
    } else if (primarySkill === "writing") {
      const duration = Math.min(remaining, 30);
      tasks.push({
        id: `task_${dateKey}_writing_${tasks.length + 1}`,
        title: duration <= 15 ? "Writing Task 1: Overview & Trend Drill" : "Writing Task 2: Opinion Essay Planning",
        duration,
        category: "writing",
        link: "/writing",
        description: "Kirish va asosiy xulosa qismini rejalashtirish hamda yozish.",
        reason: "Fikrni mantiqiy bog‘lovchilar yordamida akademik bayon etishni rivojlantiradi.",
        completionCondition: "Matn qoralamasini saqlash yoki topshirish",
        completed: false,
        sessionIndex: tasks.length + 1,
        policyVersion: 1,
      });
      allocatedMinutes += duration;
    } else {
      // speaking
      const duration = Math.min(remaining, 15);
      tasks.push({
        id: `task_${dateKey}_speaking_${tasks.length + 1}`,
        title: "Speaking Part 1: Fluent Responses & Useful Chunks",
        duration,
        category: "speaking",
        link: "/speaking",
        description: "Berilgan mavzuda audio yozib, ravonlik va talaffuzni sinash.",
        reason: "Og‘zaki nutqda pauzalarsiz javob berish ishonchini oshiradi.",
        completionCondition: "Kamida bitta javobni audio yozib saqlash",
        completed: false,
        sessionIndex: tasks.length + 1,
        policyVersion: 1,
      });
      allocatedMinutes += duration;
    }
  }

  // Adjust session index numbering based on user's session preference
  if (plan.sessionPreference === "single") {
    tasks.forEach((t) => (t.sessionIndex = 1));
  } else if (plan.sessionPreference === "two_sessions") {
    const half = Math.ceil(tasks.length / 2);
    tasks.forEach((t, i) => {
      t.sessionIndex = i < half ? 1 : 2;
    });
  } else {
    // multiple_short
    tasks.forEach((t, i) => {
      t.sessionIndex = i + 1;
    });
  }

  const totalCalculatedMinutes = tasks.reduce((sum, t) => sum + t.duration, 0);

  return {
    dateKey,
    isRestDay: false,
    tasks,
    completedMinutes: 0,
    totalMinutes: totalCalculatedMinutes,
    explanation: buildExplanation(plan, false, state),
  };
}

/**
 * Builds the 7-day schedule summary (e.g. for calendar preview)
 */
export function generateWeekSummary(
  plan: QuestionnaireData = DEFAULT_QUESTIONNAIRE_PLAN,
  startDate: Date = new Date()
): WeekDaySummary[] {
  const result: WeekDaySummary[] = [];

  // Find Monday of the current week
  const currentDayOfWeek = startDate.getDay(); // 0 is Sunday, 1 is Mon
  const diffToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const monday = new Date(startDate);
  monday.setDate(startDate.getDate() + diffToMonday);

  for (let i = 0; i < 7; i++) {
    const cur = new Date(monday);
    cur.setDate(monday.getDate() + i);
    const dayKey = getWeekdayFromDate(cur);
    const dateKey = formatDateKey(cur);
    const isStudyDay = plan.studyDays.includes(dayKey);
    const isToday = dateKey === formatDateKey(startDate);

    // Primary focus title for day
    let primaryFocus = "Dam olish kuni";
    if (isStudyDay) {
      const skills = ["Reading & Vocab", "Listening & Notes", "Writing Structure", "Speaking Fluency", "Mistakes & Review"];
      primaryFocus = skills[i % skills.length];
    }

    result.push({
      dayKey,
      dayLabelUz: WEEKDAY_NAMES_UZ[dayKey],
      dayLabelEn: WEEKDAY_NAMES_EN[dayKey],
      dateKey,
      isStudyDay,
      isToday,
      plannedMinutes: isStudyDay ? plan.dailyStudyMinutes : 0,
      primaryFocus,
    });
  }

  return result;
}

/**
 * Builds the complete schedule payload for preview and dashboard
 */
export function buildFullSchedule(
  plan: QuestionnaireData = DEFAULT_QUESTIONNAIRE_PLAN,
  state: LearningStateContext,
  currentDate: Date = new Date()
): FullStudySchedule {
  const todayPlan = generateDayPlan(plan, state, currentDate);
  const weekDays = generateWeekSummary(plan, currentDate);

  return {
    today: todayPlan,
    weekDays,
    summary: {
      targetBand: plan.targetBand,
      dailyMinutes: plan.dailyStudyMinutes,
      activeDaysCount: plan.studyDays.length,
      sessionType: plan.sessionPreference,
      weakSkills: plan.perceivedWeakSkills,
      supportingActivities: plan.supportingActivities,
      isDefaultPlan: Boolean(plan.isDefaultPlan),
    },
  };
}
