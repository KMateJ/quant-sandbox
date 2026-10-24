# Callable Bonds, Yield to Call and Negative Convexity

The issuer's call option, price compression near the call price, yield to call and negative convexity. Free interactive lesson with worked examples.

"Bond prices and yields" and "Duration and convexity" priced bonds whose cash flows are fixed in advance. Many corporate and agency bonds are not: the issuer may repay them early. This lesson treats that right as an option held by the issuer, shows how it caps the bond's price when yields fall, and explains why such a bond can have negative convexity. Options were introduced in "Forwards, calls and puts"; here only the idea of a right without an obligation is needed. Notation: face value $F = 100$, annual coupon $c$, yield $y$ with annual compounding, price $P$.

## The call feature

A **callable bond** lets the issuer buy the bond back from the holder at a fixed **call price**, usually par, on or after a first call date. The years before that date are the **call protection** period. Take a 10-year bond with a 6% coupon, callable at 100 after 3 years. If market yields for this issuer fall to 4%, a new 7-year bond would cost the issuer 4% a year instead of 6%. The issuer then calls the old bond at 100 and refinances. If yields rise, the issuer keeps the cheap 6% debt. The holder gets the bad outcome in both directions: low reinvestment rates when the bond is called, and a falling price when it is not.

## A callable bond as a straight bond minus a call

Holding the callable bond is the same as holding a **straight bond** with the same coupon and maturity and having sold the issuer a call option on it, with strike equal to the call price:

$$
P_{\text{callable}} = P_{\text{straight}} - C_{\text{call}}.
$$

The option has value because the future yield is uncertain. A two-state illustration: suppose that in 3 years the yield is either 4% or 8%, each with probability one half, and that money is discounted at 5%. The remaining 7-year bond is then worth $112.00$ or $89.59$. In the low-yield state the issuer calls and pays 100, taking away $12.00$ from the holder; in the high-yield state nothing happens. Today the call is worth about

$$
C_{\text{call}} \approx \frac{\tfrac{1}{2}\,(112.00 - 100)}{1.05^{3}} \approx 5.18.
$$

> A callable bond is a straight bond minus a call option sold to the issuer. The holder is paid for the option through a lower price, which means a higher yield, than on a comparable straight bond.

Repeat the two-state illustration with a wider range: in 3 years the yield is 3% or 7%, again each with probability one half and discounting at 5%.

### Worked example: Two-state call value with yields of 3% or 7%

1. Value in 3 years of the remaining 7-year 6% bond if the yield is 3%.
   $$B_{\text{low}} = \sum_{t=1}^{7} \frac{6}{1.03^t} + \frac{100}{1.03^7}$$ → **118.69**
2. Its value if the yield is 7%; the issuer does not call.
   $$B_{\text{high}} = \sum_{t=1}^{7} \frac{6}{1.07^t} + \frac{100}{1.07^7}$$ → **94.61**
3. Today's call value: the expected payoff $\max(B - 100, 0)$, discounted for 3 years.
   $$C_{\text{call}} = \frac{\tfrac{1}{2}\,\max(B_{\text{low}} - 100,\,0)}{1.05^{3}}$$ → **8.07**
4. Callable price, with the straight bond worth 107.72 (from the worked example below).
   $$P_{\text{straight}} - C_{\text{call}}$$ → **99.65**

A wider spread of future yields makes the call worth more, 8.07 instead of 5.18, and the callable bond cheaper.

## Yield to maturity, yield to call, yield to worst

A callable bond has more than one natural yield. The **yield to maturity** assumes the bond is never called. The **yield to call** assumes it is called at the first call date: coupons up to that date, then the call price. Investors usually quote the **yield to worst**, the lower of the two, because the issuer will choose whichever outcome is cheaper for the issuer, which is the worse one for the holder.

## A worked example

For the 10-year 6% bond at a market yield of 5%, the straight bond is worth

$$
P_{\text{straight}} = \sum_{t=1}^{10} \frac{6}{1.05^{t}} + \frac{100}{1.05^{10}} \approx 107.72.
$$

Value the call as an option on the bond at the first call date: in 3 years the yield is uncertain (lognormal around 5%, with 20% volatility per year), the issuer calls whenever the remaining 7-year bond is worth more than 100, and the payoff is discounted back. This gives $C_{\text{call}} \approx 7.13$, so the callable bond is worth about $100.59$. At that price:

- yield to maturity: 5.92%;
- yield to call (coupons for 3 years, then 100): 5.78%;
- yield to worst: 5.78%.

The 92 basis points between the 5% market yield and the callable's yield to maturity, and the 7.13 points of price, are the holder's compensation for the call.

