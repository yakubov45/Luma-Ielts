1. Your role and delivery contract
You are a senior full-stack engineer, Firebase security engineer, and educational product designer. Build a real, maintainable IELTS preparation web application. The owner initially uses it personally but intends to grow it into a multi-user platform.

Implement working code, persistence, security rules, validation, tests, and setup documentation. Do not deliver only a landing page, UI mockup, pseudocode, or buttons with no behavior. Do not claim an integration works without testing it. Do not invent API credentials, external service responses, or successful deployments.

Inspect the existing repository and its instructions first. Preserve useful existing work and use its package manager. If no project exists, initialize the stack below. Make routine implementation decisions autonomously. Ask only for genuinely blocking product decisions or credentials; meanwhile continue with Firebase emulators and independent work. Never request secrets in chat: explain which local environment variables the owner must set.

Use the phases below as execution order, not optional scope. Complete a coherent working phase before moving on. If your context is exhausted, save precise completed/pending work in IMPLEMENTATION_STATUS.md, including checks run and next commands. Never silently drop features. External AI services may remain visibly unconfigured until credentials are supplied; all non-AI flows must work.
2. Product direction and scope
Core learning loop: practice → understand the error → targeted revision → practice again → measure progress.

Default exam track: IELTS Academic. Store examTrack in the data model so General Training can be added later without mixing its tasks or score conversions into Academic. Do not claim General Training support until its content and marking are implemented.

The application must have Reading, Listening, Writing, Speaking, Vocabulary, Mistakes, Progress, Study Plan, Settings, and an Admin CMS. Do not add payments, subscriptions, public social feeds, leaderboards, or unrelated features in this build.

Use English for test content. Provide Uzbek and English interface translations with centralized message keys. Default the interface to Uzbek; keep technical naming in source code English. Use the user's configured timezone for daily plans and streak dates; default to Asia/Tashkent.
3. Technology and architecture
For a new project use Next.js App Router, React, TypeScript strict mode, Tailwind CSS, accessible reusable UI components, Zod validation, Firebase modular Web SDK, Firebase Admin SDK in server-only modules, Firebase Authentication, Cloud Firestore, and Cloud Storage for Firebase. Use mutually compatible current stable versions, verify official documentation, and commit the lockfile. Avoid experimental dependencies unless necessary.

Use a Node-capable Next.js runtime for privileged routes; do not design this as a static export. Firebase is the authentication, database, and file storage backend. Do not introduce another database or a separate Express server. Prefer Next.js server routes for grading, admin publication, and AI integrations. Cloud Functions are optional only if a concrete background task requires them.

Keep modules separated by responsibility: authentication, content, attempts/grading, annotations, dictionary, vocabulary/review scheduling, writing, speaking, audio, study plans, progress, admin, and AI adapters. Keep Firebase client initialization separate from Admin SDK initialization. No service-account material or AI secrets may enter browser bundles.

Ship .env.example with placeholders, firebase.json, firestore.rules, storage.rules, firestore.indexes.json, emulator configuration, validated seed/import scripts, and README.md. Firebase public web configuration is not an authorization mechanism; security comes from verified identity, server authorization, and rules.

Cloud Storage currently requires a billing-enabled Blaze project. Verify current requirements when implementing. Document expected billable services and budget alerts, explaining that alerts are not spending caps. Do not promise production is entirely free. Emulators must allow local core development without production billing.
4. UX and routes
Build a quiet, polished learning workspace: neutral background, restrained blue/teal accent, readable typography, good whitespace, clear controls, and no decorative clutter. Support light/dark themes, keyboard navigation, visible focus, accessible dialogs, and touch targets. Respect reduced motion.

Suggested routes: /dashboard, /reading, /reading/[testId], /listening, /listening/[testId], /writing, /writing/[attemptId], /speaking, /vocabulary, /mistakes, /progress, /study-plan, /settings, /admin, /admin/content/[contentId], /results/[attemptId], and authentication pages. Adapt route details where needed while keeping the navigation simple.

Desktop Reading uses adjustable side-by-side passage/questions panels. Mobile uses clear Passage/Questions tabs and a persistent question navigator without losing draft answers or text selection. Provide font size, comfortable line spacing, answer status, flags, timer, save status, and resume.

