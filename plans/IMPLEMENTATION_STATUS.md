# Implementation Status

## Completed Architecture & Modules

### 1. Phase 1 — Foundation & Security
- **Next.js 16 App Router + React 19 + TypeScript strict mode + Tailwind CSS v4** styling following `design.md` warm white (`#FFF9F5`) and deep burnt orange (`#C2410C`) palette.
- **Firebase Modular Web SDK & Server-only Admin SDK**: Auth, Cloud Firestore, and Cloud Storage configurations.
- **Authentication & Non-blocking Guest Flow**: Users can browse the entire application and complete practice tests without being blocked by registration; authentication is seamlessly optional with graceful local storage fallback and automatic Firestore sync on login (`users/{uid}`).
- **Firestore Security Rules**: Strict path-based ownership rules, private answer key isolation (`contentKeys/{key}`), and server-authoritative submission grading.

### 2. Phase 2 — Reading Module & Text Tools
- **Reading Workspace (`/reading`, `/reading/[testId]`)**: Split-panel responsive view (passage + questions) with text size adjustment, line spacing, timer, and question navigator.
- **Floating Selection Toolbar**: Mouse and touch selection for highlighting, commenting, dictionary definition lookup via controlled API proxy (`/api/dictionary`), and direct "Save Word" to user vocabulary.
- **Deterministic Server-authoritative Grading**: Idempotent grading against private answer keys, evidence highlighting, authored distractor explanations, and IELTS Academic Band score conversion.

### 3. Phase 3 — Learning Loop & Spaced Repetition (SM-2)
- **Vocabulary Repetition (`/vocabulary`)**: Deterministic SM-2 algorithm (`Again`, `Hard`, `Good`, `Easy`) with interval calculations, review history tracking, timezone-aware due queues, modal word creation, and Web Speech Synthesis pronunciation.
- **Mistakes Notebook (`/mistakes`)**: Auto-ingested directly from failed questions in Reading and Listening tests, with live status filtering (`pending` vs `reviewed`), review toggling, and instant retry links.
- **Dynamic Study Plan (`/study-plan`)**: Daily tasks calculated dynamically based on real due Spaced Repetition vocabulary count, real pending mistakes count, and reading drills, stored in Firestore (`users/{uid}/studyDays/{today}`) with interactive completion toggles.
- **Honest Progress Dashboard (`/progress`, `/dashboard`)**: Real KPI cards, IELTS Band estimation, question-type accuracy breakdown, and weekly study time charts derived from real user attempts.

### 4. Phase 4 — Listening Module
- **Listening Workspace (`/listening`)**:
  - Real audio playback using Web Speech Synthesis with natural UK/US voices, playback speed controls (0.75x, 1.0x, 1.25x), progress seeking, and segment repetition.
  - Interactive synchronized transcript where clicking any sentence seeks the audio directly to that timestamp.
  - Form completion, note completion, and multiple-choice questions with real answer evaluation.
  - Attempt persistence via `saveTestAttempt` and automatic failed question recording to the Mistakes Notebook.
  - Dictation Drill mode with word-by-word diff comparison.

### 5. Phase 5 — Writing Module
- **Writing Workspace (`/writing`)**:
  - IELTS Task 1 (visual chart description) and Task 2 (academic essay prompts).
  - Live word count, countdown timer, debounced draft autosaving.
  - Criterion-based IELTS evaluation (Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy) with band estimation and actionable feedback.
  - Submission history storage with past essay review and reload.

### 6. Phase 6 — Speaking Module
- **Speaking Workspace (`/speaking`)**:
  - Parts 1, 2, and 3 cue cards with preparation timer (60s) and response timer (120s).
  - Real browser audio recording using `navigator.mediaDevices.getUserMedia` and `MediaRecorder` API.
  - Live audio waveform animation, HTML5 audio playback (`URL.createObjectURL(blob)`), audio file download (.webm), and recorded session history.

### 7. Phase 7 — Admin Content CMS
- **Admin CMS (`/admin`)**:
  - Content catalog table with search and skill filtering.
  - Modal editor for creating new IELTS reading passages and authoring questions, answer keys, accepted variants, evidence quotes, and explanations.

---

## Acceptance Checks & Verification
- `npm run build`: **PASSED** (all 22 routes compiled, type-checked, and prerendered successfully with zero errors).
- Design system compliance: Strict adherence to `design.md` Warm White (`#FFF9F5`), Deep Burnt Orange (`#C2410C`), responsive sidebar (`app-shell.tsx`), and typography.
