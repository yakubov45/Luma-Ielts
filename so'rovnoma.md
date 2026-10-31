You are a senior full-stack engineer and educational UX designer working on the existing Lumo IELTS platform.

Implement an eight-question study-planning questionnaire and connect it to a personalized daily and weekly study plan.

Inspect the existing onboarding, diagnostic, settings, study-plan services, Firebase schemas, and guest persistence before making changes. Extend those systems instead of building a separate onboarding or planning implementation.

Preserve the warm white and deep orange design, dark mode, Uzbek/English localization, existing user data, and working learning features.

This is an implementation request: write working code, connect persistence, verify behavior, and report results.

## 1. Purpose

Use the questionnaire to understand the learner’s goals, availability, and preferences.

The questionnaire personalizes a study plan. It does not measure English proficiency or establish a verified IELTS band.

Build this journey:

Questionnaire → plan preview → confirm plan → start today’s activity.

Offer a short diagnostic when the learner’s level is unknown, but do not block personal practice or plan creation.

## 2. Questionnaire interface

Show one question per step with:

- “Question 3 of 8” progress.
- Short, clear wording.
- Accessible choice controls.
- Back and Continue buttons.
- Preserved answers when navigating backward.
- Validation beside the relevant field.
- Draft persistence across refresh.

Use an estimated completion time of approximately two minutes as a design goal, not a guaranteed completion time.

Include an option to postpone onboarding and use a clearly labeled default plan.

Respect reduced motion and keyboard navigation. On mobile, controls must remain usable when the keyboard opens.

Default the interface language to the application’s existing preference.

## 3. The eight questions

### Question 1: Target band

“What IELTS band are you aiming for?”

Options:

- 5.5
- 6.0
- 6.5
- 7.0
- 7.5
- 8.0+
- Not sure yet

Do not silently convert “8.0+” into a more specific target. Store uncertainty explicitly.

### Question 2: Current level information

“What do you know about your current level?”

Options:

- I have an official IELTS result.
- I have a mock-test result.
- I can estimate my level.
- I do not know yet.

Conditional fields within the same step:

For official or mock results:

- Overall band, optional.
- Reading, Listening, Writing, and Speaking bands, individually optional.
- Test date, optional.

For an estimated level:

- Optional self-estimated band.

Validate bands as 0–9 in half-band increments. Do not require every field.

Distinguish official results, mock results, and self-estimates in storage and presentation. A user-entered official result is still self-reported unless independently verified.

Do not invent missing section scores.

### Question 3: Perceived weak skills

“Which skills feel most difficult?”

Allow multiple selections:

- Reading.
- Listening.
- Writing.
- Speaking.
- Not sure yet.

“Not sure yet” must be exclusive.

Treat this as a preference signal until actual performance provides stronger evidence.

### Question 4: Exam timeline

“When are you planning to take IELTS?”

Options:

- Choose an exact date.
- Within one month.
- In two to three months.
- In three to six months.
- Not scheduled yet.

For an exact date, validate that it is not in the past using the user’s timezone.

Store approximate timelines as approximate ranges or categories. Do not present an invented exact exam date.

### Question 5: Daily available time

“How much time can you study on a study day?”

Options:

- 15 minutes.
- 30 minutes.
- 45 minutes.
- 60 minutes.
- 90 minutes.

This is the total daily study budget, not the budget for each skill.

### Question 6: Study days

“Which days can you study?”

Allow selection of Monday through Sunday.

Require at least one selected day before confirming an active plan.

Do not force seven-day study or treat planned rest days as missed days.

### Question 7: Session preference

“How would you like to divide your study time?”

Options:

- One session.
- Two shorter sessions.
- Several small sessions.

Keep the daily total unchanged.

Do not divide an activity into unusably short pieces. Provide sensible session suggestions, and explain when an activity is best completed in one sitting.

### Question 8: Preferred supporting activities

“What would you like included in your plan?”

Allow multiple selections:

- Vocabulary revision.
- Reviewing mistakes.
- Speaking recordings.
- Writing practice.

All four core skills remain part of the overall learning plan. These choices adjust supporting activities and emphasis; they must not silently remove a core skill.

Allow no additional preferences.

## 4. Data model and persistence

Use a validated, versioned schema compatible with the existing user profile.

Store:

- Questionnaire schema version.
- Completion and update timestamps.
- Target band or unknown state.
- Current-level source.
- Optional score information and test date.
- Perceived weak skills.
- Exact exam date or approximate timeline.
- Daily study minutes.
- Selected weekdays.
- Session preference.
- Supporting activity preferences.
- User timezone.

Reuse existing settings fields rather than maintaining conflicting copies of goals, exam date, or daily minutes.

For authenticated users:

- Persist to their private Firebase account.
- Enforce ownership and field validation.
- Keep planning preferences separate from server-owned trusted results.

For guests:

- Use the existing local persistence and synchronization system.
- Preserve drafts across reload.
- Synchronize idempotently after login.
- Prevent cross-account mixing and duplicate plans.

