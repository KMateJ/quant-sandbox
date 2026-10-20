# 05 — Home page UI

Status: done (2026-10-20) · Depends on: 01, 03, 04 · Suggested model: Sonnet · Est. size: L (3 phases)

## Why
This is the page the redesign is for: the first impression of Quant Sandbox as a serious, premium
place to learn quantitative finance.

## Current state (verified 2026-10-20)
- **Known uncommitted edits (expected; proceed):** `HomeCatalogue.tsx` and
  `HomeRoadmap.tsx` add `className="home-section"`, and `src/styles/layout.scss` has extra home rules,
  from an earlier session. These files are replaced or cleaned up by this plan anyway; do not stop
  because of them.
- `src/features/home/HomeView.tsx` renders `HomeHero` (81 lines: title, lede, 3 pillars),
  `HomeCatalogue` (56: search + `CatalogueSection` per category, 52), `HomeRoadmap` (30: three
  `dev-card` lists from `devRecent/devUpcoming/devFuture` + `devItem*` keys), and a `.home-footnote`.
- Old styles in `src/styles/layout.scss`: `.dev-stack/.dev-card*` (~904–965), `.home-hero*`,
  `.home-pillar*` (~968–1050), `.catalogue-*` (~1054–1160), `.home-footnote` (~1164–1180),
  `.mod-grid/.mod-card*` (~1260–1300), `.home-section*` and duplicate `.home-pillar*` (~1607–1640).
  These selectors are used only by `src/features/home/*` (verify with grep before deleting).
- Strings: `src/Language/Home.ts` (`homeEn`) and `src/Language/Home.hu.ts` (`homeHu`); existing keys
  include `heroTitle`, `heroLede`, `statusBeta`, `statusPlanned`, `catDerivatives…catStochastic`,
  `catDerivativesDesc…`, `homeSearchPlaceholder`, `homeSearchAria`, `homeNoResults`, `devTitle`,
  `devRecent/devUpcoming/devFuture`, `devItem*`.
- From plan 03: `MODULE_VIZ`, `GUIDE_FILLER_VIZ`, `areaPath()` (`home.viz.ts`); `buildFan`,
  `HERO_FAN` (`home.fan.math.ts`); `orderTiles`, `needsGuideFiller`, `categoryNumber`,
  `trackProgress` (`home.model.ts`); `homeFeatured` on `ModuleDef`.
- From plan 04: `useLastLab()` in `src/components/layout/useLastLab.ts` (null before hydration).
- Registry helpers: `CATEGORY_ORDER`, `CATEGORY_LABEL_KEYS`, `CATEGORY_DESC_KEYS`,
  `modulesInCategory()`, `modules` (`src/modules/registry.ts`). Lab categories = `CATEGORY_ORDER`
  minus `"guides"`. Guide track ids equal the category ids (`GuideTrackId`).
- Guide helpers: `guideTrackById(id)`, `trackLessons(track)`, `guideTrackPath(id)`, `guidePath(id)`,
  `guideLessons` (`src/features/guide/guide.meta.ts`); `useGuideProgress().isRead(id)`
  (`useGuideProgress.ts`, empty before hydration). Track titles: `guideTrack*Title` keys.
- Tokens after plan 01: `--bg`, `--surface`, `--rule`, `--rule-strong`, `--text`, `--text-sub`,
  `--muted`, `--text-dim`, `--accent`, `--font-display`, `--font-sans`, `--font-mono`, radii 2px.

## Goal (the page, top to bottom)
1. **Hero** — a ruled two-cell row: left = eyebrow (mono, uppercase, 11.5px, `--muted`), headline in
   `--font-display` 68px/0.98 weight 400 ("Learn quant finance by seeing it *move*." — the last word
   italic in `--accent`), lede 16px `--text-sub` max 460px, two square buttons (primary: `--text`
   background, `--bg` text, "Begin the first lesson" → first lesson of the derivatives track;
   secondary: 1px border, "Explore the labs" → `#labs`). Right = **fan figure**: SVG `0 0 720 420`,
   axes, 70 paths (ivory = `--text` at opacity .22, width .8; the `keyIndex` path in `--accent` width
   1.8), dashed mean line, histogram bars (`--rule-strong`) at x 612, "S₀ 100" marker, axis labels,
   a mono caption "Fig. 1 — geometric Brownian motion, μ 7%, σ 30%" and "70 paths".
