# Option Strategies: Spreads, Straddles and Butterflies

Payoffs add up: spreads, straddles, strangles, butterflies and the synthetic forward. Free interactive lesson with worked examples.

This lesson combines the contracts from "Forwards, calls and puts" into portfolios. The only new fact is that payoffs add up; everything else follows from it. We keep the same setting: European options on a non-dividend-paying stock, all maturing at the same date $T$.

## Payoffs add

A **portfolio** is a list of positions held at the same time. Suppose it holds $n_1$ units of a contract with payoff $X_1 = f_1(S_T)$, $n_2$ units of a contract with payoff $X_2 = f_2(S_T)$, and so on. A positive $n_i$ is a long position, a negative $n_i$ a short one. At maturity each contract pays independently of the others, so the portfolio pays

$$
X = n_1 f_1(S_T) + n_2 f_2(S_T) + \dots + n_k f_k(S_T).
$$

Graphically, you draw each leg's payoff against $S_T$ and add the lines vertically. Each call or put payoff is made of two straight pieces joined at its strike, so a sum of them is again made of straight pieces, with a kink at every strike that appears in the portfolio.

Besides options and the stock itself (payoff $S_T$) we use a **zero-coupon bond** that pays 1 at $T$. Its payoff is the constant 1 and its price today is the discount factor $e^{-rT}$. Holding $K$ bonds pays $K$ for sure.

## Payoff and profit of a portfolio

The figure in this lesson shows payoffs only. To get the profit, subtract the cost of setting up the portfolio. If the legs cost $V_0$ in total today (premiums paid minus premiums received), the profit at maturity is

$$
\text{profit} = X - V_0\,e^{rT}.
$$

A portfolio with a large payoff is not automatically a good trade: in a well-functioning market a larger payoff costs more today. The examples below use rounded premiums and ignore the small factor $e^{rT}$.

## Spreads

A **bull call spread** buys a call with a low strike $K_1$ and sells a call with a higher strike $K_2$:

$$
X = (S_T - K_1)^+ - (S_T - K_2)^+ = \begin{cases} 0, & S_T \le K_1,\\ S_T - K_1, & K_1 < S_T < K_2,\\ K_2 - K_1, & S_T \ge K_2. \end{cases}
$$

The short call gives away the upside above $K_2$, and in exchange its premium lowers the cost. Example with $K_1 = 95$ and $K_2 = 105$: if the 95 call costs 8 and the 105 call costs 3, the spread costs 5. The payoff is capped at 10, so the profit ranges from $-5$ to $+5$, and the break-even level is $S_T = 100$.

A **bear put spread** is the mirror image: buy a put with the higher strike $K_2$ and sell a put with the lower strike $K_1$. It pays $K_2 - K_1$ when the stock ends below $K_1$ and nothing above $K_2$.

## Straddle and strangle

A **straddle** buys a call and a put with the same strike $K$:

$$
X = (S_T - K)^+ + (K - S_T)^+ = |S_T - K|.
$$

The payoff is a V with its tip at $K$: the position gains from a large move in either direction and is a bet on movement, not on direction. With $K = 100$, a call at 6 and a put at 4, the straddle costs 10, so it makes a profit only if $S_T < 90$ or $S_T > 110$.

A **strangle** buys a put with strike $K_1$ and a call with a higher strike $K_2$. The payoff is zero between the strikes and rises linearly outside them. It is cheaper than a straddle because it needs a larger move to pay anything.

## Butterfly

A **butterfly** with strikes $K_1 < K_2 < K_3$, equally spaced, buys one $K_1$ call, sells two $K_2$ calls and buys one $K_3$ call:

$$
X = (S_T - K_1)^+ - 2\,(S_T - K_2)^+ + (S_T - K_3)^+.
$$

Read it slope by slope. Below $K_1$ no option pays. Between $K_1$ and $K_2$ only the first call pays, slope $+1$. Between $K_2$ and $K_3$ the slope becomes $1 - 2 = -1$. Above $K_3$ it is $1 - 2 + 1 = 0$, and the payoff is back at zero. The result is a tent with its peak $K_2 - K_1$ at $K_2$. With strikes 90, 100, 110 the peak is 10 at $S_T = 100$, and the payoff at $S_T = 95$ is 5.

The butterfly pays only when the stock ends near the middle strike, so it is a bet that the price will stay put, the opposite of a straddle.

### Worked example: The 90/100/110 butterfly

