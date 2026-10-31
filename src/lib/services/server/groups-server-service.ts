import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { Group, GroupLifecycleState, GroupAssignment } from "@/lib/types/groups";

export interface JoinGroupResult {
  success: boolean;
  group?: Group;
  alreadyMember?: boolean;
  error?: string;
}

export interface LeaveGroupResult {
  success: boolean;
  group?: Group;
  error?: string;
}

export interface PublishAssignmentResult {
  success: boolean;
  assignment?: GroupAssignment;
  error?: string;
}

/**
 * Calculates the next group state given the current state and new learner count.
 * - FORMING: < 5 learners before activation
 * - ACTIVE: 5-15 learners
 * - UNDER_MINIMUM: dropped below 5 after having been active
 * - ARCHIVED: terminal/read-only
 */
export function computeGroupLifecycle(
  currentState: GroupLifecycleState,
  learnerCount: number
): GroupLifecycleState {
  if (currentState === "ARCHIVED") {
    return "ARCHIVED";
  }
  if (learnerCount >= 5 && learnerCount <= 15) {
    return "ACTIVE";
  }
  if (learnerCount < 5) {
    if (currentState === "ACTIVE" || currentState === "UNDER_MINIMUM") {
      return "UNDER_MINIMUM";
    }
    return "FORMING";
  }
  return currentState;
}

/**
 * Server-side atomic transaction to join a group by invite code.
 * Enforces:
 * - Caller identity from verified session
 * - Group active/forming check (ARCHIVED rejects joins)
 * - Enrollment openness & invite expiration
 * - Atomic duplicate check (idempotent, does not increase learnerCount)
 * - Strict 15-learner maximum capacity limit (16th is rejected)
 * - Automatic transition to ACTIVE when 5th learner joins
 */
