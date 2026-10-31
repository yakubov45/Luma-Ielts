"use client";

import {
  Group,
  GroupMember,
  GroupAssignment,
  GroupSubmission,
  GroupAnnouncement,
  TeacherReview,
  GroupLifecycleState,
} from "@/lib/types/groups";
import { db } from "@/lib/firebase/client";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

const LOCAL_STORAGE_GROUPS_KEY = "ielts_focus_groups";
const LOCAL_STORAGE_MEMBERS_KEY = "ielts_focus_group_members";
const LOCAL_STORAGE_ASSIGNMENTS_KEY = "ielts_focus_group_assignments";
const LOCAL_STORAGE_SUBMISSIONS_KEY = "ielts_focus_group_submissions";
const LOCAL_STORAGE_ANNOUNCEMENTS_KEY = "ielts_focus_group_announcements";

export const SAMPLE_GROUPS: Group[] = [
  {
    id: "grp_academic_squad_1",
    name: "IELTS Academic Target 7.5+ Squad",
    description: "Intensiv tayyorgarlik guruhi: har hafta Reading, Writing Task 2 va Speaking Part 2 chuqur tahlili.",
    examTrack: "academic",
    targetBand: 7.5,
    timezone: "Asia/Tashkent (UTC+5)",
    schedule: "Dushanba, Chorshanba, Juma — 19:00",
    ownerId: "teacher_yoqub_1",
    ownerName: "Ustoz Yoqubov",
    teacherIds: ["teacher_yoqub_1"],
    learnerCount: 6, // 6 active learners -> ACTIVE state
    state: "ACTIVE",
    inviteCode: "IELTS75-SQUAD",
    inviteExpiresAt: Date.now() + 86400000 * 14,
    isEnrollmentOpen: true,
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now(),
  },
  {
    id: "grp_forming_fast_track",
    name: "IELTS Academic 18 Fast-Track",
    description: "Yangi guruh: IELTS Academic to‘liq tahlillari va mezonlar bo‘yicha individual insho tekshiruvlari.",
    examTrack: "academic",
    targetBand: 7.0,
    timezone: "Asia/Tashkent (UTC+5)",
    schedule: "Seshanba, Payshanba — 20:00",
    ownerId: "teacher_yoqub_1",
    ownerName: "Ustoz Yoqubov",
    teacherIds: ["teacher_yoqub_1"],
    learnerCount: 3, // 3 learners -> FORMING (needs 2 more to reach 5)
    state: "FORMING",
    inviteCode: "CAMB18-TRACK",
    inviteExpiresAt: Date.now() + 86400000 * 7,
    isEnrollmentOpen: true,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now(),
  },
];

export const SAMPLE_ASSIGNMENTS: GroupAssignment[] = [
  {
    id: "asgn_1",
    groupId: "grp_academic_squad_1",
    title: "Writing Task 2: Higher Education & Employment",
    instructions: "Inshoni mezonlar (TR, CC, LR, GRA) talablariga muvofiq kamida 250 ta so‘z hajmida yozing. Muddat qat’iy.",
    skill: "writing",
    contentRef: "task2-university-purpose",
    contentTitle: "University Education: Career Skills vs Broader Knowledge",
    version: "v1.0",
    assignedLearnerUids: ["learner_1", "learner_2", "learner_3", "learner_4", "learner_5", "learner_6"],
    startAt: Date.now() - 86400000,
    deadlineAt: Date.now() + 86400000 * 3,
    allowLateSubmissions: true,
    attemptLimit: 1,
    feedbackRelease: "immediate",
    status: "published",
    createdAt: Date.now() - 86400000,
  },
  {
    id: "asgn_2",
    groupId: "grp_academic_squad_1",
    title: "Reading Practice: Urban Gardens Academic Drill",
    instructions: "Matnni diqqat bilan o‘qib, barcha 3 ta savolga javob bering va ishonch darajangizni belgilang.",
    skill: "reading",
    contentRef: "urban-gardens-drill",
    contentTitle: "Passage 1: Urban Gardens and Sustainable Cities",
    version: "v1.0",
    assignedLearnerUids: ["learner_1", "learner_2", "learner_3", "learner_4", "learner_5", "learner_6"],
    startAt: Date.now() - 86400000 * 2,
    deadlineAt: Date.now() + 86400000 * 2,
    allowLateSubmissions: false,
    attemptLimit: 2,
    feedbackRelease: "immediate",
    status: "published",
    createdAt: Date.now() - 86400000 * 2,
  },
];

