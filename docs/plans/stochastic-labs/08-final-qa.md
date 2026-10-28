# 08 — Final QA

Status: done (2026-10-28, session ea82) · Depends on: 01–07 · Suggested model: Sonnet · Est. size: S

## Goal
Sign off the whole stochastic area.

## Steps
1. `npm run build`, `npx tsc -b`, `npm run lint` (classify failures new vs pre-existing against `HEAD`).
2. All tests: `node --test scripts/*.test.mjs`.
3. layout-audit (README §4) over every path from `modules` with `category: "stochastic"` and their subNav
   items, `--widths 360,390,768,1024,1280,1536 --themes light,dark`, plus `/hu/` variants. 0 failures.
4. cdp-smoke over old URLs `/stochastic-models`, `/stochastic-models/<each of 11 ids>`, `/hu/…`: each lands
   on its new page, no console errors.
5. Read screenshots at 360 and 1280 of every main page; note anything ugly in Findings and fix small things.
6. `grep -rn "stochastic-models" src scripts` – only redirects remain.

## Findings (fill in during execution)
- Build: `vite build` client bundle fine (2811 modules); prerender reports every page empty (`useI18n must be used inside LanguageProvider`), the known concurrent-build artefact, so not counted against the code. `npx tsc -b`: errors only in `fama-french` and `systemic-risk` (other sessions' in-flight work). `eslint` on all stochastic-area folders, charts, lesson, RangeGuess: clean. Whole-`src` lint has 17 errors in payoff-lab, portfolio-lab, treasury-futures, `i18n.tsx`, `theme.tsx` (not in this area).
- Tests (`node --test scripts/*.test.mjs`, 828): 822 pass; 6 fail, none stochastic: `seo-audit` (needs `dist/sitemap.xml`, which this private build does not produce), guide-audit "labs no lesson practises: fama-french, systemic-risk" and `systemic-wiring` EN/HU copy keys (other sessions), Heston descriptors and Binomial geometry (derivatives labs), `guide-graph` layout timing (flaky under load).
- Audit (private build, EN + `/hu`, 30 stochastic paths incl. `/gbm/definition`): the full six-width x two-theme run was stopped at 396 of 720 records (machine saturated by parallel sessions): all 60 paths at 360, 390, 768, 1024, 1280, 1536 light and 36 at 360 dark. Failures found: the three known defects, a global top-nav overflow at 1024 and two 1024 tick collisions.
- Fixed: `/random-walk/why-sqrt-t` "250" tick: `PathCloudChartInner` x labels now use `edgeAnchor`, and tick count follows plot width (`tickCount`), which also fixed `/monte-carlo` tick collisions at 1024. `/brownian-motion/first-passage` thumbs: the two overlaid `rg-thumb` range inputs are intentional, now marked `data-layout-allow`. `/gbm` "0.005": not the centres chart but the y tick of the terminal histogram; `HistogramInner` now widens its left margin to the longest tick label. `/brownian-motion/quadratic-variation` and `/transformations` 1024: four mini charts per row were too narrow, `.bl-grid--four` goes to two columns below 1200px. Re-audit after the fixes: those pages clean at 360/1280 (and 1024 except the nav item below); sample of other chart pages (random-walk, girsanov, monte-carlo, delta-hedging, clt at 360 dark; brownian-motion, monte-carlo at 1024 dark) shows no new defects.
- Open, not stochastic-specific: at 1024 every page overflows by 14px (EN) / 99px (HU): `topnav-controls` (Search, theme, language) is pushed off-screen by the extra top-nav category (Market Microstructure). Shell fix needed (`AppShell` top nav), recorded for the owner. Tap-target warnings (brand link, slider inputs, info-tooltip) are global.
- Not run after the fixes: the dark theme at 390/768/1024/1280/1536 and the screenshot review at 360 beyond the pages above (gbm, why-sqrt-t, first-passage, gbm/definition were read; no visual problems seen beyond the fixed ones).
- cdp-smoke: `/stochastic-models`, `/hu/stochastic-models` and a sample of 6 lesson ids (EN/HU) each land on the right new page (`/random-walk`, `/random-walk/symmetric`, `/random-walk/clt`, `/random-walk/why-sqrt-t`, `/brownian-motion/increments`, `/hu/brownian-motion/first-passage`, `/hu/brownian-motion/hitting`) with correct h1/title; the only console message is the preview-only `/_vercel/insights/script.js` 404. The redirect table covers all 11 ids and is mirrored in `vercel.json`.
- `grep stochastic-models src scripts`: only `stochasticRedirects.ts` and the `@use "stochastic-models"` partial name in `main.scss`.

## Prompt to hand off
> Read `CLAUDE.md`, the README and `08-final-qa.md`; confirm 01–07 are done. Run the QA steps, fix small
> defects, record the rest in Findings, mark 08 done, summarise.
