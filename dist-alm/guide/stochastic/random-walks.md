# Random Walks and Brownian Motion Explained

The coin-flip walk, variance that grows linearly in time, and its limit: Brownian motion. Free interactive lesson with worked examples.

The lesson "Returns and volatility" showed that, with independent returns, the standard deviation of the total log return grows like $\sigma\sqrt{T}$. This lesson builds the random process behind that rule from the simplest possible ingredient, a fair coin, and takes a limit to arrive at Brownian motion, the source of randomness in every continuous-time model that follows.

## The coin-flip walk

Toss a fair coin repeatedly. On heads move one unit up, on tails one unit down. Write the $k$-th move as $X_k$, so $X_k = +1$ or $X_k = -1$, each with probability $\tfrac12$, and different tosses are independent. The position after $n$ tosses, starting from zero, is

$$
W_n = X_1 + X_2 + \cdots + X_n.
$$

This is the **symmetric random walk**. Think of a person on a long corridor who takes one step forward or back each second depending on the coin. Nobody can say where they will be after 100 steps, but the spread of their likely positions can be computed exactly.

## Mean and variance of the walk

Each step has mean zero and variance one:

$$
\mathbb{E}[X_k] = \tfrac12(+1) + \tfrac12(-1) = 0, \qquad \operatorname{Var}(X_k) = \mathbb{E}[X_k^2] = 1.
$$

Expectations always add. Variances add when the terms are independent, which they are here. So

$$
\mathbb{E}[W_n] = 0, \qquad \operatorname{Var}(W_n) = n, \qquad \operatorname{sd}(W_n) = \sqrt{n}.
$$

The variance grows **linearly** in the number of steps and the standard deviation grows like its square root. After 100 tosses the typical distance from the start is $\sqrt{100} = 10$ units, not 100. After 10000 tosses it is 100. Many steps partly cancel each other, which is why the spread grows much more slowly than the number of steps.

## Scaling the steps

To describe a price that moves continuously, we want many small steps inside a fixed time interval rather than unit steps once a second. Fix the interval $[0, 1]$, split it into $n$ steps of length $\Delta t = 1/n$, and let each step have size $\pm a$ for some $a$ still to be chosen. After $k$ steps the time is $t = k\,\Delta t$ and the variance of the position is $k a^2 = (t/\Delta t)\,a^2$.

Now let $n$ grow, so $\Delta t$ shrinks. There are three cases:

- If $a = 1$, the variance $t/\Delta t$ grows without bound. The walk flies off.
- If $a = \Delta t$, the variance $t\,\Delta t$ goes to zero. The walk collapses to a flat line.
- If $a = \sqrt{\Delta t}$, the variance is exactly $t$ for every $n$. This is the only choice that gives a non-trivial limit.

So the step size must be proportional to the **square root** of the time step:

$$
W_{t + \Delta t} = W_t \pm \sqrt{\Delta t}, \qquad \operatorname{Var}(W_t) = \frac{t}{\Delta t}\cdot \Delta t = t.
$$

Example: with $n = 100$ steps on $[0,1]$, each step is $\pm\sqrt{0.01} = \pm 0.1$. At $t = 0.25$ the walk has taken 25 steps, so its variance is $25 \times 0.01 = 0.25$ and its standard deviation is $0.5$. At $t = 1$ the standard deviation is 1.

The figure draws six sample paths of this scaled walk on $[0,1]$ together with the curves $\pm\sqrt{t}$ and $\pm 2\sqrt{t}$. Switch between $n = 10$, $100$ and $1000$ steps and press "New paths" a few times. The paths get finer, but the envelope stays the same, and the readout of the endpoint variance over 2000 simulated paths stays close to 1 whatever $n$ is.

