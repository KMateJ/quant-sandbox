# Brownian Bridge: Definition, Mean and Variance

Brownian motion with a fixed endpoint: construction, covariance, independence and applications. Free interactive lesson with worked examples.

This lesson studies Brownian motion pinned at both ends: the **Brownian bridge**. It builds on "Properties of Brownian motion" (the Gaussian characterisation and the covariance $\min(s, t)$) and on "Conditional expectation and martingales" (conditioning jointly Gaussian variables). The bridge is the right object whenever the value of the path is known at a later time: it fills in a simulation between two sampled points, and it measures the chance that a path crossed a level between two grid points — the "hidden crossing" left open in "The reflection principle and first passage times".

## Definition and construction

Let $W$ be a standard Brownian motion. For a target endpoint $b$, define the process on $[0, 1]$

$$
B_t = W_t - t\,W_1 + t\,b, \qquad 0 \le t \le 1.
$$

At the ends $B_0 = 0$ and $B_1 = W_1 - W_1 + b = b$, so the path is tied down to $b$ at time 1. The special case $b = 0$ is the **standard Brownian bridge** $B^0_t = W_t - t\,W_1$, and the general bridge is $B_t = B^0_t + t\,b$: a standard bridge with the straight line $t \mapsto t\,b$ added. Each $B_t$ is a linear combination of the Gaussian vector $(W_s)$, so $B$ is again a Gaussian process, determined by its mean and covariance.

> A Brownian bridge from 0 to $b$ on $[0, 1]$ is $B_t = W_t - t\,W_1 + t\,b$. It is the continuous Gaussian path with $B_0 = 0$, $B_1 = b$, pulled toward the line $t\,b$ and most free to wander in the middle.

## Mean and covariance

Taking expectations, $\mathbb{E}[B_t] = \mathbb{E}[W_t] - t\,\mathbb{E}[W_1] + t\,b = t\,b$: the mean is the straight line between the endpoints. For the covariance it is enough to treat the standard bridge $B^0_t = W_t - t\,W_1$, since adding the deterministic term $t\,b$ does not change second moments. Using $\operatorname{Cov}(W_s, W_t) = \min(s, t)$, for $s \le t$

$$
\operatorname{Cov}(B^0_s, B^0_t) = s - s\,t - t\,s + s\,t = s - s\,t = s\,(1 - t), \qquad s \le t.
$$

Setting $s = t$ gives the variance $\operatorname{Var}(B_t) = t\,(1 - t)$, a parabola that is zero at both ends and largest at the midpoint, where $\operatorname{Var}(B_{1/2}) = 1/4$. The bridge has no freedom at the endpoints and the most freedom in the middle; this is the hallmark shape of the spread bands in the figure.

## The bridge as conditioned Brownian motion

The construction is not a coincidence: the bridge is exactly Brownian motion **conditioned** on its endpoint. The pair $(W_t, W_1)$ is jointly Gaussian with $\operatorname{Cov}(W_t, W_1) = t$ and $\operatorname{Var}(W_1) = 1$. The Gaussian conditioning formula gives

$$
\mathbb{E}[W_t \mid W_1 = b] = \frac{\operatorname{Cov}(W_t, W_1)}{\operatorname{Var}(W_1)}\,b = t\,b, \qquad \operatorname{Var}(W_t \mid W_1) = t - \frac{t^2}{1} = t\,(1 - t).
$$

These are exactly the mean and variance of $B_t$. A short calculation on the full covariance confirms that the whole conditioned process $(W_t \mid W_1 = b)$ has the same law as $B$. A second fact makes the decomposition clean: $B^0_t = W_t - t\,W_1$ is **independent** of $W_1$, because they are jointly Gaussian and

$$
\operatorname{Cov}(W_t - t\,W_1,\ W_1) = t - t \cdot 1 = 0.
$$

So Brownian motion splits into two independent pieces — a bridge that ignores the endpoint and the endpoint itself:

$$
W_t = B^0_t + t\,W_1, \qquad B^0 \perp W_1.
$$

To simulate a Brownian path on a fine grid, one can therefore first draw the endpoint $W_1 \sim N(0, 1)$ and then fill in the interior with an independent standard bridge. Repeating this between every pair of sampled times is exactly the recursive refinement used to generate Brownian paths at ever finer resolution.