Every view needs real loading, empty, success, retry, offline, permission-denied, and error states as applicable. Never show fabricated progress numbers. Label sample content explicitly. Do not expose administrative implementation details in normal learner screens.
5. Authentication and permissions
Implement email/password sign-up and login, email verification flow, password reset, logout, and Google sign-in when configured. Provide account settings and onboarding for target band, exam date, daily study minutes, timezone, and interface language. A self-reported current band must be labeled self-reported, not measured.

Use learner and admin roles. Admin authority comes from verified custom claims assigned by a documented privileged bootstrap script. A client-editable profile field must never grant admin powers. Protect both admin pages and every privileged API operation. Hiding navigation is not authorization.

For authenticated server requests, verify Firebase ID tokens and derive uid from the verified token; never trust a caller-supplied uid. Firebase Admin SDK bypasses Firestore rules, so enforce ownership, role, payload validation, and state-transition authorization in every server handler too. Do not put personal responses in shared server caches. If using cookies, implement secure cookie and CSRF protection correctly.
6. Firestore and Storage design
Write typed schemas and a DATA_MODEL.md before implementing dependent queries. The following is a recommended collection layout; refine it only with documented reasoning:
- users/{uid}: safe profile fields, goals, locale, timezone, preferences, createdAt, updatedAt.
- content/{contentId}: catalog metadata, skill, examTrack, title, tags, status, publishedVersion, estimatedDuration, attribution, license, review status. Learners query only published content.
- content/{contentId}/versions/{versionId}: immutable published version metadata.
- content/{contentId}/versions/{versionId}/sections/{sectionId}: passage text, public question definitions, asset references; split further if document size requires it.
- contentKeys/{versionKey}/sections/{sectionId}: correct answers, accepted variants, evidence, explanations, scoring configuration, transcripts/model answers that must remain hidden before submission. Deny direct learner reads.
- users/{uid}/attempts/{attemptId}: content/version, mode, skill, status, startedAt, deadlineAt, submittedAt, draft answers, current section, flags, revision, retake indicator. Scores and canonical timing are server-owned.
- users/{uid}/attempts/{attemptId}/results/{resultId}: immutable server-written grading results and permitted post-submission explanations.
- users/{uid}/annotations/{annotationId}: content/version, passage/paragraph IDs, range anchors, highlight color, optional comment, timestamps.
- users/{uid}/vocabulary/{wordId}: normalized lemma, selected sense, definition, source attribution, original sentence, passage link, personal note, pronunciation reference, review scheduling state.
- users/{uid}/reviewEvents/{eventId}: immutable review history with idempotency key.
- users/{uid}/mistakes/{mistakeId}: skill, question type, source attempt/question, explanation, review state.
- users/{uid}/studyDays/{localDate}: timezone, planned tasks, completion state.
- users/{uid}/dailyStats/{localDate}: server-controlled aggregate progress.
- users/{uid}/recordings/{recordingId}: private Storage object path, duration, MIME type, transcript/processing status.
- aiJobs/{jobId}: server-owned job status, owner, input references, provider/model/prompt version, cost/usage metadata, result references.
- contentReports/{reportId}: owner, content/version/question, reason, moderation status.
- auditLogs/{eventId}: server-written admin actions.
Do not put all tests, all answers, all user activity, or growing recordings into one document. Store media files in Storage, never as Firestore base64. Paginate catalogs/history and provide required composite indexes. Avoid broad realtime listeners and N+1 reads. Use bounded queries and aggregate documents for dashboard views.

Enforce owner-only private data access, strict field allowlists/types, allowed state changes, and immutable ownership. Deny client writes to scores, admin claims, aggregates, results, AI jobs, and answer keys. Prevent profile updates from adding privileged fields. Queries must satisfy rules; rules are not filters. Test learner A versus learner B access.

Storage paths: published-content/{contentId}/{versionId}/... and private-users/{uid}/recordings/{recordingId}/.... Validate MIME types and maximum sizes in rules and server workflows. Only authorized admins upload test assets. Private recordings must not use permanently public share URLs. Use authenticated reads or short-lived authorized delivery. Explain deletion of Auth, Firestore subcollections, and Storage objects; deleting a parent Firestore document alone is insufficient.
7. Content schema, publication, and examples
Use discriminated unions for question types with stable question/option IDs, instructions, limits, answer shape, and type-specific validation. Initial Reading support: single choice, multiple choice, True/False/Not Given, Yes/No/Not Given, matching headings/information, sentence completion, and summary completion. Listening support: choice, form/note/table completion, and matching. Map/diagram labeling requires a real asset and accessible labels; implement as a subsequent content type rather than a fake unsupported option.

