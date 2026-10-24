# Real Rates, Fisher Equation, Inflation-Linked Bonds

The Fisher relation, nominal against real discounting, the breakeven inflation rate and how an inflation-linked bond is priced.

"Interest, compounding and discounting" treated a rate as a plain number: money grows by $r$ each year. In practice the money you get back buys less if prices have risen, so a rate that looks generous can hide a loss. This lesson separates the **nominal** rate, quoted in money, from the **real** rate, measured in purchasing power, and uses the split to price bonds whose payments follow inflation. It builds on "Bond prices and yields" and borrows the idea of a spread from "Credit risk: default probabilities and credit spreads".

## Nominal and real

A **nominal** amount is a number of currency units. A **real** amount is the same money expressed in units of purchasing power, that is, deflated by a price index. If prices rise by a factor $(1+\pi)$ over a year, where $\pi$ is the inflation rate, 100 next year buys what $100/(1+\pi)$ buys today.

Suppose you lend 100 at a nominal rate $i$ for a year and inflation is $\pi$. You receive $100\,(1+i)$ in money, which is worth $100\,(1+i)/(1+\pi)$ in today's purchasing power. The **real rate** $r$ is the growth of purchasing power:

$$
1 + r = \frac{1+i}{1+\pi}.
$$

## The Fisher relation

Rearranged, the definition of the real rate is the **Fisher relation**:

$$
1 + i = (1+r)(1+\pi), \qquad i = r + \pi + r\pi \approx r + \pi.
$$

The approximation $i \approx r + \pi$ drops the cross term $r\pi$, which is small when both rates are small. For $r = 2\%$ and $\pi = 3\%$ the exact nominal rate is $1.02 \times 1.03 - 1 = 5.06\%$, against the approximate 5.00%. At moderate rates the difference is a few hundredths of a percentage point; at high inflation it is not negligible.

## Discounting real cash flows

Both ways of describing a payment are equivalent, provided they are not mixed. **Real cash flows are discounted at the real rate, nominal cash flows at the nominal rate.** A payment that is 100 in today's purchasing power in $t$ years is $100\,(1+\pi)^t$ in money; discounting that at $(1+i)^t = (1+r)^t(1+\pi)^t$ gives $100/(1+r)^t$, the same value as discounting the real amount at $r$.

The classic error is to discount real flows at a nominal rate (or nominal flows at a real rate). The result understates the value of the first by the factor $(1+\pi)^t$ and overstates the second by the same factor. Over 10 years at 3% inflation the factor $1.03^{10} \approx 1.34$ makes the last payment's value wrong by 34%.

## Inflation-linked bonds

An **inflation-linked bond**, or linker, fixes its payments in real terms. Its principal is scaled by the price index, and the coupon is a fixed real rate applied to that scaled principal. With an index factor $(1+\pi)^t$, a real coupon rate $c$ and face value 100, the nominal payment at time $t$ is

$$
100\,c\,(1+\pi)^t \quad (t = 1, \dots, T-1), \qquad 100\,(c+1)\,(1+\pi)^T \ \text{at maturity.}
$$

The price per 100 of indexed principal is then the real flows discounted at the real rate:

$$
P = \sum_{t=1}^{T} \frac{100\,c}{(1+r)^t} + \frac{100}{(1+r)^T}.
$$

The result does not depend on the inflation forecast: by the consistency rule, discounting the indexed nominal flows at the Fisher nominal rate gives the same number. That is the attraction of a linker. Its real value is fixed; a nominal bond's real value changes with inflation.

