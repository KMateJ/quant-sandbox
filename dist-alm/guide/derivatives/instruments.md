# Forwards, Calls and Puts: Option Payoffs Explained

What a derivative is; payoffs of forwards, calls and puts at maturity; long and short positions. Free interactive lesson with worked examples.

This lesson introduces the three basic derivative contracts: forwards, calls and puts. It describes each one by what it pays at maturity, which is the starting point for every pricing argument that follows. It uses the risk-free rate and discount factor from "Interest, compounding and discounting".

## Underlying asset and derivative

An **underlying asset** is something traded in its own right, such as a share of stock. We write $S_0$ for its price today and $S_T$ for its price at a later date $T$, measured in years. Today $S_0$ is known; $S_T$ is not.

A **derivative** is a contract whose payment is determined by the price of the underlying. The contract fixes a **maturity** $T$ and a rule that turns $S_T$ into a cash amount. That amount is the **payoff**:

$$
X = f(S_T).
$$

The function $f$ is written into the contract. All three instruments in this lesson differ only in the choice of $f$. Throughout, we assume the stock pays no dividends, that there are no transaction costs, and that the contract is settled in cash: the parties exchange the payoff $X$ rather than shares.

## Long and short positions

Every contract has two sides. The party who receives the payoff $X$ is **long** the contract; the party who pays it is **short**. Whatever one side gains at maturity, the other side loses, so the payoff of the short position is $-X$. For this reason it is enough to describe the long side.

## The forward contract

A **forward contract** is an agreement made today to buy the underlying at time $T$ for a price $K$ fixed today, called the **delivery price**. Both sides are obliged to trade. The buyer (long) pays $K$ and receives an asset worth $S_T$, so the long payoff is

$$
X_{\text{fwd}} = S_T - K.
$$

The payoff is a straight line with slope 1 in $S_T$. It is positive when the stock ends above $K$ and negative when it ends below. Because the long side can lose, nobody pays to enter a standard forward: $K$ is chosen so that the contract costs nothing today. How to choose that $K$ is the subject of "Arbitrage and the forward price".

## The call option

An **option** gives its holder a right, not an obligation. A **call option** with **strike** $K$ and maturity $T$ gives the right to buy the underlying at time $T$ for $K$. The holder uses this right (exercises) only when it pays: if $S_T > K$ she buys for $K$ something worth $S_T$; if $S_T \le K$ she lets the option expire. The call payoff is therefore

$$
X_{\text{call}} = \max(S_T - K,\,0) = (S_T - K)^+.
$$

The notation $x^+ = \max(x, 0)$ will be used throughout. Compared with the forward, the call removes the negative part of the payoff: the holder keeps the upside and never pays at maturity.

## The put option

A **put option** gives the right to sell the underlying at time $T$ for the strike $K$. The holder exercises when the stock ends below the strike, since she can then sell for $K$ something worth only $S_T$:

$$
X_{\text{put}} = \max(K - S_T,\,0) = (K - S_T)^+.
$$

A put works like insurance on a share: if the stock falls below $K$, the put pays the shortfall. Its payoff is largest, equal to $K$, when the stock is worthless, and it is zero for any $S_T \ge K$.

The options described here are **European**: they can be exercised only at $T$. **American** options can be exercised at any time up to $T$; they return in "Multi-step trees and backward induction".

The figure plots the payoff at maturity against $S_T$. Switch between call, put and forward, and move the strike $K$. Note that the forward line crosses zero exactly at $K$, while each option payoff has a kink at $K$ and is flat at zero on one side of it.

*[Interactive figure: payoff](https://quantsandbox.dev/guide/derivatives/instruments)*

> Forward payoff $S_T - K$, call payoff $(S_T - K)^+$, put payoff $(K - S_T)^+$. A forward is an obligation; an option is a right, which is why an option has a price today.

## Payoff and profit

Because an option payoff is never negative, the right has value, and the buyer pays the seller a **premium** when the contract is signed. We write $C_0$ for the price of a call today and $P_0$ for the price of a put. The payoff ignores this cost. The **profit** of the long position subtracts it:

$$
\text{profit}_{\text{call}} = (S_T - K)^+ - C_0\,e^{rT}.
$$

The premium is paid at time 0 and the payoff arrives at time $T$, so the premium is grown by $e^{rT}$ to compare amounts at the same date. For short maturities and low rates this factor is close to 1, and the examples below simply subtract the premium.

Example: a call with $K = 100$ costs 6. If $S_T = 115$, the payoff is 15 and the profit is $15 - 6 = 9$. If $S_T = 103$, the payoff is 3 and the profit is $-3$: the option was exercised, but did not recover its cost. If $S_T = 95$, the payoff is 0 and the loss is the full premium of 6. The break-even level is $K + C_0 = 106$.

For a put with $K = 100$ and premium 4, the payoff at $S_T = 90$ is 10 and the profit is 6. The break-even level is $K - P_0 = 96$.

For the short side, the profit is the premium received minus the payoff. The seller of a call earns at most the premium and has unlimited potential loss; the seller of a put loses at most $K - P_0$.

A forward has no premium, so for a forward the payoff and the profit coincide. With $K = 100$ and $S_T = 112$ the long side gains 12 and the short side loses 12.

### Worked example: Profit of a long call across final prices

1. A call with $K = 100$ costs 4.2. At $S_T = 90$ it expires worthless, so the loss is the premium.
   $$(90 - 100)^+ - 4.2$$ → **-4.2**
2. At $S_T = 100$ the payoff is still zero.
   $$(100 - 100)^+ - 4.2$$ → **-4.2**
3. At $S_T = 110$ the payoff of 10 more than covers the premium.
   $$(110 - 100)^+ - 4.2$$ → **5.8**
4. At $S_T = 120$ every extra unit of $S_T$ adds one unit of profit.
   $$(120 - 100)^+ - 4.2$$ → **15.8**
5. The break-even level is the strike plus the premium.
   $$K + C_0$$ → **104.2**

## Summary

- A derivative pays $X = f(S_T)$ at maturity $T$; the function $f$ is fixed in the contract.
- Long receives $X$, short pays $X$; the two payoffs sum to zero.
- Forward: obligation, payoff $S_T - K$, costs nothing to enter.
- Call: right to buy, payoff $(S_T - K)^+$. Put: right to sell, payoff $(K - S_T)^+$. Options cost a premium.
- Profit equals payoff minus the cost of entering, carried to time $T$.

> The next lesson adds these payoffs together. Because payoffs are just functions of $S_T$, a portfolio of contracts pays the sum of the individual payoffs.

[Build and compare single-instrument payoffs in the Payoff lab](https://quantsandbox.dev/payoff)

## Interactive labs

- [Option Payoff Diagram & Strategy Builder](https://quantsandbox.dev/payoff)

## Practice questions

### 1. You hold a European put with strike $K = 100$. At maturity the stock is at $S_T = 85$. What is the payoff?

**Answer:** 15

The put pays $(K - S_T)^+ = (100 - 85)^+ = 15$: you sell for 100 a share worth 85.

### 2. Which of these positions has an unlimited potential loss at maturity?

- a) Long call
- b) Long put
- c) Short call
- d) Short put

**Answer:** c) Short call

The short call pays $(S_T - K)^+$, which grows without bound as $S_T$ rises. A short put loses at most $K - P_0$; long options lose at most their premium.

---

Source: https://quantsandbox.dev/guide/derivatives/instruments

Next lesson: [Option Strategies: Spreads, Straddles and Butterflies](https://quantsandbox.dev/guide/derivatives/strategies)
