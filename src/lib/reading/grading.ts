export type GradeInput = { answer: unknown; accepted: string[]; type: string; wordLimit?: number };
export type QuestionGrade = { correct: boolean; submitted: string[]; normalized: string[]; accepted: string[]; issue?: string };
export function normalizeAnswer(value: string) { return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("en"); }
export function gradeQuestion({ answer, accepted, type, wordLimit }: GradeInput): QuestionGrade {
  const submitted = (Array.isArray(answer) ? answer : [answer]).filter((v): v is string => typeof v === "string").map((v) => v.trim()).filter(Boolean);
  const normalized = submitted.map(normalizeAnswer); const expected = accepted.map(normalizeAnswer);
  if (wordLimit && submitted.some((v) => v.split(/\s+/).length > wordLimit)) return { correct:false, submitted, normalized, accepted, issue:`Maximum ${wordLimit} word(s).` };
  const correct = type === "multipleChoice" ? normalized.length === expected.length && normalized.every((value) => expected.includes(value)) : normalized.length === 1 && expected.includes(normalized[0]);
  return { correct, submitted, normalized, accepted };
}
