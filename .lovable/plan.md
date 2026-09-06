# Premium roadmap workspace

## User-facing outcome

Turn the roadmap Steps tab into a serious 3–4 month learning workspace that people can follow week by week, while keeping Insights & Stats and My Template unchanged. The roadmap will read like a visual progression map: monthly phases, weekly actions, completion gates, a clear current step, and admin-curated resources attached to the relevant step.

## Scope

- Keep existing roadmap creation, progress saving, resource storage, Insights & Stats, and My Template functionality.
- Redesign only the roadmap header and Steps tab presentation.
- Make each generated month an explicit phase with a sequence of weekly checkpoints.
- Preserve the existing database shape by rendering the structured JSON already stored on `roadmap_steps`.
- Add no new subscription or payment logic.

## Implementation

1. Add a focused roadmap presentation model in `RoadmapView.tsx` that safely normalizes JSON fields such as topics, tasks, milestones, objectives, and resources.
2. Replace the current generic phase grouping in the Steps tab with a month-based journey rail and responsive roadmap map. Each month will show its position, duration, estimated effort, completion percentage, and outcome.
3. Add a rich active-month panel with:
   - outcome and why it matters,
   - what to learn,
   - how to learn as a weekly routine,
   - weekly checkpoints/milestones,
   - practical deliverables and mastery checks,
   - prerequisite/context callouts,
   - matched admin resources.
4. Add owner interactions without changing persistence:
   - select a month from the journey rail,
   - mark the month complete from the rail or detail panel,
   - open resource links,
   - edit existing step fields through the current edit flow.
5. Improve roadmap-level summary UI with completion, months, weekly commitment, and next action, while retaining public/follow/delete controls.
6. Keep Insights & Stats and My Template tabs byte-for-byte in behavior and available under the same tab labels.
7. Update the AI generation contract only as needed to ensure 3–4 month requests produce a practical 12–16-week plan with weekly milestones and a capstone, without allowing AI-suggested resources.
8. Validate TypeScript/build output and run the existing resource roundtrip tests; inspect the live preview for layout and runtime errors.

## Technical details

- Use existing semantic design tokens and shadcn components; no raw color values in page code.
- Avoid introducing new tables or migrations because the current `roadmap_steps` JSON columns already contain the required learning structure.
- Keep resources sourced exclusively from `roadmap_step_resources`, which are populated from the admin catalog by the existing matcher.
- Use responsive grid/flex layouts so the rail remains usable on narrow screens and the detail panel never overlaps the roadmap.
