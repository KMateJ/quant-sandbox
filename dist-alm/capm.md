# CAPM Calculator & Security Market Line

Interactive Capital Asset Pricing Model: beta, the market risk premium, the security market line and Jensen's alpha for individual assets.

## About this tool

The Capital Asset Pricing Model links an asset's expected return to its beta, its sensitivity to the market. This tool plots the security market line from the risk-free rate and the market risk premium, places assets by beta, and shows Jensen's alpha as the gap between an asset's expected return and the CAPM prediction.

## Frequently asked questions

### How is expected return calculated with CAPM?

E[R] = r_f + β (E[R_m] − r_f): the risk-free rate plus beta times the market risk premium.

### What does a positive alpha mean?

The asset's expected return lies above the security market line, more than CAPM requires for its beta, so it plots as underpriced relative to the model.

### What is beta in finance?

Beta measures how strongly an asset's return moves with the market: β = Cov(R_i, R_m) / Var(R_m). A beta of 1 moves with the market on average, 1.5 moves about 50% more and a beta below 1 is less sensitive. In CAPM only this market risk earns a premium, because firm-specific risk can be diversified away.

### What is the security market line?

The line E[R] = r_f + β (E[R_m] − r_f) that plots required return against beta. It starts at the risk-free rate at β = 0, passes through the market portfolio at β = 1 and has the market risk premium as its slope. Assets above the line have a positive alpha, those below it a negative one.

## Learn the theory

- [CAPM, beta and the security market line](https://quantsandbox.dev/guide/portfolio/capm): Systematic versus idiosyncratic risk, beta as market sensitivity, expected return and alpha.
- [The efficient frontier and the capital market line](https://quantsandbox.dev/guide/portfolio/efficient-frontier): Mean–variance optimisation, the minimum-variance portfolio, a risk-free asset and the tangency portfolio.
- [Performance measures: Sharpe, Treynor, Jensen and information ratio](https://quantsandbox.dev/guide/portfolio/performance-measures): Risk-adjusted performance, which risk each measure charges for, and why the rankings can disagree.
- [Factor models and systematic risk](https://quantsandbox.dev/guide/portfolio/factor-models): The single-index model, splitting systematic from specific variance, and multi-factor models.

Open the interactive tool: https://quantsandbox.dev/capm
