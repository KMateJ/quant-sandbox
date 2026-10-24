# Conditional Expectation and Martingales Explained

Conditional expectation given the past, fair games, why no betting strategy beats a martingale, and discounted prices under Q.

The lesson "Probability spaces, σ-algebras and random variables" set up the probability space $(\Omega, \mathcal{F}, \mathbb{P})$, and "Filtrations, adapted processes and stopping times" described how information grows over time through a filtration $\mathbb{F} = (\mathcal{F}_n)$. This lesson uses both to define conditional expectation given a σ-algebra, states its calculation rules, defines a martingale (the mathematical model of a fair game), and proves why no betting strategy turns a fair game into a profitable one. The coin-flip walk $W_n$ and Brownian motion $W_t$ from "Random walks and Brownian motion" serve as the running examples.

## Conditional expectation given a σ-algebra

Let $X$ be an integrable random variable, $\mathbb{E}|X| < \infty$, and let $\mathcal{G} \subseteq \mathcal{F}$ be a sub-σ-algebra: the events whose occurrence is known when the information $\mathcal{G}$ is available. The **conditional expectation** $\mathbb{E}[X \mid \mathcal{G}]$ is a random variable $Y$ with two properties:

- $Y$ is $\mathcal{G}$-measurable: its value can be computed from the information in $\mathcal{G}$.
- $\mathbb{E}[X\,\mathbf{1}_A] = \mathbb{E}[Y\,\mathbf{1}_A]$ for every event $A \in \mathcal{G}$: on every event that $\mathcal{G}$ can see, $Y$ has the same average as $X$.

Such a $Y$ exists (by the Radon–Nikodym theorem) and is unique up to a set of probability zero. When $X$ has a finite variance, $\mathbb{E}[X \mid \mathcal{G}]$ is the $\mathcal{G}$-measurable random variable closest to $X$ in mean square, which is why it is called the best forecast of $X$ given $\mathcal{G}$. It is not a number fixed in advance but a random variable, because the forecast depends on what has been observed.

Example: toss a fair coin twice, let $Y$ be the number of heads and $\mathcal{G} = \sigma(X_1)$ the information from the first toss. $\mathcal{G}$ contains only the events "first toss heads" and "first toss tails" (and $\emptyset$, $\Omega$), so $\mathbb{E}[Y \mid \mathcal{G}]$ must be constant on each: $1 + \tfrac12 = 1.5$ after heads and $0 + \tfrac12 = 0.5$ after tails. The defining property holds on $A = \{\text{heads first}\}$: $\mathbb{E}[Y\,\mathbf{1}_A] = \tfrac12 \cdot 1.5 = 0.75$ on both sides.

## Rules for conditional expectation

All of these follow from the definition, and they are what one actually computes with. Here $X$ and $Z$ are integrable and $\mathcal{H} \subseteq \mathcal{G}$ are sub-σ-algebras.

- **Linearity:** $\mathbb{E}[aX + bZ \mid \mathcal{G}] = a\,\mathbb{E}[X \mid \mathcal{G}] + b\,\mathbb{E}[Z \mid \mathcal{G}]$.
- **Tower property:** $\mathbb{E}\big[\mathbb{E}[X \mid \mathcal{G}] \mid \mathcal{H}\big] = \mathbb{E}[X \mid \mathcal{H}]$. Forecasting with less information what a better-informed forecast will be gives the less-informed forecast. With $\mathcal{H} = \{\emptyset, \Omega\}$ this is $\mathbb{E}\big[\mathbb{E}[X \mid \mathcal{G}]\big] = \mathbb{E}[X]$.
- **Taking out what is known:** if $Z$ is $\mathcal{G}$-measurable and $ZX$ is integrable, then $\mathbb{E}[ZX \mid \mathcal{G}] = Z\,\mathbb{E}[X \mid \mathcal{G}]$.
- **Independence:** if $X$ is independent of $\mathcal{G}$, then $\mathbb{E}[X \mid \mathcal{G}] = \mathbb{E}[X]$. Information unrelated to $X$ does not change its forecast.

In the coin example the tower property reads $\tfrac12 \cdot 1.5 + \tfrac12 \cdot 0.5 = 1 = \mathbb{E}[Y]$.

## Martingales

Fix a filtration $\mathbb{F} = (\mathcal{F}_n)_{n \ge 0}$. A process $X = (X_n)$ is a **martingale** with respect to $\mathbb{F}$ if

