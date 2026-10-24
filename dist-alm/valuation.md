# DCF Valuation Model: Free Cash Flow & Terminal Value

Build a discounted cash flow valuation: free cash flow projection, terminal value, discounting at WACC and enterprise value.

## About this tool

A discounted cash flow (DCF) valuation values a company as the present value of its future free cash flows. This model projects free cash flow, adds a terminal value for the years beyond the forecast, discounts everything at the WACC and arrives at enterprise value.

## Frequently asked questions

### What is terminal value in a DCF?

The value of all cash flows after the explicit forecast period, usually from a growing perpetuity: FCF × (1 + g) / (WACC − g). It often makes up most of the total value.

### Why is a DCF so sensitive to WACC and growth?

The terminal value divides by WACC − g. When the two are close, small changes in either assumption change the valuation a lot.

### What is free cash flow to the firm?

The cash a business generates after taxes and after the investment it needs to keep operating and growing, available to shareholders and lenders alike: FCFF = EBIT × (1 − tax rate) + depreciation − capital expenditure − increase in working capital. Because it belongs to all capital providers, it is discounted at the WACC.

### What is the difference between enterprise value and equity value?

Enterprise value is the value of the operating business to all capital providers, which is what a DCF of free cash flow to the firm gives. Equity value is the part that belongs to shareholders: enterprise value minus net debt (debt less cash). Dividing equity value by the number of shares gives a value per share.

## Learn the theory

- [Discounted cash flow valuation](https://quantsandbox.dev/guide/corporate/dcf-valuation): Free cash flow, enterprise value, the Gordon growth terminal value and equity value.
- [The weighted average cost of capital](https://quantsandbox.dev/guide/corporate/wacc): Cost of equity, after-tax cost of debt, the interest tax shield and market-value weights.
- [Dividends, payout policy and the dividend discount model](https://quantsandbox.dev/guide/corporate/dividend-policy): The Gordon growth model, growth from retained earnings, Modigliani–Miller dividend irrelevance and when payout does matter.
- [Relative valuation with multiples](https://quantsandbox.dev/guide/corporate/valuation-multiples): P/E, EV/EBITDA and other multiples, choosing peers, and how multiples relate to DCF value.

Open the interactive tool: https://quantsandbox.dev/valuation
