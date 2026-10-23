# 08 — Guide tab: mission playbooks, panel guide, keys, common mistakes, glossary

Status: done (2026-10-23) · Depends on: – (verified once 05 is done) · Suggested model: Sonnet · Est. size: M

## Why
Next move (06) and What if (07) react to the live book. Some help is better read once and kept: how to
win each mission, what every panel means, what each key does, the mistakes most learners make, and the
words on the screen (delta, gamma, band, breach, theta). This plan fills the **Guide** tab with that
reference, organised so the current mission's playbook is on top, and a "Show me" button next to each
panel entry that outlines the panel on the desk.

## Current state (verified 2026-10-23)
- Plan 05 provides the stub `components/help/GuideTab.tsx` with props
  `{ desk: HedgingDeskModel; help: DeskHelp }`, `help.point(anchor)` with
  `HelpAnchor = "quotes" | "mission" | "risk" | "blotter" | "price" | "delta" | "pnl" | "matrix" | "profile"
  | "positions" | "ticket" | "chain" | "keys"`, the shared classes `.hdesk-help-section/-h/-p/-actions/-kv`,
  and the label `hdHelpShowMe`.
- Missions (`engine/missions.data.ts`; briefs in `src/Language/HedgingDeskMissions.ts`
  `hdMission<id>Title|Tagline|Brief`; objective labels via `objectiveText(t, def, band)` in `missionCopy.ts`):
  - **M1** short 10 C100, 63 days, IV 22% vs realised 26%; objectives: ≤ 3 breaches of ±100 sh, |P&L| ≤ $400, costs < $300. Start: Δ −549.
  - **M2** the same book, $15 per ticket, at most 10 trades, stock only; |P&L| ≤ $600, ≤ 10 trades, beat a desk that hedges every 5 days.
  - **M3** short 20 C100, 45 days, a ±8% jump on one day between D25 and D35; gamma inside ±40 from D25, gap loss ≤ $1,500, ≤ 3 breaches. Start: Γ −85.
  - **M4** long 15 C105, short 5 P95, 40 days, IV 22% → 30% on D20; |vega| ≤ $1,500/pt by D20, ≤ 3 breaches, P&L ≥ −$500. Start: Δ +609, vega +$152/pt.
  - **M5** short 10 C100, 10 days, S0 100.2, physical settlement; end with no stock, ≤ 2 breaches, |P&L| ≤ $300. Start: Γ −90.
- Function keys (`useFunctionKeys.ts` `FUNCTION_KEYS`): F2 next day, F3 +5 days, F4 auto-hedge (stock to
  flat delta), F5 +21 days, F8 new path (seed + 1), F9 restart the same path. Help: F1 / `?` (plan 05).
- Panels (DOM ids `hd-<anchor>`): quotes strip (last, change, open/high/low, IV, RV, rate, trades,
  last rebalance, P&L), mission (objectives with live status), risk (Greeks, delta meter, breakeven move),
  blotter (fills and events), price & shares chart, net delta chart, book P&L chart, scenario matrix
  (P&L by spot shock × vol shift), risk profile (value now and at expiry across spot), positions, order
  ticket, option chain.
- The desk's existing labels are in `src/Language/HedgingDesk*.ts`; read them so the guide uses the same
  words as the screen (e.g. the quote labels `hdQuote*`, the panel titles `hd*Title`).

## Goal
1. The Guide tab shows, in order: **This mission** (playbook for `desk.mission.id`), **Panels**
   (one line each plus Show me), **Keys**, **Common mistakes**, **Glossary**, and **Other missions**
   (collapsed).
2. Every text is in i18n tables (EN, plus an HU draft), and the structure is data, not JSX.
3. The section a learner opened last stays open when they come back (local component state is enough).

## Non-goals
- No live numbers beyond the mission id and the live objectives (Next move and What if do that).
- No edits to `HedgingDeskMissions*.ts` (mission copy belongs to the earlier pack); quote the brief by
  key instead of copying it.
- No new routes, and no links into guide lessons (an owner decision, README §6).

## Constraints
README §4. Structure in `help/guide.data.ts` (pure data, no React); copy in
`src/Language/HedgingDeskHelpGuide*.ts`; `.tsx` ≤ ~150 lines (split into `GuideTab`, `GuidePlaybook`,
`GuidePanels`, `GuideList`).

