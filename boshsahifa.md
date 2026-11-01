You are a senior frontend engineer, product designer, and motion designer working on the existing Lumo IELTS platform.

Redesign and implement the public homepage as a polished, responsive, interactive introduction to the platform.

Inspect the existing application, homepage, design tokens, logo assets, localization, and routes before editing. Preserve authentication, Firebase integrations, guest practice, and existing learning features.

Implement working code, not a static mockup or a plan.

## 1. Visual direction

Follow the established Lumo IELTS identity:

- Warm white background: #FFF9F5.
- Deep burnt orange primary color: #C2410C.
- Primary hover: #9A3412.
- Soft peach accents: #FFEDD5.
- White cards.
- Dark charcoal text: #1C1917.
- Rounded corners and restrained shadows.
- Comfortable typography and generous whitespace.

Reuse existing theme tokens and dark-mode behavior. Do not create a separate competing design system.

The homepage should feel welcoming, focused, and professional. Use motion to explain and support interaction.

Use the actual Lumo IELTS logo assets. Do not redraw or distort the wordmark. Keep “lumoielts.uz” spelled correctly.

## 2. Responsive requirements

Design mobile-first.

Verify at minimum:

- 320px.
- 360px.
- 390px.
- 768px.
- 1024px.
- 1440px.

Requirements:

- No accidental horizontal page overflow.
- All illustrations and animations fit their containers.
- Readable headings without clipped words.
- Comfortable touch targets.
- Primary actions accessible early on mobile.
- No reliance on hover for essential information.
- No fixed-height hero that clips content on short screens.
- Respect safe-area insets where relevant.
- Layout remains usable with increased text size.

Use fluid sizing, responsive grids, and bounded illustration dimensions. Do not merely shrink the desktop layout.

## 3. Header

Create a clean header containing:

- Brand logo.
- Links to Practice, How It Works, and Study Plan sections.
- Language/theme controls consistent with the existing application.
- Login action.
- Primary “Start practicing” action.

On mobile, use a compact accessible menu. Avoid squeezing all desktop navigation controls into one row.

If the header is sticky, account for its height when navigating to anchored sections.

For authenticated users, adapt the main action to “Continue learning” and link to the appropriate existing dashboard or activity.

## 4. Hero section

Suggested Uzbek copy:

Heading:
“IELTS’ga har kuni aniq bir qadam.”

Supporting text:
“To‘rtta ko‘nikmani mashq qiling, xatolaringizni tushuning va o‘zingizga mos reja bilan tayyorlaning.”

Primary action:
“Bepul mashqni boshlash”

Secondary action:
“Shaxsiy reja tuzish”

Provide equivalent English copy through the existing localization system.

Desktop composition:

- Text and actions on the left.
- A compact animated brand illustration on the right.

Mobile composition:

- Heading, supporting text, and actions first.
- Compact illustration below.
- Keep the illustration approximately 200–260px tall where practical; adapt to short screens.
- Do not let decoration push all useful content far below the first screen.

Primary actions must work before animation assets load.

## 5. Hero animation

Build a lightweight animation inspired by the existing open-book / lowercase-L emblem and four-point spark.

Preferred approach:

- Existing logo asset inside a lightweight CSS/SVG animation composition.
- Use the current motion library if already installed.
- Add a new animation dependency only if justified.

Motion:

- Very gentle vertical float.
- Slow spark brightness or opacity change.
- A few small peach particles moving along short bounded paths.
- A subtle shadow that changes slightly with the floating motion.

Preserve the emblem silhouette. Do not stretch or morph the logo.

Use small movement distances and slow cycles. Avoid constant rotation, flashing, bouncing, large parallax, and exaggerated glow.

Mobile:

- Reduce particle count.
- Reduce movement amplitude.
- Keep every particle inside the illustration’s bounded region.
- Do not use viewport-wide absolute offsets that cause overflow.
- Avoid a large blurred effect layer.

Use transform and opacity where possible. Avoid animation that continuously triggers layout.

Pause continuous animation when the section is offscreen or the tab is hidden.

If an existing video is used instead, provide a static poster, muted inline playback, an autoplay-failure fallback, and a correctly composed mobile source. Never make video loading a prerequisite for using the page.

Respect prefers-reduced-motion and provide a usable static presentation. For continuous decorative motion, provide an accessible pause option; keep its preference consistent during navigation.

## 6. Interactive Reading sample

Create a real guest-accessible mini Reading experience below the hero.

Use an original short passage and one supported question. Reuse existing Reading, dictionary, annotation, and grading services where practical.

Flow:

1. Read the passage.
2. Select a word.
3. Open its English definition.
4. Optionally save it through the existing guest/account vocabulary flow.
5. Answer one question.
6. Submit and view the explanation and evidence sentence.

Clearly label this as a short demonstration, not a full IELTS test or band assessment.

Use an authored sample with reviewed answers and evidence.

Do not fake a dictionary response or live grading integration. If the dictionary is unavailable, show an honest retry state while preserving the rest of the demo.

Desktop:

- Passage and question can appear side by side.

Mobile:

- Stack them naturally.
- Keep passage length manageable.
- Keep the selection toolbar and definition panel inside the viewport.
- A bottom sheet may be used for definitions if it improves mobile usability.
- Preserve selection when the user interacts with the toolbar.

The result should show correctness and an explanation, not an invented IELTS band.

Animate feedback with a brief fade or subtle transition. Do not shake the screen for incorrect answers.

## 7. Four skills section

Create four consistent cards:

- Reading.
- Listening.
- Writing.
- Speaking.

Each contains:

- One icon.
- Short title.
- One concise benefit.
- A working link to the existing catalog.

Suggested benefits:

- Reading: “Javobni toping va matndagi dalilni tushuning.”
- Listening: “Tinglang, javob bering va transcript bilan tahlil qiling.”
- Writing: “Yozing, fikr-mulohaza oling va matningizni yaxshilang.”
- Speaking: “Gapiring, ovozingizni yozing va qayta tinglang.”

Describe only features that actually work. If AI feedback is unavailable, do not advertise it as active.

Use a four-column grid on wide screens, two columns where appropriate, and one column on narrow phones.

Card hover effects should be subtle. Touch users must receive all essential information without hovering.

## 8. Learning loop section

Explain four steps:

1. Practice.
2. Understand the mistake.
3. Review.
4. Measure progress.

Use concise text and small visual examples.

Desktop may show a compact horizontal arrangement. Mobile must stack the steps vertically.

A restrained one-time reveal is acceptable. All content must remain visible and usable if JavaScript or motion effects fail.

Do not animate essential text letter by letter or make the learner wait for the full explanation.

## 9. Personalized study plan section

Introduce the eight-question planning questionnaire.

Explain that it uses goals, available time, selected days, and learning activity to build a study plan. Do not claim the questionnaire measures proficiency.

Show a clearly labeled illustrative plan, for example:

- 5 minutes: vocabulary revision.
- 15 minutes: a short Reading activity.
- 10 minutes: mistake review.

Label it “Example plan” when it is not derived from the current user’s data.

Provide a working “Create my plan” action linked to the existing questionnaire.

A short one-time task-card reveal is sufficient. Never show an endless fake progress completion animation.

On mobile, stack the text and plan preview. Keep buttons inside the viewport and allow labels to wrap naturally.

## 10. Group study section

If the group system is operational, add a compact section explaining:

- Teacher-led assignments.
- Groups of 5–15 learners.
- Submission tracking.
- Teacher feedback.

Use a simple interface preview with fictional identities clearly labeled as a sample, or avoid personal names altogether.

Do not fabricate testimonials, real activity, or learner outcomes.

Link to the existing authorized group entry flow. Do not imply that any learner can create a teacher group if the application does not allow it.

If groups are not operational, omit this section from the live homepage rather than linking to a broken flow.

## 11. FAQ

Implement an accessible accordion with concise, truthful answers.

Suggested questions:

- Can I try a practice activity without registering?
- What gets saved when I create an account?
- Are AI Writing scores official?
- How is my daily plan created?
- Does the platform work on a phone?
- How do teacher-led groups work?

Base answers on actual implementation and available services.

Do not promise permanent free access, guaranteed band improvement, unlimited AI usage, or official IELTS affiliation.

Use buttons with correct expanded state and keyboard behavior.

## 12. Final action and footer

End with a concise invitation to begin.

Primary:
“Birinchi mashg‘ulotni boshlash”

Secondary:
“Shaxsiy reja tuzish”

Footer includes brand, existing useful links, and appropriate privacy/contact information.

Do not add fake partner logos, accreditation badges, statistics, ratings, or reviews.

## 13. Performance and accessibility

- Keep the main heading and actions server-rendered where appropriate.
- Restrict client-side code to interactive components.
- Avoid shipping all test content or complete app services into the homepage bundle.
- Lazy-load below-the-fold heavy components.
- Reserve dimensions for media to prevent layout shifts.
- Prefer existing optimized assets and fonts.
- Do not use scroll-jacking.
- Do not replace the cursor or block normal browser selection.
- Avoid page-wide animated filters and expensive blur effects.
- Maintain WCAG AA contrast.
- Use visible focus states and semantic headings.
- Mark decorative elements as hidden from assistive technology.
- Respect reduced motion.
- Show real loading and error states for interactive features.

Keep header controls and animation pause controls accessible without overwhelming the page.

## 14. Implementation and acceptance

Implement in this order:

1. Inspect current homepage and reusable components.
2. Build the responsive static layout and working navigation.
3. Connect the mini Reading experience and questionnaire links.
4. Add bounded hero motion and subtle interaction transitions.
5. Verify mobile, dark mode, keyboard access, reduced motion, and failure states.
6. Run appropriate checks and production build.

Acceptance criteria:

- All homepage buttons navigate or perform their intended action.
- The mini Reading sample works without mandatory registration.
- No fake scores or statistics appear.
- Animations fit phone screens without overflow.
- Content is usable with animation disabled.
- The page remains functional if animation media or dictionary requests fail.
- The design is cohesive with the existing platform.
- Required checks pass, and untested real-device behavior is explicitly reported.

Finish with a concise report of implemented sections, motion behavior, actual verification results, and any remaining blockers.

Start by inspecting the existing homepage, then implement the redesign.