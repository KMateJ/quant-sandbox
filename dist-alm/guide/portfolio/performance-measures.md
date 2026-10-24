# Sharpe, Treynor, Jensen's Alpha and Information Ratio

Risk-adjusted performance, which risk each measure charges for, and why the rankings can disagree. Free interactive lesson with worked examples.

A fund that returned 14% last year did better than one that returned 9%, unless it took far more risk to get there. This lesson turns that intuition into numbers. It uses the capital market line from "The efficient frontier and the capital market line" and beta and the security market line from "CAPM, beta and the security market line" to build four standard measures of risk-adjusted performance, and shows why they can rank the same funds in different orders.

## Excess return

Every measure starts from the **excess return** $\mu - r_f$: what a portfolio earned above the risk-free rate, the reward for bearing risk at all. The measures differ in what they divide it by or compare it with, that is, in which risk they charge for. Throughout, $\mu$, $\sigma$ and $\beta$ are one-year averages estimated from past returns, and the market index has $\mu_M$ and $\sigma_M$.

## The Sharpe ratio

The **Sharpe ratio** divides the excess return by total volatility:

$$
\text{SR} = \frac{\mu - r_f}{\sigma}.
$$

In the $(\sigma, \mu)$ plane it is the slope of the line from the risk-free point to the portfolio. A portfolio steeper than the capital market line, whose slope is the market's Sharpe ratio, beat the market per unit of total risk. Total risk is the right yardstick when the portfolio is all the investor holds.

## M²

A Sharpe ratio of 0.44 is hard to feel. **M²** (Modigliani squared) translates it into a return. Mix the portfolio with the risk-free asset until its volatility equals the market's $\sigma_M$; the expected return of that mix minus the market's is

$$
M^2 = r_f + \text{SR}\,\sigma_M - \mu_M.
$$

It ranks portfolios exactly as the Sharpe ratio does, but in percentage points of return at market risk.

## The Treynor ratio

An investor who already holds a well-diversified portfolio cares about a fund's contribution to that portfolio's risk, which is its beta, not its total volatility. The **Treynor ratio** divides the excess return by beta:

$$
\text{TR} = \frac{\mu - r_f}{\beta}.
$$

In the $(\beta, \mu)$ plane it is the slope from the risk-free point to the fund. The market itself has $\beta = 1$, so its Treynor ratio is the market risk premium $\mu_M - r_f$; a fund above that beat the market per unit of systematic risk.

## Jensen's alpha

**Jensen's alpha** measures the same comparison as a return: how far the fund lies above the security market line,

$$
\alpha = \mu - \big[r_f + \beta\,(\mu_M - r_f)\big].
$$

The bracket is the return the CAPM requires for the fund's beta, so $\alpha$ is the return earned beyond what its systematic risk justifies. A fund with positive alpha also has a Treynor ratio above the market's, so the two always agree on whether a fund beat the market, and here they rank the funds identically.

## Tracking error and the information ratio

Alpha does not say how much risk was taken to get it. Write the fund's return as $\beta$ times the market's plus an unrelated residual $\varepsilon$, as in the single-index view of the CAPM lesson. The residual's volatility is the **tracking error** against the beta-matched index:

$$
\sigma(\varepsilon) = \sqrt{\sigma^2 - \beta^2 \sigma_M^2}.
$$

The **information ratio** divides alpha by it, $\text{IR} = \alpha / \sigma(\varepsilon)$: abnormal return per unit of the risk taken by deviating from the index. It matters when a fund is judged against a benchmark, and it decides how much weight an actively managed fund deserves next to an index fund.

> Sharpe and M² charge for total risk, Treynor and alpha for systematic risk, the information ratio for active (residual) risk. Which one is right depends on what else the investor holds.

## Worked example

Take four made-up funds, a market index with $\mu_M = 10\%$ and $\sigma_M = 18\%$, and $r_f = 3\%$:

- A: $\mu = 12\%$, $\sigma = 24\%$, $\beta = 1.20$.
- B: $\mu = 9\%$, $\sigma = 12\%$, $\beta = 0.60$.
- C: $\mu = 14\%$, $\sigma = 30\%$, $\beta = 1.05$.
- D: $\mu = 11\%$, $\sigma = 18\%$, $\beta = 0.95$.

The market's Sharpe ratio is $0.07/0.18 \approx 0.389$ and its Treynor ratio is 7%. For fund C,

$$
\text{SR}_C = \frac{0.11}{0.30} \approx 0.367, \qquad \text{TR}_C = \frac{0.11}{1.05} \approx 10.48\%, \qquad \alpha_C = 14\% - (3\% + 1.05 \times 7\%) = 3.65\%,
$$

and its residual risk is $\sqrt{0.09 - 1.05^2 \times 0.0324} \approx 23.3\%$, so $\text{IR}_C \approx 0.0365/0.233 \approx 0.157$. Fund B, the quiet one, has $\text{SR}_B = 0.06/0.12 = 0.5$, $\alpha_B = 9\% - (3\% + 0.6 \times 7\%) = 1.8\%$, residual risk $\sqrt{0.0144 - 0.36 \times 0.0324} \approx 5.23\%$ and $\text{IR}_B \approx 0.344$. Doing the same for all four gives these rankings:

- Sharpe (and M²): B 0.500, D 0.444, A 0.375, C 0.367.
- Treynor and alpha: C (10.48%, 3.65%), B (10.00%, 1.80%), D (8.42%, 1.35%), A (7.50%, 0.60%).
- Information ratio: B 0.344, D 0.240, C 0.157, A 0.057.

Now rate a fifth fund E with $\mu = 10\%$, $\sigma = 16\%$ and $\beta = 0.70$ against the same market.

### Worked example: All measures for fund E

1. Sharpe ratio.
   $$\text{SR}_E = \frac{\mu_E - r_f}{\sigma_E}$$ → **0.4375**
2. Treynor ratio.
   $$\text{TR}_E = \frac{\mu_E - r_f}{\beta_E}$$ → **10%**
3. Jensen's alpha.
   $$\alpha_E = \mu_E - \big[r_f + \beta_E(\mu_M - r_f)\big]$$ → **2.1%**
4. Residual risk (tracking error).
   $$\sigma(\varepsilon_E) = \sqrt{\sigma_E^2 - \beta_E^2\sigma_M^2}$$ → **9.86%**
5. Information ratio.
   $$\text{IR}_E = \alpha_E/\sigma(\varepsilon_E)$$ → **0.213**
6. M², the return at market risk minus the market's.
   $$M^2_E = r_f + \text{SR}_E\,\sigma_M - \mu_M$$ → **0.875%**

E's alpha of 2.1% is second only to C's, its Sharpe ratio would place it just below D, and its information ratio below both B and D: the same fund looks good or average depending on the yardstick.

## Why the rankings disagree

Fund C has the highest alpha, yet the lowest Sharpe ratio, below the market's ($M^2_C \approx -0.40\%$). Most of its 30% volatility is residual risk. Held on its own, all of that risk lands on the investor, and per unit of total risk C did worse than an index fund. Held as a small slice of a large diversified portfolio, its residual risk mostly cancels against other holdings, only its beta matters, and its 3.65% alpha is a real gain. B is the opposite: a modest alpha with very little residual risk, which gives it the best Sharpe and information ratios.

The rule of thumb follows. Judge a portfolio that is the investor's whole wealth by the Sharpe ratio or M². Judge one holding among many by the Treynor ratio or alpha. Judge an active manager measured against a benchmark by the information ratio.

The figure lists the four funds and the market. Click a measure's column header to rank by it and watch the rows reorder. The scatter next to the table switches to the axes where that measure is visible: $(\sigma, \mu)$ with the capital market line for Sharpe, $(\beta, \mu)$ with the security market line for Treynor and alpha, and residual risk against alpha for the information ratio. Hover over a fund to draw its measure as a slope or, for alpha, as the vertical distance to the line. Compare fund C under Sharpe and under alpha.

*[Interactive figure: performance ranking](https://quantsandbox.dev/guide/portfolio/performance-measures)*

## Limits of the measures

All four are estimates from a few years of data and carry large sampling error: an alpha of 2% a year with 10% residual risk needs decades of data before it is statistically distinguishable from zero. Beta and alpha also depend on which index is used as the market. And funds that did badly tend to close and drop out of databases, so the surviving funds look better than the average fund was.

## Summary

- Every measure starts from the excess return $\mu - r_f$ and charges for a particular kind of risk.
- Sharpe $(\mu - r_f)/\sigma$ and M² use total risk: right for a portfolio held on its own.
- Treynor $(\mu - r_f)/\beta$ and Jensen's alpha use systematic risk: right for one holding in a diversified portfolio.
- The information ratio $\alpha/\sigma(\varepsilon)$ prices the active risk taken against a benchmark.
- A fund with high alpha and high residual risk can rank first by one measure and last by another.

> The next lesson, "Factor models and systematic risk", replaces the single market factor with several and splits a portfolio's variance into systematic and specific parts.

[Place assets against the security market line and read off their betas and alphas in the CAPM lab](https://quantsandbox.dev/capm)

## Interactive labs

- [CAPM Calculator & Security Market Line](https://quantsandbox.dev/capm)
- [Capital Allocation Line & Sharpe Ratio Visualizer](https://quantsandbox.dev/risk-return)

## Practice questions

### 1. With $r_f = 3\%$ and $\mu_M = 10\%$, a fund with $\beta = 1.4$ earned $\mu = 13\%$. What is its Jensen's alpha? Answer in percent.

**Answer:** 0.2%

The CAPM requires $3\% + 1.4 \times 7\% = 12.8\%$ for that beta, so $\alpha = 13\% - 12.8\% = 0.2\%$. A high return can come mostly from a high beta.

### 2. A fund will be a small slice of a large, well-diversified pension portfolio. Which measure should decide whether to add it?

- a) The Treynor ratio or Jensen's alpha
- b) The Sharpe ratio
- c) The information ratio against the fund's own benchmark
- d) The raw average return

**Answer:** a) The Treynor ratio or Jensen's alpha

Inside a diversified portfolio the fund's residual risk mostly cancels, so only its systematic risk, beta, matters: the Treynor ratio or alpha. The Sharpe ratio fits a portfolio that is the investor's whole wealth.

---

Source: https://quantsandbox.dev/guide/portfolio/performance-measures

Previous lesson: [CAPM, Beta and the Security Market Line Explained](https://quantsandbox.dev/guide/portfolio/capm)

Next lesson: [Factor Models: Single-Index Model and Systematic Risk](https://quantsandbox.dev/guide/portfolio/factor-models)