*[Interactive figure: random walk](https://quantsandbox.dev/guide/stochastic/random-walks)*

## Brownian motion

As $n \to \infty$, each $W_t$ is a sum of more and more small independent steps, so by the central limit theorem its distribution becomes normal. The limiting process is **Brownian motion** (also called the Wiener process), written $W_t$. It is defined by four properties:

- $W_0 = 0$.
- For $s < t$, the increment $W_t - W_s$ is normally distributed with mean 0 and variance $t - s$.
- Increments over non-overlapping intervals are independent.
- The path $t \mapsto W_t$ is continuous.

Taking $s = 0$ in the second property gives

$$
W_t \sim N(0,\ t).
$$

Example: $W_1$ is standard normal, so it lies between $-1$ and $1$ with probability about 68%. The increment $W_1 - W_{0.5}$ has variance $0.5$, regardless of what the path did before $t = 0.5$.

> Brownian motion: $W_0 = 0$, independent increments, $W_t - W_s \sim N(0, t-s)$, continuous paths. In particular $\operatorname{Var}(W_t) = t$.

## Continuous but jagged paths

Brownian paths have no jumps, yet they are extremely rough. Over a short interval $\Delta t$ the typical move is $\sqrt{\Delta t}$, so the typical slope is

$$
\frac{\sqrt{\Delta t}}{\Delta t} = \frac{1}{\sqrt{\Delta t}} \longrightarrow \infty \quad \text{as } \Delta t \to 0.
$$

Zooming in does not make the path look smoother, as it would for an ordinary smooth curve; it reveals more wiggles at every scale. The path has no well-defined slope at any point. This is why ordinary calculus does not apply directly to Brownian motion and later lessons need a correction term.

## The link to the square-root-of-time rule

Combine this with "Returns and volatility". Model the log return over $[0, T]$ as a straight-line drift plus a scaled Brownian motion:

$$
\ln\frac{S_T}{S_0} = \mu T + \sigma W_T.
$$

Since $W_T \sim N(0, T)$, the log return is normal with mean $\mu T$ and standard deviation $\sigma\sqrt{T}$, exactly the first model from "Returns and volatility". The $\sqrt{T}$ in that rule is the $\sqrt{t}$ envelope of the random walk in the figure.

## Endpoints and the bell curve

A single walk says little; many walks show the distribution. In the figure each walker takes $n$ steps of $\pm 1$ and drops into the bin of its endpoint. Press Play, or add walkers by hand, and watch the histogram fill the normal curve with variance $n$. The sample variance settles near $n$ whatever $n$ you choose, and doubling $n$ makes the spread grow by $\sqrt{2}$, not by 2.

*[Interactive figure: galton walk](https://quantsandbox.dev/guide/stochastic/random-walks)*

### Worked example: The distribution of a four-step walk

1. Paths ending at $W_4 = 2$ need three up-steps and one down-step; count the orderings.
   $$\binom{4}{3}$$ → **4**
2. Each path has probability $(1/2)^4$.
   $$\Pr(W_4 = 2) = 4 \cdot (1/2)^4$$ → **0.25**
3. The mean is zero, since every step has mean zero.
   $$\mathbb{E}[W_4] = 0$$ → **0**
4. The variance is the number of steps.
   $$\operatorname{Var}(W_4) = 4 \cdot 1$$ → **4**

## Summary

- A coin-flip walk of $n$ independent $\pm 1$ steps has mean 0 and variance $n$, so its spread grows like $\sqrt{n}$.
- To get a sensible limit in continuous time, steps of length $\Delta t$ must have size $\pm\sqrt{\Delta t}$; then $\operatorname{Var}(W_t) = t$.
- The limit is Brownian motion: $W_0 = 0$, independent normal increments with variance equal to elapsed time, continuous paths.
- Brownian paths are continuous but have no slope anywhere.
- The log return model $\mu T + \sigma W_T$ reproduces the square-root-of-time rule.

[Simulate and inspect Brownian paths in the Brownian Motion lab](https://quantsandbox.dev/brownian-motion)

## Interactive labs

- [Brownian Motion Simulator with Drift & Volatility](https://quantsandbox.dev/brownian-motion)
- [Monte Carlo Option Pricing Simulator](https://quantsandbox.dev/monte-carlo)

## Practice questions

### 1. A symmetric walk takes 100 independent steps of $\pm 1$. What is the variance of its position $W_{100}$?

**Answer:** 100

Each step has variance 1 and independent variances add, so $\operatorname{Var}(W_{100}) = 100$; the standard deviation is 10.

### 2. The interval $[0, 1]$ is split into $n$ steps of length $1/n$. Which step size gives a walk that converges to Brownian motion as $n \to \infty$?

- a) $\pm 1$
- b) $\pm 1/n$
- c) $\pm\sqrt{1/n}$
- d) $\pm n$

**Answer:** c) $\pm\sqrt{1/n}$

With steps $\pm\sqrt{\Delta t}$ the variance at time $t$ is $(t/\Delta t)\,\Delta t = t$ for every $n$. Steps of $\pm 1$ make the variance blow up, steps of $\pm 1/n$ make it vanish.

---

Source: https://quantsandbox.dev/guide/stochastic/random-walks

Next lesson: [Law of Large Numbers and Central Limit Theorem](https://quantsandbox.dev/guide/stochastic/law-of-large-numbers-clt)
