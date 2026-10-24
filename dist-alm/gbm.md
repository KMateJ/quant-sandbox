# Geometric Brownian Motion (GBM) Simulator

Simulate geometric Brownian motion, the stock price model behind Black–Scholes: drift, volatility, sample paths and the theoretical expected value.

## About this tool

Geometric Brownian motion is the standard model for stock prices and the foundation of the Black–Scholes model. Prices change by random percentages rather than random amounts, so they stay positive and are lognormally distributed. This simulator shows sample paths for a given drift and volatility together with the theoretical expected value S₀e^{μt}.

## Frequently asked questions

### Why is GBM used for stock prices?

It keeps prices positive and makes returns, not price changes, the random quantity, matching the idea that a stock is as likely to rise 10% whether it trades at 10 or 100.

### Why is the typical path below the expected value?

The lognormal distribution is skewed: a few very high outcomes pull the mean up, while the median path grows only at μ − ½σ².

### What is the formula for geometric Brownian motion?

The price follows dS = μS dt + σS dW, whose solution is S_t = S₀ exp((μ − ½σ²)t + σW_t). The log price is therefore normally distributed with mean ln S₀ + (μ − ½σ²)t and variance σ²t, and the price itself is lognormal.

### What are the drawbacks of GBM as a stock price model?

It assumes constant volatility and normally distributed log returns. Real returns have fatter tails, sudden jumps and volatility that changes over time and rises in sell-offs, which is why stochastic volatility models such as Heston and jump-diffusion models extend it.

## Learn the theory

- [Geometric Brownian motion](https://quantsandbox.dev/guide/derivatives/gbm): The standard model for stock prices: the log-normal distribution, its mean and its median.
- [Returns and volatility](https://quantsandbox.dev/guide/portfolio/returns-volatility): Simple and log returns, standard deviation, annualising and the square-root-of-time rule.
- [Change of measure and Girsanov's theorem](https://quantsandbox.dev/guide/stochastic/change-of-measure): Reweighting probabilities with a density, equivalent measures, Girsanov's theorem and the market price of risk.
- [Monte Carlo option pricing](https://quantsandbox.dev/guide/stochastic/monte-carlo-pricing): Estimating option prices by simulation: standard error, confidence intervals and convergence to Black–Scholes.
- [Simulating SDEs: the Euler–Maruyama scheme](https://quantsandbox.dev/guide/stochastic/sde-simulation): Discretising a stochastic differential equation, strong and weak error, step size, and checking against the exact GBM solution.

Open the interactive tool: https://quantsandbox.dev/gbm
