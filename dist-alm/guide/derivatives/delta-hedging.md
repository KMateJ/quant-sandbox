# Delta Hedging Explained: Delta, Gamma and Rebalancing

Delta as a sensitivity and as a hedge ratio; gamma and the error from discrete rebalancing. Free interactive lesson with worked examples.

In "The one-step binomial model" the number of shares $\Delta$ in the replicating portfolio appeared as the solution of two equations. This lesson shows that $\Delta$ is also a sensitivity: how much the option value changes when the stock price moves. That reading turns replication into a practical tool, **hedging**, and leads to a second sensitivity, gamma, which measures how well a hedge holds up. It builds on "Multi-step trees and backward induction".

## Delta in a tree

Take one node of a binomial tree. From the current stock price $S$ the stock moves to $S_u = uS$ or $S_d = dS$, and the call is then worth $C_u$ or $C_d$. The replicating portfolio holds $\Delta$ shares, with

$$
\Delta = \frac{C_u - C_d}{S_u - S_d}.
$$

This is a ratio of changes: change in option value divided by change in stock price. In the worked example of the one-step lesson ($S_0 = 100$, $u = 1.2$, $d = 0.9$, $K = 100$) the call pays 20 or 0 and the stock ends at 120 or 90, so $\Delta = 20/30 \approx 0.667$. Each unit of stock movement moves the option by about two thirds of a unit.

## Delta as a derivative

Let the time step $\Delta t$ shrink, as in the multi-step trees. The two prices $S_u$ and $S_d$ move closer to $S$, and the difference quotient above becomes a derivative. Write $C(S, t)$ for the option value as a function of the current stock price and time. Then

$$
\Delta = \frac{\partial C}{\partial S}.
$$

Geometrically, $\Delta$ is the **slope** of the curve $S \mapsto C(S,t)$ at today's price. For a call this curve is increasing and convex: deep out of the money it is flat (the option is nearly worthless whatever the stock does), deep in the money it runs parallel to the line $S - Ke^{-rT}$. So the delta of a call always lies between 0 and 1:

$$
0 \le \Delta_{\text{call}} \le 1.
$$

A put has delta between $-1$ and $0$, because its value falls when the stock rises.

## The hedged portfolio

Suppose you own one call and want to remove your exposure to small stock moves. Sell $\Delta$ shares short. The combined position is

$$
\Pi = C - \Delta S.
$$

Over a short interval the stock changes by $dS$. To first order, the call changes by $\Delta\,dS$ and the short stock position changes by $-\Delta\,dS$, so

$$
d\Pi \approx \Delta\,dS - \Delta\,dS = 0.
$$

A position with zero first-order sensitivity to the stock is called **delta-neutral**. This is the replicating portfolio of the tree lessons read the other way round: instead of building the option from stock and bond, you cancel the option's stock exposure with stock.

> Delta $\Delta = \partial C/\partial S$ is the number of shares that replicates the option locally. Holding $C - \Delta S$ removes exposure to small stock moves.

## Gamma and the hedge error

The cancellation above is only first-order. A Taylor expansion of $C$ in $S$, ignoring the passage of time over the short interval, gives

$$
C(S + dS) \approx C(S) + \Delta\,dS + \tfrac{1}{2}\,\Gamma\,(dS)^2, \qquad \Gamma = \frac{\partial^2 C}{\partial S^2}.
$$

**Gamma** $\Gamma$ is the curvature of the value curve: how fast delta itself changes when $S$ moves. Substituting into the hedged portfolio, the linear terms cancel and what remains is

$$
d\Pi \approx \tfrac{1}{2}\,\Gamma\,(dS)^2.
$$

For a long call $\Gamma > 0$, so the hedged position gains a little on any large move, up or down. The error grows with the square of the move: double the move and the error is four times larger. Gamma is largest for options near the money and close to maturity, where the value curve bends most sharply.

The figure plots the call value against $S$ (with $K = 100$, $r = 5\%$) together with the tangent line at the current price $S_0$; the tangent's slope is $\Delta$. The dashed line is the payoff at maturity. The vertical gap between curve and tangent is exactly the hedge error; the readouts show it for a move of 10 up and 10 down. Move $S_0$ and watch $\Delta$ run from near 0 to near 1; shorten $T$ or lower $\sigma$ and note that the curve hugs the payoff more tightly, the bend at $K$ sharpens and $\Gamma$ near the strike rises.

