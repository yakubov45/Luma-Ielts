# IELTS Platform Stabilization Status

**Date**: 2026-10-31  
**Project**: IELTS Focus (`ielts-prep-foundation`)  
**Specification**: [newplan.md](file:///c:/Users/yoqub/OneDrive/Desktop/Ielts%20Website/newplan.md)  
**Baseline Git Snapshot**: `d600000` (`chore: baseline snapshot before stabilization`)

---

## 1. Verified Issues & Resolution Status

| Issue Area | Severity | Affected Files | Verified Root Cause / Analysis | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Server/Client Leak in Groups API** | High | `src/app/api/groups/join/route.ts`, `src/lib/services/server/groups-server-service.ts` | Server route imported client `groups-service.ts` which accessed browser `localStorage`. Resolved with dedicated server-only transaction service using Firebase Admin SDK. | **RESOLVED (Phase A)** |
| **Non-Atomic Group Capacity** | High | `src/lib/services/server/groups-server-service.ts`, `src/app/api/groups/join/route.ts` | Capacity (5-15 rule) was previously checked in client memory. Now strictly enforced inside an atomic Firestore Admin transaction (`runTransaction`). Concurrent joins beyond 15 are rejected. | **RESOLVED (Phase A)** |
| **Admin Authorization & Custom Claims** | High | `src/app/(app)/admin/page.tsx`, `src/lib/auth/server.ts`, `firestore.rules` | Admin mutations and pages now strictly verify Firebase ID token custom claims (`admin: true`) rather than relying on client profile fields. Returns 403 Forbidden with security boundary. | **RESOLVED (Phase A)** |
| **Server-Controlled Grading & Keys** | High | `firestore.rules`, `src/app/api/attempts/[attemptId]/submit/route.ts` | `contentKeys/{document=**}` locked against direct client access (`allow read, write: if false`). Server grades attempts and returns existing results idempotently on retries. | **RESOLVED (Phase A)** |
| **Fabricated Dashboard Statistics** | Medium | `src/app/(app)/dashboard/page.tsx`, `src/lib/services/attempts-service.ts` | Hardcoded `83%`, `Band 7.0`, and fake weekly minutes removed. Empty attempts evaluate to honest empty states (`totalAttempts: 0`, `overallAccuracy: null`, `estimatedBand: null`). | **RESOLVED (Phase B)** |
| **Auto-Seeding Fake Samples** | Medium | `vocabulary-service.ts`, `mistakes-service.ts` | Eradicated automatic seeding of sample words and mistakes into fresh user accounts. Added explicit user-triggered sample deck loader on empty state. | **RESOLVED (Phase B)** |
| **Guest Sync & Account Isolation** | High | `src/lib/services/sync-service.ts`, `login-form.tsx`, `signup-form.tsx`, `app-shell.tsx` | Created explicit guest data sync engine that migrates guest buffer to Firestore on login, preserves local buffer on network failure, and purges session state on sign-out to prevent cross-account leaks. | **RESOLVED (Phase B)** |
| **Speaking Audio Ephemeral in Browser** | High | `src/app/(app)/speaking/page.tsx`, `src/lib/services/speaking-service.ts` | Added IndexedDB binary blob persistence for offline/guests, and Firebase Storage upload to `private-users/{uid}/recordings/{recordingId}` for authenticated users with status badges. | **RESOLVED (Phase B)** |
| **Missing Custom Speaking Interface** | Medium | `src/app/(app)/speaking/page.tsx`, `src/lib/services/custom-tasks-service.ts` | Built accessible "Mavzu yaratish" (Custom Cue Card modal) supporting Part 1, 2, and 3 with full persistence and task snapshotting. | **RESOLVED (Phase C)** |
| **Missing Dictionary Server Proxy** | Medium | `src/app/api/dictionary/route.ts`, `src/components/reading/reading-workspace.tsx` | Created `/api/dictionary` with input bounded to 45 chars, regex safety, 5s timeout, rate limiting (60 req/min), in-memory TTL caching (24h valid, 1h 404), and stale-cache fallback. | **RESOLVED (Phase C)** |
| **Audio Playback vs Browser TTS** | Medium | `src/components/listening/ListeningWorkspace.tsx` | Distinct audio engines implemented: studio recorded `<audio>` element with seekable scrubber, rate adjustment, and transcript synchronization vs Speech Synthesis fallback. | **RESOLVED (Phase C)** |
| **Mobile Layout (Reading & Listening)** | Medium | `src/components/reading/reading-workspace.tsx`, `ListeningWorkspace.tsx` | Added sticky mobile Passage/Questions tab switcher with answered counter, clamped selection toolbar to viewport, and added horizontal scroll indicator for Listening table. | **RESOLVED (Phase C)** |
| **Map & Diagram Labelling** | Medium | `src/components/common/MapDiagramLabelling.tsx` | Built accessible question renderer with SVG floorplans, click-to-pin targets, and accessible `<select>` dropdown alternatives for keyboard/screen reader accessibility. | **RESOLVED (Phase D)** |
| **Content Claims & Repeated Material** | Medium | `src/app/(app)/mock-tests/page.tsx`, `src/app/(app)/listening/page.tsx`, `groups-service.ts` | Renamed unsupported "Cambridge" and "Prediction" claims to "IELTS-style practice". Connected mock test packs directly to authentic 40-question tests `rd-mock-1` through `rd-mock-10`. | **RESOLVED (Phase D)** |
| **Adaptive SM-2 Spaced Repetition** | Medium | `src/lib/services/vocabulary-service.ts`, `scripts/test-new-functions.mjs` | Verified genuine SM-2 adaptive scheduling (easeFactor adjustments, Again reset to 1 day, Good progression, Easy bonuses) and added automated unit tests. | **RESOLVED (Phase D)** |

---

## 2. Implementation Progress by Phase

### Phase A: Baseline, Boundaries, Admin Security & Group Transactions
- [x] Git repository initialized, `.gitignore` audited for secrets & credentials.
- [x] Baseline snapshot committed (`d600000`).
- [x] Created server group service (`src/lib/services/server/groups-server-service.ts`) using Firebase Admin SDK Firestore transactions.
- [x] Refactored `/api/groups/join` to verify caller ID token, reject forged UIDs, validate payload with Zod, and enforce 5–15 capacity atomically.
- [x] Enforced custom claims verification for admin server routes and actions (`admin: true`), returning 401/403.
- [x] Server-controlled grading integrity and idempotent attempt submissions in `/api/attempts/[attemptId]/submit` with deadline checking.

### Phase B: Guest Sync, Recording Persistence & Honest Dashboard
- [x] Replaced fabricated metrics in `src/app/(app)/dashboard/page.tsx` (`83%`, `7.0`, "Urban Gardens") with honest empty states and explainable recommendation hierarchy.
- [x] Eradicated auto-seeding of fake sample attempts, vocabulary, and mistakes.
- [x] Speaking audio persistence: IndexedDB for guests, Firebase Storage upload to `private-users/{uid}/recordings/{recordingId}` for authenticated users.
- [x] Created `sync-service.ts` to manage guest data migration on sign-in and session clearing on sign-out.

### Phase C: Dictionary Proxy, Custom Speaking, Audio & Mobile
- [x] Created `/api/dictionary` server proxy with bounded word sanitization, 5s timeout, in-memory TTL caching, and rate limiting.
- [x] Updated `reading-workspace.tsx` to route lookups through internal `/api/dictionary`.
- [x] Added Custom Speaking Creation modal and UI in `src/app/(app)/speaking/page.tsx` with Part 1, Part 2 cue cards, and Part 3 prompts.
- [x] Differentiated real recorded studio audio from browser TTS in `ListeningWorkspace.tsx`.
- [x] Mobile layout optimizations: Passage/Questions tab switcher, toolbar viewport clamping, and contained table scrolling hints.

### Phase D: Map/Diagram Support, Content Inventory & Final Regression
- [x] Implemented `MapDiagramLabelling.tsx` question component with accessible inputs and keyboard support.
- [x] Audited and corrected content claims ("Cambridge", "official", "prediction" -> "IELTS-style practice").
- [x] Connected mock test packs to authentic 40-question tests `rd-mock-1` through `rd-mock-10`.
- [x] Verified and documented SM-2 Spaced Repetition adaptive algorithm with automated tests.
- [x] Expanded test suite to 14 automated tests covering group lifecycle, diagnostic, confidence tracking, SM-2, guest sync, and user isolation.

---

## 3. Checks & Verification Log

| Check | Tool / Command | Result | Notes |
| :--- | :--- | :--- | :--- |
| **Git Status** | `git status` | Clean / Tracked | `.env.local` and secret patterns excluded. |
| **Type Check** | `npx tsc --noEmit` | **PASS (0 errors)** | Strict mode verified across all `.ts` and `.tsx` files. |
| **Test Suite** | `npm test` | **PASS (14/14 tests)** | Group lifecycle, SM-2 scheduling, guest sync, user isolation, mock tests. |
| **Production Build** | `npm run build` | **PASS (28 routes)** | Turbopack static & dynamic route compilation clean. |

---

## 4. Summary of Key Files Changed

- `firestore.rules`: Locked `contentKeys`, restricted CMS to admin custom claim, secured `groups` and `customSpeakingTasks`.
- `src/lib/services/server/groups-server-service.ts`: Server-side atomic group transaction service.
- `src/app/api/groups/join/route.ts`: Secure group join endpoint with token verification.
- `src/app/api/dictionary/route.ts`: Dictionary server proxy with rate limiting and TTL caching.
- `src/lib/services/sync-service.ts`: Guest data migration and account isolation engine.
- `src/lib/services/attempts-service.ts`: Honest stats computation, guest/user isolation, zero fake samples.
- `src/lib/services/vocabulary-service.ts`: Adaptive SM-2 algorithm, guest/user isolation, zero fake samples.
- `src/lib/services/mistakes-service.ts`: Honest empty state, guest/user isolation.
- `src/lib/services/writing-service.ts`: Per-user draft isolation, safe guest drafts.
- `src/lib/services/speaking-service.ts`: IndexedDB and Firebase Storage dual persistence.
- `src/app/(app)/speaking/page.tsx`: Custom cue card creation modal with Part 1, 2, 3 questions.
- `src/components/reading/reading-workspace.tsx`: Mobile Passage/Questions tabs, viewport toolbar clamping, dictionary proxy integration.
- `src/components/listening/ListeningWorkspace.tsx`: Audio engine distinction, contained responsive table scrolling.
- `src/components/common/MapDiagramLabelling.tsx`: Accessible map/diagram labelling component.
- `src/app/(app)/mock-tests/page.tsx`: Honest practice packs linked to genuine `rd-mock-1..10` 40-question tests.
- `scripts/test-new-functions.mjs`: Comprehensive unit tests for SM-2, guest migration, and user isolation.