Distinguish “not completed” from “completed with unknown level.”

## 5. Planning engine

Implement a deterministic, explainable planning engine before considering AI.

Separate:

1. Questionnaire/profile input.
2. Actual learning state.
3. Content availability.
4. Planning policy.
5. Generated daily tasks.

Each task must contain:

- Stable ID.
- Local date and timezone context.
- Skill or activity category.
- Available content reference where applicable.
- Estimated duration.
- Short recommendation reason.
- Completion condition.
- Status.
- Generation-policy version.

Generate plans only from available, authorized activities. Do not fabricate exercises, content IDs, or available AI services.

Do not claim that a plan guarantees a target IELTS score.

## 6. Scheduling rules

Respect selected weekdays and the daily time budget.

Use these signals:

- A relevant unfinished activity.
- Group assignment deadlines.
- Due vocabulary.
- Pending mistake reviews.
- Observed skill/question-type weaknesses.
- Self-reported weak skills when performance data is limited.
- Coverage of the four skills over the planning horizon.

Avoid creating duplicate tasks for the same underlying activity.

Account for group assignments within the daily budget. If a required assignment exceeds the available budget, show the conflict and offer an explicit adjustment instead of silently overbooking.

Do not prescribe a full mock or complete essay inside a short time slot. Offer a suitable drill, outline, paragraph exercise, or a separately scheduled longer session.

If no vocabulary is due, do not create an empty revision task.

If there are no recorded mistakes, do not invent a mistake-review task.

If a skill lacks usable content, show the limitation and suggest an available alternative without pretending coverage is complete.

For sparse schedules, rotate skills across multiple weeks rather than forcing all four into one short day.

## 7. Adaptation and missed days

Start with questionnaire-based recommendations, then adapt using real activity.

Do not infer a reliable skill level from a single short drill.

Keep first attempts and retakes distinct when selecting weaknesses.

Explain recommendations in plain language, for example:

“You missed several matching-headings questions, so today includes a short practice.”

A missed day must not cause every unfinished task to accumulate tomorrow.

Reprioritize within the next available study-day budget.

Preserve completed tasks and history. Do not regenerate task IDs or reset progress on every page load.

Changing preferences should update future plans and allow a preview of changes to today’s unfinished tasks. Never erase completed work.

Generate and regenerate through explicit, idempotent operations. Handle concurrent requests and multiple browser tabs safely.

## 8. Plan preview and confirmation

After the final question, show:

- Goal.
- Selected study days.
- Daily time budget.
- Session arrangement.
- Main areas of focus.
- Today’s plan or next scheduled study day.
- A seven-day calendar preview.
- A short explanation of how the plan was chosen.

Primary action:

“Confirm and start.”

Secondary action:

“Edit answers.”

If today is a rest day, show the next scheduled day and offer optional extra practice without changing the saved schedule.

If the level is unknown, offer “Take a short diagnostic” as a useful next step. Do not display an invented starting band.

## 9. Study-plan and dashboard integration

Update the existing Study Plan page to use the new engine.

Each task shows:

- Clear title.
- Approximate minutes.
- Reason.
- Start or Continue action.
- Completion status.

Link tasks directly to their actual workspace, review queue, or activity.

Mark completion from meaningful activity events wherever possible:

- Submitted test.
- Completed vocabulary review batch.
- Reviewed mistakes.
- Saved/submitted writing exercise.
- Completed speaking recording.

Opening a page must not mark a task complete.

When a task requires self-confirmation, label it honestly as self-reported completion.

Update the Dashboard’s next activity and daily progress from the same plan source. Remove conflicting hard-coded 30-minute plans.

## 10. Editing and notifications

Allow reopening the questionnaire or editing relevant preferences from Settings and Study Plan.

Do not create reminder emails, push notifications, or calendar events automatically. A future notification feature must have separate explicit opt-in.

Do not punish rest days or missed days with negative messaging.

Use supportive, factual wording such as:

“Your plan has been adjusted for your next study day.”

## 11. Testing and acceptance

Test:

- All eight steps and conditional fields.
- Back navigation and refresh recovery.
- Unknown level and unknown exam date.
- Band/date validation.
- No selected weekdays.
- A 15-minute plan never becoming a full test.
- Session splitting preserving total minutes.
- Empty vocabulary and mistake queues.
- Missing content.
- Group-assignment scheduling conflicts.
- Rest days and timezone date boundaries.
- Missed-day replanning without task accumulation.
- Preference changes preserving completed tasks.
- Idempotent guest synchronization.
- Concurrent plan generation without duplicates.
- Cross-user privacy.
- Mobile and keyboard operation.

Run appropriate type checks, linting, tests, and production build.

Deliver working code, necessary Firebase rules/index changes, and a short planning-policy document explaining the algorithm and limitations.

In the final report, describe implemented behavior, actual checks performed, and any remaining blockers.

Begin by inspecting the existing onboarding and study-plan implementation, then implement the complete questionnaire-to-plan flow.