# Monte Carlo Option Pricing Simulator

Price a European option by Monte Carlo: simulate terminal stock prices and watch the estimate and its confidence interval converge to Black–Scholes.

## About this tool

Monte Carlo simulation prices an option by averaging its discounted payoff over many simulated outcomes. This tool simulates terminal stock prices under risk-neutral geometric Brownian motion and shows the estimate and its confidence interval converging towards the Black–Scholes price as the number of paths grows.

## Frequently asked questions

### How fast does a Monte Carlo estimate converge?

The standard error falls like 1/√N: four times as many simulations halve the error.

### Why use Monte Carlo if Black–Scholes has a formula?

Here the formula is the benchmark that shows the method works. Monte Carlo becomes essential for path-dependent payoffs, many underlyings and models without closed-form prices.

### How do you price an option with Monte Carlo simulation?

Simulate many terminal stock prices under the risk-neutral measure, S_T = S₀ exp((r − ½σ²)T + σ√T Z) with Z standard normal, compute the payoff for each, average the payoffs and discount the average at the risk-free rate. The estimate converges to the true price as the number of simulations grows.

### What is the confidence interval of a Monte Carlo price?

The range estimate ± 1.96 × standard error, where the standard error is the sample standard deviation of the discounted payoffs divided by √N. About 95% of such intervals contain the true price, so the interval tells you how many simulations a given accuracy needs.

## Learn the theory

- [Monte Carlo option pricing](https://quantsandbox.dev/guide/stochastic/monte-carlo-pricing): Estimating option prices by simulation: standard error, confidence intervals and convergence to Black–Scholes.
- [Geometric Brownian motion](https://quantsandbox.dev/guide/derivatives/gbm): The standard model for stock prices: the log-normal distribution, its mean and its median.
- [Project risk: sensitivity, scenarios and Monte Carlo NPV](https://quantsandbox.dev/guide/corporate/capital-budgeting-risk): Which inputs move the NPV most, break-even values, scenario analysis and the distribution of NPV from simulation.
- [Random walks and Brownian motion](https://quantsandbox.dev/guide/stochastic/random-walks): The coin-flip walk, variance that grows linearly in time, and its limit: Brownian motion.
- [The law of large numbers and the central limit theorem](https://quantsandbox.dev/guide/stochastic/law-of-large-numbers-clt): Why averages settle down, how fast, and why the normal distribution appears: the two theorems behind Monte Carlo and the Brownian limit.
- [Kolmogorov equations and the Feynman–Kac formula](https://quantsandbox.dev/guide/stochastic/feynman-kac): The generator of a diffusion, the backward equation, and how an expectation becomes the solution of a PDE.
- [Simulating SDEs: the Euler–Maruyama scheme](https://quantsandbox.dev/guide/stochastic/sde-simulation): Discretising a stochastic differential equation, strong and weak error, step size, and checking against the exact GBM solution.
- [Correlated Brownian motions and multi-asset models](https://quantsandbox.dev/guide/stochastic/correlated-brownian-motions): Building correlated Brownian motions with a Cholesky factor, the two-dimensional Itô rule, and where correlation enters Heston and basket pricing.
- [Jumps and the Merton jump-diffusion model](https://quantsandbox.dev/guide/stochastic/jump-diffusion): The Poisson process, compound jumps, the Merton model, and how jumps create fat tails and a smile.
- [Exotic options: barriers, Asians and digitals](https://quantsandbox.dev/guide/derivatives/exotic-options): Path-dependent payoffs, the effect of a knock-out barrier and of averaging, and why Monte Carlo is the natural tool.

Open the interactive tool: https://quantsandbox.dev/monte-carlo
