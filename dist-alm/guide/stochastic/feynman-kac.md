# Feynman–Kac Formula: From SDEs to PDEs

The generator of a diffusion, the backward equation, and how an expectation becomes the solution of a PDE. Free interactive lesson with worked examples.

A price can be written as a discounted expectation, as in "Change of measure and Girsanov's theorem", or as the solution of a partial differential equation. This lesson proves that the two descriptions agree. It uses Itô's formula from "Itô's lemma", the martingale property of the integral from "The Itô integral" and conditional expectations from "Conditional expectation and martingales".

## Diffusions and their generator

Let $X$ solve the stochastic differential equation

$$
dX_s = \mu(X_s)\,ds + \sigma(X_s)\,dW_s,
$$

where $W$ is a Brownian motion and the coefficients $\mu, \sigma : \mathbb{R} \to \mathbb{R}$ are Lipschitz continuous. Under this assumption the equation has a unique solution for every starting point, and $X$ is a Markov process: given $X_t$, the future of $X$ does not depend on the earlier path. Write $\mathbb{E}_{t,x}[\,\cdot\,] = \mathbb{E}[\,\cdot \mid X_t = x]$.

The **generator** of $X$ is the operator that gives the expected rate of change of $f(X)$ at a point. For twice continuously differentiable $f$ with compact support,

$$
\mathcal{L}f(x) = \lim_{h \downarrow 0} \frac{\mathbb{E}_{0,x}[f(X_h)] - f(x)}{h}.
$$

Itô's lemma computes it. Integrating $df(X_s)$ over $[0, h]$,

