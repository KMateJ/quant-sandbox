# Ornstein–Uhlenbeck Process and the Vasicek Model

A process pulled toward a long-run level, its exact solution and stationary distribution, and the short rate in the Vasicek model.

Brownian motion from "Random walks and Brownian motion" and the stock price model built on it wander without limit: their variance grows with the horizon, and nothing pulls them back. Interest rates, volatility and credit spreads behave differently. They fluctuate, but over years they tend to return to a typical level. This lesson builds the standard model of such a process, solves it exactly with the tools of "Itô's lemma", and applies it to the short interest rate in the Vasicek model.

## The Ornstein–Uhlenbeck process

Let $X_t$ be the quantity of interest, for example an interest rate. The **Ornstein–Uhlenbeck process** is the Itô process

$$
dX_t = \kappa\,(\theta - X_t)\,dt + \sigma\,dW_t,
$$

with three constant parameters:

- $\theta$ is the **long-run level**, the value the process is pulled towards.
- $\kappa > 0$ is the **speed of mean reversion**: how strongly the gap $\theta - X_t$ is closed per unit of time.
- $\sigma > 0$ is the volatility: the size of the random shocks, as in "Itô's lemma".

The drift has the sign of the gap. Above $\theta$ the drift is negative and pushes the process down; below $\theta$ it is positive and pushes it up. Think of a ball attached to a spring in a stream of random kicks: the further it is pulled from its rest point, the harder the spring pulls back. Unlike geometric Brownian motion, the volatility here does not depend on the level, so the shocks have the same size everywhere.

## The deterministic part

Switch off the noise, $\sigma = 0$. The equation becomes the ordinary differential equation $dx/dt = \kappa(\theta - x)$, whose solution is

$$
x(t) = \theta + (x_0 - \theta)\,e^{-\kappa t}.
$$

The gap to $\theta$ shrinks exponentially. The time after which half of the gap is left solves $e^{-\kappa t} = 1/2$ and is called the **half-life**:

$$
t_{1/2} = \frac{\ln 2}{\kappa}.
$$

It does not depend on how large the gap is. With $\kappa = 0.5$ the half-life is $\ln 2 / 0.5 \approx 1.39$ years; with $\kappa = 5$ it is about 35 trading days.

## Exact solution

The trick is to remove the pull towards $\theta$ by a change of variable. Apply Itô's lemma to $Y_t = f(t, X_t) = e^{\kappa t} X_t$, with $\partial f/\partial t = \kappa e^{\kappa t} x$, $\partial f/\partial x = e^{\kappa t}$ and $\partial^2 f/\partial x^2 = 0$. Since the second derivative is zero, there is no Itô correction:

$$
dY_t = \kappa e^{\kappa t} X_t\,dt + e^{\kappa t}\big(\kappa(\theta - X_t)\,dt + \sigma\,dW_t\big) = \kappa\theta\,e^{\kappa t}\,dt + \sigma e^{\kappa t}\,dW_t.
$$

The terms with $X_t$ cancel, and the right-hand side no longer depends on $Y$. Add up the increments over $[0, t]$:

$$
e^{\kappa t} X_t = X_0 + \theta\,\big(e^{\kappa t} - 1\big) + \sigma \int_0^t e^{\kappa s}\,dW_s.
$$

Multiplying by $e^{-\kappa t}$ gives the solution:

$$
X_t = \theta + (X_0 - \theta)\,e^{-\kappa t} + \sigma \int_0^t e^{-\kappa (t-s)}\,dW_s.
$$

The first two terms are the deterministic path from above. The integral adds up the shocks, each weighted by $e^{-\kappa(t-s)}$: a shock that happened long ago has mostly been pulled back and counts little.

## Mean, variance and stationary distribution

The integral of a deterministic function against $dW$ is normal with mean zero, and by the **Itô isometry** its variance is the integral of the squared weight: $\operatorname{Var}\big(\int_0^t g(s)\,dW_s\big) = \int_0^t g(s)^2\,ds$. With $g(s) = \sigma e^{-\kappa(t-s)}$ this gives

$$
\mathbb{E}[X_t] = \theta + (X_0 - \theta)\,e^{-\kappa t}, \qquad \operatorname{Var}(X_t) = \frac{\sigma^2}{2\kappa}\big(1 - e^{-2\kappa t}\big).
$$

