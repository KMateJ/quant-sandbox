# Itô's Lemma Explained: Quadratic Variation and Drift

Quadratic variation, the chain rule for Brownian motion, and the −½σ² drift of the log price. Free interactive lesson with worked examples.

The lesson "Random walks and Brownian motion" showed that Brownian paths have no slope anywhere, so ordinary calculus does not apply to them directly. This lesson develops the replacement, **Itô's lemma**, the chain rule for functions of a random process. Its key ingredient is a surprising fact about squared increments of Brownian motion.

## Increments in continuous time

Write $dW_t$ for the increment of a Brownian motion over a short interval $dt$. From the definition of Brownian motion it is normal with mean zero and variance $dt$:

$$
dW_t \sim N(0,\ dt), \qquad \mathbb{E}[dW_t] = 0, \qquad \mathbb{E}\big[(dW_t)^2\big] = dt.
$$

A process driven by Brownian motion is described by its increment too. The general **Itô process** has a drift $a$ and a volatility $b$, which may depend on time and on the current value:

$$
dX_t = a(t, X_t)\,dt + b(t, X_t)\,dW_t.
$$

Read it as a recipe for one small step: a deterministic move $a\,dt$ plus a random move $b\,dW_t$ whose typical size is $b\sqrt{dt}$. For small $dt$ the random part is much larger than the drift part, since $\sqrt{dt}$ is much larger than $dt$.

## Quadratic variation

In ordinary calculus, squares of small increments are negligible: if $dx$ is small, $(dx)^2$ is much smaller and disappears in the limit. For Brownian motion this fails. Split $[0, T]$ into $n$ steps of length $\Delta t = T/n$ and add up the squared increments:

$$
Q_n = \sum_{i=1}^{n} \big(W_{t_i} - W_{t_{i-1}}\big)^2.
$$

Each squared increment has mean $\Delta t$, so $\mathbb{E}[Q_n] = n\,\Delta t = T$ for every $n$. Each one also has variance $2\,\Delta t^2$ (a property of the normal distribution), and the increments are independent, so

$$
\operatorname{Var}(Q_n) = n \cdot 2\,\Delta t^2 = \frac{2T^2}{n} \longrightarrow 0 \quad \text{as } n \to \infty.
$$

The sum keeps its mean $T$ while its randomness disappears: in the limit it equals $T$ exactly. This limit is the **quadratic variation** of Brownian motion. Example: on $[0,1]$ the standard deviation of $Q_n$ is $\sqrt{2/n}$, which is $0.447$ for $n = 10$, $0.141$ for $n = 100$ and $0.0447$ for $n = 1000$.

For a smooth path the same sum goes to zero, because each squared increment is of order $\Delta t^2$. Brownian motion is rough enough that its squared increments add up to something finite.

The sum of the absolute increments behaves very differently. Each $|\Delta W|$ has mean $\sqrt{2\Delta t/\pi}$, so on $[0,1]$ the **total variation** $\sum |\Delta W|$ has mean $n\sqrt{2/(\pi n)} = \sqrt{2n/\pi}$: about $2.52$ for $n = 10$, $7.98$ for $n = 100$ and $25.23$ for $n = 1000$. It grows without bound. The length travelled by a Brownian path is infinite, yet the sum of its squared steps settles down to elapsed time.

The figure draws four Brownian paths on $[0,1]$ built from $n$ normal increments $\Delta W \sim N(0, 1/n)$ and plots the running sum $\sum (\Delta W)^2$ of each against $t$, together with the line $t$. Switch between $n = 10$, $100$ and $1000$ and press "New paths" a few times. The running sums hug the line more tightly as $n$ grows. The readouts, computed over 2000 paths at $t = 1$, show the mean of $\sum (\Delta W)^2$ staying near 1, its standard deviation shrinking like $\sqrt{2/n}$, and the mean of $\sum |\Delta W|$ growing like $\sqrt{2n/\pi}$.

