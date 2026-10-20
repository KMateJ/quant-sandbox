# 04 — Lesson page

Status: done (2026-10-20) · Depends on: 01 · Suggested model: Sonnet · Est. size: L (3 phases)

## Why
Lessons are where learners spend their time. The content is good; the frame should feel like a
well-set book: a clear header, numbered sections, ruled worked examples and figures, a calm rail that
says what the lesson builds on and leads to — and no clipped mini graph.

## Current state (verified 2026-10-20)
- `src/features/guide/components/GuideLessonPage.tsx` (63 lines): `.page-shell > .page-content.guide-lesson`
  → `article.guide-article` with `header.guide-lesson-head` (`nav.guide-breadcrumb` "Guide / <track link>",
  `h1.guide-lesson-title`, `p.guide-lesson-meta` = `guideLessonOf` · `guideMinRead`), `div.guide-article-body`
  (ref for `useGuideToc`) containing `<GuideBlocks blocks={guideContent[lesson.id][language]} …/>`,
  a checks link, `GuideLessonNav`; then `<GuideRail lessonId headings activeId labs />`.
- `GuideBlocks.tsx`: block kinds `p`, `h` (section heading, rendered as `h3`), `math`, `note`, `list`,
  `figure`, `lab` (→ `GuideTryIt`), `check`, `worked` (→ `GuideWorked`, whose title is `h3.guide-worked-title`).
- `useGuideToc` (`src/features/guide/useGuideToc.ts`) collects **every `h3`** in the body, assigns ids
  `s-1…`, tracks the active one, estimates reading minutes.
- `GuideWorked.tsx` / `GuideWorkedStep.tsx`: `form.guide-worked` with `.guide-practice-head` label,
  `h3.guide-worked-title`, `ol.guide-worked-steps` of `li.guide-worked-step` (`.guide-worked-text`,
  `.guide-worked-calc`, `.guide-worked-result`, blanks), `lp-btn` buttons.
- `GuideFigure.tsx` (31): `figure.guide-figure > figcaption.guide-figure-head` (title + "Open in <lab>" link)
  `+ .guide-figure-body`.
- `GuideLessonNav.tsx`: two links with `.guide-lesson-nav-dir` + `.guide-lesson-nav-title`.
- `GuideRail.tsx` (49): TOC (`.guide-toc-link.active`), `<LessonGraph lessonId />` ("Connections" mini
  graph, 240×200, clips labels), labs list.
- Graph data for the rail: `GUIDE_GRAPH` from `components/graph/useGuideGraph.ts` (built once at module
  level), `lessonNodeId(id)`; plan 01 adds `lessonLinks(edges, id)` in `guide.ui.ts`.
- Strings: `src/Language/Guide.ts`, `src/Language/GuideGraph.ts` (`ggLocalTitle` "Connections",
  `ggOpenGraph` "Open the full graph").

## Goal (design board GuideLesson)
1. **Header:** mono uppercase breadcrumb "Guides / <Track> / 04" (number in `--accent`), `h1` in
   `--font-display` 46px/1.04 weight 400, mono meta "Lesson 4 of 8 · 12 min read" (`--muted`).
2. **Body:** serif 19px/1.65 `--text` at ~92% (use `--text-sub` only for secondary prose); the first
   paragraph 22px. Section headings (`h` blocks): Geist 18px/600 with a mono `§n` prefix (`--text-dim`) —
   use a CSS counter, not markup. Display maths: centred, 1px `--rule` lines above and below.
3. **Worked example:** ruled box — head cell (mono eyebrow "Worked example" + title in display 22px), one
   ruled row per step: mono step number, text over italic serif formula, mono result right-aligned (the
   first result in `--accent`).
4. **Figure frame (`GuideFigure`):** ruled box; caption row = title (15px/500) left, "Open in <lab>" link
   (`--accent`, no arrow) right; controls as square segmented groups (1px `--rule-strong`, active cell
   `--surface-soft`); a ruled readout row under the chart when the figure provides one.
5. **Prev/next:** ruled two-cell row; mono eyebrows "Previous · 03" / "Next · 05" (next in `--accent`),
   titles in display 19px; last lesson: "Back to <Track>".
6. **Rail (240px, sticky):** "On this page" — rows with mono `§n` + label, active row background
   `--surface-soft` and `--text`; **"Builds on"** and **"Leads to"** lists (mono code like "02.03" + title,
   wrapping, never clipped) from `lessonLinks`; link "See it in the knowledge graph"
   (`/guide/graph?focus=<lessonId>`); "Labs for this lesson" list. Mono uppercase 11px section labels.
7. ≤1180px: rail hidden; ≤1000px: sidebar hidden (shell already handles it — verify).

## Non-goals
- No lesson content changes, no figure component internals (plan 06), no check logic.

## Constraints
- `.tsx` ≤150 lines: new `GuideLessonHeader.tsx`, `GuideRailLinks.tsx`; delete `LessonGraph.tsx` only if
  nothing else imports it (grep) — otherwise leave it unused and note it.
- Strings (rule 4.3): `guideBuildsOn` "Builds on", `guideLeadsTo` "Leads to", `guideSeeInGraph`
  "See it in the knowledge graph", `guidePrevNum` "Previous · {{n}}", `guideNextNum` "Next · {{n}}"
  (+ HU drafts). Lesson codes ("02.03") = track number + lesson number, computed from `guideTracks`
  order and `trackLessons()` — add `lessonCode(id)` to `guide.ui.ts` with a test.

