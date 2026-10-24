# Efficient Frontier, Capital Market Line and Sharpe Ratio

Mean–variance optimisation, the minimum-variance portfolio, a risk-free asset and the tangency portfolio. Free interactive lesson with worked examples.

The lesson "Diversification and correlation" showed how the expected return and volatility of a portfolio follow from the weights, volatilities and correlations of its assets. This lesson asks which of those portfolios are worth holding. It first sorts the risky portfolios into good and bad ones, then adds a risk-free asset, which turns the choice into a single line: the capital market line.

## Mean–variance preferences

Throughout the lesson we assume that investors judge a portfolio only by its expected return $\mu$ and its volatility $\sigma$ over one period. They prefer a higher $\mu$ when $\sigma$ is the same, and a lower $\sigma$ when $\mu$ is the same. A portfolio **dominates** another if it is at least as good in both respects and strictly better in one. Investors may differ in how much extra return they demand for extra risk, but no one holds a dominated portfolio.

## Short sales

A **short sale** means borrowing an asset, selling it, and buying it back later to return it. It gives a negative weight. With $w_A = -0.5$ and $w_B = 1.5$ the investor sells A worth half of the own capital and invests one and a half times the capital in B. The formulas of the previous lesson still apply, since they never required the weights to be positive:

$$
\mu_p = -0.5 \times 6\% + 1.5 \times 12\% = 15\%, \qquad \sigma_p^2 = 0.25 \times 0.0225 + 2.25 \times 0.09 - 2 \times 0.75 \times 0.009 = 0.194625.
$$

This is for the assets of the previous lesson ($\mu_A = 6\%$, $\sigma_A = 15\%$, $\mu_B = 12\%$, $\sigma_B = 30\%$, $\rho = 0.2$, so $\sigma_{AB} = 0.009$), and gives $\sigma_p \approx 44.1\%$. Short selling extends the curve of attainable portfolios beyond the two assets in both directions.

## The attainable set and the efficient frontier

Letting the weight $w = w_B$ run over all real numbers traces a curve in the $(\sigma, \mu)$ plane: the **set of attainable portfolios** for two assets. With more assets it becomes a region whose left edge has the same shape. The leftmost point is the **minimum-variance portfolio** from the previous lesson, here $w_B^{*} \approx 0.143$ with $\sigma \approx 14.34\%$ and $\mu \approx 6.86\%$.

The minimum-variance portfolio splits the curve into two branches. Every point on the lower branch is dominated by the point on the upper branch with the same volatility. Example: at $\sigma = 20\%$ the lower branch has $w_B \approx -0.31$ and $\mu \approx 4.14\%$, while the upper branch has $w_B \approx 0.60$ and $\mu \approx 9.58\%$. Nobody would choose the first.

> The **efficient frontier** is the upper branch of the attainable set, from the minimum-variance portfolio upwards. Every portfolio on it gives the highest expected return available for its volatility.

## Adding a risk-free asset

Now add a **risk-free asset** with return $r_f$, for example a short government bill held to maturity. Its volatility is zero and its covariance with every risky asset is zero. Put a fraction $y$ of the money in a risky portfolio P and $1 - y$ in the risk-free asset. By the formulas of the previous lesson

$$
\mu = (1-y)\,r_f + y\,\mu_P = r_f + y\,(\mu_P - r_f), \qquad \sigma = y\,\sigma_P \quad (y \ge 0).
$$

The variance has no cross term because the covariance is zero. Eliminating $y = \sigma/\sigma_P$ gives a straight line from the point $(0, r_f)$ through P:

$$
\mu = r_f + \frac{\mu_P - r_f}{\sigma_P}\,\sigma.
$$

Points between $(0, r_f)$ and P mean lending at $r_f$ ($0 \le y \le 1$). Points beyond P mean borrowing at $r_f$ to invest more than one's own capital in P ($y > 1$); here we assume one can borrow at the same rate.

## The Sharpe ratio and the tangency portfolio

The slope of that line is the **Sharpe ratio** of P,

$$
\text{SR}_P = \frac{\mu_P - r_f}{\sigma_P},
$$

the excess return over $r_f$ per unit of volatility. A steeper line gives more expected return at every level of volatility, so the investor wants the risky portfolio with the largest Sharpe ratio. Rotating the line upward around $(0, r_f)$, the last attainable portfolio it touches is where it is tangent to the efficient frontier. This is the **tangency portfolio** T.

Write $e_i = \mu_i - r_f$ for the excess returns. Maximising $\text{SR}$ over the weights (setting the derivative with respect to $w_B$ to zero) gives weights proportional to

$$
w_A \propto \sigma_B^2\, e_A - \sigma_{AB}\, e_B, \qquad w_B \propto \sigma_A^2\, e_B - \sigma_{AB}\, e_A,
$$

scaled so that they add up to one. With $N$ assets the same result reads $w \propto \Sigma^{-1}(\mu - r_f\mathbf{1})$, where $\Sigma$ is the covariance matrix.

## Worked example

Take the assets above with $r_f = 2\%$, so $e_A = 0.04$ and $e_B = 0.10$:

$$
w_A \propto 0.09 \times 0.04 - 0.009 \times 0.10 = 0.0027, \qquad w_B \propto 0.0225 \times 0.10 - 0.009 \times 0.04 = 0.00189.
$$

