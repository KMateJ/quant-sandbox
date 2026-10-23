# 05 — Help shell: HELP button, F1 / `?`, desk-scoped drawer, tabs, "show me" highlight

Status: done (2026-10-23) · Depends on: – · Suggested model: Sonnet · Est. size: M

## Why
The demo walks a learner through the desk once. After that they are on their own with eleven panels, six
function keys and an option chain. This plan adds the frame for help on demand: a **HELP** button in the
amber command bar (also F1 / `?`) that opens a drawer *inside* the desk with three tabs: **Next move**
(plan 06), **What if** (plan 07) and **Guide** (plan 08). This plan ships the frame, the tabs, a
"show me" panel highlight, and stub tab bodies that plans 06–08 replace.

## Current state (verified 2026-10-23)
- `src/features/hedging-desk/HedgingDeskView.tsx` (69 lines). `HedgingDeskView` holds the view state that
  must survive a session remount (`useFullscreen`, `useExpandInPage`) and builds `viewControls`
  (`<DemoButton onStart hidden={deskUrl.demo} />` + `<FullscreenButton …/>`), which go through
  `DeskSession` → `DeskHeader actions`. `DeskSession` renders the root
  `<div className="hdesk …" ref={rootRef}>` with the classes `hdesk--expanded` and `hdesk--demo`. The
  session is keyed `${mission.id}-${seed}-${run}`, so F8 (new path) and F9 (restart) **remount** it.
- Command-bar buttons use `className="hdesk-cmd-btn"` (`_hedging-desk.scss` L348; 44 px min-height in
  the coarse-pointer block around L392). `CmdToggle` in `components/FullscreenButton.tsx` shows the
  pattern: `aria-pressed`, and the label says what a click will do.
- `src/components/ui/HelpDrawer.tsx` (shared primitive, also used by `npv-irr`) takes the props
  `open, onClose, title, children, closeLabel?, context?, id?, bodyRef?, returnFocusRef?`. It
  **portals to `document.body`**. At `max-width: 900px` it is modal (backdrop, focus trap, inert
  siblings, body scroll lock); above that it is non-modal. It closes on Escape (document listener) and
  restores focus. Styles are in `_primitives.scss` L872–945: `.help-drawer` is
  `position: fixed; inset: 0; z-index: var(--z-drawer)` (= 50); the panel is `width: min(92vw, 420px)`.
  All colours come from tokens.
- `.hdesk` redefines the tokens (`--bg #000`, `--surface`, `--text`, `--primary` amber …) at
  `_hedging-desk.scss` L7–28. `.hdesk--expanded` is `position: fixed; z-index: 1000` (L373).
- Function keys: `useFunctionKeys.ts` listens on `window` for F2–F9 (ignored while `demo` is true). The
  demo (`demo/useDemo.ts`) listens on `window` for arrows, space and Escape while it runs.
- Panel ids already exist for the demo: `hd-quotes hd-tabs hd-mission hd-risk hd-blotter hd-price
  hd-delta hd-pnl hd-matrix hd-profile hd-positions hd-ticket hd-submit hd-chain hd-keys` (plus the
  debrief `hd-debrief-*`). The demo highlight CSS (`_hedging-desk-demo.scss` L79–92) is keyed on
  `.hdesk--demo[data-demo-anchor]`.
- `isTyping(target)` lives in `src/components/layout/isTyping.ts`; `prefersReducedMotion()` in
  `src/components/playback/useTicker.ts`.
- i18n tables live in `src/Language/` and are registered in `index.en.ts` (imports around L59–60,
  spreads around L122–123) and `index.hu.ts` (around L59–60 and L123–124), right after the
  `hedgingDeskDemoSteps` lines.
- `main.scss` L32–37 has the `@use "hedging-desk…"` lines; the last one is `@use "hedging-desk-demo";`.

## Goal
1. A **HELP** command-bar button (placed before the demo button) and **F1** / **`?`** toggle the drawer.
   Both are hidden and inactive while the demo runs.
2. The drawer renders **inside the `.hdesk` root**, so it uses the dark terminal tokens and stays visible
   in the expanded view and in browser full screen. It has a tab row (Next move / What if / Guide) and
   remembers the open tab.
3. Help state lives in `HedgingDeskView`, so it survives the F8/F9 remounts.
4. `help.point(anchor)` outlines one desk panel for about 2.5 s and scrolls it into view ("show me").
5. Stub tabs with their final props, so plans 06–08 can replace them independently.

## Non-goals
- No advice, scenarios or guide content (plans 06–08). No URL parameter for help. That is decided: help
  is local state, because the desk route is pre-rendered and the URL schema is shared with the demo.
