# Key-Rate Duration and Yield Curve Risk Explained

Parallel shifts, steepeners and butterflies; key-rate durations as the sensitivities of a bond to each part of the curve.

"Duration and convexity" measured the price risk of a bond with one number, and it did so by moving a single yield. "Spot rates, forward rates and the yield curve" showed that there is no single yield: every maturity has its own zero rate. This lesson asks what happens to a bond when the curve moves in a way that is not parallel, and how to measure the exposure to each part of the curve separately.

Throughout, rates are annually compounded zero rates read off one upward-sloping curve: 3.0% at 1 year, 3.4% at 2, 3.9% at 5, 4.3% at 10 and 4.6% at 30 years, with straight lines between these points. A bond is a set of cash flows $CF_t$, and each is discounted at the zero rate of its own maturity.

## Pricing off the curve

The price of a bond on a zero curve is the sum of its discounted cash flows, each at its own rate $z_t$:

$$
P = \sum_t \frac{CF_t}{(1+z_t)^t}.
$$

Take a 5-year bond with a 4% annual coupon and face value 100. Its cash flows are 4, 4, 4, 4 and 104 at the ends of years 1 to 5, and discounting each at its zero rate gives $P \approx 100.57$. The yield to maturity is a single average of the five zero rates; the price itself needs all of them.

## Shapes of a curve move

Curves rarely move in parallel. Three simple shapes cover most of what happens. A **parallel shift** moves every rate by the same amount. A **steepener** or **flattener** changes the slope: in a steepener the short rates fall relative to the long ones, in a flattener the short rates rise relative to the long ones. A **butterfly** changes the curvature: the middle of the curve moves against the two ends.

The figure uses exactly the shapes of the yield curve lab. A shock of $+50$ bp as a steepener lowers the 1-year rate by about 38 bp, the 5-year rate by about 16 bp and the 30-year rate by under 3 bp: the short end does the moving.

## Key-rate durations

One duration cannot say where on the curve the risk sits. A **key-rate duration** can. Pick key maturities, here 2, 5, 10 and 30 years. For each key rate, move that rate by a small amount $\Delta y$, let the neighbouring zero rates follow it down linearly to zero at the adjacent key maturities, and record the relative price change:

$$
\text{KRD}_k = -\frac{1}{P}\,\frac{\Delta P}{\Delta y_k}.
$$

The weights are built so that, at every maturity, the shares of the key rates add up to one. Moving all key rates together is therefore the same as a parallel shift, and the key-rate durations add up to the ordinary duration against a parallel move of the zero curve:

$$
\sum_k \text{KRD}_k = D.
$$

For the 5-year bond this duration is 4.46 years. It splits into $\text{KRD}_{2} = 0.22$, $\text{KRD}_{5} = 4.23$ and zero for the 10- and 30-year keys: nearly all of the risk sits at the 5-year point, as it must, because the bond has no cash flow beyond year 5. A change in any other part of the curve leaves its price almost untouched.

## Bullet against barbell

Two portfolios can have the same price and the same duration and still behave differently. Compare the 5-year bond, a **bullet**, with a **barbell** of two zero-coupon bonds, one maturing in 2 years and one in 30, weighted so that its price and its duration equal the bullet's. About 91% of the barbell's value sits in the short zero and 9% in the long one.

Both have a duration of 4.46 years, so "Duration and convexity" cannot tell them apart. Their key-rate durations can: the bullet is 4.23 at the 5-year key, while the barbell is 1.75 at the 2-year key and 2.70 at the 30-year key and nothing in between. Under a parallel move of $+50$ bp the bullet falls 2.20% and the barbell 2.13%; the small gap is the barbell's greater convexity, the point made in "Immunization and duration matching". Under a $+50$ bp steepener the bullet gains 0.74% and the barbell only 0.59%, and under a flattener the bullet loses 0.74% against the barbell's 0.58%. In the butterfly, which pushes the middle of the curve up, the bullet loses 0.59% and the barbell 0.32%. A single duration hides these differences; the key-rate durations explain them.

