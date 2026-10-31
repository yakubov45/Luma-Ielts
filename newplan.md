You are a senior full-stack engineer specializing in Next.js, Firebase security, browser persistence, and educational platforms.

Work directly inside the existing IELTS preparation application. Audit and fix the implementation described below.

This is an implementation request. Inspect the code, make changes, run appropriate checks, and report verified results. Do not stop after producing another plan.

## 1. Existing project and constraints

The application uses:

- Next.js 16 App Router.
- React 19.
- TypeScript strict mode.
- Tailwind CSS v4.
- Firebase Authentication.
- Cloud Firestore.
- Cloud Storage for Firebase.
- Guest practice with local persistence and account synchronization.

Existing modules include Reading, Listening, Writing, Speaking, groups, diagnostics, vocabulary, mistakes, progress, study plans, results, settings, and Admin CMS.

Preserve the established warm white and deep burnt orange design, dark mode, existing content, and working learning features.

Read repository instructions and relevant files such as plan.md, design.md, and newfunctions.md if present. Treat the reported issues as hypotheses until verified in code.

Do not rewrite the application from scratch. Do not introduce another database or replace Firebase.

Do not deploy publicly, change billing settings, or run destructive production migrations without explicit authorization.

## 2. Initial inspection and version control

Before changing application behavior:

1. Inspect package.json, lockfiles, project structure, environment-variable names, Firebase initialization, rules, and existing tests.
2. Check whether the project already belongs to a Git repository, including a parent repository.
3. If no repository exists, initialize Git.
4. Ensure .gitignore excludes secrets, service-account files, dependency/build output, temporary recordings, and local emulator data.
5. Inspect staged files for credentials before creating a baseline commit.
6. Preserve unrelated user changes.
7. Record the current build, type-check, lint, and test status using scripts actually supported by this project.

Never print secrets or include them in commits.

Create STABILIZATION_STATUS.md containing:

- Verified issues and affected files.
- Implementation phases.
- Completed and pending work.
- Checks run and actual results.
- External configuration blockers.

Keep it updated throughout implementation.

## 3. Separate browser and server responsibilities

Audit service imports, especially groups-service.ts and routes under /api/groups.

Implement clear boundaries:

- Browser services: localStorage, IndexedDB, microphone, local drafts.
- Server services: authorization, group membership, grading, publication, privileged data access.
- Shared modules: types, validation schemas, pure functions.

Firebase Admin initialization must be server-only.

No server route may depend on window, document, localStorage, browser Firebase auth state, or mock user/group data.

Do not solve a server failure by silently falling back to mock data.

Keep emulator/demo modes explicit and isolated from real account persistence.

## 4. Secure admin operations and grading

Audit /admin and every associated API, server action, Firestore write, and upload path.

Implement:

- Verified Firebase identity for privileged server requests.
- Platform admin authorization through trusted custom claims.
- Correct unauthenticated and forbidden responses.
- Appropriate Firestore and Storage rules.
- Server-side payload validation.
- Server-derived actor identity.
- Audit records for significant administrative changes.

A client-editable profile field must never grant admin access.

Keep teacher permissions separate from platform admin permissions.

Remember that Firebase Admin SDK bypasses Firestore rules. Server handlers must enforce authorization independently.

Inspect answer-key handling:

- Learners receive question content without private answer keys.
- Exam-mode transcripts, evidence, model answers, and explanations remain unavailable until the permitted reveal point.
- Grade against server-controlled, versioned answer keys.
- Never accept a client-supplied score as authoritative.
- Keep existing attempts pinned to their original content version.
- Make submission idempotent so retries do not duplicate results, mistakes, or progress.

For guest submissions, do not require paid account registration merely to practice. However, enforce abuse controls and never treat an unverified local guest score as a trusted group submission.

Acceptance:

- A learner cannot perform admin mutations through direct requests.
- A learner cannot write a score or retrieve unreleased answer keys.
- Learner A cannot retrieve learner B’s private data.
- Retried submission returns the existing result.