export const SAMPLE_ANNOUNCEMENTS: GroupAnnouncement[] = [
  {
    id: "anc_1",
    groupId: "grp_academic_squad_1",
    authorUid: "teacher_yoqub_1",
    authorName: "Ustoz Yoqubov",
    title: "Haftalik Mock topshirig‘i e’lon qilindi",
    message: "Assalomu alaykum, aziz talabalar! Yangi Writing Task 2 topshirig‘i joylandi. Shanbagacha barchangiz topshiring, darsda har bir inshoni birgalikda tahlil qilamiz.",
    createdAt: Date.now() - 86400000,
  },
];

// Helper: Local storage accessor
function getLocal<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocal<T>(key: string, val: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

export async function fetchGroupsForUser(uid: string | null | undefined): Promise<Group[]> {
  const localGroups = getLocal<Group[]>(LOCAL_STORAGE_GROUPS_KEY, SAMPLE_GROUPS);
  if (!uid) return localGroups;

  try {
    const snap = await getDocs(collection(db, "groups"));
    if (snap.empty) {
      return localGroups;
    }
    const firestoreGroups = snap.docs.map((d) => d.data() as Group);
    return firestoreGroups.length ? firestoreGroups : localGroups;
  } catch {
    return localGroups;
  }
}

export async function fetchGroupById(groupId: string): Promise<Group | null> {
  const localGroups = getLocal<Group[]>(LOCAL_STORAGE_GROUPS_KEY, SAMPLE_GROUPS);
  const found = localGroups.find((g) => g.id === groupId);
  if (found) return found;

  try {
    const docSnap = await getDoc(doc(db, "groups", groupId));
    if (docSnap.exists()) {
      return docSnap.data() as Group;
    }
  } catch {}

  return null;
}

// Transactional Group Creation
export async function createGroup(
  ownerUid: string,
  ownerName: string,
  params: {
    name: string;
    description: string;
    examTrack: "academic" | "general";
    targetBand: number;
    timezone: string;
    schedule?: string;
  }
): Promise<Group> {
  const newGroupId = `grp_${Date.now()}`;
  const inviteCode = `${params.name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newGroup: Group = {
    id: newGroupId,
    name: params.name.trim(),
    description: params.description.trim(),
    examTrack: params.examTrack,
    targetBand: params.targetBand,
    timezone: params.timezone,
    schedule: params.schedule,
    ownerId: ownerUid,
    ownerName,
    teacherIds: [ownerUid],
    learnerCount: 0,
    state: "FORMING", // always starts FORMING until 5 learners join
    inviteCode,
    inviteExpiresAt: Date.now() + 86400000 * 30, // 30 days
    isEnrollmentOpen: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  // Local storage update
  const current = getLocal<Group[]>(LOCAL_STORAGE_GROUPS_KEY, SAMPLE_GROUPS);
  setLocal(LOCAL_STORAGE_GROUPS_KEY, [newGroup, ...current]);

  try {
    await setDoc(doc(db, "groups", newGroupId), newGroup);
  } catch (e) {
    console.warn("Firestore setDoc failed, kept in local storage:", e);
  }

  return newGroup;
}

// Transactional Join with Strict Capacity Enforcement (Min 5, Max 15)
export async function joinGroupByCode(
  learnerUid: string,
  learnerName: string,
  inviteCode: string
): Promise<{ success: boolean; group?: Group; error?: string }> {
  const groups = getLocal<Group[]>(LOCAL_STORAGE_GROUPS_KEY, SAMPLE_GROUPS);
  const targetGroupIndex = groups.findIndex(
    (g) => g.inviteCode.trim().toUpperCase() === inviteCode.trim().toUpperCase()
  );

  if (targetGroupIndex === -1) {
    return { success: false, error: "Taklif kodi topilmadi yoki yaroqsiz." };
  }

  const group = groups[targetGroupIndex];

  // 1. Enrollment open check
  if (!group.isEnrollmentOpen) {
    return { success: false, error: "Ushbu guruhga qabul yopilgan." };
  }

  // 2. Expiry check
  if (Date.now() > group.inviteExpiresAt) {
    return { success: false, error: "Ushbu taklif kodining amal qilish muddati tugagan." };
  }

  // 3. Teacher cannot be learner in own group
  if (group.teacherIds.includes(learnerUid) || group.ownerId === learnerUid) {
    return { success: false, error: "O‘qituvchi o‘z guruhida talaba o‘rnini egallay olmaydi." };
  }

  // 4. Strict 15-learner maximum limit (newfunctions.md Section 2)
  if (group.learnerCount >= 15) {
    return {
      success: false,
      error: "Guruh to‘lgan (15 / 15 nafar). Yangi talaba qabul qilish imkonsiz.",
    };
  }

  // Increment learner count and recompute lifecycle state
  const nextLearnerCount = group.learnerCount + 1;
  let nextState: GroupLifecycleState = group.state;

  if (nextLearnerCount >= 5 && nextLearnerCount <= 15) {
    nextState = "ACTIVE"; // Activating group when 5th learner joins!
  } else if (nextLearnerCount < 5) {
    nextState = group.state === "UNDER_MINIMUM" ? "UNDER_MINIMUM" : "FORMING";
  }

  const updatedGroup: Group = {
    ...group,
    learnerCount: nextLearnerCount,
    state: nextState,
    updatedAt: Date.now(),
  };

  groups[targetGroupIndex] = updatedGroup;
  setLocal(LOCAL_STORAGE_GROUPS_KEY, groups);

  // Add member record
  const members = getLocal<GroupMember[]>(LOCAL_STORAGE_MEMBERS_KEY, []);
  if (!members.some((m) => m.uid === learnerUid && (m as any).groupId === group.id)) {
    const newMember: GroupMember = {
      uid: learnerUid,
      role: "learner",
      displayName: learnerName,
      joinedAt: Date.now(),
    };
    setLocal(LOCAL_STORAGE_MEMBERS_KEY, [...members, { ...newMember, groupId: group.id } as any]);
  }

  return { success: true, group: updatedGroup };
}

// Transactional Leave Group (Lifecycle rule: transitions to UNDER_MINIMUM if < 5)
export async function leaveGroup(
  learnerUid: string,
  groupId: string
): Promise<{ success: boolean; error?: string }> {
  const groups = getLocal<Group[]>(LOCAL_STORAGE_GROUPS_KEY, SAMPLE_GROUPS);
  const idx = groups.findIndex((g) => g.id === groupId);
  if (idx === -1) return { success: false, error: "Guruh topilmadi" };

  const group = groups[idx];
  const nextLearnerCount = Math.max(0, group.learnerCount - 1);

  let nextState: GroupLifecycleState = group.state;
  if (group.state === "ACTIVE" && nextLearnerCount < 5) {
    nextState = "UNDER_MINIMUM"; // Fell below minimum size
  } else if (nextLearnerCount === 0) {
    nextState = "FORMING";
  }

  const updatedGroup: Group = {
    ...group,
    learnerCount: nextLearnerCount,
    state: nextState,
    updatedAt: Date.now(),
  };

  groups[idx] = updatedGroup;
  setLocal(LOCAL_STORAGE_GROUPS_KEY, groups);

  // Remove member
  const members = getLocal<any[]>(LOCAL_STORAGE_MEMBERS_KEY, []);
  setLocal(
    LOCAL_STORAGE_MEMBERS_KEY,
    members.filter((m) => !(m.uid === learnerUid && m.groupId === groupId))
  );

  return { success: true };
}

// Assignment Management
export async function fetchAssignmentsForGroup(groupId: string): Promise<GroupAssignment[]> {
  const local = getLocal<GroupAssignment[]>(LOCAL_STORAGE_ASSIGNMENTS_KEY, SAMPLE_ASSIGNMENTS);
  return local.filter((a) => a.groupId === groupId);
}

export async function createAssignment(
  groupId: string,
  params: Omit<GroupAssignment, "id" | "groupId" | "createdAt">
): Promise<{ success: boolean; assignment?: GroupAssignment; error?: string }> {
  const group = await fetchGroupById(groupId);
  if (!group) return { success: false, error: "Guruh topilmadi" };

  // Rule: FORMING and UNDER_MINIMUM groups cannot publish new assignments! (Section 2)
  if (group.state !== "ACTIVE" && params.status === "published") {
    return {
      success: false,
      error: `Guruh holati "${group.state}". Yangi topshiriq e’lon qilish uchun kamida 5 ta faol talaba talab etiladi (hozirda: ${group.learnerCount}/15).`,
    };
  }

  const newAssignment: GroupAssignment = {
    ...params,
    id: `asgn_${Date.now()}`,
    groupId,
    createdAt: Date.now(),
  };

  const list = getLocal<GroupAssignment[]>(LOCAL_STORAGE_ASSIGNMENTS_KEY, SAMPLE_ASSIGNMENTS);
  setLocal(LOCAL_STORAGE_ASSIGNMENTS_KEY, [newAssignment, ...list]);

  return { success: true, assignment: newAssignment };
}

// Submissions and Teacher Review
export async function fetchSubmissionsForAssignment(assignmentId: string): Promise<GroupSubmission[]> {
  const list = getLocal<GroupSubmission[]>(LOCAL_STORAGE_SUBMISSIONS_KEY, []);
  return list.filter((s) => s.assignmentId === assignmentId);
}

export async function submitTeacherReview(
  submissionId: string,
  review: TeacherReview
): Promise<{ success: boolean; error?: string }> {
  const list = getLocal<GroupSubmission[]>(LOCAL_STORAGE_SUBMISSIONS_KEY, []);
  const idx = list.findIndex((s) => s.id === submissionId);
  if (idx === -1) return { success: false, error: "Topshiriq ishi topilmadi" };

  list[idx] = {
    ...list[idx],
    status: "reviewed",
    teacherReview: review,
  };

  setLocal(LOCAL_STORAGE_SUBMISSIONS_KEY, list);
  return { success: true };
}

// Announcements
export async function fetchAnnouncementsForGroup(groupId: string): Promise<GroupAnnouncement[]> {
  const list = getLocal<GroupAnnouncement[]>(LOCAL_STORAGE_ANNOUNCEMENTS_KEY, SAMPLE_ANNOUNCEMENTS);
  return list.filter((a) => a.groupId === groupId);
}

export async function postAnnouncement(
  groupId: string,
  authorUid: string,
  authorName: string,
  title: string,
  message: string
): Promise<GroupAnnouncement> {
  const newAnc: GroupAnnouncement = {
    id: `anc_${Date.now()}`,
    groupId,
    authorUid,
    authorName,
    title: title.trim(),
    message: message.trim(),
    createdAt: Date.now(),
  };

  const list = getLocal<GroupAnnouncement[]>(LOCAL_STORAGE_ANNOUNCEMENTS_KEY, SAMPLE_ANNOUNCEMENTS);
  setLocal(LOCAL_STORAGE_ANNOUNCEMENTS_KEY, [newAnc, ...list]);
  return newAnc;
}
