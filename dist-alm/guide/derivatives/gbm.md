# Geometric Brownian Motion: The Stock Price Model

The standard model for stock prices: the log-normal distribution, its mean and its median. Free interactive lesson with worked examples.

This lesson builds the standard continuous-time model of a stock price, **geometric Brownian motion** (GBM). It combines the Brownian motion $W_t$ from "Random walks and Brownian motion" with the log returns and volatility of "Returns and volatility", and it is the continuous limit of the trees in "Multi-step trees and backward induction". The Black–Scholes formula in the next lesson is computed under this model.

## Modelling returns instead of prices

The simplest idea would be to let the price itself follow a Brownian motion, $S_t = S_0 + \mu t + \sigma W_t$. This has two defects. First, $W_t$ is normally distributed, so the price can become negative. Second, a move of 1 means very different things for a stock at 10 and a stock at 1000. What should be random and comparable across stocks is the **return**, not the price change.

So we model the return over a short interval $dt$. The assumptions are:

- The expected return per unit time is a constant $\mu$ (the **drift**).
- The volatility of returns is a constant $\sigma$.
- The random part of the return comes from a Brownian motion: returns over non-overlapping intervals are independent and normally distributed.
- The stock pays no dividends and its price moves continuously, without jumps.

## The model equation

These assumptions are written as

$$
\frac{dS_t}{S_t} = \mu\,dt + \sigma\,dW_t \qquad\Longleftrightarrow\qquad dS_t = \mu S_t\,dt + \sigma S_t\,dW_t.
$$

Read it as a recipe for one small step: over $dt$ the return has a deterministic part $\mu\,dt$ and a random part $\sigma\,dW_t$. Since $dW_t$ is normal with mean 0 and variance $dt$, the return over the step has mean $\mu\,dt$ and standard deviation $\sigma\sqrt{dt}$, which is the square-root-of-time rule from "Returns and volatility". Because both terms are proportional to $S_t$, price moves scale with the price level.

## The solution

The equation has an explicit solution:

$$
S_T = S_0 \exp\!\left( \left(\mu - \tfrac{1}{2}\sigma^2\right) T + \sigma W_T \right).
$$

Taking logarithms, the log return over $[0, T]$ is

$$
\ln\frac{S_T}{S_0} = \left(\mu - \tfrac{1}{2}\sigma^2\right) T + \sigma W_T \sim N\!\left( \left(\mu - \tfrac{1}{2}\sigma^2\right) T,\; \sigma^2 T \right).
$$

So the log price is a Brownian motion with a constant drift. A random variable whose logarithm is normal is called **log-normal**. Since $S_T$ is $S_0$ times an exponential, it is always positive: GBM fixes the first defect of the naive model.

## The volatility correction

The drift of the log price is $\mu - \tfrac{1}{2}\sigma^2$, not $\mu$. The correction comes from a property of the normal distribution. If $Z \sim N(m, s^2)$, then

$$
\mathbb{E}\left[e^{Z}\right] = e^{m + \frac{1}{2}s^2}.
$$

The exponential is convex, so large positive values of $Z$ are amplified more than negative ones are damped, and the mean of $e^Z$ exceeds $e^m$. Apply this with $m = (\mu - \tfrac{1}{2}\sigma^2)T$ and $s^2 = \sigma^2 T$:

$$
\mathbb{E}^{\mathbb{P}}[S_T] = S_0\, e^{(\mu - \frac{1}{2}\sigma^2)T + \frac{1}{2}\sigma^2 T} = S_0\, e^{\mu T}.
$$

The $-\tfrac{1}{2}\sigma^2$ is exactly what is needed so that the expected price grows at rate $\mu$, as assumed. The formal derivation uses Itô's lemma, the chain rule for functions of Brownian motion, which adds the term $-\tfrac{1}{2}\sigma^2\,dt$ when we pass from $dS/S$ to $d\ln S$.

An everyday version of the same effect is **volatility drag**. A price that rises 10% and then falls 10% ends at $1.1 \cdot 0.9 = 0.99$ of where it started: the average return is zero, but the compound growth is negative. The more volatile the returns, the larger the gap between the average return and the growth rate actually achieved.

## Mean and median

Because the exponential is increasing, the median of $S_T$ is the exponential of the median of the log price, which equals its mean:

$$
\text{mean} = S_0\, e^{\mu T}, \qquad \text{median} = S_0\, e^{(\mu - \frac{1}{2}\sigma^2) T}.
$$

The mean lies above the median: the log-normal distribution is skewed to the right, with a long tail of large outcomes pulling the average up. A typical path ends near the median, below the mean.

Example: $S_0 = 100$, $\mu = 8\%$, $\sigma = 20\%$, $T = 1$. The mean is $100\,e^{0.08} \approx 108.33$, the median $100\,e^{0.06} \approx 106.18$. The log return is $N(0.06,\, 0.2^2)$, so the probability that the stock ends below 100 is $N(-0.06/0.2) = N(-0.3) \approx 38\%$, even though the expected return is positive. A 95% range for $S_T$ is $100\,e^{0.06 \pm 1.96 \cdot 0.2}$, about 71.7 to 157.1, which is not symmetric around the median.

### Worked example: Mean, median and a 95% range over two years

