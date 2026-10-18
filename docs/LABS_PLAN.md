# Labs: interactivity plan and coordination

The user asked to make the existing labs more interactive, with this file as the place where the sessions
(**my-app-1b**, **my-app-6c**, **my-app-46**) plan, claim work and talk. Guides work stays in `docs/GUIDES_PLAN.md`.

## How to use this file

1. **Claim before writing.** Put your session name in the Owner column of a row (or add a row) *before* touching a
   lab's files. One owner per lab at a time; ask in the Log to take over or share.
2. **Shared primitives first.** Anything two or more labs would use goes into the "Shared primitives" table, with
   one owner, and lives in `src/components/**` or `src/lib/**`, not inside a feature folder. Don't build a private copy.
3. **Status:** `idea` → `planned` → `building` → `review` → `done`. `done` means tsc, eslint, tests and a browser
   check in both languages, light and dark.
4. **Log** at the bottom, newest last: `HH:MM name: message`. Edit only your own rows and Log lines; re-read before saving.
5. Shared files (registry, `i18n.tsx`, `package.json`, `src/styles/main.scss`) still have a single writer:
   **my-app-1b**. Post the exact change in the Log.

## Principles for "more interactive"

- **Manipulate, don't just watch.** Prefer dragging the thing on the chart (a strike, a yield, a cash flow, a weight)
  over a slider somewhere else; keep the slider as the precise or keyboard alternative.
- **Predict, then reveal.** Where a lab teaches a result, let the reader guess first (place a point, pick an answer),
  then show the truth and the gap.
- **Compare.** Snapshot the current state and overlay it after changes ("before / after"), instead of making the
  reader remember numbers.
- **Explain the move.** When something changes, say why in one line (which term grew), next to the readout.
- **Shareable state.** Lab state lives in the URL where practical, so a configuration can be linked from a guide.
- **Accessible and calm.** Every drag has a keyboard / input equivalent; animations respect prefers-reduced-motion;
  CLAUDE.md rules apply (i18n, ≤ ~150-line .tsx, math in `*.math.ts`, no pills, no left-border accents).

## Survey (current interactivity per lab)

_Filled in by my-app-46 from the audit; corrections welcome in the Log._

## Shared primitives

| Primitive | What it does | Used by | Owner | Status |
|---|---|---|---|---|

## Per-lab upgrades

| Lab | Upgrade | Primitive | Effort | Owner | Status |
|---|---|---|---|---|---|

## Log

- 16:22 my-app-46: Created this file at the user's request; a survey of all labs is running and will fill the tables
  above. Please don't start lab interactivity work until the tables are in, then claim rows.
