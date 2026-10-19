# 07 — Content depth and internal links on lab pages

Status: done (2026-10-19) · Depends on: 01, 03 (FAQPage reads the same FAQ data) · Suggested model: Sonnet (the finance copy must be correct; the owner reviews it) · Est. size: M

## Why

Lab pages rank for high-intent queries ("WACC calculator", "binomial option pricing calculator"),
but each has only about 390 words of crawlable text, mostly control labels. Search engines and AI
answer engines favour pages that explain the concept, answer the obvious questions and link to
deeper material. The lessons already exist. The labs should point to them **in the page body**, not
only in the sidebar, and carry a few more genuinely useful FAQ answers. This also feeds plan 03's
FAQPage and plan 04's Markdown twins automatically, because they read the same data.

## Current state (verified 2026-10-19)

- Lab SEO titles (registry `seo.title`) are already strong, e.g. "WACC Calculator: Weighted Average
  Cost of Capital" and "Heston Stochastic Volatility Model Simulator". The visible `<h1>` is the
  short nav name ("Heston", "Weighted Average Cost of Capital"). That's acceptable; don't change it
  here.
- `src/components/layout/ModuleAboutSection.tsx` (29 lines) renders, on the module's own path only:
  `<h2>About this tool</h2>`, an intro `<p>`, `<h3>Frequently asked questions</h3>`, and the FAQ
  as `<details><summary>Q</summary><p>A</p></details>`. It's mounted for every module with `about`
  in `src/App.tsx`.
- FAQ data: `moduleAbout(prefix, faqCount = 2)` in `src/modules/moduleAbout.ts` builds the keys
  `about<Prefix>Intro`, `about<Prefix>Q1..n` and `about<Prefix>A1..n`. The strings live in
  `src/Language/ModuleAbout.ts` (`moduleAboutEn` / `moduleAboutHu`). **Every module uses 2 FAQs
  today** (no `Q3` key exists). The registry calls `moduleAbout("Wacc")`, `moduleAbout("Heston")`,
  and so on (about 24 modules, including `moduleAbout("Guide")` shared by the 5 guide tracks).
- Related lessons appear **only in the sidebar**: `Sidebar.tsx` → `<ConnectedGuides
  ids={activeModule.relatedGuides} />` (`src/components/layout/ConnectedGuides.tsx`, `.cg-link`
  items with the guide icon and title). `ModuleDef.relatedGuides?: string[]` is set on 22 modules.
- Reverse link data also exists: each `GuideLessonMeta` in `src/features/guide/guide.meta.ts` has
  `labs: string[]` (registry module ids the lesson practises).
- Lessons already link to labs in their body (`lab` blocks).
- Owner rules: **derivatives labs are hands-off** (payoff, binomial, black-scholes, heston,
  delta-hedging); don't change their logic or UI. The shared About section is a common layout
  component, so a related-lessons list there is OK. **Writing new FAQ copy for those five modules
  needs the owner's approval** (see Step 4). Other rules: no pills, no left-border accents, guide
  writing style (plain descriptive wording, explanations built up from basics).

## Goal

1. Add a "Related lessons" block **inside** the About section of each lab: a plain list of lesson
   links with their one-line descriptions. The data is derived, not hand-listed.
2. Raise the FAQ count to 4 for the non-derivatives labs, with new, accurate EN + HU Q&As that
   answer real search questions.
3. Raise the audit's lab word-count threshold accordingly.

## Non-goals

- No change to lab calculations, controls or charts.
- No change to the guide-track FAQ (`moduleAbout("Guide")`) beyond what's natural. Leave it.
- Don't remove the sidebar's Connected Guides.

## Constraints

CLAUDE.md: DRY (one helper computes a module's related lessons, used by both the sidebar and the
About section), `.tsx` ≤ about 150 lines, strings through i18n in EN + HU, `///` comments. Styling
goes in an existing SCSS partial (find where `.module-about` is styled with
`grep -rn "module-about" src/styles`).

## Steps

1. **Helper (pure):** in `src/features/guide/guide.meta.ts`, add
   ```ts
   /// Lessons connected to a lab: its `relatedGuides` first, then lessons that list the lab in `labs`, without duplicates.
   export function relatedLessons(moduleId: string, relatedGuides: string[] = []): GuideLessonMeta[]
   ```
   Use it in `ConnectedGuides.tsx`. Change its props to `{ moduleId, ids }`, or keep `ids` and let
   the Sidebar pass the computed list, whichever keeps the component simplest. The sidebar list may
   grow slightly as a result. That's intended.
