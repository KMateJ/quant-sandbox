# Credit Risk: Default Probability, Credit Spreads and CDS

Hazard rates, survival probabilities, recovery, pricing defaultable bonds and the CDS spread. Free interactive lesson with worked examples.

Every bond in this track so far was assumed to pay exactly what it promised. A company, unlike a government that borrows in its own currency, can fail to pay. This lesson models that risk with one number per year, the hazard rate, prices a zero-coupon bond that may default, and shows where the extra yield on corporate bonds, the credit spread, comes from. It uses the discounting of "Interest, compounding and discounting", the yields of "Bond prices and yields" and the continuously compounded zero yields of "Spot rates, forward rates and the yield curve", and ends with the credit default swap, a close relative of the contracts in "Interest rate swaps".

## Default and the default time

An issuer **defaults** when it misses a payment it owes. We describe default by a random **default time** $\tau$: the date at which the issuer fails. If $\tau > T$, the issuer is still paying at $T$ and a bond maturing at $T$ is repaid in full. If $\tau \le T$, the bond is not repaid in full.

The model rests on three assumptions, stated once here: the risk-free rate $r$ is constant and continuously compounded; default is independent of interest rates; and a single parameter, the hazard rate, describes how likely default is.

## Hazard rate and survival probability

The **hazard rate** (or **default intensity**) $\lambda$ is the probability of default per unit of time, given that the issuer has survived so far. Over a short interval $dt$,

$$
\mathbb{P}(t < \tau \le t + dt \mid \tau > t) = \lambda\,dt.
$$

Let $Q(t) = \mathbb{P}(\tau > t)$ be the **survival probability** up to $t$. To survive until $t + dt$, the issuer must survive until $t$ and then not default in the next $dt$:

$$
Q(t + dt) = Q(t)\,(1 - \lambda\,dt) \quad\Longrightarrow\quad \frac{dQ}{dt} = -\lambda\,Q(t), \qquad Q(0) = 1.
$$

For a constant $\lambda$ the solution is an exponential, and the **cumulative default probability** is its complement:

$$
Q(T) = e^{-\lambda T}, \qquad \mathbb{P}(\tau \le T) = 1 - e^{-\lambda T}.
$$

This is the same algebra as continuous discounting: survival decays at rate $\lambda$ just as a discount factor decays at rate $r$. A fair picture is a light bulb with no memory: whatever its age, the chance it fails in the next hour is the same. For small $\lambda T$, $1 - e^{-\lambda T} \approx \lambda T$, so a hazard rate of 2% means roughly a 2% chance of default per year.

## Recovery and loss given default

Default rarely wipes out a bond. Creditors usually recover part of what they are owed from the issuer's remaining assets. The **recovery rate** $R$ is the fraction of face value recovered, and $1 - R$ is the **loss given default**. Recovery for senior unsecured corporate bonds is often around 40%, which is why $R = 40\%$ is a common default value.

We need to say when the recovery is paid. Here we assume **recovery of face paid at maturity**: if the issuer defaults before $T$, the holder receives $R$ per unit of face at $T$. This keeps the payoff on a single date and makes the price easy to write down.

## Pricing a defaultable zero-coupon bond

A risky zero-coupon bond with face 1 maturing at $T$ pays 1 if $\tau > T$ and $R$ if $\tau \le T$. As in every pricing problem, the price is the discounted expected payoff with probabilities that make prices consistent (the risk-neutral probabilities of "Risk-neutral probabilities"; more on this below). Because default is independent of rates, the discount factor $e^{-rT}$ comes out of the expectation:

$$
P_{\text{risky}} = e^{-rT}\Big[\,Q(T)\cdot 1 + \big(1 - Q(T)\big)\cdot R\,\Big] = e^{-rT}\Big[e^{-\lambda T} + \big(1 - e^{-\lambda T}\big)R\Big].
$$

Two checks: with $\lambda = 0$ the bond never defaults and the price is the risk-free $e^{-rT}$; with $R = 1$ default costs nothing and the price is again $e^{-rT}$.

## Credit spread

