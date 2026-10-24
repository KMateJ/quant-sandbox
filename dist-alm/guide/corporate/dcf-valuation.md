# DCF Valuation: Free Cash Flow and Terminal Value

Free cash flow, enterprise value, the Gordon growth terminal value and equity value. Free interactive lesson with worked examples.

The lesson "Net present value and internal rate of return" valued a single project by discounting its cash flows. A whole firm can be valued the same way: it is a collection of projects that keeps producing cash. This lesson builds a discounted cash flow (DCF) valuation from the firm's free cash flows, the WACC from "The weighted average cost of capital", and a formula for cash flows that continue forever.

## Free cash flow

The cash flow to discount is the **free cash flow** (FCF): the cash the firm's operations generate in a year after paying taxes and making the investments needed to keep growing, but before any payments to lenders or shareholders. With $t$ the corporate tax rate,

$$
\text{FCF} = \text{EBIT}\,(1 - t) + \text{depreciation} - \text{capital expenditure} - \Delta\text{NWC}.
$$

Each term has a reason. **EBIT** (earnings before interest and taxes) is operating profit; $\text{EBIT}(1-t)$ is that profit after the tax the operations would pay with no debt, so financing is kept out of the cash flow, as "The weighted average cost of capital" required. **Depreciation** is an accounting charge, not a cash payment, so it is added back. **Capital expenditure** is cash spent on new equipment and buildings. $\Delta\text{NWC}$ is the increase in net working capital (inventories plus receivables minus payables), cash tied up in day-to-day operations.

Example: EBIT of 200, $t = 25\%$, depreciation of 40, capital expenditure of 60 and an increase in working capital of 10 give $\text{FCF} = 150 + 40 - 60 - 10 = 120$.

## Enterprise value

Free cash flow belongs to all investors together, lenders and shareholders. Discounting it at the WACC therefore gives the value of the whole firm, its **enterprise value**:

$$
\text{EV} = \sum_{k=1}^{\infty} \frac{\text{FCF}_k}{(1 + \text{WACC})^k}.
$$

The sum has no end, because a firm has no fixed maturity. In practice it is split in two: an **explicit forecast** of the next few years, usually five, where the analyst projects each cash flow, and a **terminal value** that summarises everything after.

## Growing perpetuity

To value the cash flows beyond the forecast, assume that from some point they grow at a constant rate $g$ forever: $\text{FCF}_{k+1} = \text{FCF}_k\,(1+g)$. Write $W$ for the WACC. The present value of such a stream, starting with $\text{FCF}_1$ in one year, is a geometric series with ratio $(1+g)/(1+W)$:

$$
\sum_{k=1}^{\infty} \frac{\text{FCF}_1 (1+g)^{k-1}}{(1+W)^k} = \frac{\text{FCF}_1}{1+W} \sum_{j=0}^{\infty} \Big(\frac{1+g}{1+W}\Big)^j = \frac{\text{FCF}_1}{W - g}.
$$

The series converges only when $g < W$. This is the **Gordon growth formula**. A growth rate at or above the discount rate would give an infinite value, which signals an impossible assumption: no firm can outgrow the economy forever.

## Terminal value

Apply the formula at the end of the forecast. If the forecast covers years 1 to 5, the **terminal value** at year 5 is the value then of all cash flows from year 6 on:

$$
\text{TV}_5 = \frac{\text{FCF}_6}{W - g}, \qquad \text{EV} = \sum_{k=1}^{5} \frac{\text{FCF}_k}{(1+W)^k} + \frac{\text{TV}_5}{(1+W)^5}.
$$

The terminal value is itself a future amount, so it is discounted back five years like any other cash flow.

## A worked example

Take $\text{FCF}_1 = 10$, growing at $g = 2\%$ per year forever, and $W = 9\%$. The forecast cash flows are 10, 10.20, 10.40, 10.61 and 10.82; discounted at 9% they are worth 9.17, 8.59, 8.03, 7.52 and 7.04.

### Worked example: Enterprise value with a five-year forecast and a terminal value

1. Present value of the five forecast years.
   $$\sum_{k=1}^{5} \frac{\text{FCF}_1 (1+g)^{k-1}}{(1+W)^k}$$ → **40.35**
2. The first cash flow after the forecast.
   $$\text{FCF}_6 = \text{FCF}_1 (1+g)^5$$ → **11.04**
3. Terminal value at year 5, from the Gordon formula.
   $$\text{TV}_5 = \frac{\text{FCF}_6}{W - g}$$ → **157.73**
