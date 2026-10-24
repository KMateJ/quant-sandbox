# Treasury Bond Futures: Conversion Factors and CTD

Deliverable baskets, conversion factors, invoice price, net delivery cost and why the cheapest-to-deliver bond switches with the yield.

A bond future is a forward contract on a government bond, traded on an exchange. Its twist is that the seller may choose which bond to deliver from a list. This lesson explains how the exchange makes different bonds comparable with conversion factors, what the seller actually pays and receives at delivery, and why the cheapest bond to deliver changes when yields move. It builds on "Bond prices and yields", "Duration and convexity" and "Arbitrage and the forward price".

## Bond futures

A **bond future** obliges the seller (the short) to deliver a government bond to the buyer (the long) at a fixed date, the **delivery date**, for a price agreed today. As with any forward, nothing changes hands when the contract is opened; the quoted **futures price** $F$ is the price at which delivery will take place. Throughout this track bonds have face value 100, so $F$ here always means the futures price, quoted per 100 of face.

Exchanges standardise everything except one detail. Instead of naming a single bond, the contract lists a **deliverable basket**: every government bond within a range of remaining maturities, say 8.5 to 10.5 years for a ten-year contract. The seller decides which bond in the basket to deliver. This choice is the **delivery option**, and it belongs to the seller.

## The notional bond and conversion factors

The bonds in the basket have different coupons and maturities, so they have very different prices. A 7% bond is worth far more than a 3% bond of similar maturity. Paying the same amount for either would make the choice trivial. The exchange therefore defines a **notional bond** with a fixed coupon, 6% for many contracts, and quotes the futures price as if that bond were delivered.

Each deliverable bond receives a **conversion factor** $CF$: its price per 1 of face if its yield to maturity were exactly the notional 6%. With annual coupons $c$ and $T$ years left at delivery,

$$
CF = \frac{1}{100}\left( \sum_{t=1}^{T} \frac{100c}{1{.}06^t} + \frac{100}{1{.}06^T} \right).
$$

A bond with a coupon above 6% has $CF > 1$, one below 6% has $CF < 1$. Real exchanges add rounding rules (remaining maturity rounded down to whole quarters, the factor to four decimals); the lab follows one such convention, here we keep whole years.

Example: three deliverable bonds, called A, B and C.

- A: 3% coupon, 10 years left, $CF_A = 0{.}7792$.
- B: 5% coupon, 15 years left, $CF_B = 0{.}9029$.
- C: 7% coupon, 25 years left, $CF_C = 1{.}1278$.

## Invoice price and delivery cost

When the seller delivers a bond, the buyer pays the **invoice price** per 100 of face:

$$
\text{invoice} = F \cdot CF + AI,
$$

where $AI$ is the accrued interest the bond has built up since its last coupon. The conversion factor scales the futures price up for valuable bonds and down for cheap ones.

To deliver, the seller must own the bond, which costs its market (clean) price $P$ plus the same accrued interest. Accrued interest appears on both sides and cancels, so the seller's **net delivery cost**, also called the **net basis**, is

$$
\text{net cost} = P - F \cdot CF.
$$

The seller delivers the bond with the smallest net cost: the **cheapest-to-deliver** bond, or CTD. Equivalently, the CTD is the bond with the lowest ratio $P/CF$.

## The futures price at delivery

At the delivery date the futures price cannot exceed $P/CF$ for any bond in the basket. If it did, a trader could buy that bond, sell the future, deliver at once and keep $F \cdot CF - P > 0$, an arbitrage of the kind in "Arbitrage and the forward price". Competition among sellers pushes $F$ down to the lowest such ratio:

$$
F = \min_i \frac{P_i}{CF_i}.
$$

The CTD then has a net cost of exactly zero and every other bond a positive one. Before delivery the futures price is set by the CTD in the same way, plus the carry from "Arbitrage and the forward price"; this lesson stays at the delivery date.

> At delivery $F = \min_i P_i/CF_i$. The bond that attains the minimum is the cheapest-to-deliver, and its net cost $P - F\cdot CF$ is zero.

## The cheapest bond and the yield level

If all bonds yielded exactly 6%, every price would equal $100 \cdot CF$, every ratio $P/CF$ would be 100, and all bonds would be equally cheap. The conversion factors are exact only at the notional yield.

At any other yield the ratio $P/CF$ is the bond's price relative to its price at 6%. From "Duration and convexity", that relative change depends on duration. At a 6% yield the Macaulay durations of A, B and C are about 8.59, 10.66 and 13.16 years.

