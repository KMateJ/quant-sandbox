# Bond Pricing and Yield to Maturity Explained

A bond as a stream of cash flows, yield to maturity, par, premium and discount. Free interactive lesson with worked examples.

A bond is the simplest traded security whose value comes entirely from discounting: it promises fixed payments on fixed dates, and its price is what those payments are worth today. This lesson prices a bond, defines its yield and explains why prices and yields move in opposite directions. It builds on "Interest, compounding and discounting".

## A bond as a list of cash flows

A plain fixed-rate bond has a **face value** $F$ (also called par or principal), an annual **coupon rate** $c$ and a **maturity** of $T$ years. Throughout this track we take $F = 100$ and assume one coupon per year. The holder receives a coupon $cF$ at the end of each year $t = 1, \dots, T$ and, together with the last coupon, the face value $F$.

Example: a 10-year bond with $c = 5\%$ pays 5 at the end of years 1 to 9 and $5 + 100 = 105$ at the end of year 10. Nothing else is uncertain in this description; we assume the issuer does not default.

## Price as a present value

Discount every cash flow at one annual rate $y$, using annual compounding as in "Interest, compounding and discounting", and add up the present values. The result is the **price** $P$:

$$
P = \sum_{t=1}^{T} \frac{cF}{(1+y)^t} + \frac{F}{(1+y)^T}.
$$

The coupons form an annuity, so the sum has a closed form:

$$
P = cF\,\frac{1 - (1+y)^{-T}}{y} + \frac{F}{(1+y)^T}.
$$

Each term is a payment times a discount factor $1/(1+y)^t$. The further away a payment is, the more it is shrunk.

### Worked example: Pricing a 3-year bond one cash flow at a time

1. A 3-year bond with a 4% coupon pays 4, 4 and 104. At $y = 5\%$, discount the first coupon by one year.
   $$\frac{4}{1.05}$$ → **3.81**
2. The second coupon is discounted by two years.
   $$\frac{4}{1.05^2}$$ → **3.63**
3. The last coupon and the face value arrive together after three years.
   $$\frac{104}{1.05^3}$$ → **89.84**
4. The price is the sum of the three present values.
   $$P = 3.81 + 3.63 + 89.84$$ → **97.28**

## Yield to maturity

In the market the direction is reversed: the price $P$ is observed, and $y$ is unknown. The **yield to maturity** (YTM) is the single rate $y$ that makes the present value of the cash flows equal to the market price. In the language of investment appraisal it is the **internal rate of return** of buying the bond at $P$ and holding it to maturity.

There is no closed form for $y$ when $T > 1$; it is found numerically (for example by bisection), which is easy because the price is a strictly decreasing function of $y$. The yield is a summary number: it assumes every cash flow is discounted at the same rate.

> Yield to maturity: the one discount rate $y$ at which the present value of all promised cash flows equals the bond's price.

## The price–yield relation

Every term in the price formula has $y$ in the denominator, so a higher yield gives a lower price and a lower yield a higher price. The relation is not a straight line. Differentiating each term $(1+y)^{-t}$ twice gives a positive result, so the curve $y \mapsto P(y)$ is **convex**: it falls steeply at low yields and flattens at high yields. A rise of 1% in yield therefore lowers the price by less than a fall of 1% raises it.

## Premium, par and discount bonds

Compare the coupon rate with the yield.

- **Par**: if $c = y$, the price equals $F$. Each year the coupon pays exactly the interest the market demands, so nothing needs to be made up through the price.
- **Premium**: if $c > y$, the bond pays more than the market rate, and buyers pay more than $F$ for it.
- **Discount**: if $c < y$, the coupons are too low, and the bond sells below $F$ so that the gain from the price rising to $F$ at maturity makes up the shortfall.

## Zero-coupon bonds

A **zero-coupon bond** has $c = 0$: it pays only $F$ at $T$. Its price is a single discounted amount,

