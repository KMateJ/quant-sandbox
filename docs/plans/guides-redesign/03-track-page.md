# 03 — Track page

Status: done (2026-10-20) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
The track page (`/guide/<track>`) is where a learner decides what to read next. The design makes it a
calm, ruled table of contents with a clear "up next" and a readable "Check yourself" section.

## Current state (verified 2026-10-20)
- `src/features/guide/components/GuideIndex.tsx` (22 lines): `PageHeader title={t("navGuide")}
  description={t("guideIndexSubtitle")}` (generic "Guide"), then `GuideTrackSection`, then `GuideTrackChecks`.
- `GuideTrackSection.tsx` (53): header with `h2.guide-track-title` (`t(track.titleKey)`),
  `.guide-track-desc` (`t(track.descKey)`), a CTA link (`guideStart`/`guideContinue`) to the first unread
  lesson; `GuideProgressBar done total`; `ol.guide-list` of `Link.guide-row` with `.guide-row-num`
  (`✓` when read, else "01"), title, description, `.guide-row-status` ("READ", uppercase via CSS).
  Empty track → `.guide-track-empty`.
- `GuideTrackChecks.tsx` (53): `section.guide-track-checks` → `h2.guide-track-checks-title`
  (`t("guideCheckLabel")` = "Check yourself"), intro, one `<details id={checksAnchor(lessonId)}>` per
  lesson with `<summary>` (lesson title + count), a re-read link, and `GuideCheck` forms.
- `GuideCheck.tsx` (85): a form per question (`.guide-check`, choices, `lp-btn` buttons, feedback).
- Data: `guideTracks` (order = track number), `trackLessons(track)`, lesson `labs: string[]` (registry ids,
  resolve with `moduleById` from `src/modules/registry.ts`), `useGuideProgress().isRead(id)`.
- Strings in `src/Language/Guide.ts` / `Guide.hu.ts` (GUIDES_PLAN shared file — rule 4.3):
  `guideProgress` "{{done}} of {{total}} read", `guideLessonRead` "Read", `guideStart`, `guideContinue`,
  `guideCheckLabel`, `guideTrackChecksIntro`, `guideTrackChecksCount` "{{n}} questions".
- Styles: `src/styles/guide.scss` (`.guide-track-*`, `.guide-row*`, `.guide-progress*`,
  `.guide-track-checks*`, `.guide-check*`).
- Known bug: the progress label sits under the sticky top bar (the progress block is the first element and
  the page has no top padding below the 60px bar).

## Goal (design board GuideTrack)
1. **Header:** mono eyebrow "Guide · Track 02" (`--muted`, uppercase, 11.5px), `h1` = track title in
   `--font-display` 56px/1 weight 400, description 16px `--text-sub` max 620px. Page top padding ≥ 48px.
2. **Progress row** (ruled, 2 cells): left "Your progress" + mono "7 of 8 read" and a 1px `--rule-strong`
   line with 3px `--accent` fill; right = solid `--text` block with `--bg` text: mono eyebrow
   "Up next · Lesson 04" and the lesson title in display 20px — links to that lesson. When all are read:
   eyebrow "Track complete", title "Review the questions below" linking to `#checks`.
