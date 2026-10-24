# Binomial Trees and Backward Induction (CRR Model)

Recombining trees, the CRR parametrisation, pricing node by node and convergence to Black–Scholes. Free interactive lesson with worked examples.

A single up-or-down move is too crude to describe a stock over months. This lesson chains many one-step models into a tree and prices an option by applying the formula from "Risk-neutral probabilities" at every node, starting at maturity and working back to today. It also uses the $\sqrt{\Delta t}$ scaling from "Random walks and Brownian motion" and continuous discounting from "Interest, compounding and discounting".

## Splitting the time to maturity

Divide the time to maturity $T$ into $n$ equal steps of length

$$
\Delta t = \frac{T}{n}.
$$

In each step the stock is multiplied by $u$ or by $d$, independently of earlier steps. The risk-free bond now grows continuously, so over one step it is multiplied by $e^{r\Delta t}$ rather than by $(1+r)$. Each step is a copy of the one-step model with the growth factor $1+r$ replaced by $e^{r\Delta t}$, so the no-arbitrage condition becomes $d < e^{r\Delta t} < u$, and the risk-neutral probability of an up move is

$$
q = \frac{e^{r\Delta t} - d}{u - d}.
$$

The assumptions are the same as before: no dividends, fractional trading, no transaction costs, borrowing and lending at $r$.

## The recombining tree

An up move followed by a down move gives $S_0ud$, and a down move followed by an up move gives $S_0du$, the same number. Paths that contain the same number of up moves end at the same node. Such a tree is called **recombining**. After $i$ steps there are only $i+1$ distinct prices,

$$
S_{i,j} = S_0\,u^{j}\,d^{\,i-j}, \qquad j = 0, 1, \dots, i,
$$

where $j$ counts the up moves. The whole tree has $(n+1)(n+2)/2$ nodes, while the number of paths is $2^n$. For $n = 100$ that is 5151 nodes instead of about $1.3 \cdot 10^{30}$ paths, which is what makes trees practical.

## Choosing $u$ and $d$

The factors $u$ and $d$ should make the tree's stock behave like a stock with annual volatility $\sigma$. The Cox–Ross–Rubinstein (CRR) choice is

$$
u = e^{\sigma\sqrt{\Delta t}}, \qquad d = \frac{1}{u} = e^{-\sigma\sqrt{\Delta t}}.
$$

Each step changes the log price by $\pm\sigma\sqrt{\Delta t}$. This is the scaled coin-flip walk from "Random walks and Brownian motion": over $n$ steps the variance of the log price change is close to $n\,\sigma^2\Delta t = \sigma^2 T$, which matches the square-root-of-time rule. Because $d = 1/u$, an up move and a down move cancel, so the tree is centred on $S_0$ in log terms.

## Backward induction

At maturity the option value at each node is its payoff. For a call, $C_{n,j} = (S_{n,j} - K)^+$. One step earlier, each node together with its two successors is a one-step model, so its value is the discounted risk-neutral average of the two successor values:

$$
C_{i,j} = e^{-r\Delta t}\big[q\,C_{i+1,j+1} + (1-q)\,C_{i+1,j}\big].
$$

Repeating this step by step back to the root gives the price $C_0 = C_{0,0}$. At each node the replicating portfolio of "The one-step binomial model" still exists, with $\Delta_{i,j} = (C_{i+1,j+1} - C_{i+1,j})/(S_{i+1,j+1} - S_{i+1,j})$, so the price is the cost of a strategy that is rebalanced at every step.

> **Backward induction.** Set the values at maturity equal to the payoff, then move back one step at a time, replacing each node by $e^{-r\Delta t}$ times the $q$-weighted average of its two successors. The value at the root is the arbitrage-free price.

## Worked example

Let $S_0 = 100$, $K = 100$, $T = 1$, $\sigma = 20\%$, $r = 5\%$ and $n = 2$, so $\Delta t = 0.5$.

1. Factors: $u = e^{0.2\sqrt{0.5}} \approx 1.1519$, $d = 1/u \approx 0.8681$, $e^{r\Delta t} = e^{0.025} \approx 1.0253$.
2. Risk-neutral probability: $q = \dfrac{1.0253 - 0.8681}{1.1519 - 0.8681} \approx 0.5539$.
3. Prices at maturity: $S_{2,2} = 100u^2 \approx 132.69$, $S_{2,1} = 100$, $S_{2,0} = 100d^2 \approx 75.36$.
4. Payoffs: $C_{2,2} \approx 32.69$, $C_{2,1} = 0$, $C_{2,0} = 0$.
5. Step 1: $C_{1,1} = \dfrac{0.5539\cdot 32.69 + 0.4461\cdot 0}{1.0253} \approx 17.66$, and $C_{1,0} = 0$ because both its successors are worth zero.
6. Root: $C_0 = \dfrac{0.5539\cdot 17.66}{1.0253} \approx 9.54$.

The Black–Scholes price for the same inputs, derived in a later lesson, is about 10.45. Two steps give a rough answer; more steps get closer.