*[Interactive figure: fisher real rate](https://quantsandbox.dev/guide/fixed-income/real-rates-inflation)*

In the figure, the two bonds are both worth 100 at the expected inflation: the nominal bond has a coupon equal to the Fisher nominal yield, the linker a real coupon equal to the real rate. The chart shows their value in today's purchasing power as realised inflation changes. The linker stays at 100; the nominal bond falls as inflation rises above the expectation, because its coupons and principal are fixed in money. With a real rate of 1%, expected inflation of 3% and realised inflation of 5%, the nominal bond (10 years) is worth 85.17 in real terms.

## Breakeven inflation

The market prices both kinds of bond. The difference between the nominal yield $i$ and the real yield $r$ of bonds of the same maturity is the inflation that would make an investor indifferent, the **breakeven inflation rate**:

$$
\pi_{\text{BE}} = \frac{1+i}{1+r} - 1 \approx i - r.
$$

If a nominal bond yields 4.03% and a linker 1%, the breakeven is $1.0403/1.01 - 1 = 3.00\%$. If actual inflation turns out higher, the linker was the better holding; if lower, the nominal bond. Breakeven inflation is not a pure forecast. Like a credit spread, it is a market price that also contains compensation for risk (inflation uncertainty, differences in liquidity), so it may differ from what investors expect.

## Pricing a linker

Consider a 10-year linker with a 2% real coupon, priced at a real yield of 1%, with inflation of 3% a year. Because the real coupon is above the real yield, the bond trades above its indexed principal. The first nominal coupon is the real coupon scaled by one year of inflation, and the principal is scaled by ten.

### Worked example: A 10-year inflation-linked bond with a 2% real coupon

1. The real annuity factor at 1% over 10 years.
   $$\frac{1 - 1.01^{-10}}{0.01}$$ → **9.4713**
2. Present value of the 2% real coupons per 100 of principal.
   $$2 \times 9.4713$$ → **18.9426**
3. Present value of the indexed principal.
   $$\frac{100}{1.01^{10}}$$ → **90.5287**
4. The price per 100 of indexed principal.
   $$P = 18.9426 + 90.5287$$ → **109.47**
5. The first nominal coupon, with 3% inflation.
   $$100 \times 0.02 \times 1.03$$ → **2.06**
6. The nominal principal repaid at maturity.
   $$100 \times 1.03^{10}$$ → **134.39**

## Summary

- A real amount is a nominal amount deflated by a price index; the real rate is the growth of purchasing power.
- The Fisher relation is $1+i = (1+r)(1+\pi)$; the approximation $i \approx r + \pi$ leaves out the cross term $r\pi$.
- Discount real cash flows at the real rate and nominal cash flows at the nominal rate; never mix them.
- An inflation-linked bond has a fixed real value: its principal and coupons follow the price index, and it is priced by discounting real flows at the real rate.
- Breakeven inflation, the nominal yield against the real yield, is a market price that also contains a risk premium.

[Open the Bond Lab to price a bond at different yields](https://quantsandbox.dev/bond-pricing)

## Interactive labs

- [Bond Pricing Calculator & Price–Yield Curve](https://quantsandbox.dev/bond-pricing)
- [Time Value of Money & Compound Interest Calculator](https://quantsandbox.dev/tvm)

## Practice questions

### 1. The real rate is 2% and expected inflation is 3%. What is the exact nominal rate implied by the Fisher relation, in per cent?

**Answer:** 5.06%

$1 + i = (1+r)(1+\pi) = 1.02 \times 1.03 = 1.0506$, so $i = 5.06\%$. The approximation $r + \pi = 5\%$ leaves out the cross term $r\pi = 0.06\%$.

### 2. Which bond's nominal cash flows rise when inflation turns out higher than expected?

- a) A fixed-coupon nominal bond
- b) An inflation-linked bond
- c) Neither
- d) Both

**Answer:** b) An inflation-linked bond

A linker's principal and coupons are scaled by the price index, so its nominal payments rise with inflation and its real value stays fixed. A nominal bond's payments are fixed in money, so its real value falls.

### 3. A nominal bond yields 4.5% and a linker of the same maturity yields 1.5%. What is the exact breakeven inflation rate, in per cent?

**Answer:** 2.96%

$\pi_{\text{BE}} = 1.045/1.015 - 1 \approx 2.96\%$; the difference of the yields, 3.00%, is a slight overstatement.

---

Source: https://quantsandbox.dev/guide/fixed-income/real-rates-inflation

Previous lesson: [Credit Risk: Default Probability, Credit Spreads and CDS](https://quantsandbox.dev/guide/fixed-income/credit-risk)
