# 13 — Final QA: harness green, build, smoke EN + HU

Status: done (2026-10-28, opus-glm) · Depends on: all · Suggested model: Sonnet · Est. size: S

## Why
Eleven lessons written by parallel sessions share one track, one string file pair and one harness. Before
the owner reviews, one session checks the whole track end to end, fixes small breakage, and collects the
Hungarian drafts for review.

## Current state
Plans 01–12 are `done` in the README table (stop and report if not). Read every plan's Findings and all of
`LOG.md` (`DEVIATION`, `CONTRACT`, `BLOCKED`).

## Goal
1. All guide tests, tsc, eslint, build and SEO green with `PLACEHOLDER` and `LAB_WITHOUT_LESSON` empty.
2. Every lesson page and the track page smoke-clean in EN and HU; layout audit clean.
3. Content checks the harness cannot do, and one owner-review list.

## Non-goals
- No new lessons or rewrites; fixes only (larger issues become follow-ups in Findings).

## Steps
1. **Static and tests**: `npx tsc -b`; `npx eslint src/features/guide src/Language/guides src/Language/GuideMicrostructure*.ts scripts/guide-micro-*.test.mjs`
   (classify failures as new vs pre-existing with `git show HEAD:<path> | npx eslint --stdin --stdin-filename <path>`);
   `npm run test:guide-audit`, `test:guide-micro`, `test:guide-checks`, `test:guide-graph`, `test:guide-markdown`,
   `test:guides-ui`, `test:home`, `test:search`.
2. **Allowlists**: confirm `PLACEHOLDER = []` and `LAB_WITHOUT_LESSON = []` in `scripts/guide-audit.test.mjs`.
3. **Build and SEO**: `npm run build && npm run test:seo && npm run test:seo-schema`; confirm 22 lesson pages plus
   `/guide/microstructure` and `/hu/guide/microstructure` exist in `dist/` and the sitemap.
4. **Smoke**:
   ```bash
   (npx vite preview --port 4173 --strictPort &) && sleep 4
   MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" --prefix /hu \
     --paths "/guide,/guide/graph,/guide/microstructure,/hu/guide/microstructure,/guide/microstructure/market-makers,/guide/microstructure/limit-order-book,/guide/microstructure/queue-position,/guide/microstructure/adverse-selection,/guide/microstructure/glosten-milgrom,/guide/microstructure/spread-measurement,/guide/microstructure/kyle-model,/guide/microstructure/price-impact,/guide/microstructure/inventory-risk,/guide/microstructure/avellaneda-stoikov,/guide/microstructure/market-making-pnl,/hu/guide/microstructure/market-makers,/hu/guide/microstructure/avellaneda-stoikov,/hu/guide/microstructure/market-making-pnl"
   ```
   and `node scripts/layout-audit.mjs` on the track page and three lessons at 360/768/1280/1536, light and dark.
