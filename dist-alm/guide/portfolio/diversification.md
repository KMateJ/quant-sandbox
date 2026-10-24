# Diversification and Correlation in a Two-Asset Portfolio

Two-asset portfolios, the role of covariance, and why correlation drives risk down. Free interactive lesson with worked examples.

The lesson "Returns and volatility" described a single asset by two numbers, its expected return $\mu$ and its volatility $\sigma$. This lesson puts several assets into one portfolio. The expected return of the portfolio is simply an average, but its volatility is not: it depends on how the assets move together, measured by their correlation. That is the source of diversification.

## Portfolio weights and portfolio return

A **portfolio** splits an amount of money across assets. The **weight** $w_i$ is the fraction of the money invested in asset $i$, so the weights add up to one: $w_1 + \cdots + w_N = 1$. In this lesson every weight lies between 0 and 1, which means no short sales.

Here a return means the simple return of one period, $R = S_1/S_0 - 1$, from the previous lesson. With simple returns the portfolio return is exactly the weighted average of the asset returns, because each part of the money grows by its own factor:

$$
R_p = w_1 R_1 + w_2 R_2 + \cdots + w_N R_N.
$$

Log returns do not have this property exactly, which is why portfolio theory works with simple returns. Taking expectations of a sum gives the sum of expectations, so the expected portfolio return is the same weighted average:

$$
\mu_p = \mathbb{E}[R_p] = \sum_{i=1}^{N} w_i\,\mu_i.
$$

## Covariance and correlation

To describe how two returns move together we use the **covariance**

$$
\sigma_{AB} = \operatorname{Cov}(R_A, R_B) = \mathbb{E}\big[(R_A - \mu_A)(R_B - \mu_B)\big].
$$

It is positive when the two returns tend to be above their means at the same time, and negative when one tends to be high while the other is low. Its size depends on the units and on the volatilities, so it is normalised into the **correlation**

$$
\rho = \frac{\sigma_{AB}}{\sigma_A\,\sigma_B}, \qquad -1 \le \rho \le 1, \qquad \text{so} \quad \sigma_{AB} = \rho\,\sigma_A\sigma_B.
$$

$\rho = 1$ means the two returns move in exact lockstep (one is a positive linear function of the other), $\rho = -1$ means they move exactly opposite, and $\rho = 0$ means there is no linear relation. The covariance of an asset with itself is its variance: $\sigma_{AA} = \sigma_A^2$.

## Variance of a two-asset portfolio

Take two assets A and B with weights $w_A = 1 - w$ and $w_B = w$. The variance of a sum of two random variables is the sum of the variances plus twice the covariance, and constants come out squared:

$$
\sigma_p^2 = \operatorname{Var}(w_A R_A + w_B R_B) = w_A^2\sigma_A^2 + w_B^2\sigma_B^2 + 2\,w_A w_B\,\rho\,\sigma_A\sigma_B.
$$

The first two terms are the risk each asset brings on its own. The third term is where correlation enters. Everything else being equal, a lower $\rho$ gives a lower portfolio variance.

## Three cases of correlation

With $\rho = 1$ the expression is a perfect square:

$$
\sigma_p^2 = (w_A\sigma_A + w_B\sigma_B)^2 \quad\Rightarrow\quad \sigma_p = w_A\sigma_A + w_B\sigma_B.
$$

Volatility is then the weighted average of the two volatilities, exactly like the expected return. Mixing the assets gives no risk reduction at all.

With $\rho < 1$ the cross term is smaller than in the perfect-square case, so

$$
\sigma_p < w_A\sigma_A + w_B\sigma_B \qquad (0 < w < 1).
$$

The portfolio is less risky than the average of its parts, while its expected return is still the average. This gap is the benefit of **diversification**.

With $\rho = -1$ the expression is again a square, $\sigma_p = |w_A\sigma_A - w_B\sigma_B|$, and it is zero when $w_A\sigma_A = w_B\sigma_B$, that is at $w_B = \sigma_A/(\sigma_A + \sigma_B)$. Two perfectly opposite assets can be combined into a riskless portfolio. A fair picture is an umbrella seller and an ice-cream seller on the same beach: whatever the weather, one of them has a good day.

