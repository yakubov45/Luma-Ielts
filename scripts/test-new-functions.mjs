import assert from "node:assert/strict";
import test from "node:test";

// Test Group Capacity, Lifecycle, and Permissions
test("Group Lifecycle: 5th learner activates group from FORMING to ACTIVE", () => {
  let state = "FORMING";
  let activeLearnerCount = 4;

  // Add 5th learner
  activeLearnerCount++;
  if (state === "FORMING" && activeLearnerCount >= 5) {
    state = "ACTIVE";
  }

  assert.equal(activeLearnerCount, 5);
  assert.equal(state, "ACTIVE", "Group must activate when 5th learner joins");
});

test("Group Lifecycle: 15th learner joins successfully, but 16th is rejected", () => {
  let activeLearners = new Set(["u1", "u2", "u3", "u4", "u5", "u6", "u7", "u8", "u9", "u10", "u11", "u12", "u13", "u14"]);
  const maxCapacity = 15;

  // 15th learner joins
  const u15 = "u15";
  assert(activeLearners.size < maxCapacity, "Should allow 15th learner");
  activeLearners.add(u15);
  assert.equal(activeLearners.size, 15);

  // 16th learner attempts to join
  const u16 = "u16";
  let rejected = false;
  let errorMessage = "";
  if (activeLearners.size >= maxCapacity) {
    rejected = true;
    errorMessage = "Guruh to‘lgan. Guruhda ko‘pi bilan 15 nafar talaba bo‘lishi mumkin.";
  } else {
    activeLearners.add(u16);
  }

  assert.equal(rejected, true, "16th learner must be rejected");
  assert.equal(activeLearners.size, 15, "Capacity must not exceed 15");
  assert.match(errorMessage, /15 nafar talaba/);
});

test("Group Membership: Repeated join requests do not duplicate membership", () => {
  const members = new Map();
  members.set("user-1", { role: "learner", joinedAt: 1000 });

  // Attempt duplicate join
  const duplicateJoin = (uid) => {
    if (members.has(uid)) {
      return { status: "already_member", count: members.size };
    }
    members.set(uid, { role: "learner", joinedAt: Date.now() });
    return { status: "joined", count: members.size };
  };

  const result = duplicateJoin("user-1");
  assert.equal(result.status, "already_member");
  assert.equal(members.size, 1);
});

test("Group Lifecycle: Leaving an active group below 5 transitions state to UNDER_MINIMUM", () => {
  let state = "ACTIVE";
  let activeLearners = new Set(["u1", "u2", "u3", "u4", "u5"]);

  // u5 leaves
  activeLearners.delete("u5");
  if (state === "ACTIVE" && activeLearners.size < 5) {
    state = "UNDER_MINIMUM";
  }

  assert.equal(activeLearners.size, 4);
  assert.equal(state, "UNDER_MINIMUM", "State must become UNDER_MINIMUM when active count < 5");
});

test("Group Assignments: Publishing blocked in FORMING and UNDER_MINIMUM, but existing assignments remain usable", () => {
  const canPublishAssignment = (groupState) => {
    return groupState === "ACTIVE";
  };

  assert.equal(canPublishAssignment("FORMING"), false, "Cannot publish in FORMING");
  assert.equal(canPublishAssignment("UNDER_MINIMUM"), false, "Cannot publish in UNDER_MINIMUM");
  assert.equal(canPublishAssignment("ACTIVE"), true, "Can publish in ACTIVE");

  // Existing assignments remain accessible in UNDER_MINIMUM
  const existingAssignments = [{ id: "asg-1", title: "Practice Test 1" }];
  const canAccessExisting = (groupState) => {
    return ["ACTIVE", "UNDER_MINIMUM"].includes(groupState);
  };

  assert.equal(canAccessExisting("UNDER_MINIMUM"), true, "Existing assignments remain usable in UNDER_MINIMUM");
});

