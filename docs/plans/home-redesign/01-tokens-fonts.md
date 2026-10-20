# 01 — Palette, fonts and square radii tokens

Status: done (2026-10-20) · Depends on: – · Suggested model: Sonnet · Est. size: M

## Why
The redesign's look (navy ground, one blue accent, serif display, square edges) must come from the
design tokens so every page picks it up and the palette can be swapped later in one place.

## Current state (verified 2026-10-20)
- `src/styles/tokens.scss` (164 lines):
  - First `:root` block (lines ~1–53): fonts, type scale, spacing, radii, control heights, layout sizes.
    ```scss
    --font-sans: 'Inter Variable', Inter, system-ui, Arial, sans-serif;
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    --font-serif: 'Source Serif 4 Variable', 'Source Serif 4', Georgia, 'Times New Roman', serif;
    --radius-pill: 999px; --radius-code: 6px; --radius-card-soft: 14px; --radius-card-strong: 18px;
    --radius-control: 12px; --radius-control-sm: 10px; --radius-md: 14px; --radius-lg: 20px;
    --radius-sm: 6px; --radius-xs: 4px;
    ```
  - `:root, :root[data-theme="dark"]` (lines ~55–110): `--bg #0b1220`, `--surface #162033`,
    `--surface-soft #24324a`, `--surface-muted #1d2940`, `--text #f8fafc`, `--text-inverse #fff`,
    `--muted #9fb0c9`, `--border #465975`, `--border-hover #b8c5d9`, `--primary #3b82f6`,
    `--primary-strong #2563eb`, chart tokens `--chart-1…8`, `--chart-*` roles, warning/success
    tokens, `--topbar-bg rgba(11,18,32,.88)`, `--shadow`.
  - `:root[data-theme="light"]` (lines ~112–164): same names, light values.
- `src/main.tsx` imports fonts:
  ```ts
  import "@fontsource-variable/inter";
  import "@fontsource-variable/source-serif-4/opsz.css";
  import "@fontsource-variable/source-serif-4/opsz-italic.css";
  ```
- `src/index.scss` mentions `Inter` (check and switch it to `var(--font-sans)`).
- Font tokens are used ~42 times in `src/styles/*.scss`; guides use `--font-serif` for reading text.
- Theme switching: `src/theme.tsx` sets `data-theme` on `<html>`.

## Goal
1. Dark theme = **Sapphire** palette, light theme = **Porcelain** palette, via the existing token names
   plus five new ones.
2. Fonts: Geist (`--font-sans`), Geist Mono (`--font-mono`), Newsreader (`--font-serif` and new
   `--font-display`).
3. All non-pill radius tokens become `2px`.

## Non-goals
- Do not change chart tokens (`--chart-*`): labs need categorical series colours.
- Do not edit component SCSS beyond `index.scss` (plans 02, 05, 07 do that).
- Do not touch `--radius-pill` (plan 07 decides each use).

## Constraints
- Tokens stay CSS custom properties in `tokens.scss`. No hard-coded hex elsewhere.
- Contrast: body text ≥ 4.5:1 on its ground (the values below satisfy this).

## Steps
1. Install fonts: `npm install @fontsource-variable/geist @fontsource-variable/geist-mono @fontsource-variable/newsreader`
   (all at 5.3.x). Check the CSS file names inside each package (`ls node_modules/@fontsource-variable/newsreader`);
   use the opsz + italic files for Newsreader if present (`opsz.css`, `opsz-italic.css`), else `index.css`
   and `wght-italic.css`. Read the `font-family` name each CSS file declares (e.g. `'Geist Variable'`).
2. `src/main.tsx`: replace the three font imports with the Geist, Geist Mono and Newsreader ones.
   Remove `@fontsource-variable/inter` and `@fontsource-variable/source-serif-4` from `package.json`
   **only after** `grep -rn "inter\|source-serif" src` shows no other users.
3. `tokens.scss` first `:root` block:
   ```scss
   --font-sans: 'Geist Variable', Geist, system-ui, Arial, sans-serif;
   --font-mono: 'Geist Mono Variable', 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
   --font-serif: 'Newsreader Variable', Newsreader, Georgia, 'Times New Roman', serif;
   --font-display: var(--font-serif);
   ```
   (use the exact family names from step 1). Set `--radius-code`, `--radius-card-soft`,
   `--radius-card-strong`, `--radius-control`, `--radius-control-sm`, `--radius-md`, `--radius-lg`,
   `--radius-sm`, `--radius-xs` to `2px`. Leave `--radius-pill`.
4. Dark block (`:root, :root[data-theme="dark"]`) — set these, keep all chart/warning/success tokens:
   | Token | Sapphire value |
   |---|---|
   | `--bg` | `#0a1222` |
   | `--surface` | `#0f1a2e` |
   | `--surface-soft` | `#152036` |
   | `--surface-muted` | `#121d33` |
   | `--text` | `#e8eef7` |
   | `--text-inverse` | `#0a1222` |
   | `--muted` | `#8c9ab2` |
   | `--border` | `#26344f` |
   | `--border-hover` | `#2e3d5c` |
   | `--primary` | `#6f9cf0` |
   | `--primary-strong` | `#4f86f7` |
   | `--topbar-bg` | `#0a1222` |
   | `--shadow` | `none` |
   Add new tokens in the same block: `--rule: #1c2840;` (hairlines between cells),
   `--rule-strong: #26344f;` (chart axes), `--text-sub: #a9b5c9;`, `--text-dim: #6b7a94;`,
   `--accent: #6f9cf0;`.
