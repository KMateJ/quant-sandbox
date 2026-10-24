# Two-Asset Portfolio: Diversification & Correlation

See how correlation drives diversification: expected return, volatility and the minimum-variance portfolio of two assets on an interactive frontier.

## About this tool

Diversification works because assets do not move perfectly together. In this two-asset portfolio lab you set expected returns, volatilities and the correlation, and watch the frontier of possible portfolios bend: the lower the correlation, the more risk you can remove, down to the minimum-variance portfolio.

## Frequently asked questions

### Why does lower correlation reduce portfolio risk?

Portfolio variance includes a covariance term. When correlation is below 1, losses in one asset are partly offset by the other, so portfolio volatility is less than the weighted average of the two volatilities.

### What is the minimum-variance portfolio?

The mix of the two assets with the lowest possible volatility. With perfectly negative correlation it can even be risk-free.

### How do you calculate the volatility of a two-asset portfolio?

σ_p² = w₁²σ₁² + w₂²σ₂² + 2 w₁ w₂ ρ σ₁ σ₂, and σ_p is its square root. For example, 50/50 in assets with 20% and 30% volatility and a correlation of 0.2 gives σ_p² = 0.01 + 0.0225 + 0.006 = 0.0385, so σ_p ≈ 19.6%: below the 25% weighted average and even below the less volatile asset.

### Can diversification eliminate all risk?

Only in special cases, such as two assets with a correlation of −1. In a large portfolio the firm-specific risk averages out, but the risk common to all assets, market or systematic risk, remains however many assets you hold.

## Learn the theory

- [Diversification and correlation](https://quantsandbox.dev/guide/portfolio/diversification): Two-asset portfolios, the role of covariance, and why correlation drives risk down.
- [The efficient frontier and the capital market line](https://quantsandbox.dev/guide/portfolio/efficient-frontier): Mean–variance optimisation, the minimum-variance portfolio, a risk-free asset and the tangency portfolio.
- [Factor models and systematic risk](https://quantsandbox.dev/guide/portfolio/factor-models): The single-index model, splitting systematic from specific variance, and multi-factor models.
- [Value at Risk and expected shortfall](https://quantsandbox.dev/guide/portfolio/risk-measures): Loss quantiles, the tail beyond them, normal versus fat-tailed returns, and the square-root-of-time rule.
- [Portfolio constraints and the no-short-sales frontier](https://quantsandbox.dev/guide/portfolio/portfolio-constraints): Why real portfolios cannot follow the unconstrained frontier: short-sale bans, position limits, and what they cost in Sharpe ratio.

Open the interactive tool: https://quantsandbox.dev/portfolio-lab
