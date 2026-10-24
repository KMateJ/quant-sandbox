# No-Arbitrage Pricing and the Forward Price Formula

The law of one price, the cash-and-carry trade and the fair forward price. Free interactive lesson with worked examples.

This lesson finds the delivery price of a forward contract without any model for the future stock price. The argument rests on one assumption, that the market offers no arbitrage, and on the discount factor from "Interest, compounding and discounting". The forward itself was defined in "Forwards, calls and puts".

## Market assumptions

We work in an idealised market. Anyone can borrow and lend at the same risk-free rate $r$ (continuously compounded). The stock can be bought or sold short in any quantity; **short selling** means borrowing a share, selling it today and buying it back later to return it. There are no transaction costs, taxes or dividends, and both parties to a contract honour it.

## Arbitrage

An **arbitrage** is a trading strategy that costs nothing to set up, can never lose money, and makes a positive profit in at least some outcomes. An equivalent form: a strategy that brings in money today and never requires a payment later.

Think of two shops selling the same item at different prices: buy in the cheap one, sell in the expensive one, and the profit is certain. In a liquid market, traders exploit such gaps as soon as they appear, and their buying and selling moves the prices until the gap closes. Pricing theory therefore assumes that arbitrage opportunities do not exist.

## The law of one price

The most useful consequence is the **law of one price**: if two portfolios have the same payoff in every possible state at time $T$, they must have the same price today. Otherwise one would buy the cheaper portfolio and sell the dearer one. The payoffs cancel at $T$, and the price difference is kept today as a riskless profit.

> No arbitrage implies the law of one price: two portfolios with identical payoffs at $T$ have the same price today. Pricing by replication applies this rule again and again.

## The cash-and-carry argument

A forward obliges the long side to buy the stock at $T$ for the delivery price $K$. There is another way to own the stock at $T$: borrow $S_0$, buy the stock today and hold it. Compare the two positions:

- **Portfolio A:** a long forward with delivery price $K$. Cost today 0. At $T$: pay $K$, receive the stock.
- **Portfolio B:** buy one share for $S_0$, financed by borrowing $S_0$. Cost today 0. At $T$: hold the stock and repay the loan with interest, $S_0e^{rT}$.

Both portfolios cost nothing and both end with one share at $T$. Their only difference is the cash paid at $T$: $K$ in A and $S_0e^{rT}$ in B. The law of one price forces these amounts to be equal. The **forward price** $F_0$ is the delivery price that makes a new forward cost nothing:

$$
F_0 = S_0\,e^{rT}.
$$

The forward price is today's stock price carried forward at the risk-free rate. Notice what is missing: the expected return of the stock, its volatility and anyone's opinion about $S_T$. Investors who disagree about the stock must still agree on $F_0$.

## When the quoted forward price is wrong

Suppose a dealer quotes a forward with delivery price $F^{\text{q}}$ different from $S_0e^{rT}$.

**Quote too high**, $F^{\text{q}} > S_0e^{rT}$: do the **cash-and-carry** trade. Borrow $S_0$, buy the stock, and sell a forward at $F^{\text{q}}$. At $T$, deliver the stock, receive $F^{\text{q}}$, and repay $S_0e^{rT}$. The profit is

$$
F^{\text{q}} - S_0\,e^{rT} > 0,
$$

whatever $S_T$ turned out to be: the stock leg and the forward leg offset each other exactly.

**Quote too low**, $F^{\text{q}} < S_0e^{rT}$: do the **reverse cash-and-carry** trade. Short the stock, invest the $S_0$ received at $r$, and buy a forward at $F^{\text{q}}$. At $T$, the investment has grown to $S_0e^{rT}$; pay $F^{\text{q}}$ to take delivery of a share and return it to the lender. The profit is $S_0e^{rT} - F^{\text{q}} > 0$.

Example: $S_0 = 100$, $r = 5\%$, $T = 1$. The fair forward price is $100\,e^{0.05} \approx 105.13$. If the quote is 108, cash-and-carry locks in $108 - 105.13 = 2.87$ at maturity. If the quote is 103, the reverse trade locks in $105.13 - 103 = 2.13$.

### Worked example: Cash-and-carry against a quote of 52

1. With $S_0 = 50$, $r = 4\%$ and $T = 0.5$, the loan taken to buy the share grows to
   $$S_0\,e^{rT} = 50\,e^{0.02}$$ → **51.01**
