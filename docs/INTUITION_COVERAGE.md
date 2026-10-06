# Intuition coverage and rollout

Last updated: 2026-10-06. Status: Batch 1 in progress; Heston, Binomial, Bond Lab, Duration and Efficient Frontier help wiring verified.

This is the living tracker for contextual intuition across Quant Sandbox. Update it
in the same change that adds content or wires controls. Do not mark a module complete
merely because it has a document or header button.

## 1. Current coverage

- **21 routed learning modules**, excluding Home and Guide.
- **8/21 have registered Intuition documents (38%)**; **13/21 have none**.
  Yield Curve was registered in concurrent work; its detailed coverage audit remains pending.
- Three integrations are **Partial**; Heston, Binomial, Bond Lab, Duration and Efficient Frontier are **Ready for
  verification** after their contextual-help wiring checks. No module has final
  visual/content sign-off yet; Bond Lab chart rendering/drag validation remains pending.
- Diffusion has a local document/provider, but is **not registered/routed**. Track it
  separately; do not count it as a covered live module or add a route as part of this work.
- Standalone `InfoTooltip` definitions do not count as deeper intuition coverage.
- No overall slider-coverage percentage yet: repeated asset controls, conditional
  modes, custom inputs and mobile docks need a semantic inventory, not a JSX count.

Evidence: [module registry](../src/modules/registry.ts),
[intuition documents](../src/modules/intuition.ts), feature controls and slider
descriptors. The original baseline was a source audit; verified updates are recorded
in the progress log below. Do not treat source coverage as a full visual-quality audit.

### Routed modules

| Domain | Module | Document sections | Current contextual access | Outstanding work | Batch |
| --- | --- | ---: | --- | --- | --- |
| Derivatives | Payoff Lab | 4 | Chart header; total and synthetic-overlay legends | Leg inputs, instrument/direction/quantity, strike, premium and instrument-specific fields; mobile dock; positions explanation needs a contextual entry | 1 |
| Derivatives | Binomial | 10 | Equity 6/6 and rates 4/4 parameters on desktop/mobile; mode/type/display groups; contextual tree header and result metrics | Ready for verification: final visual hover/touch and Hungarian layout review; content sign-off | 1 |
| Derivatives | Black-Scholes | 6 | All six metric selectors; active chart metric; 4/5 parameter descriptors on desktop/mobile | Curve-count display setting; check strike/maturity explanations match the control; distinguish maturity from time decay | 1 |
| Derivatives | Heston | 16 | 13/13 desktop and mobile parameters; three variance/Feller metrics; price and all five Greeks; contextual help at all five charts | Ready for verification: final visual hover/touch review, Hungarian layout review and content sign-off | 1 |
| Derivatives | Delta Hedging | 0 | Hedge-error tooltip only | Document, seven sliders, rebalancing interpretation, hedge/P&L/error charts and metrics | 3 |
| Portfolio & Risk | Risk & Return | 0 | No Intuition access | Expected return, volatility, risk-free rate, allocation/leverage, Sharpe, CAL and comparison inputs | 2 |
| Portfolio & Risk | Portfolio Lab | 0 | No Intuition access | Asset inputs, weights/cash, correlations/repair, diversification, risk contributions, cloud sampling and all tabs | 2 |
| Portfolio & Risk | CAPM | 0 | Alpha tooltip only | Risk-free/market return, beta/actual return, dispersion; SML, alpha, regression and residual variation | 2 |
| Portfolio & Risk | Efficient Frontier | 14 | 6/6 numeric inputs across conditional modes; four objective topics; four toggles; results/cost; both tab headers; all frontier legends and allocation panel | Ready for help verification: final pointer/touch/content review and scatter drag rendering. Existing solver limitations (gross limit not enforced, sampled targets, no cash allocation, inconsistent-bound handling) documented, not repaired by this pass. | 1 |
| Fixed Income | Bond Lab | 13 | 5/5 parameters; five metrics; both tab headers; four timeline concepts plus split scale; four PV table headers; price-yield curve and both approximation controls | Ready for verification: chart rendering/drag check, final visual hover/touch and Hungarian layout/content review | 1 |
| Fixed Income | Yield Curve | 5 | Concurrent work registered par/zero/forward rates, discount factor and local-amplification topics | Partial: detailed quote/control/tab access and visual/content audit pending | 2 |
| Fixed Income | Duration / Convexity | 13 | 5/5 base parameters; five measures; both shock inputs; all nine selected-shock entries; both chart headers and five legend entries | Ready for verification: final visual hover/touch and chart rendering review; content sign-off | 1 |
| Corporate Finance | Time Value of Money | 0 | No Intuition access | Principal, contributions, rate, years, compounding and contribution timing; growth breakdown | 4 |
| Corporate Finance | NPV / IRR | 0 | No Intuition access | Outlay, annual cash flow, years, discount rate; NPV/IRR/PI/payback; profile and buildup views | 4 |
| Corporate Finance | WACC | 0 | No Intuition access | Equity/debt costs, tax rate, debt ratio; market-value weights, tax shield, WACC and chart interpretation | 4 |
| Corporate Finance | Capital Structure | 0 | No Intuition access | Unlevered equity cost, debt cost, tax, D/E; levered equity cost, tax shield, model assumptions | 4 |
| Corporate Finance | Valuation | 0 | No Intuition access | FCF, forecast growth/horizon, terminal growth, WACC; EV versus equity value, terminal share, both tabs | 4 |
| Stochastic Models | Brownian Motion | 0 | Terminal-SD tooltip only | Five sliders; drift, diffusion scale, horizon, path count, seed, expected path and uncertainty | 3 |
| Stochastic Models | GBM | 0 | Terminal-SD tooltip only | Six sliders; initial spot, drift/volatility, horizon, paths/seed, mean versus typical path and positivity | 3 |
| Stochastic Models | Ito Process | 0 | Drift-correction tooltip only | Six sliders; log transform, Ito correction, arithmetic versus log drift, path/chart interpretation | 3 |
| Stochastic Models | Monte Carlo | 0 | Standard-error tooltip only | Seven sliders; risk-neutral simulation, payoff/discounting, sample count/seed, convergence, standard error and benchmark | 3 |