$$
f(X_h) = f(x) + \int_0^h \Big(\mu f' + \tfrac12 \sigma^2 f''\Big)(X_s)\,ds + \int_0^h \sigma(X_s) f'(X_s)\,dW_s.
$$

The integrand $\sigma f'$ is bounded on the support of $f$, so the Itô integral has mean zero. Taking expectations, dividing by $h$ and letting $h \to 0$ (the $ds$-integrand is continuous) gives

$$
\mathcal{L}f(x) = \mu(x)\,f'(x) + \tfrac12\,\sigma^2(x)\,f''(x).
$$

The drift contributes a first-derivative term and the diffusion a second-derivative term; the $\tfrac12\sigma^2$ is the Itô correction. Examples: Brownian motion with volatility $\sigma$ has $\mathcal{L} = \tfrac12\sigma^2\,\partial_{xx}$; geometric Brownian motion under $\mathbb{Q}$ has $\mathcal{L}f = rx\,f' + \tfrac12\sigma^2 x^2 f''$. The same computation without the limit gives **Dynkin's formula**, $\mathbb{E}_{0,x}[f(X_t)] = f(x) + \mathbb{E}_{0,x}\big[\int_0^t \mathcal{L}f(X_s)\,ds\big]$.

## The Kolmogorov backward equation

Fix a horizon $T$ and a payoff function $g$, and define $v(t, x) = \mathbb{E}_{t,x}[g(X_T)]$. By the Markov property, $v(s, X_s) = \mathbb{E}[g(X_T) \mid \mathcal{F}_s]$ for $t \le s \le T$, so $s \mapsto v(s, X_s)$ is a martingale. If $v$ is once differentiable in $t$ and twice in $x$, Itô's lemma gives

$$
dv(s, X_s) = \big(\partial_s v + \mathcal{L}v\big)(s, X_s)\,ds + \sigma(X_s)\,\partial_x v(s, X_s)\,dW_s.
$$

A continuous martingale whose $ds$-part is not identically zero cannot exist, since a process of finite variation that is also a continuous martingale is constant. So the $ds$-term must vanish, which gives the **Kolmogorov backward equation**

$$
\partial_t v + \mathcal{L}v = 0 \quad \text{on } [0, T) \times \mathbb{R}, \qquad v(T, x) = g(x).
$$

It runs backwards: the terminal condition is given at $T$ and the equation is solved towards $t = 0$. If $X$ has a transition density $p(t, x; T, y)$, that density solves the backward equation in $(t, x)$, and in the forward variables $(T, y)$ it solves the **Kolmogorov forward** (Fokker–Planck) **equation**

$$
\partial_T p = -\partial_y\big(\mu(y)\,p\big) + \tfrac12\,\partial_{yy}\big(\sigma^2(y)\,p\big).
$$

The backward equation describes how an expected payoff depends on the starting point; the forward equation describes how probability mass spreads out from a fixed starting point.

## The Feynman–Kac theorem

Add a discount rate $r(x) \ge 0$, continuous. **Theorem (Feynman–Kac).** Let $\mu, \sigma$ be Lipschitz and let $u(t, x)$, once continuously differentiable in $t$ and twice in $x$, solve

$$
\partial_t u + \mu(x)\,\partial_x u + \tfrac12\sigma^2(x)\,\partial_{xx} u - r(x)\,u = 0 \quad \text{on } [0, T) \times \mathbb{R}, \qquad u(T, x) = g(x).
$$

Assume also that $\mathbb{E}_{t,x}\big[\int_t^T \big(\sigma(X_s)\,\partial_x u(s, X_s)\big)^2 ds\big] < \infty$, which holds, for example, if $\sigma\,\partial_x u$ is bounded. Then

$$
u(t, x) = \mathbb{E}_{t,x}\!\left[ e^{-\int_t^T r(X_s)\,ds}\, g(X_T) \right].
$$

**Proof.** Fix $(t, x)$ and set $D_s = e^{-\int_t^s r(X_v)\,dv}$ and $Y_s = D_s\,u(s, X_s)$ for $s \in [t, T]$. The factor $D$ has finite variation, $dD_s = -r(X_s)\,D_s\,ds$, so the product rule has no cross term. With Itô's lemma for $u(s, X_s)$,

$$
dY_s = D_s\big(\partial_s u + \mathcal{L}u - r u\big)(s, X_s)\,ds + D_s\,\sigma(X_s)\,\partial_x u(s, X_s)\,dW_s = D_s\,\sigma(X_s)\,\partial_x u(s, X_s)\,dW_s.
$$

The $ds$-term is zero because $u$ solves the equation. Since $0 < D_s \le 1$, the integrability assumption makes $Y$ an Itô integral of an $\mathcal{L}^2$ integrand, hence a martingale. Therefore $u(t, x) = Y_t = \mathbb{E}_{t,x}[Y_T] = \mathbb{E}_{t,x}\big[D_T\,g(X_T)\big]$, using $u(T, \cdot) = g$. $\square$

The proof also shows uniqueness: two solutions in the integrability class equal the same expectation. The converse direction, that the expectation is smooth enough to solve the equation, needs more, for example smooth coefficients and $\sigma$ bounded away from zero; under such conditions the expectation is the solution. Think of $u(s, X_s)$ as a fair value carried along the path: discounted, it neither drifts up nor down, so its value today is the expected discounted value at maturity.

> Feynman–Kac: the solution of $\partial_t u + \mathcal{L}u - ru = 0$, $u(T, \cdot) = g$, is $u(t, x) = \mathbb{E}_{t,x}\big[e^{-\int_t^T r(X_s)ds} g(X_T)\big]$. The proof is Itô's lemma plus the fact that a $dW$-integral is a martingale.

## The heat equation

Take $\mu = 0$, constant $\sigma$ and $r = 0$. Then $X_T = x + \sigma(W_T - W_t)$, and with the time to maturity $\tau = T - t$ the theorem reads

$$
\partial_\tau u = \tfrac12\sigma^2\,\partial_{xx} u, \quad u(0, x) = g(x) \qquad \Longrightarrow \qquad u(\tau, x) = \mathbb{E}\big[g(x + \sigma W_\tau)\big] = \int_{\mathbb{R}} g(y)\,\frac{1}{\sqrt{2\pi\sigma^2\tau}}\,e^{-\frac{(y - x)^2}{2\sigma^2\tau}}\,dy.
$$

This is the heat equation, and the solution is the payoff smoothed by a Gaussian kernel of variance $\sigma^2\tau$. Differentiating the kernel confirms that it solves the equation. Three payoffs have closed forms, with $s = \sigma\sqrt{\tau}$ and $d = (x - 1)/s$:

- Square, $g(x) = x^2$: $u = x^2 + \sigma^2\tau$. Check: $\partial_\tau u = \sigma^2$ and $\tfrac12\sigma^2\,\partial_{xx}u = \tfrac12\sigma^2 \cdot 2 = \sigma^2$.
- Digital, $g(x) = \mathbf{1}\{x > 1\}$: $u = \Phi(d)$, the probability that $x + \sigma W_\tau$ ends above 1.
- Call, $g(x) = (x - 1)^+$: $u = (x - 1)\,\Phi(d) + s\,\varphi(d)$, the Bachelier price with zero interest.

Worked numbers at $x = 1$ with $\tau = 0.5$ and $\sigma = 1$, so $s = \sqrt{0.5} \approx 0.7071$ and $d = 0$: the call is worth $s\,\varphi(0) = 0.7071 \times 0.3989 \approx 0.2821$, the digital $\Phi(0) = 0.5$, the square $1 + 0.5 = 1.5$. A Monte Carlo estimate from 2000 draws of $W_\tau$ has standard error equal to the payoff's standard deviation over $\sqrt{2000}$: about $0.4128/44.72 \approx 0.0092$ for the call, $0.5/44.72 \approx 0.0112$ for the digital and $\sqrt{2.5}/44.72 \approx 0.0354$ for the square.

The figure solves this heat equation for the chosen payoff: call $(x - 1)^+$, digital $\mathbf{1}\{x > 1\}$ or square $x^2$. Against $x$ from $-2$ to $4$ it plots the payoff $g$ (dashed), the exact solution $u(\tau, x)$ from the Gaussian integral (line), and Monte Carlo estimates at 13 points $x$ from 2000 draws each (dots). Increase $\tau$ or $\sigma$ and note that the kink of the call and the jump of the digital are smoothed out more, while the square is shifted up by $\sigma^2\tau$. The dots stay on the line within sampling noise. The readouts at $x = 1$ give the exact $u$, the Monte Carlo estimate and its standard error.

*[Interactive figure: feynman kac](https://quantsandbox.dev/guide/stochastic/feynman-kac)*

## The Black–Scholes equation

By "Change of measure and Girsanov's theorem", under $\mathbb{Q}$ the stock follows $dS_s = rS_s\,ds + \sigma S_s\,d\tilde W_s$ with constant $r$ and $\sigma$, and the price of a payoff $g(S_T)$ is $V(t, S) = \mathbb{E}^{\mathbb{Q}}_{t,S}\big[e^{-r(T - t)} g(S_T)\big]$. This is a Feynman–Kac expectation with $\mu(S) = rS$, $\sigma(S) = \sigma S$ and constant discount rate $r$, so $V$ solves the **Black–Scholes equation**

$$
\frac{\partial V}{\partial t} + rS\,\frac{\partial V}{\partial S} + \frac{1}{2}\sigma^2 S^2\,\frac{\partial^2 V}{\partial S^2} - rV = 0, \qquad V(T, S) = g(S).
$$

For a call, $g(S) = (S - K)^+$, and the expectation is the formula of "The Black–Scholes formula". The real-world drift $\mu$ does not appear anywhere, because the generator is taken under $\mathbb{Q}$. The substitution $x = \ln S$ turns the generator into $(r - \tfrac12\sigma^2)\,\partial_x + \tfrac12\sigma^2\,\partial_{xx}$, which has constant coefficients; after removing the drift and the discounting the equation becomes the heat equation, which is why the Black–Scholes formula is built from the normal CDF $N(\cdot)$.

Numerical check with $S = K = 100$, $r = 5\%$, $\sigma = 20\%$, $T = 1$: the call price is $C = 10.4506$ with $\Delta = N(d_1) = 0.6368$, $\Gamma = 0.018762$ and $\partial C/\partial t = -6.4140$. The terms of the equation are $-6.4140 + 3.1842 + 3.7524 - 0.5225 = 0.0001$, zero up to rounding.

## Two ways to compute one number

Feynman–Kac gives two routes to the same price. The **Monte Carlo** route simulates many paths of $X$ under $\mathbb{Q}$, averages the discounted payoffs and reports a standard error that falls like $1/\sqrt{N}$ in the number of paths, whatever the dimension of $X$. The **PDE** route discretises $x$ and $t$ on a grid and steps the equation backwards from $u(T, \cdot) = g$ with finite differences; one solve gives $u$ at every grid point, and the Greeks come from differences of neighbouring values, but the grid grows exponentially with the dimension of $X$. In practice PDE methods dominate for one to three state variables and Monte Carlo for more. Any difference between the two answers is numerical error, sampling error on one side and grid error on the other, not a difference in the model.

### Worked example: The square payoff at x = 1

1. With $\sigma = 1$ and $\tau = 0.5$, the Gaussian kernel has variance $\sigma^2\tau$.
   $$\mathbb{E}[(\sigma W_\tau)^2] = \sigma^2\tau$$ → **0.5**
2. Expand $(x + \sigma W_\tau)^2$; the cross term has mean zero.
   $$u(\tau, 1) = 1^2 + 2 \cdot 1 \cdot 0 + 0.5$$ → **1.5**
3. The figure's Monte Carlo readout at $x = 1$ should sit within one standard error of this: the payoff variance is 2.5, over 2000 draws.
   $$\sqrt{2.5}/\sqrt{2000}$$ → **0.0354**

## Summary

- A diffusion $dX = \mu(X)\,ds + \sigma(X)\,dW$ has generator $\mathcal{L}f = \mu f' + \tfrac12\sigma^2 f''$, computed from Itô's lemma.
- $v(t, x) = \mathbb{E}_{t,x}[g(X_T)]$ solves the Kolmogorov backward equation $\partial_t v + \mathcal{L}v = 0$, $v(T, \cdot) = g$; transition densities solve the forward equation in $(T, y)$.
- Feynman–Kac: the solution of $\partial_t u + \mathcal{L}u - ru = 0$, $u(T, \cdot) = g$, is the discounted expectation of $g(X_T)$. Proof: the discounted value $e^{-\int r}u(s, X_s)$ has no drift, so it is a martingale.
- With $\mu = 0$, constant $\sigma$ and $r = 0$ it is the heat equation, solved by Gaussian smoothing of the payoff. Under $\mathbb{Q}$ with GBM it is the Black–Scholes equation.
- Monte Carlo and finite-difference pricing compute the same number from the two sides of the theorem.

> The next lesson, "Monte Carlo option pricing", takes the expectation side: it simulates terminal prices under $\mathbb{Q}$ and studies the standard error of the average.

[Explore how the solution of the Black–Scholes equation depends on S, σ and T in the Black–Scholes lab](https://quantsandbox.dev/black-scholes)

## Interactive labs

- [Black–Scholes Calculator & Option Greeks Visualizer](https://quantsandbox.dev/black-scholes)
- [Monte Carlo Option Pricing Simulator](https://quantsandbox.dev/monte-carlo)

## Practice questions

### 1. The Ornstein–Uhlenbeck process solves $dX_s = -\kappa X_s\,ds + \sigma\,dW_s$. What is its generator?

- a) $\mathcal{L}f = -\kappa x\,f' + \tfrac12\sigma^2 f''$
- b) $\mathcal{L}f = -\kappa x\,f' + \sigma f''$
- c) $\mathcal{L}f = -\kappa f' + \tfrac12\sigma^2 x^2 f''$
- d) $\mathcal{L}f = -\kappa x\,f' + \tfrac12\sigma^2 f'' - \kappa f$

**Answer:** a) $\mathcal{L}f = -\kappa x\,f' + \tfrac12\sigma^2 f''$