$$
P = \frac{F}{(1+y)^T},
$$

so its yield can be solved directly: $y = (F/P)^{1/T} - 1$. A 10-year zero at $y = 6\%$ costs $100/1.06^{10} \approx 55.84$. Zeros always trade at a discount for positive yields, and they are the building blocks of every other bond: a coupon bond is a bundle of zeros, one for each payment date.

## Current yield

A simpler number often quoted is the **current yield**, the annual coupon divided by the price, $cF/P$. It ignores the gain or loss from the price moving to $F$ at maturity. For a discount bond the YTM is higher than the current yield, which is in turn higher than the coupon rate; for a premium bond the order is reversed. At par all three coincide.

## A worked example

Take $c = 5\%$, $T = 10$, $y = 6\%$. The annuity factor is $(1 - 1.06^{-10})/0.06 \approx 7.360$, so

$$
P = 5 \cdot 7.360 + \frac{100}{1.06^{10}} \approx 36.80 + 55.84 = 92.64.
$$

The coupon is below the yield, so the bond trades at a discount. Its current yield is $5/92.64 \approx 5.40\%$, between the coupon rate of 5% and the YTM of 6%. Raising the coupon to 7% at the same yield gives about 107.36, a premium; at $y = 5\%$ the 5% bond is worth exactly 100.

The figure plots the price against yields from 0% to 15%, with a horizontal line at par (100) and a vertical line at the chosen yield. The readouts show the price, whether it is at a premium, at par or at a discount, and the current yield. Move $y$ across the coupon rate and note that the price crosses 100 exactly there. Raise $T$ and note that the curve gets steeper and more curved; set $c$ to 0 to see a zero-coupon bond.

*[Interactive figure: price yield](https://quantsandbox.dev/guide/fixed-income/bond-pricing)*

## Pull to par

If the yield stays the same, the price of a bond moves towards $F$ as maturity approaches, because fewer coupons are left to be over- or under-priced and the face value is discounted over a shorter time. With $c = 5\%$ and $y = 6\%$, the price is about 92.64 with 10 years left, 95.79 with 5 years left and 99.06 with one year left; at maturity it is 100. This is the **pull to par**. In the figure, shorten $T$ at a fixed yield and the curve flattens towards the par line.

## Summary

- A fixed-rate bond is a list of known cash flows: coupons $cF$ each year and the face value $F$ at maturity.
- Its price is the present value of those cash flows; the yield to maturity is the single rate that reproduces the market price (the bond's IRR).
- Price and yield move in opposite directions along a convex curve.
- The bond trades at par when $c = y$, at a premium when $c > y$ and at a discount when $c < y$; with an unchanged yield its price is pulled to par as maturity approaches.

> The next lesson, "Duration and convexity", measures the slope and the curvature of the price–yield curve.

[Price bonds and solve for yields in the Bond Pricing lab](https://quantsandbox.dev/bond-pricing)

## Interactive labs

- [Bond Pricing Calculator & Price–Yield Curve](https://quantsandbox.dev/bond-pricing)

## Practice questions

### 1. A 3-year bond with face value 100 pays a 5% annual coupon. What is its price at a yield of 6%?

**Answer:** 97.33

$P = 5/1.06 + 5/1.06^2 + 105/1.06^3 \approx 4.72 + 4.45 + 88.16 = 97.33$.

### 2. A bond's coupon rate is below its yield to maturity. Where does its price stand relative to the face value?

- a) Above the face value
- b) At the face value
- c) Below the face value
- d) It depends on the maturity

**Answer:** c) Below the face value

With $c < y$ the coupons pay less than the market demands, so the bond trades at a discount; the rise to $F$ by maturity makes up the difference.

---

Source: https://quantsandbox.dev/guide/fixed-income/bond-pricing

Next lesson: [Bond Duration and Convexity Explained](https://quantsandbox.dev/guide/fixed-income/duration-convexity)