### Direct parameter mappings on existing documents (current)

These counts describe wiring, not educational completeness. A nearby group-level
trigger is useful but is not counted as a direct control mapping.

| Module | Direct mappings | Notes |
| --- | --- | --- |
| Black-Scholes | 4/5 desktop and mobile parameter descriptors | Strike, rate, volatility and maximum maturity mapped; number of curves unmapped. Six metric selectors are separately mapped. |
| Heston | 13/13 desktop sliders; 13/13 mobile descriptors | One shared definition drives both. New spot/strike, maturity, time-step, visual-path and pricing-sample sections; all Greek sections available, with Heston-specific vega conventions. |
| Binomial | Equity 6/6; rates 4/4 on desktop and mobile | Shared mode-specific descriptors; stepper supports direct help. Rate-tree q and derived equity q have separate sections. |
| Bond Lab | 5/5 base parameters | Face value, coupon, maturity, frequency and YTM mapped; input values preserved by help requests. |
| Duration / Convexity | 5/5 base parameters; 2/2 shock inputs | Shared base concepts; direct help on the shock slider caption and precise numeric entry. Both edit the same shock. |
| Efficient Frontier | 6/6 numeric inputs | Target return, target volatility, min/max weight, risk-free rate and max gross all mapped. Objective and toggles have specific help; gross field's existing lack of enforcement is explicit. |
| Payoff Lab | No direct builder/dock parameter help | Dynamic instruments expose different input sets; inventory by instrument, not rendered leg count. |
| Diffusion (unrouted) | 3/5 desktop sliders; 0/5 mobile descriptors | Desktop kappa, n and minimum time mapped. Maximum time and curve count unmapped. |