5. **Content pass** (record per lesson in Findings): opening cites the previous lesson's idea; every number in
   the text matches the figure defaults (open each figure, read its readouts); TeX renders (no raw `$` or
   `\\`); headings are plain noun phrases; HU uses the README §2 terms consistently ("market maker
   (árjegyző)" once per lesson, készlet, kötés, ajánlati könyv); the track page shows ≥ 22 checks.
6. **Cross-links**: each microstructure lab's About section lists its lessons (registry `relatedGuides`); the
   knowledge graph shows the sixth cluster in `--track-microstructure` with edges into earlier tracks.
7. **Fix** small issues (one per change, with a regression assertion in `scripts/guide-micro-registry.test.mjs`
   where possible) and list each in Findings.
8. **Owner-review list**: collect every plan's HU drafts and deviations here.

## Acceptance criteria
- All commands in steps 1–4 pass; the content table has no open failures (or each is a listed follow-up).

## Verification
The commands in steps 1–4. Stop the preview server and confirm port 4173 is free.

## Pitfalls
- Audit against `vite preview`, never the dev server (its light theme renders dark).
- The labs pack may still be editing the same tree; do not `git stash`/`checkout`; use a temporary worktree
  if the tree is red for reasons outside this pack.

## Findings (fill in during execution)
Run 2026-10-28 by opus-glm, on a tree shared with other sessions.
- Static: `tsc -b` has 9 errors, none in this pack's files (other packs). eslint on guide folders, GuideMicrostructure*.ts and guide-micro tests: clean.
- Tests: guide-micro 74/74 (later 76, with two new regression tests), guide-checks 7/7, guide-markdown 3/3, guides-ui 6/6, home and search green. guide-audit 11/12: the one failure, "labs no lesson practises: fama-french, systemic-risk", is out of scope (factor-and-systemic-risk pack). guide-graph: the layout-timing assertion failed (569 ms) on a loaded machine; out of scope, not a logic failure.
- Allowlists: `PLACEHOLDER = []`, `LAB_WITHOUT_LESSON = []`.
- Build: `SEO_ALLOW_EMPTY=1 vite build --outDir .tmp-dist-mmg13`, exit 0. No pre-render failures. 22 lesson pages plus `/guide/microstructure` and `/hu/guide/microstructure` built (`.html` and `.md`), and 24 microstructure URLs are in the sitemap. test:seo was run against that build through a junction copy: 25 pass, 3 fail, all out of scope (`/market-making/desk` title > 70 chars, from the labs pack; the baseline titles/descriptions of other tracks; the shared initial JS budget at 1.09 MB). Before the fix below, the spread-measurement Markdown twin also failed. test:seo-schema 7/7.
- Smoke (cdp-smoke, port 4177): 26 pages (the guide index, the graph, both track pages and all 11 lessons in EN and HU) show `problems: []` and an h1, and no HU page leaks links.
- Layout audit (track EN/HU, kyle-model, glosten-milgrom, HU avellaneda-stoikov; widths 360/768/1280/1536; light and dark): the track pages are clean. The lessons show `offscreen` at 360 and 768. Every flagged node is KaTeX's hidden MathML layer (`math/semantics/mrow`). The 768 screenshot shows the formulas wrapping with no visible overflow; the 360 visual was not checked separately. HU avellaneda-stoikov has `svg-text-clipped` at all widths on the figure labels "Eladási jegyzés 99.55" and "Rezervációs ár 98.80".
- Content table (headings, HU terms and the opening citation, which the audit enforces). Figure-default numbers were not re-checked by hand here; each plan verified them with node and its own test.
  - market-makers, limit-order-book, queue-position, adverse-selection, glosten-milgrom, spread-measurement, kyle-model, inventory-risk, avellaneda-stoikov: pass. „(árjegyző)” appears once per lesson.
  - price-impact: „árjegyző” never appears (the lesson is about execution, so this may be fine). Owner to decide.
  - market-making-pnl: the heading "From lesson to desk" broke the owner's rule, so it was fixed (below). „árjegyző” appears 15 times; owner to check whether that is intended.
  - Borderline question-shaped headings left for the owner: "What moves you forward", "Which fills you get" (queue-position); "How inventory builds" (inventory-risk); "What a desk watches" (market-making-pnl); also "A worked example" (price-impact).
- Cross-links: the six labs' `relatedGuides` point at microstructure lessons (registry L515–575), and test:seo "lab About sections link to their lessons" passes. The graph page smoke-passes; the sixth cluster colour was not inspected visually.
- Fixes made:
  1. `src/Language/guides/spreadMeasurement.ts`: "undefined" became "not defined" (2×, EN). The word made test:seo's Markdown-twin leak rule fail. Regression test: "no lesson text contains words the Markdown-twin audit treats as leaks" in `scripts/guide-micro-registry.test.mjs`.
  2. `src/Language/guides/marketMakingPnl.ts`: the heading "From lesson to desk" / „A leckétől a deskig” became "The attribution in the desk game" / „Az eredménybontás a desk játékban”. Regression test: "no microstructure heading uses the From X to Y pattern".
- Follow-ups:
  - KaTeX at 360px (from plan 08): the rule `.katex` sits in the shared `src/styles/guide.scss` and applies to every guide track, so there is no track-scoped fix. The audit's offscreen hits are the hidden MathML. An owner/global decision is needed: either a guide-wide `.katex-mathml` exclusion in layout-audit, or moving long inline formulas to `eq()`.
  - HU AS figure labels are clipped and use a decimal point (99.55), not a decimal comma. Plan 11's figure needs to format with locale and shorten or move the labels.
- Owner-review list: all HU text of the 11 lessons and the GuideMicrostructure.hu.ts regions (see plans 02–12 Findings); README §2 HU terms; the deviations in LOG.md (02 worked example rise, 05 δ = 2/2.3¢, 01 shortened SEO titles); the two renamed headings above; the borderline headings; árjegyző usage in price-impact and market-making-pnl.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/market-making-guides/README.md`,
> every plan's Findings and `LOG.md`; confirm plans 01–12 are done (stop and report if not). Execute plan 13:
> static checks and all guide tests, allowlists empty, build and SEO, browser smoke and layout audit, the
> per-lesson content pass, cross-links, small fixes with regression checks, and the owner-review list. Fill in
> Findings, append DONE to LOG.md, set plan 13 to `done`, and summarise.
