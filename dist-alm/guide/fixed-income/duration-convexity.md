# Bond Duration and Convexity Explained

Macaulay and modified duration, first- and second-order approximations of interest-rate risk. Free interactive lesson with worked examples.

In "Bond prices and yields" the price of a bond was a decreasing, convex function of its yield. This lesson puts numbers on that curve: **duration** measures its slope, **convexity** its curvature. Together they tell you how much a bond's price changes when yields move, without repricing it. The notation is the same: face value $F = 100$, annual coupons at rate $c$, maturity $T$, yield to maturity $y$ with annual compounding, price $P$.

## Interest-rate risk

A bond's cash flows are fixed, but its price is not: when market yields rise, the same cash flows are discounted more heavily and the price falls. This exposure is **interest-rate risk**. Two bonds can react very differently to the same change in yield; a 30-year bond loses far more than a 1-year bill. We want one number that captures this sensitivity.

## Macaulay duration

Write $CF_t$ for the cash flow at year $t$ (so $CF_t = cF$ for $t < T$ and $CF_T = cF + F$). Each cash flow contributes a present value $PV_t = CF_t/(1+y)^t$ to the price, and these contributions add up to $P$. The **Macaulay duration** is the average payment time, weighted by these present values:

$$
D = \sum_{t=1}^{T} t\,\frac{PV_t}{P}, \qquad PV_t = \frac{CF_t}{(1+y)^t}.
$$

Think of a seesaw: put a weight $PV_t$ at distance $t$ along a beam; $D$ is the point where the beam balances. For a coupon bond the coupons pull the balance point earlier than $T$, so $D < T$. A **zero-coupon bond** has only one cash flow, all the weight sits at $T$, and its duration equals its maturity: $D = T$.

## Modified duration

Differentiate the price with respect to the yield. Each term $(1+y)^{-t}$ has derivative $-t\,(1+y)^{-t-1}$, so

$$
\frac{dP}{dy} = -\sum_{t=1}^{T} t\,\frac{CF_t}{(1+y)^{t+1}} = -\frac{1}{1+y}\sum_{t=1}^{T} t\,PV_t = -\frac{D}{1+y}\,P.
$$

The factor in front is the **modified duration**:

$$
D_{mod} = \frac{D}{1+y}, \qquad \frac{dP}{dy} = -D_{mod}\,P.
$$

For a small change $\Delta y$ in yield, a first-order Taylor expansion gives the relative price change:

$$
\frac{\Delta P}{P} \approx -D_{mod}\,\Delta y.
$$

A bond with $D_{mod} = 7.7$ loses about 7.7% of its value when its yield rises by one percentage point. Geometrically, this approximation replaces the price–yield curve by its tangent at the current yield, exactly as delta replaced the option value curve by its tangent in "Delta and hedging".

> Modified duration $D_{mod} = D/(1+y)$ is the percentage price change per unit change in yield: $\Delta P/P \approx -D_{mod}\,\Delta y$.

## Dollar duration

Portfolio managers often need the change in money rather than in percent. The **dollar duration** is $D_{mod}\,P$, the price change per unit of yield; divided by 10 000 it gives the change per basis point (0.01%), often called DV01. Dollar durations add across positions, which is how a bond portfolio's interest-rate exposure is aggregated and hedged.

## Convexity

The tangent ignores the bend of the curve. Differentiating once more,

$$
\frac{d^2P}{dy^2} = \sum_{t=1}^{T} t(t+1)\,\frac{CF_t}{(1+y)^{t+2}} > 0,
$$

and the **convexity** is this second derivative per unit of price:

$$
C = \frac{1}{P}\,\frac{d^2P}{dy^2}.
$$

A second-order Taylor expansion then gives

$$
\frac{\Delta P}{P} \approx -D_{mod}\,\Delta y + \tfrac{1}{2}\,C\,(\Delta y)^2.
$$

This mirrors the gamma term $\tfrac{1}{2}\Gamma(dS)^2$ of the delta hedge. Because $C > 0$ and $(\Delta y)^2 \ge 0$, the correction is always positive: when yields fall the bond gains more than duration predicts, and when they rise it loses less. Between two bonds with the same price and duration, the holder prefers the one with higher convexity, and in markets that extra protection is usually paid for with a slightly lower yield. Convexity grows roughly with the square of maturity, so it matters most for long bonds and large yield moves.

## A worked example

Take $c = 5\%$, $T = 10$, $y_0 = 5\%$. The bond trades at par, $P_0 = 100$. Summing the weighted payment times gives

$$
D \approx 8.108, \qquad D_{mod} = \frac{8.108}{1.05} \approx 7.722, \qquad C \approx 75.0.
$$

The dollar duration is about 772, so one basis point moves the price by about 0.077.

### Worked example: A 100 basis point rise, with and without convexity

