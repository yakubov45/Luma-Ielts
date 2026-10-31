export type TargetBandOption = "5.5" | "6.0" | "6.5" | "7.0" | "7.5" | "8.0+" | "not_sure";

export type LevelSourceOption = "official" | "mock" | "estimate" | "unknown";

export type SkillCategory = "reading" | "listening" | "writing" | "speaking";

export type WeakSkillOption = SkillCategory | "not_sure";

export type ExamTimelineOption =
  | "exact"
  | "within_1_month"
  | "2_to_3_months"
  | "3_to_6_months"
  | "not_scheduled";

export type DailyTimeOption = 15 | 30 | 45 | 60 | 90;

export type WeekdayOption = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type SessionPreferenceOption = "single" | "two_sessions" | "multiple_short";

export type SupportingActivityOption =
  | "vocabulary"
  | "mistakes"
  | "speaking"
  | "writing";

export interface CurrentLevelScores {
  overall?: number | null;
  reading?: number | null;
  listening?: number | null;
  writing?: number | null;
  speaking?: number | null;
  testDate?: string | null;
  estimatedBand?: number | null;
}

export interface QuestionnaireData {
  schemaVersion: 1;
  targetBand: TargetBandOption;
  currentLevelSource: LevelSourceOption;
  currentLevelScores: CurrentLevelScores;
  perceivedWeakSkills: WeakSkillOption[];
  examTimelineType: ExamTimelineOption;
  examDate: string | null; // YYYY-MM-DD if exact, else null
  dailyStudyMinutes: DailyTimeOption;
  studyDays: WeekdayOption[];
  sessionPreference: SessionPreferenceOption;
  supportingActivities: SupportingActivityOption[];
  timezone: string;
  completedAt?: number;
  updatedAt?: number;
  isDefaultPlan?: boolean;
}

export type PlannedTaskCategory =
  | "reading"
  | "listening"
  | "writing"
  | "speaking"
  | "vocabulary"
  | "mistakes"
  | "diagnostic";

export interface PlannedDailyTask {
  id: string;
  title: string;
  duration: number; // in minutes
  category: PlannedTaskCategory;
  link: string;
  description: string;
  reason: string;
  completionCondition: string;
  completed: boolean;
  sessionIndex?: number; // 1, 2, or 3 if split
  policyVersion: 1;
}

export interface DayStudyPlan {
  dateKey: string; // YYYY-MM-DD
  isRestDay: boolean;
  tasks: PlannedDailyTask[];
  completedMinutes: number;
  totalMinutes: number;
  explanation: string;
  nextScheduledDateKey?: string;
}

export interface WeekDaySummary {
  dayKey: WeekdayOption;
  dayLabelUz: string;
  dayLabelEn: string;
  dateKey: string; // YYYY-MM-DD
  isStudyDay: boolean;
  isToday: boolean;
  plannedMinutes: number;
  primaryFocus: string;
}

export interface FullStudySchedule {
  today: DayStudyPlan;
  weekDays: WeekDaySummary[];
  summary: {
    targetBand: TargetBandOption;
    dailyMinutes: number;
    activeDaysCount: number;
    sessionType: SessionPreferenceOption;
    weakSkills: WeakSkillOption[];
    supportingActivities: SupportingActivityOption[];
    isDefaultPlan: boolean;
  };
}

// Default fallback plan (if skipped/postponed)
export const DEFAULT_QUESTIONNAIRE_PLAN: QuestionnaireData = {
  schemaVersion: 1,
  targetBand: "6.5",
  currentLevelSource: "unknown",
  currentLevelScores: {},
  perceivedWeakSkills: ["reading", "listening"],
  examTimelineType: "3_to_6_months",
  examDate: null,
  dailyStudyMinutes: 30,
  studyDays: ["mon", "tue", "wed", "thu", "fri"],
  sessionPreference: "single",
  supportingActivities: ["vocabulary", "mistakes"],
  timezone: "Asia/Tashkent",
  isDefaultPlan: true,
};

// Validation helpers
export function isValidHalfBand(val: unknown): boolean {
  if (val === null || val === undefined || val === "") return true;
  const num = Number(val);
  if (isNaN(num)) return false;
  return num >= 0 && num <= 9 && (num * 10) % 5 === 0;
}

export function validateQuestionnaireStep(step: number, data: Partial<QuestionnaireData>): { valid: boolean; error?: string } {
  switch (step) {
    case 1:
      if (!data.targetBand) return { valid: false, error: "Iltimos, maqsadli IELTS balini tanlang." };
      return { valid: true };
    case 2:
      if (!data.currentLevelSource) return { valid: false, error: "Iltimos, joriy darajangiz haqida ma'lumot tanlang." };
      if (data.currentLevelSource === "official" || data.currentLevelSource === "mock") {
        const scores = data.currentLevelScores || {};
        const fields = [scores.overall, scores.reading, scores.listening, scores.writing, scores.speaking];
        for (const f of fields) {
          if (f !== undefined && f !== null && !isValidHalfBand(f)) {
            return { valid: false, error: "Ballar 0 dan 9 gacha 0.5 oraliqda bo'lishi kerak (masalan: 6.0, 6.5)." };
          }
        }
      }
      if (data.currentLevelSource === "estimate") {
        const est = data.currentLevelScores?.estimatedBand;
        if (est !== undefined && est !== null && !isValidHalfBand(est)) {
          return { valid: false, error: "Taxminiy ball 0 dan 9 gacha 0.5 oraliqda bo'lishi kerak." };
        }
      }
      return { valid: true };
    case 3:
      if (!data.perceivedWeakSkills || data.perceivedWeakSkills.length === 0) {
        return { valid: false, error: "Kamida bitta ko'nikmani tanlang yoki 'Hozircha aniq emas'ni belgilang." };
      }
      return { valid: true };
    case 4:
      if (!data.examTimelineType) {
        return { valid: false, error: "Iltimos, imtihon muddatini tanlang." };
      }
      if (data.examTimelineType === "exact") {
        if (!data.examDate) {
          return { valid: false, error: "Iltimos, aniq imtihon sanasini kiriting." };
        }
        const todayStr = new Date().toISOString().split("T")[0];
        if (data.examDate < todayStr) {
          return { valid: false, error: "Imtihon sanasi o'tib ketgan sana bo'lishi mumkin emas." };
        }
      }
      return { valid: true };
    case 5:
      if (!data.dailyStudyMinutes) {
        return { valid: false, error: "Iltimos, kunlik o'quv vaqtini tanlang." };
      }
      return { valid: true };
    case 6:
      if (!data.studyDays || data.studyDays.length === 0) {
        return { valid: false, error: "Kamida 1 ta o'quv kunini tanlashingiz kerak." };
      }
      return { valid: true };
    case 7:
      if (!data.sessionPreference) {
        return { valid: false, error: "Iltimos, dars taqsimotini tanlang." };
      }
      return { valid: true };
    case 8:
      // Supporting activities can be empty or have selections
      return { valid: true };
    default:
      return { valid: true };
  }
}
