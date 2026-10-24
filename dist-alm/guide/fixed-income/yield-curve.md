# Spot Rates, Forward Rates and Yield Curve Bootstrapping

Zero-coupon rates, bootstrapping from par yields, implied forward rates and the shape of the curve. Free interactive lesson with worked examples.

In "Bond prices and yields" every cash flow of a bond was discounted at one rate, its yield to maturity. In real markets money lent for one year and money lent for ten years earn different rates. This lesson gives each maturity its own rate, the **spot rate**, shows how to read spot rates off bond prices, and derives the **forward rates** they imply. It builds on "Interest, compounding and discounting" and "Duration and convexity".

## Yields as averages of rates

Two bonds with different coupons but the same maturity usually have different yields to maturity, even from the same issuer. The reason is that a yield is an average: it blends the rates for all the payment dates of that particular bond, weighted by its cash flows. A coupon payment due in year 1 should be worth the same whichever bond it comes from, so it is cleaner to attach a rate to each payment **date** rather than to each bond.

## Spot rates and discount factors

The **spot rate** $r(t)$ (also called the zero rate) is the yield of a zero-coupon bond maturing at $t$: the rate for borrowing or lending from today until $t$ with a single repayment. In this lesson spot and forward rates are **continuously compounded**, so the price today of 1 paid at $t$, the **discount factor**, is

$$
P(0,t) = e^{-r(t)\,t}, \qquad r(t) = -\frac{\ln P(0,t)}{t}.
$$

The function $t \mapsto r(t)$ is the **yield curve** (or term structure of interest rates). The discount factors carry the same information; the rates are just easier to compare across maturities.

## Pricing a coupon bond with spot rates

A coupon bond is a bundle of zero-coupon bonds, one for each payment. If $CF_t$ is paid at year $t$, each cash flow is discounted at the spot rate for its own date:

$$
P = \sum_{t=1}^{T} CF_t\, e^{-r(t)\,t}.
$$

If the curve is flat, $r(t) = r$ for every $t$, this collapses to discounting at a single rate, and the yield of every bond is the same. Otherwise the yield to maturity of a bond is the one rate that reproduces this price, a cash-flow-weighted blend of the spot rates.

## Bootstrapping

Zero-coupon bonds do not exist for every maturity, so spot rates are usually extracted from coupon bond prices one maturity at a time, starting at the short end. This is called **bootstrapping**. We use annual coupons (with $F = 100$), solve for discount factors, which do not depend on any compounding convention, and only then convert them into continuously compounded spot rates.

Suppose the market quotes a 1-year zero-coupon bond at 97.00 and a 2-year bond with a 5% annual coupon at 101.00.

1. The 1-year zero gives $P(0,1) = 97.00/100 = 0.9700$, so $r(1) = -\ln 0.97 \approx 3.05\%$.
2. The 2-year bond pays 5 at year 1 and 105 at year 2. The first payment is already priced by step 1: $101.00 = 5 \cdot 0.9700 + 105\,P(0,2)$, so $P(0,2) = 96.15/105 \approx 0.9157$ and $r(2) = -\tfrac{1}{2}\ln 0.9157 \approx 4.40\%$.

With more bonds the procedure continues the same way: at each maturity only one discount factor is unknown. With these two spot rates a 2-year bond with a 6% coupon must cost $6 \cdot 0.9700 + 106 \cdot 0.9157 \approx 102.89$; any other price would let you build it more cheaply from the two quoted bonds. Its yield to maturity (annual compounding) is about 4.46%, a blend of the two spot rates.

Bonds that trade at par are a common starting point, because their coupon rate is the par yield quoted for that maturity.

### Worked example: Bootstrapping the 2-year spot rate from a par bond

1. Keep $P(0,1) = 0.9700$ from above. A 2-year bond with a 4.5% annual coupon trades at par, 100, and pays 4.5 and 104.5. Solve for the unknown discount factor.
   $$P(0,2) = \frac{100 - 4.5 \times 0.9700}{104.5}$$ → **0.9152**
2. Convert it into a continuously compounded spot rate.
   $$r(2) = -\tfrac{1}{2}\ln P(0,2)$$ → **4.43%**

## Forward rates

A **forward rate** $f(t_1, t_2)$ is the rate, fixed today, for borrowing or lending between two future dates $t_1 < t_2$. No arbitrage pins it down from the spot curve. Compare two ways of investing 1 from today until $t_2$:

- invest directly at the spot rate $r_2 = r(t_2)$, which grows to $e^{r_2 t_2}$;
- invest until $t_1$ at $r_1 = r(t_1)$, and agree today to reinvest from $t_1$ to $t_2$ at $f(t_1,t_2)$, which grows to $e^{r_1 t_1}\,e^{f(t_1,t_2)(t_2 - t_1)}$.