- Do not change how HelpDrawer behaves for its other callers.

## Constraints
README §4. `.tsx` files stay at or under ~150 lines. All strings go through i18n (EN, plus an HU draft).
Styles go in a new partial. Edits to shared files are additive.

## Steps
1. **HelpDrawer `container` prop (additive).** In `src/components/ui/HelpDrawer.tsx`, add
   `container?: Element | null` and `className?: string` to the props. Use
   `createPortal(…, container ?? document.body)`, and append `className` to the outer `help-drawer` div.
   Nothing else changes, so `npv-irr` is unaffected. Why: a portal to `body` is invisible in full screen
   (only the fullscreen element renders), sits under `.hdesk--expanded` (z-index 1000 vs 50), and loses
   the `.hdesk` tokens.
2. **Types**: `src/features/hedging-desk/help/help.types.ts`:
   ```ts
   /// Tabs of the desk help drawer.
   export type HelpTab = "next" | "whatIf" | "guide";
   /// Desk element "show me" can point at (subset of the demo anchors; DOM id is `hd-<anchor>`).
   export type HelpAnchor = "quotes" | "mission" | "risk" | "blotter" | "price" | "delta" | "pnl"
     | "matrix" | "profile" | "positions" | "ticket" | "chain" | "keys";
   ```
   Put `export const HELP_TABS: readonly HelpTab[] = ["next", "whatIf", "guide"];` and
   `export const HELP_ANCHORS: readonly HelpAnchor[] = [...]` in `help/help.config.ts` (same pattern as
   `demo/demo.config.ts`).
