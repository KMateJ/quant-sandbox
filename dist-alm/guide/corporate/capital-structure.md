# Modigliani–Miller Theorem and Capital Structure

MM Propositions I and II without taxes, the tax shield, levered cost of equity and WACC with taxes. Free interactive lesson with worked examples.

The lesson "The weighted average cost of capital" took the mix of debt and equity as given. A firm can change that mix: borrow and buy back shares, or issue shares and repay debt. This lesson asks whether doing so changes the value of the firm and its cost of capital. The answer, due to Modigliani and Miller, is no in a world without taxes, and yes, through the tax shield, once corporate taxes are included.

## Capital structure and leverage

A firm's **capital structure** is its mix of debt $D$ and equity $E$. It is described by the **debt ratio** $D/V$, with $V = D + E$, or equivalently by the **debt-to-equity ratio** $D/E$. The two are linked by

$$
\frac{D}{E} = \frac{D/V}{1 - D/V}.
$$

A firm that uses debt is called **levered**; the same firm with no debt is **unlevered**. Using more debt is called increasing **leverage**. Throughout the lesson the firm's operations, and therefore its operating cash flows, stay fixed. Only the way those cash flows are split between lenders and shareholders changes.

## Assumptions

Modigliani and Miller work in an idealised market. State the assumptions explicitly, because each conclusion below depends on them:

- No taxes (relaxed later in the lesson).
- No costs of bankruptcy or financial distress.
- Investors and firms can borrow and lend at the same rate.
- Everyone has the same information, and there are no transaction costs.

## Firm value without taxes

Let $V_U$ be the value of the unlevered firm and $V_L$ the value of the same firm with debt. **Modigliani–Miller Proposition I** states that without taxes

$$
V_L = V_U.
$$

The argument is a no-arbitrage argument. Owning all the debt and all the equity of the levered firm gives exactly the operating cash flows of the firm, which are the same with or without debt. Two claims to the same cash flows must have the same price. A shareholder who wants more leverage can also borrow personally and buy more shares ("homemade leverage"), so the firm cannot create value by doing the borrowing for them.

A fair picture is a pizza: cutting it into more or fewer slices does not change how much pizza there is.

## The cost of equity rises with leverage

Write $r_U$ for the return investors require on the unlevered firm, the **unlevered cost of capital**. It reflects only the business risk of the operations. Since $V_L = V_U$ and the cash flows are unchanged, the return on the whole levered firm is still $r_U$, so its WACC (without taxes) equals $r_U$:

$$
r_U = \frac{E}{V}\,r_E + \frac{D}{V}\,r_D.
$$

Multiply by $V/E$ and solve for the cost of equity $r_E$:

$$
r_E = r_U\,\frac{V}{E} - r_D\,\frac{D}{E} = r_U\Big(1 + \frac{D}{E}\Big) - r_D\,\frac{D}{E} = r_U + (r_U - r_D)\,\frac{D}{E}.
$$

This is **Modigliani–Miller Proposition II**. Debt is cheaper than equity, $r_D < r_U$, but borrowing more does not lower the WACC: the shareholders bear the same business risk on a smaller stake, so their required return $r_E$ rises exactly enough to offset the cheaper debt.

Example: $r_U = 10\%$, $r_D = 5\%$ and $D/V = 40\%$, so $D/E = 0.4/0.6 \approx 0.667$. Then $r_E = 10\% + 5\% \times 0.667 \approx 13.33\%$, and the WACC is $0.6 \times 13.33\% + 0.4 \times 5\% = 10\% = r_U$.

> Without taxes, capital structure is irrelevant: $V_L = V_U$, the WACC equals $r_U$ at every debt ratio, and $r_E = r_U + (r_U - r_D)\,D/E$.

## Corporate taxes and the tax shield

Now add a corporate tax rate $t$. As in "The weighted average cost of capital", interest is deductible, so a firm with debt $D$ at rate $r_D$ saves $t\,r_D D$ in tax every year. Assume the debt is **perpetual**: the firm keeps the amount $D$ outstanding forever. The tax savings are then a perpetuity, and discounting it at $r_D$ (it is as safe as the interest payments) gives the value of the tax shield:

$$
\text{PV(tax shield)} = \frac{t\,r_D D}{r_D} = t\,D, \qquad V_L = V_U + t\,D.
$$

Example: an unlevered firm worth $V_U = 1000$ that borrows $D = 400$ at $t = 25\%$ is worth $V_L = 1000 + 0.25 \times 400 = 1100$. The extra 100 is money that no longer goes to the tax authority.

The formulas for the costs of capital change accordingly. With perpetual debt they become

$$
r_E = r_U + (r_U - r_D)(1 - t)\,\frac{D}{E}, \qquad \text{WACC} = \frac{E}{V}\,r_E + \frac{D}{V}\,r_D(1 - t) = r_U\Big(1 - t\,\frac{D}{V}\Big).
$$

With the numbers above ($r_U = 10\%$, $r_D = 5\%$, $D/V = 40\%$) and $t = 25\%$:

### Worked example: Costs of capital with corporate taxes

1. The debt-to-equity ratio from $D/V$.
   $$\frac{D}{E} = \frac{D/V}{1 - D/V}$$ → **0.667**
2. Proposition II with taxes: the cost of equity.
   $$r_E = r_U + (r_U - r_D)(1 - t)\,\frac{D}{E}$$ → **12.5%**
