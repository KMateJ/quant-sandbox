# Log Returns, Volatility and the Square-Root-of-Time Rule

Simple and log returns, standard deviation, annualising and the square-root-of-time rule. Free interactive lesson with worked examples.

The lesson "Interest, compounding and discounting" dealt with money that grows at a known rate. A stock does not: its price moves up and down in a way nobody can predict exactly. This lesson introduces the two numbers used to describe such movements, the average return and the volatility, and shows how both scale with the length of the holding period.

## Prices and returns

Write $S_t$ for the price of a stock at time $t$. Prices themselves are awkward to compare: a move of 5 means a lot for a stock at 20 and little for a stock at 1000. What an investor cares about is the change relative to the starting price. So instead of prices we study **returns**, the relative change over a period.

Throughout this lesson the stock pays no dividends, so the price change is the whole return.

## Simple returns

The **simple return** from time $t-1$ to $t$ is

$$
R_t = \frac{S_t - S_{t-1}}{S_{t-1}} = \frac{S_t}{S_{t-1}} - 1.
$$

It is the number most people mean by "the stock went up 10%". Its drawback appears when periods are chained. Over two periods the total growth factor is the product $(1+R_1)(1+R_2)$, not the sum of the returns.

Example: a price goes from 100 to 110 and then back to 99. The simple returns are $+10\%$ and $-10\%$. They add up to zero, yet the investor has lost 1%, because $1.1 \times 0.9 = 0.99$.

## Log returns

The **log return** (continuously compounded return) is the natural logarithm of the growth factor:

$$
r_t = \ln\frac{S_t}{S_{t-1}} = \ln(1 + R_t).
$$

It is the rate that, compounded continuously over the period, turns $S_{t-1}$ into $S_t$, exactly as in "Interest, compounding and discounting": $S_t = S_{t-1}e^{r_t}$. Because a logarithm turns products into sums, log returns over consecutive periods add up:

$$
\ln\frac{S_n}{S_0} = \ln\frac{S_1}{S_0} + \ln\frac{S_2}{S_1} + \cdots + \ln\frac{S_n}{S_{n-1}} = r_1 + r_2 + \cdots + r_n.
$$

In the example above, $\ln 1.1 \approx 0.0953$ and $\ln 0.9 \approx -0.1054$. Their sum is $-0.0101 = \ln 0.99$, which correctly reports the 1% loss. For small moves the two kinds of return are nearly equal, since $\ln(1+R) \approx R$ when $R$ is close to zero.

From here on, "return" means log return. Additivity is what makes the scaling rules below so simple.

## Mean and standard deviation

Treat the return over one period as a random variable $r$. Its **mean** (expected value) $\mathbb{E}[r]$ is the average return you would see over many repetitions. Its **standard deviation** measures the typical size of the deviation from that mean:

$$
\operatorname{sd}(r) = \sqrt{\operatorname{Var}(r)}, \qquad \operatorname{Var}(r) = \mathbb{E}\big[(r - \mathbb{E}[r])^2\big].
$$

From a sample of $n$ observed returns $r_1, \dots, r_n$ we estimate them by

$$
\bar r = \frac{1}{n}\sum_{i=1}^{n} r_i, \qquad s = \sqrt{\frac{1}{n-1}\sum_{i=1}^{n} (r_i - \bar r)^2}.
$$

Example: four daily returns of $2\%$, $-1\%$, $3\%$ and $-2\%$. The mean is $\bar r = 0.5\%$. The deviations are $1.5$, $-1.5$, $2.5$ and $-2.5$ (in percent), their squares add up to 17, and $s = \sqrt{17/3} \approx 2.38\%$ per day.

## Volatility

**Volatility** $\sigma$ is the standard deviation of log returns, quoted per year. A stock with $\sigma = 20\%$ has annual log returns that typically land within about 20 percentage points of their mean. Volatility measures how uncertain the outcome is, not which direction it takes.

> Volatility $\sigma$ is the annualised standard deviation of log returns. The drift $\mu$ is the annualised mean log return.

## Annualising and the square-root-of-time rule

Returns are measured daily or monthly, but $\mu$ and $\sigma$ are quoted per year. To convert, make two assumptions: returns over non-overlapping periods are **independent**, and they all have the **same distribution**. Split a horizon of $T$ years into $n$ periods of length $\Delta t = T/n$, each with mean $\mu\,\Delta t$ and variance $\sigma^2\Delta t$. The total log return is the sum of the period returns, so

$$
\mathbb{E}\Big[\sum_{i=1}^n r_i\Big] = n\,\mu\,\Delta t = \mu T, \qquad \operatorname{Var}\Big(\sum_{i=1}^n r_i\Big) = n\,\sigma^2\Delta t = \sigma^2 T.
$$

