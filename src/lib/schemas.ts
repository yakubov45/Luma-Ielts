import { z } from "zod";

export const localeSchema = z.enum(["uz", "en"]);
export const examTrackSchema = z.enum(["academic", "general"]);
export const userProfileSchema = z.object({
  displayName: z.string().trim().min(1).max(80),
  email: z.string().email(),
  targetBand: z.number().min(4).max(9).multipleOf(0.5).nullable(),
  examDate: z.string().date().nullable(),
  dailyStudyMinutes: z.number().int().min(10).max(360),
  timezone: z.string().min(1).max(100),
  locale: localeSchema,
  preferences: z.object({ theme: z.enum(["system", "light", "dark"]).default("system") }),
});
export type UserProfile = z.infer<typeof userProfileSchema>;

const baseQuestionSchema = z.object({ id: z.string().min(1), prompt: z.string().min(1), instructions: z.string().min(1) });
export const readingQuestionSchema = z.discriminatedUnion("type", [
  baseQuestionSchema.extend({ type: z.literal("singleChoice"), options: z.array(z.object({ id: z.string(), text: z.string() })).min(2) }),
  baseQuestionSchema.extend({ type: z.literal("multipleChoice"), options: z.array(z.object({ id: z.string(), text: z.string() })).min(2), minSelections: z.number().int().min(1), maxSelections: z.number().int().min(1) }),
  baseQuestionSchema.extend({ type: z.literal("trueFalseNotGiven") }),
  baseQuestionSchema.extend({ type: z.literal("yesNoNotGiven") }),
  baseQuestionSchema.extend({ type: z.literal("matchingHeadings"), options: z.array(z.object({ id: z.string(), text: z.string() })).min(1) }),
  baseQuestionSchema.extend({ type: z.literal("matchingInformation"), options: z.array(z.object({ id: z.string(), text: z.string() })).min(1) }),
  baseQuestionSchema.extend({ type: z.literal("sentenceCompletion"), wordLimit: z.number().int().min(1).max(10) }),
  baseQuestionSchema.extend({ type: z.literal("summaryCompletion"), wordLimit: z.number().int().min(1).max(10) }),
]);
export type ReadingQuestion = z.infer<typeof readingQuestionSchema>;

export const contentMetadataSchema = z.object({
  id: z.string().min(1), skill: z.enum(["reading", "listening", "writing", "speaking"]), examTrack: examTrackSchema,
  title: z.string().min(1), tags: z.array(z.string()).max(20), status: z.enum(["draft", "review", "published", "archived"]),
  publishedVersion: z.string().nullable(), estimatedDuration: z.number().int().positive(), source: z.string().min(1),
  creator: z.string().min(1), license: z.string().min(1), aiGenerated: z.boolean(), schemaVersion: z.literal(1),
});
export type ContentMetadata = z.infer<typeof contentMetadataSchema>;