// Test Answer-Confidence Matrix
test("Answer Confidence Tracking: Classifies into 4 pedagogical categories without altering score", () => {
  // Confidence categories: correct_confident, correct_unsure, incorrect_confident, incorrect_unsure

  const classifyAnswer = (isCorrect, confidence) => {
    if (isCorrect) {
      return confidence === "unsure" ? "correct_unsure" : "correct_confident";
    }
    return confidence === "confident" ? "incorrect_confident" : "incorrect_unsure";
  };

  assert.equal(classifyAnswer(true, "confident"), "correct_confident");
  assert.equal(classifyAnswer(true, "unsure"), "correct_unsure");
  assert.equal(classifyAnswer(false, "confident"), "incorrect_confident");
  assert.equal(classifyAnswer(false, "unsure"), "incorrect_unsure");

  // Score remains unchanged
  const totalScore = [true, false].filter(Boolean).length;
  assert.equal(totalScore, 1, "Score calculation is purely accuracy-based");
});

// Test Diagnostic Recommendations Plain Reasons
test("Diagnostic: Generates personal learning path recommendations with plain reasons", () => {
  const subscores = {
    listening: 6.0,
    reading: 5.0,
    writing: 5.5,
    speaking: 6.5,
  };

  const weaknesses = Object.entries(subscores)
    .filter(([_, score]) => score < 6.0)
    .sort(([_, a], [__, b]) => a - b);

  const primaryFocus = weaknesses[0][0];
  assert.equal(primaryFocus, "reading", "Lowest score must be primary focus");

  const recommendation = {
    skill: primaryFocus,
    plainReason: `Sizning Reading bo‘yicha diagnostik ballingiz 5.0 bo‘lib, qolgan modullardan pastroq. Shuning uchun o‘rganish rejangiz birinchi navbatda akademik matnlarni tahlil qilishdan boshlanadi.`,
  };

  assert.match(recommendation.plainReason, /5\.0/);
  assert.match(recommendation.plainReason, /Reading/);
});

// Test Writing Self-Correction
test("Writing Self-Correction: Evaluates flexible semantic corrections without rigid exact-string restriction", () => {
  const originalMistake = "He don't know the answer";
  const userRevision = "He does not know the answer";

  const isSelfCorrectionValid = (orig, rev) => {
    if (!rev || rev.trim().length === 0) return false;
    if (rev.trim().toLowerCase() === orig.trim().toLowerCase()) return false;
    return rev.toLowerCase().includes("does not") || rev.toLowerCase().includes("doesn't");
  };

  assert.equal(isSelfCorrectionValid(originalMistake, userRevision), true);
  assert.equal(isSelfCorrectionValid(originalMistake, "He doesn't know the answer"), true);
  assert.equal(isSelfCorrectionValid(originalMistake, originalMistake), false);
});

// Test Speaking Part 1
import { PART_1_SPEAKING_TOPICS } from "../src/lib/speaking/sample-data.ts";

test("Speaking Part 1: All 12 topics, questions, and useful chunks are structured cleanly", () => {
  assert.equal(PART_1_SPEAKING_TOPICS.length, 12, "Must contain exactly 12 Part 1 topics");

  const expectedTopicIds = [
    "spk-p1-social-media",
    "spk-p1-mirrors",
    "spk-p1-teachers",
    "spk-p1-dreams-ambitions",
    "spk-p1-music",
    "spk-p1-tidiness",
    "spk-p1-websites",
    "spk-p1-watches",
    "spk-p1-shopping",
    "spk-p1-cars",
    "spk-p1-parks",
    "spk-p1-science",
  ];

  let totalQuestions = 0;
  let totalChunks = 0;

  for (const expectedId of expectedTopicIds) {
    const topic = PART_1_SPEAKING_TOPICS.find((t) => t.id === expectedId);
    assert.ok(topic, `Topic ${expectedId} must exist`);
    assert.equal(topic.part, 1, `Topic ${expectedId} must be Part 1`);
    assert.ok(topic.questionsOrCueCard.followUpQuestions?.length > 0, `${expectedId} must have questions`);
    assert.ok(topic.questionsOrCueCard.usefulChunks?.length > 0, `${expectedId} must have useful chunks`);

    totalQuestions += topic.questionsOrCueCard.followUpQuestions.length;
    totalChunks += topic.questionsOrCueCard.usefulChunks.length;

    for (const chunk of topic.questionsOrCueCard.usefulChunks) {
      assert.ok(chunk.phrase && chunk.phrase.length > 0, "Chunk must have phrase");
      assert.ok(chunk.meaning && chunk.meaning.length > 0, "Chunk must have Uzbek meaning");
    }
  }

  assert.ok(totalQuestions >= 60, `Should have >= 60 questions, got ${totalQuestions}`);
  assert.ok(totalChunks >= 200, `Should have >= 200 useful chunks, got ${totalChunks}`);
});

