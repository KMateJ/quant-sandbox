# Factor Models: Single-Index Model and Systematic Risk

The single-index model, splitting systematic from specific variance, and multi-factor models. Free interactive lesson with worked examples.

The lesson "CAPM, beta and the security market line" split the risk of a single asset into a systematic part, driven by the market, and an idiosyncratic part. This lesson turns that split into a model for a whole set of assets at once. The model explains why stocks move together, gives every covariance from a handful of numbers, and shows exactly how much risk a portfolio keeps however many stocks it holds.

## The number of parameters

The lesson "The efficient frontier and the capital market line" needed the full covariance matrix of the assets. For $N$ assets this matrix has $N$ variances on the diagonal and $N(N-1)/2$ different covariances off the diagonal (the matrix is symmetric, $\sigma_{ij} = \sigma_{ji}$), so it has

$$
N + \frac{N(N-1)}{2} = \frac{N(N+1)}{2}
$$

separate entries. For 500 stocks that is $500 \times 501/2 = 125\,250$ numbers to estimate. With a few years of monthly data there are far fewer observations per stock than that, so most of these estimates would be noise. A **factor model** cuts the number down by assuming that all common movement comes from a few sources.

## The single-index model

The simplest factor model uses one factor, the return $R_M$ of a broad market index with volatility $\sigma_M$. Each stock's return is written as

$$
R_i = \alpha_i + \beta_i R_M + \varepsilon_i, \qquad i = 1, \dots, N.
$$

Here $\beta_i$ is the sensitivity of stock $i$ to the index, $\alpha_i$ is a constant, and $\varepsilon_i$ is the stock's **specific** (idiosyncratic) return, with mean zero and volatility $\sigma_{\varepsilon,i}$. The model makes two assumptions:

- Each $\varepsilon_i$ is uncorrelated with the index: $\operatorname{Cov}(\varepsilon_i, R_M) = 0$.
- The specific returns of different stocks are uncorrelated with each other: $\operatorname{Cov}(\varepsilon_i, \varepsilon_j) = 0$ for $i \ne j$.

The first assumption only defines $\beta_i$ as a regression slope. The second is the real restriction: it says the index is the *only* reason two stocks move together.

## Variances and covariances in the index model

Take the variance of $R_i$. The constant $\alpha_i$ drops out, and because $\varepsilon_i$ is uncorrelated with $R_M$ there is no cross term:

$$
\operatorname{Var}(R_i) = \beta_i^2\sigma_M^2 + \sigma_{\varepsilon,i}^2.
$$

For two different stocks, covariance is linear in each argument, so expand the product. The terms $\operatorname{Cov}(R_M, \varepsilon_j)$, $\operatorname{Cov}(\varepsilon_i, R_M)$ and $\operatorname{Cov}(\varepsilon_i, \varepsilon_j)$ are all zero by the assumptions, which leaves

$$
\operatorname{Cov}(R_i, R_j) = \beta_i\beta_j\,\operatorname{Cov}(R_M, R_M) = \beta_i\beta_j\,\sigma_M^2 \qquad (i \ne j).
$$

Every entry of the covariance matrix now follows from the betas, the specific volatilities and $\sigma_M$. Counting the numbers that the covariance matrix needs, there are $N$ betas, $N$ specific volatilities and one market volatility: $2N + 1$ parameters instead of $N(N+1)/2$. If the alphas are included as well, to describe expected returns, the count is $3N + 1$. For 500 stocks that is 1001 risk parameters (1501 with the alphas) instead of 125 250.

## Diversification in the index model

A portfolio with weights $w_i$ has return $R_p = \sum_i w_i R_i = \alpha_p + \beta_p R_M + \sum_i w_i\varepsilon_i$, where $\beta_p = \sum_i w_i\beta_i$ is the weighted average beta. The specific returns are uncorrelated with the index and with each other, so

$$
\sigma_p^2 = \beta_p^2\sigma_M^2 + \sum_{i=1}^{N} w_i^2\,\sigma_{\varepsilon,i}^2.
$$

Now take $N$ stocks in equal weights $w_i = 1/N$, all with the same beta $\beta$ and the same specific volatility $\sigma_\varepsilon$. The specific sum has $N$ terms of size $\sigma_\varepsilon^2/N^2$:

$$
\sigma_p^2 = \beta^2\sigma_M^2 + \frac{\sigma_\varepsilon^2}{N} \;\longrightarrow\; \beta^2\sigma_M^2 \quad (N \to \infty).
$$

