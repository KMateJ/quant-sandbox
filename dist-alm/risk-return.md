# Capital Allocation Line & Sharpe Ratio Visualizer

Combine a risky asset with the risk-free rate: expected return, volatility, the Sharpe ratio and leverage along the capital allocation line.

## About this tool

Combining a risky portfolio with a risk-free asset traces the capital allocation line. This tool shows how expected return and volatility change as you shift weight between the two, how leverage extends the line, and how the Sharpe ratio — excess return per unit of risk — sets its slope.

## Frequently asked questions

### What is the Sharpe ratio?

Expected return minus the risk-free rate, divided by volatility. It is the slope of the capital allocation line and the same for every mix of the risky asset with cash.

### What does leverage do on the capital allocation line?

Borrowing at the risk-free rate to hold more than 100% in the risky asset moves you further along the same line: higher expected return and proportionally higher volatility.

### What is a good Sharpe ratio?

It depends on the horizon and the asset class, so compare like with like. As a rough guide for annual figures, broad stock market indices have historically had Sharpe ratios of about 0.3–0.5, a value above 1 is considered very good, and a persistently much higher number is a reason to look for hidden risks.

### How do you calculate the return and risk of a portfolio with a risk-free asset?

With weight w in the risky portfolio and 1 − w in the risk-free asset, the expected return is r_f + w (E[R] − r_f) and the volatility is w σ, because the risk-free asset has no variance. For example, 60% in a portfolio with an 8% expected return and 20% volatility, with r_f = 2%, gives a 5.6% expected return and 12% volatility.

## Learn the theory

- [Returns and volatility](https://quantsandbox.dev/guide/portfolio/returns-volatility): Simple and log returns, standard deviation, annualising and the square-root-of-time rule.
- [Diversification and correlation](https://quantsandbox.dev/guide/portfolio/diversification): Two-asset portfolios, the role of covariance, and why correlation drives risk down.
- [Risk aversion and the optimal complete portfolio](https://quantsandbox.dev/guide/portfolio/risk-aversion): Mean–variance utility, indifference curves, the risk-aversion coefficient and the best point on the capital allocation line.
- [Performance measures: Sharpe, Treynor, Jensen and information ratio](https://quantsandbox.dev/guide/portfolio/performance-measures): Risk-adjusted performance, which risk each measure charges for, and why the rankings can disagree.
- [Value at Risk and expected shortfall](https://quantsandbox.dev/guide/portfolio/risk-measures): Loss quantiles, the tail beyond them, normal versus fat-tailed returns, and the square-root-of-time rule.
- [Estimating expected returns and covariances](https://quantsandbox.dev/guide/portfolio/input-estimation): Sample moments, their standard errors, why the frontier is unstable, and shrinkage as a remedy.

Open the interactive tool: https://quantsandbox.dev/risk-return