The continuously compounded yield of the risky zero is defined exactly as in "Spot rates, forward rates and the yield curve": $y = -\ln P_{\text{risky}}/T$. The **credit spread** is the extra yield over the risk-free rate:

$$
s(T) = y - r = -\frac{1}{T}\ln\Big[e^{-\lambda T} + \big(1 - e^{-\lambda T}\big)R\Big] = -\frac{1}{T}\ln\Big[1 - (1 - R)\big(1 - e^{-\lambda T}\big)\Big].
$$

The risk-free rate has dropped out: under these assumptions the spread depends only on $\lambda$, $R$ and $T$. If $R = 0$, the bracket is $e^{-\lambda T}$ and the spread is exactly $\lambda$.

## The credit triangle

For small $\lambda T$, use $1 - e^{-\lambda T} \approx \lambda T$ and $\ln(1 - x) \approx -x$ for small $x$:

$$
s(T) \approx -\frac{1}{T}\ln\big[1 - (1 - R)\lambda T\big] \approx \frac{(1 - R)\lambda T}{T} = \lambda\,(1 - R).
$$

This is the **credit triangle**: spread, hazard rate and loss given default, any two of which give the third. In words, the spread pays for the expected loss per year: the chance of default per year times the fraction lost. The approximation is good when $\lambda T$ is small (a few percent) and exact when $R = 0$; for high hazard rates or long maturities the exact spread falls below $\lambda(1 - R)$.

> Credit triangle: $s \approx \lambda\,(1 - R)$. The spread is the expected loss rate: hazard rate times loss given default.

## Worked example

Take $\lambda = 2\%$, $R = 40\%$, $r = 3\%$ and $T = 5$ years.

### Worked example: Price and credit spread of a five-year risky zero

1. Survival probability to five years.
   $$Q(5) = e^{-0.02 \cdot 5} = e^{-0.1}$$ → **0.9048**
2. Default probability over the five years, in percent.
   $$1 - Q(5)$$ → **9.52%**
3. Price per unit of face: survival pays 1, default pays $R = 0.4$ at maturity; discount with $e^{-0.15} \approx 0.8607$, the risk-free price.
   $$P_{\text{risky}} = e^{-0.15}\,\big[Q(5) + (1 - Q(5)) \cdot 0.4\big]$$ → **0.8116**
4. Continuously compounded yield of the risky zero.
   $$y = -\ln P_{\text{risky}}/5$$ → **4.176%**
5. Credit spread over the risk-free 3%; in basis points about 118.
   $$s(5) = y - r$$ → **1.176%**
6. The credit triangle, within about 2.4 basis points of the exact spread.
   $$\lambda(1 - R) = 0.02 \cdot 0.6$$ → **1.2%**

With $\lambda = 10\%$ instead, the 5-year exact spread is about 5.39% while the triangle gives 6%: the approximation degrades as $\lambda T$ grows.

## Spread against maturity

