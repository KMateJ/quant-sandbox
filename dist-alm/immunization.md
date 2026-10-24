# Bond Immunization: Match Duration to a Liability

Play a bond immunization game: match present value and duration to a liability, rebalance through rate shocks and see why the surplus moved.

## About this tool

Immunization funds a known future liability with bonds so that interest-rate moves do not open a funding gap. Match the present value and the duration of the assets to the liability, and the surplus barely reacts to a parallel shift in yields. Over the years the match drifts as time passes and the curve moves, so you rebalance, at a cost. This lab plays that as a game: each round brings a seeded rate shock, and you see why the surplus moved.

## Frequently asked questions

### What is immunization?

A strategy that holds assets whose present value and duration equal those of a liability. A small parallel move in yields then changes assets and liability by about the same amount, so the surplus stays near zero.

### Why does the portfolio need rebalancing?

Duration changes with time and with yields, and the liability's duration shrinks by a year every year while a bond's duration shrinks more slowly. The match therefore drifts, and the portfolio has to be reset to stay immunized.

### What does convexity add?

Duration matching covers small moves. For larger moves the second-order term matters: assets with more convexity than the liability gain more when yields fall than they lose when yields rise, so the surplus tends to be positive after large shifts.

### What is a twist, and why does it hurt?

A twist moves long and short yields in opposite directions. Duration matching assumes a parallel shift, so a twist can leave a gap even in a perfectly matched portfolio.

## Learn the theory

- [Immunization and duration matching](https://quantsandbox.dev/guide/fixed-income/immunization): Protecting a liability against rate moves by matching present value and duration, and why convexity and rebalancing matter.
- [Duration and convexity](https://quantsandbox.dev/guide/fixed-income/duration-convexity): Macaulay and modified duration, first- and second-order approximations of interest-rate risk.

Open the interactive tool: https://quantsandbox.dev/immunization
