# 02 — Top bar restyle

Status: done (2026-10-20) · Depends on: 01 · Suggested model: Sonnet · Est. size: S

## Why
The top bar is on every page. It should carry the new identity first: serif wordmark, quiet category
links, square settings buttons.

## Current state (verified 2026-10-20)
- `src/components/layout/TopNavigation.tsx` (66 lines): `<header className="topnav">` →
  `.topnav-inner` → `NavLink.brand` (`t("brandTitle")` = "Quant Sandbox"), `nav.cat-tabs` with one
  `NavLink.cat-tab` per category (`.active` on the current one), `.topnav-controls` with
  `<ThemeToggle />` (button `.nav-icon-button`), `<LanguageMenu />` (`.nav-lang`, `.nav-lang-button`,
  `.nav-lang-chevron`, `.nav-lang-menu`, `.nav-lang-item`) and a mobile `button.nav-toggle`.
- Styles: `.topnav`, `.brand`, `.cat-tabs`, `.cat-tab`, `.topnav-controls` in
  `src/styles/_shell.scss` (lines ~8–70); `.nav-icon-button*` and `.nav-lang*` in
  `src/styles/layout.scss` (lines ~322–420). `.topnav` uses `--topbar-bg` and
  `backdrop-filter: blur(var(--topbar-blur))`.
- `.cat-tab.active` already uses a 2px **bottom** border in `--primary` (allowed: it is not a left bar).

## Goal
1. Wordmark in `--font-display`, 20–22px, weight 400, letter-spacing −0.01em.
2. Category links 13px, `--muted`, hover/active `--text`; active underline 1px in `--text`
   (the accent is reserved for key marks).
3. Theme and language buttons: 34px tall, square (`--radius-xs` = 2px after plan 01), 1px `--rule`
   border, transparent background; the language button reads "EN ▾" (chevron stays, it is a menu
   affordance, not an arrow link).
4. Top bar: solid `--topbar-bg`, 1px bottom border in `--rule`, height 60px desktop.

## Non-goals
- No search button yet (plan 06 adds it).
- No behaviour change in `ThemeToggle`, `LanguageMenu`, `MobileNav`.

## Constraints
- SCSS only, plus at most class names in TSX. Tokens only, no hex.
- Keep the 44px minimum touch target for `.nav-toggle` on mobile.

## Steps
1. `_shell.scss`: set `--topnav-height` usage to 60px desktop (it is a token in `tokens.scss`
   first block: change `--topnav-height: 48px` to `60px`; check `useStickyFit` and sticky offsets still
   use the token, not a literal).
2. `.topnav`: `background: var(--topbar-bg); border-bottom: 1px solid var(--rule);` remove the
   `backdrop-filter` line (solid bar, no blur).
3. `.brand`: `font-family: var(--font-display); font-weight: 400; font-size: 21px; letter-spacing: -0.01em;`
4. `.cat-tab`: `font-size: 13px;` active: `border-bottom: 1px solid var(--text);` (replace the 2px
   primary underline). Gap between tabs `var(--space-6)`.
5. `layout.scss` `.nav-icon-button` and `.nav-lang-button`: `height: 34px; border: 1px solid var(--rule);
   border-radius: var(--radius-xs); background: transparent;` hover: `background: var(--surface)`.
   `.nav-lang-menu`: square, `border: 1px solid var(--rule)`, `background: var(--bg)`, no shadow.
   `.nav-lang-item.active`: `background: var(--surface-soft)` (no left bar).
6. Check `MobileNav` styles don't depend on the old 48px height literal.

## Acceptance criteria
- No `border-radius` larger than `var(--radius-xs)` in the top-bar rules.
- `grep -n "backdrop-filter" src/styles/_shell.scss` finds no top-bar use.
- Smoke: no problems on `/`, `/hu/`, `/black-scholes`; the sticky sidebar still starts below the bar.

## Verification
```bash
npx tsc -b && npm run build
npx vite preview --port 4173 &
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 \
  --paths "/,/hu/,/black-scholes,/guide/derivatives" --ignore "_vercel/insights" \
  --after "/black-scholes|getComputedStyle(document.querySelector('.brand')).fontFamily"
# expect: no problems; value contains "Newsreader"
```
Stop the server and check the port is free.

## Pitfalls
- `--topnav-height` drives sticky offsets (`.sidebar-inner top`, `max-height`) and `useStickyFit`;
  change the token, never add a literal 60px.
- `ThemeToggle` and `LanguageMenu` may also appear in `MobileNav`; restyle by class so both stay
  consistent.

## Findings (fill in during execution)
- `--topnav-height` was already 60px (plan 01). Mobile overrides in `layout.scss` keep 32px controls as before; `.nav-toggle` size untouched.
- Smoke on `/`, `/hu/`, `/black-scholes`, `/guide/derivatives`: no problems; brand font Newsreader, bar 60px, lang button radius 2px.

## Prompt to hand off
> You are working in the Quant Sandbox repo (my-app). Read `CLAUDE.md`, `docs/plans/home-redesign/README.md`
> (sections 0 and 4) and `docs/plans/home-redesign/02-top-bar.md`, and confirm plan 01 is done (stop if not).
> Run `git status` and stop if `src/styles/_shell.scss` or `src/styles/layout.scss` have changes you didn't
> make. Implement plan 02: serif wordmark, 60px solid top bar with a hairline, quieter category links with a
> 1px text-colour underline, square theme/language buttons and menu. Run the Verification commands and make
> them pass. Fill in Findings, set plan 02 to `done (<date>)` in the README table, and summarise.