4. Discount the terminal value back five years.
   $$\frac{\text{TV}_5}{(1+W)^5}$$ → **102.51**
5. Enterprise value: the forecast years plus the discounted terminal value.
   $$\text{EV} = \sum_{k=1}^{5} \frac{\text{FCF}_k}{(1+W)^k} + \frac{\text{TV}_5}{(1+W)^5}$$ → **142.86**

Since one growth rate applies to every year here, this equals the Gordon formula for the whole stream, $10/0.07 \approx 142.86$, which is a useful check.

> Most of a DCF value usually sits in the terminal value. In the example it is $102.51/142.86 \approx 71.8\%$ of the total, so the long-run assumptions on $g$ and the WACC matter more than the detailed forecast.

## Sensitivity to the assumptions

Because $W - g$ sits in a denominator, small changes in either have large effects. Raising $g$ from 2% to 4% lifts the value from 142.86 to $10/0.05 = 200$; lowering the WACC from 9% to 8% lifts it to $10/0.06 \approx 166.67$. The present value of the five forecast years barely moves in either case. A DCF valuation should therefore always be reported with a range of $g$ and WACC values, not as a single number.

The figure shows this split. It plots, against $g$, the present value of years 1 to 5, the present value of the terminal value, and their total, for a firm with $\text{FCF}_1 = 10$ and a five-year forecast. Sliders set the WACC and $g$; the readouts give the total value, the terminal value's share and the present value of the forecast years at the chosen $g$; $g$ can be raised up to 5%, and at most to one point below the WACC. The defaults (WACC 9%, $g = 2\%$) reproduce the example: 142.86, about 71.8% from the terminal value. Raise $g$ and note that the terminal part grows steeply while the forecast part stays almost flat; lower the WACC and both rise.

*[Interactive figure: dcf terminal](https://quantsandbox.dev/guide/corporate/dcf-valuation)*

## From enterprise value to equity value

Enterprise value belongs to lenders and shareholders together. The shareholders' part, the **equity value**, is what remains after subtracting **net debt** (debt minus cash):

$$
\text{equity value} = \text{EV} - (\text{debt} - \text{cash}), \qquad \text{value per share} = \frac{\text{equity value}}{\text{number of shares}}.
$$

Example: with $\text{EV} = 142.86$, debt of 45, cash of 5 and 10 shares, the equity value is $142.86 - 40 = 102.86$, or about 10.29 per share. Comparing this with the market price is how an analyst decides whether a share looks cheap or expensive.

## Summary

- Free cash flow is the cash operations produce after tax and investment, before any financing payments.
- Discounting free cash flow at the WACC gives the enterprise value of the firm.
- A stream growing at $g < W$ forever is worth $\text{FCF}_1/(W - g)$; applied at the end of the forecast, this is the terminal value.
- The terminal value usually dominates, so results are very sensitive to $g$ and the WACC.
- Equity value is enterprise value minus net debt.

[Build a DCF valuation and test the terminal value assumptions in the Valuation lab](https://quantsandbox.dev/valuation)

## Interactive labs

- [DCF Valuation Model: Free Cash Flow & Terminal Value](https://quantsandbox.dev/valuation)

## Practice questions

### 1. A firm has EBIT of 100, a tax rate of 20%, depreciation of 30, capital expenditure of 50 and an increase in net working capital of 5. What is its free cash flow?

**Answer:** 55

$\text{FCF} = 100 \times 0.8 + 30 - 50 - 5 = 55$. Depreciation is added back because it is not a cash payment; investment and extra working capital are cash spent.

### 2. A spreadsheet DCF gives an enormous or negative terminal value. The analyst has set the perpetual growth rate $g$ equal to or above the WACC. What does this mean?

- a) The firm is extremely valuable and the result should be kept.
- b) The assumption is impossible: the Gordon formula needs $g < W$.
- c) The terminal value should be discounted at $g$ instead of the WACC.
- d) Five forecast years are too few; adding years fixes it.

**Answer:** b) The assumption is impossible: the Gordon formula needs $g < W$.

The growing perpetuity converges only when $g < W$. At $g \ge W$ the series has no finite sum, so the formula's output is meaningless: no firm can grow faster than its discount rate forever.

---

Source: https://quantsandbox.dev/guide/corporate/dcf-valuation

Previous lesson: [Dividend Discount Model and Dividend Policy](https://quantsandbox.dev/guide/corporate/dividend-policy)

Next lesson: [Valuation Multiples: P/E, EV/EBITDA, Peers](https://quantsandbox.dev/guide/corporate/valuation-multiples)