Both strategies are riskless and cost 1 today, so by the argument of "Arbitrage and the forward price" they must deliver the same amount. Equating the exponents gives

$$
f(t_1, t_2) = \frac{r_2 t_2 - r_1 t_1}{t_2 - t_1}.
$$

> The forward rate between $t_1$ and $t_2$ is the rate that makes rolling over at $t_1$ equivalent to investing until $t_2$ at once: $f(t_1,t_2) = (r_2t_2 - r_1t_1)/(t_2 - t_1)$.

In the bootstrapping example, $f(1,2) = 2 \cdot 4.40\% - 3.05\% \approx 5.76\%$. Check: $e^{0.0305}e^{0.0576} \approx e^{2 \cdot 0.0440} \approx 1.092$.

## The instantaneous forward curve

Let $t_2$ shrink towards $t_1 = t$. The numerator is the change in $r(t)\,t$, so the limit is a derivative, the **instantaneous forward rate**:

$$
f(t) = \frac{d}{dt}\big(r(t)\,t\big) = r(t) + t\,r'(t).
$$

This explains how the two curves sit relative to each other. Where the spot curve rises ($r'(t) > 0$), the forward curve lies **above** it; where the spot curve falls, the forward curve lies below; where the spot curve is flat, the two coincide. A fair picture is a running average: the spot rate $r(t)$ is the average of the forward rates from 0 to $t$, so it only goes up when the new rate being added is above the current average.

## Shapes of the yield curve

- **Upward sloping** (normal): long rates above short rates. The most common shape.
- **Flat**: about the same rate at all maturities; the single-yield world of "Bond prices and yields".
- **Inverted**: short rates above long rates, often seen when markets expect rates to be cut.
- **Humped**: rates rise over the first few years and then fall back.

The figure draws a smooth three-parameter spot curve (continuously compounded) from 0 to 30 years, with the instantaneous forward curve implied by it. The **level** is the long-term rate the curve settles at, the **slope** sets how far the short end lies below (negative) or above (positive) that level, and the **hump** adds a bump at intermediate maturities. The readouts show the 2-, 10- and 30-year spot rates and the 10-year minus 2-year spread. At the defaults the curve slopes upward: about 3.00% at 2 years, 3.79% at 10 years and 3.93% at 30 years, a spread of about 79 basis points, and the forward curve runs above the spot curve. Make the slope positive to invert the curve and note that the forward curve drops below the spot curve; set slope and hump to 0 and the two curves coincide.

*[Interactive figure: spot forward](https://quantsandbox.dev/guide/fixed-income/yield-curve)*

## Summary

- The spot rate $r(t)$ is the rate on a zero-coupon loan to $t$; with continuous compounding the discount factor is $e^{-r(t)t}$.
- A coupon bond is priced by discounting each cash flow at the spot rate for its date; its yield to maturity is a blend of these rates.
- Bootstrapping recovers discount factors one maturity at a time from coupon bond prices.
- No arbitrage gives forward rates $f(t_1,t_2) = (r_2t_2 - r_1t_1)/(t_2 - t_1)$; the forward curve lies above the spot curve where the spot curve rises and below it where it falls.

[Fit and reshape a yield curve in the Yield Curve lab](https://quantsandbox.dev/yield-curve)

## Interactive labs

- [Yield Curve Bootstrapping, Spot & Forward Rates](https://quantsandbox.dev/yield-curve)
- [Treasury Futures: Conversion Factors & Cheapest-to-Deliver](https://quantsandbox.dev/treasury-futures)

## Practice questions

### 1. The continuously compounded spot rates are $r(1) = 3\%$ and $r(2) = 4\%$. What is the forward rate $f(1,2)$, in percent?

**Answer:** 5%

$f(1,2) = (2 \times 4\% - 1 \times 3\%)/(2 - 1) = 5\%$. Two years at 4% equal one year at 3% followed by one year at 5%.

### 2. Over a range of maturities the instantaneous forward curve lies above the spot curve. What is the spot curve doing there?

- a) Rising
- b) Falling
- c) Flat
- d) It cannot be told from the forwards

**Answer:** a) Rising

$f(t) = r(t) + t\,r'(t)$, so $f(t) > r(t)$ exactly when $r'(t) > 0$: the spot rate, a running average of the forwards, rises when the new forward is above it.

---

Source: https://quantsandbox.dev/guide/fixed-income/yield-curve

Previous lesson: [Bond Immunization and Duration Matching Explained](https://quantsandbox.dev/guide/fixed-income/immunization)

Next lesson: [Key-Rate Duration and Yield Curve Risk Explained](https://quantsandbox.dev/guide/fixed-income/curve-risk)