export async function joinGroupByCodeServer(
  callerUid: string,
  callerName: string,
  inviteCode: string
): Promise<JoinGroupResult> {
  const normalizedCode = inviteCode.trim().toUpperCase();

  try {
    // 1. Locate the group by inviteCode
    const groupsQuery = await adminDb
      .collection("groups")
      .where("inviteCode", "==", normalizedCode)
      .limit(1)
      .get();

    if (groupsQuery.empty) {
      return { success: false, error: "Ushbu taklif kodiga mos guruh topilmadi." };
    }

    const groupDocSnap = groupsQuery.docs[0];
    const groupRef = groupDocSnap.ref;
    const memberRef = groupRef.collection("members").doc(callerUid);

    // 2. Execute atomic Firestore transaction
    return await adminDb.runTransaction<JoinGroupResult>(async (tx) => {
      const freshGroupSnap = await tx.get(groupRef);
      if (!freshGroupSnap.exists) {
        return { success: false, error: "Guruh topilmadi." };
      }

      const groupData = freshGroupSnap.data() as Group;

      // Group state checks
      if (groupData.state === "ARCHIVED") {
        return {
          success: false,
          error: "Arxivlangan guruhga a’zo bo‘lish imkonsiz.",
        };
      }

      if (!groupData.isEnrollmentOpen) {
        return {
          success: false,
          error: "Ushbu guruhga yangi talabalar qabul qilinmayapti (qabul yopiq).",
        };
      }

      if (groupData.inviteExpiresAt && groupData.inviteExpiresAt < Date.now()) {
        return {
          success: false,
          error: "Ushbu taklif kodining amal qilish muddati tugagan.",
        };
      }

      // Check if user is already a member
      const memberSnap = await tx.get(memberRef);
      if (memberSnap.exists) {
        return {
          success: true,
          alreadyMember: true,
          group: { ...groupData, id: groupDocSnap.id },
        };
      }

      // Check capacity: maximum 15 learners
      const currentLearners = groupData.learnerCount ?? 0;
      if (currentLearners >= 15) {
        return {
          success: false,
          error: "Guruh to‘lgan (15 / 15 nafar). Yangi talaba qabul qilish imkonsiz.",
        };
      }

      const nextLearnerCount = currentLearners + 1;
      const nextState = computeGroupLifecycle(groupData.state, nextLearnerCount);

      // Atomically update group document and create member document
      tx.update(groupRef, {
        learnerCount: nextLearnerCount,
        state: nextState,
        updatedAt: Date.now(),
      });

      tx.set(memberRef, {
        uid: callerUid,
        role: "learner",
        displayName: callerName || "Learner",
        joinedAt: Date.now(),
      });

      const updatedGroup: Group = {
        ...groupData,
        id: groupDocSnap.id,
        learnerCount: nextLearnerCount,
        state: nextState,
        updatedAt: Date.now(),
      };

      return {
        success: true,
        alreadyMember: false,
        group: updatedGroup,
      };
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Guruhga qo‘shilishda xatolik yuz berdi.";
    return { success: false, error: message };
  }
}

/**
 * Server-side atomic transaction to leave a group.
 * If active learner count drops below 5, transitions ACTIVE -> UNDER_MINIMUM.
 */
export async function leaveGroupServer(
  callerUid: string,
  groupId: string
): Promise<LeaveGroupResult> {
  const groupRef = adminDb.collection("groups").doc(groupId);
  const memberRef = groupRef.collection("members").doc(callerUid);

  try {
    return await adminDb.runTransaction<LeaveGroupResult>(async (tx) => {
      const groupSnap = await tx.get(groupRef);
      if (!groupSnap.exists) {
        return { success: false, error: "Guruh topilmadi." };
      }

      const memberSnap = await tx.get(memberRef);
      if (!memberSnap.exists) {
        return { success: false, error: "Siz ushbu guruh a’zosi emassiz." };
      }

      const memberData = memberSnap.data();
      const groupData = groupSnap.data() as Group;

      // Teachers do not count toward learner capacity
      const isLearner = memberData?.role === "learner";
      const nextLearnerCount = isLearner
        ? Math.max(0, (groupData.learnerCount ?? 1) - 1)
        : groupData.learnerCount;

      const nextState = isLearner
        ? computeGroupLifecycle(groupData.state, nextLearnerCount)
        : groupData.state;

      tx.delete(memberRef);
      tx.update(groupRef, {
        learnerCount: nextLearnerCount,
        state: nextState,
        updatedAt: Date.now(),
      });

      return {
        success: true,
        group: {
          ...groupData,
          id: groupId,
          learnerCount: nextLearnerCount,
          state: nextState,
          updatedAt: Date.now(),
        },
      };
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Guruhdan chiqishda xatolik yuz berdi.";
    return { success: false, error: message };
  }
}

/**
 * Server-side check for publishing new assignments.
 * Rule: FORMING and UNDER_MINIMUM groups cannot publish new assignments (need 5-15 active learners).
 */
export async function publishAssignmentServer(
  teacherUid: string,
  groupId: string,
  assignmentData: Omit<GroupAssignment, "id" | "groupId" | "createdAt">
): Promise<PublishAssignmentResult> {
  const groupRef = adminDb.collection("groups").doc(groupId);
  const groupSnap = await groupRef.get();

  if (!groupSnap.exists) {
    return { success: false, error: "Guruh topilmadi." };
  }

  const group = groupSnap.data() as Group;

  // Authorization check: caller must be a teacher or owner of the group
  const isTeacher = group.ownerId === teacherUid || (group.teacherIds && group.teacherIds.includes(teacherUid));
  if (!isTeacher) {
    return { success: false, error: "Faqat guruh ustozi topshiriq yarata oladi." };
  }

  // Under-minimum and Forming groups cannot publish new assignments
  if (group.state !== "ACTIVE" && assignmentData.status === "published") {
    return {
      success: false,
      error: `Guruh holati "${group.state}". Yangi topshiriq e’lon qilish uchun kamida 5 ta faol talaba talab etiladi (hozirda: ${group.learnerCount}/15).`,
    };
  }

  const assignmentRef = groupRef.collection("assignments").doc();
  const newAssignment: GroupAssignment = {
    ...assignmentData,
    id: assignmentRef.id,
    groupId,
    createdAt: Date.now(),
  };

  await assignmentRef.set(newAssignment);

  return { success: true, assignment: newAssignment };
}