## 2. Completion criteria

A module is **Complete** only after all applicable items pass:

1. **Document:** stable topic IDs, concise English/Hungarian content, useful equations
   and interpretation/misconceptions where relevant; content matches the actual model.
2. **Parameters:** every meaningful slider/input/select has a direct contextual entry,
   or a deliberate group entry with an explicit reason recorded in the tracker.
3. **Metrics:** important results explain meaning, units, sign and approximation limits.
4. **Charts/controls:** all tabs, key series/legends, drag interactions and important
   toggles can reach the relevant explanation without leaving the workspace.
5. **Desktop/mobile parity:** the same concept is reachable in desktop controls and
   mobile docks/sheets, including conditional modes and repeated asset/leg editors.
6. **Quiet UX:** reveal contextual icons on nearby hover/focus for fine pointers;
   keep keyboard and touch access. Keep the header button discoverable. No prose walls,
   layout shifts, nested buttons, or help that changes a parameter.
7. **Verification:** translations/KaTeX/IDs pass tests; build and targeted lint pass
   (record unrelated baseline issues); browser checks confirm scrolling/highlight,
   repeat triggers, close/focus restoration and parameter-state preservation.

Classify controls as **financial/model**, **numerical/simulation**, or **display-only**.
Path count, seed and time steps still need concise numerical intuition. Display-only
settings such as curve count may use just a one-line tooltip if deeper content adds
nothing; record that deliberate exception rather than inventing a long explanation.
An existing section may serve several inputs only when it explains each input's role.

Statuses: **Missing** -> **Partial** -> **Ready for verification** -> **Complete**.
Keep the document, parameters, metrics, charts and mobile checks separate during work.

## 3. Prioritized rollout

### Batch 0 - Baseline and tracking (done)

- Record routed-module coverage, known direct-control gaps and explicit exclusions.
- Keep this file as the single coverage/rollout record.
- No page functionality changes in this planning batch.

### Batch 1 - Finish the seven existing integrations (in progress)

Suggested sequence: **Heston -> Binomial -> Bond Pricing / Duration -> Efficient
Frontier -> Payoff Lab -> Black-Scholes**.

- Close desktop/mobile inconsistencies first; reuse existing content before authoring.
- Add missing parameter topics only where existing explanations are insufficient.
- Reuse bond face/maturity/frequency sections across both fixed-income documents.
- Give Heston numerical resolution/sample count their own concise explanations.
- Inventory custom controls: Binomial stepper, Payoff builder/mobile dock, bond overlay
  toggles and precise yield-shock input. Reuse shared trigger primitives.
- Extend quiet disclosure to the relevant control wrappers, not globally to every tooltip.
- Record display-only exceptions. Review Black-Scholes maximum-maturity mapping.

Deliverable: existing documents become genuinely contextual, not merely accessible.
This batch adds no page documents; control-completion status is what improves here.
The baseline was 7/21; concurrent Yield Curve work brought the current total to 8/21.

Heston progress: parameter/metric/chart mappings implemented and DOM-tested on desktop
and mobile. The redundant topic strip and permanent Greek explanation were removed;
deeper explanations now live in the drawer. Spot and strike share one payoff section;
both step-count controls share a section that explicitly distinguishes their pipelines.
Greek selection uses one contextual chart-header trigger that follows the selected
metric. Series-visibility and parameter-collapse buttons remain display-only controls;
they do not change model assumptions and need no additional document section.

Shared tooltip fix: bubbles now escape clipping containers through a body portal,
clamp to viewport edges and flip below top-edge anchors. Escape dismissal, keyboard
focus and moving the pointer onto the bubble are supported. Drawer close restores
focus to the most recently used trigger, including repeated desktop requests.

