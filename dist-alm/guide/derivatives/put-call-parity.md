# Put–Call Parity Explained with Examples

Two portfolios with the same payoff give a model-free link between call and put prices. Free interactive lesson with worked examples.

This lesson derives an exact relation between the prices of a European call and a European put. It combines the synthetic forward from "Combining positions" with the law of one price from "Arbitrage and the forward price". Like the forward price, the result needs no model for how the stock moves.

## Setting

Take a European call and a European put on the same non-dividend-paying stock, with the same strike $K$ and the same maturity $T$. Their prices today are $C_0$ and $P_0$. The stock trades at $S_0$, and the continuously compounded risk-free rate is $r$, so a zero-coupon bond paying $K$ at $T$ costs $Ke^{-rT}$ today. The market assumptions are those of "Arbitrage and the forward price": no transaction costs, borrowing and lending at $r$, short selling allowed.

## Two portfolios with the same payoff

From "Combining positions", a long call and a short put with the same strike pay

$$
(S_T - K)^+ - (K - S_T)^+ = S_T - K
$$

for every value of $S_T$. Now build two portfolios:

- **Portfolio A:** buy one call and sell one put. Cost today $C_0 - P_0$. Payoff at $T$: $S_T - K$.
- **Portfolio B:** buy one share and borrow $Ke^{-rT}$, so that $K$ is owed at $T$. Cost today $S_0 - Ke^{-rT}$. Payoff at $T$: $S_T - K$.

Portfolio B is the stock-and-loan replication of a forward with delivery price $K$, as in the cash-and-carry argument. The two portfolios pay exactly the same amount in every state at $T$, so the law of one price says they cost the same today:

$$
C_0 - P_0 = S_0 - K\,e^{-rT}.
$$

This is **put–call parity**. Rearranged as $C_0 + Ke^{-rT} = P_0 + S_0$, it reads: a call plus cash equal to the discounted strike is worth the same as a put plus the stock. Both sides pay $\max(S_T, K)$ at maturity.

> Put–call parity: $C_0 - P_0 = S_0 - Ke^{-rT}$ for European options on a non-dividend-paying stock with the same strike and maturity. It follows from no arbitrage alone.

## A numerical check

Take $S_0 = 100$, $K = 100$, $r = 5\%$, $T = 1$. The right-hand side is

$$
S_0 - K\,e^{-rT} = 100 - 100\,e^{-0.05} \approx 100 - 95.12 = 4.88.
$$

The Black–Scholes formula, derived in the lesson "The Black–Scholes formula", prices these options with volatility $\sigma = 20\%$ at $C_0 \approx 10.45$ and $P_0 \approx 5.57$. The difference is $4.88$, as parity requires. With a different volatility both prices change, but by the same amount, so their difference stays at 4.88.

Now suppose a dealer offers the call at 11 while the put is still at 5.57. Then $C_0 - P_0 = 5.43 > 4.88$, so portfolio A is too expensive relative to B. Sell A and buy B: sell the call, buy the put, buy the share and borrow $95.12$. The cash flow today is

$$
11 - 5.57 - 100 + 95.12 \approx 0.55,
$$

and at $T$ the positions cancel exactly: the short call and long put together pay $-(S_T - K)$, the share and the loan pay $S_T - K$. The 0.55 is kept without risk.

### Worked example: Checking parity with the synthetic forward

1. Portfolio B borrows the discounted strike, so that $K$ is owed at $T$.
   $$K\,e^{-rT} = 100\,e^{-0.05}$$ → **95.12**
2. B costs one share minus that loan.
   $$S_0 - K\,e^{-rT}$$ → **4.88**
3. Portfolio A, long the call at 10.45 and short the put at 5.57, costs
   $$C_0 - P_0 = 10.45 - 5.57$$ → **4.88**
4. Both pay $S_T - K$ at $T$. At $S_T = 120$, for example, each pays
   $$(120 - 100)^+ - (100 - 120)^+$$ → **20**

