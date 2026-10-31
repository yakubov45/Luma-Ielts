You are a senior full-stack engineer and educational product designer working on an existing IELTS preparation platform.

Implement the learning features and group system below inside the current application. Inspect the repository first. Preserve existing Firebase integrations, authentication, catalogs, attempts, annotations, vocabulary, recordings, Writing evaluation, and user progress.

Use the established warm white and deep orange design system. Implement working functionality, secure persistence, and appropriate tests. Do not deliver only mockups or a plan.

## 1. Product objective

Help learners understand their weaknesses, practice deliberately, and receive useful feedback.

Add:

1. Initial diagnostic activities.
2. A personal learning path.
3. Answer-confidence tracking.
4. A “correct it yourself” Writing mode.
5. Contextual questions about results and feedback.
6. Custom practice tasks.
7. Targeted mini-exercises.
8. Weekly progress reports.
9. Teacher-led groups with 5–15 active learners.
10. Content and feedback quality reporting.

Build on existing modules instead of creating parallel implementations.

## 2. Group size rules — mandatory

A group supports a minimum of 5 and a maximum of 15 active learners.

Teachers and platform administrators do not count toward learner capacity. A teacher cannot also occupy a learner seat in the same group.

Use explicit lifecycle states:

- FORMING: fewer than 5 active learners; enrollment and preparation are available.
- ACTIVE: 5–15 active learners.
- UNDER_MINIMUM: a previously active group has fallen below 5 learners.
- ARCHIVED: read-only historical group.

A teacher may create a FORMING group without enrolling five people immediately.

FORMING groups may configure settings, invite learners, and prepare assignment drafts. They cannot publish assignments or start group sessions.

When the fifth learner joins, activate the group through an authorized server operation.

When an ACTIVE group falls below five:

- Move it to UNDER_MINIMUM.
- Preserve all assignments, submissions, feedback, and history.
- Allow remaining learners to finish already published assignments.
- Allow teachers to review existing submissions.
- Block publication of new assignments and creation of new group sessions.
- Explain how many additional learners are needed.
- Reactivate when membership reaches five again.

Never delete learning records because the group is below minimum size.

Reject the sixteenth active learner, including simultaneous join requests. Enforce capacity and state transitions on the server using a Firestore transaction. A frontend member-count check is insufficient.

Pending invitations do not reserve seats. Joining must recheck actual capacity.

Do not add a waitlist unless needed later; show a clear “Group is full” state.

## 3. Roles and permissions

Support:

- Group owner: the teacher who creates the group.
- Teacher: an explicitly authorized teaching role.
- Learner: a group member.
- Platform admin: existing platform-level administrative role.

For the initial implementation, one owner-teacher per group is sufficient. Additional teachers may be added only through a secure, explicit membership workflow.

Group ownership does not grant platform admin privileges.

Teachers may manage only their own groups and the educational records explicitly associated with those groups.

Learners may access:

- Their own private learning data.
- Groups they belong to.
- Published group assignments.
- Their own submissions and feedback.
- Intentionally shared group information.

Membership must not expose classmates’ essays, recordings, private mistakes, emails, or personal study history.

Teachers must not gain access to a learner’s unrelated personal practice.

Use server verification and Firebase rules. Never trust a client-supplied role, membership count, owner ID, score, or permission flag.

## 4. Creating and joining groups

Teacher group creation includes:

- Group name.
- Short description.
- IELTS track.
- Target band.
- Timezone.
- Optional schedule.
- Enrollment settings.

Provide invitations through revocable, expiring invite links or codes.

Require authentication before joining. Store invitation secrets securely, rate-limit join attempts, and prevent duplicate membership.

Do not expose private roster details through an unauthenticated invite page.

Teacher controls:

- Copy invitation link.
- Regenerate or revoke invitation.
- Close enrollment.
- Remove a learner with confirmation.
- Archive a group.
- View active learner count.

Show group size clearly: “8 / 15 learners” and the minimum-five requirement when relevant.

