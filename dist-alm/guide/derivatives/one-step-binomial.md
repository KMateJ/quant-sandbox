# One-Step Binomial Option Pricing Model

The stock moves up or down; replicating a call with stock and a bond. Free interactive lesson with worked examples.

This lesson builds the simplest model in which an option has a definite price. It uses the payoffs from "Forwards, calls and puts" and the replication argument from "Arbitrage and the forward price": if a portfolio of traded assets pays exactly what the option pays, the option must cost what the portfolio costs. Here we construct that portfolio explicitly.

## The model

There is one period, from today (time 0) to a single future date (time 1), and two traded assets:

- A **stock** with price $S_0$ today. At time 1 it is worth either $uS_0$ (the up state) or $dS_0$ (the down state), with $d < u$. The numbers $u$ and $d$ are the **up factor** and **down factor**.
- A **risk-free bond** (or bank account). One unit invested today is worth $1+r$ at time 1 in both states. In the one-step lessons $r$ is the simple rate for the whole period, so money grows by the factor $(1+r)$, not $e^{rT}$.

We also assume that both assets can be bought or sold short in any quantity, including fractions, with no transaction costs and no dividends, and that borrowing and lending happen at the same rate $r$.

The model says nothing about how likely the up state is. A real-world probability $p$ exists, but, as we will see, the option price does not use it.

## The no-arbitrage condition

The model is only sensible if neither asset dominates the other. If $1+r \ge u$, the bond pays at least as much as the stock in every state, so shorting the stock and buying the bond is an arbitrage. If $1+r \le d$, the stock beats the bond in every state, and borrowing to buy the stock is an arbitrage. So we require

$$
d < 1 + r < u.
$$

In words: the risk-free growth factor must lie strictly between the two possible stock growth factors.

## Option payoffs at the two nodes

Take a European call with strike $K$ expiring at time 1. Its value at time 1 is its payoff in each state:

$$
C_u = (uS_0 - K)^+, \qquad C_d = (dS_0 - K)^+.
$$

Nothing here is specific to calls. Any payoff $X$ that depends only on the stock price at time 1 is described by two numbers, $X_u$ and $X_d$, and the rest of the lesson works for every such payoff.

## The replicating portfolio

Buy $\Delta$ shares of the stock and put $B$ into the bond ($B < 0$ means borrowing). Today this costs $\Delta S_0 + B$. At time 1 it is worth $\Delta uS_0 + B(1+r)$ in the up state and $\Delta dS_0 + B(1+r)$ in the down state. We want these to equal the option values:

$$
\begin{aligned} \Delta\,uS_0 + B(1+r) &= C_u, \\ \Delta\,dS_0 + B(1+r) &= C_d. \end{aligned}
$$

Two linear equations, two unknowns. Subtracting the second from the first removes $B$:

$$
\Delta = \frac{C_u - C_d}{uS_0 - dS_0}.
$$

$\Delta$ is the change in option value divided by the change in stock price across the two states. Substituting back into the down-state equation gives the bond position:

$$
B = \frac{C_d - \Delta\,dS_0}{1+r} = \frac{uC_d - dC_u}{(u-d)(1+r)}.
$$

For a call, $C_u \ge C_d$, so $0 \le \Delta \le 1$, and $B \le 0$: the replicating portfolio holds part of a share financed partly by borrowing.

## Price equals the cost of replication

The portfolio and the call have the same value in both states at time 1. If they had different prices today, you could buy the cheaper one, sell the dearer one, and keep the difference with no risk at time 1. That is an arbitrage, so the law of one price forces

$$
C_0 = \Delta S_0 + B.
$$

> In the one-step binomial model the option price is the cost today of the stock-and-bond portfolio that reproduces its payoff in both states. No probabilities and no attitudes to risk enter this argument.

## Worked example

Let $S_0 = 100$, $u = 1.2$, $d = 0.9$, $r = 2\%$ per period and $K = 100$. The condition $0.9 < 1.02 < 1.2$ holds.

