# Girsanov's Theorem and Change of Measure Explained

Reweighting probabilities with a density, equivalent measures, Girsanov's theorem and the market price of risk. Free interactive lesson with worked examples.

Option pricing works with two sets of probabilities for the same outcomes: the real-world measure $\mathbb{P}$ and the risk-neutral measure $\mathbb{Q}$. The lesson "Risk-neutral probabilities" introduced them on a one-step tree. This lesson shows how one measure is turned into the other by reweighting outcomes, first on the tree and then for Brownian motion, using the tools from "Random walks and Brownian motion" and "Itô's lemma". The continuous-time result is Girsanov's theorem.

## Two measures on the same outcomes

A **probability measure** assigns a probability to every event. Two measures can share the same set of possible outcomes and disagree only about how likely each one is. In the one-step binomial model the stock goes up or down; under $\mathbb{P}$ the up move has probability $p$, under $\mathbb{Q}$ it has probability $q$. The outcomes, and hence every payoff, are identical. Only the weights differ.

A fair picture is a die that is reloaded: the six faces stay the same, but the chance of each face changes. Changing the measure means reloading the die, not repainting it.

## The density between two measures

Define a random variable $Z$ that, in each outcome, is the ratio of the two probabilities. On the tree it takes two values:

$$
Z_u = \frac{q}{p}, \qquad Z_d = \frac{1-q}{1-p}.
$$

Multiplying by $Z$ converts a $\mathbb{P}$-expectation into a $\mathbb{Q}$-expectation. For any payoff $X$ with values $X_u$ and $X_d$:

$$
\mathbb{E}^{\mathbb{P}}[Z X] = p\,\frac{q}{p}\,X_u + (1-p)\,\frac{1-q}{1-p}\,X_d = q X_u + (1-q) X_d = \mathbb{E}^{\mathbb{Q}}[X].
$$

Taking $X = 1$ shows that $\mathbb{E}^{\mathbb{P}}[Z] = 1$, and $Z$ is positive in every outcome. In general such a $Z$ is called the **Radon–Nikodym derivative** and is written $Z = d\mathbb{Q}/d\mathbb{P}$.

Example: with $S_0 = 100$, $u = 1.2$, $d = 0.9$ and $r = 2\%$, the risk-neutral probability is $q = 0.4$. Suppose the real probability is $p = 0.6$. Then $Z_u = 0.4/0.6 \approx 0.667$ and $Z_d = 0.6/0.4 = 1.5$. The check $0.6 \cdot 0.667 + 0.4 \cdot 1.5 = 1$ holds. For a call with strike 100, $X_u = 20$ and $X_d = 0$, so $\mathbb{E}^{\mathbb{P}}[ZX] = 0.6 \cdot 0.667 \cdot 20 = 8$, which equals $\mathbb{E}^{\mathbb{Q}}[X] = 0.4 \cdot 20 = 8$. Discounting gives the call price $8/1.02 \approx 7.84$. The density shrinks the weight of the good outcome and raises the weight of the bad one.

## Equivalent measures

The density only makes sense if $p$ and $1 - p$ are both positive, so that nothing is divided by zero. Two measures are **equivalent** when they agree on which events are impossible: an event has probability zero under $\mathbb{P}$ exactly when it has probability zero under $\mathbb{Q}$. Then $Z$ is strictly positive and the change of measure can be undone with $1/Z$.

This is the condition that matters for pricing. An arbitrage is a strategy that cannot lose and may win. Whether something is possible or impossible is the same under equivalent measures, so a market free of arbitrage under $\mathbb{P}$ is free of arbitrage under $\mathbb{Q}$ as well.

> Two measures are equivalent if they have the same impossible events. Between equivalent measures, $\mathbb{E}^{\mathbb{Q}}[X] = \mathbb{E}^{\mathbb{P}}[ZX]$ with a strictly positive density $Z = d\mathbb{Q}/d\mathbb{P}$ that has $\mathbb{E}^{\mathbb{P}}[Z] = 1$.

## Shifting the mean of a normal variable