2. **Component:** create `src/components/layout/ModuleRelatedLessons.tsx` (well under 150 lines),
   rendered at the end of `ModuleAboutSection`:
   `<h3>{t("aboutRelatedHeading")}</h3>` + `<ul className="module-about-related">` of
   `<li><Link to={guidePath(id)}>{title}</Link> — <span>{t(descKey)}</span></li>`. Plain text
   links: no chips, no icons required, no left border. `ModuleAboutSection` needs the module id.
   Pass `id` from `App.tsx` (`<ModuleAboutSection about={m.about} path={m.path} moduleId={m.id} />`).
   Render nothing when the list is empty.
3. **i18n:** add `aboutRelatedHeading` ("Learn the theory" / "Az elmélet") to
   `src/Language/ModuleAbout.ts`, EN and HU.
4. **FAQ expansion** (non-derivatives labs first). For each of these registry calls, change to
   `moduleAbout("<Prefix>", 4)` and write `Q3/A3` and `Q4/A4` in **both** `moduleAboutEn` and
   `moduleAboutHu`:
   BondPricing, YieldCurve, DurationConvexity, TreasuryFutures, RiskReturn, Capm, PortfolioLab,
   EfficientFrontier, NpvIrr, Valuation, Tvm, Wacc, CapitalStructure, BrownianMotion, Gbm,
   ItoProcess, MonteCarlo, StochasticModels.
   Writing rules for each Q&A:
   - The question is phrased the way people search (e.g. "How do you calculate WACC with
     taxes?", "What is a good Sharpe ratio?", "Why does convexity matter for bond prices?"). Don't
     repeat Q1/Q2 (read them first).
   - The answer is 2–4 sentences, self-contained, factually correct, and gives a formula in words or
     a small number example where helpful. **No `$tex$`** (the FAQ renders plain text), and don't
     claim features the lab lacks (open the lab view to check).
   - The Hungarian version is natural Hungarian with standard finance terms (e.g. "súlyozott átlagos
     tőkeköltség", "lejáratig számított hozam", "konvexitás"). It's not a word-for-word calque.
   - For the five derivatives labs (Payoff, Binomial, BlackScholes, Heston, DeltaHedging), **don't
     edit**. Instead, draft the proposed Q3/Q4 (EN + HU) in this plan's "Findings" section for the
     owner to approve.
5. **Audit:** in `scripts/seo-audit.test.mjs`, raise the `lab` word-count threshold to the new
   minimum minus about 10%. Add a check that every lab page whose module has `relatedGuides` or
   linked lessons contains at least one `href="/guide/` link **inside** the `module-about` section
   (slice the body from `class="module-about"`).
6. Run `npm run build`, open 3 labs in `npm run preview` (desktop + narrow width), and check that
   the new list wraps nicely in both themes.

## Acceptance criteria

- Every non-derivatives lab shows 4 FAQs and a "Learn the theory" list in its About section, in
  both languages.
- `relatedLessons()` is the single source used by both the sidebar and the About section.
- The thinnest lab is about 550+ words in the audit report. Record the actual minimum in Findings.
- `npm run build`, `npm run test:seo`, `npm run lint` and `tsc` are green. The `about…Q3` keys exist
  in EN and HU (`tsc` catches missing HU keys if plan 06 is done; otherwise grep both blocks).
- The derivatives labs are untouched. Their draft FAQs are in Findings.

## Verification

```bash
npm run build
npm run test:seo
npm run lint
grep -c "aboutWaccQ4" src/Language/ModuleAbout.ts   # → 2 (en + hu)
```

## Pitfalls

- `ModuleAboutSection` returns `null` on sub-pages (`pathname !== path`). Keep that behaviour.
- If plan 03 is done, the FAQPage JSON-LD picks up the new questions automatically. Verify that
  `dist/wacc.html` lists 4 `Question` items.
- The `StochasticModels` module is a course (studio lessons). Its related lessons are guide lessons
  from the stochastic track, which is fine.
- Don't invent claims about the app ("export to Excel") in FAQ answers.

## Findings (fill in)

- Word counts after (audit, `lab` kind): thinnest non-derivatives lab `/wacc` 544, then
  `/capm` 598, `/capital-structure` 603; most labs are 640–850. The untouched derivatives labs are
  `/delta-hedging` 440, `/binomial` 500, `/heston` 501, `/black-scholes` 575, `/payoff` 645 (they
  grew only from the related-lessons list). The `lab` threshold is now 400 (440 − about 10%). It
  can rise to about 490 once the derivatives FAQs below are approved.
- Every lab About section now links to 2–8 lessons (`relatedLessons()`); the audit enforces ≥ 1.
  `ConnectedGuides` in the sidebar uses the same helper, so labs without `relatedGuides` but with
  reverse links now show lessons there too.
- Not done: the manual visual check in `npm run preview` (step 6, narrow width and both themes).
  The list reuses the `.module-about` text styles, with plain links and no borders.
- Draft Q3/Q4 for Payoff, Binomial, BlackScholes, Heston, DeltaHedging (EN + HU), **awaiting owner
  approval** (not in the code). To apply: add the keys to `ModuleAbout.ts` / `ModuleAbout.hu.ts`
  and change the registry call to `moduleAbout("<Prefix>", 4)`.
  - **Payoff**
    - Q3 EN: What is a straddle and when is it used? — Buying a call and a put with the same strike
      and expiry. It profits from a large move in either direction and loses at most the two
      premiums if the price ends at the strike, so it is a bet on volatility rather than direction.
    - Q3 HU: Mi a straddle, és mikor használják? — Egy call és egy put vétele azonos kötési árral és
      lejárattal. Bármelyik irányú nagy elmozdulásból nyer, és legfeljebb a két prémiumot veszíti
      el, ha az ár a kötési árnál zár, így a volatilitásra, nem az irányra tett fogadás.
    - Q4 EN: What is the maximum loss of a covered call? — The stock price paid minus the premium
      received: the call caps the upside at the strike, while the premium only cushions a fall. The
      breakeven is the purchase price minus the premium.
    - Q4 HU: Mekkora a fedezett call maximális vesztesége? — A részvényért fizetett ár mínusz a
      kapott prémium: a call a kötési árnál lezárja a felfelé mozgás nyereségét, a prémium pedig
      csak tompítja az esést. A fedezeti pont a vételár mínusz a prémium.
  - **Binomial**
    - Q3 EN: How do you choose u and d in a binomial tree? — Commonly with the Cox–Ross–Rubinstein
      choice u = e^(σ√Δt) and d = 1/u, where Δt is the step length. This matches the stock's
      volatility over each step and makes the tree recombine, so n steps have only n + 1 final nodes.
    - Q3 HU: Hogyan válasszuk meg u-t és d-t a binomiális fában? — Leggyakrabban a
      Cox–Ross–Rubinstein-féle választással: u = e^(σ√Δt) és d = 1/u, ahol Δt a lépés hossza. Ez
      minden lépésen a részvény volatilitásához igazodik, és a fa összenő, így n lépés után csak
      n + 1 végcsomópont van.
    - Q4 EN: How are American options priced in a binomial tree? — Working backwards, at each node
      take the larger of the continuation value (the discounted risk-neutral expectation) and the
      value of exercising immediately. The nodes where exercise wins form the early-exercise region;
      for an American put it lies at low stock prices. *(Check that the lab offers American
      exercise before publishing; if not, reword to avoid implying it.)*
    - Q4 HU: Hogyan árazunk amerikai opciót binomiális fában? — Visszafelé haladva minden
      csomópontban a továbbtartási érték (a diszkontált kockázatsemleges várható érték) és az
      azonnali lehívás értéke közül a nagyobbat vesszük. Azok a csomópontok, ahol a lehívás nyer,
      alkotják a korai lehívási tartományt; amerikai putnál ez alacsony részvényárfolyamoknál van.
  - **BlackScholes**
    - Q3 EN: What is the Black–Scholes formula for a call option? — C = S N(d₁) − K e^(−rT) N(d₂),
      with d₁ = [ln(S/K) + (r + ½σ²)T] / (σ√T) and d₂ = d₁ − σ√T, where N is the standard normal
      distribution function. The put follows from put–call parity: P = K e^(−rT) N(−d₂) − S N(−d₁).
    - Q3 HU: Mi a Black–Scholes-képlet egy call opcióra? — C = S N(d₁) − K e^(−rT) N(d₂), ahol
      d₁ = [ln(S/K) + (r + ½σ²)T] / (σ√T), d₂ = d₁ − σ√T, N pedig a standard normális
      eloszlásfüggvény. A put ára a put–call paritásból következik: P = K e^(−rT) N(−d₂) − S N(−d₁).
    - Q4 EN: What are the assumptions of the Black–Scholes model? — The stock follows geometric
      Brownian motion with constant volatility, the interest rate is constant, there are no
      dividends, transaction costs or taxes, trading is continuous, short selling is allowed and the
      option is European. Real markets break several of these, which is why implied volatility
      varies with strike and maturity.
    - Q4 HU: Milyen feltevésekre épül a Black–Scholes-modell? — A részvényár állandó volatilitású
      geometriai Brown-mozgást követ, a kamatláb állandó, nincs osztalék, tranzakciós költség és
      adó, a kereskedés folytonos, a short ügylet megengedett, az opció pedig európai. A valódi
      piacok több feltevést is megsértenek, ezért függ az implikált volatilitás a kötési ártól és a
      lejárattól.
  - **Heston**
    - Q3 EN: What is the Feller condition in the Heston model? — 2κθ > ξ², where κ is the
      mean-reversion speed, θ the long-run variance and ξ the volatility of variance. When it holds,
      the variance stays strictly positive; when it fails, variance can touch zero and a simulation
      must take care not to let it go negative.
    - Q3 HU: Mi a Feller-feltétel a Heston-modellben? — 2κθ > ξ², ahol κ a visszahúzás sebessége,
      θ a hosszú távú variancia, ξ pedig a variancia volatilitása. Ha teljesül, a variancia
      szigorúan pozitív marad; ha nem, a variancia elérheti a nullát, és a szimulációban ügyelni
      kell rá, hogy ne váljon negatívvá.
    - Q4 EN: What do the Heston parameters mean? — v₀ is the starting variance, θ the long-run
      variance it reverts to, κ how fast it reverts, ξ (vol-of-vol) how much the variance itself
      fluctuates, and ρ the correlation between price and variance shocks. A higher ξ fattens the
      tails of returns and curves the volatility smile more; ρ mainly controls its skew.
    - Q4 HU: Mit jelentenek a Heston-modell paraméterei? — v₀ a kiinduló variancia, θ a hosszú távú
      variancia, amelyhez visszahúz, κ a visszahúzás sebessége, ξ (vol-of-vol) azt méri, mennyire
      ingadozik maga a variancia, ρ pedig az ár- és a varianciasokkok korrelációja. Nagyobb ξ
      vastagabb szélű hozameloszlást és görbültebb mosolyt ad, ρ főként a ferdeséget szabályozza.
  - **DeltaHedging**
    - Q3 EN: What is the delta of a call option? — In the Black–Scholes model it is N(d₁), a number
      between 0 and 1: the number of shares that offsets a small move in the stock price. An
      at-the-money call has a delta of roughly 0.5, a deep in-the-money call close to 1 and a far
      out-of-the-money call close to 0.
    - Q3 HU: Mekkora egy call opció deltája? — A Black–Scholes-modellben N(d₁), egy 0 és 1 közötti
      szám: ennyi részvény ellensúlyozza a részvényár kis elmozdulását. Egy ATM call deltája
      nagyjából 0,5, egy mélyen ITM callé közel 1, egy messze OTM callé közel 0.
    - Q4 EN: How does gamma affect the cost of delta hedging? — A hedger who sold an option is short
      gamma: they have to buy stock after it has risen and sell after it has fallen, locking in
      small losses. These are largest where gamma is high, near the strike close to expiry, and grow
      with realized volatility. If realized volatility equals the implied volatility used to price
      the option, the premium collected pays for them on average.
    - Q4 HU: Hogyan befolyásolja a gamma a deltafedezés költségét? — Aki opciót adott el, gamma-short
      pozícióban van: emelkedés után kell részvényt vennie és esés után eladnia, ami apró
      veszteségeket rögzít. Ezek ott a legnagyobbak, ahol a gamma magas — a kötési ár közelében,
      lejárat előtt —, és a realizált volatilitással nőnek. Ha a realizált volatilitás megegyezik
      az opció árazásához használt implikált volatilitással, a beszedett prémium átlagosan
      fedezi őket.

## Prompt to hand off

> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/seo/README.md` (section
> 4) and `docs/plans/seo/07-content-depth-internal-links.md`, and confirm that plans 01 and 03 are
> done. Implement plan 07: a `relatedLessons()` helper in `guide.meta.ts` used by both the sidebar
> and a new `ModuleRelatedLessons` component inside the About section, the EN/HU heading key, and
> two more accurate FAQ pairs (EN + HU) for every non-derivatives lab. **Do not edit** the payoff,
> binomial, black-scholes, heston or delta-hedging modules; put draft FAQs for them in the plan's
> Findings instead. Update the audit thresholds, run build, tests and lint, mark plan 07 done in the
> README, and summarise, listing the new questions.