3. **Hook**: `src/features/hedging-desk/help/useDeskHelp.ts`:
   ```ts
   export function useDeskHelp(demo: boolean): {
     open: boolean; tab: HelpTab; pointed: HelpAnchor | null;
     toggle: (tab?: HelpTab) => void; show: (tab: HelpTab) => void; close: () => void;
     point: (anchor: HelpAnchor) => void;
     buttonRef: RefObject<HTMLButtonElement | null>;
   };
   export type DeskHelp = ReturnType<typeof useDeskHelp>;
   ```
   - `useState` for `open`, `tab` (default `"next"`) and `pointed`.
   - `toggle(tab)`: if the drawer is open and `tab` is undefined or the current tab, close it. Otherwise
     open it on `tab ?? current`. `show(tab)` always opens on `tab`.
   - Window `keydown`: `F1` (no modifiers; call `preventDefault` so the browser's help does not open) or
     `?` (`e.key === "?"`, skipped when `isTyping(e.target)`) calls `toggle()`. Ignore every key while
     `demo` is true. Use the latest-ref pattern from `useFunctionKeys.ts` so the listener is bound once.
   - When `demo` becomes true, an effect closes the drawer.
   - `point(anchor)`: on narrow screens (`matchMedia("(max-width: 900px)")`) close the drawer first,
     because it is modal there and covers the desk. Set `pointed`, then call
     `document.getElementById("hd-" + anchor)?.scrollIntoView({ block: "center", behavior:
     prefersReducedMotion() ? "auto" : "smooth" })`. Clear `pointed` after 2500 ms with a timeout;
     clear that timeout on the next `point` call and on unmount.
4. **Button**: `components/help/HelpButton.tsx` takes `({ help, hidden }: { help: DeskHelp; hidden: boolean })`
   and renders a `hdesk-cmd-btn` with `ref={help.buttonRef}`, `aria-expanded={help.open}`,
   `aria-controls="hd-help"`, `aria-keyshortcuts="F1"` and the label `t("hdHelpButton")`. It returns
   `null` when hidden.
5. **Drawer**: `components/help/HelpSheet.tsx` takes
   `({ desk, help, container }: { desk: HedgingDeskModel; help: DeskHelp; container: Element })` and renders
   `<HelpDrawer open={help.open} onClose={help.close} title={t("hdHelpTitle")} closeLabel={t("hdHelpClose")}
   id="hd-help" container={container} className="hdesk-help" returnFocusRef={help.buttonRef}
   context={t("hdHelpContext", { mission: desk.mission.id, day: desk.day, days: desk.market.days })}>`.
   Inside it goes `<HelpTabs help={help} />`, then the active body: `next` →
   `<NextMoveTab desk={desk} help={help} />`, `whatIf` → `<WhatIfTab … />`, `guide` → `<GuideTab … />`,
   then a muted `hdHelpKeysHint` line.
   `HelpTabs.tsx` renders a `role="tablist"` row (`aria-label={t("hdHelpTabsAria")}`) of three
   `<button role="tab" aria-selected>`. Tabs are square text with a tint or underline on the active one:
   **not** pills, and no left border. Left and right arrow keys move between tabs.
6. **Stubs (the contract for 06–08).** Create each of these exactly:
   ```tsx
   import type { HedgingDeskModel } from "../../useHedgingDesk";
   import type { DeskHelp } from "../../help/useDeskHelp";
   /// Stub; plan 0N replaces it.
   export default function NextMoveTab(props: { desk: HedgingDeskModel; help: DeskHelp }) { void props; return null; }
   ```
   at `components/help/NextMoveTab.tsx` (plan 06), `components/help/WhatIfTab.tsx` (07) and
   `components/help/GuideTab.tsx` (08). **If a file already exists, do not overwrite it** (that plan got
   there first); just import it.
7. **Wire it up in** `HedgingDeskView.tsx`. In `HedgingDeskView`, call `const help = useDeskHelp(deskUrl.demo);`,
   prepend `<HelpButton help={help} hidden={deskUrl.demo} />` to `viewControls`, and pass `help` into
   `DeskSession` (add it to `SessionProps`). In `DeskSession`, keep a state-backed root element for the
   portal (`const [root, setRoot] = useState<HTMLDivElement | null>(null)`) and merge it with `rootRef`
   in a callback ref. `rootRef` comes from `useFullscreen`; handle object and callback refs, and leave
   `useFullscreen` untouched. Add `data-help-anchor={help.pointed ?? undefined}` to the root and render
   `{root && <HelpSheet desk={desk} help={help} container={root} />}` last inside it. Keep the file at
   or under ~150 lines; if needed, move `DeskSession` to `components/DeskSession.tsx`.
8. **Styles**: a new `src/styles/_hedging-desk-help.scss`, added to `main.scss` after
   `@use "hedging-desk-demo";` as `@use "hedging-desk-help";`:
   - `.hdesk-help.help-drawer { z-index: 1010; }` so it sits above the expanded desk's content.
   - Panel: `width: min(100vw, 460px)`, mono font inherited. The primitive's `border-left` is the
     drawer's frame edge, not an accent; keep it.
   - Tabs: square; the selected tab gets amber text and a
     `color-mix(in srgb, var(--primary) 14%, transparent)` background; amber focus outline.
   - "Show me": `.hdesk[data-help-anchor="<a>"] #hd-<a> { outline: 2px solid var(--primary);
     outline-offset: -2px; }` for every `HelpAnchor`, generated by an `@each` list (add a comment that it
     mirrors `HELP_ANCHORS`), plus the same `.panel-head` tint the demo uses. No transition under
     `prefers-reduced-motion`.
   - Define the shared content classes plans 06–08 use here, once: `.hdesk-help-section` (block, 12 px
     bottom margin), `.hdesk-help-h` (11 px uppercase muted heading), `.hdesk-help-p` (12 px / 1.5 body),
     `.hdesk-help-actions` (wrapping row of `hdesk-btn`), `.hdesk-help-kv` (two-column `dl` grid,
     numbers right-aligned with `font-variant-numeric: tabular-nums`), and
     `.hdesk-help-tone--urgent|suggest|info|done` (a tinted **background** made with `color-mix` from
     `--negative` / `--primary` / `--surface-soft` / `--positive`; never a left bar).
9. **i18n**: `src/Language/HedgingDeskHelp.ts` (`hedgingDeskHelpEn`) and `.hu.ts` (`hedgingDeskHelpHu`),
   registered after the `hedgingDeskDemoSteps` import and spread lines in both index files. Keys:
   `hdHelpButton` "Help", `hdHelpTitle` "Desk help", `hdHelpClose` "Close help",
   `hdHelpContext` "{{mission}} · day {{day}} of {{days}}", `hdHelpTabNext` "Next move",
   `hdHelpTabWhatIf` "What if…", `hdHelpTabGuide` "Guide", `hdHelpTabsAria` "Help sections",
   `hdHelpKeysHint` "F1 or ? opens and closes help", plus four button labels plans 06–08 share:
   `hdHelpShowMe` "Show me", `hdHelpUseTicket` "Put in ticket", `hdHelpOpenWhatIf` "Try it in What if",
   `hdHelpOpenGuide` "Read more in Guide".

## Acceptance criteria
- HELP is visible on `/delta-hedging/desk` and absent with `?demo=1`. F1 and `?` toggle the drawer;
  Escape closes it and focus returns to HELP. Typing `?` into the ticket's quantity input does not open
  help.
- The drawer is a descendant of `.hdesk` (not a direct child of `body`) and is visible in the expanded
  view and in full screen.
- On a wide screen F2 still steps the day while the drawer is open (it is non-modal there).
- After F9 the drawer is still open on the same tab.
- `point("ticket")` outlines `#hd-ticket`, and the outline disappears after about 2.5 s.
- The `npv-irr` learn drawer is unchanged (it still portals to body).

## Verification
Run the README §4 standard commands, then:
```bash
(npx vite preview --port 4173 --strictPort &) && sleep 4
W='(ms)=>new Promise(r=>setTimeout(r,ms))'
H="(async()=>{const w=${W};const k=(key)=>window.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true}));const b=document.querySelector('[aria-controls=hd-help]');b.click();await w(200);const inDesk=!!document.querySelector('.hdesk #hd-help');const tabs=document.querySelectorAll('#hd-help [role=tab]').length;k('F2');await w(200);const clock=document.querySelector('.hdesk-cmd-clock').textContent;document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));await w(200);const closed=!document.getElementById('hd-help');const focus=document.activeElement===b;k('F1');await w(200);const f1=!!document.getElementById('hd-help');document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));await w(200);const inp=document.querySelector('.hdesk-qty input');inp.focus();inp.dispatchEvent(new KeyboardEvent('keydown',{key:'?',bubbles:true}));await w(150);return {inDesk,tabs,clock,closed,focus,f1,afterTyping:!!document.getElementById('hd-help')}})()"
D="(async()=>({help:!!document.querySelector('[aria-controls=hd-help]')}))()"
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/delta-hedging/desk,/hu/delta-hedging/desk,/delta-hedging/desk?demo=1,/npv-irr" \
  --after "/delta-hedging/desk|$H" --after "/delta-hedging/desk?demo=1|$D"
# expect H: inDesk true, tabs 3, clock mentions day 1, closed true, focus true, f1 true, afterTyping false
# expect D: help false
```
Stop the server and confirm port 4173 is free.

## Pitfalls
- **Do not portal to `body`** (see Step 1). On the first render the state-backed root is still null, and
  HelpDrawer would fall back to `body`. That is why `HelpSheet` renders only once `root` is set.
- HelpDrawer's modal branch inerts the body children that do not contain the panel. With the panel inside
  `.hdesk`, the desk's ancestors are kept, which is what we want. Do not add a second focus trap.
- HelpDrawer closes on Escape through a `document` listener. The demo's Escape handler never runs at the
  same time, because help is closed whenever `demo` is true.
- `?` arrives as `e.key === "?"` with `shiftKey` true on most layouts, so do not reject Shift for `?`.
  Hungarian keyboards produce `?` with Shift + `,`, which is still `e.key === "?"`.
- The fullscreen hook owns `rootRef`. Merge it; do not replace it.
- Pre-render: the drawer is closed on the first render, so the pre-rendered HTML only gains the HELP
  button. `npm run test:seo` must stay at its baseline.

## Findings (fill in during execution)
- Baseline / measurements: tsc clean; lint 11 errors (all pre-existing); test:hedging-desk 78 pass; smoke H: inDesk true, tabs 3, clock D1/63, closed true, focus true, f1 true, afterF9 true, afterTyping false; D: help false.
- Deviations and why: `DeskSession` gets `rootRef` as a callback (useFullscreen's `target`), so no object-ref merge (lint immutability rule). `open` is returned as `open && !demo` instead of an effect (set-state-in-effect rule). HelpButton destructures the hook fields (react-hooks/refs).
- HU drafts for owner review: hdHelpButton, hdHelpTitle, hdHelpClose, hdHelpContext, hdHelpTabNext, hdHelpTabWhatIf, hdHelpTabGuide, hdHelpTabsAria, hdHelpKeysHint, hdHelpShowMe, hdHelpUseTicket, hdHelpOpenWhatIf, hdHelpOpenGuide.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/hedging-desk-demo/README.md`
> (section 4) and `docs/plans/hedging-desk-demo/05-help-shell.md`. Implement plan 05: the additive
> `container`/`className` props on `HelpDrawer`, `help/help.types.ts`, `help/help.config.ts`,
> `help/useDeskHelp.ts`, the HELP button, `HelpSheet` + `HelpTabs`, the three stub tabs (do not overwrite
> files that already exist), the wiring in `HedgingDeskView.tsx`, `_hedging-desk-help.scss` and the
> `HedgingDeskHelp` EN/HU tables. Run the standard verification and the smoke command in the plan and make
> them pass. Fill in Findings (list every HU key as a draft), set plan 05 to `done` in the README table,
> and summarise. Do not run `git stash`. Stop the preview server and confirm port 4173 is free.