3. The after-tax cost of debt.
   $$r_D\,(1 - t)$$ → **3.75%**
4. The WACC from the weighted average.
   $$\text{WACC} = \frac{E}{V}\,r_E + \frac{D}{V}\,r_D(1 - t)$$ → **9%**
5. The shortcut gives the same number.
   $$r_U\Big(1 - t\,\frac{D}{V}\Big)$$ → **9%**

The WACC is below $r_U = 10\%$ and now falls as leverage rises.

The next figure draws these values as bars for an unlevered firm worth $V_U = 100$. The upper bar is the unlevered firm, all equity. The lower bar is the same firm with debt, split into debt $D$ and equity $E$, and the hatched slice beyond the dashed mark at $V_U$ is the tax shield $t\,D$. Drag the boundary between debt and equity (or focus it and use the arrow keys) to set $D/V$ between 0 and 80%; the bars underneath show $r_E$, the after-tax cost of debt and the WACC against the dashed mark at $r_U$. At $D/V = 40\%$ the firm carries $D \approx 44.4$, is worth $V_L \approx 111.1$ and the readouts repeat $12.5\%$ and $9\%$. Switch the tax to "None": the lower bar keeps the length of the upper one however much debt you add, which is Proposition I, while $r_E$ still climbs.

*[Interactive figure: capital split](https://quantsandbox.dev/guide/corporate/capital-structure)*

## Costs of capital against leverage

The figure plots, against the debt ratio $D/V$ from 0 to 80%, the cost of equity $r_E$, the after-tax cost of debt $r_D(1 - t)$ and the WACC, all under the formulas with taxes. Sliders set $r_U$, $r_D$, the tax rate $t$ and the chosen $D/V$, which is marked by a reference line; the readouts give $r_E$, the after-tax cost of debt and the WACC there. At the defaults ($r_U = 10\%$, $r_D = 5\%$, $t = 25\%$, $D/V = 40\%$) they show $12.5\%$, $3.75\%$ and $9\%$, as computed above. Set $t$ to zero and the WACC line becomes flat at $r_U$: that is Proposition I and II without taxes. Raise $t$ and note that the WACC slopes down more steeply.

*[Interactive figure: wacc leverage](https://quantsandbox.dev/guide/corporate/capital-structure)*

## Limits of the result

Taken literally, the version with taxes says a firm should be financed almost entirely by debt. Real firms are not, because the assumptions fail at high leverage. Heavily indebted firms face **costs of financial distress**: higher borrowing rates, lost customers and suppliers, legal costs in bankruptcy. The *trade-off view* of capital structure balances the tax shield against these costs, which suggests a moderate debt ratio at which firm value is highest. The figure and the lab show only the tax side of this balance.

## Summary

- Capital structure is the mix of debt and equity, measured by $D/V$ or $D/E$; operating cash flows do not depend on it.
- Without taxes, $V_L = V_U$ and the WACC equals the unlevered cost of capital $r_U$ at any leverage (Proposition I).
- The cost of equity rises with leverage: $r_E = r_U + (r_U - r_D)\,D/E$ (Proposition II).
- With corporate taxes and perpetual debt, $V_L = V_U + tD$, $r_E = r_U + (r_U - r_D)(1 - t)\,D/E$ and $\text{WACC} = r_U(1 - t\,D/V)$.
- Costs of financial distress, which the model leaves out, limit how much debt is worth taking on.

> A later lesson, "Discounted cash flow valuation", uses the WACC to value an entire firm from its free cash flows.

[See how leverage moves the cost of equity, the WACC and firm value in the Capital Structure lab](https://quantsandbox.dev/capital-structure)

## Interactive labs

- [Modigliani–Miller Capital Structure Visualizer](https://quantsandbox.dev/capital-structure)
- [WACC Calculator: Weighted Average Cost of Capital](https://quantsandbox.dev/wacc)

## Practice questions

### 1. Without taxes, a firm has $r_U = 12\%$ and borrows at $r_D = 6\%$ with a debt-to-equity ratio $D/E = 1$. What return do its shareholders require?

**Answer:** 18%

Proposition II: $r_E = r_U + (r_U - r_D)\,D/E = 12\% + 6\% \times 1 = 18\%$. The WACC stays at $0.5 \times 18\% + 0.5 \times 6\% = 12\% = r_U$.

### 2. With taxes, $V_L = V_U + t\,D$ keeps rising with debt. Why do real firms still not borrow almost everything?

- a) Because the tax shield stops growing once debt exceeds half of firm value.
- b) Because heavy debt brings costs of financial distress that outweigh the extra tax shield.
- c) Because Proposition I says that debt destroys value.
- d) Because the cost of debt is always higher than the cost of equity.

**Answer:** b) Because heavy debt brings costs of financial distress that outweigh the extra tax shield.

The formula assumes no costs of financial distress. At high leverage those costs (dearer borrowing, lost customers, bankruptcy costs) grow faster than the tax shield, so the trade-off view finds the best debt ratio at a moderate level.

---

Source: https://quantsandbox.dev/guide/corporate/capital-structure

Previous lesson: [WACC Explained: Weighted Average Cost of Capital](https://quantsandbox.dev/guide/corporate/wacc)

Next lesson: [Dividend Discount Model and Dividend Policy](https://quantsandbox.dev/guide/corporate/dividend-policy)