Binomial progress: both modes' parameters, stepper, mobile dock, chart header, mode/type
groups, display groups and summary metrics are mapped. Spot/strike/type share the
European payoff explanation; u/d share multiplicative-factor intuition. Step count and
the fixed one-year period share the horizon topic. Rate input and summary discount
factor share a topic that explicitly distinguishes root discounting from full-maturity
bond price. Replication entries share next-step hedge intuition. Rate-mode root price
is labelled zero-coupon bond price rather than option price. Parameter collapse remains
display-only and has an accessible label, not a separate intuition section.

The existing oversized Binomial controls, summary and tree view were decomposed as
part of wiring; shared descriptors remove desktop/mobile duplication. Extracted lattice
geometry retains both desktop horizontal and mobile vertical layouts. Pricing algorithms,
parameter ranges, URL conventions and display-toggle behavior remain unchanged.

Bond Lab progress: all base parameters and both tabs' chart headers are mapped. The
cash-flow legend explains coupon/principal/future amounts/PV; split scale has a concise
definition and its own explanation of non-proportional heights across the axis break.
PV table time, cash flow, discount factor and present value headers have direct help.
Price-yield curve, duration toggle, convexity toggle and drag affordance link to the
corresponding topic without toggling an overlay or changing YTM. The permanent duration
education strip was removed; duration examples live in the drawer. The short drag
instruction stays because it describes an action, not financial theory.

Face value, maturity and payment frequency are reused by Duration/Convexity. Its
shock/result help is now mapped in the follow-up pass below. Numeric-field help uses the same
local hover/focus disclosure as sliders; touch access remains visible. The frequency
select uses a separate labelled control so its help button is not inside a label.

Bond Lab cash-flow chart work already present in the worktree was preserved. This
batch did not alter its broken-axis math, bars or chart hover behavior. The oversized
price-yield view was split into a hook and a small view, retaining chart data, overlay
defaults and drag bounds. Responsive chart SVGs did not materialize during integrated
browser validation, so visual chart/drag behavior is not signed off by the DOM help
checks. Do not infer chart correctness solely from passing help checks.

Duration follow-up: document 11 -> 13 sections, with separate exact-repricing and
approximation-error topics. Yield-shock content explains bp versus percentage points,
additive shocks and the existing 0.0001% yield floor. Exact price changes use starting
price, not face value, as their denominator. Signed error is estimate minus exact;
the price-bp result is the absolute error magnitude, not a yield shock. Both
approximations keep using the requested shock when exact repricing reaches the floor;
this limitation is explicit rather than silently changing the model.

Both shock controls, all nine result entries, both chart headers and all five legend
entries have contextual access. The permanent sign-dependent interpretation moved
into exact-repricing content. The formulas popover remains available, and the layout,
defaults, ranges, repricing and chart data are unchanged. Risk measures and results
use local quiet disclosure; shared chart legends now participate in the same opt-in
rule, without changing pages that do not opt in.

Desktop/mobile DOM checks verify topic targets, drawer reuse, latest-trigger focus
return, modal/inert cleanup, input synchronization, unchanged values/URL and header
opening at the top. Hungarian mobile page/drawer overflow checks pass. Reduced-motion
checks verify hidden-at-rest and visible-on-focus parameter/legend help. Actual chart
SVG rendering and a full pointer/touch visual review remain pending in the integrated
browser; icon SVGs are not evidence of chart rendering.

Efficient Frontier follow-up: 6 -> 14 sections and 0/6 -> 6/6 numeric mappings.
Objective metadata is shared between the controls and result strip. Help covers each
objective, shorting/long-only toggles, risk-free benchmark, leverage setting, signed
weights, composition selection, and the objective-based cost comparison. Both tab
headers and allocation panel have direct entries. Quiet help is local to labels,
numeric fields, result labels and legends; there is no new permanent theory strip.

