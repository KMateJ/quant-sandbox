# The Itô Integral and the Itô Isometry Explained

Simple integrands, the Itô isometry, the martingale property and the derivation of ∫W dW = (W² − t)/2. Free interactive lesson with worked examples.

This lesson defines the stochastic integral $\int_0^t H_s\,dW_s$, which gives meaning to the expression $dX = a\,dt + b\,dW$ used for asset prices. It builds on "Filtrations, adapted processes and stopping times" (adapted integrands), "Conditional expectation and martingales" (the martingale property) and "Properties of Brownian motion" (infinite total variation and quadratic variation $[W]_t = t$). The next lesson, "Itô's lemma", is the chain rule for these integrals.

## Why a Riemann–Stieltjes integral fails

For a deterministic function $g$, the Riemann–Stieltjes integral $\int_0^t f\,dg$ is the limit of sums $\sum_i f(s_i)\,(g(t_{i+1}) - g(t_i))$ over partitions $0 = t_0 < t_1 < \dots < t_n = t$ whose mesh $\max_i (t_{i+1} - t_i)$ tends to zero, with any evaluation points $s_i \in [t_i, t_{i+1}]$. A classical theorem says that this limit exists for every continuous $f$ exactly when $g$ has finite total variation. Brownian paths have infinite total variation on every interval, almost surely, so the pathwise construction is not available.

The failure is visible in the simplest case $f = g = W$. Write $\Delta W_i = W_{t_{i+1}} - W_{t_i}$ and compare right-point and left-point sums:

$$
\sum_{i} W_{t_{i+1}}\,\Delta W_i - \sum_{i} W_{t_i}\,\Delta W_i = \sum_{i} (\Delta W_i)^2 \longrightarrow t.
$$

The difference tends to the quadratic variation $t$, not to zero, so the answer depends on where in each interval the integrand is evaluated. A definition has to fix the evaluation point. Itô's choice is the left endpoint.

## Simple integrands

Fix a probability space $(\Omega, \mathcal{F}, \mathbb{P})$ with a filtration $(\mathcal{F}_t)_{t \ge 0}$ and a Brownian motion $W$ with respect to it: $W$ is adapted and each increment $W_u - W_s$, $u > s$, is independent of $\mathcal{F}_s$. A process $H$ is **simple** if there are times $0 = t_0 < t_1 < \dots < t_n = T$ and random variables $\xi_0, \dots, \xi_{n-1}$ with $\xi_i$ bounded and $\mathcal{F}_{t_i}$-measurable, such that

$$
H_s = \sum_{i=0}^{n-1} \xi_i\,\mathbf{1}_{(t_i,\, t_{i+1}]}(s).
$$

The value on $(t_i, t_{i+1}]$ is fixed at the left endpoint, using only the information available there. For such $H$ the **Itô integral** is defined directly as a finite sum, for $t_k \le t \le t_{k+1}$:

$$
\int_0^t H_s\,dW_s = \sum_{i=0}^{k-1} \xi_i\,\big(W_{t_{i+1}} - W_{t_i}\big) + \xi_k\,\big(W_t - W_{t_k}\big).
$$

In trading terms, $\xi_i$ is the number of shares held over $(t_i, t_{i+1}]$, chosen at time $t_i$, and the integral is the accumulated gain.

## The Itô isometry

**Theorem.** For a simple $H$,

$$
\mathbb{E}\!\left[\Big(\int_0^T H_s\,dW_s\Big)^{2}\right] = \mathbb{E}\!\left[\int_0^T H_s^2\,ds\right].
$$

**Proof.** Let $I = \sum_i \xi_i\,\Delta W_i$ and expand the square into diagonal and cross terms. On the diagonal, $\xi_i^2$ is $\mathcal{F}_{t_i}$-measurable and $\Delta W_i$ is independent of $\mathcal{F}_{t_i}$ with variance $t_{i+1} - t_i$, so by the tower property

$$
\mathbb{E}\big[\xi_i^2 (\Delta W_i)^2\big] = \mathbb{E}\Big[\xi_i^2\,\mathbb{E}\big[(\Delta W_i)^2 \mid \mathcal{F}_{t_i}\big]\Big] = \mathbb{E}[\xi_i^2]\,(t_{i+1} - t_i).
$$

