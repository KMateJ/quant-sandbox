# Estimation Error in Portfolio Optimization

Sample moments, their standard errors, why the frontier is unstable, and shrinkage as a remedy. Free interactive lesson with worked examples.

Every optimiser in "The efficient frontier and the capital market line" and "Portfolio constraints and the no-short-sales frontier" takes expected returns, volatilities and correlations as given. In practice they are estimated from a few years of data, and the estimates are noisy. This lesson measures how noisy, shows how the optimiser magnifies the noise, and introduces shrinkage as a remedy. It uses the returns and volatility of "Returns and volatility".

## Sample moments

From $n$ observed returns $r_1, \dots, r_n$ the usual estimates are the sample mean and the sample variance:

$$
\hat\mu = \frac1n\sum_{t=1}^n r_t, \qquad \hat\sigma^2 = \frac1{n-1}\sum_{t=1}^n (r_t - \hat\mu)^2.
$$

Both are unbiased: on average over many samples they equal the truth. But a single sample is one draw, and the estimate for the portfolio is only as good as that draw.

## How wrong the estimates are

If returns are independent with volatility $\sigma$, the standard error of the sample mean is

$$
\mathrm{SE}(\hat\mu) = \frac{\sigma}{\sqrt n}, \qquad \mathrm{SE}(\hat\sigma) \approx \frac{\sigma}{\sqrt{2n}}.
$$

With $n$ counted in years and $\sigma$ annual, a stock with 20% volatility observed for 5 years has a mean known to within 8.9 percentage points, for 20 years within 4.5 points, and even after 100 years within 2.0 points. The equity risk premium itself is a few percentage points, so a lifetime of data barely separates a good asset from a mediocre one. More frequent observations do not help the mean: it depends on the length of the sample, not on how often it is cut. Volatilities and correlations, by contrast, are estimated much more precisely, and sampling daily improves them.

## Error maximisation

The optimiser treats the estimates as truth and puts the most weight where the estimated return is highest relative to risk. An asset that was lucky in the sample looks attractive, and the optimiser buys a lot of it; an unlucky one is sold short. The portfolio is therefore built on the errors, which is why it is called an error maximiser.

The figure shows two assets with true expected returns 4% and 10%, volatilities 10% and 20%, no correlation and a risk-free rate of 2%. The true tangency portfolio holds 50% in each. The faint curves are frontiers estimated from 20 random samples of 60 months (5 years): they scatter widely around the true one. The middle half of the estimated tangency weight in asset 1 runs from 47% to 97%, against the true 50%, and the portfolios built from these estimates lose on average 0.160 of Sharpe ratio, compared with 0.447 for the true optimum. Move the sample to 600 months and the loss falls to 0.020.

*[Interactive figure: estimation noise](https://quantsandbox.dev/guide/portfolio/input-estimation)*

## Shrinkage

A remedy is to pull the noisy estimates towards a sensible target. For expected returns the simplest target is the average over all assets, $\bar\mu$:

$$
\tilde\mu_i = (1 - k)\,\hat\mu_i + k\,\bar\mu, \qquad 0 \le k \le 1.
$$

With $k = 0$ nothing changes, and with $k = 1$ all assets get the same expected return. Another target is the prior implied by "CAPM, beta and the security market line", under which expected returns differ only through beta. Shrinkage adds a little bias but removes much variance. At 60 months, $k = 0.5$ cuts the average Sharpe loss in the figure from 0.160 to 0.097.

## Covariances are easier

The relative error of a volatility estimate is $\mathrm{SE}(\hat\sigma)/\sigma = 1/\sqrt{2n}$: with 240 monthly observations that is about 4.6%, against a mean that is uncertain by more than its own size. The difficulty with covariances is a different one, their number: $N$ assets have $N(N+1)/2$ variances and covariances, so a sample of a few years cannot pin them down for hundreds of stocks. Imposing a factor structure, as in "Factor models and systematic risk", replaces most of them with a handful of parameters, which is another form of shrinkage.

### Worked example: How long a sample the mean needs

1. Standard error of the mean of a 20%-volatility asset after 5 years, in percentage points.
   $$\mathrm{SE} = \frac{\sigma}{\sqrt n}$$ → **8.94**
2. After 20 years.
   $$\mathrm{SE} = \frac{20\%}{\sqrt{20}}$$ → **4.47**
3. A 95% band around the estimate after 20 years is about 1.96 standard errors either side; its half-width in percentage points.
   $$1.96\cdot\mathrm{SE}$$ → **8.76**
4. Years of data needed to bring the standard error down to 1 percentage point.
   $$n = \left(\frac{\sigma}{\mathrm{SE}}\right)^2$$ → **400**

## Summary

- Sample moments are unbiased but noisy: the standard error of a mean is $\sigma/\sqrt n$ and does not improve with more frequent data.
- An optimiser overweights assets with lucky samples, so the frontier built from estimates is unstable and loses Sharpe ratio in reality.
- Shrinking the means towards a common target adds a little bias and removes much variance.
- Covariances are estimated better than means; the problem there is their number, handled with factor structure.

> The Monte Carlo lessons later in the stochastic track use the same standard-error idea for simulated averages.

[Estimate a frontier from a sample in the Efficient Frontier lab](https://quantsandbox.dev/efficient-frontier)

## Interactive labs

- [Efficient Frontier & Markowitz Portfolio Optimization](https://quantsandbox.dev/efficient-frontier)
- [Capital Allocation Line & Sharpe Ratio Visualizer](https://quantsandbox.dev/risk-return)

## Practice questions

### 1. An asset has an annual volatility of 15%. What is the standard error of its mean return, in percentage points, estimated from 25 years of data?

**Answer:** 3

$\mathrm{SE} = \sigma/\sqrt n = 15\% / \sqrt{25} = 3$ percentage points.

### 2. Which input to a mean–variance optimisation is hardest to estimate precisely from historical data?

- a) Expected returns
- b) Volatilities
- c) Correlations
- d) The number of assets

**Answer:** a) Expected returns

The standard error of a mean is $\sigma/\sqrt n$ and shrinks only with the length of the sample, so it is large compared with the mean itself. Variances and correlations are estimated far more precisely, and sampling more often improves them.

---

Source: https://quantsandbox.dev/guide/portfolio/input-estimation

Previous lesson: [Portfolio Constraints: No-Short-Sales Frontier](https://quantsandbox.dev/guide/portfolio/portfolio-constraints)
