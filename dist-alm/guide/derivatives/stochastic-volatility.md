# Heston Model: Stochastic Volatility and the Smile

The Heston variance process, mean reversion, vol-of-vol, the Feller condition, and how correlation and vol-of-vol shape the smile.

"Implied volatility and the volatility smile" described a market fact that "The Black–Scholes formula" cannot explain: when each quoted option price is inverted for its own $\sigma$, the implied volatilities form a smile or skew across strikes instead of a flat line. A model that produces this shape has to let volatility change. This lesson builds the Heston model, in which the variance itself moves randomly, and shows how two of its parameters shape the smile.

## Constant volatility and its failure

In geometric Brownian motion the size of the random shocks never changes. Observed returns behave differently. Calm periods and turbulent periods alternate, so volatility clusters in time. Large falls in the price tend to come with rising volatility. And the distribution of returns has fatter tails than the normal distribution, especially on the downside.

A constant $\sigma$ cannot produce any of this. The natural fix is to make the variance a random process of its own, driven by a second source of randomness.

## The Heston model

Write $v_t$ for the instantaneous variance of the stock's returns, so the instantaneous volatility is $\sqrt{v_t}$. Under the risk-neutral measure $\mathbb{Q}$, with no dividends, the **Heston model** is

$$
dS_t = rS_t\,dt + \sqrt{v_t}\,S_t\,dW^{(1)}_t,
$$

$$
dv_t = \kappa(\theta - v_t)\,dt + \xi\sqrt{v_t}\,dW^{(2)}_t,
$$

where $W^{(1)}$ and $W^{(2)}$ are Brownian motions with correlation $\rho$, that is $dW^{(1)}_t\,dW^{(2)}_t = \rho\,dt$. The first equation is geometric Brownian motion from "Geometric Brownian motion", with $\sigma$ replaced by the moving quantity $\sqrt{v_t}$. The second equation describes how the variance moves.

## The parameters

- $v_0$: the variance today. $\sqrt{v_0}$ is the current volatility.
- $\theta$: the long-run variance. Over long horizons $v_t$ is pulled towards $\theta$, so $\sqrt{\theta}$ is the long-run volatility.
- $\kappa$: the speed of mean reversion. The drift $\kappa(\theta - v_t)$ is positive when the variance is below $\theta$ and negative when it is above, and it is stronger the larger $\kappa$ is.
- $\xi$: the volatility of variance (vol-of-vol). It sets how strongly the variance itself fluctuates.
- $\rho$: the correlation between the shocks to the price and the shocks to the variance.

Without the random term the variance would relax exponentially towards $\theta$. The random term does not change the average path, so the expected variance at time $t$ is

$$
\mathbb{E}^{\mathbb{Q}}[v_t] = \theta + (v_0 - \theta)\,e^{-\kappa t}.
$$

The gap to $\theta$ halves every $\ln 2/\kappa$ years. This is the **half-life** of a variance shock.

The factor $\sqrt{v_t}$ in front of $dW^{(2)}$ makes the shocks shrink as the variance approaches zero. If mean reversion is strong enough compared with the vol-of-vol, the variance never reaches zero. This is the **Feller condition**:

$$
2\kappa\theta \ge \xi^2.
$$

When it fails the variance can touch zero and bounce back. The model still works, but simulations need care near zero.

## A worked example

Take $v_0 = 0.09$, $\theta = 0.04$ and $\kappa = 2$. Today's volatility is $\sqrt{0.09} = 30\%$ and the long-run volatility is $\sqrt{0.04} = 20\%$. The half-life is $\ln 2/2 \approx 0.35$ years, a little over four months.

After half a year the expected variance is $0.04 + 0.05\,e^{-1} \approx 0.0584$, a volatility of about $24.2\%$. After one year it is $0.04 + 0.05\,e^{-2} \approx 0.0468$, about $21.6\%$.