This is the result of "Diversification and correlation" with a structure filled in. There, the variance of an equally weighted portfolio tended to the average covariance. In the index model every covariance between different stocks is $\beta^2\sigma_M^2$, so the average covariance is exactly the systematic variance, and the volatility can never fall below the **systematic floor** $\beta\sigma_M$.

> In the single-index model the specific variance of an equally weighted portfolio is $\sigma_\varepsilon^2/N$ and vanishes as $N$ grows. The systematic part $\beta_p^2\sigma_M^2$ does not depend on $N$ at all.

## The systematic share of variance

The fraction of variance explained by the index is

$$
R^2 = \frac{\beta^2\sigma_M^2}{\beta^2\sigma_M^2 + \sigma_\varepsilon^2},
$$

the same $R^2$ that a regression of the stock on the index reports. For a single stock it equals $\rho^2$, the squared correlation with the index, as in the CAPM lesson. For a typical single stock $R^2$ is well below one half; for a portfolio of 20 or more stocks it is usually close to one.

### Worked example: Splitting one stock's variance

1. A stock has $\beta = 1.2$ against an index with $\sigma_M = 20\%$. Its systematic variance is
   $$\beta^2\sigma_M^2 = 1.44 \times 0.04$$ → **0.0576**
2. Its specific volatility is $\sigma_\varepsilon = 25\%$, so the specific variance is
   $$\sigma_\varepsilon^2 = 0.25^2$$ → **0.0625**
3. The total variance is the sum, because the two parts are uncorrelated.
   $$\sigma^2 = 0.0576 + 0.0625$$ → **0.1201**
4. The systematic share is the $R^2$ of the stock.
   $$R^2 = \frac{0.0576}{0.1201}$$ → **47.96%**

## Estimating the index model

The parameters come from the regression already used to estimate beta in "CAPM, beta and the security market line": regress the stock's returns on the index returns over, say, 60 months. The slope is $\hat\beta_i$, the intercept is $\hat\alpha_i$, and the standard deviation of the residuals estimates $\sigma_{\varepsilon,i}$. That lesson used excess returns; with a constant $r_f$ the slope is the same and only the intercept changes. The sample variance of the index gives $\sigma_M$.

## The index model and the CAPM

The two look alike but make different kinds of claims. The single-index model is a **statistical** model: it describes how returns covary, and its key assumption, uncorrelated specific returns, can be checked in the data. It says nothing about what expected returns should be; any value of $\alpha_i$ is allowed. The CAPM is an **equilibrium** model: from assumptions about investors it concludes that expected excess returns are proportional to beta, so that alpha in the excess-return regression is zero. The CAPM does not need the specific returns to be uncorrelated, and the index model does not need the CAPM to hold. In practice the CAPM supplies the expected returns and the index model the covariance matrix.

## Worked example

Let $\sigma_M = 18\%$, $\beta = 1$ and $\sigma_\varepsilon = 30\%$ for every stock. A single stock has variance $0.0324 + 0.09 = 0.1224$, a volatility of about $35.0\%$, and an $R^2$ of $0.0324/0.1224 \approx 26.5\%$. With 20 stocks in equal weights,

$$
\sigma_p^2 = 0.0324 + \frac{0.09}{20} = 0.0369, \qquad \sigma_p \approx 19.21\%.
$$

The floor is $\beta\sigma_M = 18\%$, and the systematic share is $0.0324/0.0369 \approx 87.8\%$. Twenty stocks have removed almost all of the specific risk: the volatility fell from 35% to 19.2%, and only 1.2 percentage points remain above the floor. For 100 stocks the full covariance matrix has $100 \times 101/2 = 5050$ entries, while the index model needs $2 \times 100 + 1 = 201$ (301 with the alphas).

The figure keeps the market volatility fixed at $\sigma_M = 18\%$ and builds an equally weighted portfolio of $N$ stocks that all share the same beta and the same specific volatility. The sliders set the average beta $\beta$ (0.5 to 1.5, default 1), the specific volatility (10% to 60%, default 30%) and the number of stocks $N$ (1 to 100, default 20). The chart plots portfolio volatility against $N$ from 1 to 100 together with the floor $\beta\sigma_M$, and a vertical line marks the chosen $N$. The readouts give the portfolio volatility at that $N$, the floor, the systematic share of variance, and the number of parameters for $N$ stocks under the full covariance matrix and under the single-index model. Raise the specific volatility to 60% and note how many more stocks it takes to approach the floor: about 25 stocks bring the volatility within one percentage point of 18% at 30%, about 98 at 60%. Then move $\beta$ and watch the floor shift, to $23.4\%$ at $\beta = 1.3$.

