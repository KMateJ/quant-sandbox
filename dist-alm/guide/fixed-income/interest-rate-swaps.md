# Interest Rate Swaps: Valuation and the Par Swap Rate

Fixed and floating legs, the swap as two bonds, the par swap rate from discount factors, valuing an existing swap and DV01.

An interest rate swap is the most traded interest rate derivative. Two parties exchange interest payments on the same amount: one pays a fixed rate, the other a floating rate that is reset every period. This lesson shows that a swap is a pair of bonds in disguise, prices it with the discount factors of "Spot rates, forward rates and the yield curve", and derives the par swap rate. It also uses bond pricing from "Bond prices and yields".

## A plain-vanilla swap

A **plain-vanilla interest rate swap** is fixed by four things:

- a **notional** $N$, the amount on which interest is calculated. It is never exchanged;
- a **fixed rate** $s$, agreed today for the whole life of the swap;
- a **floating rate** $L_i$ for each period, a short-term reference rate observed at the start of the period (the **reset date**) and paid at its end;
- **payment dates** $t_1 < t_2 < \dots < t_n$, with accrual fractions $\tau_i = t_i - t_{i-1}$ in years ($t_0 = 0$).

On each date $t_i$ the **fixed leg** pays $N s\,\tau_i$ and the **floating leg** pays $N L_i\,\tau_i$. In practice only the difference changes hands. The party that pays fixed and receives floating holds a **payer swap**; the other side holds a **receiver swap**. Throughout this lesson payments are annual, so $\tau_i = 1$, but the formulas keep $\tau_i$ so they work for any frequency.

## The swap as two bonds

Add a fictitious exchange of the notional $N$ at maturity $t_n$ on both legs. The two exchanges cancel, so the swap is unchanged. Now each leg is a bond:

- the fixed leg is a **fixed-rate bond** with face value $N$ and coupon $s\,\tau_i$ per period;
- the floating leg is a **floating-rate note** (FRN), a bond whose coupon is the floating rate of each period.

A receiver swap is therefore long the fixed-rate bond and short the FRN, and a payer swap is the reverse. Its value is the difference of two bond prices:

$$
V_{\text{receiver}} = B_{\text{fix}} - B_{\text{float}}, \qquad V_{\text{payer}} = B_{\text{float}} - B_{\text{fix}}.
$$

## The floating-rate note on a reset date

Assume the floating rate $L_i$ is the market rate for lending from $t_{i-1}$ to $t_i$, the same rate the discount factors are built from. Then an FRN is worth exactly its face value on every reset date. Work backwards from the end:

1. At the last reset date $t_{n-1}$ the note will pay $N(1 + L_n\tau_n)$ at $t_n$. Discounting one period at the same rate $L_n$ gives $N(1 + L_n\tau_n)/(1 + L_n\tau_n) = N$.
2. At $t_{n-2}$ the note pays the coupon $N L_{n-1}\tau_{n-1}$ at $t_{n-1}$ and is then worth $N$. Together that is $N(1 + L_{n-1}\tau_{n-1})$, which again discounts to $N$.
3. Repeating the argument back to today gives $B_{\text{float}} = N$ at $t_0 = 0$.

The intuition: the coupon always pays the current market rate, so the note never trades away from par at a reset. Between reset dates its value moves only a little, because the next coupon is already fixed.

## The fixed leg and the par swap rate

Write $P(0,t)$ for the discount factor, the price today of 1 paid at $t$. The fixed-rate bond is a set of known cash flows, so

$$
B_{\text{fix}} = N s \sum_{i=1}^{n} \tau_i\,P(0,t_i) + N\,P(0,t_n).
$$

The sum $A = \sum_i \tau_i P(0,t_i)$ is the **annuity factor**: the value today of receiving 1 per year on the payment dates. A new swap is agreed at the fixed rate that makes it worth zero to both sides, $B_{\text{fix}} = B_{\text{float}} = N$. Dividing by $N$ and solving for that rate gives the **par swap rate** $S_n$ of an $n$-period swap:

$$
S_n = \frac{1 - P(0,t_n)}{\sum_{i=1}^{n} \tau_i\,P(0,t_i)} = \frac{1 - P(0,t_n)}{A}.
$$

