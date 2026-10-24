# Delta Hedging Simulator for Options

Simulate discrete delta hedging of a call option: a replicating portfolio tracks the option value, rebalanced along a simulated stock path, with the residual hedge error.

## About this tool

Delta hedging replicates an option by holding delta shares of the stock and a cash position, rebalanced as the price moves. This simulator follows a call option along a simulated stock path and compares the hedging portfolio with the option value, showing the hedge error that remains when you can only rebalance at discrete times.

## Frequently asked questions

### Why does a delta hedge not work perfectly?

Delta changes continuously, but a real hedge is only adjusted at discrete times. Between rebalances the option's curvature (gamma) creates a gain or loss that the linear stock position cannot match.

### What happens if I rebalance more often?

The hedge error shrinks. In the Black–Scholes model, with continuous rebalancing it would vanish, which is exactly the argument that gives the Black–Scholes price.

## Learn the theory

- [Delta and hedging](https://quantsandbox.dev/guide/derivatives/delta-hedging): Delta as a sensitivity and as a hedge ratio; gamma and the error from discrete rebalancing.
- [Multi-step trees and backward induction](https://quantsandbox.dev/guide/derivatives/multi-step-trees): Recombining trees, the CRR parametrisation, pricing node by node and convergence to Black–Scholes.
- [The Greeks: gamma, vega, theta and rho](https://quantsandbox.dev/guide/derivatives/greeks): How an option's value responds to the stock, volatility, time and rates; gamma and theta as two sides of hedging.

Open the interactive tool: https://quantsandbox.dev/delta-hedging
