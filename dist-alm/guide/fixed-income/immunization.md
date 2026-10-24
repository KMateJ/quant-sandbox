# Bond Immunization and Duration Matching Explained

Protecting a liability against rate moves by matching present value and duration, and why convexity and rebalancing matter.

"Duration and convexity" measured how much a single bond's price moves when its yield changes. This lesson turns that measurement into a hedge. An investor who owes a fixed amount at a fixed date can choose bonds whose value tracks the value of the debt, so that a change in interest rates hurts neither side more than the other. The notation is the one from "Bond prices and yields": face value $F = 100$, annual coupons, yields with annual compounding, Macaulay duration $D$ and convexity $C$. Throughout, the yield curve is flat and moves in parallel.

## A fixed liability

A pension fund must pay $L = 1\,000\,000$ in exactly 7 years. At a flat yield of $y = 5\%$ the present value of this **liability** is

$$
PV_L = \frac{L}{(1+y)^{7}} = \frac{1\,000\,000}{1.05^{7}} \approx 710\,681.
$$

The liability is a zero-coupon payment, so its duration is its maturity, $D_L = 7$, and its convexity is $C_L = 7 \cdot 8/1.05^2 \approx 50.79$. The fund holds bonds worth exactly $PV_L$ today. The difference between the value of its bonds and $PV_L$ is its **surplus**; the aim is to keep it from turning negative when rates move.

## Price risk and reinvestment risk

A rise in yields does two things to a bond portfolio held for $H$ years. The bonds' market value falls at once (**price risk**), but every coupon received before $H$ is reinvested at the higher rate (**reinvestment risk** works in the holder's favour). A fall in yields does the opposite. The value at the horizon of a portfolio worth $P(y)$ today is $V_H = P(y)\,(1+y)^{H}$, and its sensitivity to the yield is

