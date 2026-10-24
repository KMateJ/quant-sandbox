# Binomial Option Pricing Tree Calculator

Price options on an interactive binomial tree: risk-neutral probabilities, backward induction and the replicating portfolio at every node.

## About this tool

The binomial model prices an option by letting the underlying move up or down by fixed factors over discrete steps. Working backwards from the payoffs at expiry with risk-neutral probabilities gives the option value at every node. This interactive tree also shows the replicating portfolio of stock and bond that reproduces the option at each step.

## Frequently asked questions

### What is the risk-neutral probability?

It is the probability q = (1 + r − d) / (u − d) under which the expected return of the stock equals the risk-free rate. It is not a forecast; it is the weight that makes discounted prices consistent with no arbitrage.

### How does the binomial tree relate to Black–Scholes?

As the number of steps grows and the up and down factors are chosen to match the volatility, the binomial price of a European option converges to the Black–Scholes price.

## Learn the theory

- [The one-step binomial model](https://quantsandbox.dev/guide/derivatives/one-step-binomial): The stock moves up or down; replicating a call with stock and a bond.
- [Risk-neutral probabilities](https://quantsandbox.dev/guide/derivatives/risk-neutral): The replication price as a discounted expectation with weights q; the roles of P and Q.
- [Multi-step trees and backward induction](https://quantsandbox.dev/guide/derivatives/multi-step-trees): Recombining trees, the CRR parametrisation, pricing node by node and convergence to Black–Scholes.
- [American options and early exercise](https://quantsandbox.dev/guide/derivatives/american-options): Early exercise in a tree, why calls without dividends are never exercised early, the early-exercise premium of a put and the exercise boundary.
- [Callable bonds and negative convexity](https://quantsandbox.dev/guide/fixed-income/callable-bonds): The issuer's call option, price compression near the call price, yield to call and negative convexity.

Open the interactive tool: https://quantsandbox.dev/binomial