For the Feller condition, $2\kappa\theta = 0.16$. With $\xi = 0.3$ we have $\xi^2 = 0.09 \le 0.16$, so the condition holds. With $\xi = 0.5$ we have $\xi^2 = 0.25 > 0.16$, so it fails, and the variance can reach zero.

### Worked example: Expected variance and the Feller check

1. Take $v_0 = 0.0625$ (25% volatility), $\theta = 0.04$, $\kappa = 1.5$. Half-life of a variance shock, in years.
   $$\ln 2 / \kappa$$ → **0.4621**
2. Expected variance after one year.
   $$\theta + (v_0 - \theta)\,e^{-\kappa \cdot 1}$$ → **0.04502**
3. The corresponding volatility, in percent.
   $$\sqrt{\mathbb{E}^{\mathbb{Q}}[v_1]}$$ → **21.22%**
4. Feller margin with $\xi = 0.35$; it is negative, so the condition just fails.
   $$2\kappa\theta - \xi^2$$ → **-0.0025**

## Correlation and the skew

For equities $\rho$ is typically negative, often between $-0.5$ and $-0.9$. A negative $\rho$ means that a fall in the price tends to come with a rise in variance. This is the **leverage effect**: as the share price drops, the firm's debt is larger relative to its equity, and the equity becomes riskier.

Consider what this does to the distribution of $S_T$. Paths that fall gain variance and spread out further downwards. Paths that rise lose variance and stay closer together. The left tail becomes longer than the right. Out-of-the-money puts, which pay off in that left tail, become more valuable than under Black–Scholes, so their implied volatility is higher. Implied volatility then falls as the strike rises: the **skew**.

## Vol-of-vol and the curvature

The parameter $\xi$ controls how much the variance moves. With $\xi = 0$ the variance follows its deterministic path and the model is close to Black–Scholes with a time-varying volatility, so the smile is nearly flat. A larger $\xi$ mixes calm paths with very turbulent ones. The resulting distribution of returns has a sharper peak and fatter tails on both sides than a normal distribution with the same variance. Options far from the money on either side gain value, and the smile curves upwards at both ends.

> In the Heston model, $\rho$ tilts the implied-volatility curve (negative $\rho$ gives the equity skew), and $\xi$ bends it (larger vol-of-vol gives more curvature).

The figure plots the Heston implied volatility against the strike for $S_0 = 100$, $r = 0$, $T = 1$, $v_0 = \theta = 0.04$ and $\kappa = 2$. Each point is the Black–Scholes implied volatility of the Heston call price at that strike, with the Heston price computed from the characteristic function described below. The flat line at $\sqrt{\theta} = 20\%$ is the Black–Scholes (constant volatility) reference. The readouts give the implied volatility at $K = 80$, $100$ and $120$ and the skew $\text{IV}(80) - \text{IV}(120)$.

At the defaults $\rho = -0.7$, $\xi = 0.5$ the implied volatilities are $23.03\%$, $18.05\%$ and $14.54\%$, a skew of $8.49$ percentage points. Move $\rho$ towards $-0.9$ and the skew grows. At $\rho = 0$ the same three strikes give $20.26\%$, $18.76\%$ and $19.82\%$: a roughly symmetric smile with its minimum near the money. Increase $\xi$ and the curve bends more strongly. Note also that the at-the-money implied volatility is below 20%, even though the variance starts at $\theta$ and reverts to it: vol-of-vol moves value from the centre of the distribution into the tails.

