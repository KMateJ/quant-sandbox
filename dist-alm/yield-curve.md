# Yield Curve Bootstrapping, Spot & Forward Rates

Shape a par yield curve by level, slope and curvature, bootstrap the spot curve and read off forward rates interactively.

## About this tool

The yield curve shows interest rates across maturities. In this tool you shape a par yield curve with level, slope and curvature factors, bootstrap the zero-coupon spot curve from it, and derive the forward rates the curve implies between future dates.

## Frequently asked questions

### What is bootstrapping a yield curve?

Bootstrapping extracts zero-coupon (spot) rates one maturity at a time: each par bond's price pins down the next spot rate, given the spot rates already found for its earlier coupons.

### What does an inverted yield curve mean?

Short rates are above long rates. The curve then implies falling forward rates, which markets often read as an expectation of lower future rates.

### What is the difference between spot rates and forward rates?

A spot rate is today's yield on a zero-coupon bond maturing at one date. A forward rate is the rate fixed today for borrowing between two future dates, implied by the spot curve through (1 + s₂)² = (1 + s₁)(1 + f₁,₂). With a 1-year spot rate of 3% and a 2-year spot rate of 4%, the one-year rate one year ahead is about 5.0%.

### What are the level, slope and curvature of the yield curve?

They are the three typical ways the curve moves. Level shifts all rates up or down together, slope changes the gap between long and short rates (steepening or flattening), and curvature bends the middle maturities relative to both ends. Together they explain most day-to-day moves of government yield curves.

## Learn the theory

- [Spot rates, forward rates and the yield curve](https://quantsandbox.dev/guide/fixed-income/yield-curve): Zero-coupon rates, bootstrapping from par yields, implied forward rates and the shape of the curve.
- [Bond prices and yields](https://quantsandbox.dev/guide/fixed-income/bond-pricing): A bond as a stream of cash flows, yield to maturity, par, premium and discount.
- [Mean reversion: Ornstein–Uhlenbeck and Vasicek](https://quantsandbox.dev/guide/stochastic/mean-reversion): A process pulled toward a long-run level, its exact solution and stationary distribution, and the short rate in the Vasicek model.
- [Non-parallel curve moves and key-rate durations](https://quantsandbox.dev/guide/fixed-income/curve-risk): Parallel shifts, steepeners and butterflies; key-rate durations as the sensitivities of a bond to each part of the curve.
- [Interest rate swaps](https://quantsandbox.dev/guide/fixed-income/interest-rate-swaps): Fixed and floating legs, the swap as two bonds, the par swap rate from discount factors, valuing an existing swap and DV01.
- [Credit risk: default probabilities and credit spreads](https://quantsandbox.dev/guide/fixed-income/credit-risk): Hazard rates, survival probabilities, recovery, pricing defaultable bonds and the CDS spread.

Open the interactive tool: https://quantsandbox.dev/yield-curve
