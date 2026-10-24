# Correlated Brownian Motions and Cholesky Decomposition

Building correlated Brownian motions with a Cholesky factor, the two-dimensional Itô rule, and where correlation enters Heston and basket pricing.

Everything so far used one Brownian motion at a time. Real models rarely do. A stock and its volatility move together, a basket option depends on several assets at once, and a portfolio is exactly the situation of "Diversification and correlation". This lesson builds two Brownian motions with a chosen correlation, from the properties in "Properties of Brownian motion", shows how the same construction extends to many assets, and states the two-dimensional version of the rule in "Itô's lemma". It also says where correlation enters pricing models and how it is simulated with the scheme of "Simulating SDEs: the Euler–Maruyama scheme".

## Two Brownian motions with correlation ρ

Two standard Brownian motions $W_1$ and $W_2$ have **correlation** $\rho \in [-1, 1]$ if their increments over a short interval $dt$ have correlation $\rho$. In the language of quadratic variation this is a single rule for the cross term:

$$
d\langle W_1, W_2 \rangle_t = \rho\,dt, \qquad d\langle W_i \rangle_t = dt.
$$

It is easy to build such a pair from two **independent** Brownian motions $W_1$ and $W_\perp$. Keep $W_1$ and mix the other in:

$$
W_2 = \rho\,W_1 + \sqrt{1 - \rho^2}\;W_\perp.
$$

Then $W_2$ has independent normal increments with variance $(\rho^2 + 1 - \rho^2)\,dt = dt$, so it is a standard Brownian motion in its own right, and its increment covaries with that of $W_1$ by $\rho\,dt$. At $\rho = 0$ the two are independent. At $\rho = \pm 1$ they are the same path or its mirror image. The figure draws both paths from one set of random shocks and lets you move $\rho$. Start at the default $\rho = -0.7$ and watch the paths mostly mirror each other; the sample correlation of the increments is noisy for a path with only 250 steps, but the construction fixes the exact value of $\langle W_1, W_2 \rangle_T = \rho\,T$, which is $-0.70$ for $T = 1$.

