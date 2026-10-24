# Option Greeks Explained: Gamma, Vega, Theta and Rho

How an option's value responds to the stock, volatility, time and rates; gamma and theta as two sides of hedging. Free interactive lesson with worked examples.

"Delta and hedging" measured how an option's value responds to the stock price and showed that a delta hedge leaves a residual governed by gamma. The stock price is not the only input that moves. Time passes, volatility changes and interest rates shift. This lesson defines one sensitivity for each input, the **Greeks**, and shows that two of them, gamma and theta, are tied together by the requirement that a hedged position earns the risk-free rate.

## Option value as a function of its inputs

Write $V(S, t, \sigma, r)$ for the value of an option (a call or a put with strike $K$ and maturity date $T$) when the stock price is $S$, the current date is $t$, the volatility is $\sigma$ and the risk-free rate is $r$. The previous lesson, "The Black–Scholes formula", gave $V$ in closed form for a European call and put. This lesson asks how that value responds when each input moves, which is what its partial derivatives measure. All numbers in this lesson are computed with that formula.

Each Greek is the partial derivative of $V$ with respect to one input, holding the others fixed:

$$
\Delta = \frac{\partial V}{\partial S}, \quad \Gamma = \frac{\partial^2 V}{\partial S^2}, \quad \Theta = \frac{\partial V}{\partial t}, \quad \mathcal{V} = \frac{\partial V}{\partial \sigma}, \quad \rho = \frac{\partial V}{\partial r}.
$$

Vega is not a Greek letter; we write it as $\mathcal{V}$. Theta is the change as calendar time $t$ advances, so the remaining time to maturity $T - t$ shrinks.

## Delta and gamma

Delta, from "Delta and hedging", is the slope of the value curve $S \mapsto V$: the number of shares that replicates the option locally. It is dimensionless (shares per option); a call has $0 \le \Delta \le 1$, a put $-1 \le \Delta \le 0$.

Gamma is the curvature of the same curve, the rate at which delta changes when $S$ moves. Its unit is one over the price unit: $\Gamma = 0.02$ means delta rises by about 0.02 for each unit rise in $S$. A long call or put has $\Gamma > 0$. Put–call parity, $C - P = S - Ke^{-r(T-t)}$, shows that a call and a put with the same strike have the same gamma, because the right-hand side is linear in $S$.

Gamma is largest near the strike and grows as maturity approaches. Close to maturity the value curve approaches the kinked payoff $(S - K)^+$, which is flat on one side of $K$ and has slope 1 on the other. The whole change in slope then happens in a narrow region around $K$, so the curvature there becomes large, while far from $K$ it goes to zero.

## Vega

Vega measures the change in value when volatility changes. Since $\sigma$ is a number like 0.25, a change of 1 in $\sigma$ is enormous, so vega is usually quoted per percentage point: $\mathcal{V}/100$ is the value change when $\sigma$ goes from 25% to 26%.

For both calls and puts $\mathcal{V} > 0$: options are **long volatility**. The reason is the shape of the payoff. Higher volatility spreads the possible values of $S_T$ further in both directions. For a call, the extra upside raises the payoff without limit, while the extra downside costs nothing once $S_T < K$, because the payoff is floored at 0. A convex payoff gains on average from more dispersion. By put–call parity, call and put have the same vega, since $S - Ke^{-r(T-t)}$ does not depend on $\sigma$.

## Theta and rho

Theta is the change in value per unit of calendar time, with everything else fixed. It is quoted per year, and dividing by 365 gives the change per day. For a long call $\Theta < 0$: as maturity approaches, there is less time for the stock to move in the holder's favour, and the value decays towards the payoff. This is **time decay**. A deep in-the-money put can have positive theta, because waiting brings the strike payment closer and its discounted value rises.

Rho is the change in value when $r$ changes, quoted per percentage point like vega. A call has $\rho > 0$: the holder pays $K$ only at maturity, and a higher rate lowers the present value $Ke^{-r(T-t)}$ of that payment. A put has $\rho < 0$ for the same reason. For short-dated equity options rho is usually the least important Greek.

## The Taylor expansion of the option value

Over a short interval $dt$ the inputs change by $dS$, $d\sigma$ and $dr$. Expanding $V$ to second order in $S$ and first order in the other inputs gives