## 5. Fix group membership with server transactions

Replace any localStorage or mock-backed group mutation used by server APIs.

All membership changes must use Firebase Admin Firestore transactions or an equivalent atomic server implementation.

Mandatory group rules:

- Teachers do not count toward learner capacity.
- FORMING: fewer than 5 learners before initial activation.
- ACTIVE: 5–15 active learners.
- UNDER_MINIMUM: a previously active group falls below 5.
- ARCHIVED: historical, read-only state.
- A sixteenth active learner must be rejected.
- Duplicate join requests must not increase member count.
- Pending invitations do not reserve seats.
- Archived groups reject joins.

Joining must validate identity, invitation, expiration, enrollment status, group state, existing membership, and capacity.

Atomically create membership, update the authoritative count, and apply the correct state transition.

Use transactions for leaving, teacher removal, and other membership-count changes too.

When membership falls below five:

- Preserve historical records.
- Permit existing assignments to be finished and reviewed.
- Block publishing new assignments and creating new sessions.
- Reactivate when membership reaches five.

Do not perform external API calls, email delivery, or other non-idempotent side effects inside transaction callbacks.

Deny direct client mutations that could bypass capacity or modify membership counts.

Acceptance tests:

- Fifth learner activates the group.
- Fifteenth learner joins.
- Sixteenth learner is rejected.
- At 14 members, three concurrent joins admit exactly one.
- Repeated joins and removals remain idempotent.
- Teacher count never consumes learner capacity.
- Under-minimum restrictions apply to server publication operations.

## 6. Make guest persistence and account synchronization reliable

Audit the current local-first flow before changing it.

Use localStorage for small preferences where appropriate. Use IndexedDB for larger drafts, queued operations, and audio blobs.

Implement stable local record IDs and a versioned local schema.

Synchronization must include:

- Explicit pending, syncing, synced, and failed states.
- Idempotent imports.
- Bounded retry behavior.
- Per-record completion tracking.
- Conflict handling.
- Recovery after reload or interrupted network access.
- Server confirmation before deleting local recovery data.

Do not upload the entire local dataset blindly on every login.

Separate anonymous guest data from locally cached account data. Logging into account B must not silently import account A’s cached work.

When anonymous data ownership is ambiguous, provide a concise import choice without discarding the data.

Validate imported content and mark historical local scores as imported or unverified where applicable. Do not import client-authored roles, trusted scores, or group membership.

Acceptance:

- Interrupted synchronization resumes without duplicates.
- Offline drafts survive refresh.
- Switching accounts does not leak or mix private records.
- A failed server write does not erase the local copy.

## 7. Persist Speaking recordings correctly

Audit Speaking recording creation, playback, download, and deletion.

Implement a recording lifecycle:

- Saved on this device.
- Uploading.
- Saved to account.
- Upload failed.
- Deleting or deletion failed.

For guests, persist recordings in IndexedDB.

For authenticated users, upload to:

private-users/{uid}/recordings/{recordingId}/...

Store metadata in Firestore, including owner, task reference, MIME type, duration, storage path, timestamps, and processing status.

Use browser-supported MediaRecorder formats. Do not assume every device records WebM. File extension, MIME type, and playback must agree.

Handle:

- Microphone permission denial.
- Recording limits.
- Upload interruption.
- Metadata write failure after successful upload.
- Duplicate upload requests.
- Orphaned files.
- Deletion of both file and metadata.
- Object URL cleanup.

Do not delete the local recovery copy until upload and metadata persistence succeed.

Private recordings must not become permanently public through broadly shared download links. Use an appropriate authenticated delivery mechanism.

Acceptance:

- A recording survives refresh.
- A saved account recording opens on another device.
- Another learner cannot read it.
- Deletion removes the recording from normal access and handles partial failures honestly.

## 8. Replace fabricated dashboard data

