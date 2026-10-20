# 06 — Global search (Ctrl K)

Status: done (2026-10-20) · Depends on: 02, 05 · Suggested model: Sonnet · Est. size: M

## Why
The design puts "Search · Ctrl K" in the top bar: one place to jump to any lab or lesson from any page,
replacing the home-only search field.

## Current state (verified 2026-10-20)
- Top bar: `src/components/layout/TopNavigation.tsx` — `.topnav-controls` holds `<ThemeToggle />`,
  `<LanguageMenu />`, mobile `.nav-toggle`. Styles in `_shell.scss` / `layout.scss` (`.nav-icon-button`).
- After plan 05: `src/features/home/HomeLabs.tsx` has a temporary search field filtering lab tiles.
- Data: `modules` (`src/modules/registry.ts`; lab categories = `CATEGORY_ORDER` minus `"guides"`;
  label `t(m.navKey)`, area `t(CATEGORY_LABEL_KEYS[m.category])`); `guideLessons`
  (`src/features/guide/guide.meta.ts`; `titleKey`, `descKey`, `track`) with `guidePath(id)`;
  track titles via `guideTrackById(track).titleKey`.
- `src/components/layout/useSidebarPin.ts` contains an `isTyping(target)` helper (input, textarea,
  select, contenteditable) used for its keyboard shortcut.
- Languages: EN and HU (`useI18n().t`); HU titles contain accents (á, é, ő, ű…).
- Router basename adds `/hu`; use `useNavigate()` with unprefixed paths.

## Goal
1. Top-bar button "Search" + mono "Ctrl K" (icon-only below 760px), square, 1px `--rule` border.
2. Ctrl K / ⌘K anywhere (not while typing in a field) opens a modal palette: input + grouped results
   (Labs, Lessons), keyboard navigation, Enter opens, Esc closes, focus returns to the trigger.
3. Accent- and case-insensitive matching on title, area/track and lesson description; labs rank above
   lessons on equal score; max 8 per group.
4. Remove the temporary search field from `HomeLabs.tsx` (filter buttons stay).

## Non-goals
- No full-text search of lesson bodies, no fuzzy-matching library, no new dependencies.

## Constraints
- Pure ranking in `src/components/layout/search.logic.ts` (no React); view ≤150 lines per file.
- Strings in `src/Language/Home.ts` / `Home.hu.ts` (they already hold nav strings).
- Square, flat (no shadow other than a 1px `--rule` border), `--bg` background, backdrop
  `rgba(0,0,0,.5)` (dark) — use a token `--backdrop` added to both theme blocks in `tokens.scss`
  (`rgba(0,0,0,.55)` dark, `rgba(15,27,51,.25)` light).

## Steps
1. Move `isTyping` from `useSidebarPin.ts` to `src/components/layout/isTyping.ts` (export) and import it
   in both places (DRY).
2. `search.logic.ts`:
   ```ts
   export type SearchItem = { id: string; kind: "lab" | "lesson"; title: string; context: string; extra?: string; href: string };
   /// Lower-case and strip diacritics (NFD + remove \p{M}).
   export function normalise(s: string): string
   /// Items matching every query word, best first: title prefix 3 > title word 2 > context/extra 1; labs before lessons on ties; ≤ limit per kind.
   export function searchItems(items: SearchItem[], query: string, limit = 8): SearchItem[]
   ```
3. `useSearchItems.ts` (hook): builds `SearchItem[]` with `t()` from registry labs (context = area) and
   `guideLessons` (context = track title, extra = `t(descKey)`), memoised on language.
4. `SearchPalette.tsx`: `role="dialog" aria-modal="true" aria-label={t("searchTitle")}`; input with
   `role="combobox" aria-expanded aria-controls aria-activedescendant`; results `role="listbox"`, options
   `role="option" aria-selected`; ↑/↓ move, Enter → `navigate(href)` + close, Esc/backdrop click close;
   trap Tab inside; restore focus to the trigger on close. Rendered in a portal on `document.body`
   only while open (no SSR markup).
5. `SearchButton.tsx` in `.topnav-controls` before `ThemeToggle`; registers the global Ctrl/⌘ K
   listener (ignore when `isTyping(e.target)`; `preventDefault`).