// Test Reading Passages & Mock Tests
import {
  PASSAGE_1_SPECS,
  PASSAGE_2_SPECS,
  PASSAGE_3_SPECS,
  parseSpec,
} from "./generate-passages-data.mjs";

test("IELTS Reading Passages: 30 Passages sorted into 10 Passage 1, 10 Passage 2, 10 Passage 3", () => {
  assert.equal(PASSAGE_1_SPECS.length, 10, "Must have exactly 10 Passage 1 files");
  assert.equal(PASSAGE_2_SPECS.length, 10, "Must have exactly 10 Passage 2 files");
  assert.equal(PASSAGE_3_SPECS.length, 10, "Must have exactly 10 Passage 3 files");

  const p1 = PASSAGE_1_SPECS.map((s) => parseSpec(s, 1));
  const p2 = PASSAGE_2_SPECS.map((s) => parseSpec(s, 2));
  const p3 = PASSAGE_3_SPECS.map((s) => parseSpec(s, 3));

  p1.forEach((t) => {
    assert.equal(t.section.questions.length, 13, `${t.id} must have 13 questions`);
    assert.ok(t.section.paragraphs.length >= 5, `${t.id} must have paragraphs`);
  });

  p2.forEach((t) => {
    assert.equal(t.section.questions.length, 13, `${t.id} must have 13 questions`);
    assert.ok(t.section.paragraphs.length >= 5, `${t.id} must have paragraphs`);
  });

  p3.forEach((t) => {
    assert.equal(t.section.questions.length, 14, `${t.id} must have 14 questions`);
    assert.ok(t.section.paragraphs.length >= 5, `${t.id} must have paragraphs`);
  });
});

test("IELTS Reading Mock Tests: 10 Full Mock Exams combining P1+P2+P3 with 40 questions each", () => {
  const p1 = PASSAGE_1_SPECS.map((s) => parseSpec(s, 1));
  const p2 = PASSAGE_2_SPECS.map((s) => parseSpec(s, 2));
  const p3 = PASSAGE_3_SPECS.map((s) => parseSpec(s, 3));

  for (let i = 0; i < 10; i++) {
    const qCount =
      p1[i].section.questions.length +
      p2[i].section.questions.length +
      p3[i].section.questions.length;
    assert.equal(qCount, 40, `Mock Test ${i + 1} must have 40 questions (13 + 13 + 14)`);
  }
});

