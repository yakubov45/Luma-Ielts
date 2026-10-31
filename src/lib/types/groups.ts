export type GroupLifecycleState = "FORMING" | "ACTIVE" | "UNDER_MINIMUM" | "ARCHIVED";

export type GroupRole = "owner" | "teacher" | "learner";

export interface GroupMember {
  uid: string;
  role: GroupRole;
  displayName: string;
  email?: string;
  joinedAt: number;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  examTrack: "academic" | "general";
  targetBand: number;
  timezone: string;
  schedule?: string;
  ownerId: string;
  ownerName: string;
  teacherIds: string[];
  learnerCount: number; // authoritative count of active learners (min 5, max 15)
  state: GroupLifecycleState;
  inviteCode: string;
  inviteExpiresAt: number;
  isEnrollmentOpen: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface GroupAssignment {
  id: string;
  groupId: string;
  title: string;
  instructions: string;
  skill: "reading" | "listening" | "writing" | "speaking";
  contentRef: string; // e.g. testId
  contentTitle: string;
  version: string;
  assignedLearnerUids: string[];
  startAt: number;
  deadlineAt: number;
  allowLateSubmissions: boolean;
  attemptLimit: number;
  feedbackRelease: "immediate" | "after_deadline" | "manual";
  status: "draft" | "published" | "closed";
  createdAt: number;
}

export interface TeacherReview {
  reviewId: string;
  reviewedByUid: string;
  reviewedByName: string;
  reviewedAt: number;
  teacherBandEstimate?: number;
  overallComment: string;
  criteriaFeedback?: Record<string, { band: number; comment: string }>;
  recommendedFollowUps?: string[];
}

export interface GroupSubmission {
  id: string;
  assignmentId: string;
  groupId: string;
  learnerUid: string;
  learnerName: string;
  submittedAt: number;
  isLate: boolean;
  status: "submitted" | "needs_teacher_review" | "reviewed";
  score?: number;
  accuracy?: number;
  estimatedBand?: number;
  answersOrEssay?: any;
  teacherReview?: TeacherReview;
}

export interface GroupAnnouncement {
  id: string;
  groupId: string;
  authorUid: string;
  authorName: string;
  title: string;
  message: string;
  createdAt: number;
}