With $\mu(x) = -\kappa x$ and $\sigma(x) = \sigma$, the formula $\mathcal{L}f = \mu f' + \tfrac12\sigma^2 f''$ gives $-\kappa x\,f' + \tfrac12\sigma^2 f''$. A zero-order term such as $-\kappa f$ only appears when there is discounting.

### 2. Solve $\partial_\tau u = \tfrac12\sigma^2\,\partial_{xx} u$ with $u(0, x) = x^2$, $\sigma = 0.5$. What is $u(\tau, x)$ at $\tau = 2$, $x = 2$?

**Answer:** 4.5

By Feynman–Kac, $u = \mathbb{E}[(x + \sigma W_\tau)^2] = x^2 + \sigma^2\tau = 4 + 0.25 \times 2 = 4.5$.

### 3. In the Black–Scholes model with $S = 100$, $r = 5\%$, $\sigma = 20\%$, a call has $C = 10.4506$, $\Delta = 0.6368$ and $\Gamma = 0.018762$. Use the Black–Scholes equation to find $\partial C/\partial t$ (per year).

**Answer:** -6.414

$\partial C/\partial t = rC - rS\Delta - \tfrac12\sigma^2 S^2\Gamma = 0.5225 - 3.1840 - 3.7524 \approx -6.414$. The option loses value as time passes, at a rate fixed by its delta and gamma.

---

Source: https://quantsandbox.dev/guide/stochastic/feynman-kac

Previous lesson: [Itô's Lemma Explained: Quadratic Variation and Drift](https://quantsandbox.dev/guide/stochastic/ito-lemma)

Next lesson: [Girsanov's Theorem and Change of Measure Explained](https://quantsandbox.dev/guide/stochastic/change-of-measure)