*[Interactive figure: delta tangent](https://quantsandbox.dev/guide/derivatives/delta-hedging)*

## A worked example

Take $S_0 = 100$, $K = 100$, $r = 5\%$, $\sigma = 20\%$, $T = 1$. The call is worth about 10.45, with $\Delta \approx 0.637$ and $\Gamma \approx 0.0188$. A dealer who sold 100 calls hedges by buying about 63.7 shares.

If the stock jumps to 110, the tangent predicts a call value of $10.45 + 0.637 \cdot 10 \approx 16.82$, while the true value is about 17.66. The gap is about 0.84 per call. For a drop to 90 the gap is about 1.01. The gamma estimate gives $\tfrac{1}{2} \cdot 0.0188 \cdot 10^2 \approx 0.94$, between the two. For a move of only 1 the error is about 0.009, a hundred times smaller, as the square law predicts.

### Worked example: One rebalancing step after a move to 102

1. Start from the same call ($S_0 = K = 100$, $r = 5\%$, $\sigma = 20\%$, $T = 1$), held long and hedged by shorting $\Delta = N(d_1)$ shares:
   $$\Delta = N(0.35)$$ → **0.6368**
2. Gamma at the same point:
   $$\Gamma = \frac{\varphi(d_1)}{S_0\,\sigma\sqrt{T}}$$ → **0.01876**
3. The stock jumps to 102. The gamma term predicts the gain of the hedged position:
   $$\tfrac{1}{2}\,\Gamma\,(dS)^2 = \tfrac{1}{2} \cdot 0.01876 \cdot 2^2$$ → **0.0375**
4. Repricing the call exactly at 102 and subtracting the stock leg gives nearly the same:
   $$C(102) - C(100) - \Delta \cdot 2$$ → **0.0368**
5. The new delta is higher, so the hedge must be rebalanced by shorting more shares:
   $$N\!\left(\frac{\ln 1.02 + 0.07}{0.2}\right)$$ → **0.6733**

## Rebalancing

Delta changes whenever $S$ or $t$ changes, so a hedge set up today is only correct today. Keeping the position delta-neutral means **rebalancing**: recomputing $\Delta$ and adjusting the share holding at regular intervals. In the tree this happens at every node, which is exactly what backward induction prescribes.

In practice rebalancing is discrete, say once a day. Between rebalances the stock moves by a finite amount and the hedge error $\tfrac{1}{2}\Gamma(dS)^2$ accumulates. Rebalancing more often makes each error smaller (it is proportional to the square of the stock move), but trading costs grow with the number of trades. Think of steering a car: small, frequent corrections keep you in the lane, but each one costs a little effort. Perfect replication, as assumed in option pricing, corresponds to continuous rebalancing with no trading costs.

## A simulated hedge

The figure follows a short call over three months ($S_0 = K = 100$, $\sigma = 20\%$, $r = 5\%$) along one simulated path. The hedged book holds $\Delta$ shares and rebalances every 1, 5 or 21 trading days; the unhedged book only holds the premium. Press Play to watch both evolve day by day. The unhedged result swings with the stock, while the hedged one stays close to zero. The readouts give the spread of the final result over 200 paths: it grows roughly with the square root of the rebalancing interval, as the $\tfrac12\Gamma(dS)^2$ error suggests.

*[Interactive figure: hedge simulation](https://quantsandbox.dev/guide/derivatives/delta-hedging)*

## Summary

- In a tree, $\Delta = (C_u - C_d)/(S_u - S_d)$ is both the replicating share holding and the sensitivity of the option to the stock.
- In the continuous limit $\Delta = \partial C/\partial S$, the slope of the value curve; for a call $0 \le \Delta \le 1$.
- The portfolio $C - \Delta S$ is delta-neutral; its remaining change is $\tfrac{1}{2}\Gamma(dS)^2$, with gamma the curvature.
- Hedges must be rebalanced; discrete rebalancing leaves an error of about $\tfrac{1}{2}\Gamma(dS)^2$ per interval, which shrinks as the intervals get shorter.

> The next lessons replace the tree with a continuous model of the stock. In that model delta of a call has a closed form, $N(d_1)$.

[Run a delta hedge step by step in the Delta Hedging lab](https://quantsandbox.dev/delta-hedging)

## Interactive labs

- [Delta Hedging Simulator for Options](https://quantsandbox.dev/delta-hedging)
- [Black–Scholes Calculator & Option Greeks Visualizer](https://quantsandbox.dev/black-scholes)

## Practice questions

### 1. A dealer has sold 100 calls, each with delta $\Delta = 0.6$. How many shares must she buy to be delta-neutral?

**Answer:** 60

The short calls have a total delta of $-100 \cdot 0.6 = -60$, so buying 60 shares brings the position to zero delta.

### 2. What is the sign of gamma for a long call?

- a) Positive
- b) Negative
- c) Zero
- d) Positive below the strike, negative above it

**Answer:** a) Positive

The value curve of a call is convex in $S$, so its second derivative $\Gamma$ is positive everywhere. The delta-hedged long call therefore gains on large moves either way.

---

Source: https://quantsandbox.dev/guide/derivatives/delta-hedging

Previous lesson: [American Options and Early Exercise in Binomial Trees](https://quantsandbox.dev/guide/derivatives/american-options)

Next lesson: [Geometric Brownian Motion: The Stock Price Model](https://quantsandbox.dev/guide/derivatives/gbm)
