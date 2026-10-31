import assert from "node:assert/strict";
import test from "node:test";

// ==========================================
// STUDY PLAN QUESTIONNAIRE & PLANNING ENGINE
// ==========================================

const DEFAULT_QUESTIONNAIRE_PLAN = {
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

function isValidHalfBand(val) {
  if (val === null || val === undefined || val === "") return true;
  const num = Number(val);
  if (isNaN(num)) return false;
  return num >= 0 && num <= 9 && (num * 10) % 5 === 0;
}

function validateQuestionnaireStep(step, data) {
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
      return { valid: true };
    default:
      return { valid: true };
  }
}

function getWeekdayFromDate(dateInput) {
  const d = typeof dateInput === "string" ? new Date(`${dateInput}T12:00:00`) : dateInput;
  const dayIndex = d.getDay();
  const map = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return map[dayIndex];
}

function formatDateKey(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getNextStudyDate(currentDate, studyDays) {
  const WEEKDAY_NAMES_UZ = {
    mon: "Dushanba",
    tue: "Seshanba",
    wed: "Chorshanba",
    thu: "Payshanba",
    fri: "Juma",
    sat: "Shanba",
    sun: "Yakshanba",
  };
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
  return { dateKey: formatDateKey(currentDate), dayNameUz: "Belgilanmagan" };
}

function generateDayPlan(plan = DEFAULT_QUESTIONNAIRE_PLAN, state, targetDate = new Date()) {
  const dateKey = formatDateKey(targetDate);
  const currentWeekday = getWeekdayFromDate(targetDate);
  const isStudyDay = plan.studyDays.includes(currentWeekday);

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
  const tasks = [];
  let allocatedMinutes = 0;

  if (state.unfinishedAttempt && allocatedMinutes < budget) {
    const taskMinutes = Math.min(15, budget - allocatedMinutes);
    tasks.push({
      id: `task_${dateKey}_unfinished`,
      title: `Chala qolgan testni yakunlash: ${state.unfinishedAttempt.title}`,
      duration: taskMinutes,
      category: state.unfinishedAttempt.skill || "reading",
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

  const weakSkills = plan.perceivedWeakSkills.filter((s) => s !== "not_sure");
  const candidateSkills = weakSkills.length > 0 ? weakSkills : ["reading", "listening", "writing", "speaking"];
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
    } else {
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
    }
  }

  if (plan.sessionPreference === "single") {
    tasks.forEach((t) => (t.sessionIndex = 1));
  } else if (plan.sessionPreference === "two_sessions") {
    const half = Math.ceil(tasks.length / 2);
    tasks.forEach((t, i) => {
      t.sessionIndex = i < half ? 1 : 2;
    });
  } else {
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
    explanation: "Kunlik reja hisoblandi.",
  };
}

function generateWeekSummary(plan = DEFAULT_QUESTIONNAIRE_PLAN, startDate = new Date()) {
  const WEEKDAY_NAMES_UZ = {
    mon: "Dushanba",
    tue: "Seshanba",
    wed: "Chorshanba",
    thu: "Payshanba",
    fri: "Juma",
    sat: "Shanba",
    sun: "Yakshanba",
  };
  const result = [];
  const currentDayOfWeek = startDate.getDay();
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

    result.push({
      dayKey,
      dayLabelUz: WEEKDAY_NAMES_UZ[dayKey],
      dateKey,
      isStudyDay,
      isToday,
      plannedMinutes: isStudyDay ? plan.dailyStudyMinutes : 0,
    });
  }
  return result;
}

// ==========================================
// TEST SUITE
// ==========================================

test("Questionnaire Validation: Step 1 (Target Band)", () => {
  assert.equal(validateQuestionnaireStep(1, {}).valid, false);
  assert.equal(validateQuestionnaireStep(1, { targetBand: "7.0" }).valid, true);
  assert.equal(validateQuestionnaireStep(1, { targetBand: "8.0+" }).valid, true);
  assert.equal(validateQuestionnaireStep(1, { targetBand: "not_sure" }).valid, true);
});

test("Questionnaire Validation: Step 2 (Current Level & Half-band increment)", () => {
  assert.equal(validateQuestionnaireStep(2, {}).valid, false);
  assert.equal(validateQuestionnaireStep(2, { currentLevelSource: "unknown" }).valid, true);

  assert.equal(
    validateQuestionnaireStep(2, {
      currentLevelSource: "official",
      currentLevelScores: { overall: 6.5, reading: 7.0, listening: 6.0 },
    }).valid,
    true
  );

  assert.equal(
    validateQuestionnaireStep(2, {
      currentLevelSource: "mock",
      currentLevelScores: { overall: 6.7 },
    }).valid,
    false
  );

  assert.equal(
    validateQuestionnaireStep(2, {
      currentLevelSource: "mock",
      currentLevelScores: { overall: 10.5 },
    }).valid,
    false
  );

  assert.equal(
    validateQuestionnaireStep(2, {
      currentLevelSource: "estimate",
      currentLevelScores: { estimatedBand: 6.5 },
    }).valid,
    true
  );

  assert.equal(
    validateQuestionnaireStep(2, {
      currentLevelSource: "estimate",
      currentLevelScores: { estimatedBand: 7.2 },
    }).valid,
    false
  );
});

test("Questionnaire Validation: Step 3 (Weak skills & Exclusive 'not_sure')", () => {
  assert.equal(validateQuestionnaireStep(3, {}).valid, false);
  assert.equal(validateQuestionnaireStep(3, { perceivedWeakSkills: [] }).valid, false);
  assert.equal(validateQuestionnaireStep(3, { perceivedWeakSkills: ["reading", "writing"] }).valid, true);
  assert.equal(validateQuestionnaireStep(3, { perceivedWeakSkills: ["not_sure"] }).valid, true);
});

test("Questionnaire Validation: Step 4 (Exam timeline & Past date rejection)", () => {
  assert.equal(validateQuestionnaireStep(4, {}).valid, false);
  assert.equal(validateQuestionnaireStep(4, { examTimelineType: "not_scheduled" }).valid, true);
  assert.equal(validateQuestionnaireStep(4, { examTimelineType: "within_1_month" }).valid, true);

  assert.equal(validateQuestionnaireStep(4, { examTimelineType: "exact" }).valid, false);
  assert.equal(
    validateQuestionnaireStep(4, { examTimelineType: "exact", examDate: "2020-01-01" }).valid,
    false
  );
  assert.equal(
    validateQuestionnaireStep(4, { examTimelineType: "exact", examDate: "2028-12-31" }).valid,
    true
  );
});

test("Questionnaire Validation: Step 5 (Daily study minutes)", () => {
  assert.equal(validateQuestionnaireStep(5, {}).valid, false);
  assert.equal(validateQuestionnaireStep(5, { dailyStudyMinutes: 15 }).valid, true);
  assert.equal(validateQuestionnaireStep(5, { dailyStudyMinutes: 30 }).valid, true);
  assert.equal(validateQuestionnaireStep(5, { dailyStudyMinutes: 90 }).valid, true);
});

test("Questionnaire Validation: Step 6 (Study days: at least 1 required)", () => {
  assert.equal(validateQuestionnaireStep(6, {}).valid, false);
  assert.equal(validateQuestionnaireStep(6, { studyDays: [] }).valid, false);
  assert.equal(validateQuestionnaireStep(6, { studyDays: ["mon", "wed"] }).valid, true);
});

test("Questionnaire Validation: Step 7 & 8", () => {
  assert.equal(validateQuestionnaireStep(7, {}).valid, false);
  assert.equal(validateQuestionnaireStep(7, { sessionPreference: "single" }).valid, true);
  assert.equal(validateQuestionnaireStep(8, { supportingActivities: [] }).valid, true);
  assert.equal(validateQuestionnaireStep(8, { supportingActivities: ["vocabulary", "mistakes"] }).valid, true);
});

test("Planning Engine: 15-minute budget never prescribes a full 60-min mock exam", () => {
  const plan = {
    ...DEFAULT_QUESTIONNAIRE_PLAN,
    dailyStudyMinutes: 15,
    studyDays: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
  };

  const dayPlan = generateDayPlan(
    plan,
    { dueVocabCount: 0, pendingMistakesCount: 0, attemptsCount: 5 },
    new Date("2026-10-12T12:00:00") // Monday
  );

  assert.equal(dayPlan.isRestDay, false);
  assert.equal(dayPlan.totalMinutes <= 15, true, "Total minutes must not exceed 15");
  for (const task of dayPlan.tasks) {
    assert.equal(task.duration <= 15, true, "Individual task duration must be <= 15");
    assert.equal(task.link.includes("mock-exam-full"), false, "Must not be full mock");
  }
});

test("Planning Engine: Rest day respects non-study days and does not schedule tasks", () => {
  const plan = {
    ...DEFAULT_QUESTIONNAIRE_PLAN,
    studyDays: ["mon", "wed", "fri"],
  };

  const tuesday = new Date("2026-10-13T12:00:00");
  const dayPlan = generateDayPlan(
    plan,
    { dueVocabCount: 10, pendingMistakesCount: 5, attemptsCount: 2 },
    tuesday
  );

  assert.equal(dayPlan.isRestDay, true);
  assert.equal(dayPlan.tasks.length, 0);
  assert.equal(dayPlan.totalMinutes, 0);
  assert.match(dayPlan.explanation, /dam olish kuni/i);
  assert.equal(dayPlan.nextScheduledDateKey, "2026-10-14");
});

test("Planning Engine: Session splitting keeps daily total minutes intact", () => {
  const planTwoSessions = {
    ...DEFAULT_QUESTIONNAIRE_PLAN,
    dailyStudyMinutes: 30,
    sessionPreference: "two_sessions",
    studyDays: ["mon"],
  };

  const monday = new Date("2026-10-12T12:00:00");
  const planResult = generateDayPlan(
    planTwoSessions,
    { dueVocabCount: 5, pendingMistakesCount: 0, attemptsCount: 3 },
    monday
  );

  const sessionIndices = new Set(planResult.tasks.map((t) => t.sessionIndex));
  assert.equal(sessionIndices.size >= 1, true);
  const sumDuration = planResult.tasks.reduce((sum, t) => sum + t.duration, 0);
  assert.equal(sumDuration, 30, "Total duration must equal daily budget");
});

test("Planning Engine: Empty vocabulary and mistake queues never invent phantom tasks", () => {
  const plan = {
    ...DEFAULT_QUESTIONNAIRE_PLAN,
    dailyStudyMinutes: 30,
    supportingActivities: ["vocabulary", "mistakes"],
    studyDays: ["mon"],
  };

  const monday = new Date("2026-10-12T12:00:00");
  const dayPlan = generateDayPlan(
    plan,
    { dueVocabCount: 0, pendingMistakesCount: 0, attemptsCount: 3 },
    monday
  );

  assert.equal(dayPlan.tasks.some((t) => t.category === "vocabulary"), false);
  assert.equal(dayPlan.tasks.some((t) => t.category === "mistakes"), false);
});

test("Planning Engine: Unknown level schedules 15-minute Diagnostic test first", () => {
  const plan = {
    ...DEFAULT_QUESTIONNAIRE_PLAN,
    currentLevelSource: "unknown",
    studyDays: ["mon"],
  };

  const monday = new Date("2026-10-12T12:00:00");
  const dayPlan = generateDayPlan(
    plan,
    { dueVocabCount: 0, pendingMistakesCount: 0, attemptsCount: 0, hasDiagnosticResult: false },
    monday
  );

  assert.equal(dayPlan.tasks.some((t) => t.category === "diagnostic"), true);
  const diagTask = dayPlan.tasks.find((t) => t.category === "diagnostic");
  assert.equal(diagTask.link, "/diagnostic");
});

test("Planning Engine: 7-day schedule accurately projects active study days vs rest days", () => {
  const plan = {
    ...DEFAULT_QUESTIONNAIRE_PLAN,
    studyDays: ["mon", "wed", "fri"],
  };

  const monday = new Date("2026-10-12T12:00:00");
  const weekSummary = generateWeekSummary(plan, monday);

  assert.equal(weekSummary.length, 7);
  const activeDays = weekSummary.filter((d) => d.isStudyDay);
  assert.equal(activeDays.length, 3);
  assert.equal(activeDays.map((d) => d.dayKey).join(","), "mon,wed,fri");
});
