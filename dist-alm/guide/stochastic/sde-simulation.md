# Euler–Maruyama Scheme: Simulating SDEs Step by Step

Discretising a stochastic differential equation, strong and weak error, step size, and checking against the exact GBM solution.

In "Monte Carlo option pricing" every terminal price was drawn in one step, because "Itô's lemma" gave the exact solution of geometric Brownian motion. Most models used in practice have no such formula. This lesson shows how to simulate a stochastic differential equation step by step with the Euler–Maruyama scheme, how to measure the error it makes, and how fast that error shrinks as the steps get smaller. Geometric Brownian motion serves as the test case, precisely because its exact solution is known.

## Stochastic differential equations

A **stochastic differential equation** (SDE) describes how a quantity $X_t$ changes over a short time $dt$:

$$
dX_t = a(X_t, t)\,dt + b(X_t, t)\,dW_t.
$$

The **drift** $a$ is the expected rate of change, and the **diffusion** coefficient $b$ scales the random shock $dW_t$ of a Brownian motion. Geometric Brownian motion is the case $a = \mu X$, $b = \sigma X$. A mean-reverting interest rate, or the variance in "Stochastic volatility and the Heston model", has other coefficients, and for many of them no closed-form solution exists.

## The Euler–Maruyama step

Split $[0, T]$ into $n$ steps of length $\Delta t = T/n$ and freeze the coefficients at the start of each step. The Brownian increment over a step is normal with variance $\Delta t$, so it can be written $\Delta W_k = \sqrt{\Delta t}\,Z_k$ with $Z_k$ standard normal. The **Euler–Maruyama** scheme is

$$
X_{k+1} = X_k + a(X_k, t_k)\,\Delta t + b(X_k, t_k)\,\sqrt{\Delta t}\,Z_k.
$$

It is the natural first approximation: it keeps exactly the two terms that dominate the Itô expansion of the change over one step, the $dt$ term and the $dW$ term, and drops everything smaller. Think of it as walking along a curved road by taking straight steps in the direction you are facing; the shorter the steps, the closer you stay to the road.

For geometric Brownian motion one step reads $S_{k+1} = S_k\,(1 + \mu\,\Delta t + \sigma\,\Delta W_k)$, while the exact solution over the same step is

$$
S_{k+1} = S_k \exp\!\Big(\big(\mu - \tfrac12\sigma^2\big)\Delta t + \sigma\,\Delta W_k\Big).
$$

Example: $S_0 = 100$, $\mu = 8\%$, $\sigma = 40\%$, $\Delta t = 0.25$ and $Z = 1$, so $\Delta W = 0.5$. Euler gives $100\,(1 + 0.02 + 0.2) = 122.00$. The exact value is $100\,e^{(0.08 - 0.08) \cdot 0.25 + 0.2} = 100\,e^{0.2} = 122.14$. With $Z = -1$ Euler gives $82.00$ against the exact $81.87$. The step misses by about $0.13$ either way, because it ignores the curvature of the exponential.

## Strong and weak error

There are two ways to judge a simulation scheme, depending on what it is used for.

- The **strong error** $\mathbb{E}\big[\,|X_T - \hat X_T|\,\big]$ compares the simulated path $\hat X$ with the true path driven by the same Brownian motion. It matters when the path itself matters, for example when hedging along it.
- The **weak error** $\big|\,\mathbb{E}[f(X_T)] - \mathbb{E}[f(\hat X_T)]\,\big|$ compares only averages. It is what matters for Monte Carlo pricing, which needs the distribution of $X_T$, not individual paths.

> For smooth coefficients the Euler–Maruyama scheme has strong order $\tfrac12$ and weak order 1: the strong error shrinks like $\sqrt{\Delta t}$, the weak error like $\Delta t$. Four times as many steps halve the strong error but cut the weak error to a quarter.

Geometric Brownian motion makes the weak error easy to compute. Each Euler step multiplies the expected value by $1 + \mu\,\Delta t$, so $\mathbb{E}[\hat S_T] = S_0\,(1 + \mu T/n)^n$, against the exact $S_0\,e^{\mu T}$. With the numbers above, $100\,e^{0.08} = 108.3287$, and the gaps for $n = 4$, $16$ and $64$ are $0.0855$, $0.0216$ and $0.0054$: a quarter each time.

### Worked example: Weak error of Euler for GBM with two steps

1. With $S_0 = 100$, $\mu = 8\%$, $T = 1$ and $n = 2$, each Euler step multiplies the expected value by this factor.
   $$1 + \mu T/n$$ → **1.04**
2. Expected value of the Euler approximation at $T$.
   $$S_0\,(1 + \mu T/n)^n$$ → **108.16**