So $X_t$ is normally distributed for every $t$. As $t \to \infty$ the mean tends to $\theta$ and the variance stops growing. Compare Brownian motion, whose variance $\sigma^2 t$ grows forever.

> Stationary distribution of the Ornstein–Uhlenbeck process: $X_\infty \sim N\big(\theta,\ \sigma^2/(2\kappa)\big)$. Faster mean reversion (larger $\kappa$) means a narrower long-run spread around $\theta$.

## Exact simulation and the AR(1) form

The same calculation over one step of length $\Delta t$, started from the current value, gives an exact simulation scheme with no discretisation error. With $Z \sim N(0,1)$ drawn independently at each step:

$$
X_{t+\Delta t} = \theta + (X_t - \theta)\,e^{-\kappa\Delta t} + \sigma\sqrt{\frac{1 - e^{-2\kappa\Delta t}}{2\kappa}}\;Z.
$$

Sampled at a fixed step, the process is a first-order autoregression, AR(1): $X_{n+1} = a + \phi X_n + \varepsilon_{n+1}$ with $\phi = e^{-\kappa\Delta t}$ and $a = \theta(1 - \phi)$. Regressing observed values on their previous values therefore estimates the parameters: $\kappa = -\ln\phi / \Delta t$ and $\theta = a/(1-\phi)$.

## Worked example

Take $\kappa = 0.5$, $\theta = 4\%$, $\sigma = 1\%$ and a starting level $X_0 = 8\%$, with time in years.

- Half-life: $\ln 2 / 0.5 \approx 1.39$ years.
- After 1 year: mean $4\% + 4\% \cdot e^{-0.5} \approx 6.43\%$, standard deviation $0.01\sqrt{(1 - e^{-1})/1} \approx 0.80\%$.
- After 5 years: mean $4\% + 4\% \cdot e^{-2.5} \approx 4.33\%$, standard deviation $\approx 0.997\%$.
- Stationary standard deviation: $\sigma/\sqrt{2\kappa} = 0.01/\sqrt{1} = 1\%$.

After five years the starting level is almost forgotten: the mean is close to $\theta$ and the spread is already 99.7% of its long-run value.

The figure fixes $\theta = 4\%$ and $\sigma = 1\%$ over a horizon of 5 years. Sliders set the speed of mean reversion $\kappa$ (0.1 to 5) and the starting level $X_0$ (0% to 10%), and "New paths" draws fresh paths. The chart shows several simulated paths, the expected path $\theta + (X_0 - \theta)e^{-\kappa t}$ and bands at $\pm 2$ standard deviations. The readouts give the half-life, the stationary standard deviation $\sigma/\sqrt{2\kappa}$, the expected level after 5 years and the 5-year zero-coupon yield in the Vasicek model with $r_0 = X_0$. Raise $\kappa$ and the paths snap to $\theta$ while the band narrows; lower it towards 0.1 and the paths look almost like Brownian motion. Then start far from $\theta$, at 0% or 10%, and watch the expected path decay.

