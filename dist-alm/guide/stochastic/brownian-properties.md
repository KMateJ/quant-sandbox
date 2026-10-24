# Brownian Motion Properties: Scaling and Time Inversion

Definition, the Gaussian characterisation, scaling, time inversion, the Markov property, quadratic variation and rough paths.

The lesson "Random walks and Brownian motion" obtained Brownian motion as the limit of a scaled coin-flip walk and listed its defining properties informally. With the language of "Probability spaces, σ-algebras and random variables" and "Filtrations, adapted processes and stopping times" in hand, this lesson states the definition precisely, proves that Brownian motion is characterised by its covariance function, and uses that characterisation to derive four invariances, among them time inversion. It ends with the main path properties: recurrence, nowhere differentiability, infinite total variation, finite quadratic variation, and the Markov and strong Markov properties.

## Definition of Brownian motion

Let $(\Omega, \mathcal{F}, \mathbb{P})$ be a probability space. A **standard Brownian motion** is a family of random variables $(W_t)_{t \ge 0}$ on it such that

- $W_0 = 0$ almost surely;
- for all $0 \le t_0 < t_1 < \cdots < t_n$ the increments $W_{t_1} - W_{t_0}, \dots, W_{t_n} - W_{t_{n-1}}$ are independent;
- for $0 \le s < t$ the increment $W_t - W_s$ has the normal distribution $N(0, t - s)$;
- for almost every $\omega \in \Omega$ the path $t \mapsto W_t(\omega)$ is continuous.

That such a process exists is a theorem (Wiener, 1923); a standard proof builds the finite-dimensional distributions and then uses Kolmogorov's continuity theorem to obtain a continuous version. Given a filtration $(\mathcal{F}_t)_{t \ge 0}$, $W$ is a Brownian motion **with respect to** $(\mathcal{F}_t)$ if it is adapted and $W_t - W_s$ is independent of $\mathcal{F}_s$ for every $s < t$. For the natural filtration $\mathcal{F}^W_t = \sigma(W_u : u \le t)$ this follows from the independent increments.

## Brownian motion as a Gaussian process

A process $(X_t)$ is a **Gaussian process** if every vector $(X_{t_1}, \dots, X_{t_n})$ is multivariate normal. Its law is then fixed by the mean function $\mathbb{E}[X_t]$ and the covariance function $\operatorname{Cov}(X_s, X_t)$, because a multivariate normal distribution is fixed by its mean vector and covariance matrix.

Brownian motion is Gaussian: $(W_{t_1}, \dots, W_{t_n})$ is a linear transformation of the independent normal increments, since $W_{t_k} = \sum_{j \le k}(W_{t_j} - W_{t_{j-1}})$. Its mean is zero, and for $s \le t$, splitting $W_t = W_s + (W_t - W_s)$ with the second term independent of the first,

$$
\operatorname{Cov}(W_s, W_t) = \operatorname{Var}(W_s) + \operatorname{Cov}(W_s, W_t - W_s) = s = \min(s, t).
$$

> Characterisation: a process $(X_t)_{t \ge 0}$ with continuous paths is a standard Brownian motion if and only if it is a centred Gaussian process with $\operatorname{Cov}(X_s, X_t) = \min(s, t)$.

The forward direction was just shown. Conversely, let $X$ be such a process. Then $\operatorname{Var}(X_0) = 0$, so $X_0 = 0$. For $s < t$, $\operatorname{Var}(X_t - X_s) = t - 2s + s = t - s$. For disjoint intervals $s < t \le u < v$,

$$
\operatorname{Cov}(X_t - X_s,\, X_v - X_u) = \min(t,v) - \min(t,u) - \min(s,v) + \min(s,u) = t - t - s + s = 0.
$$

The increments are jointly normal, and for jointly normal variables zero covariance implies independence. So all four defining properties hold. In practice this means: to show that a transformed process is a Brownian motion, it suffices to check that it is centred Gaussian, has covariance $\min(s,t)$, and has continuous paths.