- it is adapted: $X_n$ is $\mathcal{F}_n$-measurable for every $n$;
- it is integrable: $\mathbb{E}|X_n| < \infty$ for every $n$;
- the best forecast of the next value is the current value: $\mathbb{E}[X_{n+1} \mid \mathcal{F}_n] = X_n$.

In continuous time, with a filtration $(\mathcal{F}_t)_{t \ge 0}$, the third condition becomes $\mathbb{E}[X_t \mid \mathcal{F}_s] = X_s$ for all $s \le t$. If $\mathbb{E}[X_{n+1} \mid \mathcal{F}_n] \ge X_n$ instead, the process is a **submartingale** (a game in your favour); with $\le$ it is a **supermartingale** (a game against you, like a casino with a house edge).

> A martingale is a fair game: given everything observed so far, the expected change over the next step is zero. By the tower property the same holds over any number of steps, $\mathbb{E}[X_m \mid \mathcal{F}_n] = X_n$ for $m \ge n$, and in particular $\mathbb{E}[X_n] = \mathbb{E}[X_0]$.

## Examples from Brownian motion

Use the natural filtration, the history of the path. Each example is one line with the rules above.

- The symmetric random walk is a martingale: $\mathbb{E}[W_{n+1} \mid \mathcal{F}_n] = W_n + \mathbb{E}[X_{n+1} \mid \mathcal{F}_n] = W_n + \mathbb{E}[X_{n+1}] = W_n$, by taking out what is known and then independence.
- Brownian motion is a martingale in continuous time: for $s < t$, $W_t = W_s + (W_t - W_s)$, and the increment is independent of $\mathcal{F}_s$ with mean zero, so $\mathbb{E}[W_t \mid \mathcal{F}_s] = W_s$.
- $W_t^2$ is not a martingale. Writing $W_t^2 = W_s^2 + 2W_s(W_t - W_s) + (W_t - W_s)^2$ and taking the forecast term by term gives $\mathbb{E}[W_t^2 \mid \mathcal{F}_s] = W_s^2 + 0 + (t - s)$: it drifts upward, so it is a submartingale.
- $W_t^2 - t$ is a martingale: subtracting the drift $t$ removes exactly the upward tendency.

Example: suppose $W_1 = 1$. The forecast of $W_4$ is still 1, but the forecast of $W_4^2$ is $1 + 3 = 4$, not 1. The spread of the path grows even though its centre does not move.

## Betting strategies

Bet on a fair coin round by round. Before round $k$ you choose a stake $H_k$ using only the history $\mathcal{F}_{k-1}$ (the stake is **predictable**), and win or lose it: your wealth changes by $H_k X_k$ with $X_k = \pm 1$. After $n$ rounds

$$
V_n = V_0 + \sum_{k=1}^{n} H_k X_k, \qquad \mathbb{E}[V_{n+1} \mid \mathcal{F}_n] = V_n + H_{n+1}\,\mathbb{E}[X_{n+1} \mid \mathcal{F}_n] = V_n.
$$

The stake is taken out of the forecast because it is known at time $n$, and the coin has conditional mean zero. So the wealth of every such strategy is again a martingale (a **martingale transform**), and its expected value stays at $V_0$ at every fixed time. A strategy can change the shape of the outcome distribution, but not its mean.

The famous **doubling strategy** stakes 1, and after every loss doubles the stake, so that the first win recovers all earlier losses plus 1. Limit it to at most 5 rounds. A win in any of the first five rounds gives a net gain of 1. Losing all five rounds has probability $(\tfrac12)^5 = \tfrac1{32}$ and costs $1 + 2 + 4 + 8 + 16 = 31$. The expected gain is

$$
\tfrac{31}{32} \cdot 1 + \tfrac{1}{32} \cdot (-31) = 0.
$$

The strategy wins a little with probability $96.9\%$ and loses a lot with probability $3.1\%$. Without a round limit it needs unlimited credit: after 10 losses in a row the next stake is 512 and the losses so far are 1023.

In the figure you play this game yourself, starting from a wealth of 100. Choose a strategy: a constant stake of 1, doubling after a loss (stakes up to 64, then back to 1), or a stake of 5% of current wealth; no stake can exceed what you have. "Flip once" plays one round and "Play 100 rounds" plays a hundred, drawing your wealth as a step plot. "Simulate 1000 players" lets 1000 players play 100 rounds each with the chosen strategy and draws a histogram of their final wealth, with the average marked; "Reset" starts again with fresh coins. Compare the three strategies. The average final wealth stays near 100 in every case (the readout shows it with its 95% sampling band), but with a constant stake about 46% of players end ahead and nobody falls below about 60, with doubling about two thirds end ahead and some lose everything, and with 5% of wealth only about 38% end ahead while a few players finish with several times their starting wealth.

