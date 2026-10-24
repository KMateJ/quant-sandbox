# Bond Duration & Convexity Approximation

Compare a bond's exact price–yield curve with its duration and duration-plus-convexity approximations, and see where each one breaks down.

## About this tool

Duration and convexity approximate how a bond's price reacts to yield changes. This tool compares the exact price–yield curve with the first-order duration line and the second-order duration-plus-convexity parabola, so you can see how large a yield shock each approximation can handle.

## Frequently asked questions

### When is duration alone good enough?

For small yield moves. As the move grows, the curvature of the price–yield relationship makes the straight duration line underestimate the price, and the convexity term becomes significant.

### Why is positive convexity valuable?

With positive convexity the price rises more when yields fall than it drops when yields rise by the same amount, so for equal duration the more convex bond performs better under large rate moves.

### What is the difference between Macaulay and modified duration?

Macaulay duration is the present-value-weighted average time until the cash flows arrive, in years. Modified duration divides it by (1 + y/k), where k is the number of coupon periods per year, and gives the approximate percentage price change for a one-percentage-point change in yield. A modified duration of 7 means a 1% rise in yield lowers the price by about 7%.

### How do you estimate a bond's price change with duration and convexity?

ΔP / P ≈ −D_mod × Δy + ½ × C × (Δy)². For a bond with modified duration 7 and convexity 60, a one-percentage-point rise in yield (Δy = 0.01) gives about −7% + 0.3% = −6.7%. The convexity term adds to the estimate whichever way yields move.

## Learn the theory

- [Duration and convexity](https://quantsandbox.dev/guide/fixed-income/duration-convexity): Macaulay and modified duration, first- and second-order approximations of interest-rate risk.
- [Bond prices and yields](https://quantsandbox.dev/guide/fixed-income/bond-pricing): A bond as a stream of cash flows, yield to maturity, par, premium and discount.
- [Immunization and duration matching](https://quantsandbox.dev/guide/fixed-income/immunization): Protecting a liability against rate moves by matching present value and duration, and why convexity and rebalancing matter.
- [Non-parallel curve moves and key-rate durations](https://quantsandbox.dev/guide/fixed-income/curve-risk): Parallel shifts, steepeners and butterflies; key-rate durations as the sensitivities of a bond to each part of the curve.

Open the interactive tool: https://quantsandbox.dev/duration-convexity
