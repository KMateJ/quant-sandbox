# Risk-Neutral Probability in Option Pricing

The replication price as a discounted expectation with weights q; the roles of P and Q. Free interactive lesson with worked examples.

In "The one-step binomial model" the call price came out as the cost of a replicating portfolio, $C_0 = \Delta S_0 + B$. This lesson rewrites that price as a discounted weighted average of the two possible payoffs. The weights behave like probabilities, and they are the **risk-neutral probabilities** that every later pricing model uses.

## Setting

We keep the one-step model unchanged: the stock goes from $S_0$ to $uS_0$ or $dS_0$, the bond grows by $(1+r)$ over the period, and $d < 1+r < u$. The option pays $C_u$ in the up state and $C_d$ in the down state. The real-world probability of the up state is $p$, with $0 < p < 1$.

## Rewriting the replication price

Start from the replicating portfolio of the previous lesson:

$$
\Delta = \frac{C_u - C_d}{(u-d)S_0}, \qquad B = \frac{uC_d - dC_u}{(u-d)(1+r)}.
$$

Add $\Delta S_0$ and $B$, writing both over the common denominator $(u-d)(1+r)$:

$$
C_0 = \frac{(1+r)(C_u - C_d) + uC_d - dC_u}{(u-d)(1+r)}.
$$

Collect the terms in $C_u$ and in $C_d$:

$$
C_0 = \frac{1}{1+r}\left[\frac{(1+r) - d}{u-d}\,C_u + \frac{u - (1+r)}{u-d}\,C_d\right].
$$

Define

$$
q = \frac{(1+r) - d}{u - d}, \qquad 1 - q = \frac{u - (1+r)}{u-d}.
$$

Then the price takes the form

$$
C_0 = \frac{1}{1+r}\big[q\,C_u + (1-q)\,C_d\big].
$$

## $q$ as a probability

The no-arbitrage condition $d < 1+r < u$ makes the numerator $(1+r) - d$ positive and smaller than $u - d$, so $0 < q < 1$. The two weights $q$ and $1-q$ are positive and add up to one. That is all a probability on two outcomes needs. Writing $\mathbb{Q}$ for the probability measure that gives the up state probability $q$, the price is

$$
C_0 = \frac{1}{1+r}\,\mathbb{E}^{\mathbb{Q}}[X],
$$

where $X$ is the payoff at time 1. The same formula holds for any payoff, because the derivation never used the shape of the call. If the no-arbitrage condition fails, $q$ falls outside $(0,1)$ and the formula has no meaning, which matches the fact that such a market has no consistent prices at all.

> **Risk-neutral pricing.** With $q = \frac{(1+r)-d}{u-d}$, the arbitrage-free price of any payoff $X$ is $\frac{1}{1+r}\mathbb{E}^{\mathbb{Q}}[X]$: the expected payoff under $\mathbb{Q}$, discounted at the risk-free rate.

## The real probability $p$ does not enter

The formula for $q$ contains only $u$, $d$ and $r$. The real probability $p$ is absent. Two investors who disagree about how likely the up move is still agree on the option price, as long as they agree on $S_0$, $u$, $d$ and $r$. The reason is the replication argument: the portfolio matches the payoff in every state, so how often each state occurs is irrelevant.

The real probability already acts through the stock price. A market that thinks the up move is very likely will bid $S_0$ up, and $S_0$ is an input. Given $S_0$, however, the option adds no further dependence on $p$.

## Worked example

Use the numbers from the previous lesson: $S_0 = 100$, $u = 1.2$, $d = 0.9$, $r = 2\%$, $K = 100$, so $C_u = 20$ and $C_d = 0$.

$$
q = \frac{1.02 - 0.9}{1.2 - 0.9} = \frac{0.12}{0.3} = 0.4, \qquad C_0 = \frac{0.4\cdot 20 + 0.6\cdot 0}{1.02} \approx 7.84.
$$

This is the same 7.84 that the replicating portfolio gave. Now suppose the real probability of the up move is $p = 0.6$. Discounting the expected payoff under $\mathbb{P}$ at the risk-free rate gives the **naive price**

$$
\frac{1}{1.02}\,\mathbb{E}^{\mathbb{P}}[X] = \frac{0.6\cdot 20}{1.02} \approx 11.76.
$$

If the call traded at 11.76, you could sell it, build the replicating portfolio for 7.84 and keep 3.92 with no risk. So the naive price is wrong, and the error comes from discounting a risky payoff at the risk-free rate.

### Worked example: A put priced two ways

1. Same tree, now a put with $K = 100$: $P_u = (100 - 120)^+ = 0$ and $P_d = (100 - 90)^+ = 10$. With $q = 0.4$, the risk-neutral price is
   $$P_0 = \frac{0.4 \cdot 0 + 0.6 \cdot 10}{1.02}$$ → **5.88**