The figure has sliders for the hazard rate $\lambda$ (0% to 10%, default 2%), the recovery rate $R$ (0% to 80%, default 40%) and the risk-free rate $r$ (0% to 8%, default 3%). It plots the risk-free zero yield and the risky zero yield against maturity from 0.25 to 10 years. The readouts show the 5-year survival probability, the 5-year credit spread, the CDS premium $\lambda(1 - R)$ and the 5-year risky zero-coupon price; at the defaults these are 90.48%, 1.18%, 1.20% and 0.8116. Set $R$ to its maximum and note how the gap narrows; a recovery of 100% (the formula's limit) would remove the spread entirely. Raise $\lambda$ and the risky curve moves up. Note also that for a constant $\lambda$ the spread is nearly flat in maturity, drifting down slightly at long maturities where $\lambda T$ is no longer small.

*[Interactive figure: credit spread](https://quantsandbox.dev/guide/fixed-income/credit-risk)*

## Risk-neutral and historical default probabilities

Reading the triangle backwards, a market spread $s$ and an assumed recovery $R$ imply a hazard rate $\lambda = s/(1 - R)$. This implied $\lambda$ is a **risk-neutral** default intensity: the one that makes the formula match market prices. It is typically well above the **historical** default rate observed for similar issuers. The spread is not only expected loss: investors also demand a premium for bearing default risk, which tends to strike in bad times for everyone, and for holding bonds that are harder to sell than government bonds (a liquidity premium). For pricing and hedging, use the implied $\lambda$; for forecasting actual losses, use historical rates.

## Credit default swaps

A **credit default swap** (CDS) is insurance against the default of a reference issuer. The **protection buyer** pays a fixed premium $s_{\text{CDS}}$ per year on a notional until maturity or default, whichever comes first. If the issuer defaults, the **protection seller** pays $1 - R$ per unit of notional. Like the swaps of "Interest rate swaps", the fair premium sets the present values of the two legs equal. With continuous premium payments, constant $\lambda$ and $r$, and the protection paid at the moment of default:

$$
s_{\text{CDS}}\int_0^T e^{-(r+\lambda)t}\,dt = (1 - R)\int_0^T \lambda\,e^{-(r+\lambda)t}\,dt \quad\Longrightarrow\quad s_{\text{CDS}} = \lambda\,(1 - R).
$$

Here $e^{-\lambda t}$ is the probability the premium is still being paid at $t$, and $\lambda e^{-\lambda t}\,dt$ the probability of default in $[t, t + dt]$. In this setting the triangle holds exactly for the CDS; the bond spread of 1.176% in the example differs slightly because its recovery is paid at maturity rather than at default. In practice, CDS premiums quoted for several maturities are turned into a term structure of hazard rates by bootstrapping, one maturity at a time, just as spot rates were extracted from bond prices.

## Summary

- The hazard rate $\lambda$ is the default probability per unit time given survival; for constant $\lambda$ the survival probability is $e^{-\lambda T}$.
- With recovery $R$ of face paid at maturity, $P_{\text{risky}} = e^{-rT}[e^{-\lambda T} + (1 - e^{-\lambda T})R]$.
- The credit spread is approximately $\lambda(1 - R)$, accurate when $\lambda T$ is small; at $\lambda = 2\%$, $R = 40\%$ the 5-year spread is 1.176% against 1.20%.
- Implied (risk-neutral) hazard rates exceed historical default rates because spreads also contain risk and liquidity premia.
- A CDS exchanges a premium for a payment of $1 - R$ on default; its fair premium is about $\lambda(1 - R)$.

[Price bonds and compare yields in the Bond Pricing lab](https://quantsandbox.dev/bond-pricing)

## Interactive labs

- [Bond Pricing Calculator & Price–Yield Curve](https://quantsandbox.dev/bond-pricing)
- [Yield Curve Bootstrapping, Spot & Forward Rates](https://quantsandbox.dev/yield-curve)

## Practice questions

### 1. A bond trades at a credit spread of 150 basis points. Assuming a recovery rate of 40%, what hazard rate does the credit triangle imply? Answer in percent per year.

**Answer:** 2.5%

$\lambda \approx s/(1 - R) = 1.5\%/0.6 = 2.5\%$ per year. Over five years this means a default probability of $1 - e^{-0.125} \approx 11.75\%$.

### 2. Hazard rates implied by market spreads are usually well above the historical default rates of similar issuers. Why?

- a) Historical data always undercount defaults.
- b) The spread also pays investors for bearing default risk and for lower liquidity.
- c) The credit triangle overstates $\lambda$ whenever $R > 0$.
- d) Risk-neutral probabilities ignore recovery.

**Answer:** b) The spread also pays investors for bearing default risk and for lower liquidity.

The spread is the expected loss plus a risk premium (defaults cluster in bad times) and a liquidity premium. Dividing the whole spread by $1 - R$ therefore gives a risk-neutral $\lambda$ above the historical default rate.

---

Source: https://quantsandbox.dev/guide/fixed-income/credit-risk

Previous lesson: [Callable Bonds, Yield to Call and Negative Convexity](https://quantsandbox.dev/guide/fixed-income/callable-bonds)

Next lesson: [Real Rates, Fisher Equation, Inflation-Linked Bonds](https://quantsandbox.dev/guide/fixed-income/real-rates-inflation)