Content follows the actual model: target return and volatility select the nearest
sampled efficient-branch point, not exact targets or a risk ceiling. The risk-free
toggle changes the Sharpe benchmark and draws a reference CML; risky weights still
sum to the investment budget and contain no cash. Leverage extends that reference
line. **Maximum gross is stored but not enforced by the solver.** Inconsistent
weight bounds cause the existing projection to clip the budget to its reachable sum.
These are pre-existing behavior limitations, left unchanged and explicitly explained;
help coverage does not certify optimization correctness.

The cost strip compares objective solutions even after manual selection; reference
methods differ by objective, and the dashed frontier uses finite open bounds.
Allocation bars use total long exposure as their denominator, including short
segments; signed list weights are the exact capital exposures, not risk contributions.
Desktop checks cover all six numeric fields, all four objectives and all four
toggle-help entries without mutating input/toggle state. Mobile checks cover both
target modes, conditional risk-free/gross inputs, cost and composition help, modal
cleanup and focus return. Composition SVG rendered on desktop/mobile. Hungarian
mobile drawer/page overflow checks pass. Composition click selection updates weights
without changing the objective cost comparison; header-at-top and reduced-motion
focus disclosure pass. Full scatter drag and pointer/touch visual review remain pending.

### Batch 2 - Portfolio foundations and Yield Curve

Suggested sequence: **Risk & Return -> Portfolio Lab -> CAPM -> Yield Curve**.

- Extract/reuse expected return, volatility, Sharpe, risk-free rate and diversification
  sections rather than repeating Efficient Frontier content.
- Distinguish CAL, CML and SML; distinguish beta from total volatility.
- Portfolio Lab needs repeated asset controls, cash/weight handling, correlation
  validity/repair and risk decomposition, not just its first chart.
- Yield Curve needs node editing, bootstrap, forward intervals and factor sliders.

Document-coverage milestone if all four ship: **11/21**.

### Batch 3 - Stochastic models and Delta Hedging

Suggested sequence: **Brownian Motion -> GBM -> Ito Process -> Monte Carlo ->
Delta Hedging**.

- Reuse simulation-setting explanations for seeds, paths/samples and resolution.
- Keep real-world drift separate from risk-neutral pricing drift.
- Explain uncertainty bands/terminal statistics, Ito correction and Monte Carlo error
  with the actual units/conventions used by the code.
- Delta Hedging: local replication, discrete rebalancing, financing and residual error;
  avoid implying that more frequent hedging eliminates every source of risk.
- Convert useful standalone definition tooltips to deeper links where appropriate.

Document-coverage milestone if all five ship: **16/21**.

### Batch 4 - Corporate finance

Suggested sequence: **TVM -> NPV / IRR -> WACC -> Capital Structure -> Valuation**.

- Reuse discounting/compounding and WACC concepts without conflating different rates.
- State contribution/cash-flow timing, IRR limitations and payback trade-offs.
- State capital-structure assumptions and debt/equity versus debt/total-capital ratios.
- DCF: terminal-growth assumptions, sensitivity as growth approaches WACC, enterprise
  versus equity value, and why a large terminal-value share matters.

Document-coverage milestone if all five ship: **21/21**. This is not automatically
full control coverage; all completion criteria must still be checked.

### Batch 5 - Cross-page quality gate

- Review content consistency and reusable sections across domains.
- Audit every tab, conditional mode, custom numeric/range input and mobile dock.
- Expand automated trigger validation: current tests check a selected list of files
  and literal IDs, not all live control paths or dynamic mappings.
- Guard newly completed modules against missing-document and missing-trigger regressions.
- Check quiet help at desktop, tablet and touch sizes.
- Review Diffusion separately if requested; it stays outside the live-module denominator.

## 4. Update protocol

For every gap-filling change:

1. Update the module row with newly covered surfaces and remaining gaps.
2. Recalculate the routed-document total only when a registry document is added.
3. Record parameter/metric/chart/mobile progress; keep a page Partial until verified.
4. List deliberate tooltip-only or grouped-help exceptions and why they are appropriate.
5. Extend relevant tests, run targeted checks, and append a dated completion entry.
6. Report a short delta in chat: pages added, controls connected, remaining gaps, next batch.