For a cross term with $i < j$, the product $\xi_i \xi_j \Delta W_i$ is $\mathcal{F}_{t_j}$-measurable, while $\mathbb{E}[\Delta W_j \mid \mathcal{F}_{t_j}] = 0$; hence $\mathbb{E}[\xi_i \xi_j \Delta W_i \Delta W_j] = 0$. Summing the diagonal gives $\mathbb{E}[I^2] = \sum_i \mathbb{E}[\xi_i^2](t_{i+1} - t_i) = \mathbb{E}\big[\int_0^T H_s^2\,ds\big]$. $\square$

Adaptedness was used twice: to pull $\xi_i$ out of the conditional expectation, and to make the cross terms vanish. With an integrand that peeks into its own interval both steps break.

> Itô isometry: $\mathbb{E}\big[(\int_0^T H\,dW)^2\big] = \mathbb{E}\big[\int_0^T H^2\,ds\big]$. It turns a question about a random integral into an ordinary $ds$-integral.

## Extension to general integrands

Let $\mathcal{L}^2_T$ be the set of progressively measurable processes (adapted and jointly measurable in $(s, \omega)$) with $\mathbb{E}\big[\int_0^T H_s^2\,ds\big] < \infty$. Every $H \in \mathcal{L}^2_T$ is the limit of simple processes $H^{(n)}$ in the norm $\|H\|^2 = \mathbb{E}\big[\int_0^T H_s^2\,ds\big]$. By the isometry, the integrals $I(H^{(n)})$ form a Cauchy sequence in $L^2(\Omega)$, so they converge, and the limit does not depend on the approximating sequence. This limit is the Itô integral of $H$. The isometry therefore holds for all of $\mathcal{L}^2_T$. Integrands with only $\int_0^T H_s^2\,ds < \infty$ almost surely can be handled by stopping (localisation); the result is then a local martingale rather than a martingale.

## Properties

For $H, K \in \mathcal{L}^2_T$ and constants $a, b$, the process $I_t = \int_0^t H_s\,dW_s$ has the following properties. Each one is checked on simple integrands and passes to the limit.

- Linearity: $\int (aH + bK)\,dW = a\int H\,dW + b\int K\,dW$.
- Zero mean: $\mathbb{E}[I_t] = 0$, since $\mathbb{E}[\xi_i \Delta W_i] = \mathbb{E}\big[\xi_i\,\mathbb{E}[\Delta W_i \mid \mathcal{F}_{t_i}]\big] = 0$.
- Martingale: $\mathbb{E}[I_t \mid \mathcal{F}_s] = I_s$ for $s \le t$, and $I$ has a version with continuous paths.
- Isometry and covariance: $\mathbb{E}[I_t^2] = \mathbb{E}\big[\int_0^t H_s^2\,ds\big]$ and $\mathbb{E}\big[\int_0^t H\,dW \int_0^t K\,dW\big] = \mathbb{E}\big[\int_0^t H_s K_s\,ds\big]$.
- Quadratic variation: $[I]_t = \int_0^t H_s^2\,ds$, the integral analogue of $[W]_t = t$.

For a deterministic integrand $h$ the integral is Gaussian: $\int_0^t h(s)\,dW_s \sim N\big(0, \int_0^t h(s)^2\,ds\big)$. For example, $\int_0^1 s\,dW_s \sim N(0, 1/3)$.

## Computing the integral of W against itself

Take $H = W$ on $[0, t]$ with the grid $t_i = it/n$. The left-point sum can be rewritten with the identity $b(a - b) = \tfrac12(a^2 - b^2) - \tfrac12(a - b)^2$, applied to $a = W_{t_{i+1}}$, $b = W_{t_i}$:

$$
\sum_{i=0}^{n-1} W_{t_i}\,\Delta W_i = \frac{1}{2}\sum_{i=0}^{n-1}\big(W_{t_{i+1}}^2 - W_{t_i}^2\big) - \frac{1}{2}\sum_{i=0}^{n-1}(\Delta W_i)^2 = \frac{1}{2}W_t^2 - \frac{1}{2}\sum_{i=0}^{n-1}(\Delta W_i)^2.
$$

The first sum telescopes, and this is an exact identity for every $n$. The second sum is the only random approximation left. Each $(\Delta W_i)^2$ has mean $t/n$ and variance $2(t/n)^2$, and they are independent, so

$$
\mathbb{E}\Big[\sum_i (\Delta W_i)^2\Big] = t, \qquad \operatorname{Var}\Big(\sum_i (\Delta W_i)^2\Big) = \frac{2t^2}{n} \longrightarrow 0.
$$