*[Interactive figure: correlated paths](https://quantsandbox.dev/guide/stochastic/correlated-brownian-motions)*

## The Cholesky factor

The construction above is a matrix product. Write the independent shocks of one step as a vector $\varepsilon = (\varepsilon_1, \varepsilon_2)$ of standard normals and the correlated ones as $Z = L\,\varepsilon$ with

$$
L = \begin{pmatrix} 1 & 0 \\ \rho & \sqrt{1 - \rho^2} \end{pmatrix}, \qquad L L^{\top} = \begin{pmatrix} 1 & \rho \\ \rho & 1 \end{pmatrix}.
$$

This $L$ is the **Cholesky factor** of the correlation matrix. For $n$ assets with correlation matrix $C$, the same idea works: find a lower-triangular $L$ with $L L^{\top} = C$ and set $Z = L\,\varepsilon$ for independent $\varepsilon$. Such an $L$ exists exactly when $C$ is **positive definite**, which is a real restriction. A table of pairwise correlations chosen independently, say $\rho_{12} = \rho_{13} = 0.9$ and $\rho_{23} = -0.9$, can fail it, and then no set of random variables has those correlations. The algorithm reports the failure when a square root of a non-positive number would be needed; the figure's readout $\sqrt{1 - \rho^2}$ is that square root for two assets, and it vanishes at $\rho = \pm 1$.

## The two-dimensional Itô rule

Let $dX = \mu_1\,dt + \sigma_1\,dW_1$ and $dY = \mu_2\,dt + \sigma_2\,dW_2$ with $d\langle W_1, W_2 \rangle = \rho\,dt$. For a smooth function $f(t, x, y)$, "Itô's lemma" extends by one extra term, the cross term, because $dX\,dY = \rho\,\sigma_1 \sigma_2\,dt$:

$$
df = f_t\,dt + f_x\,dX + f_y\,dY + \tfrac{1}{2} f_{xx}\,\sigma_1^2\,dt + \tfrac{1}{2} f_{yy}\,\sigma_2^2\,dt + f_{xy}\,\rho\,\sigma_1 \sigma_2\,dt.
$$

With $f(x, y) = x\,y$ this is the **product rule** for correlated processes:

$$
d(XY) = X\,dY + Y\,dX + \rho\,\sigma_1 \sigma_2\,dt.
$$

For two Brownian motions themselves ($X = W_1$, $Y = W_2$, $\sigma_1 = \sigma_2 = 1$) the extra term is $\rho\,dt$. The product $W_1 W_2$ is therefore not a martingale; its drift is $\rho$, and taking expectations gives $E[W_1(T)\,W_2(T)] = \rho\,T$.

## Where correlation enters

In the Heston model of "Stochastic volatility and the Heston model", the price and the variance are driven by Brownian motions with correlation $\rho$:

$$
dS = \mu S\,dt + \sqrt{v}\,S\,dW_1, \qquad dv = \kappa(\theta - v)\,dt + \xi\sqrt{v}\,dW_2, \qquad d\langle W_1, W_2 \rangle = \rho\,dt.
$$

Equity indices fall when volatility rises, so the calibrated $\rho$ is negative, typically between $-0.5$ and $-0.9$. That negative sign is what tilts the implied volatility smile into a skew. Correlation also drives **basket and spread options**, whose payoff depends on several assets: the variance of a weighted sum includes $2\,w_i w_j\,\rho_{ij}\,\sigma_i \sigma_j$ terms, exactly as the portfolio variance does. A copula would let the dependence differ from this linear one; we do not need it here.

## Simulating correlated assets

In the Euler scheme the only change is the shock. At each step draw independent standard normals $\varepsilon_1, \varepsilon_2$ and use $Z_1 = \varepsilon_1$, $Z_2 = \rho\,\varepsilon_1 + \sqrt{1 - \rho^2}\,\varepsilon_2$ in place of the two independent shocks. Everything else, including the pricing average of "Monte Carlo option pricing", stays as it was.

### Worked example: Correlated shocks for ρ = −0.7, and the product rule

1. The weight of the independent shock is the second Cholesky entry.
   $$L_{22} = \sqrt{1 - (-0.7)^2}$$ → **0.7141**
2. Draw $\varepsilon_1 = 0.8$ and $\varepsilon_2 = -0.3$. The first correlated shock is $Z_1 = \varepsilon_1 = 0.8$; the second mixes both.
   $$Z_2 = \rho\,\varepsilon_1 + L_{22}\,\varepsilon_2 = -0.7 \times 0.8 + 0.7141 \times (-0.3)$$ → **-0.7742**
3. The product rule gives $d(W_1 W_2) = W_2\,dW_1 + W_1\,dW_2 + \rho\,dt$. The two stochastic integrals have mean zero, so the expected product after $T = 1$ is $\rho T$.
   $$E[W_1(1)\,W_2(1)] = \rho \cdot 1$$ → **-0.7**

## Summary

- Two Brownian motions have correlation $\rho$ when $d\langle W_1, W_2 \rangle = \rho\,dt$; build them as $W_2 = \rho W_1 + \sqrt{1 - \rho^2}\,W_\perp$.
- For $n$ assets, correlated shocks are $Z = L\varepsilon$, where $L L^{\top} = C$ is the Cholesky factor, which exists exactly when $C$ is positive definite.
- The two-dimensional Itô rule adds the cross term $f_{xy}\,\rho\,\sigma_1 \sigma_2\,dt$, which gives $d(XY) = X\,dY + Y\,dX + \rho\,\sigma_1 \sigma_2\,dt$.
- Correlation drives the skew in Heston (with $\rho < 0$ for equities) and the price of basket and spread options.

> The next lesson, "Mean reversion: Ornstein–Uhlenbeck and Vasicek", returns to one-dimensional models and adds a pull towards a long-run level.

[See the effect of the price–variance correlation in the Heston lab](https://quantsandbox.dev/heston)

## Interactive labs

- [Heston Stochastic Volatility Model Simulator](https://quantsandbox.dev/heston)
- [Monte Carlo Option Pricing Simulator](https://quantsandbox.dev/monte-carlo)

## Practice questions

### 1. Two Brownian motions have correlation $\rho = 0.6$. In the construction $W_2 = \rho W_1 + \sqrt{1-\rho^2}\,W_\perp$, what is the weight of the independent motion $W_\perp$?

**Answer:** 0.8

The weight is $\sqrt{1 - \rho^2} = \sqrt{1 - 0.36} = \sqrt{0.64} = 0.8$. Note that $0.6^2 + 0.8^2 = 1$, so the variance stays 1.

### 2. In the Heston model, which sign of the correlation $\rho$ between the price and variance shocks produces the equity-style skew, with low strikes pricing at higher implied volatility?

- a) Negative
- b) Zero
- c) Positive
- d) The sign does not matter

**Answer:** a) Negative

Negative $\rho$ means volatility tends to rise when the price falls. Down-moves then come with larger swings, so low-strike options are worth more, which is the observed skew.

---

Source: https://quantsandbox.dev/guide/stochastic/correlated-brownian-motions

Previous lesson: [Euler–Maruyama Scheme: Simulating SDEs Step by Step](https://quantsandbox.dev/guide/stochastic/sde-simulation)

Next lesson: [Ornstein–Uhlenbeck Process and the Vasicek Model](https://quantsandbox.dev/guide/stochastic/mean-reversion)
