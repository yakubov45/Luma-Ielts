# Data model

`users/{uid}` holds only safe learner settings. Its `role` is deliberately absent: authority comes only from a verified Firebase custom claim.

Private subcollections: `attempts`, `annotations`, `vocabulary`, `reviewEvents`, `mistakes`, `studyDays`, `dailyStats`, and `recordings`. Result scores and daily aggregates are server-owned in later phases.

Published content is versioned under `content/{contentId}/versions/{versionId}`. Correct answers are isolated in `contentKeys/{contentId_versionId}` and are never readable by learners. Attempts retain both identifiers, making grading reproducible after later content edits.

Storage uses `published-content/{contentId}/{versionId}/...` and `private-users/{uid}/recordings/{recordingId}/...`. Parent-document deletion does not delete subcollections or files; future account deletion will enumerate both explicitly.