### Worked example: The same two-step tree for a put

1. Same inputs, now a put with $K = 100$. Use $u \approx 1.1519$, $d = 1/u$ and $q \approx 0.5539$ from above. Only the lowest terminal node pays:
   $$P_{2,0} = (100 - 100d^2)^+$$ → **24.64**
2. Step 1, lower node: both successors are weighted, but only the down successor pays.
   $$P_{1,0} = \frac{0.5539 \cdot 0 + 0.4461 \cdot 24.64}{1.0253}$$ → **10.72**
3. Step 1, upper node: both successors are worth zero, so $P_{1,1} = 0$. Root:
   $$P_0 = \frac{0.5539 \cdot 0 + 0.4461 \cdot 10.72}{1.0253}$$ → **4.66**
4. Check with put–call parity, using the tree call price 9.54:
   $$C_0 - (S_0 - Ke^{-rT}) = 9.54 - 4.88$$ → **4.66**

## The distribution of the terminal price

Under $\mathbb{Q}$ each step is an independent up move with probability $q$, so the number of up moves $j$ by maturity has a binomial distribution. The probability of ending at node $j$ is the number of paths to it times the probability of each path:

$$
\mathbb{Q}(S_T = S_0u^jd^{\,n-j}) = \binom{n}{j}\,q^j(1-q)^{n-j}.
$$

Backward induction for a European option therefore gives the same result as a single discounted expectation over the terminal nodes:

$$
C_0 = e^{-rT}\sum_{j=0}^{n}\binom{n}{j}\,q^j(1-q)^{n-j}\,\big(S_0u^jd^{\,n-j} - K\big)^+.
$$

As $n$ grows, the binomial distribution of $j$ approaches a normal distribution, so $\ln S_T$ becomes normally distributed. This is the log-normal model behind Black–Scholes.

## Convergence to the Black–Scholes price

The figure plots the CRR call price against the number of steps $n$ from 1 to 150, with $S_0 = 100$, $r = 5\%$ and $T = 1$, and the Black–Scholes price as a horizontal line. With $K = 100$ and $\sigma = 20\%$ the tree gives 12.16 for $n = 1$, 9.54 for $n = 2$, 10.25 for $n = 10$ and 10.43 for $n = 100$, against 10.45. The approach is not smooth: the price zigzags between even and odd $n$, because the terminal nodes shift relative to the strike as $n$ changes, and the payoff has a kink at $K$. Move $K$ and $\sigma$ and note that the size of the zigzag changes, while the curve always settles on the reference line.

*[Interactive figure: tree convergence](https://quantsandbox.dev/guide/derivatives/multi-step-trees)*

## American options

An American option can be exercised at any node. Backward induction handles this with one change: at each node take the larger of the exercise value and the continuation value given by the formula above. For a call on a stock without dividends early exercise is never optimal, so its price equals the European one. For an American put it can be optimal, and the tree is the standard way to price it.

## Summary

- A multi-step tree splits $T$ into $n$ steps of length $\Delta t = T/n$; the bond grows by $e^{r\Delta t}$ per step and $q = (e^{r\Delta t} - d)/(u-d)$.
- The CRR choice $u = e^{\sigma\sqrt{\Delta t}}$, $d = 1/u$ gives a recombining tree whose log-price variance over $T$ is about $\sigma^2 T$.
- Backward induction applies the one-step pricing formula at every node, from maturity back to today.
- The number of up moves is binomially distributed under $\mathbb{Q}$, and the tree price converges, with oscillation, to the Black–Scholes price as $n$ grows.

[Build multi-step trees and watch convergence in the Binomial lab](https://quantsandbox.dev/binomial)

## Interactive labs

- [Binomial Option Pricing Tree Calculator](https://quantsandbox.dev/binomial)
- [Black–Scholes Calculator & Option Greeks Visualizer](https://quantsandbox.dev/black-scholes)

## Practice questions

### 1. A recombining binomial tree has $n$ steps. How many distinct stock prices are there at maturity?

- a) $n + 1$
- b) $2n$
- c) $2^n$
- d) $(n+1)(n+2)/2$

**Answer:** a) $n + 1$

A terminal node is fixed by the number of up moves $j = 0, 1, \dots, n$, so there are $n + 1$ of them. $2^n$ counts paths, and $(n+1)(n+2)/2$ counts all nodes of the tree.

### 2. With volatility $\sigma = 20\%$ and quarterly steps, $\Delta t = 0.25$, what is the CRR up factor $u$?

**Answer:** 1.1052

$u = e^{\sigma\sqrt{\Delta t}} = e^{0.2 \cdot 0.5} = e^{0.1} \approx 1.1052$, and $d = 1/u \approx 0.9048$.

---

Source: https://quantsandbox.dev/guide/derivatives/multi-step-trees

Previous lesson: [Risk-Neutral Probability in Option Pricing](https://quantsandbox.dev/guide/derivatives/risk-neutral)

Next lesson: [American Options and Early Exercise in Binomial Trees](https://quantsandbox.dev/guide/derivatives/american-options)