## Steps
1. `help/guide.data.ts`:
   ```ts
   /// Playbook keys per mission: steps, then traps. Copy keys are `hdGuide<Mission>Step<n>` / `hdGuide<Mission>Trap<n>`.
   export const GUIDE_PLAYBOOKS: Record<string, { steps: number; traps: number }> =
     { M1: { steps: 5, traps: 3 }, M2: { steps: 4, traps: 3 }, M3: { steps: 5, traps: 3 }, M4: { steps: 4, traps: 3 }, M5: { steps: 4, traps: 3 } };
   /// Panel entries in screen order; copy key `hdGuidePanel<Anchor>` (anchor capitalised, e.g. Quotes).
   export const GUIDE_PANELS: readonly HelpAnchorLike[] = ["quotes", "mission", "risk", "blotter", "price", "delta", "pnl", "matrix", "profile", "positions", "ticket", "chain", "keys"];
   export const GUIDE_KEYS = ["F1", "F2", "F3", "F4", "F5", "F8", "F9"] as const;   // copy `hdGuideKey<Code>`
   export const GUIDE_MISTAKES = 8;   // `hdGuideMistake<n>Title` / `Body`
   export const GUIDE_TERMS = ["delta", "gamma", "theta", "vega", "band", "breach", "hedge", "spread", "iv", "rv", "assignment", "gap"] as const; // `hdGuideTerm<Term>` / `hdGuideTerm<Term>Def`
   ```
   Declare `type HelpAnchorLike` locally as the same literal union as plan 05's `HelpAnchor` (no import,
   so the plan stays independent). Add `help/guideCopy.ts` with key helpers (`playbookStepKey(id, n)`,
   etc., in the same shape as `demo/demoCopy.ts`).