Now let the outcome be continuous. Under $\mathbb{P}$ let $W_T \sim N(0, T)$, the value of a Brownian motion at time $T$. Fix a number $\theta$ and define

$$
Z = \exp\!\left(-\theta W_T - \tfrac{1}{2}\theta^2 T\right).
$$

It is positive, and its $\mathbb{P}$-mean is 1, because $\mathbb{E}[e^{-\theta W_T}] = e^{\frac12\theta^2 T}$ for a normal variable with variance $T$. Multiply the normal density of $W_T$ by $Z$ and complete the square in the exponent:

$$
\frac{1}{\sqrt{2\pi T}}\,e^{-\frac{w^2}{2T}} \cdot e^{-\theta w - \frac12\theta^2 T} = \frac{1}{\sqrt{2\pi T}}\,e^{-\frac{(w + \theta T)^2}{2T}}.
$$

The result is again a normal density with the same variance $T$, but with mean $-\theta T$. Reweighting by $Z$ has moved the distribution sideways without changing its shape. Outcomes on one side get weights above 1, outcomes on the other side weights below 1.

### Worked example: Reweighting a normal variable with θ = 0.5

1. Let $W_1 \sim N(0, 1)$ under $\mathbb{P}$ and $\theta = 0.5$, $T = 1$. Weight of the outcome $W_1 = 1$.
   $$Z = e^{-\theta \cdot 1 - \frac12\theta^2}$$ → **0.5353**
2. Weight of the outcome $W_1 = -1$.
   $$Z = e^{\theta - \frac12\theta^2}$$ → **1.455**
3. Mean of $W_1$ under the reweighted measure $\mathbb{Q}$.
   $$-\theta T$$ → **-0.5**
4. Variance of $W_1$ under $\mathbb{Q}$: the shape is unchanged.
   $$T$$ → **1**

## Girsanov's theorem

The same reweighting works for the whole path, not just the endpoint. **Girsanov's theorem** states: if $W$ is a Brownian motion under $\mathbb{P}$ and $\mathbb{Q}$ is defined by the density $Z$ above, then

$$
\tilde W_t = W_t + \theta t
$$

is a Brownian motion under $\mathbb{Q}$. The paths themselves are unchanged. Under the new weights, $W$ acquires a drift of $-\theta$ per unit time, and adding $\theta t$ back removes it. In increments, $dW_t = d\tilde W_t - \theta\,dt$: a change of measure changes the drift of a process and leaves its volatility alone.

## Geometric Brownian motion under the risk-neutral measure

Take the stock model from "Geometric Brownian motion", $dS_t = \mu S_t\,dt + \sigma S_t\,dW_t$, and substitute $dW_t = d\tilde W_t - \theta\,dt$:

$$
dS_t = (\mu - \sigma\theta)\,S_t\,dt + \sigma S_t\,d\tilde W_t.
$$

Choose $\theta$ so that the drift becomes the risk-free rate $r$:

$$
\theta = \frac{\mu - r}{\sigma}, \qquad dS_t = r S_t\,dt + \sigma S_t\,d\tilde W_t.
$$

The number $\theta$ is the **market price of risk**: the excess return of the stock per unit of volatility. Under $\mathbb{Q}$ the stock earns $r$ on average, the continuous-time version of $\mathbb{E}^{\mathbb{Q}}[S_1] = (1+r)S_0$ on the tree. By Itô's lemma, as in "Itô's lemma",

$$
\ln\frac{S_T}{S_0} \sim N\!\left(\left(\mu - \tfrac12\sigma^2\right)T,\ \sigma^2 T\right) \text{ under } \mathbb{P}, \qquad \ln\frac{S_T}{S_0} \sim N\!\left(\left(r - \tfrac12\sigma^2\right)T,\ \sigma^2 T\right) \text{ under } \mathbb{Q}.
$$

This explains why option prices depend on $\sigma$ but not on $\mu$. A price is a discounted $\mathbb{Q}$-expectation, and under $\mathbb{Q}$ the drift is $r$ whatever $\mu$ was. The volatility survives the change of measure, because Girsanov only shifts the mean.