The sum converges to $t$ in $L^2$, and therefore

$$
\int_0^t W_s\,dW_s = \frac{W_t^2 - t}{2}.
$$

The $-t/2$ is exactly half the quadratic variation. Ordinary calculus would give $W_t^2/2$; the correction is there because squared increments of Brownian motion do not vanish in the limit. The result is consistent with the properties above: its mean is $(t - t)/2 = 0$, and its variance is $\operatorname{Var}(W_t^2)/4 = 2t^2/4 = t^2/2$, which matches the isometry $\int_0^t \mathbb{E}[W_s^2]\,ds = \int_0^t s\,ds = t^2/2$.

Numbers: if $W_1 = 1.3$, then $\int_0^1 W\,dW = (1.69 - 1)/2 = 0.345$, while $W_1^2/2 = 0.845$. On a grid of $n$ steps the left-point sum differs from $(W_1^2 - 1)/2$ by $-\tfrac12\big(\sum_i(\Delta W_i)^2 - 1\big)$, whose standard deviation is $\sqrt{1/(2n)}$: $0.224$ for $n = 10$, $0.0707$ for $n = 100$ and $0.00707$ for $n = 10\,000$.

## Left-point and midpoint evaluation

Evaluate instead at the midpoint $m_i = (t_i + t_{i+1})/2$. Split $\Delta W_i = A_i + B_i$ with $A_i = W_{m_i} - W_{t_i}$ and $B_i = W_{t_{i+1}} - W_{m_i}$, independent $N(0, t/(2n))$ variables. Since $W_{m_i} = W_{t_i} + A_i$,

$$
\sum_i W_{m_i}\,\Delta W_i = \sum_i W_{t_i}\,\Delta W_i + \sum_i A_i^2 + \sum_i A_i B_i \longrightarrow \frac{W_t^2 - t}{2} + \frac{t}{2} + 0 = \frac{W_t^2}{2}.
$$

Here $\sum_i A_i^2 \to t/2$ by the same variance argument as before, and $\sum_i A_i B_i$ has mean zero and variance $n\,(t/2n)^2 \to 0$. The midpoint limit is the **Stratonovich integral**, written $\int_0^t W_s \circ dW_s = W_t^2/2$. In general $\int H \circ dW = \int H\,dW + \tfrac12 [H, W]_t$, where $[H, W]$ is the quadratic covariation; for $H = W$ this is $t/2$.

The figure draws one Brownian path on $[0, 1]$ and, for the chosen number of steps $n$ (10, 100, 1000 or 10 000), plots against $t$ the running left-point sum $\sum W_{t_i} \Delta W_i$, the running midpoint sum $\sum W_{(t_i + t_{i+1})/2} \Delta W_i$, and the curves $(W_t^2 - t)/2$ and $W_t^2/2$. Increase $n$ and note that the left sum settles on $(W_t^2 - t)/2$ and the midpoint sum on $W_t^2/2$. The readouts at $t = 1$ compare the left sum with $(W_1^2 - 1)/2$, the midpoint sum with $W_1^2/2$, and show the difference of the two sums, which approaches $0.5 = t/2$ as $n$ grows. Press "New path" to repeat with another path; the gap of $t/2$ stays.