1. Take $S_0 = 50$, $\mu = 10\%$, $\sigma = 30\%$ and $T = 2$. The mean grows at $\mu$:
   $$S_0\,e^{\mu T} = 50\,e^{0.2}$$ → **61.07**
2. The log return has mean $(\mu - \tfrac12\sigma^2)T = 0.11$ and standard deviation $\sigma\sqrt{T} \approx 0.4243$. The median is
   $$S_0\,e^{(\mu - \frac12\sigma^2)T} = 50\,e^{0.11}$$ → **55.81**
3. Lower end of the 95% range:
   $$50\,e^{0.11 - 1.96 \cdot 0.4243}$$ → **24.3**
4. Upper end of the 95% range, much further from the median than the lower end:
   $$50\,e^{0.11 + 1.96 \cdot 0.4243}$$ → **128.2**

The figure simulates 20 paths over one year from $S_0 = 100$, each built from many small log-normal steps, and draws the mean curve $S_0e^{\mu t}$ and the median curve $S_0e^{(\mu - \sigma^2/2)t}$. Raise $\sigma$ and note that the paths fan out, the median falls further below the mean, and more paths end below their start. Press "New paths" to draw a fresh sample.

*[Interactive figure: gbm paths](https://quantsandbox.dev/guide/derivatives/gbm)*

## Link to the binomial tree

In a CRR tree with $u = e^{\sigma\sqrt{\Delta t}}$ and $d = 1/u$, each step adds $\pm\sigma\sqrt{\Delta t}$ to the log price. That is the scaled coin-flip walk of "Random walks and Brownian motion". As the number of steps grows, the log price converges to a Brownian motion with volatility $\sigma$ plus a drift, and the terminal stock price becomes log-normal. GBM is the model that the trees approximate, which is why tree prices converge as $n$ grows.

## The risk-neutral version

"Risk-neutral probabilities" showed that for pricing we use the measure $\mathbb{Q}$ under which the stock earns the risk-free rate. In GBM this means replacing $\mu$ by $r$ and $W$ by a Brownian motion $W^{\mathbb{Q}}$ under $\mathbb{Q}$:

$$
dS_t = r S_t\,dt + \sigma S_t\,dW_t^{\mathbb{Q}}, \qquad S_T = S_0 \exp\!\left( \left(r - \tfrac{1}{2}\sigma^2\right) T + \sigma W_T^{\mathbb{Q}} \right).
$$

The volatility $\sigma$ stays the same; only the drift changes. Then $\mathbb{E}^{\mathbb{Q}}[S_T] = S_0 e^{rT}$, and the discounted price $e^{-rt}S_t$ is a martingale under $\mathbb{Q}$, exactly as in the one-step tree. The real drift $\mu$ disappears from option prices, just as the real probability $p$ did.

## Summary

- GBM models returns: $dS_t = \mu S_t\,dt + \sigma S_t\,dW_t$, with constant drift $\mu$ and volatility $\sigma$.
- Its solution is $S_T = S_0\exp((\mu - \tfrac{1}{2}\sigma^2)T + \sigma W_T)$: log-normal and always positive.
- The $-\tfrac{1}{2}\sigma^2$ term makes the mean $S_0e^{\mu T}$; the median $S_0e^{(\mu - \sigma^2/2)T}$ is lower.
- For pricing, replace $\mu$ by $r$; the volatility is unchanged.

> Under $\mathbb{Q}$, $\ln S_T \sim N\big(\ln S_0 + (r - \tfrac{1}{2}\sigma^2)T,\; \sigma^2 T\big)$. The next lesson integrates the call payoff against this distribution to obtain the Black–Scholes formula.

[Simulate price paths and their distribution in the Geometric Brownian Motion lab](https://quantsandbox.dev/gbm)

## Interactive labs

- [Geometric Brownian Motion (GBM) Simulator](https://quantsandbox.dev/gbm)
- [Monte Carlo Option Pricing Simulator](https://quantsandbox.dev/monte-carlo)

## Practice questions

### 1. Under geometric Brownian motion, how is $\ln S_T$ distributed?

- a) Normal
- b) Log-normal
- c) Uniform
- d) Exponential

**Answer:** a) Normal

$\ln S_T = \ln S_0 + (\mu - \tfrac12\sigma^2)T + \sigma W_T$ is a constant plus a normal variable, so it is normal. It is $S_T$ itself that is log-normal.

### 2. A stock follows GBM with $S_0 = 100$, $\mu = 8\%$, $\sigma = 20\%$. What is the median of $S_T$ at $T = 1$?

**Answer:** 106.18

The median is $S_0e^{(\mu - \frac12\sigma^2)T} = 100\,e^{0.08 - 0.02} = 100\,e^{0.06} \approx 106.18$, below the mean $100\,e^{0.08} \approx 108.33$.

---

Source: https://quantsandbox.dev/guide/derivatives/gbm

Previous lesson: [Delta Hedging Explained: Delta, Gamma and Rebalancing](https://quantsandbox.dev/guide/derivatives/delta-hedging)

Next lesson: [Black–Scholes Formula Explained: d1, d2 and N(d2)](https://quantsandbox.dev/guide/derivatives/toward-black-scholes)