1. Stock at time 1: $uS_0 = 120$ or $dS_0 = 90$.
2. Call at time 1: $C_u = (120 - 100)^+ = 20$ and $C_d = (90 - 100)^+ = 0$.
3. Shares: $\Delta = \dfrac{20 - 0}{120 - 90} = \dfrac{2}{3} \approx 0.6667$.
4. Bond: $B = \dfrac{0 - \tfrac{2}{3}\cdot 90}{1.02} = -\dfrac{60}{1.02} \approx -58.82$, a loan of 58.82.
5. Price: $C_0 = \tfrac{2}{3}\cdot 100 - 58.82 \approx 66.67 - 58.82 = 7.84$.

Check: in the up state the portfolio is worth $\tfrac{2}{3}\cdot 120 - 60 = 20$, in the down state $\tfrac{2}{3}\cdot 90 - 60 = 0$. The loan repayment is $58.82 \cdot 1.02 = 60$ in both states. The portfolio matches the call exactly.

If the call traded at 9, you would sell it, spend 7.84 building the portfolio and keep 1.16 today. At time 1 the portfolio pays exactly what you owe on the call, whichever state occurs.

### Worked example: Replicating a call with $u = 1.2$ and $d = 0.8$

1. Take $S_0 = 100$, $u = 1.2$, $d = 0.8$, $r = 2\%$ and $K = 100$, so $C_u = 20$ and $C_d = 0$. The share position is
   $$\Delta = \frac{20 - 0}{120 - 80}$$ → **0.5**
2. The bond position, from the down-state equation, is a loan:
   $$B = \frac{0 - 0.5 \cdot 80}{1.02}$$ → **-39.22**
3. The call costs what the portfolio costs.
   $$C_0 = 0.5 \cdot 100 - 39.22$$ → **10.78**
4. Check the up state: half a share worth 60, minus the loan repayment of 40.
   $$0.5 \cdot 120 - 39.22 \cdot 1.02$$ → **20**

## Exploring the tree

The figure draws the one-step tree with the stock price and the call value at each node, and reports $\Delta$, $B$ and the call price. Change $u$, $d$, $r$ and $K$. Raising $K$ shrinks $C_u$ and so lowers both $\Delta$ and the price; widening the gap between $u$ and $d$ raises the price. Move $r$, $u$ or $d$ so that $1+r$ leaves the interval $(d, u)$ and the figure warns that the no-arbitrage condition fails. The readout $q$ is the subject of the next lesson.

*[Interactive figure: one step tree](https://quantsandbox.dev/guide/derivatives/one-step-binomial)*

## Summary

- The one-step model has a stock moving to $uS_0$ or $dS_0$ and a bond growing by $1+r$, with $d < 1+r < u$ to rule out arbitrage.
- Any payoff at time 1 is replicated by $\Delta = (C_u - C_d)/(uS_0 - dS_0)$ shares and $B = (C_d - \Delta dS_0)/(1+r)$ in the bond.
- By the law of one price the option costs $C_0 = \Delta S_0 + B$.
- The real-world probability of the up move never appears in the price.

> "Risk-neutral probabilities" rewrites $\Delta S_0 + B$ as a discounted weighted average of $C_u$ and $C_d$, which is the form that carries over to every later pricing model.

[Build and price binomial trees in the Binomial lab](https://quantsandbox.dev/binomial)

## Interactive labs

- [Binomial Option Pricing Tree Calculator](https://quantsandbox.dev/binomial)

## Practice questions

### 1. In a one-step model $S_0 = 100$, $u = 1.2$ and $d = 0.8$. How many shares $\Delta$ replicate a call with $K = 100$?

**Answer:** 0.5

$C_u = 20$ and $C_d = 0$, so $\Delta = (20 - 0)/(120 - 80) = 0.5$.

### 2. In the portfolio that replicates a call, what is the bond position $B$?

- a) Negative: part of the shares is bought with borrowed money
- b) Positive: cash is lent at $r$
- c) Zero: the shares alone replicate the call
- d) It depends on the real probability of the up move

**Answer:** a) Negative: part of the shares is bought with borrowed money

For a call $B = (uC_d - dC_u)/((u-d)(1+r)) \le 0$, because $C_d$ is small compared with $C_u$. The portfolio is a fraction of a share financed partly by a loan.

---

Source: https://quantsandbox.dev/guide/derivatives/one-step-binomial

Previous lesson: [Put–Call Parity Explained with Examples](https://quantsandbox.dev/guide/derivatives/put-call-parity)

Next lesson: [Risk-Neutral Probability in Option Pricing](https://quantsandbox.dev/guide/derivatives/risk-neutral)
