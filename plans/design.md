You are a senior product designer and frontend engineer. Design and implement the IELTS learning platform described in the accompanying technical specification using the following visual direction.

Treat this as the authoritative design specification. Replace the earlier blue/teal visual direction with this warm white and deep orange design system. Keep the Firebase architecture and functional requirements from the technical specification.

Implement the design in working components and pages, not only as a visual mockup.

## 1. Visual identity

Create a polished, welcoming, focused learning environment using:

- Warm white backgrounds.
- Deep burnt orange primary actions.
- Soft peach active states.
- Dark charcoal typography.
- Rounded cards and restrained shadows.
- Clear spacing and simple navigation.

The interface should feel professional, calm, and enjoyable during long study sessions. Give the learning content the greatest visual importance.

Use orange selectively for primary actions, active navigation, focus indicators, and selected progress elements. Keep reading surfaces neutral and comfortable.

Avoid oversized marketing banners inside the application, excessive gradients, glass effects, decorative illustrations, unnecessary animations, and crowded dashboards.

## 2. Design tokens

Define centralized semantic CSS variables and use them consistently across components.

Light theme:

- Page background: #FFF9F5
- Main surface: #FFFFFF
- Subtle surface: #FAF7F4
- Primary action: #C2410C
- Primary hover: #9A3412
- Decorative orange accent: #F97316
- Active navigation background: #FFEDD5
- Active navigation text: #9A3412
- Primary text: #1C1917
- Secondary text: #57534E
- Muted text: #78716C
- Borders: #E7E5E4
- Success: #15803D
- Error: #B91C1C

Use deep orange behind white button labels. Reserve bright orange for accents unless its contrast is verified for the specific use.

Highlights:

- Yellow: #FEF08A
- Green: #BBF7D0
- Purple: #E9D5FF

Use dark text over light highlight colors. Keep annotation colors visually distinct from primary buttons and answer-status colors.

Dark theme:

- Page background: #171412
- Main surface: #211C19
- Elevated surface: #2B2420
- Primary action: #FDBA74
- Primary action text: #431407
- Primary text: #FAF7F4
- Secondary text: #D6CEC8
- Borders: #493C33

Create appropriate dark-theme annotation colors. Verify contrast instead of mechanically inverting the light palette.

## 3. Typography and spacing

Use a readable sans-serif font such as Inter, with a system-font fallback and proper Uzbek character support. Prefer self-hosting when available.

- General body text: 16px.
- Reading passage text: 18px by default, adjustable.
- Reading line height: approximately 1.75.
- Labels and supporting text: 14px.
- Page headings: 28–32px on desktop, smaller on mobile.
- Use tabular numerals for timers and numeric statistics.

Use a consistent spacing scale: 4, 8, 12, 16, 24, 32, and 48px.

Card radius: 16px.
Input and button radius: 10–12px.
Small badges: 6–8px.

Cards should use subtle borders and minimal shadows. Create hierarchy through spacing, alignment, typography, and surface color.

## 4. Application shell

Desktop:

- Left sidebar approximately 240px wide.
- Compact brand mark and platform name at the top.
- Main navigation: Dashboard, Reading, Listening, Writing, Speaking, Vocabulary, Mistakes, Progress, Study Plan.
- Settings and account controls at the bottom.
- Admin entry visible only to authorized admins.
- Selected navigation item uses a soft peach background, dark orange text, and a clear icon.

The top bar contains the current page title and compact language, theme, and account controls. Avoid duplicate controls and unnecessary global search.

On mobile, replace the sidebar with an accessible navigation drawer. Prioritize available space for studying. Use a separate focused layout for active tests.

Use consistent outline icons from one icon library. Do not use emoji as the main UI icon system.

## 5. Dashboard

Build a useful study dashboard with this hierarchy:

1. A compact greeting.
2. A prominent “Continue studying” card showing the real unfinished activity and one primary orange button.
3. Small summary cards for today’s completed activities, vocabulary due, and recent results.
4. Four clear skill cards: Reading, Listening, Writing, Speaking.
5. Today’s study plan and recent activity.

On wide screens, use a main content area and a narrower planning column. Stack them naturally on mobile.

Keep labels short and actionable. Use honest empty states instead of invented progress data.

Show one visually dominant primary action per section. Progress charts should be simple, clearly labeled, and based on real activity.

## 6. Reading workspace

Use a dedicated study layout with a compact top bar:

- Back or exit control.
- Test title.
- Practice or Exam Simulation badge.
- Save status.
- Timer.
- Submit button.

Desktop:

- Adjustable passage and question panels.
- Independent scrolling where useful.
- Comfortable paragraph width.
- Visible passage title and paragraph labels.
- Question navigation with answered, unanswered, current, and flagged states.

