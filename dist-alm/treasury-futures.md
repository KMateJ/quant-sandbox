# Treasury Futures: Conversion Factors & Cheapest-to-Deliver

Explore Treasury bond futures: conversion factors, invoice prices, deliverable cash flows and cheapest-to-deliver switching as yields move.

## About this tool

Treasury bond futures can be settled by delivering any bond from a basket. Conversion factors put the bonds on a common footing, the invoice price determines what the buyer pays, and the seller delivers the cheapest-to-deliver bond. This lab shows conversion factors, invoice prices and deliverable cash flows, and how the cheapest-to-deliver bond switches as yields move.

## Frequently asked questions

### What is the cheapest-to-deliver bond?

The deliverable bond that is cheapest for the futures seller: the one with the lowest cost of buying it relative to the invoice amount received, i.e. the highest implied repo return.

### Why does the cheapest-to-deliver bond change with yields?

Conversion factors are computed at a fixed notional yield. When market yields move away from it, bonds with different durations gain or lose relative value, so a different bond becomes cheapest.

### What is a conversion factor in Treasury futures?

The price per unit of face value at which a deliverable bond would trade if its yield equalled the contract's notional coupon (6% for CBOT Treasury futures). Multiplying the futures price by it adjusts for bonds with higher coupons or longer maturities being worth more than the standard bond.

### How is the invoice price of a Treasury futures delivery calculated?

Invoice amount = futures settlement price × conversion factor × face value + accrued interest on the delivered bond. The seller receives this amount and delivers the bond, so the cheapest bond to deliver is the one whose market price is lowest relative to its invoice amount.

## Learn the theory

- [Spot rates, forward rates and the yield curve](https://quantsandbox.dev/guide/fixed-income/yield-curve): Zero-coupon rates, bootstrapping from par yields, implied forward rates and the shape of the curve.
- [Duration and convexity](https://quantsandbox.dev/guide/fixed-income/duration-convexity): Macaulay and modified duration, first- and second-order approximations of interest-rate risk.
- [Bond futures and the cheapest-to-deliver](https://quantsandbox.dev/guide/fixed-income/treasury-futures): Deliverable baskets, conversion factors, invoice price, net delivery cost and why the cheapest-to-deliver bond switches with the yield.

Open the interactive tool: https://quantsandbox.dev/treasury-futures