Provide original, reviewed sample exercises covering implemented types. Short drills must be labeled drills, not full mock exams. Only call a test a full mock when its structure, question count, sections, and timing match the implemented exam format. Verify format and scoring references from official IELTS sources.

Every content record includes source, creator, source URL when applicable, license, attribution, AI-generated flag, reviewedBy/reviewedAt, and schemaVersion. A publicly accessible website is not automatically reusable content. Do not scrape or redistribute Cambridge/British Council materials without permission. Optionally inspect https://github.com/LuchoBazz/ielts-ai-dataset and import only validated compatible content with license attribution; do not assume its schema, quality, or available audio is correct.

Admin lifecycle: draft → review → published → archived. Publication validates all questions, answer keys, evidence anchors, assets, and attribution. Published versions are immutable. Editing creates a new version; existing attempts remain pinned to their original version so results and highlights stay reproducible.
8. Reading selection, highlights, and comments
Support selecting a word or text range with mouse or touch. Show an accessible floating action toolbar: Highlight, Comment, Definition for a single word, Save Word. A keyboard-accessible alternative must exist. Keep the selected range when focus moves to the toolbar. Position the menu inside the viewport and do not hijack normal scrolling or native selection behavior.

Use stable paragraph IDs and normalized plain-text offsets, plus exact quote/prefix/suffix anchors, tied to contentVersion. Do not persist DOM Range objects, fragile CSS selectors, or only the selected string. Handle repeated words, punctuation, multiline selection, overlapping highlights, theme changes, and multiple annotations predictably. Sanitize rendering and avoid injecting raw user HTML.

Allow changing/removing highlight color and creating/editing/deleting comments. Show annotations in a sidebar with jump-to-text links. Reloading, resizing, changing font size, or switching devices must preserve annotation placement. If an anchor cannot resolve, show an orphaned annotation rather than attaching it to unrelated text.
9. Dictionary and vocabulary
Use https://api.dictionaryapi.dev/api/v2/entries/en/{word} through a controlled server adapter. Normalize lookup input carefully, encode path components, restrict length, and reject arbitrary URLs. Support inflected words with explicit fallback suggestions rather than silently changing meaning.

Show pronunciation/IPA, part of speech, numbered English meanings, examples/synonyms where actually provided, audio where available, and source/license attribution. Let the user select the relevant sense. Never claim a generic dictionary automatically knows which sense the passage intends. Missing definition/audio and provider timeout must not block Reading.

Use bounded caching with TTL, request deduplication, timeout, rate limits, and safe external URL handling. Do not treat this API as a complete IELTS word list or guaranteed uptime service.

Save the selected meaning and original passage sentence, not just the bare word. Deduplicate meaningfully and preserve multiple contexts. Add search/filter, personal Uzbek notes, and source links. Implement spaced repetition with a documented deterministic algorithm: Again/Hard/Good/Easy, dueAt, interval, review history, timezone-aware daily queues. Prevent duplicate reviews on retries. Offer definition recall and cloze sentences. Do not depend on paid AI for flashcards or scheduling.
10. Attempts, timing, grading, and results
Practice mode: optional dictionary/help, pausing, replay, post-answer feedback where appropriate. Exam simulation mode: enforce the configured timing/audio flow; withhold dictionary, answer evidence, transcripts, and model answers until submission. Describe it as a simulation, not an official test environment or anti-cheating guarantee.

Start attempts on the server with authoritative timestamps and version references. Render timers from an absolute deadline, not decrement-only intervals. Survive refresh, tab sleep, network loss, and device clock differences. Make server submission idempotent. Grade against the pinned private answer key, never a score sent by the browser. Define expiration, offline grace behavior, and retake rules explicitly; do not accept late exam edits silently.

Autosave drafts with debounce and flush on navigation where feasible; show saving/saved/offline/failed states. Keep a local recovery copy with clear ownership and clear it appropriately on logout. Detect multi-tab/device conflicts with revisions instead of silently overwriting newer work.

Use question-specific deterministic grading: case/whitespace normalization, explicit accepted variants, word limits, ordered/unordered multiple responses as configured, and justified number formatting. Do not globally strip spelling, punctuation, or plurality in ways that turn wrong answers into right ones. Unit test edge cases. Partial credit must be explicit per question, never assumed.

