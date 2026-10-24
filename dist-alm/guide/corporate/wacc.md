# WACC Explained: Weighted Average Cost of Capital

Cost of equity, after-tax cost of debt, the interest tax shield and market-value weights. Free interactive lesson with worked examples.

The lesson "Net present value and internal rate of return" discounted project cash flows at a rate $r$ without saying where that rate comes from. For a project with the same risk as the firm as a whole, the standard answer is the weighted average cost of capital. This lesson builds it from the returns demanded by the firm's two groups of investors.

## Debt and equity

A firm raises money from two kinds of investors. **Lenders** (bondholders, banks) provide **debt** $D$: they receive fixed interest payments and get their money back first if the firm fails. **Shareholders** provide **equity** $E$: they receive whatever is left after the lenders are paid, so their payoff is uncertain. The total value of the firm's financing is

$$
V = D + E.
$$

Think of the firm as a pie of cash flows shared between the two groups. The lenders' slice is smaller but safer; the shareholders' slice is larger on average but riskier.

## Cost of equity

The **cost of equity** $r_E$ is the annual return shareholders require for holding the firm's shares. Nobody quotes it directly; it must be estimated from the risk of the shares. The usual tool is the capital asset pricing model (CAPM), introduced in the lesson "CAPM, beta and the security market line":

$$
r_E = r_f + \beta_E\,\big(\mathbb{E}[R_m] - r_f\big),
$$

where $r_f$ is the risk-free rate, $\mathbb{E}[R_m] - r_f$ the market risk premium, and $\beta_E$ measures how strongly the share price moves with the market. Example: $r_f = 3\%$, a market risk premium of $6\%$ and $\beta_E = 1.5$ give $r_E = 3\% + 1.5 \times 6\% = 12\%$.

## Cost of debt

The **cost of debt** $r_D$ is the annual return lenders require, roughly the yield the firm pays on new borrowing. It is lower than $r_E$, because debt is paid first and its payments are fixed.

Interest has a second advantage: it is deducted from taxable profit. With a corporate tax rate $t$, every unit of interest paid lowers the tax bill by $t$ units. Example: a firm with $D = 400$ at $r_D = 6\%$ pays 24 in interest per year; at $t = 25\%$ this saves $0.25 \times 24 = 6$ in tax. This saving is the **interest tax shield**. The effective cost of debt to the firm is therefore the **after-tax cost of debt**

$$
r_D\,(1 - t).
$$

In the example, $6\% \times (1 - 0.25) = 4.5\%$.

## The weighted average

The firm as a whole must earn enough on its assets to pay both groups what they require. Weighting each cost by its share of the financing gives the **weighted average cost of capital**:

$$
\text{WACC} = \frac{E}{V}\,r_E + \frac{D}{V}\,r_D\,(1 - t).
$$

> The WACC is the return the firm's assets must earn to satisfy both shareholders and lenders after tax. It is the discount rate for projects with the same risk as the firm.

Example: $E = 600$ and $D = 400$, with $r_E = 12\%$, $r_D = 6\%$ and $t = 25\%$.

### Worked example: WACC of a firm with 600 of equity and 400 of debt

1. Equity's share of the financing, with $V = D + E$.
   $$E/V$$ → **60%**
2. Debt's share of the financing.
   $$D/V$$ → **40%**
3. After-tax cost of debt.
   $$r_D\,(1 - t)$$ → **4.5%**
4. Equity's contribution to the average.
   $$\frac{E}{V}\,r_E$$ → **7.2%**
5. Debt's contribution to the average.
   $$\frac{D}{V}\,r_D\,(1 - t)$$ → **1.8%**
6. Add the two contributions.
   $$\text{WACC} = \frac{E}{V}\,r_E + \frac{D}{V}\,r_D\,(1 - t)$$ → **9%**

A project of average risk for this firm should therefore be evaluated with an NPV at $r = 9\%$.

## Market values, not book values

The weights $E/V$ and $D/V$ must use **market values**: the share price times the number of shares, and the market value of the debt. The balance sheet shows **book values**, which record what was paid in the past and can be far from what investors would pay today.

Example: suppose the firm above has book equity of only 250, while its shares are worth 600 in the market. With book weights $250/650$ and $400/650$, the WACC would be about $7.38\%$ instead of $9\%$. Discounting at that lower rate would make too many projects look profitable. The returns $r_E$ and $r_D$ are demanded on what the investors' claims are worth today, so the weights must be measured the same way.

## When the WACC applies

Discounting at the WACC rests on assumptions that should be stated explicitly:

- The project has the same business risk as the firm's existing assets. A riskier project needs a higher rate, a safer one a lower rate.
- The project is financed with the same mix of debt and equity as the firm, and that mix stays roughly constant.
- The cash flows being discounted are the project's cash flows before any payments to lenders; financing enters only through the rate.

A firm that uses one company-wide WACC for every project tends to accept risky projects that should be rejected and reject safe ones that should be accepted.

## Summary

- A firm is financed by debt $D$ and equity $E$, with total value $V = D + E$.
- The cost of equity $r_E$ is estimated from share risk, typically with the CAPM; the cost of debt $r_D$ is the lenders' required yield.
- Interest is tax-deductible, so debt effectively costs $r_D(1 - t)$.
- $\text{WACC} = (E/V)\,r_E + (D/V)\,r_D(1 - t)$, with market-value weights; it is the discount rate for projects of average risk.

> The next lesson, "Capital structure and the Modigliani–Miller theorems", asks whether changing the mix of debt and equity changes the WACC itself.

[Change the costs of capital, the tax rate and the debt ratio in the WACC lab](https://quantsandbox.dev/wacc)

## Interactive labs

- [WACC Calculator: Weighted Average Cost of Capital](https://quantsandbox.dev/wacc)

## Practice questions

### 1. The risk-free rate is 2%, the market risk premium 5% and the firm's equity beta 1.2. What cost of equity does the CAPM give?

**Answer:** 8%

$r_E = r_f + \beta_E\,(\mathbb{E}[R_m] - r_f) = 2\% + 1.2 \times 5\% = 8\%$. The beta scales the market risk premium, not the whole market return.

### 2. Why must the WACC weights use market values rather than balance-sheet (book) values?

- a) Book values are not audited, so they are unreliable.
- b) Investors require their returns on what their claims are worth today, which is the market value.
- c) Book weights always give a higher WACC, which rejects good projects.
- d) Market values only matter for firms that pay corporate tax.

**Answer:** b) Investors require their returns on what their claims are worth today, which is the market value.

$r_E$ and $r_D$ are returns demanded on today's value of the shares and the debt, so the weights must measure that same value. Book values record past prices and can push the WACC either way; in the example they lowered it to about $7.38\%$.

---

Source: https://quantsandbox.dev/guide/corporate/wacc

Previous lesson: [Project Risk: Sensitivity, Scenarios, Monte Carlo NPV](https://quantsandbox.dev/guide/corporate/capital-budgeting-risk)

Next lesson: [Modigliani–Miller Theorem and Capital Structure](https://quantsandbox.dev/guide/corporate/capital-structure)
