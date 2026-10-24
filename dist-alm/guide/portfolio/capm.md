# CAPM, Beta and the Security Market Line Explained

Systematic versus idiosyncratic risk, beta as market sensitivity, expected return and alpha. Free interactive lesson with worked examples.

The lesson "The efficient frontier and the capital market line" described how a single investor should choose a portfolio. This lesson assumes that every investor behaves that way and works out the consequence for prices. The result is the capital asset pricing model (CAPM): the expected return of any asset depends on one number, its beta.

## Assumptions

The CAPM rests on the following simplifications, each stated explicitly:

- Investors care only about the expected return and volatility of their portfolio over one common period (mean–variance preferences from the previous lesson).
- All investors agree on the expected returns, volatilities and correlations of all assets (homogeneous expectations).
- Everyone can lend and borrow any amount at the same risk-free rate $r_f$.
- There are no taxes or transaction costs, assets can be split into any fraction, short sales are allowed, and no single investor can move prices.

None of these holds exactly. The point is to see what follows if they did, and then to judge how far reality departs.

## The market portfolio

By two-fund separation, every investor holds the risk-free asset and the same tangency portfolio T, only in different amounts. Add up all investors' holdings: the total risky holding is a multiple of T. But the total risky holding must equal everything that exists, because every share outstanding is owned by someone. So in equilibrium T is the **market portfolio** M: every risky asset, held in proportion to its market value.

Write $\mathbb{E}[R_m]$ and $\sigma_m$ for the expected return and volatility of the market portfolio. The capital market line becomes

$$
\mathbb{E}[R_p] = r_f + \frac{\mathbb{E}[R_m] - r_f}{\sigma_m}\,\sigma_p,
$$

valid for efficient portfolios, that is mixes of $r_f$ and M. A single asset is not efficient and generally lies below this line, so the CML alone does not say what its expected return should be.

## Beta

The **beta** of asset $i$ measures how strongly its return moves with the market:

$$
\beta_i = \frac{\operatorname{Cov}(R_i, R_m)}{\operatorname{Var}(R_m)} = \rho_{im}\,\frac{\sigma_i}{\sigma_m}.
$$

The market itself has $\beta_m = 1$, the risk-free asset has $\beta = 0$, and the beta of a portfolio is the weighted average of the betas of its assets, because covariance is linear in each argument. A beta of 1.3 means that when the market is 1% above its mean, the asset is on average 1.3% above its own.

## Deriving the security market line

Start from the market portfolio and move a small amount $\varepsilon$ of money from the risk-free asset into asset $i$. The expected return changes by $\varepsilon(\mathbb{E}[R_i] - r_f)$. The variance $\sigma_m^2$ changes by $2\varepsilon\operatorname{Cov}(R_i, R_m)$ to first order, so the volatility changes by

$$
d\sigma = \varepsilon\,\frac{\operatorname{Cov}(R_i, R_m)}{\sigma_m}.
$$

Because M is the tangency portfolio, no such small move can improve the trade-off: the ratio of extra return to extra volatility must equal the slope of the CML for every asset,

$$
\frac{\mathbb{E}[R_i] - r_f}{\operatorname{Cov}(R_i, R_m)/\sigma_m} = \frac{\mathbb{E}[R_m] - r_f}{\sigma_m}.
$$

Otherwise one could tilt the portfolio towards (or away from) asset $i$ and obtain a higher Sharpe ratio than M. Solving for $\mathbb{E}[R_i]$ gives the **security market line** (SML):

$$
\mathbb{E}[R_i] = r_f + \beta_i\,\big(\mathbb{E}[R_m] - r_f\big).
$$

> CAPM: the expected excess return of any asset equals its beta times the **market risk premium** $\mathbb{E}[R_m] - r_f$.

## Systematic and idiosyncratic risk

Split the excess return of asset $i$ into a part explained by the market and a remainder:

$$
R_i - r_f = \alpha_i + \beta_i\,(R_m - r_f) + \varepsilon_i, \qquad \operatorname{Cov}(\varepsilon_i, R_m) = 0.
$$

Taking variances gives

$$
\sigma_i^2 = \beta_i^2\sigma_m^2 + \sigma_{\varepsilon}^2.
$$

The first term is **systematic** risk, the second **idiosyncratic** (firm-specific) risk. The lesson "Diversification and correlation" showed that in a large portfolio firm-specific variances disappear while common movements remain. An investor holding the market therefore bears only systematic risk, and the SML says only that part earns a premium. Idiosyncratic risk is not priced, because it can be removed at no cost.

Example: an asset with $\sigma_i = 35\%$ and correlation $0.6$ with a market of $\sigma_m = 20\%$ has $\beta = 0.6 \times 0.35 / 0.20 = 1.05$. Its systematic variance is $1.05^2 \times 0.04 = 0.0441$, out of a total of $0.1225$: only 36% (that is, $\rho^2$). The remaining 64%, a residual volatility of 28%, is idiosyncratic and earns no premium.

## Worked example

Let $r_f = 3\%$, $\mathbb{E}[R_m] = 8\%$ and $\beta = 1.3$. The market risk premium is $8\% - 3\% = 5\%$. The required return of the asset is