$$
dV \approx \Delta\,dS + \tfrac{1}{2}\,\Gamma\,(dS)^2 + \Theta\,dt + \mathcal{V}\,d\sigma + \rho\,dr.
$$

The term $(dS)^2$ is kept because stock moves over a short interval are of order $\sqrt{dt}$, as in "Random walks and Brownian motion", so $(dS)^2$ is of order $dt$, the same size as the theta term. Squares of the other changes are much smaller and are dropped.

## Gamma against theta in a hedged position

Hold one option and short $\Delta$ shares, and finance the position at the risk-free rate, so its net value $V - \Delta S$ earns $r$. Over $dt$ with $\sigma$ and $r$ fixed, the $\Delta\,dS$ terms cancel and the profit in excess of interest is

$$
d\Pi - r(V - \Delta S)\,dt \approx \tfrac{1}{2}\,\Gamma\,(dS)^2 + \big(\Theta - rV + rS\Delta\big)\,dt.
$$

Now make one modelling assumption: over a short interval the stock return $dS/S$ has variance $\sigma^2 dt$, so $(dS)^2$ equals $\sigma^2 S^2 dt$ on average. A hedged position whose expected excess profit is not zero would be a riskless gain or loss as the hedge is rebalanced continuously, which no-arbitrage rules out. Setting the excess profit to zero when $(dS)^2 = \sigma^2 S^2 dt$ gives

$$
\Theta + \tfrac{1}{2}\,\sigma^2 S^2\,\Gamma + rS\,\Delta - rV = 0.
$$

This is the Black–Scholes equation, stated here as the condition that a delta-hedged option earns exactly the risk-free rate. Substituting it back, the hedged profit over $dt$ becomes

$$
\text{P\&L} \approx \tfrac{1}{2}\,\Gamma\,\big((dS)^2 - \sigma^2 S^2\,dt\big).
$$

Gamma and theta are two sides of one trade-off. A long option position has $\Gamma > 0$ and gains on every large move, whatever its direction, and it pays for this through theta every day. It profits when the realised squared move exceeds $\sigma^2 S^2 dt$ and loses when the stock moves less. The seller of the option holds the opposite position: steady theta income, losses on large moves.

> For a delta-hedged option, $\Theta + \tfrac{1}{2}\sigma^2 S^2 \Gamma + rS\Delta - rV = 0$. Positive gamma is paid for with negative theta; the hedge breaks even when the stock moves by about $\sigma S\sqrt{dt}$.

## A worked example

Take a call with $S = 100$, $K = 100$, $T - t = 0.5$ years, $r = 5\%$ and $\sigma = 25\%$. The Black–Scholes formula gives a value of $V \approx 8.26$ and

- $\Delta \approx 0.591$ and $\Gamma \approx 0.0220$;
- $\mathcal{V} \approx 27.47$, that is 0.275 per percentage point of $\sigma$;
- $\Theta \approx -9.41$ per year, that is $-9.41/365 \approx -0.0258$ per day;
- $\rho \approx 25.41$, that is 0.254 per percentage point of $r$.

Check the relation: $\tfrac{1}{2}\sigma^2 S^2 \Gamma = \tfrac{1}{2} \cdot 0.0625 \cdot 10\,000 \cdot 0.02198 \approx 6.87$, $rS\Delta \approx 2.95$ and $rV \approx 0.41$, so $-9.41 + 6.87 + 2.95 - 0.41 = 0$.

Now let one day pass while the stock rises to 102 and volatility rises to 26%. The expansion predicts $0.591 \cdot 2 + \tfrac{1}{2} \cdot 0.0220 \cdot 4 - 0.0258 + 0.275 \approx 1.475$; repricing with the formula gives a change of 1.470. For the delta-hedged position (with $\sigma$ unchanged) the break-even daily move is $\sigma S \sqrt{1/365} \approx 1.31$. A move of 2 gives $\tfrac{1}{2} \cdot 0.0220 \cdot (4 - 1.71) \approx 0.025$ per option; a move smaller than 1.31 gives a loss.

### Worked example: One Greek at a time, against exact repricing

1. Same call, value 8.26. Volatility alone goes from 25% to 26%; vega predicts
   $$\mathcal{V}\,d\sigma = 27.47 \cdot 0.01$$ → **0.2747**