1. Duration alone: the relative price change is minus modified duration times $\Delta y = 0.01$.
   $$-D_{mod}\,\Delta y = -7.722 \times 0.01$$ → **-7.72%**
2. The convexity correction is half the convexity times the squared yield change.
   $$\tfrac{1}{2}\,C\,(\Delta y)^2 = \tfrac{1}{2} \times 75.0 \times 0.0001$$ → **0.375%**
3. Adding the two gives the second-order estimate, close to the true change of $-7.36\%$.
   $$\frac{\Delta P}{P} \approx -7.722\% + 0.375\%$$ → **-7.35%**

Now shift the yield by one percentage point in both directions:

- $\Delta y = +1\%$: the true price is 92.64, a change of $-7.36$. Duration alone predicts $-7.72$; adding convexity, $100\,(-0.07722 + \tfrac{1}{2}\cdot 75.0 \cdot 0.0001) \approx -7.35$.
- $\Delta y = -1\%$: the true price is 108.11, a change of $+8.11$. Duration alone predicts $+7.72$; with convexity, $+8.10$.

The tangent overstates the loss and understates the gain, by about 0.36 and 0.39; the convexity term $\tfrac{1}{2}C(\Delta y)^2 P_0 \approx 0.375$ closes almost all of the gap. For comparison, a 10-year zero at 5% has $D = 10$ and $D_{mod} \approx 9.52$: with no coupons to pull the weight forward, it is more sensitive than the coupon bond.

The figure plots the true price against yields within 4 percentage points of $y_0$, together with the duration (tangent) approximation $P_0(1 - D_{mod}\Delta y)$ and the duration-plus-convexity approximation $P_0(1 - D_{mod}\Delta y + \tfrac{1}{2}C\Delta y^2)$. The readouts give $D$, $D_{mod}$, $C$ and, for $\Delta y = \pm 1\%$, the true price change next to both approximations. Note that the tangent always lies below the true curve. Increase $T$ and watch duration and convexity grow and the tangent drift away faster; lower $c$ towards 0 and the Macaulay duration approaches $T$.

*[Interactive figure: duration convexity](https://quantsandbox.dev/guide/fixed-income/duration-convexity)*

## Duration as a balance point

Put each cash flow on a beam at its payment date, with a weight equal to its present value. The Macaulay duration is the point where the beam balances, because it is the present-value-weighted average time. In the figure, raise the yield and watch the fulcrum slide towards today: distant payments are discounted more, so they weigh less. Set the coupon to zero and the fulcrum sits exactly at maturity, as for any zero-coupon bond.

*[Interactive figure: duration balance](https://quantsandbox.dev/guide/fixed-income/duration-convexity)*

## Summary

- Macaulay duration $D$ is the present-value-weighted average time of a bond's cash flows; for a zero it equals the maturity.
- Modified duration $D_{mod} = D/(1+y)$ gives the first-order price change $\Delta P/P \approx -D_{mod}\Delta y$, the tangent to the price–yield curve.
- Convexity $C = P^{-1}\,d^2P/dy^2$ adds the second-order term $\tfrac{1}{2}C(\Delta y)^2$, which is always in the holder's favour.
- Dollar duration $D_{mod}P$ measures the money at risk per unit of yield and adds across a portfolio.

> Duration treats all cash flows as discounted at one yield, so it measures a parallel shift. The next lesson lets each maturity have its own rate.

[Compare true price changes with the approximations in the Duration and Convexity lab](https://quantsandbox.dev/duration-convexity)

## Interactive labs

- [Bond Duration & Convexity Approximation](https://quantsandbox.dev/duration-convexity)
- [Bond Pricing Calculator & Price–Yield Curve](https://quantsandbox.dev/bond-pricing)

## Practice questions

### 1. A bond has a Macaulay duration of 4.2 years and a yield of 5% with annual compounding. What is its modified duration?

**Answer:** 4

$D_{mod} = D/(1+y) = 4.2/1.05 = 4.0$. A one-point rise in yield lowers the price by about 4%.

### 2. Yields move by a large amount, up or down. Compared with the duration-only estimate, where is the true price of a plain fixed-rate bond?

- a) Always higher
- b) Always lower
- c) Higher when yields fall, lower when they rise
- d) Exactly equal

**Answer:** a) Always higher

The convexity term $\tfrac{1}{2}C(\Delta y)^2$ is positive for either sign of $\Delta y$, so the true price lies above the tangent: the bond gains more than predicted when yields fall and loses less when they rise.

---

Source: https://quantsandbox.dev/guide/fixed-income/duration-convexity

Previous lesson: [Bond Pricing and Yield to Maturity Explained](https://quantsandbox.dev/guide/fixed-income/bond-pricing)

Next lesson: [Bond Immunization and Duration Matching Explained](https://quantsandbox.dev/guide/fixed-income/immunization)