*[Interactive figure: ito sums](https://quantsandbox.dev/guide/stochastic/ito-integral)*

The two integrals have complementary strengths. Stratonovich integrals obey the ordinary chain rule, which is why they are common in physics, where white noise models a smooth but fast physical signal. Itô integrals are martingales: $\mathbb{E}\big[\int_0^t W\,dW\big] = 0$, while $\mathbb{E}\big[\int_0^t W \circ dW\big] = t/2$. Finance uses Itô for a modelling reason. A trader chooses the position $\xi_i$ at the start of the period, using the information $\mathcal{F}_{t_i}$, and then the price moves. The gain $\xi_i\,(S_{t_{i+1}} - S_{t_i})$ is a left-point sum. Evaluating at the midpoint would let the position depend on half of the price move it is paid for, which is a form of trading on future information. Under a measure where discounted prices are martingales, the Itô integral keeps the gains from any such strategy a martingale too, which is the continuous-time statement that no strategy turns a fair game into a sure profit.

### Worked example: Moments of the integral of W against itself

1. An Itô integral of an adapted integrand has mean zero.
   $$\mathbb{E}\Big[\int_0^2 W_t\,dW_t\Big] = 0$$ → **0**
2. The Itô isometry turns the variance into an ordinary integral, $\int_0^T t\,dt = T^2/2$, here with $T = 2$.
   $$\operatorname{Var}\Big(\int_0^2 W_t\,dW_t\Big) = \int_0^2 \mathbb{E}[W_t^2]\,dt = \frac{2^2}{2}$$ → **2**
3. On a path that ends at $W_2 = 1.5$, the closed form gives the value of the integral.
   $$\int_0^2 W_t\,dW_t = \frac{W_2^2 - 2}{2} = \frac{2.25 - 2}{2}$$ → **0.125**

## Summary

- Brownian paths have infinite variation, so $\int H\,dW$ cannot be defined path by path; the value of the sums depends on the evaluation point.
- For simple adapted $H$ the Itô integral is $\sum_i \xi_i\,\Delta W_i$ with $\xi_i$ known at $t_i$; the Itô isometry $\mathbb{E}[(\int H\,dW)^2] = \mathbb{E}[\int H^2\,ds]$ extends it to all of $\mathcal{L}^2_T$ by $L^2$ limits.
- The Itô integral is linear, has mean zero, is a martingale and has quadratic variation $\int H^2\,ds$.
- $\int_0^t W\,dW = (W_t^2 - t)/2$: the $-t/2$ comes from $\sum (\Delta W_i)^2 \to t$. Midpoint evaluation gives the Stratonovich value $W_t^2/2$.
- Finance uses Itô because positions are chosen before the price moves they are paid on.

> The next lesson, "Itô's lemma", turns the computation for $W^2$ into a general rule: $d(W_t^2) = 2W_t\,dW_t + dt$ is the differential form of $\int_0^t W\,dW = (W_t^2 - t)/2$.

[See the Itô correction at work on simulated log prices in the Itô Process lab](https://quantsandbox.dev/ito-process)

## Interactive labs

- [Itô's Lemma Visualized: the −½σ² Drift Correction](https://quantsandbox.dev/ito-process)
- [Brownian Motion Simulator with Drift & Volatility](https://quantsandbox.dev/brownian-motion)

## Practice questions

### 1. Use the Itô isometry to compute $\operatorname{Var}\big(\int_0^2 W_s\,dW_s\big)$. (The integral has mean zero.)

**Answer:** 2

The variance equals $\mathbb{E}\big[\int_0^2 W_s^2\,ds\big] = \int_0^2 s\,ds = 2$. As a cross-check, $\int_0^2 W\,dW = (W_2^2 - 2)/2$ and $\operatorname{Var}(W_2^2)/4 = 2 \cdot 2^2/4 = 2$.

### 2. A Brownian path ends at $W_1 = 1.3$. What is the value of the Itô integral $\int_0^1 W_s\,dW_s$ along this path?

**Answer:** 0.345

$\int_0^1 W\,dW = (W_1^2 - 1)/2 = (1.69 - 1)/2 = 0.345$. The $-1$ is the quadratic variation $[W]_1 = 1$; the naive answer $W_1^2/2 = 0.845$ is the Stratonovich integral.

### 3. Why do models of trading gains use the Itô (left-point) integral rather than the Stratonovich (midpoint) integral?

- a) Because the Stratonovich integral does not exist for Brownian motion
- b) Because the position over $(t_i, t_{i+1}]$ is chosen at $t_i$ with the information in $\mathcal{F}_{t_i}$, so the integrand must not anticipate the move
- c) Because the Itô integral obeys the ordinary chain rule
- d) Because both give the same value for every integrand

**Answer:** b) Because the position over $(t_i, t_{i+1}]$ is chosen at $t_i$ with the information in $\mathcal{F}_{t_i}$, so the integrand must not anticipate the move

A trading position is set before the price change it earns, which is left-point evaluation. The Stratonovich integral exists but evaluates the integrand inside the interval, and it is the Stratonovich integral, not the Itô integral, that follows the ordinary chain rule. For $H = W$ the two differ by $t/2$.

---

Source: https://quantsandbox.dev/guide/stochastic/ito-integral

Previous lesson: [Brownian Bridge: Definition, Mean and Variance](https://quantsandbox.dev/guide/stochastic/brownian-bridge)

Next lesson: [Itô's Lemma Explained: Quadratic Variation and Drift](https://quantsandbox.dev/guide/stochastic/ito-lemma)