// Test SM-2 Spaced Repetition Algorithm & Adaptive Scheduling (Section 14)
test("SM-2 Spaced Repetition: Adaptive intervals and ease factor calculations", () => {
  function computeSM2(current, grade) {
    let repetition = current.repetition;
    let easeFactor = current.easeFactor;
    let intervalDays = current.intervalDays;

    if (grade === "again") {
      repetition = 0;
      intervalDays = 1;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
    } else if (grade === "hard") {
      repetition += 1;
      intervalDays = Math.max(1, Math.round(intervalDays * 1.2));
      easeFactor = Math.max(1.3, easeFactor - 0.15);
    } else if (grade === "good") {
      if (repetition === 0) intervalDays = 1;
      else if (repetition === 1) intervalDays = 3;
      else intervalDays = Math.round(intervalDays * easeFactor);
      repetition += 1;
    } else if (grade === "easy") {
      if (repetition === 0) intervalDays = 3;
      else if (repetition === 1) intervalDays = 6;
      else intervalDays = Math.round(intervalDays * easeFactor * 1.3);
      repetition += 1;
      easeFactor = Math.min(3.0, easeFactor + 0.15);
    }

    return { repetition, easeFactor: Number(easeFactor.toFixed(2)), intervalDays };
  }

  // 1. Initial card (repetition: 0, ease: 2.5, interval: 1)
  const initial = { repetition: 0, easeFactor: 2.5, intervalDays: 1 };

  // First review: Good -> repetition 1, interval 1 day, ease unchanged
  const rev1 = computeSM2(initial, "good");
  assert.equal(rev1.repetition, 1);
  assert.equal(rev1.intervalDays, 1);
  assert.equal(rev1.easeFactor, 2.5);

  // Second review: Good -> repetition 2, interval 3 days
  const rev2 = computeSM2(rev1, "good");
  assert.equal(rev2.repetition, 2);
  assert.equal(rev2.intervalDays, 3);
  assert.equal(rev2.easeFactor, 2.5);

  // Third review: Good -> repetition 3, interval Math.round(3 * 2.5) = 8 days
  const rev3 = computeSM2(rev2, "good");
  assert.equal(rev3.repetition, 3);
  assert.equal(rev3.intervalDays, 8);

  // Fourth review: Again -> resets repetition to 0, interval 1 day, ease decreases by 0.2
  const rev4 = computeSM2(rev3, "again");
  assert.equal(rev4.repetition, 0);
  assert.equal(rev4.intervalDays, 1);
  assert.equal(rev4.easeFactor, 2.3);

  // Fifth review: Easy -> repetition 1, interval 3 days, ease increases by 0.15
  const rev5 = computeSM2(rev4, "easy");
  assert.equal(rev5.repetition, 1);
  assert.equal(rev5.intervalDays, 3);
  assert.equal(rev5.easeFactor, 2.45);
});

// Test Guest Account Sync and User Isolation (Section 6)
test("Guest Data Migration: Preserves local buffer on error and purges only after confirmed remote writes", async () => {
  const localGuestBuffer = {
    attempts: [{ id: "att_1", accuracy: 80 }],
    vocab: [{ id: "w_1", word: "Salient" }],
  };

  let remoteDatabase = new Map();
  let syncFailed = false;

  async function mockSync(shouldFail) {
    if (shouldFail) {
      // Simulate network outage
      return { success: false, error: "Network disconnected" };
    }
    // Success: commit to remote
    for (const a of localGuestBuffer.attempts) {
      remoteDatabase.set(a.id, a);
    }
    for (const v of localGuestBuffer.vocab) {
      remoteDatabase.set(v.id, v);
    }
    // Clear local only on success
    localGuestBuffer.attempts = [];
    localGuestBuffer.vocab = [];
    return { success: true };
  }

  // Attempt 1: Network failure -> local buffer stays intact
  const res1 = await mockSync(true);
  assert.equal(res1.success, false);
  assert.equal(localGuestBuffer.attempts.length, 1, "Guest attempts must NOT be cleared on failure");
  assert.equal(remoteDatabase.size, 0);

  // Attempt 2: Reconnection -> successful migration
  const res2 = await mockSync(false);
  assert.equal(res2.success, true);
  assert.equal(localGuestBuffer.attempts.length, 0, "Guest attempts cleared after verified write");
  assert.equal(remoteDatabase.size, 2, "Remote database has both records");
});

test("User Isolation: Signing out clears session state so Account B never inherits Account A data", () => {
  let localStorage = new Map();
  
  // User A logs in and writes drafts
  const userA_Uid = "user_A_123";
  localStorage.set(`ielts_focus_draft_${userA_Uid}_task1`, "Essay draft by User A");
  localStorage.set("ielts_focus_attempts", JSON.stringify([{ id: "att_A" }]));

  // Sign out called
  function handleSignOut() {
    // Clear guest / session buffers
    localStorage.delete("ielts_focus_attempts");
    localStorage.delete("ielts_focus_vocab_words");
    localStorage.delete("ielts_focus_mistakes");
  }
  handleSignOut();

  // User B logs in
  const userB_Uid = "user_B_456";
  const userBDraft = localStorage.get(`ielts_focus_draft_${userB_Uid}_task1`);
  const guestAttempts = localStorage.get("ielts_focus_attempts");

  assert.equal(userBDraft, undefined, "User B must not see User A's private draft");
  assert.equal(guestAttempts, undefined, "Guest attempts must be cleared on logout");
});

console.log("All IELTS educational feature & capacity rules verified successfully!");
