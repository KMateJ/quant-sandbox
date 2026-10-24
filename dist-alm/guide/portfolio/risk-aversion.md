# Risk Aversion, Utility and the Optimal Portfolio

Mean–variance utility, indifference curves, the risk-aversion coefficient and the best point on the capital allocation line.

The lesson "The efficient frontier and the capital market line" ended with a single line of portfolios: every investor should hold the same risky portfolio P and mix it with the risk-free asset. It did not say how much of P to hold. That depends on the investor, not on the market. This lesson describes an investor's attitude to risk with one number, the risk-aversion coefficient, and uses it to find the best point on the line.

## The choice left open

Put a fraction $y$ of the capital in P and $1 - y$ in the risk-free asset with return $r_f$. As in the previous lesson, the resulting **complete portfolio** has

$$
\mu = r_f + y\,(\mu_P - r_f), \qquad \sigma = y\,\sigma_P.
$$

Every value of $y$ is a point on the capital allocation line. A cautious investor picks a small $y$, a bold one a large $y$, and $y > 1$ means borrowing at $r_f$ to invest more than the own capital in P. To compare the points we need a rule that weighs expected return against risk.

## Mean–variance utility

The standard rule assigns each portfolio a score, its **utility**,

$$
U = \mu - \tfrac{1}{2} A\,\sigma^2,
$$

with rates written as decimals. The **risk-aversion coefficient** $A$ says how heavily the investor penalises variance. With $A > 0$ the investor is risk-averse: of two portfolios with the same $\mu$, the one with the lower $\sigma$ scores higher. With $A = 0$ only the expected return matters (risk neutrality). Values between about 2 and 6 are typical for the way people actually invest.

Example: the risky portfolio has $\mu_P = 11\%$ and $\sigma_P = 20\%$. For an investor with $A = 4$,

$$
U_P = 0.11 - \tfrac{1}{2}\times 4 \times 0.20^2 = 0.11 - 0.08 = 0.03.
$$

## Certainty equivalent

A risk-free investment has $\sigma = 0$, so its utility is just its return. The utility of any portfolio can therefore be read as a rate: the **certainty equivalent**, the sure return that the investor finds exactly as attractive as the risky portfolio. In the example the investor values P like a sure 3%. If the risk-free rate is $r_f = 3\%$, holding only P and holding only bills are equally good for this investor.

## Indifference curves

All portfolios with the same utility $U$ satisfy

$$
\mu = U + \tfrac{1}{2} A\,\sigma^2.
$$

In the $(\sigma, \mu)$ plane this is an upward-curving parabola, an **indifference curve**: the investor does not care which point on it they hold. Each extra unit of risk must be paid for with more expected return, and the price rises with $\sigma$. Curves further up mean higher utility. A larger $A$ makes the curves steeper, because a more risk-averse investor demands more compensation for the same risk.

## The optimal complete portfolio

Substituting the complete portfolio into the utility gives a function of $y$ alone:

$$
U(y) = r_f + y\,(\mu_P - r_f) - \tfrac{1}{2} A\,\sigma_P^2\, y^2.
$$

It is a downward-opening parabola in $y$. Setting the derivative $(\mu_P - r_f) - A\sigma_P^2\, y$ to zero gives

$$
y^{*} = \frac{\mu_P - r_f}{A\,\sigma_P^2}, \qquad U^{*} = r_f + \frac{\text{SR}_P^2}{2A},
$$

where $\text{SR}_P = (\mu_P - r_f)/\sigma_P$ is the Sharpe ratio. Geometrically, $y^*$ is where an indifference curve just touches the capital allocation line: higher curves miss the line, lower ones cut it in two points that are both worse.

> The optimal weight in the risky portfolio is $y^{*} = (\mu_P - r_f)/(A\sigma_P^2)$: proportional to its excess return, inversely proportional to its variance and to the investor's risk aversion.

## Worked example

Take $\mu_P = 11\%$, $\sigma_P = 20\%$, $r_f = 3\%$ and $A = 4$. Then

$$
y^{*} = \frac{0.08}{4 \times 0.04} = 0.5, \qquad \mu = 3\% + 0.5 \times 8\% = 7\%, \qquad \sigma = 0.5 \times 20\% = 10\%,
$$

and $U^{*} = 0.07 - \tfrac{1}{2}\times 4 \times 0.01 = 5\%$. Holding only bills or only P each gives a certainty equivalent of 3%, so the half-and-half mix is clearly better than either end. A more risk-averse investor with $A = 8$ holds $y^* = 0.25$ (expected return 5%, volatility 5%); one with $A = 2$ holds exactly P ($y^* = 1$).