A learner can leave a group after confirmation. Explain what happens to their access and existing submissions. Preserve historical records according to a documented retention policy.

Do not send email or calendar invitations automatically. Prepare links for teachers to share unless an explicit messaging feature is configured and authorized.

## 5. Group interface

Provide a “Groups” navigation entry.

Learner group page:

- Overview.
- Assignments.
- My Results.
- Announcements.
- Schedule.

Teacher group page:

- Overview.
- Learners.
- Assignments.
- Submissions.
- Progress.
- Settings.

Show the next relevant action first. Keep group status, upcoming deadlines, and pending reviews visible.

Use neutral progress summaries. Do not introduce a public learner ranking or competitive leaderboard by default.

Provide a simple teacher announcement feed. Full group chat, video calls, and conferencing are outside this scope.

## 6. Assignments and teacher feedback

Teachers can assign published Reading, Listening, Writing, and Speaking activities.

An assignment contains:

- Content and immutable version reference.
- Instructions.
- Assigned learners.
- Start time and deadline.
- Timezone-aware display.
- Practice or simulation mode when supported.
- Attempt limit.
- Late-submission policy.
- Feedback-release policy.

Default late policy: accept late submissions but label them late. Provide a configurable strict deadline.

Define assignment eligibility when publishing. Learners joining later are not silently added to existing assignments; the teacher may explicitly assign them.

Removing a learner must not silently erase their work. Define submission and teacher-access behavior consistently in documentation and the UI.

Track:

- Not Started.
- In Progress.
- Submitted.
- Late.
- Evaluating.
- Needs Teacher Review.
- Reviewed.

Reuse the existing attempt and grading system.

Keep AI estimates, deterministic test scores, and teacher assessments as separate records. A teacher correction must not overwrite the original AI response without history.

Teachers can add:

- Text comments.
- Criterion feedback.
- A clearly labeled teacher band estimate.
- Recommended follow-up activities.

Respect each assignment’s feedback-release setting.

## 7. Initial diagnostic and personal learning path

Offer an optional diagnostic made from real, reviewed activities.

Explain that a short diagnostic is a preliminary learning indicator, not a certified IELTS band assessment.

Use results to identify:

- Weak question types.
- Recurring Writing problems.
- Due vocabulary.
- Practiced versus unpracticed skills.

Build a personal learning path based on goals, exam date, available daily minutes, and actual performance.

Each recommendation must have a simple reason, such as:

“You missed 4 of 6 matching-headings questions. Practice another short passage.”

Allow the learner to change or skip recommendations.

Combine teacher assignments and personal practice without duplicating the same task or exceeding the planned time without explanation.

## 8. Answer-confidence tracking

In Practice mode, let learners optionally mark:

- Confident.
- Unsure / Guessed.

Confidence must not change the correctness score.

Use four learning categories:

- Correct and confident: reinforce later.
- Correct but unsure: verify with a new exercise.
- Incorrect and confident: explain the likely misunderstanding.
- Incorrect and unsure: provide foundational guidance.

Confidence selection must be lightweight, keyboard-accessible, and optional. Do not interrupt every answer with a modal.

Use new equivalent questions to check understanding rather than repeatedly presenting a remembered answer.

## 9. Writing “correct it yourself” mode

After evaluation, allow a learner to work through genuine errors before seeing the suggested correction.

Flow:

1. Highlight a supported error in the original text.
2. Show a brief hint.
3. Let the learner submit a correction.
4. Give feedback.
5. Reveal the suggested correction on request.
6. Save the review event.

Keep original essays, revisions, and evaluation results intact.

Do not treat optional stylistic preferences as grammatical errors.

Accept multiple valid corrections. Do not use exact-string equality as the only correctness check for open-ended rewriting.

If semantic evaluation is unavailable, provide self-review and model comparison rather than falsely declaring valid alternatives wrong.

## 10. Questions about results and feedback

Add an “Ask about this” action beside a question result or Writing feedback item.