2. **Stats row** — ruled cells under the hero: 24 · interactive labs, 55 · lessons in five tracks,
   5 · areas of finance, 2 · languages (EN · HU); big numbers in `--font-display` 36px. Last, wider
   cell = **Continue**: with `useLastLab()` → mono eyebrow "Continue", lab name, link text "Resume"
   in `--accent`; without → eyebrow "Start here", first derivatives lesson title, "Begin".
   Counts are computed (lab modules count, `guideLessons.length`, lab categories count), never typed.
3. **Labs** (`id="labs"`) — header: eyebrow "The labs", `h2` "{{n}} instruments" (display 44px), on
   the right filter buttons (All + 5 categories; 13px; active = `--text` + 1px underline;
   `aria-pressed`) and, until plan 06 lands, a plain search field (square, 1px border). Then per
   category: a row with number ("01", mono, `--accent`), name (display 30px), description (`--muted`),
   and a right-aligned link "{{track}} · {{n}} lessons" to `guideTrackPath(category)`; below it a
   **ruled bento** (4 columns; featured tile spans 2×2): each tile shows mono code ("01.1") and status
   ("BETA", mono uppercase, `--text-dim`), the mini drawing (`MODULE_VIZ[id]`; non-key lines `--text`,
   key line and key dot `--accent`; `area` lines also get a `--text` fill at .05; featured adds axes
   and gridlines in `--rule-strong`/`--rule`), the name (featured: display 32px; others: sans 15.5px)
   and a one-line description (13px `--muted`). If `needsGuideFiller`, add a tile linking to the
   category's guide track with `GUIDE_FILLER_VIZ`.
4. **Guide tracks** — eyebrow "The guides", `h2` "{{n}} lessons, in order", link "All guides"; a
   ruled table, one row per track: number (`--accent`), title (display 22px), a 1px progress line with
   a 3px `--accent` fill (`trackProgress`), "read / total" (mono), and "Begin"/"Continue".
5. **Roadmap** — keep `HomeRoadmap` content, restyled as a ruled 3-column list (no coloured cards,
   no tones). Owner question in Findings: keep or drop.
6. **No arrows anywhere**, no pills, no gradients, no shadows, square edges.
7. **Motion:** fan paths draw in once (`pathLength="1"`, dash offset 1→0 over 2.8s, staggered
   `animation-delay` i·0.02s); a tile's key line redraws on hover (1s); tile hover = `--surface`
   background. All off under `prefers-reduced-motion: reduce`.
8. **Responsive:** ≤1100px: hero stacks (text, then figure 300px tall), stats 2 columns (Continue spans
   2), bento 2 columns (featured spans 2×1). ≤640px: bento stays 2 columns (featured full width, small
   tiles 2 per row, drawing 40px tall); filter buttons scroll horizontally; CTAs become a 2-column
   ruled row 52px tall; headline 42px.

Lab descriptions (new keys `homeLabDesc_<camelId>`, EN; draft HU, list in Findings):
payoff "Build option strategies and read the payoff at expiry." · binomial "Price an option step by
step on a recombining tree." · black-scholes "Closed-form price and every Greek, across spot and
time." · heston "Stochastic volatility and the shape of the smile." · delta-hedging "Rebalance a hedge
and watch the replication error." · bond-pricing "Price, yield and the coupon effect on one curve." ·
yield-curve "Bootstrap zeros, forwards and discount factors from par quotes." · duration-convexity
"First- and second-order rate risk, side by side." · treasury-futures "Conversion factors, basis and
cheapest-to-deliver." · immunization "Match duration so rate moves cancel out." · risk-return "Mean,
volatility, correlation and Sharpe from returns." · capm "Beta, the security market line and alpha." ·
portfolio-lab "Diversification with two to many assets." · efficient-frontier "Minimum variance, the
frontier and the tangency portfolio." · npv-irr "Project cash flows, hurdle rates and the NPV profile."
· valuation "Forecast cash flows, discount them, add terminal value." · tvm "Compounding, discounting
and annuities." · wacc "Cost of equity, cost of debt and the blend." · capital-structure "Leverage,
taxes and firm value." · stochastic-models "From random walks to Brownian motion, by experiment." ·
brownian-motion "Drift, volatility and seeded sample paths." · gbm "Log-normal price paths and their
expected value." · ito-process "Why log prices drift at μ − ½σ²." · monte-carlo "Price by simulation
and watch the estimate converge."
Put the id → key map in `home.model.ts` (`labDescKey(id)`) so the view stays dumb; extend the plan 03
test: every lab id has a description key present in `homeEn`.