*[Interactive figure: vol smile](https://quantsandbox.dev/guide/derivatives/stochastic-volatility)*

The smile above is one slice, at $T = 1$, of a whole **implied-volatility surface**: one implied volatility for every strike and every maturity. The next figure draws that surface for strikes from 70 to 130 and maturities from 3 months to 2 years, with the same parameters as above. Drag it to rotate and scroll to zoom. Choose $\rho$ and $\xi$ with the buttons. At the defaults ($\rho = -0.7$, $\xi = 0.5$) the skew $\text{IV}(80) - \text{IV}(120)$ is 11.53 percentage points at 3 months, 8.49 at 1 year and 5.76 at 2 years: the skew flattens as maturity grows. Over a longer horizon the variance has more time to revert to $\theta$, so the distribution of the log return looks more nearly normal. With $\rho = 0$ the surface is a nearly symmetric valley, and with $\rho = +0.3$ the tilt reverses.

*[Interactive figure: iv surface](https://quantsandbox.dev/guide/derivatives/stochastic-volatility)*

## Pricing in the Heston model

The price of a European call is still the discounted risk-neutral expectation $C_0 = e^{-rT}\,\mathbb{E}^{\mathbb{Q}}[(S_T - K)^+]$. There is no formula as short as Black–Scholes, but there are two standard routes.

The first is simulation, as in "Monte Carlo option pricing". Split $[0, T]$ into small steps $\Delta t$. In each step draw two independent standard normals $Z_1, Z_2$, set $\varepsilon_1 = Z_1$ and $\varepsilon_2 = \rho Z_1 + \sqrt{1-\rho^2}\,Z_2$, so that the two shocks have correlation $\rho$, and update

$$
v_{t+\Delta t} = v_t + \kappa(\theta - v_t)\,\Delta t + \xi\sqrt{v_t^+}\,\sqrt{\Delta t}\,\varepsilon_2,
$$

$$
S_{t+\Delta t} = S_t\exp\Big(\big(r - \tfrac{1}{2}v_t^+\big)\Delta t + \sqrt{v_t^+}\,\sqrt{\Delta t}\,\varepsilon_1\Big).
$$

Here $v_t^+ = \max(v_t, 0)$ guards against the small negative values that a discrete step can produce. Averaging the discounted payoff over many paths gives the price, with the standard error from "Monte Carlo option pricing".

The second route is semi-analytic. Heston showed that the characteristic function of $\ln S_T$ has a closed form. The call price can then be written as $S_0P_1 - Ke^{-rT}P_2$, the same shape as Black–Scholes, where $P_1$ and $P_2$ are probabilities computed by a one-dimensional numerical integral. This is fast enough to fit the five parameters to a whole surface of market prices.

## Summary

- The Heston model lets the variance $v_t$ follow its own mean-reverting random process, correlated with the price.
- $v_0$ is today's variance, $\theta$ the long-run level, $\kappa$ the reversion speed (half-life $\ln 2/\kappa$), $\xi$ the vol-of-vol and $\rho$ the correlation.
- The Feller condition $2\kappa\theta \ge \xi^2$ keeps the variance away from zero.
- Negative $\rho$ produces the equity skew; larger $\xi$ produces a more curved smile.
- Prices come from simulation or from a numerical integral of the characteristic function.

[Simulate price and variance paths and price options in the Heston lab](https://quantsandbox.dev/heston)

## Interactive labs

- [Heston Stochastic Volatility Model Simulator](https://quantsandbox.dev/heston)

## Practice questions

### 1. In the Heston model the variance mean-reverts with speed $\kappa = 4$. What is the half-life of a variance shock, in years?

**Answer:** 0.1733 years

The gap to $\theta$ shrinks like $e^{-\kappa t}$, so it halves after $\ln 2/\kappa = 0.693/4 \approx 0.173$ years, about two months.

### 2. With $\rho = -0.7$, which options have a higher implied volatility than the at-the-money ones?

- a) Low-strike (out-of-the-money) puts
- b) High-strike (out-of-the-money) calls
- c) All strikes equally
- d) None: $\rho$ only shifts the level

**Answer:** a) Low-strike (out-of-the-money) puts

A negative $\rho$ raises the variance on falling paths and lengthens the left tail, so low strikes become dearer than under Black–Scholes: the equity skew.

---

Source: https://quantsandbox.dev/guide/derivatives/stochastic-volatility

Previous lesson: [Implied Volatility and the Volatility Smile](https://quantsandbox.dev/guide/derivatives/implied-volatility)

Next lesson: [Breeden–Litzenberger and Static Option Replication](https://quantsandbox.dev/guide/derivatives/static-replication)
