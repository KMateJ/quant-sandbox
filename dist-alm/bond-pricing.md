# Bond Pricing Calculator & Price–Yield Curve

Value a bond from its cash flows: discounting to present value, price, duration, convexity and a draggable price–yield curve.

## About this tool

A bond's price is the present value of its coupons and principal, discounted at the yield. This bond pricing workbench lays out the cash-flow timeline, discounts each payment, and connects the price to duration and convexity on a draggable price–yield curve.

## Frequently asked questions

### Why do bond prices fall when yields rise?

The cash flows are fixed, so a higher discount rate makes each of them worth less today. The longer the payments are in the future, the stronger the effect.

### What is the difference between duration and convexity?

Duration is the slope of the price–yield curve: the approximate percentage price change for a small yield change. Convexity measures the curvature that the straight-line duration estimate misses.

### How do you calculate a bond's price?

Discount each cash flow at the yield and add them up: price = Σ C / (1 + y)^t + F / (1 + y)^T. For example, a 3-year bond with face value 100, a 5% annual coupon and a 4% yield is worth 5/1.04 + 5/1.04² + 105/1.04³ ≈ 102.78.

### What is the difference between the coupon rate and the yield to maturity?

The coupon rate fixes the cash payments as a percentage of face value. The yield to maturity is the single discount rate that makes the present value of all remaining payments equal the market price. A bond trading below par has a yield above its coupon rate; a bond above par has a yield below it.

## Learn the theory

- [Bond prices and yields](https://quantsandbox.dev/guide/fixed-income/bond-pricing): A bond as a stream of cash flows, yield to maturity, par, premium and discount.
- [Duration and convexity](https://quantsandbox.dev/guide/fixed-income/duration-convexity): Macaulay and modified duration, first- and second-order approximations of interest-rate risk.
- [Immunization and duration matching](https://quantsandbox.dev/guide/fixed-income/immunization): Protecting a liability against rate moves by matching present value and duration, and why convexity and rebalancing matter.
- [Callable bonds and negative convexity](https://quantsandbox.dev/guide/fixed-income/callable-bonds): The issuer's call option, price compression near the call price, yield to call and negative convexity.
- [Credit risk: default probabilities and credit spreads](https://quantsandbox.dev/guide/fixed-income/credit-risk): Hazard rates, survival probabilities, recovery, pricing defaultable bonds and the CDS spread.
- [Real rates, inflation and inflation-linked bonds](https://quantsandbox.dev/guide/fixed-income/real-rates-inflation): The Fisher relation, nominal against real discounting, the breakeven inflation rate and how an inflation-linked bond is priced.

Open the interactive tool: https://quantsandbox.dev/bond-pricing