*[Interactive figure: martingale betting](https://quantsandbox.dev/guide/stochastic/martingales)*

The same calculation with a longer limit shows that more rounds only move the risk into a rarer, larger loss.

### Worked example: The doubling strategy limited to six rounds

1. Probability of losing all six rounds, in percent.
   $$\left(\tfrac12\right)^6$$ → **1.5625%**
2. Total loss when all six rounds are lost.
   $$1 + 2 + 4 + 8 + 16 + 32$$ → **63**
3. Probability of a net gain of 1, in percent.
   $$1 - \left(\tfrac12\right)^6$$ → **98.4375%**
4. Expected gain of the strategy.
   $$\left(1 - \tfrac{1}{64}\right) \cdot 1 + \tfrac{1}{64} \cdot (-63)$$ → **0**

## Stopping and the optional stopping theorem

A gambler rarely plays a fixed number of rounds; they stop when something happens. A **stopping time** $\tau$ is a random time for which the decision to stop by time $n$ uses only the information up to $n$: $\{\tau \le n\} \in \mathcal{F}_n$ for every $n$. "Stop at the first win" is a stopping time; "stop just before the biggest loss" is not, because it needs the future.

Stopping a martingale at a stopping time keeps it a martingale: the stopped process $X_{\tau \wedge n}$ is again a martingale, so $\mathbb{E}[X_{\tau \wedge n}] = \mathbb{E}[X_0]$ for every fixed $n$. Passing to $n \to \infty$ needs a condition. The **optional stopping theorem** states: if $X$ is a martingale and $\tau$ a stopping time, then

$$
\mathbb{E}[X_\tau] = \mathbb{E}[X_0]
$$

holds under any one of these hypotheses:

- $\tau$ is bounded: $\tau \le N$ for a fixed number $N$;
- $\tau < \infty$ almost surely and the stopped process is dominated: $|X_{\tau \wedge n}| \le K$ for all $n$, for a fixed $K$ (more generally, the family $X_{\tau \wedge n}$ is uniformly integrable);
- $\mathbb{E}[\tau] < \infty$ and the increments are bounded: $|X_{n+1} - X_n| \le c$.

Example (gambler's ruin): a symmetric walk starts at 0 and stops at $\tau$, the first time it hits $+2$ or $-3$. The stopped walk stays between $-3$ and $+2$, so the second hypothesis applies, and $0 = \mathbb{E}[W_\tau] = 2\pi + (-3)(1 - \pi)$, where $\pi$ is the probability of reaching $+2$ first. Hence $\pi = 3/5 = 0.6$, without any combinatorics.

The doubling strategy without a round limit shows why the hypotheses matter. Let $\tau$ be the first win. It is a stopping time and finite with probability 1, and $V_\tau = V_0 + 1$, so $\mathbb{E}[V_\tau] = V_0 + 1 \ne V_0$. The theorem is not contradicted: $\tau$ is unbounded, and before the win the wealth $V_0 - (2^k - 1)$ is not bounded below, so no hypothesis holds. With the cap of five rounds, $\tau \wedge 5$ is bounded and the expected gain is 0, as computed above.

## Doob's maximal inequality

A martingale also controls how far its path can stray before time $n$, not only where it ends. For a martingale $X$ and any $\lambda > 0$, **Doob's maximal inequality** gives

$$
\mathbb{P}\Big(\max_{k \le n} |X_k| \ge \lambda\Big) \le \frac{\mathbb{E}|X_n|}{\lambda}, \qquad \mathbb{E}\Big[\max_{k \le n} X_k^2\Big] \le 4\,\mathbb{E}[X_n^2].
$$

The second form is the $L^2$ version. Both hold with the maximum replaced by the supremum over $[0, t]$ for a martingale with continuous paths such as Brownian motion. Example: for the coin-flip walk with $n = 100$, $\mathbb{E}|W_{100}| \le \sqrt{\mathbb{E}[W_{100}^2]} = 10$, so the probability that the walk ever reaches distance 30 from the start within 100 steps is at most $10/30 = 1/3$, and $\mathbb{E}[\max_{k \le 100} W_k^2] \le 400$. Inequalities like these are what make limits of martingales, and later the Itô integral, well behaved.

## Prices as martingales

Martingales are the language of arbitrage-free pricing. In "Risk-neutral probabilities" the stock was expected to earn the risk-free rate under $\mathbb{Q}$, which says exactly that the discounted price $e^{-rt}S_t$ is a martingale under $\mathbb{Q}$. A later lesson in this track, on changing the measure, shows how to move from the real-world measure $\mathbb{P}$, under which this fails, to $\mathbb{Q}$, under which it holds. A price is then simply the conditional expectation of the discounted payoff.

## Summary

- $\mathbb{E}[X \mid \mathcal{G}]$ is the $\mathcal{G}$-measurable random variable with the same average as $X$ on every event in $\mathcal{G}$; it obeys linearity, the tower property, taking out what is known, and the independence rule.
- A martingale with respect to $\mathbb{F}$ is adapted, integrable and satisfies $\mathbb{E}[X_{n+1} \mid \mathcal{F}_n] = X_n$ (in continuous time $\mathbb{E}[X_t \mid \mathcal{F}_s] = X_s$). $W_t$ and $W_t^2 - t$ are martingales.
- Betting with predictable stakes on a fair game gives a martingale transform: the expected wealth never changes at a fixed time.
- Optional stopping, $\mathbb{E}[X_\tau] = \mathbb{E}[X_0]$, needs a bounded stopping time, a dominated stopped process, or $\mathbb{E}[\tau] < \infty$ with bounded increments; unlimited doubling violates all three.
- Doob's maximal inequality bounds the whole path: $\mathbb{P}(\max_{k \le n}|X_k| \ge \lambda) \le \mathbb{E}|X_n|/\lambda$.

> The next lesson, "Properties of Brownian motion", studies the paths of $W_t$ in detail, using the martingales $W_t$ and $W_t^2 - t$ found here.

[Simulate Brownian paths and watch their spread grow in the Brownian motion lab](https://quantsandbox.dev/brownian-motion)

## Interactive labs

- [Brownian Motion Simulator with Drift & Volatility](https://quantsandbox.dev/brownian-motion)

## Practice questions

### 1. Toss a fair coin three times and let $Y$ be the number of heads. The first toss shows heads. What is $\mathbb{E}[Y \mid \mathcal{F}_1]$?

**Answer:** 2

One head is already known and each of the two remaining tosses adds $\tfrac12$ on average: $1 + 2 \cdot \tfrac12 = 2$. Averaging over the first toss, $\tfrac12 \cdot 2 + \tfrac12 \cdot 1 = 1.5 = \mathbb{E}[Y]$, as the tower property says.

### 2. Which of these processes is a martingale?

- a) $W_t^2$
- b) $W_t^2 - t$
- c) $W_t + t$
- d) $e^{W_t}$