$$
\frac{d \ln V_H}{dy} = \frac{P'(y)}{P(y)} + \frac{H}{1+y} = \frac{H - D}{1+y},
$$

using $P'/P = -D/(1+y)$ from the previous lesson. When the holding period equals the duration, $H = D$, the two effects cancel to first order: a small parallel shift leaves the horizon value unchanged.

## Matching present value and duration

This gives the recipe called **immunization**. Choose assets such that

$$
PV_A = PV_L \qquad \text{and} \qquad D_A = D_L,
$$

where $D_A$ is the value-weighted average of the bonds' durations. With two bonds, a short one with duration $D_S$ and a long one with duration $D_{Lg}$, put the share $w$ of the money into the short bond and $1 - w$ into the long one. The duration condition $w\,D_S + (1-w)\,D_{Lg} = D_L$ gives

$$
w = \frac{D_{Lg} - D_L}{D_{Lg} - D_S}.
$$

> Immunization: hold assets with the same present value and the same duration as the liability. Then a small parallel shift in yields changes both values by the same amount.

## A worked example

Use a 2-year and a 12-year bond, both with a 5% coupon, so both trade at par at $y = 5\%$. Their durations are $D_S \approx 1.952$ and $D_{Lg} \approx 9.306$, hence

$$
w = \frac{9.306 - 7}{9.306 - 1.952} \approx 0.3136.
$$

The fund buys 222 888 of the 2-year bond and 487 793 of the 12-year bond, together 710 681, and its asset duration is exactly 7. Now shift every yield by the same amount and reprice everything:

- $\Delta y = -1\%$: assets and liability both rise by about 49 200; the surplus is $+747$.
- $\Delta y = +1\%$: both fall by about 45 600; the surplus is $+642$.
- $\Delta y = \pm 3\%$: the surplus is $+7\,861$ and $+4\,985$.

Compare the two unhedged choices. With everything in the 2-year bond, a 1% fall in yields leaves a deficit of 35 832, because the bond barely gains while the liability rises sharply. With everything in the 12-year bond, a 1% rise leaves a deficit of 13 958.

The same two bonds can immunize a different liability. Try 500 000 due in 5 years, still at a flat 5%.

### Worked example: Immunizing a five-year liability with the 2-year and 12-year bonds

1. Present value of the liability.
   $$PV_L = \frac{500\,000}{1.05^{5}}$$ → **391763**
2. Share of the money in the 2-year bond, using $D_S \approx 1.952$ and $D_{Lg} \approx 9.306$.
   $$w = \frac{D_{Lg} - D_L}{D_{Lg} - D_S}$$ → **0.5856**
3. Amount invested in the 2-year bond.
   $$w \cdot PV_L$$ → **229411**
4. Amount invested in the 12-year bond.
   $$(1 - w) \cdot PV_L$$ → **162352**

A shorter liability needs more of the short bond: 59% of the money instead of 31%.

## Why the surplus stays positive

Duration matching removes the first-order term of the surplus. The second-order term comes from the difference in convexity:

$$
\Delta S \approx \tfrac{1}{2}\,(C_A - C_L)\,PV_L\,(\Delta y)^2.
$$

A **barbell** of a short and a long bond spreads its cash flows around the liability date, which gives it more convexity than a single payment at year 7: here $C_A \approx 70.27$ against $C_L \approx 50.79$. The formula predicts a surplus of about 692 for a 1% move in either direction, close to the exact 747 and 642. As long as $C_A \ge C_L$, any small parallel shift leaves a non-negative surplus. The protection is only as good as that assumption: if short and long yields move by different amounts, the barbell can lose.

## Rebalancing

An immunized position does not stay immunized on its own. If yields stay where they are, every duration shortens by one year per year and the match survives. When yields move, the durations of the two bonds change by different amounts, while the liability's does not: after a 1% rise the asset duration is 6.796, after a 1% fall it is 7.205, against $D_L = 7$ in both cases. The fund has to re-solve for $w$ and trade back to the target, and in practice it does so periodically rather than continuously.

In the figure the portfolio holds the face amounts fixed at the start. Drag the shock marker along the track, or use the arrow keys, to shift all yields by up to 300 basis points either way. The two bars show the present values of the assets and of the liability, and the readouts give the surplus and both durations. The small chart below plots the surplus against the shock; the stretches you have dragged across are highlighted. With the duration-matched portfolio the curve is a shallow U that never drops below zero. Switch to "All in the short bond" or "All in the long bond" and the same drag opens a deficit on one side.

*[Interactive figure: immunization shock](https://quantsandbox.dev/guide/fixed-income/immunization)*

## Summary

- A fixed liability is a zero-coupon payment: its duration is its maturity.
- Over a horizon equal to the duration, price risk and reinvestment risk cancel to first order.
- Immunization matches present value and duration; with two bonds, the weight follows from $w\,D_S + (1-w)\,D_{Lg} = D_L$.
- With asset convexity at least that of the liability, small parallel shifts leave a non-negative surplus; non-parallel moves are not covered.
- Durations drift as yields move, so the position must be rebalanced.

> The next lesson, "Spot rates, forward rates and the yield curve", drops the flat curve and lets yields differ by maturity, which is what immunization against parallel shifts leaves exposed.

[Try it in the Immunization Lab](https://quantsandbox.dev/immunization)

## Interactive labs

- [Bond Immunization: Match Duration to a Liability](https://quantsandbox.dev/immunization)
- [Bond Duration & Convexity Approximation](https://quantsandbox.dev/duration-convexity)
- [Bond Pricing Calculator & Price–Yield Curve](https://quantsandbox.dev/bond-pricing)

## Practice questions

### 1. A liability has duration 7. You immunize it with a short bond of duration 2 and a long bond of duration 10. What share of the money goes into the short bond? Answer in percent.

**Answer:** 37.5%

From $w\,D_S + (1 - w)\,D_{Lg} = D_L$: $w = (10 - 7)/(10 - 2) = 0.375$. The closer the liability's duration is to the long bond's, the less goes into the short one.

### 2. A duration-matched barbell has more convexity than the liability ($C_A > C_L$). Yields shift in parallel by a small amount. What happens to the surplus?

- a) It becomes slightly positive whether yields rise or fall.
- b) It stays exactly zero, because the durations match.
- c) It turns positive when yields fall and negative when they rise.
- d) It turns negative in both directions.

**Answer:** a) It becomes slightly positive whether yields rise or fall.

Duration matching removes the first-order term; what is left is $\tfrac{1}{2}(C_A - C_L)\,PV_L\,(\Delta y)^2$, which is positive for either sign of $\Delta y$ when $C_A > C_L$.

---

Source: https://quantsandbox.dev/guide/fixed-income/immunization

Previous lesson: [Bond Duration and Convexity Explained](https://quantsandbox.dev/guide/fixed-income/duration-convexity)

Next lesson: [Spot Rates, Forward Rates and Yield Curve Bootstrapping](https://quantsandbox.dev/guide/fixed-income/yield-curve)