$$
\mathbb{E}[R_i] = 3\% + 1.3 \times 5\% = 9.5\%,
$$

so its risk premium is $6.5\%$. An asset with $\beta = 0.5$ would require only $5.5\%$, however volatile it is on its own.

The figure plots expected return against beta from 0 to 2. The SML starts at $r_f$ for $\beta = 0$ and passes through the market at $\beta = 1$; a second marker shows the asset. Raise $\mathbb{E}[R_m]$ and note that the line becomes steeper around the fixed point $(0, r_f)$. Move $\beta$ and note that the asset slides along the line. The readouts give the market risk premium, the required return of the asset and its risk premium.

*[Interactive figure: security market line](https://quantsandbox.dev/guide/portfolio/capm)*

The SML and the CML are different lines. The CML has volatility on the horizontal axis and holds only for efficient portfolios. The SML has beta on the horizontal axis and holds for every asset and every portfolio.

## Alpha

The **alpha** of an asset is the gap between the expected return one actually forecasts and the return the SML requires:

$$
\alpha_i = \mathbb{E}[R_i] - \big(r_f + \beta_i(\mathbb{E}[R_m] - r_f)\big).
$$

If an analyst expects 11% from the asset above, its alpha is $11\% - 9.5\% = 1.5\%$: it plots above the SML and looks cheap for its risk. In the CAPM world such a gap cannot last. Investors would buy the asset, its price would rise and its expected return would fall until $\alpha = 0$. A measured alpha is therefore either a mispricing, a reward for a risk the CAPM leaves out, or estimation noise.

## Estimating beta

In practice beta is estimated by an ordinary least-squares regression of the asset's excess returns on the excess returns of a broad index, typically 60 monthly observations or 2 years of weekly ones. The regression slope is the sample covariance divided by the sample variance of the index. Example: if the sample covariance of monthly returns is $0.0018$ and the monthly index variance is $0.0016$, then $\hat\beta = 0.0018/0.0016 = 1.125$. The intercept estimates alpha.

### Worked example: From a sample covariance to a required return

1. The regression slope is the sample covariance with the index divided by the index variance.
   $$\hat\beta = \frac{0.0018}{0.0016}$$ → **1.125**
2. With $r_f = 3\%$ and $\mathbb{E}[R_m] = 8\%$ the market risk premium is 5%, and the SML gives the required return.
   $$\mathbb{E}[R_i] = 3\% + 1.125 \times 5\%$$ → **8.625%**

Such estimates are noisy, they change as the firm's business and leverage change, and they depend on the index and the return frequency. Practitioners often shrink raw estimates towards 1 for these reasons.

## Limitations

- The true market portfolio contains all risky assets, including property and human capital. It cannot be observed, so every test uses a proxy index.
- Empirically the SML is flatter than predicted: low-beta stocks earn more and high-beta stocks less than the model says.
- Other characteristics, such as firm size and book-to-market value, explain average returns that beta does not. Multi-factor models add these as extra risk factors.
- The model covers a single period and ignores taxes, trading costs and borrowing limits.

Despite this, the CAPM remains the standard first estimate of a required return, for instance as the cost of equity in corporate finance.

## Summary

- If all investors use mean–variance analysis with the same inputs, the tangency portfolio is the market portfolio.
- Beta $\beta_i = \operatorname{Cov}(R_i, R_m)/\operatorname{Var}(R_m)$ measures an asset's exposure to market movements.
- Only systematic risk $\beta_i^2\sigma_m^2$ is priced; idiosyncratic risk can be diversified away and earns no premium.
- Security market line: $\mathbb{E}[R_i] = r_f + \beta_i(\mathbb{E}[R_m] - r_f)$; alpha is the deviation from it.
- Beta is estimated by regressing excess returns on an index; the model is a useful benchmark with known empirical weaknesses.

[Estimate betas and compare assets with the security market line in the CAPM lab](https://quantsandbox.dev/capm)

## Interactive labs

- [CAPM Calculator & Security Market Line](https://quantsandbox.dev/capm)

## Practice questions

### 1. An asset has $\beta = 1.3$. The risk-free rate is 2% and the market is expected to return 8%. What expected return does the CAPM require, in percent?

**Answer:** 9.8%

$\mathbb{E}[R_i] = 2\% + 1.3 \times (8\% - 2\%) = 2\% + 7.8\% = 9.8\%$.

### 2. An analyst's forecast puts an asset above the security market line, so its alpha is positive. In the CAPM, what does that say about the asset?

- a) It is overvalued for its risk
- b) It is undervalued for its risk
- c) Its beta is too high
- d) It carries no systematic risk

**Answer:** b) It is undervalued for its risk

A positive alpha means the forecast return exceeds what the SML requires for its beta, so the asset looks cheap. Buying pressure would raise its price until $\alpha = 0$.

---

Source: https://quantsandbox.dev/guide/portfolio/capm

Previous lesson: [Risk Aversion, Utility and the Optimal Portfolio](https://quantsandbox.dev/guide/portfolio/risk-aversion)

Next lesson: [Sharpe, Treynor, Jensen's Alpha and Information Ratio](https://quantsandbox.dev/guide/portfolio/performance-measures)
