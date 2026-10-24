# Black–Scholes Calculator & Option Greeks Visualizer

Price European calls and puts with the Black–Scholes formula and visualize delta, gamma, vega and theta across stock prices and maturities, in 2D and 3D.

## About this tool

The Black–Scholes formula gives the price of a European call or put from the stock price, strike, time to maturity, interest rate and volatility. This visualizer plots the price and the Greeks — delta, gamma, vega and theta — across stock prices and maturities, in 2D curves and a 3D surface, so you can see how sensitivities change as an option moves in or out of the money.

## Frequently asked questions

### What do the option Greeks measure?

Delta is the price change per unit move in the stock, gamma is how fast delta changes, vega is the sensitivity to volatility and theta is the value lost as time passes, all else equal.

### Why is gamma largest near the strike?

Close to expiry an at-the-money option is about to become either worthless or a share-like payoff, so its delta swings fastest there. Far in or out of the money, delta is already near 1 or 0 and barely moves.

## Learn the theory

- [The Black–Scholes formula](https://quantsandbox.dev/guide/derivatives/toward-black-scholes): How the formula is obtained, what d₁ and d₂ mean, and what the model leaves out.
- [Delta and hedging](https://quantsandbox.dev/guide/derivatives/delta-hedging): Delta as a sensitivity and as a hedge ratio; gamma and the error from discrete rebalancing.
- [Put–call parity](https://quantsandbox.dev/guide/derivatives/put-call-parity): Two portfolios with the same payoff give a model-free link between call and put prices.
- [Kolmogorov equations and the Feynman–Kac formula](https://quantsandbox.dev/guide/stochastic/feynman-kac): The generator of a diffusion, the backward equation, and how an expectation becomes the solution of a PDE.
- [Multi-step trees and backward induction](https://quantsandbox.dev/guide/derivatives/multi-step-trees): Recombining trees, the CRR parametrisation, pricing node by node and convergence to Black–Scholes.
- [The Greeks: gamma, vega, theta and rho](https://quantsandbox.dev/guide/derivatives/greeks): How an option's value responds to the stock, volatility, time and rates; gamma and theta as two sides of hedging.
- [Options on dividend-paying stocks, indices, currencies and futures](https://quantsandbox.dev/guide/derivatives/options-on-other-underlyings): Black–Scholes with a continuous yield, the forward price as the common thread, Black-76 for futures and Garman–Kohlhagen for currencies.
- [Implied volatility and the volatility smile](https://quantsandbox.dev/guide/derivatives/implied-volatility): Inverting Black–Scholes for σ, vega, and what the smile and the term structure say about the model.
- [Static replication: Breeden–Litzenberger and Carr–Madan](https://quantsandbox.dev/guide/derivatives/static-replication): The risk-neutral density from call prices, and building any payoff from bonds, forwards and options.

Open the interactive tool: https://quantsandbox.dev/black-scholes