The assistant receives only the relevant authorized context:

- Task.
- Submitted answer.
- Applicable result.
- Relevant passage or visual information.
- Existing feedback.

It must explain using that context and identify uncertainty. It must not invent evidence or expose unreleased answer keys.

Disable answer-revealing assistance during exam simulation and respect teacher feedback-release policies.

Keep explanations in the learner’s selected language. Use English for original excerpts and corrections.

Apply existing server-side AI protections, quotas, input validation, and usage tracking. If no provider is configured, show the actual unavailable state.

## 11. Custom practice and mini-exercises

Allow learners to create private practice tasks:

- Writing prompt with an optional Task 1 visual.
- Speaking question or cue card.

Clearly distinguish user-created tasks from reviewed platform content.

Validate uploads and keep them private. Missing Task 1 source information must limit evaluation rather than trigger invented chart analysis.

Generate or select short exercises from actual weaknesses. Link each exercise to its learning objective.

AI-generated exercises remain labeled as generated. Validate structure and answer consistency; never present an unchecked answer key as authoritative.

## 12. Weekly reports

Provide an in-app weekly report containing:

- Completed activities.
- First-attempt versus retake results.
- Due and reviewed vocabulary.
- Recurring mistakes.
- Writing revision activity.
- Speaking practice completed.
- Three practical next steps.

Use actual data. Separate teacher assignments from personal practice where useful.

Respect user timezone and week boundaries. Do not count an idle open browser tab as study time.

Start with on-demand or cached in-app reports. Do not add recurring email or push delivery without an explicit opt-in and configured delivery service.

## 13. Quality control

Add reporting actions:

- “Question or answer seems incorrect.”
- “This feedback seems incorrect.”

Capture the relevant content version, question or evaluation reference, reporter, and reason.

Admin review includes:

- Report queue.
- Original material.
- Relevant response or feedback.
- Resolution status.
- Internal notes.
- Audit history.

Do not automatically declare a question defective because many users answer incorrectly.

If a correction affects an existing score, create a traceable correction event and communicate it clearly. Do not silently rewrite historical results.

## 14. Firebase data and security

Extend the existing model with collections such as:

- groups/{groupId}
- groups/{groupId}/members/{uid}
- groups/{groupId}/assignments/{assignmentId}
- groups/{groupId}/announcements/{announcementId}
- groupInvitations/{invitationId}
- groupSubmissions/{submissionId}
- teacherReviews/{reviewId}

Reuse existing personal attempts and results through secure references where appropriate.

Store authoritative membership counts, lifecycle transitions, publication state, and grading fields through trusted server code.

Only group-scoped authorized teachers may access group submissions. Do not grant blanket access to users/{uid}.

Avoid duplicating complete essays and recordings in multiple collections.

Use bounded queries, pagination, documented indexes, and idempotent membership/assignment operations.

## 15. Implementation order and testing

Implement in this order:

1. Group model, permissions, transactional capacity enforcement, invitations, and lifecycle.
2. Group pages, assignments, submissions, and teacher review.
3. Confidence tracking and personal learning recommendations.
4. Writing self-correction and contextual explanations.
5. Custom tasks, targeted exercises, weekly reports, and quality reporting.

Required tests include:

- The fifth learner activates a group.
- The fifteenth learner joins successfully.
- The sixteenth learner is rejected.
- Concurrent joins cannot exceed fifteen.
- Repeated join requests do not duplicate membership.
- Leaving an active group below five changes its state correctly.
- Existing assignments remain usable below minimum size.
- New assignments cannot be published below minimum size.
- A teacher cannot read another teacher’s group submissions.
- A learner cannot read classmates’ private responses.
- Unrelated personal practice remains private.
- Revoked or expired invitations fail.
- Repeated requests do not duplicate reviews, submissions, or paid AI jobs.

Run relevant tests, type checking, linting, and production build. Report actual verification results and any external-service limitations.

Start by inspecting the current project, then implement the features in working code.