Results show correct count, question-by-question answers, evidence sentences, paraphrase relationships, and why incorrect options fail when authored. Only show band estimates with a documented skill/track-specific mapping and caveat; short drills show accuracy, not a fabricated IELTS band. New-test results and retakes are separate in progress.
11. Listening
Implement actual audio playback with explicit user start, loading/error recovery, volume, and accessible controls. Practice mode supports seeking, speed, repeat segment, timestamped transcript, clicking a sentence to seek, and dictation comparison. Keep transcript timing in structured segments. Identify spelling/word-limit errors and authored distractor explanations.

Exam simulation must have a clearly defined permitted playback sequence and question review flow. Handle browser autoplay restrictions and interrupted media honestly. Provide original or licensed playable sample audio; if synthesis is unavailable, support admin upload and clearly identify that sample as awaiting an asset. Never render a pretend functional player.
12. Writing
Task 1 supports a real chart/table/diagram asset and accessible description; Task 2 supports essay prompts. Implement timer, live word count, autosaved drafts, outline area, manual notes, submission history, and revisions with side-by-side comparison.

Optional AI feedback returns validated structured data for Task Achievement/Task Response as applicable, Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy; estimated scores; text-anchored comments; strengths; and exactly three prioritized next actions. Keep the original essay intact. Missing criteria must not become zero scores. Task 1 feedback must receive the chart information and acknowledge when it cannot interpret the asset. Clearly label AI feedback and estimated scores as unofficial.
13. Speaking
Support Parts 1/2/3 and a mock sequence with configurable verified timing, cue cards, recording, replay, and repeat attempts. Use browser recording capabilities with feature/MIME checks, microphone permission handling, recording duration/file limits, and recovery states.

Upload recordings privately with explicit user action. Transcription and AI feedback are optional provider-backed features. Synchronize transcript timestamps with playback when available. Fluency metrics should be transparently derived and not presented as official scores. Never infer pronunciation scores from text alone. Adaptive follow-up questions may use AI only when configured; otherwise use authored follow-ups.

Explain processing before external AI submission, offer deletion, and avoid logging raw essays/audio/transcripts. Define retention settings and implement associated deletion paths.
14. AI infrastructure and cost control
Implement provider-independent interfaces for writing feedback, transcription, audio-aware speaking feedback, and follow-up generation. Do not choose or invent a free unlimited provider. Read configured provider documentation before implementation. AI keys stay server-side.

Use validated structured outputs, content length limits, per-user quotas, concurrency limits, timeouts, bounded retries, idempotency, input hashing, and processing states. Track provider/model/prompt version and usage. Reuse an existing job for repeated identical submission when appropriate. Treat student text as untrusted data, not instructions; do not allow it to override grading rules or reveal secrets. Do not send unrelated profile information.

An unconfigured provider must show a clear unavailable/setup-required state. All manual practice continues working. No fake AI scores, hard-coded feedback disguised as live analysis, or invisible recurring costs.
15. Mistakes, planning, and progress
Create a personal mistake notebook from graded attempts, with evidence, explanation, question type, review scheduling, and links to retry. Mark completion without erasing historical mistakes. Recommend new exercises for weak types using a simple explainable algorithm before adding AI.

Daily plans respect daily minutes, exam date, due vocabulary, and weak skills. Let learners adjust or skip tasks. Mark completion from real actions, not just opening a page. Handle missed days and timezone changes predictably.

Dashboard: next useful action, due vocabulary, today's plan, recent attempts, and honest progress. Track question-type accuracy, first attempts versus retakes, writing revisions, speaking practice duration, and completed study days. Avoid unsupported overall-band claims, misleading comparisons between uncalibrated tests, and idle-tab time counted as study time.
16. Admin CMS
Implement searchable content list, creation/editing, preview, section/question editor, answer variants, evidence anchors, explanations, paraphrase pairs, audio/transcript uploads, review/publication, archive, reports, and audit history. Validate JSON imports with schema version, actionable errors, preview/dry-run, duplicate handling, and explicit commit. Never execute imported HTML/scripts or fetch arbitrary imported URLs server-side.

Provide a documented first-admin bootstrap and idempotent seed process. Production seeding must require explicit project selection and never run automatically on app startup. Preserve existing user data. Bulk destructive operations need a clear scope and confirmation.
17. Reliability, privacy, and cost
Set bounded upload limits, pagination, cache limits, safe retries, cancellation, and listener cleanup. Debounce draft writes; never write on each timer tick. Avoid storing large arrays, unnecessary audio copies, or unlimited job histories. Keep private offline caching opt-in for shared devices and document logout cleanup.