2. The quote 52 is above that, so borrow 50, buy the share and sell the forward at 52. At $T$ deliver the share, receive 52 and repay the loan.
   $$F^{\text{q}} - S_0\,e^{rT} = 52 - 51.01$$ → **0.99**
3. The same profit in today's money is the gap discounted back.
   $$(52 - 51.01)\,e^{-0.02}$$ → **0.97**

The figure uses $S_0 = 100$. Set $r$ and $T$, then move the quoted forward price away from the fair value. The readouts name the strategy that exploits the gap. The chart plots, against $S_T$, the payoff of the stock-and-loan leg, the payoff of the forward leg and their sum. The two legs are mirror-image lines, so the sum is flat: the profit does not depend on $S_T$. It shrinks to zero when the quote equals $S_0e^{rT}$.

*[Interactive figure: forward arbitrage](https://quantsandbox.dev/guide/derivatives/no-arbitrage)*

## Forward price and the value of a forward contract

Two quantities are easily confused. The **forward price** $F_t$ is the delivery price that makes a *new* forward, entered at time $t$, worth zero; by the argument above, $F_t = S_te^{r(T-t)}$. The **value** of an *existing* forward with a fixed delivery price $K$ changes as the stock moves.

To value it at time $t$, use the same replication. The long forward delivers a share worth $S_T$ in exchange for $K$ at $T$. Holding one share today and owing $K$ at $T$ has the same payoff, and owing $K$ at $T$ is worth $-Ke^{-r(T-t)}$ today. So

$$
f_t = S_t - K\,e^{-r(T-t)}.
$$

At inception $K = F_0 = S_0e^{rT}$ and $f_0 = 0$, as it should be. Example: a one-year forward was entered at $K = 105.13$. Six months later the stock is at 110, so

$$
f_{0.5} = 110 - 105.13\,e^{-0.05\times 0.5} \approx 110 - 102.53 = 7.47.
$$

The long side holds a contract worth 7.47, even though new six-month forwards are now struck at $110\,e^{0.025} \approx 112.78$, not at 105.13.

## Summary

- An arbitrage costs nothing, never loses and sometimes gains; pricing theory assumes none exist.
- No arbitrage implies the law of one price: equal payoffs at $T$ mean equal prices today.
- Replicating the forward with stock and a loan gives $F_0 = S_0e^{rT}$, independent of any view on $S_T$.
- A quote above $F_0$ is exploited by cash-and-carry, a quote below by reverse cash-and-carry; the locked-in profit does not depend on $S_T$.
- An existing forward with delivery price $K$ is worth $f_t = S_t - Ke^{-r(T-t)}$.

> "Put–call parity" applies the same replication argument to options: it compares a call and a put with a forward and needs no model for the stock.

[Compare forward and option payoffs in the Payoff lab](https://quantsandbox.dev/payoff)

## Interactive labs

- [Option Payoff Diagram & Strategy Builder](https://quantsandbox.dev/payoff)

## Practice questions

### 1. A stock trades at $S_0 = 50$, the continuously compounded rate is $r = 4\%$ and the forward matures in $T = 0.5$ years. What is the forward price?

**Answer:** 51.01

$F_0 = S_0e^{rT} = 50\,e^{0.02} \approx 51.01$. Neither the stock's expected return nor its volatility enters.

### 2. A dealer quotes a forward price above $S_0e^{rT}$. Which trade locks in a riskless profit?

- a) Buy the forward and short the stock
- b) Sell the forward, borrow and buy the stock
- c) Buy both the forward and the stock
- d) None: the quote is a forecast of $S_T$

**Answer:** b) Sell the forward, borrow and buy the stock

The forward is too expensive, so sell it and replicate the long side cheaply: borrow $S_0$ and buy the share. At $T$ the profit is $F^{\text{q}} - S_0e^{rT}$ whatever $S_T$ is.

---

Source: https://quantsandbox.dev/guide/derivatives/no-arbitrage

Previous lesson: [Option Strategies: Spreads, Straddles and Butterflies](https://quantsandbox.dev/guide/derivatives/strategies)

Next lesson: [Put–Call Parity Explained with Examples](https://quantsandbox.dev/guide/derivatives/put-call-parity)