3. **Lessons:** heading "{{n}} lessons, in order" (display 32px) + muted note "Each builds on the one
   before"; a ruled list, one row per lesson: mono number (`--accent` for up-next, else `--text-dim`),
   title (display 21px) over description (13.5px `--muted`), labs column ("Risk & Return · Portfolio
   Optimization", 12.5px `--text-sub`, hidden < 1000px), state column mono 11.5px: "Up next" (`--accent`)
   or "Read" (`--text-dim`) or empty. Up-next row background `--surface`. No ✓, no green, no capitals.
4. **Check yourself** (`id="checks"`): display 32px heading in `--text` (plan 01 fixes colour), intro;
   a ruled list of lesson rows: mono number, title, mono "3 questions", and a `+`/`−` sign; expanding
   shows the questions. Choice buttons are square cells in a ruled grid; selected = 1px inset `--accent`
   ring + `--surface` background; primary "Check answer" = `--text` background, `--bg` text.

## Non-goals
- No change to check logic (`guide.check.logic.ts`, scoring, review scheduling) or lesson content.

## Constraints
- Each `.tsx` ≤150 lines; split `GuideTrackSection` into `GuideTrackHeader.tsx`, `GuideTrackProgress.tsx`
  (replaces `GuideProgressBar` usage here) and `GuideLessonTable.tsx` if needed.
- New strings via rule 4.3: `guideTrackEyebrow` "Guide · Track {{n}}", `guideYourProgress` "Your progress",
  `guideUpNext` "Up next · Lesson {{n}}", `guideTrackComplete` "Track complete",
  `guideReviewChecks` "Review the questions below", `guideLessonsHeading` "{{n}} lessons, in order",
  `guideLessonsNote` "Each builds on the one before" (+ HU drafts).

## Steps
1. Replace the generic `PageHeader` in `GuideIndex` with `GuideTrackHeader` (eyebrow/h1/description).
2. Progress row + up-next cell (`GuideTrackProgress`), computing up-next as the first unread lesson.
3. `GuideLessonTable` per Goal 3; keep `<ol>` semantics; whole row is the link.
4. Restyle `GuideTrackChecks`: keep `<details>/<summary>` (accessible, works without JS), style the
   summary as the ruled row with mono number and count and a `+`/`−` indicator via
   `details[open] summary .sign::after`; `GuideCheck` choices as square ruled cells.
5. `guide.scss`: rewrite the `.guide-track-*`, `.guide-row*`, `.guide-progress*`, `.guide-track-checks*`
   and `.guide-check*` rules to the design; delete rules nothing uses any more (grep first).

## Acceptance criteria
- `/guide/portfolio` shows the header, progress row, 8 rows, and a readable "Check yourself" heading.
- The progress label is fully visible below the top bar at scroll position 0.
- No "READ" in capitals, no ✓ glyph (`grep -n "✓" src/features/guide/components` → nothing).
- `npm run test:guide-checks` still passes.

## Verification
```bash
npm run test:guide-checks && npm run test:guides-ui && npx tsc -b && npm run build
npx vite preview --port 4173 &
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel/insights" \
  --paths "/guide/portfolio,/hu/guide/portfolio,/guide/derivatives" \
  --after "/guide/portfolio|(()=>{const r=document.querySelector('.guide-track-progress')?.getBoundingClientRect();const bar=document.querySelector('.topnav').getBoundingClientRect();return r&&r.top>=bar.bottom})()"
# expect: no problems; value true
```
Stop the server; check the port is free.

## Pitfalls
- `useGuideProgress` is empty before hydration: the first render must show 0 read and the first lesson as
  "up next"; it then updates. Don't read localStorage during render.
- `checksAnchor(lessonId)` ids are linked from lesson pages (`#…`); keep them on the `<details>`.

## Findings (fill in during execution)
- New HU strings: `guideTrackEyebrow` "Útmutató · {{n}}. sorozat", `guideYourProgress` "Haladásod",
  `guideUpNext` "Következik · {{n}}. lecke", `guideUpNextShort` "Következik" (extra key, EN "Up next", for the row
  state column), `guideTrackComplete` "Sorozat teljesítve", `guideReviewChecks` "Nézd át az alábbi kérdéseket",
  `guideLessonsHeading` "{{n}} lecke, sorrendben", `guideLessonsNote` "Mindegyik az előzőre épül".
- Shared-file edits logged: additive keys in `Guide.ts` / `Guide.hu.ts` (GUIDES_PLAN Log line 2026-10-20).
- `GuideTrackSection.tsx` and `GuideProgressBar.tsx` deleted (only used here); replaced by `GuideTrackProgress.tsx`
  and `GuideLessonTable.tsx`, header inlined in `GuideIndex.tsx`. `.home-eyebrow` / `.home-progress*` rules moved to
  `_primitives.scss` as `.eyebrow` / `.rule-progress*` (home selectors kept in the same rule lists).
- `GraphPath.tsx` still had a `✓` (graph page); removed so the acceptance grep is clean.
- Check-yourself restyle is scoped to `.guide-track-checks` so lesson-page worked examples keep their look. Selected
  choice uses `outline` (offset −1px), not `box-shadow`, per the no-shadow rule.
- Still odd: `guideTrackChecksReread` / `guideLessonChecksLink` strings end with "→" (arrow); left as-is (shared file,
  additive edits only).

## Prompt to hand off
> You are working in the Quant Sandbox repo (my-app). Read `CLAUDE.md`, `docs/GUIDES_PLAN.md`,
> `docs/plans/guides-redesign/README.md` (sections 0 and 4) and `docs/plans/guides-redesign/03-track-page.md`,
> and confirm plan 01 is done (stop if not). Run `git status` and stop if files you will edit have changes you
> didn't make. Implement plan 03: the track header, progress and up-next row, the ruled lesson table, and the
> restyled Check-yourself list, without changing check logic. Add strings per README rule 4.3. Run the
> Verification commands and make them pass. Fill in Findings, set plan 03 to `done (<date>)` in the README
> table, and summarise.
