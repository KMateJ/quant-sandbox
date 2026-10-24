# Itô's Lemma Visualized: the −½σ² Drift Correction

See Itô's lemma at work on log prices: why the log of geometric Brownian motion drifts at μ − ½σ² instead of μ.

## About this tool

Itô's lemma is the chain rule of stochastic calculus. Applied to the logarithm of geometric Brownian motion, it shows that log prices drift at μ − ½σ², not μ. This visualization makes that −½σ² correction visible and explains where it comes from: the quadratic variation of Brownian motion.

## Frequently asked questions

### Why does Itô's lemma have an extra term?

Brownian increments are of size √dt, so (dW)² behaves like dt and does not vanish. The second-order Taylor term ½f″σ²dt therefore survives, unlike in ordinary calculus.

### What is the −½σ² term in practice?

It is the gap between the arithmetic mean return μ and the growth rate of a typical path. Higher volatility lowers the long-run growth of a single investment even when the mean return is unchanged.

### What is an Itô process?

A process of the form dX = a(t, X) dt + b(t, X) dW: a drift term plus a term driven by Brownian motion. Brownian motion with drift, geometric Brownian motion and mean-reverting interest rate models are all Itô processes, and Itô's lemma tells you how any smooth function of one evolves.

### How do you apply Itô's lemma to ln S?

For f(S) = ln S, f′ = 1/S and f″ = −1/S². With dS = μS dt + σS dW, Itô's lemma gives d(ln S) = (μ − ½σ²) dt + σ dW, so the log price is a Brownian motion with drift μ − ½σ².

## Learn the theory

- [Itô's lemma](https://quantsandbox.dev/guide/stochastic/ito-lemma): Quadratic variation, the chain rule for Brownian motion, and the −½σ² drift of the log price.
- [Random walks and Brownian motion](https://quantsandbox.dev/guide/stochastic/random-walks): The coin-flip walk, variance that grows linearly in time, and its limit: Brownian motion.
- [The Itô integral](https://quantsandbox.dev/guide/stochastic/ito-integral): Simple integrands, the Itô isometry, the martingale property and the derivation of ∫W dW = (W² − t)/2.
- [Mean reversion: Ornstein–Uhlenbeck and Vasicek](https://quantsandbox.dev/guide/stochastic/mean-reversion): A process pulled toward a long-run level, its exact solution and stationary distribution, and the short rate in the Vasicek model.

Open the interactive tool: https://quantsandbox.dev/ito-process