- When yields rise above 6%, all prices fall, and the long-duration bond C falls the most in relative terms. It has the lowest $P/CF$ and becomes the CTD.
- When yields fall below 6%, all prices rise, and the short-duration bond A rises the least. It now has the lowest $P/CF$ and becomes the CTD.

Worked example at a flat yield of 4%: the prices are $P_A = 91{.}89$, $P_B = 111{.}12$ and $P_C = 146{.}87$. The ratios are $91{.}89/0{.}7792 = 117{.}93$, $111{.}12/0{.}9029 = 123{.}07$ and $146{.}87/1{.}1278 = 130{.}22$. So $F = 117{.}93$ and A is the CTD. The net costs are 0 for A, $111{.}12 - 117{.}93 \times 0{.}9029 = 4{.}64$ for B and 13.86 for C.

At 8% the order reverses. Work it out step by step:

### Worked example: The cheapest-to-deliver bond at a flat 8% yield

1. Price of bond A (3% coupon, 10 years) at 8%.
   $$P_A = \sum_{t=1}^{10} \frac{3}{1.08^t} + \frac{100}{1.08^{10}}$$ → **66.45**
2. Price of bond C (7% coupon, 25 years) at 8%.
   $$P_C = \sum_{t=1}^{25} \frac{7}{1.08^t} + \frac{100}{1.08^{25}}$$ → **89.33**
3. Ratio for A. For B the same steps give 82.32.
   $$P_A / CF_A$$ → **85.28**
4. Ratio for C. It is the lowest of the three, so C is the CTD and its ratio is the futures price.
   $$F = P_C / CF_C$$ → **79.2**
5. Net delivery cost of A (B's is 2.81, C's is 0).
   $$P_A - F \cdot CF_A$$ → **4.74**

The figure plots the net delivery cost $P - F\cdot CF$ of A, B and C against a flat market yield from 2% to 10%, with a line at the chosen yield. The readouts show the CTD, the futures price $F$, and each bond's conversion factor and net cost. Start at 6%, where all three costs are zero, then move the yield down and up and watch the CTD switch from A to C.

*[Interactive figure: ctd switch](https://quantsandbox.dev/guide/fixed-income/treasury-futures)*

## The value of the delivery option

Because the seller always picks the cheapest bond, the futures price is lower than it would be for any single named bond. The buyer accepts this in exchange for a liquid, standardised contract. The further yields move from 6%, the more the bonds' costs spread out, and the more the choice is worth to the seller. Traders who hedge with bond futures must therefore track which bond is the CTD: the future's price sensitivity follows the duration of the CTD, and it jumps when the CTD switches.

## Summary

- A bond future lets the seller deliver any bond from a basket; this is the delivery option.
- The conversion factor of a bond is its price per 1 of face at the notional 6% yield. The invoice price is $F\cdot CF + AI$.
- The net delivery cost is $P - F\cdot CF$. At delivery $F = \min_i P_i/CF_i$, and the bond attaining it is the cheapest-to-deliver.
- Below the notional yield the lowest-duration bond tends to be the CTD, above it the highest-duration bond.

[Compute conversion factors, invoice prices and the cheapest-to-deliver bond in the Treasury Futures lab](https://quantsandbox.dev/treasury-futures)

## Interactive labs

- [Treasury Futures: Conversion Factors & Cheapest-to-Deliver](https://quantsandbox.dev/treasury-futures)

## Practice questions

### 1. At delivery the futures price is $F = 95$. A deliverable bond with conversion factor $CF = 1.10$ trades at a clean price of 106.00. What is its net delivery cost per 100 of face?

**Answer:** 1.5

Net cost $= P - F \cdot CF = 106.00 - 95 \times 1.10 = 1.50$. Accrued interest cancels: the seller receives it in the invoice and paid it when buying the bond.

### 2. Yields fall from 6% to 3%. Which of the three bonds becomes the cheapest to deliver?

- a) A, the 3% bond with the shortest duration
- b) C, the 7% bond with the longest duration
- c) B, the bond in the middle
- d) None: all three stay equally cheap

**Answer:** a) A, the 3% bond with the shortest duration

Below the notional 6% all prices rise, the low-duration bond least in relative terms, so A has the lowest $P/CF$. Equal costs hold only at exactly 6%.

---

Source: https://quantsandbox.dev/guide/fixed-income/treasury-futures

Previous lesson: [Key-Rate Duration and Yield Curve Risk Explained](https://quantsandbox.dev/guide/fixed-income/curve-risk)

Next lesson: [Interest Rate Swaps: Valuation and the Par Swap Rate](https://quantsandbox.dev/guide/fixed-income/interest-rate-swaps)