> The par swap rate is the coupon of a bond priced at par: $S_n = (1 - P(0,t_n))/A$, where $A = \sum_i \tau_i P(0,t_i)$ is the annuity factor.

## A three-year example

Take annual payments and the discount factors $P(0,1) = 0.9589$, $P(0,2) = 0.9160$ and $P(0,3) = 0.8730$. They come from an upward-sloping curve with annually compounded zero rates of about 4.28%, 4.49% and 4.63%, via $P(0,t) = (1 + r(t))^{-t}$; this is the default curve of the figure below. The annuity factor is $A = 0.9589 + 0.9160 + 0.8730 = 2.7479$, and

$$
S_3 = \frac{1 - 0.8730}{2.7479} = \frac{0.1270}{2.7479} \approx 4.62\%.
$$

Check: a bond paying 4.62 per year on 100 for three years is worth $4.62 \cdot 2.7479 + 100 \cdot 0.8730 \approx 100.0$, so it trades at par, as it should.

The one-year forward rates implied by these discount factors are $f_i = P(0,t_{i-1})/P(0,t_i) - 1$: about 4.28%, 4.69% and 4.92%. The par swap rate lies between them. It is their average weighted by the discount factors, $S_n = \sum_i \tau_i P(0,t_i)\,f_i / A$, which follows from $1 - P(0,t_n) = \sum_i \big(P(0,t_{i-1}) - P(0,t_i)\big)$.

## The value of an existing swap

After a swap is agreed, rates move and its value is no longer zero. Suppose right after the trade above the whole curve shifts up by half a percentage point, and the discount factors become $0.9543$, $0.9073$ and $0.8606$. The new annuity factor is $A' = 2.7222$, and the new par rate is $S_3' = 0.1394/2.7222 \approx 5.12\%$.

Consider the payer swap with notional $N = 10{,}000{,}000$ that pays the contracted rate $s = S_3 \approx 4.62\%$. The floating leg is still worth $N$; the fixed leg is now worth less. Its value is

$$
V_{\text{payer}} = N\big[(1 - P(0,t_n)) - s\,A'\big] = N\,(S_n' - s)\,A' \approx 10{,}000{,}000 \times 0.00499 \times 2.7222 \approx 135{,}900.
$$

The payer gains because it locked in paying 4.62% when the market rate for the same swap is now 5.12%. The second form is worth remembering: an existing swap is worth the difference between the current and the contracted swap rate, paid on the annuity.

The same formula gives the swap's sensitivity. A change of one basis point (0.01%) in the swap rate changes the value by about $N A \times 0.0001$. This is the swap's **DV01**, here $10{,}000{,}000 \times 2.7222 \times 0.0001 \approx 2{,}722$. It plays the role that duration played in "Duration and convexity".

The figure lays out this swap's cash flows on a timeline. Each year the payer receives the floating payment, an upward arrow of length $N f_i$ (its expected value, from the forward rate), and pays the fixed payment $N s$, a downward arrow. The solid part of each arrow is its present value and the faded rest is the discount. Hover over, focus or tap a payment to see its amount, its discount factor $P(0,t_i)$ and the multiplication that gives its present value. On today's curve the two legs are worth the same, so the swap is worth 0. Then switch the curve to +50 bp and note that only the floating arrows grow, because the fixed rate was agreed at 4.62%; the value to the payer becomes about 135,800, the number computed above. The small gap to 135,900 comes from rounding the swap rates.