2. Copy: `src/Language/HedgingDeskHelpGuide.ts` (`hedgingDeskHelpGuideEn`) and `.hu.ts`, registered after
   the last `hedgingDeskHelp…` line in both index files (re-read first; keep other plans' lines). Section
   heads: `hdGuideThisMission` "This mission: {{id}}", `hdGuidePanels` "What each panel shows",
   `hdGuideKeys` "Keys", `hdGuideMistakes` "Common mistakes", `hdGuideTerms` "Words on the screen",
   `hdGuideOtherMissions` "Other missions", `hdGuideHowToWin` "How to pass", `hdGuideTraps` "Watch out for".
   Draft English for the playbooks (plain, one or two sentences each, numbers from the facts above):
   - **M1 steps**: (1) "Your client bought 10 calls from you, so you are short delta: about −549 sh. Buy about 549 shares on day 0 (F4)." (2) "Step a few days (F2 or F3) and watch net delta on the risk panel. Re-hedge when it nears ±100." (3) "Realised vol (26%) is above implied (22%): the stock moves more than the option price assumed, so short gamma costs you. Hedging often keeps that loss small." (4) "Each re-hedge costs a cent a share. Daily hedging all run long costs roughly $X; you have $300." (executor: compute X with `replayPolicy(M1, market, 7, 1).costs` and write the rounded number) (5) "Near expiry, gamma rises and delta swings faster. Check every day in the last two weeks."
   - **M1 traps**: "Buying the 10 calls back passes the objectives, but you have closed the trade, not hedged it." · "Stepping 21 days (F5) without checking is the fastest way to collect breaches." · "Selling shares when delta is negative doubles the problem."
   - **M2 steps**: "Every ticket costs $15 and you have 10. Hedge only when delta is near the band." · "One trade on day 0, then roughly one every five to six days, leaves a spare for the last weeks." · "The P&L limit is wider (±$600): small delta drift inside the band is fine." · "To beat the five-day desk, skip the rebalances that would have been tiny."
   - **M2 traps**: "Pressing F4 every day uses all 10 trades in two weeks." · "A trade past the limit is rejected: you are stuck with whatever delta you have." · "Options are locked: the chain shows prices for reading only."
   - **M3 steps**: "20 short calls give gamma −85; it must be inside ±40 from D25. Shares cannot change gamma." · "Buy at-the-money calls (about 13 C100 at the start; each adds about +4.3 gamma) to bring gamma near −30, then re-hedge delta with shares." · "Do it before D25; the jump can come any day from D25 to D35, and you cannot hedge after it." · "Bought calls cost theta each day, so do not buy far earlier than needed." · "Keep delta in the band as usual; the jump hurts in both directions when you are short gamma."
   - **M3 traps**: "Hedging delta perfectly does not protect you from a jump." · "Buying too many calls makes you long gamma and pays away theta." · "The jump day is not shown in advance; only the window is known."
   - **M4 steps**: "You are long the 105 calls and short the 95 puts: long delta (+609) and long vega." · "Bring |vega| inside $1,500/pt by D20 by selling options, then re-hedge delta with shares." · "Implied vol reprices from 22% to 30% on D20; your vega decides whether that is a gain or a loss." · "Keep P&L above −$500 and delta in the band."
   - **M4 traps**: "Selling shares fixes delta but leaves vega untouched." · "Selling options adds short gamma; re-check delta more often afterwards." · "Long delta means you sell shares to hedge, not buy."
   - **M5 steps**: "The calls settle physically: if they expire in the money you deliver 1,000 shares." · "Your stock hedge plus delivery should net to zero. Near expiry, a call that will finish in the money has delta near 1." · "In the last days, decide whether spot finishes above 100; hedge to the shares you will actually deliver." · "Alternatively, buy the calls back before expiry and sell your shares: no delivery, no pin risk."
   - **M5 traps**: "Spot sitting on 100 makes delta jump between ~0 and ~1000 on small moves." · "Holding 1,000 shares when the calls expire out of the money leaves you long stock: objective failed." · "Ten days pass quickly: F3 skips half the mission."
   - **Panels** (`hdGuidePanel<Anchor>`), for example Risk: "Net delta in shares (your exposure to a $1 move), gamma (how fast delta changes), vega and theta. The meter shows delta against the ±band." Matrix: "Book P&L if spot jumps by the column's % and implied vol by the row's points, right now." Profile: "Value of the book across spot, today and at expiry; a frown means short gamma." Chain: "Click a price to load that option into the ticket; buy at the ask, sell at the bid." Write all thirteen.
   - **Keys** (`hdGuideKey<Code>`): one line each, e.g. F4 "Auto-hedge: trades shares to bring delta to zero at today's price."
   - **Mistakes** (8): wrong direction; stepping too far; over-trading into costs; forgetting gamma near expiry; thinking options hedge only delta; forgetting the trade limit (M2); closing the book instead of hedging; reading the matrix as tomorrow's P&L (it is an instant shock).
   - **Terms** (12): one plain sentence each (e.g. band "The ±100 share range net delta must be inside at each close."; breach "A day closed with net delta outside the band.").
3. Components (all under `components/help/`):
   - `GuideTab.tsx` (replace the stub; props `{ desk, help }`): render the sections in the order of Goal 1,
     each as `<details className="hdesk-help-section">` with a `<summary className="hdesk-help-h">`.
     "This mission" is open by default. Track the last opened `<details>` in `useState` so it survives tab
     switches while the drawer is open (state lives in `GuideTab`; it remounts when the drawer closes,
     and that is fine).
   - `GuidePlaybook.tsx` (`{ missionId, desk? }`): the brief via `missionBriefKey(id)`, the live objectives
     for the current mission only (`desk.objectives` with `objectiveText` + `statusKey`), then the numbered
     steps (`<ol>`) and traps (`<ul>`). "Other missions" renders `GuidePlaybook` for the other ids without
     `desk` (no live status).
   - `GuidePanels.tsx` (`{ help }`): one row per `GUIDE_PANELS` entry, with the text and a small `hdesk-btn`
     "Show me" → `help.point(anchor)`.
   - `GuideList.tsx` (`{ items: { term: string; text: string }[] }`): a `<dl className="hdesk-help-kv">`
     reused for keys, mistakes and terms.
4. Styles `src/styles/_hedging-desk-help-guide.scss`, appended after the other help partials in
   `main.scss`: the `details/summary` look (square, a caret via `::marker` or a text glyph, no pill),
   `ol`/`ul` spacing. Reuse plan 05's classes for everything else.
5. A node parity check in `scripts/hedging-desk-help-guide.test.mjs`: load `HedgingDeskHelpGuide.ts` and
   `.hu.ts` with `importSrc`, then assert equal key sets, that every key implied by `guide.data.ts` exists
   (playbook step/trap counts, panels, keys, mistakes, terms), and that no HU value equals its EN value
   (catches untranslated copies).

## Acceptance criteria
- On `?m=M3`, the Guide tab opens on "This mission: M3" with 5 steps, 3 traps and the live objectives.
- Every "Show me" outlines the right panel (plan 05's highlight); on 360 px the drawer closes first.
- The parity test passes and fails when one HU key is removed.
- No `.tsx` over ~150 lines; no English literals in JSX.

## Verification
Run the README §4 standard commands, then:
```bash
(npx vite preview --port 4173 --strictPort &) && sleep 4
W='(ms)=>new Promise(r=>setTimeout(r,ms))'
G="(async()=>{const w=${W};document.querySelector('[aria-controls=hd-help]').click();await w(200);[...document.querySelectorAll('#hd-help [role=tab]')][2].click();await w(250);const open=document.querySelector('#hd-help details[open] summary')?.textContent;const steps=document.querySelectorAll('#hd-help details[open] ol li').length;const show=[...document.querySelectorAll('#hd-help button')].filter(b=>b.closest('details'));return {open,steps,showButtons:show.length}})()"
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/delta-hedging/desk?m=M3,/hu/delta-hedging/desk?m=M5" \
  --after "/delta-hedging/desk?m=M3|$G" --after "/hu/delta-hedging/desk?m=M5|$G"
# expect: open mentions M3 / M5; steps 5 (M3) / 4 (M5)
```
Stop the server and confirm port 4173 is free.

## Pitfalls
- The playbook numbers must match the engine. Compute the ones marked "executor: compute" with a scratch
  script (`importSrc`) and record them in Findings; do not guess.
- `<details>` inside a drawer that re-renders on every desk step stays open as long as the element is
  not remounted; do not key the sections on `desk.day`.
- M4's vega objective: the book starts at |vega| about $152/pt, below the $1,500 limit, so the objective
  passes without action (README §6 owner question). Write the M4 playbook so it stays true either way
  ("keep |vega| inside …"), and note it in Findings.
- The playbook copy is teaching content, so treat the HU text as a draft for owner review.

## Findings (fill in during execution)
- Computed numbers used in copy: `replayPolicy(M1, market, 7, 1)` (daily hedge) costs $71.54 over 49 trades, so M1 step 4 says "about $72" (the 5-day policy: $61, 11 trades, 8 breaches). M3 numbers (13 C100, +4.3 gamma each, target -30) and the Δ/vega starting values come from the plan's verified facts and were not recomputed.
- Deviations and why: another session was writing the same files at the same time (shared claim name), so the final EN table, `guide.data.ts` (adds `GUIDE_SECTIONS`, `GuideAnchor` instead of `HelpAnchorLike`) and the four Guide components are that session's; this run added the HU table, the test, the HU `hdGuideOtherTitle` check and the verification. The guide uses its own `hdGuideShowMe` label (not 05's `hdHelpShowMe`) and a local `GuideHelp = { point }` type, so it does not import plan 05's types. The M4 step 2 reads "Keep |vega| inside $1,500/pt by D20 (sell options if it is above)", true whether or not the objective passes at the start (README §6 question stands).
- Test: `scripts/hedging-desk-help-guide.test.mjs` (EN/HU key parity, every key implied by `guide.data.ts`, every mission has a playbook, no untranslated HU value; pure-placeholder values are exempt).
- Verification: tsc clean, `test:hedging-desk` 66/66 pass, `test:labs` 59/59, build ok, smoke clean on desk, `?demo=1` and `/hu` demo; Guide tab on `?m=M3` opens "This mission: M3" with 5 steps, 3 traps, 3 live objectives, 13 Show me buttons; `/hu ?m=M5` gives 4 steps, 3 traps; Show me closes the drawer and sets `data-help-anchor`. `test:seo` failed 8 tests once, right after a build that raced with another session's build (dist was briefly missing); not related to this plan and not re-confirmed.
- HU drafts for owner review: all `hdGuide*` keys in `src/Language/HedgingDeskHelpGuide.hu.ts` (playbooks M1-M5, panels, keys, mistakes, terms; term labels carry symbols such as "Delta (Δ)" so they differ from EN).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/hedging-desk-demo/README.md`
> (section 4) and `docs/plans/hedging-desk-demo/08-guide-tab.md`. Implement plan 08: `help/guide.data.ts`,
> `help/guideCopy.ts`, the EN/HU `HedgingDeskHelpGuide` tables (playbooks for M1–M5, panels, keys, mistakes,
> terms; compute the marked numbers with the engine), `GuideTab`, `GuidePlaybook`, `GuidePanels`,
> `GuideList`, `_hedging-desk-help-guide.scss` and `scripts/hedging-desk-help-guide.test.mjs`. If plan 05 is
> not done, verify the UI once it lands. Run the standard verification and the plan's smoke command. Fill
> in Findings (HU drafts), set plan 08 to `done` in the README table, and summarise. Do not run `git stash`.
> Stop the preview server and confirm port 4173 is free.