## Four invariances

Each transformation below is a linear map applied to $W$, so the result is again a centred Gaussian process; only the covariance and continuity need checking. Let $c > 0$ and $s \ge 0$ be fixed.

- **Symmetry.** $X_t = -W_t$. Then $\operatorname{Cov}(X_u, X_v) = \min(u,v)$ trivially.
- **Scaling.** $X_t = c^{-1/2} W_{ct}$. Then $\operatorname{Cov}(X_u, X_v) = c^{-1}\min(cu, cv) = \min(u,v)$. Speeding up time by $c$ and shrinking space by $\sqrt{c}$ gives the same process.
- **Time shift.** $X_t = W_{s+t} - W_s$. Then $\operatorname{Cov}(X_u, X_v) = \min(s+u, s+v) - s - s + s = \min(u,v)$. Moreover $X$ is independent of $\mathcal{F}_s$, because its finite-dimensional vectors are built from increments after $s$. This is the **simple Markov property**: after any fixed time the process starts afresh, independently of the past.
- **Time inversion.** $X_t = t\,W_{1/t}$ for $t > 0$ and $X_0 = 0$. For $u, v > 0$, $\operatorname{Cov}(X_u, X_v) = uv\min(1/u, 1/v) = uv/\max(u,v) = \min(u,v)$.

Only time inversion needs care with continuity. On $(0, \infty)$ the path $t \mapsto t W_{1/t}$ is continuous; the question is whether $X_t \to 0$ as $t \downarrow 0$. Restricted to the positive rationals, $X$ and $W$ have the same finite-dimensional distributions, and the event $\{X_q \to 0 \text{ as } q \downarrow 0,\ q \in \mathbb{Q}\}$ is determined by countably many coordinates. Its probability is therefore the same as for $W$, namely 1. Continuity on $(0, \infty)$ then gives $X_t \to 0$ along all $t$. Substituting $u = 1/t$ yields the **law of large numbers for Brownian motion**:

$$
\lim_{u \to \infty} \frac{W_u}{u} = \lim_{t \downarrow 0} t\,W_{1/t} = 0 \quad \text{almost surely}.
$$

Time inversion swaps the behaviour of the path near $t = 0$ with its behaviour as $t \to \infty$: every statement about one end gives a statement about the other.

The figure applies one transformation at a time to fresh Brownian paths and draws 8 transformed paths on $t \in [0, 1]$ together with the curves $\pm\sqrt{t}$ and $\pm 2\sqrt{t}$. Choose scaling and move $c$ from 0.25 to 4, choose time inversion, symmetry, or time shift and move $s$ from 0 to 2, and press "New paths". The readouts, computed over 2000 paths, show the sample variance of $X_1$, close to 1, and the sample covariance of $(X_{0.5}, X_1)$, close to $\min(0.5, 1) = 0.5$, whichever transformation is selected.