Do not replace this tracker with a second plan or count raw icon totals as coverage.

## 5. Progress log

| Date | Change | Coverage delta | Verification / remaining work |
| --- | --- | --- | --- |
| 2026-10-06 | Baseline source audit and rollout plan | 7/21 routed documents; 14 missing; 0 modules signed off Complete | Registry, document and control/descriptor audit; no application changes in this batch. All gap-filling batches pending. |
| 2026-10-06 | Heston parameter/metric/chart rollout; shared tooltip clipping fix | Heston desktop 0/13 -> 13/13; mobile 7/13 -> 13/13; document 6 -> 16 sections. Routed documents unchanged at 7/21. | Build, seven regression tests and scoped lint pass. Browser DOM checks: all 13 targets on desktop/mobile, drawer reuse, Escape/latest-trigger focus, modal/inert restoration and unchanged parameter URLs. Tooltip escaped overflow and stayed inside all four viewport edges. Final visual hover/touch and Hungarian layout review pending. Next: Binomial. |
| 2026-10-06 | Binomial dual-mode rollout | Equity desktop/mobile 0/6 -> 6/6; rates desktop/mobile 0/4 -> 4/4; document 4 -> 10 sections. Routed documents unchanged at 7/21. | Build, nine regression tests and scoped lint pass. Descriptor ranges/handlers, analytical one-step pricing, replication, horizon and extracted lattice geometry tested. Browser DOM checks verify both desktop/mobile control sets, distinct q targets, drawer reuse, focus return, mobile modality/inert cleanup and unchanged parameter URLs. Final visual hover/touch and Hungarian layout review pending. Next: Bond Pricing / Duration. |
| 2026-10-06 | Bond Lab contextual pass and shared base-bond concepts | Bond Lab and Duration base parameters 2/5 -> 5/5; documents 6 -> 13 and 8 -> 11 sections. Routed documents unchanged at 7/21 by this pass. | Ten regression tests, scoped lint and diff checks pass. Earlier build passed; final build recheck is blocked by missing translation keys in concurrent Yield Curve edits, left untouched. Shared section identity, translations/formulas, par, face scaling, frequency and zero-coupon duration tested. Desktop/mobile DOM help checks cover all Bond Lab inputs; timeline/table help, split toggle, overlay help/toggles and state preservation checked. Three shared topics also verified on Duration. Responsive SVG/drag and final visual/content checks pending. Next: finish Duration shock/results, then Efficient Frontier. |
| 2026-10-06 | Duration shock/results and quiet legend pass | 2/2 shock inputs, 9/9 selected-shock entries and five legend entries mapped; document 11 -> 13 sections. Concurrent Yield Curve registration brings current document count to 8/21; this pass adds no routed document. | Build, 11 regression tests, scoped lint and diff checks pass. Tests cover repricing, additive bp shocks, signed errors, absolute price-bp magnitudes, zero shock, curve/result consistency and yield floor. Desktop/mobile DOM targets, focus/state/modal behavior, header top, Hungarian mobile overflow and reduced-motion disclosure checked. Final visual/chart rendering and content sign-off pending. Next: Efficient Frontier numeric inputs and allocation interpretation. |
| 2026-10-06 | Efficient Frontier controls/allocation pass | Numeric mappings 0/6 -> 6/6; document 6 -> 14 sections. Routed documents unchanged at 8/21. | Build, 12 regression tests and scoped lint pass. Tests verify every numeric mapping, dynamic objective topics, nearest-sample targets, shorting bounds and risk-free benchmark behavior. Desktop/mobile help targets, state/focus/modal cleanup and Hungarian drawer overflow checked. Composition SVG rendered; full scatter drag/visual review pending. Existing optimizer limitations explicitly documented rather than silently changed. Next: Payoff Lab builder and mobile dock. |