6. Strings (EN, HU drafts): `searchOpen` "Search", `searchShortcut` "Ctrl K", `searchTitle`
   "Search labs and lessons", `searchPlaceholder` "Search labs and lessons…", `searchLabs` "Labs",
   `searchLessons` "Lessons", `searchEmpty` "No results for “{{query}}”".
7. Remove the search field and its state from `HomeLabs.tsx`; keep `homeNoResults` only if still used,
   else delete the key from both language files.
8. `scripts/search.test.mjs` + `"test:search"` script: `normalise("Itô Process") === "ito process"`,
   HU "kötvény" matches query "kotveny", title-prefix ranks first, labs before lessons on ties, limit
   respected. Break-it check: change a score weight, see a test fail, restore.

## Acceptance criteria
- Ctrl K on `/black-scholes` opens the palette; typing "yield" lists "Yield Curve" first; Enter lands on
  `/yield-curve`; Esc closes and focus is back on the Search button.
- Typing in a lab's number input and pressing Ctrl K does nothing.
- Works on `/hu/…` with Hungarian titles; `npm run test:search` passes.

## Verification
```bash
npm run test:search && npm run test:home && npx tsc -b && npm run build
npx vite preview --port 4173 &
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel/insights" \
  --after "/black-scholes|(async()=>{dispatchEvent(new KeyboardEvent('keydown',{key:'k',ctrlKey:true}));await new Promise(r=>setTimeout(r,200));const i=document.querySelector('[role=dialog] input');i.value='yield';i.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(r=>setTimeout(r,200));return document.querySelector('[role=option]')?.textContent})()" \
  --after "/hu/|document.querySelector('.nav-search-button')?.textContent"
# expect: no problems; first value contains "Yield"; second contains the HU "Keresés" (or the HU draft)
```
Stop the server and check the port is free.

## Pitfalls
- React-controlled inputs ignore `input.value=` in tests unless you use the native setter; if the smoke
  `--after` returns nothing, set the value via
  `Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(i,'yield')` first.
- The keydown listener must be on `window` and cleaned up; attaching per render leaks listeners.
- Don't render the dialog during pre-render (portal only when open), or hydration breaks.
- `\p{M}` needs the `u` flag: `.normalize("NFD").replace(/\p{M}/gu, "")`.

## Findings (fill in during execution)
- DONE (2026-10-20, partial): steps 1, 2, 3, 8 — `isTyping.ts` extracted, `search.logic.ts`, `useSearchItems.ts`, `scripts/search.test.mjs` + `test:search` (7 pass; break-it check failed as expected). tsc + eslint clean.
- DONE (2026-10-20): steps 4–6 — `SearchPalette.tsx`, `SearchButton.tsx` (in `TopNavigation`), `_search.scss`, `--backdrop` token (both themes), 7 `search*` strings EN + HU. Smoke: Ctrl K on /black-scholes → 'yield' → first result Yield Curve → Enter → /yield-curve, dialog closed, focus on `.nav-search-button`; /hu/ button reads 'Keresés Ctrl K'; no problems.
- DONE (2026-10-20): step 7 — search field, state and empty message removed from `HomeLabs.tsx`; unused `homeSearchPlaceholder/Aria`, `homeMatchCount`, `homeNoResults` and the `.home-search/.home-empty/.home-labs-tools` styles deleted. Smoke: no problems on `/`, `/hu/`, `/black-scholes`; palette still returns Yield Curve first; 25 tiles.
- New HU strings for owner review: searchOpen 'Keresés', searchTitle 'Laborok és leckék keresése', searchPlaceholder 'Laborok és leckék keresése…', searchLabs 'Laborok', searchLessons 'Leckék', searchEmpty 'Nincs találat erre: „{{query}}”'.
- New HU strings for owner review: …
- Deviations: …

## Prompt to hand off
> You are working in the Quant Sandbox repo (my-app). Read `CLAUDE.md`, `docs/plans/home-redesign/README.md`
> (sections 0 and 4) and `docs/plans/home-redesign/06-search-palette.md`, and confirm plans 02 and 05 are done
> (stop if not). Run `git status` and stop if the files this plan edits have changes you didn't make.
> Implement plan 06: pure `search.logic.ts` with tests, a search button in the top bar, a Ctrl/⌘ K accessible
> palette over labs and lessons, and remove the temporary home search field. Run the Verification commands and
> make them pass. Fill in Findings, set plan 06 to `done (<date>)` in the README table, and summarise.
