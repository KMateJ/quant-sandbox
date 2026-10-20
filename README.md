# Quant Sandbox

Interactive quantitative finance and mathematics labs, with a guide curriculum to match.

The app is a study aid for students of the **Insurance and Financial Mathematics program at ELTE and Corvinus University of Budapest**. Its goal is to make concepts that feel abstract in lectures and textbooks tangible: drag a parameter, predict an outcome, and see the maths respond.

Maintenance follows a rather informal *"I work on it when I feel like it"* model. If you would like to see additional topics implemented, feel free to reach out.

Available in **English and Hungarian**. Lab inputs are stored in the URL, so a link shares your exact setup.

---

## What is inside

### Labs (24)

| Category | Labs |
|---|---|
| Derivatives | Payoff, Binomial tree, Black–Scholes, Heston, Delta hedging |
| Portfolio & risk | Risk & return, CAPM, Portfolio lab, Efficient frontier |
| Fixed income | Bond pricing, Yield curve, Duration & convexity, Treasury futures, Immunization |
| Corporate finance | Time value of money, NPV & IRR, Valuation (DCF), WACC, Capital structure |
| Stochastic models | Stochastic studio, Brownian motion, GBM, Itô process, Monte Carlo |

Labs favour interaction over sliders-and-a-line-chart: draggable chart handles, sketching a curve, predict-then-reveal rounds, playback, and pinning curves to compare. Most labs include an intuition panel and a searchable intro with FAQ below the workspace.

### Guides

48 lessons in five tracks (derivatives, portfolio, fixed income, corporate finance, stochastic models). Each lesson is written from the ground up, with interactive figures and KaTeX maths, and lessons are linked to their labs. A knowledge graph shows how the lessons depend on each other.

---

## Tech stack

- React 19, TypeScript (strict), Vite, React Router 7
- `i18next` for English and Hungarian strings
- `visx` (SVG) for charts, with shared chart primitives in `src/components/charts/`
- SCSS with CSS custom properties for light and dark theming
- KaTeX for maths
- Web workers for heavy compute (Heston)
- Node's built-in test runner for the maths and logic (`scripts/*.test.mjs`)

## Project structure

```
src/
  modules/registry.ts   single source of truth for modules (routes, nav, home, SEO)
  features/<name>/      one folder per module: view, *.math.ts, *.types.ts, components/
  components/           layout, UI primitives, charts, playback
  lib/                  shared numerics, statistics, finance, URL state
  Language/             i18n string tables (en / hu)
  styles/               SCSS (tokens, layout, per-feature partials)
docs/                   expansion plan, guides plan, labs plan, per-initiative plans
scripts/                tests and audits
```

Adding a module takes one registry entry and one `features/<name>/` folder. See `CLAUDE.md` for the architecture rules and `docs/EXPANSION_PLAN.md` for the design system and roadmap.

---

## Running the project

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build          # type-check and production build
npm run lint           # ESLint
npm run test:labs      # lab maths tests (more test:* scripts in package.json)
npm run audit:layout   # responsive layout audit
npm run test:seo       # SEO audit
```

---

## License

This project is licensed under the Creative Commons BY-NC-SA 4.0 License.

The code may be used and modified for educational purposes, but commercial use is not permitted.