## Non-goals
- No global search (plan 06), no top-bar changes (plan 02), no lab changes.
- Do not change `SiteFooter`.

## Constraints
- Every `.tsx` ≤ ~150 lines; math/data in `home.*.ts`; strings in `Home.ts` + `Home.hu.ts`.
- Styles in a new `src/styles/_home.scss` (`@use "home";` in `src/styles/main.scss`, after
  `"primitives"`). Add the reusable ruled grid to `src/styles/_primitives.scss`:
  `.ruled-grid { display: grid; gap: 1px; background: var(--rule); border: 1px solid var(--rule); }`
  `.ruled-grid > * { background: var(--bg); }`.
- Hydration: no `Math.random`, no `Date` in render; storage-backed parts render their empty state first.

## Steps
**Phase A — strings and data (build green before B).**
1. Add new EN keys to `homeEn` and HU drafts to `homeHu`: `homeEyebrow`, `heroTitleLead` ("Learn quant
   finance by seeing it"), `heroTitleAccent` ("move"), `heroLede` (replace: "Change an input and watch
   prices, curves and risk respond. Then read the reasoning behind it, one careful step at a time."),
   `homeCtaBegin`, `homeCtaLabs`, `homeStatLabs`, `homeStatLessons`, `homeStatAreas`,
   `homeStatLanguages`, `homeContinue`, `homeResume`, `homeStartHere`, `homeBegin`, `homeLabsEyebrow`,
   `homeLabsTitle` ("{{n}} instruments"), `homeFilterAll`, `homeFilterAria`, `homeCategoryGuide`
   ("{{track}} · {{n}} lessons"), `homeGuideTileName` ("{{track}} guide"), `homeGuideTileDesc`
   ("{{n}} lessons, each paired with its lab."), `homeGuidesEyebrow`, `homeGuidesTitle`
   ("{{n}} lessons, in order"), `homeAllGuides`, `homeFigCaption`, `homeFigPaths` ("{{n}} paths"),
   `homeFigDistribution` ("S_T distribution"), `homeFigAria`, plus the 24 `homeLabDesc_*` keys.
2. `home.model.ts`: add `labDescKey(id)` and extend `scripts/home.test.mjs` as described above.

**Phase B — components** (all in `src/features/home/`, each one job):
`HomeView.tsx` (composition) · `HomeHero.tsx` (text + CTAs) · `HomeFanFigure.tsx` (SVG; compute
`const FAN = buildFan(HERO_FAN)` at module scope) · `HomeStats.tsx` + `HomeContinue.tsx` ·
`HomeLabs.tsx` (header, filter state, search state, sections) · `HomeLabsFilter.tsx` ·
`HomeLabCategory.tsx` · `HomeLabTile.tsx` · `MiniViz.tsx` (draws a `ModuleViz`) · `HomeTracks.tsx` ·
`HomeRoadmap.tsx` (restyled). Delete `HomeCatalogue.tsx` and `CatalogueSection.tsx` (their search logic
moves into `HomeLabs`: filter modules by `t(m.navKey)` containing the trimmed lowercase query; show
`homeNoResults` when empty). Use `NavLink`/`Link` for internal links (the router adds `/hu`).

**Phase C — styles and cleanup.**
3. Write `_home.scss` per Goal (class names prefixed `home-`). Fan animation:
   `.home-fan path.home-fan-path { stroke-dasharray: 1; stroke-dashoffset: 1; animation: home-draw 2.8s cubic-bezier(.25,.7,.2,1) forwards; }`
   `@keyframes home-draw { to { stroke-dashoffset: 0; } }` and the reduced-motion override.
4. Delete the old home selectors from `layout.scss` listed in Current state, after
   `grep -rn "<selector>" src --include=*.tsx` shows no users outside `src/features/home`.

## Acceptance criteria
- `/` and `/hu/` show the sections above; no "→" in `src/features/home` (`grep -rn "→" src/features/home`).
- 25 tiles on `/` (24 labs + 1 portfolio guide filler); filter "Fixed Income" shows 5.
- No hydration or console errors; `npm run test:home` passes; every new `.tsx` ≤ 150 lines.
- `grep -n "linear-gradient\|radial-gradient\|box-shadow" src/styles/_home.scss` finds nothing.

## Verification
```bash
npm run test:home && npx tsc -b && npm run build
npx eslint src/features/home src/Language/Home.ts src/Language/Home.hu.ts
npx vite preview --port 4173 &
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --paths "/,/hu/" \
  --ignore "_vercel/insights" \
  --after "/|document.querySelectorAll('.home-tile').length" \
  --after "/|(async()=>{[...document.querySelectorAll('.home-filter')].find(b=>b.textContent.includes('Fixed'))?.click();await new Promise(r=>setTimeout(r,300));return document.querySelectorAll('.home-tile').length})()"
# expect: no problems; 25; 5
```
Stop the server and check port 4173 is free.

## Pitfalls
- Pre-rendered + hydrated page: compute the fan at module scope from the seed; render Continue and
  track progress from hooks that return empty state on the server (`useLastLab`, `useGuideProgress`).
- `vector-effect="non-scaling-stroke"` keeps mini-drawing strokes thin when tiles stretch; without it
  the featured tile's lines get thick.
- `pathLength="1"` is required for the 0→1 dash animation; React accepts `pathLength`.
- Don't colour categories; the only colour is `--accent`.
- `homeLabsTitle` with a numeral is fine in both languages; don't spell numbers out.

## Findings (fill in during execution)
- New HU strings for owner review: all `homeLabDesc_*`, `homeEyebrow`, `heroTitleLead/Accent`, `heroLede`, `homeCta*`, `homeStat*`, `homeContinue/Resume/StartHere/Begin`, `homeLabsEyebrow/Title`, `homeFilter*`, `homeCategoryGuide`, `homeGuideTile*`, `homeGuides*`, `homeAllGuides`, `homeFig*` (drafts in `src/Language/Home.hu.ts`).
- Owner question: keep the roadmap section on the home page? (kept, restyled)
- Deviations and why: new `home.data.ts` holds registry-derived constants (lab categories, counts, start lesson). Bento uses its own border rules instead of `.ruled-grid` so partial rows (search results) leave no filled holes. Dots on featured drawings are drawn at 0.45 radius since the drawing is scaled up. Old `.dev-*`, `.home-hero/pillar`, `.catalogue-*`, `.mod-*`, `.home-section` rules removed from `layout.scss`. Visual check: headless screenshots at 1440 and 390 wide.

## Prompt to hand off
> You are working in the Quant Sandbox repo (my-app). Read `CLAUDE.md`, `docs/plans/home-redesign/README.md`
> (sections 0 and 4) and `docs/plans/home-redesign/05-home-page.md`, and confirm plans 01, 03 and 04 are done
> (stop if not). Run `git status` and stop if `src/features/home/`, `src/Language/Home*.ts` or
> `src/styles/layout.scss` have changes you didn't make. Implement plan 05 in its three phases (strings and
> data, components, styles and cleanup), keeping the build green after each. Run the Verification commands and
> make them pass. Fill in Findings (list every new HU string), set plan 05 to `done (<date>)` in the README
> table, and summarise.