*[Interactive figure: key rate shocks](https://quantsandbox.dev/guide/fixed-income/curve-risk)*

In the figure, choose a shape and a size. The upper chart shows the zero curve before and after the shock; the lower one shows the key-rate durations of the bullet and the barbell. The readouts give each portfolio's price change and the sum of the bullet's key-rate durations.

## Using the numbers

Key-rate durations let a risk manager state a view precisely. An investor who expects the curve to steepen can choose which key rates the portfolio is exposed to. To hedge, they pick instruments whose key-rate durations cancel the portfolio's at each key point, rather than only matching the total duration. The cost is that the result depends on the chosen key points and on how the shock is spread between them, so key-rate durations describe a particular decomposition of the curve, not a law of nature.

### Worked example: Price change of the 5-year bond in a +50 bp steepener

1. Price the cash flows 4, 4, 4, 4, 104 off the curve.
   $$P = \sum_t \frac{CF_t}{(1+z_t)^t}$$ → **100.57**
2. The steepener lowers the 2-year zero rate by (in bp).
   $$\Delta z_2$$ → **-29.12**
3. It lowers the 5-year zero rate by (in bp).
   $$\Delta z_5$$ → **-15.84**
4. The bond's key-rate durations at the 2- and 5-year points.
   $$\text{KRD}_2,\ \text{KRD}_5 = 0.22,\ 4.23$$
5. First-order price change in per cent: the key-rate durations times the rate falls.
   $$\frac{\Delta P}{P} \approx -\sum_k \text{KRD}_k\,\Delta z_k$$ → **0.73%**
6. Repricing off the shocked curve gives 0.74%: the small difference is convexity.
   $$\frac{P_{\text{shocked}}}{P} - 1$$ → **0.74%**

## Summary

- A bond is priced off the whole zero curve: $P = \sum_t CF_t/(1+z_t)^t$.
- Curve moves have shapes: parallel, steepener, flattener and butterfly.
- Key-rate durations measure the price sensitivity to each key maturity; they add up to the duration against a parallel shift.
- Equal price and duration do not mean equal risk: a bullet and a barbell differ in their key-rate durations and react differently to non-parallel moves.
- Key-rate durations depend on the chosen key points and on how a shock is spread between them.

> A later lesson, "Bond futures and the cheapest-to-deliver", prices a contract on a basket of bonds, where the curve level and slope decide which bond is delivered.

[Open the Yield Curve lab to shock the curve yourself](https://quantsandbox.dev/yield-curve)

## Interactive labs

- [Yield Curve Bootstrapping, Spot & Forward Rates](https://quantsandbox.dev/yield-curve)
- [Bond Duration & Convexity Approximation](https://quantsandbox.dev/duration-convexity)

## Practice questions

### 1. A portfolio has key-rate durations of 0.30, 1.10, 2.40 and 0.90 years at the 2-, 5-, 10- and 30-year points. What is its duration against a parallel shift of the curve?

**Answer:** 4.7 years

The key-rate durations add up to the duration against a parallel shift: $0.30 + 1.10 + 2.40 + 0.90 = 4.70$ years.

### 2. A bullet and a barbell have the same price and duration. Only the 5-year rate rises, by 10 bp, and the 2- and 30-year rates stay put. Which loses more?

- a) The 5-year bullet
- b) The 2/30-year barbell
- c) They lose the same, because their durations are equal

**Answer:** a) The 5-year bullet

The bullet's duration sits at the 5-year point (key-rate duration 4.23), while the barbell has no exposure to that rate. The bullet loses about $4.23 \times 0.10\% \approx 0.42\%$; the barbell loses almost nothing.

---

Source: https://quantsandbox.dev/guide/fixed-income/curve-risk

Previous lesson: [Spot Rates, Forward Rates and Yield Curve Bootstrapping](https://quantsandbox.dev/guide/fixed-income/yield-curve)

Next lesson: [Treasury Bond Futures: Conversion Factors and CTD](https://quantsandbox.dev/guide/fixed-income/treasury-futures)
