# Portfolio Constraints: No-Short-Sales Frontier

Why real portfolios cannot follow the unconstrained frontier: short-sale bans, position limits, and what they cost in Sharpe ratio.

"The efficient frontier and the capital market line" finds the best portfolio when any weights are allowed, including negative ones. Almost no real investor may do that: many funds cannot sell short, others cap each position or sector. This lesson asks what such rules do to the frontier and what they cost, building on the two-asset picture of "Diversification and correlation".

## What a constraint is

The only constraint in the earlier lessons is the budget: the weights add up to one, $\sum_i w_i = 1$. Real mandates add more:

- **No short sales:** $w_i \ge 0$ for every asset. Common for pension funds and mutual funds.
- **Position caps:** $w_i \le \bar w$, for example 10% in any single stock, to force diversification.
- **Group limits:** at most 30% in one sector or one country.

Each is a condition on the weights, so the minimum-variance problem is solved over a smaller set of portfolios than before.

## The constrained frontier

The efficient frontier is the lowest-volatility portfolio for each target return. If we minimise over a smaller set, the best volatility can only stay the same or get worse. Hence the constrained frontier never lies to the left of the unconstrained one: it touches it where the free optimum happens to respect the rules and lies inside it elsewhere.

With short sales banned, the weights live on a triangle (for three assets), and the frontier is traced out by portfolios that sit on the triangle's edges and corners. The cheapest way to see it is the figure: three assets with expected returns 5%, 6% and 10% and volatilities 10%, 18% and 24%. The second and third assets are strongly correlated (0.85), so the free optimum wants to sell the weaker one short and use the money to buy more of the stronger one.

*[Interactive figure: constrained frontier](https://quantsandbox.dev/guide/portfolio/portfolio-constraints)*

At a risk-free rate of 2% the free tangency portfolio holds 80%, $-$50% and 70% in the three assets: it is short half of the second asset. The banned frontier cannot do that, so its tangency portfolio holds 67%, 0% and 33%. The two frontiers coincide where no short position is needed, and separate as the target return rises. Raise the risk-free rate in the figure and the gap widens, because the tangency portfolio moves further out where shorting matters more.

## The cost of a constraint

Because the best Sharpe ratio is attained on the frontier, the cost of a rule can be measured as the Sharpe ratio it removes. In the figure at the defaults the free tangency portfolio has a Sharpe ratio of 0.416 and the banned one 0.394, a loss of 0.023 or about 5%. That is the price of the ban on this set of assets; with weakly correlated assets the free optimum needs no short positions and the price is zero.

A caution: the free optimum with big short positions is also the one most sensitive to errors in the inputs. The no-short-sales portfolio gives up some theoretical Sharpe ratio but is often less wrong out of sample, a point the next lesson develops.

### Worked example: What the short-sales ban costs at the figure's defaults

1. Free tangency portfolio: expected return 8.00%, volatility 14.41%, risk-free rate 2%.
   $$S_{\text{free}} = \frac{\mu - r_f}{\sigma}$$ → **0.4164**
2. Banned tangency portfolio: expected return 6.65%, volatility 11.81%.
   $$S_{\text{ban}} = \frac{\mu - r_f}{\sigma}$$ → **0.3938**
3. The cost of the ban in Sharpe ratio.
   $$S_{\text{free}} - S_{\text{ban}}$$ → **0.0226**
4. As a share of the free Sharpe ratio, in per cent.
   $$100\,\frac{S_{\text{free}} - S_{\text{ban}}}{S_{\text{free}}}$$ → **5.4**

## Constraints as views

A short-sale ban is a crude statement that no asset is expected to do so badly that it deserves a negative weight. Seen that way it acts like a mild form of shrinkage on the weights. More refined methods, such as the Black–Litterman model, build the investor's views into the expected returns instead, but the idea is the same: stop the optimiser from acting on extreme inputs.

## Summary

- Constraints (no short sales, caps, group limits) restrict the weights to a smaller set of portfolios.
- The constrained frontier is never better than the free one: it touches it where the free optimum is allowed, and lies inside it elsewhere.
- The cost of a rule is the Sharpe ratio it removes: 0.023 at the figure's defaults, about 5%.
- Constraints also tame extreme weights, which matters when the inputs are uncertain.

> The next lesson, "Estimating expected returns and covariances", shows how uncertain those inputs are and why optimisers magnify the errors.

[Pin a frontier in the Efficient Frontier lab and change the constraint set](https://quantsandbox.dev/efficient-frontier)

## Interactive labs

- [Efficient Frontier & Markowitz Portfolio Optimization](https://quantsandbox.dev/efficient-frontier)
- [Two-Asset Portfolio: Diversification & Correlation](https://quantsandbox.dev/portfolio-lab)

## Practice questions

### 1. Which statement about the frontier with a no-short-sales constraint is always true?

- a) It is never above the unconstrained frontier
- b) It is a straight line
- c) It has a higher best Sharpe ratio
- d) It needs more than three assets

**Answer:** a) It is never above the unconstrained frontier

A constraint shrinks the set of allowed portfolios, so the lowest volatility for a given return can only stay equal or rise. The best Sharpe ratio therefore cannot improve either.

### 2. Two assets are perfectly correlated ($\rho = 1$) with volatilities 10% and 20%. Without constraints the minimum-variance portfolio holds 200% in the first asset and $-$100% in the second. What weight, in per cent, does the no-short-sales minimum-variance portfolio hold in the first asset?

**Answer:** 100

With a ban, the weight must stay between 0 and 1. Volatility falls as weight moves into the less volatile first asset, so the best allowed portfolio is at the corner: 100% in asset 1.

---

Source: https://quantsandbox.dev/guide/portfolio/portfolio-constraints

Previous lesson: [Value at Risk (VaR) and Expected Shortfall Explained](https://quantsandbox.dev/guide/portfolio/risk-measures)

Next lesson: [Estimation Error in Portfolio Optimization](https://quantsandbox.dev/guide/portfolio/input-estimation)
