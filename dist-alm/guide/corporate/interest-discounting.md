# Compound Interest and Discounting Explained

Simple, compound and continuous compounding; present value and the discount factor. Free interactive lesson with worked examples.

Almost every pricing formula in finance compares money at different dates. Before options, portfolios or bonds, we need one tool: a way to move an amount of money forward or backward in time. This lesson builds that tool.

## The time value of money

If you have 100 today, you can put it in a bank account (or buy a government bill) and have more than 100 in a year, with essentially no risk. So 100 today is worth more than 100 promised in a year. The extra amount you are paid for waiting is **interest**, and the rate at which it accrues is the **interest rate** $r$, quoted per year.

Throughout these lessons $r$ means the **risk-free** rate: the rate on a loan that is certain to be repaid. Risky lending earns more, but that extra is compensation for risk, not for time.

## Simple interest

With simple interest you earn $r$ on the original amount only. After $T$ years an initial amount $B_0$ has grown to

$$
B_T = B_0\,(1 + rT).
$$

Growth is linear in time. This is how some short-term money market instruments are quoted, but it ignores the fact that interest already earned could itself earn interest.

## Compound interest

With annual compounding, the interest earned in year one is added to the balance, and in year two you earn interest on the larger amount. After $T$ whole years:

$$
B_T = B_0\,(1 + r)^T.
$$

If interest is credited $m$ times per year, each period pays $r/m$ and there are $mT$ periods:

$$
B_T = B_0\left(1 + \frac{r}{m}\right)^{mT}.
$$

A snowball is a fair picture: the bigger it gets, the more snow it picks up per turn. More frequent compounding gives slightly more growth, because interest starts earning interest sooner.

## Continuous compounding

Let the number of compounding periods $m$ grow without limit. The expression above converges to an exponential:

$$
\lim_{m\to\infty}\left(1 + \frac{r}{m}\right)^{mT} = e^{rT}, \qquad B_T = B_0\,e^{rT}.
$$

Continuous compounding is the convention used in option pricing (Black–Scholes, binomial trees with small steps) because exponentials are easy to multiply and differentiate: growing for $T_1$ and then for $T_2$ is the same as growing for $T_1 + T_2$, since $e^{rT_1}e^{rT_2} = e^{r(T_1+T_2)}$.

The figure compares the three conventions for the same quoted rate. At low rates and short horizons they are almost identical; the gap opens up as $r$ and $T$ grow.

*[Interactive figure: compounding](https://quantsandbox.dev/guide/corporate/interest-discounting)*

## Discounting

Discounting is compounding run backwards. If a payment $C$ arrives at time $T$, its **present value** is the amount you would need to invest today to have exactly $C$ at $T$:

$$
\text{PV} = C\,e^{-rT} \quad\text{(continuous)}, \qquad \text{PV} = \frac{C}{(1+r)^T} \quad\text{(annual)}.
$$

The multiplier $e^{-rT}$ is called the **discount factor**. It is always between 0 and 1 for a positive rate, and it shrinks the further away the payment is.

Example: with $r = 5\%$ and continuous compounding, 100 paid in two years is worth $100\,e^{-0.1} \approx 90.48$ today. Investing 90.48 at 5% for two years gives back exactly 100.

## Converting between conventions

The same growth can be quoted in different conventions. A continuously compounded rate $r_c$ and an annually compounded rate $r_a$ describe the same growth when

$$
e^{r_c} = 1 + r_a \quad\Longleftrightarrow\quad r_c = \ln(1 + r_a).
$$

So 5% continuous is the same as about 5.13% annual. When you compare rates, always check which convention they use.

The same idea converts a rate compounded $m$ times a year into its **effective annual rate**, the annually compounded rate that gives the same growth: $r_{\text{eff}} = (1 + r/m)^m - 1$.

### Worked example: From a monthly quoted rate to a five-year discount factor

1. A savings account quotes 6% a year, compounded monthly. One year of growth is twelve months at 0.5% each; subtract 1 to get the effective annual rate.
   $$r_{\text{eff}} = \left(1 + \tfrac{0.06}{12}\right)^{12} - 1$$ → **6.17%**
2. Discounting over 5 years means dividing by five years of that growth, that is 60 monthly periods.
   $$\left(1 + \tfrac{0.06}{12}\right)^{-60} = (1 + r_{\text{eff}})^{-5}$$ → **0.7414**

## Summary

- Money today is worth more than the same amount later, because it can earn the risk-free rate $r$.
- Compounding moves money forward: $B_T = B_0(1+r)^T$, or $B_0e^{rT}$ in continuous time.
- Discounting moves money back: $\text{PV} = Ce^{-rT}$. The factor $e^{-rT}$ is the discount factor.

> Every later lesson uses the discount factor $e^{-rT}$. Whenever a formula compares a future payment with a price today, this factor is how the two are put on the same footing.

[Work through present and future values in the Time Value of Money lab](https://quantsandbox.dev/tvm)

## Interactive labs

- [Time Value of Money & Compound Interest Calculator](https://quantsandbox.dev/tvm)

## Practice questions

### 1. You invest 100 for 5 years at a quoted rate of 6%. Which convention leaves you with more money at the end?

- a) Annual compounding
- b) Continuous compounding
- c) Both give the same amount
- d) It depends on the starting amount

**Answer:** b) Continuous compounding

Continuous compounding credits interest on interest without delay: $100\,e^{0.3} \approx 134.99$ against $100 \times 1.06^5 \approx 133.82$ with annual compounding.

### 2. A payment of 1,000 arrives in 5 years. With an annually compounded rate of 6%, what is it worth today?

**Answer:** 747.26

$\text{PV} = 1{,}000/1.06^5 = 1{,}000/1.3382 \approx 747.26$.

---

Source: https://quantsandbox.dev/guide/corporate/interest-discounting

Next lesson: [Annuities, Perpetuities and Loan Amortization](https://quantsandbox.dev/guide/corporate/annuities)
