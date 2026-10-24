# Option Payoff Diagram & Strategy Builder

Build option strategies and see payoff and profit diagrams instantly: calls, puts, covered calls, spreads, straddles, strangles, butterflies and synthetic forwards.

## About this tool

An option payoff diagram shows what a position is worth at expiry for every possible price of the underlying. This strategy builder lets you combine calls, puts, stock, forwards and cash, then plots the payoff and the profit after premiums. Start from presets such as covered calls, protective puts, bull and bear spreads, straddles, strangles and butterflies, or build your own multi-leg strategy.

## Frequently asked questions

### What is the difference between payoff and profit?

Payoff is the value of the position at expiry. Profit subtracts what you paid to open it (option premiums) and adds what you received for options you sold, so the profit line is the payoff line shifted by the net premium.

### How can two different strategies have the same payoff?

Put–call parity: a long call plus a short put with the same strike behaves exactly like a forward. Combinations with identical payoffs must cost the same today, otherwise there would be an arbitrage.

## Learn the theory

- [Forwards, calls and puts](https://quantsandbox.dev/guide/derivatives/instruments): What a derivative is; payoffs of forwards, calls and puts at maturity; long and short positions.
- [Combining positions](https://quantsandbox.dev/guide/derivatives/strategies): Payoffs add up: spreads, straddles, strangles, butterflies and the synthetic forward.
- [Arbitrage and the forward price](https://quantsandbox.dev/guide/derivatives/no-arbitrage): The law of one price, the cash-and-carry trade and the fair forward price.
- [Put–call parity](https://quantsandbox.dev/guide/derivatives/put-call-parity): Two portfolios with the same payoff give a model-free link between call and put prices.
- [Static replication: Breeden–Litzenberger and Carr–Madan](https://quantsandbox.dev/guide/derivatives/static-replication): The risk-neutral density from call prices, and building any payoff from bonds, forwards and options.
- [Exotic options: barriers, Asians and digitals](https://quantsandbox.dev/guide/derivatives/exotic-options): Path-dependent payoffs, the effect of a knock-out barrier and of averaging, and why Monte Carlo is the natural tool.

Open the interactive tool: https://quantsandbox.dev/payoff