*[Interactive figure: swap timeline](https://quantsandbox.dev/guide/fixed-income/interest-rate-swaps)*

Now let the curve fall instead: the whole zero curve moves down by half a percentage point, and the discount factors become $0.9635$, $0.9248$ and $0.8856$.

### Worked example: The same payer swap after a 50 bp fall

1. New annuity factor.
   $$A' = \sum_{i=1}^{3} P'(0,t_i)$$ → **2.7739**
2. New three-year par swap rate.
   $$S_3' = \frac{1 - P'(0,t_3)}{A'}$$ → **4.124%**
3. Value to the payer, who still pays $s = 4.62\%$ (more precisely 4.622%) on $N = 10{,}000{,}000$.
   $$V_{\text{payer}} = N\,(S_3' - s)\,A'$$ → **-138100**
4. DV01 on the new curve.
   $$N\,A' \times 0.0001$$ → **2774**

The loss on a fall is a little larger than the gain on a rise of the same size, because the annuity factor is larger when rates are lower.

## Uses of swaps

- **Changing the type of debt.** A firm that issued a fixed-rate bond and enters a receiver swap receives fixed and pays floating, so in total it pays a floating rate. A payer swap turns floating-rate debt into fixed.
- **Hedging interest rate risk.** A bank whose assets are long fixed-rate loans can pay fixed on a swap so that a rise in rates no longer hurts it.
- **Expressing a view on rates.** A payer swap gains when rates rise and a receiver swap gains when they fall, without buying or selling any bonds.

## Par swap rates and the zero curve

The figure uses a smooth zero curve $r(t) = \text{level} + \text{slope}\,(1 - e^{-t/3})$ with annual compounding, so $P(0,t) = (1 + r(t))^{-t}$, the same convention as the annual fixed payments. The **level** is the rate at the short end ($r(0) = \text{level}$), and the **slope** is how far the long end lies above it: as $t$ grows, $r(t)$ approaches level + slope. For each maturity $n$ from 1 to 10 years it draws the zero rate $r(n)$ and the par swap rate $S_n$. The readouts give the 5-year par swap rate, the 5-year annuity factor, the DV01 of a 5-year swap per 1,000,000 of notional and the 10-year par swap rate. At the defaults (level 4%, slope +1 percentage point) the 5-year swap rate is about 4.79% against a 5-year zero rate of 4.81%, the annuity factor is 4.3695, the DV01 about 437 and the 10-year swap rate 4.94% against a zero rate of 4.96%. Set the slope to zero: with a flat curve the par swap rate equals the zero rate at every maturity. With a rising curve the swap rate lies slightly below the zero rate of the same maturity, because it weights the early, lower forward rates more heavily; in the example above $S_3 \approx 4.62\%$ against a 3-year zero rate of 4.63%. Make the slope negative and the swap rate lies slightly above.

*[Interactive figure: swap rate](https://quantsandbox.dev/guide/fixed-income/interest-rate-swaps)*

## Summary

- A swap exchanges fixed payments $N s\tau_i$ for floating payments $N L_i\tau_i$ on a notional that is never exchanged.
- A receiver swap is a long fixed-rate bond and a short floating-rate note; the note is worth par on every reset date.
- The par swap rate is $S_n = (1 - P(0,t_n))/A$ with the annuity factor $A = \sum_i \tau_i P(0,t_i)$.
- An existing payer swap paying $s$ is worth $N(S_n' - s)A'$, and its DV01 is about $N A \times 0.0001$.

[Shape the curve whose discount factors price the swap in the Yield Curve lab](https://quantsandbox.dev/yield-curve)

## Interactive labs

- [Yield Curve Bootstrapping, Spot & Forward Rates](https://quantsandbox.dev/yield-curve)

## Practice questions

### 1. Annual payments, discount factors $P(0,1) = 0.96$ and $P(0,2) = 0.92$. What is the two-year par swap rate? Answer in percent.

**Answer:** 4.255%

$S_2 = (1 - 0.92)/(0.96 + 0.92) = 0.08/1.88 \approx 4.26\%$: one minus the last discount factor, over the annuity factor.

### 2. You entered a payer swap (you pay fixed, receive floating) at the par rate. The next day the whole curve falls. What is your swap worth now?

- a) Less than zero: you pay a fixed rate above the new par rate.
- b) More than zero: lower rates make the fixed payments cheaper to discount.
- c) Exactly zero: the floating leg stays at par.
- d) It depends on the notional, not on rates.

**Answer:** a) Less than zero: you pay a fixed rate above the new par rate.

$V_{\text{payer}} = N\,(S_n' - s)\,A'$ and $S_n' < s$ after a fall, so the value is negative. The floating leg does stay at par, but the fixed leg you owe is now worth more.

---

Source: https://quantsandbox.dev/guide/fixed-income/interest-rate-swaps

Previous lesson: [Treasury Bond Futures: Conversion Factors and CTD](https://quantsandbox.dev/guide/fixed-income/treasury-futures)

Next lesson: [Callable Bonds, Yield to Call and Negative Convexity](https://quantsandbox.dev/guide/fixed-income/callable-bonds)