*[Interactive figure: quadratic variation](https://quantsandbox.dev/guide/stochastic/ito-lemma)*

The result is written as a set of multiplication rules for small increments:

$$
(dW_t)^2 = dt, \qquad dt\,dW_t = 0, \qquad (dt)^2 = 0.
$$

> Quadratic variation: the squared increments of Brownian motion over $[0,T]$ add up to $T$. In shorthand, $(dW_t)^2 = dt$.

## Itô's lemma

Let $f(t, x)$ be a smooth function and $X_t$ an Itô process as above. We want the increment of $Y_t = f(t, X_t)$. Expand $f$ to second order in a Taylor series:

$$
df = \frac{\partial f}{\partial t}\,dt + \frac{\partial f}{\partial x}\,dX_t + \frac{1}{2}\frac{\partial^2 f}{\partial x^2}\,(dX_t)^2 + \cdots
$$

In ordinary calculus the third term would be dropped. Here it must be kept. Square $dX_t = a\,dt + b\,dW_t$ using the multiplication rules: the $(dt)^2$ and $dt\,dW_t$ terms vanish and only $b^2 (dW_t)^2 = b^2\,dt$ survives:

$$
(dX_t)^2 = b^2\,dt.
$$

Higher-order terms are of order $dt^{3/2}$ or smaller and vanish. Substituting gives **Itô's lemma**:

$$
df(t, X_t) = \left( \frac{\partial f}{\partial t} + a\,\frac{\partial f}{\partial x} + \frac{1}{2}\,b^2\,\frac{\partial^2 f}{\partial x^2} \right) dt + b\,\frac{\partial f}{\partial x}\,dW_t.
$$

Compared with the ordinary chain rule there is one extra drift term, $\tfrac12 b^2 f''$. It is the price of the roughness of Brownian paths: the curvature of $f$ turns the random fluctuations of $X$ into a systematic drift of $f(X)$.

## The square of Brownian motion

Take $X_t = W_t$ (so $a = 0$, $b = 1$) and $f(x) = x^2$, with $f' = 2x$ and $f'' = 2$. Itô's lemma gives

$$
d\big(W_t^2\big) = dt + 2W_t\,dW_t.
$$

Ordinary calculus would give only $2W_t\,dW_t$. The random term has mean zero, so taking expectations of the accumulated increments leaves $\mathbb{E}[W_t^2] = t$, which agrees with $\operatorname{Var}(W_t) = t$. Without the extra $dt$ the expectation would wrongly stay at zero.

## The logarithm of a stock price

The model of "Geometric Brownian motion" is $dS_t = \mu S_t\,dt + \sigma S_t\,dW_t$, an Itô process with $a = \mu S$ and $b = \sigma S$. Apply Itô's lemma to $f(S) = \ln S$, with $f' = 1/S$ and $f'' = -1/S^2$:

$$
d\ln S_t = \left( \mu S \cdot \frac{1}{S} + \frac{1}{2}\,\sigma^2 S^2 \cdot \left(-\frac{1}{S^2}\right) \right) dt + \sigma S \cdot \frac{1}{S}\,dW_t = \left(\mu - \tfrac{1}{2}\sigma^2\right) dt + \sigma\,dW_t.
$$

The right-hand side has constant coefficients, so it can be added up over $[0, T]$ directly:

$$
\ln S_T = \ln S_0 + \left(\mu - \tfrac{1}{2}\sigma^2\right) T + \sigma W_T.
$$

This is the solution quoted in "Geometric Brownian motion", and the $-\tfrac12\sigma^2$ correction is exactly Itô's extra term. Naive calculus would have predicted a log drift of $\mu$.

Example: $S_0 = 100$, $\mu = 8\%$, $\sigma = 20\%$. The log price drifts at $0.08 - \tfrac12 \cdot 0.2^2 = 0.06$ per year, not $0.08$. Over $T = 10$ years the centre of the log price is $\ln 100 + 0.6$, which corresponds to a median price of $100\,e^{0.6} \approx 182.21$. The naive line $\ln 100 + 0.8$ would point to $100\,e^{0.8} \approx 222.55$, which is the **mean** price, not where a typical path ends.

### Worked example: Median and mean of a stock price from Itô's lemma

1. Take $S_0 = 100$, $\mu = 10\%$, $\sigma = 30\%$ and $T = 5$. Drift of the log price per year.
   $$\mu - \tfrac12\sigma^2$$ → **0.055**
2. Median price after five years: the centre of the log price, exponentiated.
   $$S_0\,e^{(\mu - \frac12\sigma^2)T}$$ → **131.65**
3. Mean price after five years.
   $$S_0\,e^{\mu T}$$ → **164.87**
4. Ratio of mean to median: the size of the Itô correction over the whole horizon.
   $$e^{\frac12\sigma^2 T}$$ → **1.2523**

## Size of the correction

Take one day, $\Delta t = 1/252$, with $\sigma = 20\%$. The random part of the return, $\sigma\,\Delta W$, is typically about $0.2 \times \sqrt{1/252} \approx 1.26\%$. Its square is about $\sigma^2 \Delta t \approx 0.016\%$, the same order of magnitude as the daily drift $\mu\,\Delta t \approx 0.032\%$. Adding up such squares day after day does not average out, because they are never negative. That is why the second-order term changes the drift and cannot be ignored.

## Summary

- An Itô process moves by $dX = a\,dt + b\,dW$: a drift step plus a random step of size about $b\sqrt{dt}$.
- Squared Brownian increments add up to elapsed time: $(dW)^2 = dt$, while $dt\,dW$ and $(dt)^2$ vanish.
- Itô's lemma: $df = (f_t + a f_x + \tfrac12 b^2 f_{xx})\,dt + b f_x\,dW$. The term $\tfrac12 b^2 f_{xx}$ is new compared with ordinary calculus.
- Applied to $\ln S$ under GBM it gives $d\ln S = (\mu - \tfrac12\sigma^2)\,dt + \sigma\,dW$.

> The next lesson, "Change of measure and Girsanov's theorem", shows how the drift $\mu$ in this solution is replaced by $r$ for pricing; "Monte Carlo option pricing" then uses the resulting formula to draw terminal stock prices and estimate option prices by averaging.

[Compare the corrected and naive drift of the log price in the Itô Process lab](https://quantsandbox.dev/ito-process)

## Interactive labs

- [Itô's Lemma Visualized: the −½σ² Drift Correction](https://quantsandbox.dev/ito-process)
- [Brownian Motion Simulator with Drift & Volatility](https://quantsandbox.dev/brownian-motion)

## Practice questions

### 1. A Brownian path on $[0, 2]$ is cut into ever finer steps. What does the sum of squared increments $\sum (\Delta W)^2$ approach?

**Answer:** 2

The quadratic variation of Brownian motion over $[0, T]$ is $T$: each $(\Delta W)^2$ has mean $\Delta t$, and the sum stops fluctuating as the steps shrink. Here $T = 2$.

### 2. A stock follows geometric Brownian motion with $\mu = 12\%$ and $\sigma = 40\%$. At what rate per year does its log price drift? Answer in percent.

**Answer:** 4%

Itô's lemma for $\ln S$ gives the drift $\mu - \tfrac12\sigma^2 = 0.12 - 0.08 = 0.04$. Naive calculus would say 12%.

---

Source: https://quantsandbox.dev/guide/stochastic/ito-lemma

Previous lesson: [The Itô Integral and the Itô Isometry Explained](https://quantsandbox.dev/guide/stochastic/ito-integral)

Next lesson: [Feynman–Kac Formula: From SDEs to PDEs](https://quantsandbox.dev/guide/stochastic/feynman-kac)