*[Interactive figure: bm transformations](https://quantsandbox.dev/guide/stochastic/brownian-properties)*

## Worked example

Find $\mathbb{P}(W_1 > 0,\ W_2 > 0)$. The pair $(W_1, W_2)$ is bivariate normal with variances 1 and 2 and covariance $\min(1,2) = 1$, so its correlation is $\rho = 1/\sqrt{2} \approx 0.7071$. For a centred bivariate normal pair the probability that both coordinates are positive is $\tfrac14 + \arcsin(\rho)/(2\pi)$, hence

$$
\mathbb{P}(W_1 > 0,\ W_2 > 0) = \frac14 + \frac{\arcsin(1/\sqrt{2})}{2\pi} = \frac14 + \frac{\pi/4}{2\pi} = \frac38 = 0.375.
$$

Independent signs would give $0.25$; the extra $0.125$ comes from the shared stretch $[0, 1]$ of the two values.

## Path properties

The invariances lead to the following almost-sure properties. They are stated as theorems; the proofs are in any text on Brownian motion.

- **Law of the iterated logarithm** (Khinchin): $\limsup_{t \to \infty} W_t / \sqrt{2t\ln\ln t} = 1$. By time inversion, also $\limsup_{t \downarrow 0} W_t / \sqrt{2t\ln\ln(1/t)} = 1$.
- **Recurrence**: by the law of the iterated logarithm and symmetry, $\limsup_{t\to\infty} W_t = +\infty$ and $\liminf_{t\to\infty} W_t = -\infty$. Since paths are continuous, $W$ hits every level $a \in \mathbb{R}$, and does so at arbitrarily large times. Near $t = 0$ the small-time version shows that $W$ returns to 0 infinitely often in every interval $[0, \varepsilon]$.
- **Nowhere differentiability** (Paley, Wiener and Zygmund, 1933): with probability one, $t \mapsto W_t$ is differentiable at no $t$. Scaling explains why: $(W_{t+h} - W_t)/h \sim N(0, 1/h)$, so for any bound $K$, $\mathbb{P}(|(W_{t+h} - W_t)/h| \le K) = \mathbb{P}(|Z| \le K\sqrt{h}) \to 0$ as $h \downarrow 0$.

## Quadratic and total variation

Take partitions $0 = t_0 < t_1 < \cdots < t_n = t$ with mesh $\delta_n = \max_i (t_{i+1} - t_i) \to 0$, write $\Delta W_i = W_{t_{i+1}} - W_{t_i}$, $\Delta t_i = t_{i+1} - t_i$, and $Q_n = \sum_i (\Delta W_i)^2$. The theorem is that $Q_n \to t$ in $L^2$; one writes $[W]_t = t$. The proof is short. Since $\Delta W_i \sim N(0, \Delta t_i)$ independently, and $\operatorname{Var}(Z^2) = 2\sigma^4$ for $Z \sim N(0, \sigma^2)$,

$$
\mathbb{E}[Q_n] = \sum_i \Delta t_i = t, \qquad \operatorname{Var}(Q_n) = \sum_i 2\,\Delta t_i^2 \le 2t\,\delta_n \longrightarrow 0.
$$

So $\mathbb{E}[(Q_n - t)^2] \to 0$. (Along dyadic partitions the convergence is also almost sure.) The **total variation** is then infinite: $Q_n \le \max_i |\Delta W_i| \cdot \sum_i |\Delta W_i|$, and $\max_i |\Delta W_i| \to 0$ by uniform continuity of the path on $[0, t]$, so $\sum_i |\Delta W_i| \to \infty$ along a subsequence on which $Q_n \to t$ almost surely. A smooth function has finite total variation and zero quadratic variation; Brownian motion has the opposite. This is why $\int H\,dW$ cannot be defined path by path as an ordinary Stieltjes integral.

## Markov and strong Markov property

The time-shift invariance states the **Markov property**: for every fixed $s \ge 0$, the process $(W_{s+t} - W_s)_{t \ge 0}$ is a Brownian motion independent of $\mathcal{F}_s$. Equivalently, for bounded measurable $f$, $\mathbb{E}[f(W_{s+t}) \mid \mathcal{F}_s] = g(W_s)$ with $g(x) = \mathbb{E}[f(x + W_t)]$: the forecast depends on the past only through the present value.

The **strong Markov property** (Hunt, 1956) allows the fixed time $s$ to be replaced by a stopping time $\tau$: on $\{\tau < \infty\}$, the process $(W_{\tau+t} - W_\tau)_{t \ge 0}$ is a Brownian motion independent of $\mathcal{F}_\tau$. Think of it as a restart rule: whenever you stop using only the information available so far, what happens next is a fresh Brownian motion. A random time that looks into the future, such as the time of the maximum on $[0, 1]$, does not have this property. The next lesson uses the strong Markov property at the first time the path reaches a level.

### Worked example: Covariance, increments and scaling at two times

1. Covariance of $W_s$ and $W_t$ for $s = 0.5$, $t = 2$.
   $$\operatorname{Cov}(W_{0.5}, W_2) = \min(0.5, 2)$$ → **0.5**
2. The increment over $[0.5, 2]$ has variance equal to the elapsed time.
   $$\operatorname{Var}(W_2 - W_{0.5}) = 2 - 0.5$$ → **1.5**
3. The same from the covariance: $\operatorname{Var}(W_2) + \operatorname{Var}(W_{0.5}) - 2\operatorname{Cov}$.
   $$2 + 0.5 - 2(0.5)$$ → **1.5**
4. Scaling with $c = 2$: $\tfrac1c W_{c^2 t}$ at $t = 0.5$ has the variance of $W_{0.5}$.
   $$\operatorname{Var}\big(\tfrac12 W_{2}\big) = \tfrac14 \cdot 2$$ → **0.5**

## Summary

- Brownian motion: $W_0 = 0$, independent increments, $W_t - W_s \sim N(0, t-s)$, continuous paths; equivalently, a continuous centred Gaussian process with $\operatorname{Cov}(W_s, W_t) = \min(s,t)$.
- Symmetry $-W_t$, scaling $c^{-1/2}W_{ct}$, time shift $W_{s+t} - W_s$ and time inversion $t\,W_{1/t}$ are again Brownian motions; time inversion gives $W_t/t \to 0$.
- Paths are recurrent, obey the law of the iterated logarithm and are nowhere differentiable.
- Quadratic variation $[W]_t = t$, total variation infinite.
- Markov property at fixed times, strong Markov property at stopping times.

[Estimate the covariance of Brownian motion from simulated paths in the Stochastic Models studio](https://quantsandbox.dev/stochastic-models/covariance)

## Interactive labs

- [Stochastic Calculus Course: Random Walks to Brownian Motion](https://quantsandbox.dev/stochastic-models)
- [Brownian Motion Simulator with Drift & Volatility](https://quantsandbox.dev/brownian-motion)

## Practice questions

### 1. Using $\operatorname{Cov}(W_s, W_t) = \min(s,t)$, compute $\operatorname{Cov}(W_2,\, W_3 - W_1)$.

**Answer:** 1

$\operatorname{Cov}(W_2, W_3) - \operatorname{Cov}(W_2, W_1) = 2 - 1 = 1$. Equivalently, $W_2 = W_1 + (W_2 - W_1)$ and only the overlap $[1, 2]$ of the two intervals contributes, with variance 1.

### 2. Which of these processes is again a standard Brownian motion?

- a) $X_t = W_{2t}$
- b) $X_t = t\,W_{1/t}$ for $t > 0$, with $X_0 = 0$
- c) $X_t = \sqrt{t}\,W_1$
- d) $X_t = W_t^2 - t$

**Answer:** b) $X_t = t\,W_{1/t}$ for $t > 0$, with $X_0 = 0$

$t\,W_{1/t}$ is centred Gaussian with covariance $\min(s,t)$ and continuous at 0. $W_{2t}$ has variance $2t$; $\sqrt{t}\,W_1$ has covariance $\sqrt{st} \ne \min(s,t)$, so its increments are not independent; $W_t^2 - t$ is not Gaussian.

### 3. Split $[0, 1]$ into $n = 100$ equal steps. What is $\operatorname{Var}\big(\sum_i (\Delta W_i)^2\big)$?

**Answer:** 0.02

Each term has variance $2\,\Delta t^2 = 2 \times 0.01^2 = 0.0002$, and there are 100 independent terms: $100 \times 0.0002 = 0.02 = 2/n$. The mean is 1, so the sum concentrates at $[W]_1 = 1$.

---

Source: https://quantsandbox.dev/guide/stochastic/brownian-properties

Previous lesson: [Conditional Expectation and Martingales Explained](https://quantsandbox.dev/guide/stochastic/martingales)

Next lesson: [Reflection Principle: Maximum of Brownian Motion](https://quantsandbox.dev/guide/stochastic/reflection-principle)