## Price compression and negative convexity

As yields fall, a straight bond keeps rising. A callable bond rises much less, because a higher price makes the call more likely to be exercised: its price is compressed towards the call price. From 5% to 4% the straight bond gains $8.50$, the callable only $4.09$. From 5% to 6% the straight bond loses $7.72$, the callable $4.75$. Duration and convexity are therefore measured on the actual price function, by shifting the yield by a small $\Delta y$ in each direction:

$$
D_{\text{eff}} = \frac{P_{-} - P_{+}}{2\,P\,\Delta y}, \qquad C_{\text{eff}} = \frac{P_{+} + P_{-} - 2P}{P\,(\Delta y)^2}.
$$

At 5% with $\Delta y = 0.1\%$ the callable has an **effective duration** of about 4.42, against a modified duration of 7.52 for the straight bond, and an **effective convexity** of about $-68$, against $+72$. Negative convexity means the price curve bends the wrong way: the holder loses more when yields rise than it gains when they fall by the same amount. It appears where the call is most valuable relative to its sensitivity, around and below the coupon rate. At high yields the call is almost worthless and the callable behaves like the straight bond again.

A longer call protection period shrinks the call's value: at 5%, with 5 years of protection the call is worth 5.53 and the bond 102.20; if it is callable from the first coupon date, the call is worth 7.74 and the bond 99.98. This model is deliberately simple: it allows a call only at the first call date. A full valuation lets the issuer call at every date after the protection period and builds a tree of future interest rates, in the spirit of "Multi-step trees and backward induction".

In the figure, the straight bond's price–yield curve lies above the callable bond's, and the shaded band between them is the value of the call. Drag the point along the yield axis, or focus it and use the arrow keys. The dashed line is the tangent at that yield, and the label above the point says whether the callable curve is convex or concave there. The readouts give both prices, the call value, the three yields and the effective duration and convexity. Move the point from 9% down to 3% and watch the label switch to negative convexity as the gap widens. Then change the call protection and see the band shrink as protection lengthens.

*[Interactive figure: callable price yield](https://quantsandbox.dev/guide/fixed-income/callable-bonds)*

## Summary

- A callable bond gives the issuer the right to repay at the call price after the protection period.
- Its price is the straight bond's price minus the value of the issuer's call; the holder is compensated by a higher yield.
- Yield to worst, the lower of yield to maturity and yield to call, is the conservative quote.
- Near and below the coupon rate the price is compressed towards the call price: effective duration falls and convexity turns negative.

> The next lesson, "Credit risk: default probabilities and credit spreads", looks at another reason a bond can pay less than promised: the issuer may not pay at all.

[Price bonds and compare their price–yield curves in the Bond Pricing lab](https://quantsandbox.dev/bond-pricing)

## Interactive labs

- [Bond Pricing Calculator & Price–Yield Curve](https://quantsandbox.dev/bond-pricing)
- [Binomial Option Pricing Tree Calculator](https://quantsandbox.dev/binomial)

## Practice questions

### 1. The market starts to expect much more volatile interest rates; today's yields and everything else stay the same. What happens to the price of the callable bond?

- a) It falls, because the issuer's call option becomes more valuable.
- b) It rises, because a more volatile bond is worth more.
- c) It stays the same, because the yield has not changed.
- d) It moves to the straight bond's price.

**Answer:** a) It falls, because the issuer's call option becomes more valuable.

$P_{\text{callable}} = P_{\text{straight}} - C_{\text{call}}$. The straight bond does not change, while an option is worth more when the future is more uncertain, so the holder's price falls.

### 2. At a yield of 5% the callable bond has an effective convexity of about $-68$. Yields move 1 percentage point up or down. Compared with a bond of the same duration and zero convexity, the callable bond…

- a) loses more when yields rise than it gains when they fall
- b) gains more when yields fall than it loses when they rise
- c) moves exactly as its duration predicts in both directions
- d) does not react to yield changes, because of the call

**Answer:** a) loses more when yields rise than it gains when they fall

With negative convexity the price curve lies below its tangent, so the term $\tfrac{1}{2}C_{\text{eff}}P(\Delta y)^2$ subtracts in both directions. From 5% the lesson's numbers show it: $+4.09$ for a fall, $-4.75$ for a rise.

---

Source: https://quantsandbox.dev/guide/fixed-income/callable-bonds

Previous lesson: [Interest Rate Swaps: Valuation and the Par Swap Rate](https://quantsandbox.dev/guide/fixed-income/interest-rate-swaps)

Next lesson: [Credit Risk: Default Probability, Credit Spreads and CDS](https://quantsandbox.dev/guide/fixed-income/credit-risk)