2. Repricing at $\sigma = 26\%$ gives almost the same change, because the price is nearly linear in $\sigma$ at the money:
   $$V(26\%) - V(25\%)$$ → **0.2748**
3. Now only one day passes, with $S$ and $\sigma$ fixed. Theta predicts
   $$\Theta\,dt = -9.41 / 365$$ → **-0.0258**
4. Repricing with $T - t = 0.5 - 1/365$:
   $$V(0.5 - \tfrac{1}{365}) - V(0.5)$$ → **-0.0258**

## The Greeks across stock prices

The figure plots one Greek of the call at a time against the stock price $S$ from 40 to 160, with $K = 100$ and $r = 5\%$ fixed. A switch selects delta, gamma, vega or theta, and sliders set the time to maturity $T$ (0.05 to 2 years) and the volatility $\sigma$. The readouts at $S = 100$ show delta, gamma, vega, theta and the value of $\Theta + \tfrac{1}{2}\sigma^2 S^2 \Gamma + rS\Delta - rV$, which stays at zero for every setting. Select gamma and shrink $T$: the peak at the strike grows sharply (from about 0.010 at $T = 2$ to 0.071 at $T = 0.05$ with $\sigma = 25\%$) while theta at the strike falls from $-9.41$ to about $-24.8$ per year. Then select vega and note that it is largest near the strike and grows with $T$.

*[Interactive figure: greeks profile](https://quantsandbox.dev/guide/derivatives/greeks)*

## Summary

- The Greeks are partial derivatives of the option value: $\Delta$ and $\Gamma$ in $S$, $\Theta$ in time, vega $\mathcal{V}$ in $\sigma$, $\rho$ in $r$.
- Gamma is the curvature of the value curve; it peaks near the strike and grows as maturity approaches. Calls and puts with the same strike share gamma and vega.
- Options are long volatility ($\mathcal{V} > 0$) because the payoff is convex; a long call loses value with time ($\Theta < 0$).
- To second order, $dV \approx \Delta\,dS + \tfrac{1}{2}\Gamma(dS)^2 + \Theta\,dt + \mathcal{V}\,d\sigma$.
- A delta-hedged option earns $\tfrac{1}{2}\Gamma((dS)^2 - \sigma^2S^2dt)$; requiring it to earn the risk-free rate gives $\Theta + \tfrac{1}{2}\sigma^2S^2\Gamma + rS\Delta - rV = 0$.

> A later lesson, "Implied volatility and the volatility smile", turns the question around: given a market price, which $\sigma$ does the formula need, and why does that number depend on the strike.

[Explore the Greek surfaces across stock price and maturity in the Black–Scholes lab](https://quantsandbox.dev/black-scholes)

## Interactive labs

- [Black–Scholes Calculator & Option Greeks Visualizer](https://quantsandbox.dev/black-scholes)
- [Delta Hedging Simulator for Options](https://quantsandbox.dev/delta-hedging)

## Practice questions

### 1. You hold an at-the-money European call. If nothing else changes, what happens to its value as one day passes?

- a) It falls: theta is negative
- b) It rises: theta is positive
- c) It stays the same: theta is zero
- d) It depends on the sign of gamma

**Answer:** a) It falls: theta is negative

A long call loses time value as maturity approaches, so $\Theta < 0$. At the money the decay is fastest, because that is where the value sits furthest above the payoff.

### 2. For the call above ($S = K = 100$, $T - t = 0.5$, $r = 5\%$, $\sigma = 25\%$), by how much does the value change, to first order, when $\sigma$ rises by one percentage point?

**Answer:** 0.275

Vega is $\mathcal{V} = S\varphi(d_1)\sqrt{T - t} \approx 27.47$ per unit of $\sigma$. One point is $d\sigma = 0.01$, so the change is about $0.275$.

---

Source: https://quantsandbox.dev/guide/derivatives/greeks

Previous lesson: [Black–Scholes Formula Explained: d1, d2 and N(d2)](https://quantsandbox.dev/guide/derivatives/toward-black-scholes)

Next lesson: [Black-76 and Garman–Kohlhagen Option Pricing](https://quantsandbox.dev/guide/derivatives/options-on-other-underlyings)