The figure fixes $S_0 = 100$ and $r = 5\%$ and lets you move $K$, $\sigma$ and $T$. The chart overlays the payoff of a long call plus a short put on the forward payoff $S_T - K$; the two lines coincide for every strike. The readouts give the Black–Scholes prices $C_0$ and $P_0$, their difference, and $S_0 - Ke^{-rT}$. Change $\sigma$ and note that $C_0$ and $P_0$ both move while $C_0 - P_0$ does not; it changes only with $K$ and $T$.

*[Interactive figure: put call parity](https://quantsandbox.dev/guide/derivatives/put-call-parity)*

## What parity does and does not tell you

Parity is **model-free**: it holds whatever the distribution of $S_T$, because the argument never uses probabilities. It links the two prices, so knowing one gives the other. A desk that prices calls also prices puts, and the put price follows from the call price by $P_0 = C_0 - S_0 + Ke^{-rT}$.

Parity does not tell you the level of either price. It fixes the difference $C_0 - P_0$, while the volatility of the stock determines how large both are. Finding that level needs a model of the stock price, which starts in "The one-step binomial model".

The result relies on its assumptions. With dividends, the stock leg must be reduced by the present value of the dividends. For American options, early exercise breaks the exact equality and leaves only inequalities.

## Simple no-arbitrage bounds

The same reasoning bounds the call price without a model. For the upper bound, a call never pays more than the stock, since $(S_T - K)^+ \le S_T$ for $K \ge 0$. A portfolio that always pays less cannot cost more, so $C_0 \le S_0$.

For the lower bound, the call payoff is never negative, so $C_0 \ge 0$. Also, $(S_T - K)^+ \ge S_T - K$, so the call is worth at least the forward-like portfolio B, which costs $S_0 - Ke^{-rT}$. Combining:

$$
\max\left(S_0 - K\,e^{-rT},\,0\right) \le C_0 \le S_0.
$$

The lower bound also follows from parity: since $P_0 \ge 0$, $C_0 = P_0 + S_0 - Ke^{-rT} \ge S_0 - Ke^{-rT}$. In the example the call must lie between 4.88 and 100. These bounds are wide; they exclude absurd prices but leave the actual level to a model.

## Summary

- A long call and a short put with the same strike and maturity pay $S_T - K$, the same as a share financed by borrowing $Ke^{-rT}$.
- By the law of one price, $C_0 - P_0 = S_0 - Ke^{-rT}$.
- Parity is model-free: it links the call and put prices but does not fix their level.
- Without a model the call price is only bounded: $\max(S_0 - Ke^{-rT}, 0) \le C_0 \le S_0$.

> To pin down the actual option price, the next lessons add a model for the stock price, starting with a single step up or down.

[Combine calls and puts into a synthetic forward in the Payoff lab](https://quantsandbox.dev/payoff)

## Interactive labs

- [Option Payoff Diagram & Strategy Builder](https://quantsandbox.dev/payoff)
- [Black–Scholes Calculator & Option Greeks Visualizer](https://quantsandbox.dev/black-scholes)

## Practice questions

### 1. A European call with $K = 100$ and $T = 1$ costs 7.2. The stock is at $S_0 = 100$ and $r = 5\%$. What must the put with the same strike and maturity cost?

**Answer:** 2.32

$P_0 = C_0 - S_0 + Ke^{-rT} = 7.2 - 100 + 100\,e^{-0.05} \approx 7.2 - 4.88 = 2.32$.

### 2. For which options does the exact equality $C_0 - P_0 = S_0 - Ke^{-rT}$ hold?

- a) European options on a non-dividend-paying stock
- b) American options on a non-dividend-paying stock
- c) Any options, whatever the exercise style
- d) Only at-the-money options

**Answer:** a) European options on a non-dividend-paying stock

The argument holds both portfolios to $T$. Early exercise of American options breaks that, and leaves only inequalities; dividends change the stock leg.

---

Source: https://quantsandbox.dev/guide/derivatives/put-call-parity

Previous lesson: [No-Arbitrage Pricing and the Forward Price Formula](https://quantsandbox.dev/guide/derivatives/no-arbitrage)

Next lesson: [One-Step Binomial Option Pricing Model](https://quantsandbox.dev/guide/derivatives/one-step-binomial)