Example: $\mu = 10\%$, $r = 3\%$, $\sigma = 20\%$, $T = 1$. The market price of risk is $\theta = (0.10 - 0.03)/0.20 = 0.35$. The mean log return is $0.10 - 0.02 = 0.08$ under $\mathbb{P}$ and $0.03 - 0.02 = 0.01$ under $\mathbb{Q}$; the standard deviation is $0.20$ under both. A path with $W_1 = 1$ (a good year) gets weight $Z = e^{-0.35 - 0.06125} \approx 0.663$, and a path with $W_1 = -1$ gets $e^{0.35 - 0.06125} \approx 1.335$.

The figure plots the density of $\ln(S_T/S_0)$ for $T = 1$ under $\mathbb{P}$ and under $\mathbb{Q}$, together with a histogram line of 200 000 draws simulated under $\mathbb{P}$ and reweighted by $Z = d\mathbb{Q}/d\mathbb{P}$. The reweighted histogram lands close to the $\mathbb{Q}$ density; the small gap is sampling noise. Move $\mu$ and note that only the $\mathbb{P}$ curve moves, while the $\mathbb{Q}$ curve stays put and the reweighted sample stays close to it. Move $r$ to shift the $\mathbb{Q}$ curve, and $\sigma$ to widen both. The readouts show $\theta$, the means under $\mathbb{P}$ and $\mathbb{Q}$, and the mean of the reweighted sample, which stays close to the $\mathbb{Q}$ mean (at the defaults 0.94% against 1.00%).

*[Interactive figure: girsanov shift](https://quantsandbox.dev/guide/stochastic/change-of-measure)*

## Summary

- Two measures on the same outcomes differ only in their weights. The density $Z = d\mathbb{Q}/d\mathbb{P}$ converts one into the other: $\mathbb{E}^{\mathbb{Q}}[X] = \mathbb{E}^{\mathbb{P}}[ZX]$.
- Equivalent measures share their impossible events, so they agree on what counts as an arbitrage.
- Reweighting a normal variable by $e^{-\theta W_T - \frac12\theta^2 T}$ shifts its mean by $-\theta T$ and keeps its variance.
- Girsanov: $\tilde W_t = W_t + \theta t$ is a $\mathbb{Q}$-Brownian motion. With $\theta = (\mu - r)/\sigma$ the stock drifts at $r$ under $\mathbb{Q}$.
- Prices are $\mathbb{Q}$-expectations, so they depend on $\sigma$ but not on $\mu$.

> The next lesson, "Monte Carlo option pricing", simulates the stock directly under $\mathbb{Q}$, with drift $r$, as this lesson justifies.

[Compare drift and volatility of simulated stock paths in the GBM lab](https://quantsandbox.dev/gbm)

## Interactive labs

- [Geometric Brownian Motion (GBM) Simulator](https://quantsandbox.dev/gbm)

## Practice questions

### 1. In a one-step tree the real probability of the up move is $p = 0.5$ and the risk-neutral one is $q = 0.4$. What is the density $Z_u = d\mathbb{Q}/d\mathbb{P}$ in the up state?

**Answer:** 0.8

$Z_u = q/p = 0.4/0.5 = 0.8$; in the down state $Z_d = 0.6/0.5 = 1.2$, and $0.5 \cdot 0.8 + 0.5 \cdot 1.2 = 1$.

### 2. A stock has $\mu = 12\%$ and $\sigma = 25\%$, and the risk-free rate is $r = 4\%$. What is the market price of risk $\theta$ used in Girsanov's theorem?

**Answer:** 0.32

$\theta = (\mu - r)/\sigma = 0.08/0.25 = 0.32$. Under $\mathbb{Q}$ the drift $\mu$ is replaced by $r$, so $\mu$ disappears from option prices.

---

Source: https://quantsandbox.dev/guide/stochastic/change-of-measure

Previous lesson: [Feynman–Kac Formula: From SDEs to PDEs](https://quantsandbox.dev/guide/stochastic/feynman-kac)

Next lesson: [Monte Carlo Option Pricing and Standard Error](https://quantsandbox.dev/guide/stochastic/monte-carlo-pricing)