2. Replication: the share position is negative, a short sale.
   $$\Delta = \frac{0 - 10}{120 - 90}$$ → **-0.3333**
3. The bond position is a deposit.
   $$B = \frac{10 - (-\tfrac{1}{3}) \cdot 90}{1.02}$$ → **39.22**
4. The cost of the portfolio is the same price.
   $$\Delta S_0 + B = -33.33 + 39.22$$ → **5.88**

## The stock earns $r$ under $\mathbb{Q}$

Apply the pricing formula to the stock itself, whose payoff is $uS_0$ or $dS_0$:

$$
\mathbb{E}^{\mathbb{Q}}[S_1] = q\,uS_0 + (1-q)\,dS_0 = S_0\big(d + q(u-d)\big) = (1+r)\,S_0.
$$

Under $\mathbb{Q}$ the stock's expected return equals the risk-free rate. This is where the name comes from: $\mathbb{Q}$ is the probability under which a risk-neutral investor, one who demands no extra return for bearing risk, would be content with the observed prices. Equivalently, the discounted stock price has the same expectation as today's price,

$$
\mathbb{E}^{\mathbb{Q}}\left[\frac{S_1}{1+r}\right] = S_0,
$$

so the discounted price is a **martingale** under $\mathbb{Q}$: its expected future value equals its current value.

Under the real probability the stock usually earns more. In the example with $p = 0.6$ the expected growth factor is $0.6\cdot 1.2 + 0.4\cdot 0.9 = 1.08$, an expected return of 8%, compared with 2% under $\mathbb{Q}$. The difference of 6% is the risk premium. Think of $\mathbb{Q}$ as a deliberately reweighted die: the faces are the same, but the weights are chosen so that every traded asset earns exactly $r$ on average. It is a calculation device, not a forecast.

## Naive price against arbitrage-free price

The figure fixes $S_0 = 100$, $u = 1.2$, $d = 0.9$ and $K = 100$, and plots two prices against the real probability $p$. The naive price $\frac{1}{1+r}\mathbb{E}^{\mathbb{P}}[X]$ rises with $p$. The arbitrage-free price is a flat line. The two cross where $p = q$. Move $p$ and note that only the naive price and the expected stock return under $\mathbb{P}$ change; then move $r$ and note that $q$ and the arbitrage-free price change, while the expected return under $\mathbb{Q}$ always equals $r$.

*[Interactive figure: real vs risk neutral](https://quantsandbox.dev/guide/derivatives/risk-neutral)*

## The roles of $\mathbb{P}$ and $\mathbb{Q}$

- $\mathbb{P}$ describes what actually happens. It is used for forecasting, risk measurement and estimating expected returns.
- $\mathbb{Q}$ is defined by the prices of traded assets. It is used for pricing derivatives that can be replicated.
- The two measures agree on which outcomes are possible; they differ only in the weights they put on them.

## Summary

- The replication price can be written as $C_0 = \frac{1}{1+r}[qC_u + (1-q)C_d]$ with $q = \frac{(1+r)-d}{u-d}$.
- No arbitrage, $d < 1+r < u$, is exactly the condition $0 < q < 1$.
- The real probability $p$ does not appear in the price; discounting $\mathbb{E}^{\mathbb{P}}[X]$ at $r$ gives a wrong, arbitrageable price.
- Under $\mathbb{Q}$ the stock earns the risk-free rate, $\mathbb{E}^{\mathbb{Q}}[S_1] = (1+r)S_0$, and the discounted price is a martingale.

[Compare real and risk-neutral weights in the Binomial lab](https://quantsandbox.dev/binomial)

## Interactive labs

- [Binomial Option Pricing Tree Calculator](https://quantsandbox.dev/binomial)

## Practice questions

### 1. In a one-step model $u = 1.1$, $d = 0.9$ and the simple rate for the period is $r = 2\%$. What is the risk-neutral probability $q$ of the up move?

**Answer:** 0.6

$q = ((1+r) - d)/(u - d) = (1.02 - 0.9)/(1.1 - 0.9) = 0.12/0.2 = 0.6$.

### 2. Two traders agree on $S_0$, $u$, $d$ and $r$ but disagree about the real probability $p$ of the up move. Do they get different option prices?

- a) No: $q$ uses only $u$, $d$ and $r$
- b) Yes: the trader with the higher $p$ gets a higher call price
- c) Yes, unless $p = 0.5$
- d) Only for puts

**Answer:** a) No: $q$ uses only $u$, $d$ and $r$

The replicating portfolio matches the payoff in both states, so how often each state occurs never enters. Given $S_0$, the price does not depend on $p$.

---

Source: https://quantsandbox.dev/guide/derivatives/risk-neutral

Previous lesson: [One-Step Binomial Option Pricing Model](https://quantsandbox.dev/guide/derivatives/one-step-binomial)

Next lesson: [Binomial Trees and Backward Induction (CRR Model)](https://quantsandbox.dev/guide/derivatives/multi-step-trees)
