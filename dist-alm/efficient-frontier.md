# Efficient Frontier & Markowitz Portfolio Optimization

Markowitz mean–variance optimization: the efficient frontier, minimum-variance and maximum-Sharpe (tangency) portfolios, target return or volatility, and the cost of constraints.

## About this tool

Markowitz portfolio optimization finds the portfolios with the highest expected return for each level of risk: the efficient frontier. This tool solves for the global minimum-variance portfolio, the maximum-Sharpe tangency portfolio and portfolios with a target return or volatility, and shows how weight constraints such as no short selling cost efficiency.

## Frequently asked questions

### What is the tangency portfolio?

The frontier portfolio with the highest Sharpe ratio. The line from the risk-free rate to it is the steepest possible capital allocation line.

### Why do constraints matter?

Limits such as no short selling shrink the set of allowed portfolios, so the constrained frontier lies on or below the unconstrained one. The gap is the cost of the constraint.

### What is the efficient frontier?

The set of portfolios with the highest expected return for each level of volatility, or equivalently the lowest volatility for each expected return. It is the upper edge of the region of all possible portfolios, starting at the global minimum-variance portfolio. A portfolio below it is inefficient, because another one offers more return for the same risk.

### Why do optimized portfolio weights change so much with the inputs?

Mean–variance optimization needs the expected return, volatility and correlations of every asset. Estimated expected returns are noisy and the optimizer leans heavily on whichever assets look best, so small changes in the inputs can move the weights a lot. Constraints such as no short selling or position limits make the weights more stable.

## Learn the theory

- [The efficient frontier and the capital market line](https://quantsandbox.dev/guide/portfolio/efficient-frontier): Mean–variance optimisation, the minimum-variance portfolio, a risk-free asset and the tangency portfolio.
- [Diversification and correlation](https://quantsandbox.dev/guide/portfolio/diversification): Two-asset portfolios, the role of covariance, and why correlation drives risk down.
- [CAPM, beta and the security market line](https://quantsandbox.dev/guide/portfolio/capm): Systematic versus idiosyncratic risk, beta as market sensitivity, expected return and alpha.
- [Risk aversion and the optimal complete portfolio](https://quantsandbox.dev/guide/portfolio/risk-aversion): Mean–variance utility, indifference curves, the risk-aversion coefficient and the best point on the capital allocation line.
- [Portfolio constraints and the no-short-sales frontier](https://quantsandbox.dev/guide/portfolio/portfolio-constraints): Why real portfolios cannot follow the unconstrained frontier: short-sale bans, position limits, and what they cost in Sharpe ratio.
- [Estimating expected returns and covariances](https://quantsandbox.dev/guide/portfolio/input-estimation): Sample moments, their standard errors, why the frontier is unstable, and shrinkage as a remedy.

Open the interactive tool: https://quantsandbox.dev/efficient-frontier