Find hard-coded learner statistics, including values such as “83%,” “Band 7.0,” and a permanently selected “Urban Gardens” next activity.

Replace them with actual account or guest activity.

Distinguish no data from a zero result:

- Accuracy: “No completed tests yet.”
- Band estimate: unavailable until justified by suitable results.
- Vocabulary due: actual count, including zero.
- Mistakes: actual pending count.

Do not assign an IELTS band to a short drill.

Use shared selectors or aggregation logic so Dashboard, Progress, Results, and Study Plan agree.

Implement an explainable next-activity order:

1. An unfinished activity.
2. A relevant upcoming group assignment.
3. Due vocabulary or scheduled revision.
4. A new exercise targeting a demonstrated weakness.
5. Diagnostic or introductory practice when evidence is insufficient.

Show a short reason for the recommendation.

Respect configured daily minutes and timezone. Avoid fixed “30 minutes” behavior when the user selected another amount.

Do not count idle page-open time as completed study.

Acceptance:

- A new account shows honest empty states.
- Completing an attempt updates the correct metrics once.
- Retakes remain distinguishable.
- Recommendations reference available, authorized content.

## 9. Implement the dictionary server adapter

Create or fix /api/dictionary using the project’s existing conventions.

Route dictionary lookups through the server.

Requirements:

- Accept a bounded word input, not arbitrary URLs.
- Validate and normalize without corrupting legitimate lookup terms.
- Encode the upstream path safely.
- Use an upstream timeout.
- Apply rate limits appropriate to authenticated and guest usage.
- Deduplicate simultaneous identical lookups.
- Cache results with a documented TTL.
- Handle not-found responses differently from upstream outages.
- Preserve source and license attribution.
- Provide a controlled stale-cache fallback when appropriate.

A process-local cache is not a shared cache across instances. Document its limitations or use an existing suitable shared mechanism.

Do not claim the proxy eliminates external outages.

Update Reading to consume the internal endpoint. Dictionary errors must not clear selections, answers, highlights, or comments.

Acceptance:

- Invalid input is rejected.
- Arbitrary URL fetching is impossible.
- Repeated lookups use cache where expected.
- Timeout and not-found states produce useful UI messages.
- Reading remains usable during provider failure.

## 10. Add the missing Custom Speaking interface

Reuse custom-tasks-service.ts after inspecting its actual schema.

Add an accessible “Create your own topic” action supporting:

- Part 1 questions.
- Part 2 cue card with supporting points.
- Optional Part 3 questions when compatible with the current model.

Validate title, text, and reasonable input limits.

Keep custom tasks private by default.

Allow creating, editing, starting, and deleting a custom task. Preserve historical recordings if a task is subsequently edited or removed by storing the necessary task snapshot.

Use the existing preparation timer, recording flow, and persistence.

Acceptance:

- A custom cue card can be saved, reopened, and practiced.
- It survives refresh.
- It remains private.
- Historical recordings retain understandable task context.

## 11. Separate real audio playback from browser TTS

Audit Listening controls and claims.

Support distinct audio sources:

- Recorded audio file.
- Browser speech synthesis.

Do not present browser TTS as a prerecorded studio file.

For recorded audio, implement a real audio element with:

- Loading and playback errors.
- User-initiated playback.
- Duration and current position.
- Supported seeking and speed controls.
- Mobile behavior and recovery.
- Mode-specific control restrictions.

Use structured transcript segments with verified start/end timestamps. Clicking a segment must seek to its actual position.

Do not estimate precise timestamps from character count or present a simulated scrubber as accurate playback control.

If TTS cannot support a control reliably, adapt or disable that control with an understandable state.

Provide Admin CMS support for uploading licensed/original audio and editing transcript timing. Validate assets before publication.

Do not fetch arbitrary admin-supplied remote URLs server-side without appropriate safeguards.

Acceptance:

- Recorded audio plays and seeks correctly.
- Transcript synchronization remains correct when playback speed changes.
- Missing audio is not shown as ready.
- Practice and simulation controls follow their documented rules.

## 12. Fix mobile Reading and Listening

Reading:

- Use Passage / Questions tabs where side-by-side panels are impractical.
- Preserve each panel’s scroll position.
- Keep the selection toolbar within the visible viewport.
- Handle virtual keyboard and viewport changes.
- Preserve selection when opening toolbar actions.
- Prevent menus and bottom navigation from covering inputs.
- Keep annotations anchored through font-size changes and reloads.
- Test repeated words and multiline selection.

Listening:

- Preserve table row/column meaning.
- Use stacked cards only when the relationship remains clear.
- Retain contained horizontal scrolling where it is the better accessible representation.
- Share the same answer state across responsive layouts.

Test narrow mobile widths and available real devices. If real-device touch or microphone testing is unavailable, report it explicitly.

Acceptance:

- No accidental page-level horizontal overflow.
- Touch selection and input editing remain practical.
- Changing tabs or orientation does not lose answers.

## 13. Implement accessible Map and Diagram Labelling

After critical fixes, add the missing question renderer if supported by the content model.

Provide:

- Real image asset.
- Stable target IDs.
- Relative coordinates where positional overlays are required.
- Accessible labels and instructions.
- Click/tap target selection.
- Select or option-button alternative.
- Keyboard interaction.
- Optional drag-and-drop enhancement.
- Integration with draft saving, flags, grading, and results.

Do not make drag-and-drop the only interaction.

Use original or licensed sample content and validated answer keys.

## 14. Audit content claims and repetition logic

Generate a content inventory from actual data:

- Unique Reading passages.
- Full Reading tests.
- Catalog entries.
- Listening sections and complete tests.
- Audio readiness.
- Supported question types.
- Source, license, and review status.

Do not equate catalog cards with unique material.

Correct inconsistent counts and unsupported labels such as “official,” “real exam,” “Cambridge,” or “prediction” when evidence is absent. Prefer accurate descriptions such as “IELTS-style practice.”

Audit vocabulary scheduling. If buttons always assign fixed 1/2/4/7-day intervals, do not label the implementation SM-2 without implementing and documenting the actual adaptive algorithm.

Either implement the intended scheduling correctly with review-history tests, or name the simpler algorithm honestly.

Verify that mock-test packages have working attempt state, module transitions, resume behavior, and appropriate results. Do not advertise an operational full mock based only on a package card.

Do not add large quantities of unreviewed content during stabilization.

## 15. Verification and delivery

Use existing tooling where practical.

Required checks:

- Type checking.
- Supported lint command.
- Production build.
- Focused unit tests for grading, scheduling, aggregation, and idempotency.
- Firebase Emulator security-rule tests.
- Server-handler authorization tests.
- Concurrent group membership tests.
- Guest synchronization recovery tests.
- Relevant end-to-end learning flows.

Do not claim that passing Firestore Rules tests proves Admin SDK handlers are secure; test them separately.

Keep production data untouched during testing. Seed emulator data explicitly.

Implement in this order:

A. Baseline, server/client boundaries, authorization, grading security, group transactions.
B. Guest synchronization, recording persistence, honest dashboard data.
C. Dictionary proxy, Custom Speaking, real-audio support, mobile fixes.
D. Map/diagram support, content inventory, scheduling corrections, final regression checks.

Finish each coherent phase before proceeding.

If an external credential or service blocks one feature, document the exact blocker and continue independent authorized work. Never replace an unavailable integration with fake successful output.

Final delivery must include:

- Implemented fixes and changed files.
- Actual test/build results.
- Necessary Firebase rules and index changes.
- Environment-variable placeholders without secrets.
- Safe migration/setup instructions.
- Remaining verified limitations.
- Updated STABILIZATION_STATUS.md.

Begin by inspecting the repository and implementing the highest-priority verified issues.