The variance adds because the returns are independent. Taking the square root gives the **square-root-of-time rule**:

$$
\operatorname{sd}(\text{return over } T) = \sigma\sqrt{T}.
$$

The mean grows in proportion to $T$, the standard deviation only in proportion to $\sqrt{T}$. With about 252 trading days a year, a daily standard deviation of $1.2\%$ corresponds to an annual volatility of $1.2\% \times \sqrt{252} \approx 19.0\%$. In the other direction, $\sigma = 20\%$ per year means $20\% / \sqrt{12} \approx 5.8\%$ per month.

### Worked example: From four monthly returns to an annual mean and volatility

1. Four monthly log returns are $1\%$, $-2\%$, $3\%$ and $2\%$. Their mean is the sum divided by four.
   $$\bar r = \tfrac{1}{4}(1 - 2 + 3 + 2)\%$$ → **1%**
2. The deviations from the mean are $0$, $-3$, $2$ and $1$; their squares add up to 14. Divide by $n - 1 = 3$ and take the root.
   $$s = \sqrt{14/3}\,\%$$ → **2.16%**
3. The mean grows in proportion to time: twelve months a year.
   $$\mu = 12\,\bar r$$ → **12%**
4. The standard deviation grows with the square root of time.
   $$\sigma = \sqrt{12}\,s$$ → **7.48%**

## The normal distribution as a first model

A simple first model assumes that the log return over $T$ years is **normally distributed**:

$$
\ln\frac{S_T}{S_0} \sim N\big(\mu T,\ \sigma^2 T\big).
$$

This is natural given the previous section: the total log return is a sum of many small independent pieces, and such sums are approximately normal (central limit theorem). For a normal variable about 68% of outcomes fall within one standard deviation of the mean and about 95% within two.

Example: with $\mu = 8\%$, $\sigma = 20\%$ and $T = 4$ years, the mean log return is $\mu T = 0.32$ and the standard deviation is $\sigma\sqrt{T} = 0.40$. The one-standard-deviation range is $-0.08$ to $0.72$. In price terms, a stock starting at 100 ends between about $100\,e^{-0.08} \approx 92.3$ and $100\,e^{0.72} \approx 205.4$ in roughly two cases out of three.

Real returns have fatter tails than the normal distribution: large moves happen more often than it predicts. The model is still the standard starting point, and later lessons build on it.

The figure plots the expected cumulative log return $\mu T$ over horizons up to 10 years, with bands at $\mu T \pm \sigma\sqrt{T}$ and $\mu T \pm 2\sigma\sqrt{T}$. Increase $\sigma$ and note that the bands widen while the centre line does not move. Over short horizons the bands dominate the drift; only over long horizons does the line pull away from zero relative to their width.

*[Interactive figure: volatility horizon](https://quantsandbox.dev/guide/portfolio/returns-volatility)*

## Summary

- Returns, not prices, are the objects to model. Log returns $\ln(S_t/S_{t-1})$ add up over consecutive periods.
- Volatility $\sigma$ is the annualised standard deviation of log returns; $\mu$ is their annualised mean.
- With independent, identically distributed returns, the mean grows like $\mu T$ and the standard deviation like $\sigma\sqrt{T}$.
- A first model takes $\ln(S_T/S_0)$ to be normal with mean $\mu T$ and variance $\sigma^2 T$.

> The next lesson, "Diversification and correlation", combines several assets and shows how their volatilities add up. Where the $\sqrt{T}$ comes from is shown in "Random walks and Brownian motion", the first lesson of the Stochastic models track.

[Estimate means, volatilities and the risk–return trade-off in the Risk & Return lab](https://quantsandbox.dev/risk-return)

## Interactive labs

- [Capital Allocation Line & Sharpe Ratio Visualizer](https://quantsandbox.dev/risk-return)

## Practice questions

### 1. A stock falls from 100 to 50. How do its simple and log returns compare?

- a) Both are $-50\%$
- b) The log return is more negative
- c) The simple return is more negative
- d) The log return is $+69.3\%$

**Answer:** b) The log return is more negative

The simple return is $50/100 - 1 = -50\%$, the log return $\ln 0.5 \approx -69.3\%$. For large falls the logarithm runs further below zero than $R$ does.

### 2. A stock's daily log returns have a standard deviation of 1.2%. With 252 trading days a year, what is its annual volatility, in percent?

**Answer:** 19.05%

$\sigma = 1.2\% \times \sqrt{252} \approx 1.2\% \times 15.875 \approx 19.05\%$. The standard deviation scales with the square root of time, not with time.

---

Source: https://quantsandbox.dev/guide/portfolio/returns-volatility

Next lesson: [Diversification and Correlation in a Two-Asset Portfolio](https://quantsandbox.dev/guide/portfolio/diversification)