### Worked example: One 50/50 portfolio under three correlations

1. Take $\sigma_A = 15\%$, $\sigma_B = 30\%$ and equal weights. With $\rho = 1$ the volatility is the weighted average.
   $$\sigma_p = 0.5 \times 15\% + 0.5 \times 30\%$$ → **22.5%**
2. With $\rho = 0$ the cross term vanishes and only the two own-risk terms remain.
   $$\sigma_p = \sqrt{0.25 \times 0.0225 + 0.25 \times 0.09}$$ → **16.77%**
3. With $\rho = -1$ the volatility is the absolute difference. It is not zero here, because equal weights do not satisfy $w_A\sigma_A = w_B\sigma_B$.
   $$\sigma_p = |0.5 \times 15\% - 0.5 \times 30\%|$$ → **7.5%**

## The minimum-variance portfolio

Among all mixes of A and B there is one with the smallest variance. Write $\sigma_p^2$ as a function of $w = w_B$ and set its derivative to zero:

$$
\frac{d\sigma_p^2}{dw} = -2(1-w)\sigma_A^2 + 2w\sigma_B^2 + 2(1-2w)\sigma_{AB} = 0.
$$

Collecting the terms in $w$ gives the **minimum-variance weight**

$$
w_B^{*} = \frac{\sigma_A^2 - \sigma_{AB}}{\sigma_A^2 + \sigma_B^2 - 2\sigma_{AB}}, \qquad w_A^{*} = 1 - w_B^{*}.
$$

If the formula gives a value outside $[0, 1]$, the minimum without short sales lies at the nearer end point, that is in a single asset. This happens for instance at $\rho = 1$, where the least risky choice is to hold only the less volatile asset. For the two assets below it happens whenever $\rho > \sigma_A/\sigma_B = 0.5$.

## Worked example

Asset A has $\mu_A = 6\%$ and $\sigma_A = 15\%$; asset B has $\mu_B = 12\%$ and $\sigma_B = 30\%$; the correlation is $\rho = 0.2$. The covariance is $\sigma_{AB} = 0.2 \times 0.15 \times 0.30 = 0.009$.

A 50/50 portfolio has $\mu_p = 9\%$ and

$$
\sigma_p^2 = 0.25 \times 0.0225 + 0.25 \times 0.09 + 2 \times 0.25 \times 0.009 = 0.032625, \qquad \sigma_p \approx 18.06\%.
$$

The weighted average of the volatilities is $22.5\%$, so diversification removes about 4.4 percentage points of volatility at no cost in expected return.

The minimum-variance weight is

$$
w_B^{*} = \frac{0.0225 - 0.009}{0.0225 + 0.09 - 0.018} = \frac{0.0135}{0.0945} \approx 0.143.
$$

This portfolio has $\mu_p \approx 6.86\%$ and $\sigma_p \approx 14.34\%$. Adding a little of the riskier asset B to A *lowers* the volatility below that of A alone, while raising the expected return.

The figure plots expected return against volatility for all mixes of A and B with weights from 0 to 1 at the chosen correlation (thick curve). The dashed straight line is the case $\rho = 1$ and the dotted V is the case $\rho = -1$; markers show A and B. Move the correlation slider and note that the curve bends further to the left as $\rho$ falls, reaching the vertical axis at $\rho = -1$. The readouts give the minimum-variance weight in B, the minimum volatility, the volatility and expected return of the 50/50 portfolio and, for comparison, the 22.5% average of the two volatilities. Above $\rho = 0.5$ the weight readout turns negative, and the minimum volatility shown is that of A alone.