Normalising, $w_B = 0.00189 / 0.00459 \approx 0.412$ and $w_A \approx 0.588$. The tangency portfolio has

$$
\mu_T \approx 0.588 \times 6\% + 0.412 \times 12\% \approx 8.47\%, \qquad \sigma_T = \sqrt{0.027405} \approx 16.55\%,
$$

and a Sharpe ratio of $(8.47\% - 2\%)/16.55\% \approx 0.391$. This beats both assets on their own: A has $0.04/0.15 \approx 0.267$ and B has $0.10/0.30 \approx 0.333$.

The figure shows the two-asset curve for weights in B from $-0.5$ to $1.5$, so short positions are included, together with the line from $(0, r_f)$ through the tangency portfolio. Markers show A, B, the minimum-variance portfolio and the tangency portfolio. Raise $r_f$ and note that the tangency point slides up the frontier towards B. Lower $\rho$ and note that the curve moves left and the Sharpe ratio in the readouts rises.

*[Interactive figure: capital market line](https://quantsandbox.dev/guide/portfolio/efficient-frontier)*

## The capital market line

The line through the tangency portfolio is the **capital market line** (CML):

$$
\mu = r_f + \frac{\mu_T - r_f}{\sigma_T}\,\sigma.
$$

Apart from the single point T, it lies above the efficient frontier. Once a risk-free asset is available, every risky-only portfolio other than T is dominated by some point on the CML. At $\sigma = 20\%$, for example, the CML gives $2\% + 0.391 \times 20\% \approx 9.82\%$, more than the $9.58\%$ of the frontier portfolio with the same volatility.

## Two-fund separation

Every efficient choice is therefore a mix of two funds: the risk-free asset and the tangency portfolio. Investors differ only in the proportion $y$, not in the composition of their risky holdings. This result is called **two-fund separation**. Think of a kitchen that serves one soup in different portion sizes, topped up with water to taste: the recipe is the same for everyone.

At the numbers above, a cautious investor who accepts $\sigma = 10\%$ holds $y = 10/16.55 \approx 0.604$ in T and $0.396$ in the risk-free asset, for $\mu \approx 5.91\%$. Without the risk-free asset this volatility would not be reachable at all, since the minimum is 14.34%. A bolder investor who accepts $\sigma = 20\%$ holds $y \approx 1.208$, borrowing about 20.8% of the capital at $r_f$, for $\mu \approx 9.82\%$. Both hold A and B in the same ratio of 58.8 to 41.2.

### Worked example: The cautious investor's point on the capital market line

1. The slope of the CML is the Sharpe ratio of the tangency portfolio.
   $$\text{SR}_T = \frac{8.47\% - 2\%}{16.55\%}$$ → **0.391**
2. A target volatility of 10% fixes the share held in T.
   $$y = \frac{10\%}{16.55\%}$$ → **0.604**
3. The expected return is read off the CML at $\sigma = 10\%$.
   $$\mu = r_f + \text{SR}_T \times 10\%$$ → **5.91%**

## Summary

- With short sales allowed, the attainable portfolios form a curve whose upper branch, from the minimum-variance portfolio up, is the efficient frontier.
- Mixing a risky portfolio P with a risk-free asset gives a line from $(0, r_f)$ through P with slope equal to the Sharpe ratio $(\mu_P - r_f)/\sigma_P$.
- The tangency portfolio maximises the Sharpe ratio; in the example $w_B \approx 0.412$, $\mu_T \approx 8.47\%$, $\sigma_T \approx 16.55\%$, $\text{SR} \approx 0.391$.
- The capital market line $\mu = r_f + \text{SR}_T\,\sigma$ dominates every other risky portfolio.
- Two-fund separation: every investor holds the risk-free asset and the tangency portfolio, only in different proportions.

> The next lesson, "Risk aversion and the optimal complete portfolio", shows which point on the capital market line a given investor picks. After it, "CAPM, beta and the security market line" assumes all investors reason this way and derives what that implies for the expected return of each single asset.

[Build efficient frontiers from many assets in the Efficient Frontier lab](https://quantsandbox.dev/efficient-frontier)

## Interactive labs

- [Efficient Frontier & Markowitz Portfolio Optimization](https://quantsandbox.dev/efficient-frontier)
- [Two-Asset Portfolio: Diversification & Correlation](https://quantsandbox.dev/portfolio-lab)

## Practice questions

### 1. A portfolio has $\mu = 9\%$ and $\sigma = 15\%$, and the risk-free rate is $r_f = 2\%$. What is its Sharpe ratio?

**Answer:** 0.467

$\text{SR} = (9\% - 2\%)/15\% = 7/15 \approx 0.467$.

### 2. Which quantity does the tangency portfolio maximise among all risky portfolios?

- a) The expected return
- b) The Sharpe ratio
- c) The volatility
- d) The weight in the riskier asset

**Answer:** b) The Sharpe ratio

The tangency portfolio is where the steepest line from $(0, r_f)$ touches the frontier, so it has the largest slope $(\mu_P - r_f)/\sigma_P$, the Sharpe ratio.

---

Source: https://quantsandbox.dev/guide/portfolio/efficient-frontier

Previous lesson: [Diversification and Correlation in a Two-Asset Portfolio](https://quantsandbox.dev/guide/portfolio/diversification)

Next lesson: [Risk Aversion, Utility and the Optimal Portfolio](https://quantsandbox.dev/guide/portfolio/risk-aversion)