*[Interactive figure: brownian bridge](https://quantsandbox.dev/guide/stochastic/brownian-bridge)*

## The hidden-crossing probability

The reflection lesson noted that a simulated maximum, taken only at grid points, misses crossings that happen between them. The bridge answers exactly how often this occurs. Suppose a path is observed at the ends of an interval of length $\Delta$ with values $w_0$ and $w_1$. Conditioned on these, the path in between is a Brownian bridge, and the probability that it rises to a level $a \ge \max(w_0, w_1)$ somewhere inside is, by a reflection argument applied to the bridge,

$$
\mathbb{P}\Big(\max_{0 \le t \le \Delta} X_t \ge a \ \Big|\ X_0 = w_0,\ X_\Delta = w_1\Big) = \exp\!\Big(-\frac{2\,(a - w_0)(a - w_1)}{\Delta}\Big).
$$

For a standard bridge pinned at $w_0 = w_1 = 0$ over $[0, 1]$ this is $\mathbb{P}(\max B^0 \ge a) = e^{-2a^2}$, which decays far faster than the unconditioned tail $2(1 - \Phi(a))$ because both ends hold the path down. At $a = 1$ the crossing probability is $e^{-2} \approx 0.1353$.

This formula is the basis of the **continuity (Broadie–Glasserman–Kou) correction** for discretely monitored barrier options: between two monitoring dates the asset may breach the barrier unseen, and multiplying each interval's survival probability by $1 - e^{-2(a - w_0)(a - w_1)/\Delta}$ recovers the continuously monitored price from a coarse grid. It also quantifies the downward bias of a simulated running maximum: on a grid the missed crossings are precisely the events this probability measures.

## Where the bridge appears

- **Path simulation:** the decomposition $W_t = B^0_t + t\,W_1$ fills in a path between known points, the engine behind Brownian-bridge sampling and variance reduction in Monte Carlo.
- **Barrier options:** the hidden-crossing formula corrects discretely monitored barriers back to their continuous prices.
- **Statistics:** the empirical distribution function, centred and scaled, converges to a Brownian bridge; the Kolmogorov–Smirnov test statistic is the maximum of $|B^0|$.
- **Interpolation:** conditioning a Gaussian process on observed values is the same operation that underlies Gaussian-process regression and spline smoothing.

### Worked example: The bridge from 0 to 1 at a quarter of the way

1. With $T = 1$ and endpoint $b = 1$, the mean at $t = 0.25$ is the straight line from 0 to $b$.
   $$\mathbb{E}[X_{0.25}] = b\,\frac{t}{T} = 1 \cdot 0.25$$ → **0.25**
2. The variance does not depend on $b$.
   $$\operatorname{Var}(X_{0.25}) = \frac{t(T - t)}{T} = 0.25 \cdot 0.75$$ → **0.1875**
3. Its square root is the standard deviation, smaller than the $\sqrt{0.25} = 0.5$ of free Brownian motion.
   $$\sqrt{0.1875}$$ → **0.433**

## Summary

- The Brownian bridge from 0 to $b$ is $B_t = W_t - t\,W_1 + t\,b$, with $B_0 = 0$ and $B_1 = b$.
- It is a Gaussian process with mean $t\,b$ and covariance $s(1 - t)$ for $s \le t$; the variance $t(1 - t)$ is zero at the ends and $1/4$ at the midpoint.
- The bridge is Brownian motion conditioned on $W_1 = b$, and $B^0_t = W_t - t\,W_1$ is independent of $W_1$, giving the split $W_t = B^0_t + t\,W_1$.
- A bridge pinned at $w_0, w_1$ over an interval of length $\Delta$ exceeds level $a$ with probability $\exp(-2(a - w_0)(a - w_1)/\Delta)$; this prices and corrects barrier crossings between grid points.

[Simulate pinned paths and watch the spread collapse at the endpoints in the Brownian Motion lab](https://quantsandbox.dev/brownian-motion)

## Interactive labs

- [Brownian Motion Simulator with Drift & Volatility](https://quantsandbox.dev/brownian-motion)
- [Stochastic Calculus Course: Random Walks to Brownian Motion](https://quantsandbox.dev/stochastic-models)

## Practice questions

### 1. For a standard Brownian bridge on $[0, 1]$, what is the variance $\operatorname{Var}(B_{1/2})$ at the midpoint?

**Answer:** 0.25

$\operatorname{Var}(B_t) = t(1 - t)$, so at $t = 1/2$ it is $\tfrac12 \cdot \tfrac12 = 1/4 = 0.25$, the maximum of the parabola.

### 2. For a standard Brownian bridge on $[0, 1]$, compute $\operatorname{Cov}(B_{1/4}, B_{3/4})$.

**Answer:** 0.0625

With $s = 1/4 \le t = 3/4$, $\operatorname{Cov}(B_s, B_t) = s(1 - t) = \tfrac14 \cdot \tfrac14 = 1/16 = 0.0625$.

### 3. A standard Brownian bridge is pinned at 0 at both $t = 0$ and $t = 1$. What is the probability that it reaches the level $a = 1$ somewhere in between?

**Answer:** 0.1353

With $w_0 = w_1 = 0$, $\Delta = 1$, $a = 1$: $\exp(-2(a - w_0)(a - w_1)/\Delta) = e^{-2 \cdot 1 \cdot 1} = e^{-2} \approx 0.1353$.

---

Source: https://quantsandbox.dev/guide/stochastic/brownian-bridge

Previous lesson: [Reflection Principle: Maximum of Brownian Motion](https://quantsandbox.dev/guide/stochastic/reflection-principle)

Next lesson: [The Itô Integral and the Itô Isometry Explained](https://quantsandbox.dev/guide/stochastic/ito-integral)