*[Interactive figure: factor variance](https://quantsandbox.dev/guide/portfolio/factor-models)*

## Multi-factor models

One index rarely explains all common movement: banks move with banks and small firms with small firms, so the specific returns of related stocks are correlated, against the second assumption. A **multi-factor model** adds more common sources $F_1, \dots, F_K$:

$$
R_i = \alpha_i + \sum_{k=1}^{K}\beta_{ik}F_k + \varepsilon_i,
$$

again with specific returns uncorrelated with the factors and with each other. Collect the loadings $\beta_{ik}$ into an $N \times K$ matrix $B$, the factor covariances into a $K \times K$ matrix $\Sigma_F$, and the specific variances into a diagonal matrix $D$. The same expansion as above gives the covariance matrix of the returns

$$
\Sigma = B\,\Sigma_F\,B^{\top} + D,
$$

with $NK + K(K+1)/2 + N$ parameters; for 500 stocks and 3 factors that is 2006. The best-known factors are those of Fama and French: besides the market, **size** (the return of small firms minus large firms) and **value** (the return of high book-to-market firms minus low book-to-market firms). Carhart added **momentum**, the return of recent winners minus recent losers. Each such factor is itself the return of a long–short portfolio. Whether these factors are rewards for risk or persistent mispricings is still debated; as a description of covariances they work well.

## Summary

- A full covariance matrix for $N$ assets has $N(N+1)/2$ entries; factor models replace it with a few parameters per asset.
- Single-index model: $R_i = \alpha_i + \beta_i R_M + \varepsilon_i$, giving $\operatorname{Var}(R_i) = \beta_i^2\sigma_M^2 + \sigma_{\varepsilon,i}^2$ and $\operatorname{Cov}(R_i, R_j) = \beta_i\beta_j\sigma_M^2$, with $2N + 1$ risk parameters ($3N + 1$ with alphas).
- Portfolio variance is $\beta_p^2\sigma_M^2 + \sum_i w_i^2\sigma_{\varepsilon,i}^2$; in equal weights the specific part is $\sigma_\varepsilon^2/N$ and the volatility falls towards the floor $\beta_p\sigma_M$.
- The index model is a statistical description of covariances; the CAPM is an equilibrium statement about expected returns.
- Multi-factor models (market, size, value, momentum) give $\Sigma = B\Sigma_F B^{\top} + D$.

> The next lesson, "Value at Risk and expected shortfall", turns a portfolio's volatility into a loss level, and a factor covariance matrix is how that volatility is usually computed for large portfolios.

[Estimate betas and split systematic from specific risk in the CAPM lab](https://quantsandbox.dev/capm)

## Interactive labs

- [CAPM Calculator & Security Market Line](https://quantsandbox.dev/capm)
- [Two-Asset Portfolio: Diversification & Correlation](https://quantsandbox.dev/portfolio-lab)

## Practice questions

### 1. In the single-index model stock A has $\beta_A = 1.2$, stock B has $\beta_B = 0.8$, and the index volatility is $\sigma_M = 20\%$. What is $\operatorname{Cov}(R_A, R_B)$, as a decimal?

**Answer:** 0.0384

$\operatorname{Cov}(R_A, R_B) = \beta_A\beta_B\sigma_M^2 = 1.2 \times 0.8 \times 0.04 = 0.0384$. The specific volatilities do not enter: in this model only the index links the two stocks.

### 2. An equally weighted portfolio holds more and more stocks, all with beta $\beta$ and specific volatility $\sigma_\varepsilon$. What does its volatility tend to?

- a) Zero
- b) $\beta\sigma_M$
- c) $\sigma_\varepsilon$
- d) $\sqrt{\beta^2\sigma_M^2 + \sigma_\varepsilon^2}$, the volatility of one stock

**Answer:** b) $\beta\sigma_M$

The specific part $\sigma_\varepsilon^2/N$ vanishes while the systematic part $\beta^2\sigma_M^2$ stays, so the volatility falls to the floor $\beta\sigma_M$.

---

Source: https://quantsandbox.dev/guide/portfolio/factor-models

Previous lesson: [Sharpe, Treynor, Jensen's Alpha and Information Ratio](https://quantsandbox.dev/guide/portfolio/performance-measures)

Next lesson: [Value at Risk (VaR) and Expected Shortfall Explained](https://quantsandbox.dev/guide/portfolio/risk-measures)