1. At $S_T = 95$ only the 90 call pays.
   $$(95 - 90)^+ - 2\,(95 - 100)^+ + (95 - 110)^+$$ → **5**
2. At $S_T = 100$ the payoff reaches its peak $K_2 - K_1$.
   $$(100 - 90)^+ - 2\,(100 - 100)^+ + (100 - 110)^+$$ → **10**
3. At $S_T = 105$ the two short calls pull the payoff back down.
   $$15 - 2 \cdot 5 + 0$$ → **5**
4. Suppose the 90, 100 and 110 calls cost 13, 6.5 and 2.5. The net cost is
   $$13 - 2 \cdot 6.5 + 2.5$$ → **2.5**
5. The best profit, at $S_T = 100$, is the peak minus the cost.
   $$10 - 2.5$$ → **7.5**

## The synthetic forward

Buy a call and sell a put, both with strike $K$. For any $S_T$ exactly one of the two options pays:

$$
(S_T - K)^+ - (K - S_T)^+ = S_T - K.
$$

If $S_T > K$ the call pays $S_T - K$ and the put is worthless; if $S_T < K$ the call is worthless and the short put pays $-(K - S_T) = S_T - K$. Either way the total is the payoff of a long forward with delivery price $K$. This identity is called a **synthetic forward**; it is the basis of "Put–call parity".

The figure shows each leg's payoff as a thin dashed line and the total as a thick line. Pick the presets one by one and check that the thick line is the vertical sum of the dashed ones. In the synthetic forward the kinks of the two legs cancel and the total is a single straight line.

*[Interactive figure: strategy](https://quantsandbox.dev/guide/derivatives/strategies)*

## Building any piecewise-linear payoff

The examples suggest a general rule. Take any payoff $f(S_T)$ made of straight pieces, with kinks at strikes $K_1 < K_2 < \dots < K_m$. Let $f(0)$ be its value at zero, $a_0$ its slope just to the right of zero, and $c_i$ the change of slope at $K_i$ (slope after minus slope before). Then

$$
f(S_T) = f(0) + a_0\,S_T + \sum_{i=1}^{m} c_i\,(S_T - K_i)^+.
$$

Each term is a traded instrument: $f(0)$ zero-coupon bonds, $a_0$ shares, and $c_i$ calls with strike $K_i$ (a negative number means a short position). The butterfly is the case $f(0) = 0$, $a_0 = 0$, $c = (1, -2, 1)$. Puts are not needed in principle, although they often give a shorter recipe.

> A payoff made of straight pieces can be built exactly from bonds, the stock and calls, with one call position per kink. Its slope changes tell you how many calls to hold at each strike.

## Summary

- The payoff of a portfolio is the sum of its legs' payoffs, drawn by adding the lines vertically.
- Profit is the total payoff minus the net cost of the legs, carried to time $T$.
- Spreads cap gains and losses; straddles and strangles pay for large moves; a butterfly pays when the price stays near the middle strike.
- A long call plus a short put with the same strike pays $S_T - K$, the payoff of a forward.
- Any piecewise-linear payoff can be built from bonds, the stock and calls.

[Assemble multi-leg strategies and see their payoff and profit in the Payoff lab](https://quantsandbox.dev/payoff)

## Interactive labs

- [Option Payoff Diagram & Strategy Builder](https://quantsandbox.dev/payoff)

## Practice questions

### 1. You buy a bull call spread with strikes 100 and 110 for a net premium of 4. What is the largest profit it can make at maturity?

**Answer:** 6

The payoff is capped at $K_2 - K_1 = 10$, reached for $S_T \ge 110$. Subtracting the cost gives $10 - 4 = 6$.

### 2. A straddle with strike $K$ is held to maturity. What does it pay if the stock ends exactly at $S_T = K$?

- a) Nothing: it is the bottom of the V
- b) The call premium
- c) The sum of both premiums
- d) $K$

**Answer:** a) Nothing: it is the bottom of the V

The payoff is $|S_T - K|$, which is zero at $S_T = K$. That is the worst case for the holder, who loses both premiums.

---

Source: https://quantsandbox.dev/guide/derivatives/strategies

Previous lesson: [Forwards, Calls and Puts: Option Payoffs Explained](https://quantsandbox.dev/guide/derivatives/instruments)

Next lesson: [No-Arbitrage Pricing and the Forward Price Formula](https://quantsandbox.dev/guide/derivatives/no-arbitrage)