5. Light block (`:root[data-theme="light"]`) = Porcelain:
   `--bg #f5f7fb`, `--surface #ffffff`, `--surface-soft #eaeef6`, `--surface-muted #e4e9f2`,
   `--text #0f1b33`, `--text-inverse #f5f7fb`, `--muted #5a6782`, `--border #c3cbdb`,
   `--border-hover #b9c3d6`, `--primary #1f55d1`, `--primary-strong #1a47b0`, `--topbar-bg #f5f7fb`,
   `--shadow none`, `--rule #d6dce8`, `--rule-strong #c3cbdb`, `--text-sub #42506b`,
   `--text-dim #7a869e`, `--accent #1f55d1`.
6. `src/index.scss`: replace any literal `Inter` font stack with `var(--font-sans)`.
7. Add a comment above the dark block: `// Palette "Sapphire" (dark) / "Porcelain" (light). Alternatives studied: Midnight royal, Prussian, Steel ink, Deep cobalt — see docs/plans/home-redesign/01-tokens-fonts.md.`
   Put the alternatives table (below) in this plan's Findings untouched, for the owner.

Alternative dark palettes (for the owner; do not apply):
| Name | bg | surface | rule | rule-strong | text | muted | accent |
|---|---|---|---|---|---|---|---|
| Midnight royal | #060b18 | #0b1224 | #18213a | #232f4d | #eef2fb | #8a97b3 | #4d8dff |
| Prussian | #0b1b2b | #10233a | #1d3349 | #284360 | #e9f0f6 | #8fa4b8 | #63b3e6 |
| Steel ink | #0d1117 | #121821 | #222b37 | #2c3746 | #e6ebf1 | #8b96a5 | #8fb2dc |
| Deep cobalt | #0a1640 | #0f1d4f | #1d2c63 | #283a78 | #eef1fb | #98a5cc | #8fb0ff |

## Acceptance criteria
- `grep -n "Inter\|Source Serif" src/styles src/index.scss src/main.tsx` finds nothing.
- Both theme blocks define `--rule`, `--rule-strong`, `--text-sub`, `--text-dim`, `--accent`.
- All radius tokens except `--radius-pill` are `2px`.
- Build passes; smoke shows no console errors; the guide reading text renders in Newsreader
  (`getComputedStyle(document.querySelector('.guide-content')).fontFamily` contains `Newsreader`).

## Verification
```bash
npx tsc -b && npm run build
npx vite preview --port 4173 &
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 \
  --paths "/,/hu/,/black-scholes,/yield-curve,/guide/derivatives" --ignore "_vercel/insights" \
  --after "/guide/derivatives|getComputedStyle(document.body).fontFamily"
# expect: no problems; the --after value contains "Geist"
```
Stop the preview server afterwards and check port 4173 is free.

## Pitfalls
- **Font family names differ from package names** (`'Geist Variable'`, not `Geist`). Read them from
  the package CSS, or text silently falls back to system-ui.
- `--border` is used for form controls; setting it to the hairline colour makes inputs disappear.
  That is why `--rule` is a new token and `--border` stays one step stronger.
- `--shadow: none` removes card shadows app-wide by design; if some component uses `--shadow` inside a
  `box-shadow` list with other values, the whole declaration becomes invalid — grep `var(--shadow)` and
  check each use is on its own.
- The guide session uses `--font-serif`; note the change in `docs/GUIDES_PLAN.md` Log (one line).

## Findings (fill in during execution)
- Font CSS files and family names used: `geist/index.css` ('Geist Variable'), `geist-mono/index.css` ('Geist Mono Variable'), `newsreader/opsz.css` + `opsz-italic.css` ('Newsreader Variable').
- Removed packages: `@fontsource-variable/inter`, `@fontsource-variable/source-serif-4`. Kept `@fontsource/inter` (devDependency): `seo/ogImages.ts` reads its .woff files for OG images and the build fails without it.
- Deviations and why: `src/index.scss` is not imported anywhere; its `--sans/--heading` now point at `var(--font-sans)` anyway. `NotFoundArt.tsx` hard-coded 'Source Serif 4 Variable' in an SVG attribute; now `var(--font-serif)`. Smoke on the full working tree reports React hydration error #418 on every page, but HEAD plus only plan 01's files (tokens, fonts, main.tsx, index.scss, NotFoundArt) smokes clean on `/`, `/yield-curve`, `/guide/derivatives`, and HEAD alone is clean too. The #418 comes from other sessions' uncommitted work (plans 03/04/05 area: `HomeCatalogue.tsx`, `HomeRoadmap.tsx`, `AppShell.tsx`), not from plan 01. Body font computes to Geist.
- Alternative palettes (for owner): table above.

## Prompt to hand off
> You are working in the Quant Sandbox repo (my-app). Read `CLAUDE.md`, `docs/plans/home-redesign/README.md`
> (sections 0 and 4) and `docs/plans/home-redesign/01-tokens-fonts.md`. Run `git status` first and stop if
> `src/styles/tokens.scss`, `src/main.tsx` or `src/index.scss` have changes you didn't make. Implement plan 01:
> install Geist, Geist Mono and Newsreader via fontsource, switch the font tokens, set the Sapphire (dark) and
> Porcelain (light) token values plus the five new tokens, and square all non-pill radius tokens. Run the
> Verification commands and make them pass. Add one line to the Log in `docs/GUIDES_PLAN.md` saying
> `--font-serif` is now Newsreader. Fill in Findings, set plan 01 to `done (<date>)` in the README table, and
> summarise what changed and anything you skipped.