3. Exact expected value.
   $$S_0\,e^{\mu T}$$ → **108.3287**
4. Weak error: twice the gap at $n = 4$, as order 1 predicts.
   $$S_0\,e^{\mu T} - S_0\,(1 + \mu T/n)^n$$ → **0.1687**

## The same path on finer grids

To see the strong error you must compare a simulation with the exact path driven by the same randomness. The figure draws one Brownian path on a fine grid of 256 steps over one year, with $S_0 = 100$, $\mu = 8\%$ and $\sigma = 40\%$; the high volatility makes the error visible. The exact solution is drawn from that path, and the Euler approximation uses the same path on a coarser grid: each coarse increment is the sum of the fine increments it spans.

Choose $n = 4$, $16$, $64$ or $256$ steps and watch the Euler path close in on the exact one; "New path" draws another Brownian path. Hover over the chart, or focus it and use the arrow keys, to compare the two values at a grid time. Below, the strong error at $T$ averaged over 500 paths is plotted against $\Delta t$ on log–log axes, next to a reference line of slope $\tfrac12$. It falls from about $4.82$ at $n = 4$ to $2.34$, $1.23$ and $0.63$ at $n = 256$: roughly halving with every fourfold refinement, as order $\tfrac12$ predicts. On the first path the terminal values at $n = 16$ are $177.23$ exact against $183.44$ for Euler.

*[Interactive figure: euler convergence](https://quantsandbox.dev/guide/stochastic/sde-simulation)*

## Simulating the logarithm instead

For geometric Brownian motion there is a better option than discretising $S$ itself. By "Itô's lemma", $\ln S_t$ follows

$$
d(\ln S_t) = \big(\mu - \tfrac12\sigma^2\big)\,dt + \sigma\,dW_t,
$$

whose coefficients are constant. Euler steps on $\ln S$ are therefore exact, whatever $\Delta t$ is, and prices stay positive automatically. Euler on $S$ can even produce a negative price if $1 + \mu\,\Delta t + \sigma\,\Delta W$ falls below zero. Transforming a model into variables with simpler coefficients before discretising is a standard trick; when no such transformation exists, as for many mean-reverting or stochastic-volatility models, small steps and the error orders above are what you rely on.

## Summary

- An SDE $dX = a\,dt + b\,dW$ is simulated step by step with Euler–Maruyama: $X_{k+1} = X_k + a\,\Delta t + b\sqrt{\Delta t}\,Z_k$.
- The strong error (paths) has order $\tfrac12$ and the weak error (averages) order 1; Monte Carlo pricing only needs the weak one.
- Coarse and fine grids must use the same Brownian path to be compared: coarse increments are sums of fine ones.
- When a transformation gives constant coefficients, as $\ln S$ does for geometric Brownian motion, simulate that variable instead: the steps become exact.

> A later lesson, "Mean reversion: Ornstein–Uhlenbeck and Vasicek", studies a process whose drift pulls it back towards a long-run level, and simulates it with exactly this kind of step.

[Simulate geometric Brownian motion paths in the GBM lab](https://quantsandbox.dev/gbm)

## Interactive labs

- [Geometric Brownian Motion (GBM) Simulator](https://quantsandbox.dev/gbm)
- [Monte Carlo Option Pricing Simulator](https://quantsandbox.dev/monte-carlo)

## Practice questions

### 1. One Euler step for geometric Brownian motion with $S_0 = 100$, $\mu = 8\%$, $\sigma = 40\%$, $\Delta t = 0.25$ and the draw $Z = -0.5$. What is $S_1$?

**Answer:** 92

$\Delta W = \sqrt{0.25} \cdot (-0.5) = -0.25$, so $S_1 = 100\,(1 + 0.08 \cdot 0.25 + 0.4 \cdot (-0.25)) = 100 \cdot 0.92 = 92$.

### 2. You increase the number of Euler steps from 16 to 256. Roughly what happens to the strong error?

- a) It halves.
- b) It shrinks about 4 times.
- c) It shrinks about 16 times.
- d) It does not change.

**Answer:** b) It shrinks about 4 times.

Strong order $\tfrac12$: the error scales like $\sqrt{\Delta t}$. Sixteen times more steps shrink it by $\sqrt{16} = 4$. The weak error, of order 1, would shrink about 16 times.

---

Source: https://quantsandbox.dev/guide/stochastic/sde-simulation

Previous lesson: [Monte Carlo Option Pricing and Standard Error](https://quantsandbox.dev/guide/stochastic/monte-carlo-pricing)

Next lesson: [Correlated Brownian Motions and Cholesky Decomposition](https://quantsandbox.dev/guide/stochastic/correlated-brownian-motions)