**Answer:** b) $W_t^2 - t$

$\mathbb{E}[W_t^2 \mid \mathcal{F}_s] = W_s^2 + (t - s)$, so subtracting $t$ removes the drift. $W_t^2$ and $W_t + t$ drift upwards, and $e^{W_t}$ is a submartingale too: it needs the factor $e^{-t/2}$ to become a martingale.

### 3. The unlimited doubling strategy stops at the first win, which happens with probability 1, and then has gained exactly 1. Why does this not contradict the optional stopping theorem?

- a) The first win is not a stopping time.
- b) The stopping time is unbounded and the wealth before stopping is not bounded below, so none of the theorem's hypotheses holds.
- c) The coin is not fair once the stake is doubled.
- d) The first win never happens with positive probability.

**Answer:** b) The stopping time is unbounded and the wealth before stopping is not bounded below, so none of the theorem's hypotheses holds.

"Stop at the first win" uses only the past, so it is a stopping time, and it is finite almost surely. What fails is boundedness: $\tau$ has no upper bound, and the losses $2^k - 1$ before the win are not dominated, so $\mathbb{E}[V_\tau] = \mathbb{E}[V_0]$ need not hold.

---

Source: https://quantsandbox.dev/guide/stochastic/martingales

Previous lesson: [Filtrations, Adapted Processes and Stopping Times](https://quantsandbox.dev/guide/stochastic/filtrations)

Next lesson: [Brownian Motion Properties: Scaling and Time Inversion](https://quantsandbox.dev/guide/stochastic/brownian-properties)