*[Interactive figure: ou paths](https://quantsandbox.dev/guide/stochastic/mean-reversion)*

## The Vasicek model

The **short rate** $r_t$ is the continuously compounded rate for borrowing over an instant. The **Vasicek model** assumes that it follows an Ornstein–Uhlenbeck process, $dr_t = \kappa(\theta - r_t)\,dt + \sigma\,dW_t$, under the risk-neutral measure $\mathbb{Q}$. A **zero-coupon bond** pays 1 at time $T$, and its price is the expected discount factor along the random path of the short rate, $P(0,T) = \mathbb{E}^{\mathbb{Q}}\big[e^{-\int_0^T r_s\,ds}\big]$. Because the integral of a normal process is normal, this expectation has a closed form:

$$
P(0,T) = A(T)\,e^{-B(T)\,r_0}, \qquad B(T) = \frac{1 - e^{-\kappa T}}{\kappa},
$$

$$
\ln A(T) = \left(\theta - \frac{\sigma^2}{2\kappa^2}\right)\big(B(T) - T\big) - \frac{\sigma^2 B(T)^2}{4\kappa}.
$$

$B(T)$ measures how much the current short rate matters: for short maturities it is close to $T$, while for long maturities it levels off at $1/\kappa$, because $r_0$ is forgotten. The continuously compounded zero-coupon yield is $y(T) = -\ln P(0,T)/T$.

In the example above with $r_0 = 8\%$ and $T = 5$: $B(5) = (1 - e^{-2.5})/0.5 \approx 1.836$, $A(5) \approx 0.8815$, so $P(0,5) \approx 0.8815\,e^{-1.836 \cdot 0.08} \approx 0.7611$ and the 5-year yield is $-\ln(0.7611)/5 \approx 5.46\%$. The yield lies between $r_0$ and $\theta$, since the market expects the rate to fall back towards 4%.

As $T$ grows the yield tends to $\theta - \sigma^2/(2\kappa^2)$, here $3.98\%$. If $r_0$ is below this level the model produces a rising curve, if above an inverted (falling) curve, and for $r_0$ just above it a slightly humped one that rises briefly before falling. The lesson "Spot rates, forward rates and the yield curve" describes these shapes as observed in the market; the Vasicek model can produce only these few, which is why practitioners often fit richer curves directly. The Yield Curve lab shows such market curves.

The main drawback is that a normal short rate can become negative with positive probability. The Cox–Ingersoll–Ross (CIR) model avoids this by making the volatility proportional to $\sqrt{r_t}$.

### Worked example: The OU distribution after one year

1. With $\kappa = 0.5$, $\theta = 4\%$, $X_0 = 8\%$, the expected level after one year (in %).
   $$\theta + (X_0 - \theta)e^{-\kappa} = 4 + 4e^{-0.5}$$ → **6.43**
2. Standard deviation after one year with $\sigma = 1\%$ (in %).
   $$\sigma\sqrt{\frac{1 - e^{-2\kappa}}{2\kappa}} = 1 \cdot \sqrt{1 - e^{-1}}$$ → **0.795**
3. Half-life of the expected gap, in years.
   $$t_{1/2} = \ln 2/\kappa$$ → **1.386**

## Summary

- The Ornstein–Uhlenbeck process $dX = \kappa(\theta - X)\,dt + \sigma\,dW$ is pulled towards the long-run level $\theta$ with speed $\kappa$; the expected gap halves every $\ln 2/\kappa$.
- Itô's lemma applied to $e^{\kappa t}X_t$ gives the exact solution; $X_t$ is normal with mean $\theta + (X_0 - \theta)e^{-\kappa t}$ and variance $\tfrac{\sigma^2}{2\kappa}(1 - e^{-2\kappa t})$.
- The variance stays bounded and the stationary distribution is $N(\theta, \sigma^2/(2\kappa))$; sampled at a fixed step the process is an AR(1).
- In the Vasicek model the short rate is an OU process and $P(0,T) = A(T)e^{-B(T)r_0}$ with $B(T) = (1 - e^{-\kappa T})/\kappa$; rates can turn negative.

[Simulate Itô processes and compare their drift and spread in the Itô Process lab](https://quantsandbox.dev/ito-process)

## Interactive labs

- [Itô's Lemma Visualized: the −½σ² Drift Correction](https://quantsandbox.dev/ito-process)
- [Yield Curve Bootstrapping, Spot & Forward Rates](https://quantsandbox.dev/yield-curve)

## Practice questions

### 1. An interest rate follows an Ornstein–Uhlenbeck process with $\kappa = 2$ per year. How many years does it take for the expected gap to $\theta$ to halve?

**Answer:** 0.347 years

$t_{1/2} = \ln 2/\kappa = 0.693/2 \approx 0.347$ years, a little over four months, whatever the size of the gap.

### 2. Double the speed of mean reversion $\kappa$ and keep $\sigma$ fixed. What happens to the standard deviation of the stationary distribution?

- a) It doubles.
- b) It halves.
- c) It is divided by $\sqrt{2}$.
- d) It does not change.

**Answer:** c) It is divided by $\sqrt{2}$.

The stationary variance is $\sigma^2/(2\kappa)$, so the standard deviation is $\sigma/\sqrt{2\kappa}$. Doubling $\kappa$ divides it by $\sqrt{2}$: a stronger pull keeps the process closer to $\theta$.

---

Source: https://quantsandbox.dev/guide/stochastic/mean-reversion

Previous lesson: [Correlated Brownian Motions and Cholesky Decomposition](https://quantsandbox.dev/guide/stochastic/correlated-brownian-motions)

Next lesson: [Merton Jump-Diffusion Model and Poisson Jumps](https://quantsandbox.dev/guide/stochastic/jump-diffusion)