A second investor faces a different market, $\mu_P = 10\%$, $\sigma_P = 25\%$ and $r_f = 2\%$, and has $A = 3$.

### Worked example: Optimal complete portfolio for a second investor

1. Optimal weight in the risky portfolio.
   $$y^{*} = \frac{\mu_P - r_f}{A\,\sigma_P^2}$$ → **0.4267**
2. Expected return of the complete portfolio.
   $$\mu = r_f + y^{*}(\mu_P - r_f)$$ → **5.413%**
3. Its volatility.
   $$\sigma = y^{*}\sigma_P$$ → **10.67%**
4. Its utility, through the Sharpe ratio $\text{SR}_P = 0.32$.
   $$U^{*} = r_f + \frac{\text{SR}_P^2}{2A}$$ → **3.707%**

## Borrowing

The optimal weight exceeds one when $A < (\mu_P - r_f)/\sigma_P^2$, here when $A < 2$. With $A = 1.6$ the investor wants $y^* = 0.08/(1.6 \times 0.04) = 1.25$: borrow a quarter of the own capital at $r_f$ and invest 125% in P, for an expected return of 13% and a volatility of 25%. In practice investors borrow at a higher rate than they lend, which bends the line downwards beyond P and lowers the optimal borrowing.

The figure draws the capital allocation line for the example. Drag the point along it to choose $y$; the curve through that point is the indifference curve you are on, and the dashed curve belongs to the optimum. Start at P, where the two curves are far apart, and drag towards the risk-free end: utility rises until the point snaps onto the optimum at $y = 0.5$, then falls again. Switch $A$ and note that the optimum moves while the line stays the same.

*[Interactive figure: utility indifference](https://quantsandbox.dev/guide/portfolio/risk-aversion)*

## Separation of the two decisions

The result splits the investment problem in two. Which risky portfolio to hold depends only on the market (expected returns, volatilities, correlations): every mean–variance investor picks the tangency portfolio. How much of it to hold depends only on the investor's $A$. This is the **two-fund separation** result: any optimal portfolio is a mix of the same two funds, the risk-free asset and P.

## Summary

- Mean–variance utility $U = \mu - \tfrac{1}{2}A\sigma^2$ scores a portfolio; $A$ measures risk aversion.
- A portfolio's utility is its certainty equivalent: the sure return the investor finds equally attractive.
- Indifference curves $\mu = U + \tfrac{1}{2}A\sigma^2$ are parabolas, steeper for larger $A$.
- The best complete portfolio holds $y^* = (\mu_P - r_f)/(A\sigma_P^2)$ in P; $y^* > 1$ means borrowing.
- Everyone holds the same risky portfolio; only the split between it and the risk-free asset differs.

> The next lesson, "CAPM, beta and the security market line", asks what happens to prices when every investor holds the same risky portfolio.

[Combine a risky asset with the risk-free rate and move along the capital allocation line in the Risk & Return lab](https://quantsandbox.dev/risk-return)

## Interactive labs

- [Capital Allocation Line & Sharpe Ratio Visualizer](https://quantsandbox.dev/risk-return)
- [Efficient Frontier & Markowitz Portfolio Optimization](https://quantsandbox.dev/efficient-frontier)

## Practice questions

### 1. A portfolio has $\mu = 9\%$ and $\sigma = 15\%$. What is its certainty equivalent for an investor with $A = 4$? Answer in percent.

**Answer:** 4.5%

$U = 0.09 - \tfrac{1}{2}\times 4 \times 0.15^2 = 0.09 - 0.045 = 4.5\%$: the investor values the portfolio like a sure 4.5%.

### 2. An investor's optimal weight in the risky portfolio is $y^{*} = 0.6$. Their risk aversion doubles while the market stays the same. What is the new optimal weight?

- a) 0.3: $y^{*}$ is inversely proportional to $A$
- b) 0.15: risk enters squared
- c) 0.6: the tangency portfolio does not change
- d) 1.2: a more cautious investor needs more return

**Answer:** a) 0.3: $y^{*}$ is inversely proportional to $A$

$y^{*} = (\mu_P - r_f)/(A\sigma_P^2)$ is proportional to $1/A$, so doubling $A$ halves it. The risky portfolio itself stays the same; only the amount held changes.

---

Source: https://quantsandbox.dev/guide/portfolio/risk-aversion

Previous lesson: [Efficient Frontier, Capital Market Line and Sharpe Ratio](https://quantsandbox.dev/guide/portfolio/efficient-frontier)

Next lesson: [CAPM, Beta and the Security Market Line Explained](https://quantsandbox.dev/guide/portfolio/capm)
