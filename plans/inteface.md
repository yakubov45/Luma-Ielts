You are a senior UX designer and frontend engineer working on an existing IELTS preparation platform.

Your task is to improve the interfaces of the four learning sections — Reading, Listening, Writing, and Speaking — by organizing their content into clear catalogs and making the entire learning journey easy to understand and use.

Inspect the existing application first, then implement the improvements in working code. Preserve existing Firebase integrations, authentication, user progress, saved answers, annotations, and evaluation services.

Follow the established visual identity: warm white backgrounds, deep orange primary actions, soft peach active states, rounded cards, and clean typography.

## 1. Main objective

A learner should immediately understand:

- Which section they are viewing.
- What practice options are available.
- Which activity matches their needs.
- Whether they have already started or completed it.
- How to start, resume, review results, or retry.

Build this consistent journey:

Choose a skill → browse its catalog → choose an activity → practice → review results → continue learning.

Avoid forcing users through unnecessary category pages. Keep the main catalog directly accessible from each skill’s navigation item.

## 2. Shared catalog structure

Each skill must have a consistent catalog page containing:

1. Page title and one short supporting sentence.
2. A “Continue” card when the user has an unfinished activity.
3. Clear category tabs.
4. Search and relevant filters.
5. Content cards or a compact list.
6. Pagination or a bounded “Load more” action.
7. Helpful empty and error states.

Use the same component patterns across all four sections, while adapting categories and metadata to each skill.

Keep progress separate from content discovery. A learner should not have to open the Progress page to find unfinished work.

## 3. Reading catalog

Use these top-level tabs:

- All
- Full Tests
- Single Passages
- Question-Type Practice

Question-type filters should include only types actually supported by the application, such as:

- True / False / Not Given.
- Yes / No / Not Given.
- Matching Headings.
- Matching Information.
- Multiple Choice.
- Sentence Completion.
- Summary Completion.

Each Reading card shows:

- Title.
- Activity type.
- Topic.
- Number of passages and questions.
- Estimated or configured duration, clearly distinguished.
- User status.
- One primary action.

A full test, one passage, and a short question-type drill must be clearly distinguishable.

Do not present an uncalibrated difficulty tag as a guaranteed IELTS band level. Use authored difficulty labels only when available.

## 4. Listening catalog

Use these top-level tabs:

- All
- Full Tests
- Section Practice
- Dictation

Provide relevant filters for section number, question type, topic, and user status.

Each Listening card shows:

- Title.
- Activity type.
- Section count or section number.
- Question count.
- Audio duration when known.
- User status.
- One primary action.

Show the distinction between Practice and Exam Simulation before an activity starts.

Only list playable activities as ready to start. Missing or processing audio must have an honest unavailable state.

Practice controls such as transcript, replay, and speed changes must follow the existing mode rules.

## 5. Writing catalog

Use clear top-level tabs:

- All Tasks
- Task 1
- Task 2
- My Submissions

For Academic Task 1, support filters for available task types:

- Line Graph.
- Bar Chart.
- Pie Chart.
- Table.
- Process.
- Map.
- Mixed Visuals.

For Task 2, categorize tasks by their actual question requirements:

- Opinion / Agree or Disagree.
- Discuss Both Views.
- Advantages and Disadvantages.
- Problems and Solutions.
- Two-Part Questions.

Treat these as discovery categories, not mandatory essay templates. Some prompts may have multiple relevant tags.

Each Writing card shows:

- A concise topic title.
- Task 1 or Task 2 badge.
- Task category.
- Suggested practice time.
- User status.
- “View task” or “Continue writing” action.

Show the complete question and Task 1 visual before the user starts writing. Do not hide essential instructions inside a tooltip.

“My Submissions” contains:

- Drafts.
- Submitted.
- Evaluating.
- Feedback Ready.
- Evaluation Failed.

A failed evaluation must not make the learner lose the essay. Offer a retry when appropriate and prevent duplicate evaluation charges.

Writing feedback availability must reflect the real configured service. Never display fabricated bands or feedback.

Keep Academic and General Training tasks separate. Do not expose an unsupported exam track as if it works.

## 6. Speaking catalog

Use these top-level tabs:

- All
- Part 1
- Part 2
- Part 3
- Full Mock

Provide topic filters such as study, work, technology, travel, environment, family, and daily life only when corresponding content exists.

Each Speaking card shows:

- Topic or cue-card title.
- Part number or Full Mock badge.
- Number of questions.
- Estimated duration when available.
- User status.
- One primary action.

Also provide access to “My Recordings” with recording date, topic, playback, feedback status, and deletion.

For Part 2, clearly separate preparation time from speaking time. Before requesting microphone permission, explain briefly why it is needed.

## 7. Search and filters

Use visible controls for the most useful filters. Move secondary filters into an accessible “Filters” drawer on mobile.

Common filters:

- Not Started.
- In Progress.
- Completed.
- Saved.

Skill-specific filters appear only where relevant.

Requirements:

- Search the current skill catalog.
- Search titles and supported metadata.
- Show active filter chips and “Clear all.”
- Preserve filters and pagination when returning from an activity.
- Store filter state in URL parameters where appropriate.
- Show a result count only when it is available accurately.
- Debounce search input.
- Avoid downloading the entire Firestore catalog for client-side searching.

Implement a documented Firestore-compatible search strategy. If it supports only title-prefix search, label and scope the experience accordingly rather than pretending to support full-text search.

Paginate queries and add the required indexes. Combine user status and content metadata without uncontrolled per-card database requests.

## 8. Cards and activity status

Use consistent action labels:

- Not Started → Start.
- In Progress → Continue.
- Completed → View Results.
- Completed activity detail → Try Again.
- Writing draft → Continue Writing.
- Writing feedback available → View Feedback.

The main catalog action must be predictable. Keep secondary actions in a small menu or the activity detail.

Do not use a card with multiple equally prominent buttons.

Save/bookmark must be a separate, accessible action that does not accidentally open the activity.

For each card, prioritize title, type, duration/question count, status, and action. Avoid cluttering cards with every available metadata field.

Show “Latest result” only when it belongs to that activity. Distinguish retakes from first attempts. Short drills show accuracy rather than an invented IELTS band.

## 9. Activity detail and start flow

Opening an activity should show a concise detail view or start panel:

- Full title.
- Relevant instructions.
- Scope and question count.
- Duration or time rules.
- Practice / Exam Simulation choice where supported.
- Available help for the selected mode.
- Start or Continue.

Avoid repeating information across multiple confirmation screens.

Starting a new attempt must not overwrite an unfinished attempt. Offer a clear choice when necessary.

Exiting an activity should preserve work when autosave is supported and show its actual save status.

After submission, provide:

- Results or processing state.
- Review mistakes or feedback.
- Retry.
- Return to catalog.

Returning to the catalog must restore the learner’s previous browsing position.

## 10. Desktop and mobile usability

Desktop:

- Clear sidebar navigation.
- Spacious catalog header.
- Responsive card grid.
- Filters arranged without crowding.

Mobile:

- One-column cards.
- Compact category tabs with an obvious overflow treatment.
- Filters in a drawer.
- Comfortable touch targets.
- No page-level horizontal overflow.
- Preserve the current activity when changing tabs or rotating the device.

Use short, plain interface labels. Provide Uzbek and English translations through the existing localization system.

Support keyboard navigation, visible focus, accessible tabs/dialogs, and screen-reader labels. Do not convey status through color alone.

## 11. Empty, loading, and error states

Implement specific states:

- No published content yet.
- No results for current filters.
- No unfinished activities.
- No saved activities.
- No submissions or recordings.
- Network error.
- Permission error.
- Evaluation unavailable or failed.

Give a useful action such as clearing filters, retrying, or browsing all tasks.

Use skeletons for loading. Do not show a blank screen or replace failed requests with fake sample results.

Keep sample exercises clearly labeled.

## 12. Firebase and content metadata

Reuse the existing content model where possible. Add backward-compatible fields and migrations only when needed.

Catalog metadata should support:

- Skill.
- Exam track.
- Activity type.
- Question/task type tags.
- Topic tags.
- Question and section counts.
- Duration metadata.
- Publication status.
- Content version.
- Asset readiness.
- Created/updated timestamps.

User-specific status, bookmarks, attempts, submissions, and recordings must remain private and separate from shared content.

Do not let learners change published content or computed scores. Do not expose answer keys, hidden transcripts, or explanations in catalog payloads.

Only published, authorized content should appear in learner catalogs. Empty categories should be hidden or clearly unavailable.

## 13. Implementation order

1. Audit the current four sections and document usability problems.
2. Create shared catalog, filter, card, status, and empty-state components.
3. Refactor Reading first and verify the complete catalog-to-results journey.
4. Apply the shared structure to Listening, Writing, and Speaking.
5. Connect all categories, filters, statuses, and actions to real Firebase data.
6. Verify responsive behavior and existing learning features.

Do not stop after writing a plan. Implement and validate the changes.

## 14. Acceptance criteria

The work is complete when:

- All four skills have understandable, consistent catalogs.
- Categories contain correctly classified content.
- Search and filters work together and survive back navigation.
- Start, Continue, View Results, and Retry perform the correct action.
- Existing answers, annotations, drafts, recordings, and results are preserved.
- Missing assets and failed evaluations have clear states.
- Learners can complete a full browse → practice → results → return journey.
- Mobile and keyboard navigation work.
- Queries are bounded and required Firestore indexes are included.
- Relevant checks, tests, and production build pass.

In the final report, describe what changed, which flows were verified, and any remaining data or external-service limitations.