# Heston Stochastic Volatility Model Simulator

Simulate the Heston model: mean-reverting stochastic variance, vol-of-vol and correlation, with sample paths and Monte Carlo option pricing.

## About this tool

The Heston model lets volatility itself be random: the variance follows a mean-reverting square-root process that is correlated with the stock price. This simulator shows sample paths of price and variance, the effect of mean reversion speed, long-run variance, vol-of-vol and correlation, and prices a European option by Monte Carlo.

## Frequently asked questions

### Why use stochastic volatility instead of Black–Scholes?

Market option prices imply different volatilities for different strikes (the volatility smile and skew). A random, correlated volatility produces fatter tails and skew, which a single constant volatility cannot.

### What does the correlation parameter ρ do?

A negative ρ makes volatility rise when the price falls, the typical equity pattern. It skews the return distribution to the left and steepens the implied volatility skew.

## Learn the theory

- [The Black–Scholes formula](https://quantsandbox.dev/guide/derivatives/toward-black-scholes): How the formula is obtained, what d₁ and d₂ mean, and what the model leaves out.
- [Geometric Brownian motion](https://quantsandbox.dev/guide/derivatives/gbm): The standard model for stock prices: the log-normal distribution, its mean and its median.
- [Correlated Brownian motions and multi-asset models](https://quantsandbox.dev/guide/stochastic/correlated-brownian-motions): Building correlated Brownian motions with a Cholesky factor, the two-dimensional Itô rule, and where correlation enters Heston and basket pricing.
- [Jumps and the Merton jump-diffusion model](https://quantsandbox.dev/guide/stochastic/jump-diffusion): The Poisson process, compound jumps, the Merton model, and how jumps create fat tails and a smile.
- [Implied volatility and the volatility smile](https://quantsandbox.dev/guide/derivatives/implied-volatility): Inverting Black–Scholes for σ, vega, and what the smile and the term structure say about the model.
- [Stochastic volatility and the Heston model](https://quantsandbox.dev/guide/derivatives/stochastic-volatility): The Heston variance process, mean reversion, vol-of-vol, the Feller condition, and how correlation and vol-of-vol shape the smile.

Open the interactive tool: https://quantsandbox.dev/heston