*[Interactive figure: two asset frontier](https://quantsandbox.dev/guide/portfolio/diversification)*

## Many assets and systematic risk

Now take $N$ assets in equal weights $w_i = 1/N$. The portfolio variance is a sum over all pairs:

$$
\sigma_p^2 = \sum_{i=1}^{N}\sum_{j=1}^{N} w_i w_j\,\sigma_{ij} = \frac{1}{N^2}\sum_{i=1}^{N}\sigma_i^2 + \frac{1}{N^2}\sum_{i \ne j}\sigma_{ij}.
$$

There are $N$ variance terms and $N(N-1)$ covariance terms. Write $\overline{\sigma^2}$ for the average variance and $\overline{\sigma}_{ij}$ for the average covariance between different assets. Then

$$
\sigma_p^2 = \frac{1}{N}\,\overline{\sigma^2} + \Big(1 - \frac{1}{N}\Big)\overline{\sigma}_{ij} \;\longrightarrow\; \overline{\sigma}_{ij} \quad (N \to \infty).
$$

The individual variances are diversified away, but the average covariance stays. Example: every asset has $\sigma = 30\%$ and every pair has $\rho = 0.3$, so $\overline{\sigma}_{ij} = 0.3 \times 0.09 = 0.027$. One asset has a volatility of 30%, ten assets about 18.2%, a hundred assets about 16.6%, and the limit is $\sqrt{0.027} \approx 16.4\%$.

> Risk that is specific to single assets disappears in a large portfolio. Risk that comes from common movements, measured by the average covariance, remains. This remaining part is called **systematic** (market) risk.

## Moving the two assets

The figure below lets you place the two assets yourself. Drag A or B to any point of the risk–return plane and pick a correlation. With $\rho = 0.9$ the mixes lie close to the straight line between the two points, so mixing buys little. With $\rho = -0.5$ the curve bends far to the left of both assets. Move B straight up and note that the minimum-variance weight does not change: it depends only on the volatilities and the correlation, not on the expected returns.

*[Interactive figure: drag assets](https://quantsandbox.dev/guide/portfolio/diversification)*

## Summary

- Portfolio return is the weighted average of asset returns: $\mu_p = \sum_i w_i\mu_i$.
- Portfolio variance depends on covariances: $\sigma_p^2 = w_A^2\sigma_A^2 + w_B^2\sigma_B^2 + 2w_Aw_B\rho\sigma_A\sigma_B$.
- With $\rho = 1$ volatility is the weighted average; with $\rho < 1$ it is lower; with $\rho = -1$ it can be zero.
- The minimum-variance weight is $w_B^{*} = (\sigma_A^2 - \sigma_{AB})/(\sigma_A^2 + \sigma_B^2 - 2\sigma_{AB})$.
- In a large equally weighted portfolio the variance tends to the average covariance: systematic risk cannot be diversified away.

> The next lesson, "The efficient frontier and the capital market line", allows short sales and a risk-free asset, and asks which of these portfolios an investor should actually choose.

[Combine assets and watch the portfolio volatility change in the Portfolio lab](https://quantsandbox.dev/portfolio-lab)

## Interactive labs

- [Two-Asset Portfolio: Diversification & Correlation](https://quantsandbox.dev/portfolio-lab)
- [Capital Allocation Line & Sharpe Ratio Visualizer](https://quantsandbox.dev/risk-return)

## Practice questions

### 1. Two assets have $\sigma_1 = 20\%$ and $\sigma_2 = 30\%$ with correlation $\rho = 0.2$. What is the volatility of a 50/50 portfolio, in percent?

**Answer:** 19.62%

$\sigma_p^2 = 0.25 \times 0.04 + 0.25 \times 0.09 + 2 \times 0.25 \times 0.2 \times 0.2 \times 0.3 = 0.0385$, so $\sigma_p \approx 19.62\%$, below the 25% average of the two volatilities.

### 2. For which correlation can two risky assets, held without short sales, be combined into a portfolio with zero volatility?

- a) $\rho = 1$
- b) $\rho = 0$
- c) $\rho = -0.5$
- d) $\rho = -1$

**Answer:** d) $\rho = -1$

Only at $\rho = -1$ is the variance a perfect square, $\sigma_p = |w_A\sigma_A - w_B\sigma_B|$, which is zero at $w_B = \sigma_A/(\sigma_A + \sigma_B)$. For any $\rho > -1$ some risk is left at every weight.

---

Source: https://quantsandbox.dev/guide/portfolio/diversification

Previous lesson: [Log Returns, Volatility and the Square-Root-of-Time Rule](https://quantsandbox.dev/guide/portfolio/returns-volatility)

Next lesson: [Efficient Frontier, Capital Market Line and Sharpe Ratio](https://quantsandbox.dev/guide/portfolio/efficient-frontier)