Implement account-data export and deletion, including recordings, drafts, annotations, vocabulary, and related jobs. Log errors with identifiers and safe metadata, not private content or tokens. Add accessible report-a-content-error functionality. Validate user-generated text and URLs and enforce server-side rate limits on expensive/public endpoints. Consider Firebase App Check as an additional abuse-control layer, never a substitute for authentication or rules.
18. Implementation phases and acceptance gates
Phase 1 — Foundation: project, UI shell, Auth, onboarding, rules/indexes/emulators, typed schemas, admin bootstrap, original seed content. Gate: two users can log in and cannot read or mutate each other's private data.

Phase 2 — Complete Reading: real catalog, passages/questions, selection toolbar, highlights/comments, dictionary, save word, persistent draft/restore, timer, server grading, results/evidence, basic authoring/import. Gate: finish a seeded exercise end-to-end, reload annotations, inspect deterministic score, and verify answers are absent from pre-submission payloads.

Phase 3 — Learning loop: vocabulary repetition, mistake notebook, targeted drills, daily plan, first-attempt/retake progress. Gate: saved passage word becomes a due review and a wrong answer becomes a reviewable mistake without duplication.

Phase 4 — Listening: actual assets, practice player, transcript, dictation, simulation, grading. Gate: playable audio, seeking to transcript segments, answer persistence, and correct results.

Phase 5 — Writing: editor, charts/prompts, drafts/revisions, optional real provider feedback adapter. Gate: edits survive reload; manual flow works without AI; configured integration is tested or explicitly unverified.

Phase 6 — Speaking: parts/cue cards, browser recording, private storage, replay, optional transcription/audio feedback. Gate: recording/replay/deletion work and another user cannot retrieve the recording.

Phase 7 — Production readiness: complete CMS, accessibility/responsive QA, error handling, security regression tests, cost notes, setup/deployment guide, final build. Gate: no fake core interactions, no secrets, passing required checks, clear remaining credential-dependent limitations.
19. Required testing
Use focused unit tests for grading, limits, scheduling, timezone behavior, anchors, and idempotency. Firebase Emulator tests must cover unauthenticated access, cross-user access, owner access, role escalation, private answer keys, draft publication, score mutation, and Storage ownership/size/type restrictions. Test privileged server handlers separately because Admin SDK bypasses rules.

Add end-to-end tests for sign-in → Reading → annotate → lookup/save → answer → reload → submit → results → vocabulary review; include failed dictionary responses, duplicate submit, and expired timer. Cover admin publication and user isolation. Test keyboard access, mobile layout, repeated-word anchoring, and multi-paragraph selections. Browser automation does not prove real-device touch selection or microphone behavior: perform real checks if available, otherwise explicitly list those as unverified.

Run type checking, linting, relevant unit/rules/E2E tests, and production build. Fix failures in scope. State what actually ran and what could not run; do not call an unchecked feature production-ready.
20. Deliverables and final report
Deliver the complete source repository, setup README with Windows PowerShell-compatible commands, .env.example, Firebase configuration/rules/indexes, emulator workflow, schemas, original seeds, admin setup, content import examples, tests, architecture/data model notes, and IMPLEMENTATION_STATUS.md.

README must explain Firebase project creation, enabling Auth providers/authorized domains, Firestore/Storage setup, region selection, server credentials, emulator connection guards, billing requirements, local startup, rules/index deployment, seeding, admin bootstrap, and Node-runtime deployment. Do not deploy publicly or spend money without authorization.

Start now: inspect the workspace, state a brief implementation sequence, then write and test Phase 1 and proceed through the remaining phases. In your final response summarize implemented behavior, exact verification results, how to run it, and any concrete external-configuration blockers. Do not stop after restating this specification.
Reference documentation to verify during implementation:
- https://firebase.google.com/docs/firestore/security/get-started
- https://firebase.google.com/docs/firestore/security/test-rules-emulator
- https://firebase.google.com/docs/storage/web/start
- https://firebase.google.com/docs/projects/billing/firebase-pricing-plans
- https://dictionaryapi.dev/
- https://github.com/LuchoBazz/ielts-ai-dataset