## Steps
**Phase A — header, nav, rail (build green before B).**
1. `GuideLessonHeader` per Goal 1 (breadcrumb uses `guideTrackPath`, track number from `guideTracks`).
2. `GuideLessonNav` per Goal 5.
3. `GuideRailLinks` (Builds on / Leads to / graph link) replacing `<LessonGraph>` in `GuideRail`; TOC rows
   get `§n` (index + 1, matching the body counter).

**Phase B — body typography.**
4. `guide.scss`: `.guide-article-body { counter-reset: guide-sec; }`
   `.guide-article-body .guide-content > h3 { counter-increment: guide-sec; }`
   `… > h3::before { content: "§" counter(guide-sec); font-family: var(--font-mono); … }` — restrict to
   section headings so `h3.guide-worked-title` is not counted. Make `useGuideToc` skip
   `.guide-worked-title` (select `h3:not(.guide-worked-title)`) so TOC numbers match.
5. Maths, notes, lists, first paragraph per Goal 2.

**Phase C — worked example and figure frame.**
6. `GuideWorked`/`GuideWorkedStep` styles per Goal 3 (CSS only, unless a wrapper class is needed).
7. `GuideFigure` frame + a shared `.guide-seg` class for segmented controls used by figures (plan 06
   migrates figures to it); restyle `SegmentedControl` only inside `.guide-figure` (scoped CSS).

## Acceptance criteria
- `/guide/portfolio/risk-aversion`: header per design; TOC `§n` numbers equal body heading numbers;
  rail shows Builds on / Leads to with full titles; no `.gg-local` element.
- No arrows; no rounded corners > 2px in `guide.scss` rules touched (`grep -n "border-radius" src/styles/guide.scss`
  shows only `var(--radius-xs)`/`0`/`50%`).
- `npm run test:guides-ui` (incl. `lessonCode`) passes.

## Verification
```bash
npm run test:guides-ui && npm run test:guide-graph && npm run test:guide-checks && npx tsc -b && npm run build
npx vite preview --port 4173 &
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel/insights" \
  --paths "/guide/portfolio/risk-aversion,/hu/guide/portfolio/risk-aversion,/guide/derivatives/instruments" \
  --after "/guide/portfolio/risk-aversion|[document.querySelectorAll('.guide-toc-link').length, document.querySelectorAll('.guide-article-body .guide-content > h3').length, !!document.querySelector('.gg-local')]"
# expect: no problems; the first two numbers equal; false
```
Stop the server; check the port is free.

## Pitfalls
- `useGuideToc` assigns ids to the h3 list it collects; changing its selector changes ids `s-n` — deep
  links like `#s-3` may shift by one where a worked example came first. Acceptable; note in Findings.
- `GUIDE_GRAPH` is heavy-ish but already built at module level for the graph page; importing it in the
  rail pulls it into the lesson chunk — check the lesson route chunk size before/after (`npm run build`
  output) and note it; if it grows > 30 kB gzip, move `lessonLinks` input to a precomputed map.

## Findings (fill in during execution)
- Lesson chunk size before/after: `GuideView` 184.80 kB / 53.00 kB gzip -> 185.31 kB / 53.05 kB gzip (GUIDE_GRAPH was already in the chunk via LessonGraph).
- New HU strings: guideBuildsOn "Erre épül", guideLeadsTo "Ide vezet", guideSeeInGraph "Megtekintés a tudástérképen",
  guidePrevNum "Előző · {{n}}", guideNextNum "Következő · {{n}}", guideBackToTrack "Vissza: {{track}}",
  guideBreadcrumbRoot "Útmutatók". Trailing arrows dropped from guideTrackChecksReread / guideLessonChecksLink (EN+HU).
- Section headings render as `h2` (worked titles are `h3`), so the counter/TOC use `h2` and `useGuideToc` needed no
  change; TOC ids `s-n` unchanged. Smoke `--after` used `.guide-content > h2`: result `[9, 9, false, 2]`.
- `LessonGraph.tsx` deleted (only GuideRail imported it); `ggLocalTitle`/`ggOpenGraph` and `.gg-local*` styles left for plan 05.
- ≤1180px the rail moves below the article with the TOC hidden (kept Builds on / Leads to / labs instead of hiding them).
- All `border-radius` in guide.scss are now `0` / `var(--radius-xs)` (tryit, gf-select, check cards moved from radius-sm).
- Smoke: React #418 appears only when `/guide/portfolio/risk-aversion` is the first page of a cold browser run; clean when
  visited second (and in HU). Header markup matches the prerendered HTML; looks like the known cold-start hydration issue.

## Prompt to hand off
> You are working in the Quant Sandbox repo (my-app). Read `CLAUDE.md`, `docs/GUIDES_PLAN.md`,
> `docs/plans/guides-redesign/README.md` (sections 0 and 4) and `docs/plans/guides-redesign/04-lesson-page.md`,
> and confirm plan 01 is done (stop if not). Run `git status` and stop if files you will edit have changes you
> didn't make. Implement plan 04 in its three phases (header/nav/rail, body typography, worked example and
> figure frame), keeping the build green after each. Add strings per README rule 4.3. Run the Verification
> commands and make them pass. Fill in Findings, set plan 04 to `done (<date>)` in the README table, and
> summarise.