Mobile:

- Passage and Questions tabs.
- Preserve scroll positions and answers when switching.
- Keep navigation and the submit action accessible without covering content.
- Support portrait and landscape layouts.

The passage itself must stay visually quiet: white surface, dark text, generous line spacing, and minimal decoration.

Selecting text opens a small floating white toolbar with:

- Highlight.
- Comment.
- Definition, when a single word is selected.
- Save word.

Use orange for active toolbar actions. Position the toolbar inside the viewport and preserve the selection during interaction.

Definition popover:

- Selected word and pronunciation.
- Part of speech.
- Numbered English definitions.
- Usage examples when available.
- Audio playback when available.
- Save-word action.
- Source attribution.

Comments appear in a clean contextual panel. Clicking an annotation returns to its text. Provide visible loading, missing-definition, retry, and saved states.

## 7. Listening workspace

Reuse the study shell for consistency.

Provide an uncluttered audio player with a clear play control, progress display, volume, and permitted playback controls for the selected mode.

Practice mode may show repeat-segment and speed controls. After the appropriate reveal point, show the transcript in a separate panel with the current sentence highlighted softly.

Use orange to indicate the current playback position. Keep answer fields and transcript text easy to read.

## 8. Writing workspace

Create a distraction-free editor.

Desktop:

- Task instructions and chart or source asset on one side.
- Writing editor on the other.
- Compact timer, word count, save status, and submit action.
- Optional collapsible planning area.

After feedback is available, show a separate feedback panel with:

- Criterion cards.
- Text-linked comments.
- Strengths.
- Three prioritized improvements.
- A clear unofficial AI-feedback label where applicable.

Use orange for selected feedback items and navigation. Use red specifically for errors. Keep revision comparison readable and preserve the original essay.

## 9. Speaking workspace

Use a focused cue-card layout with:

- Part number and question.
- Preparation or response timer.
- A large, clearly labeled record button.
- Recording status and elapsed time.
- Playback controls after recording.
- A retry action and attempt history.

Use red to indicate active recording and orange for ordinary primary actions. Never rely on color alone to communicate recording state.

Make microphone permission and recording errors understandable and recoverable.

## 10. Vocabulary, mistakes, and progress

Vocabulary:

- Searchable word list.
- Clear due-review count.
- Compact word cards showing the selected meaning and source sentence.
- Focused flashcard review screen.
- Distinct Again, Hard, Good, and Easy buttons with text labels.

Mistakes:

- Filters for skill and question type.
- Cards showing the original answer, correct answer, reason, and retry action.
- Clear reviewed and pending states.

Progress:

- Simple first-attempt and retake filters.
- Skill and question-type breakdowns.
- Consistent chart scales and labeled legends.
- Accessible text summaries.
- Calm empty states when there is insufficient data.

## 11. Admin interface

Use the same design system with denser layouts appropriate for editing.

Provide content tables, filters, status badges, section/question editors, asset uploads, validation messages, preview, and publication controls.

Use orange for the main save or publish action. Use explicit text and confirmation for destructive actions.

Long editing pages should have clear sections and a persistent save status.

## 12. Components and interaction quality

Create reusable components for:

- Buttons and icon buttons.
- Inputs, selects, textareas, and search fields.
- Cards and stat cards.
- Tabs, badges, tooltips, and popovers.
- Dialogs and mobile drawers.
- Toasts and inline alerts.
- Skeletons and empty states.
- Question navigation.
- Selection toolbar.
- Dictionary popover.
- Audio player.
- Study timer.
- Annotation panel.

Every interactive component needs default, hover, focus-visible, active, disabled, loading, and error states where relevant.

Use short transitions around 150–200ms. Respect reduced-motion preferences.

Ensure keyboard operation, accessible names, meaningful focus order, and touch-friendly controls. Verify WCAG AA contrast, including orange controls and muted text. Do not communicate correctness or status through color alone.

## 13. Implementation and acceptance

Inspect the existing application before changing it. Apply this design to shared tokens and components first, then to all learner and admin pages.

Preserve functional data flows and connect controls to their actual actions. Label any unavailable integration honestly.

Verify:

- Dashboard hierarchy and responsive layout.
- Comfortable long-form Reading.
- Text selection and toolbar placement.
- Dictionary and annotation panels on narrow screens.
- Form, loading, empty, and error states.
- Light and dark themes.
- Keyboard access and contrast.
- Layouts at 360px, 768px, 1024px, and 1440px widths.
- No accidental page-level horizontal overflow or controls covering answers.

The final result should feel like one cohesive IELTS learning product: warm white, deep orange, rounded surfaces, readable content, and precise interactions.