# Annuities, Perpetuities and Loan Amortization

Present value of level payments, growing perpetuities, loan payments and the amortization schedule. Free interactive lesson with worked examples.

Many financial contracts pay the same amount at regular intervals: a pension, a lease, a bond's coupons, the instalments of a mortgage. Valuing them one payment at a time works, but it is slow and hides the structure. This lesson derives closed formulas for such streams, using the discounting from "Interest, compounding and discounting", and applies them to the repayment of a loan.

Throughout the lesson payments are made once a year, the rate $r$ is compounded annually, and the first payment arrives one year from today unless stated otherwise.

## Ordinary annuities

An **annuity** is a stream of $n$ equal payments $C$ at the ends of years $1, 2, \dots, n$. Its present value is the sum of the discounted payments:

$$
\text{PV} = \frac{C}{1+r} + \frac{C}{(1+r)^2} + \cdots + \frac{C}{(1+r)^n}.
$$

This is a geometric series with first term $C/(1+r)$ and ratio $q = 1/(1+r)$. Using $a + aq + \cdots + aq^{n-1} = a\,(1 - q^n)/(1 - q)$ and simplifying gives

$$
\text{PV} = C \cdot \frac{1 - (1+r)^{-n}}{r}.
$$

The fraction is the **annuity factor**: the present value of 1 a year for $n$ years. Compounding the present value forward by $n$ years gives the **future value** at the date of the last payment:

$$
\text{FV} = \text{PV}\,(1+r)^n = C \cdot \frac{(1+r)^n - 1}{r}.
$$

Example: 1,000 a year for 10 years at $r = 6\%$. The annuity factor is $(1 - 1.06^{-10})/0.06 \approx 7.3601$, so $\text{PV} \approx 7{,}360.09$ and $\text{FV} \approx 13{,}180.79$. The ten payments add up to 10,000, but they are worth only 7,360.09 today, because most of them arrive years from now.

## Annuities due

If each payment is made at the start of the year instead of the end, as with rent, the stream is an **annuity due**. Every payment arrives one year earlier, so every discounted term is multiplied by $(1+r)$:

$$
\text{PV}_{\text{due}} = (1+r) \cdot C \cdot \frac{1 - (1+r)^{-n}}{r}.
$$

In the example, $1.06 \times 7{,}360.09 \approx 7{,}801.69$.

## Perpetuities

A **perpetuity** pays $C$ every year forever. Letting $n \to \infty$ in the annuity formula, $(1+r)^{-n} \to 0$, so

$$
\text{PV} = \frac{C}{r}.
$$

A **growing perpetuity** pays $C$ after one year and grows at the constant rate $g$ after that: $C$, $C(1+g)$, $C(1+g)^2$, and so on. The series is again geometric, with ratio $(1+g)/(1+r)$, and it converges only when $g < r$:

$$
\text{PV} = \frac{C}{r - g}, \qquad g < r.
$$

At $r = 6\%$, a perpetuity of 1,000 is worth $1{,}000/0.06 \approx 16{,}666.67$. If the payment grows by 2% a year, it is worth $1{,}000/0.04 = 25{,}000$. The growing perpetuity is the formula behind the terminal value in company valuation.

> Annuity factor $(1 - (1+r)^{-n})/r$, perpetuity $C/r$, growing perpetuity $C/(r - g)$ for $g < r$. Each is a geometric sum of discounted payments.

## The payment on a loan

A level-payment loan of amount $L$ over $n$ years is an annuity seen from the lender's side: the lender pays $L$ today and receives $n$ equal payments $C$. The loan is fairly priced when the present value of the payments equals $L$, so

$$
C = \frac{L}{\dfrac{1 - (1+r)^{-n}}{r}} = \frac{L\,r}{1 - (1+r)^{-n}}.
$$

Example: a loan of 200,000 at 6% over 10 years. The annuity factor is 7.3601, so the annual payment is $200{,}000 / 7.3601 \approx 27{,}173.59$. Over the life of the loan the borrower pays $10 \times 27{,}173.59 \approx 271{,}735.92$, of which 71,735.92 is interest.

## The amortization schedule

Each payment is split in two. The **interest** part is the rate times the balance still owed at the start of the year. The rest of the payment is **principal** and reduces the balance:

$$
I_t = r\,B_{t-1}, \qquad P_t = C - I_t, \qquad B_t = B_{t-1} - P_t.
$$

For the loan above, with $B_0 = 200{,}000$, $r = 6\%$ and $C = 27{,}173.59$, the first two rows of the schedule are:

### Worked example: The first two years of the amortization schedule

1. Interest in year 1: the rate times the opening balance.
   $$I_1 = r\,B_0$$ → **12000**
2. The rest of the payment repays principal.
   $$P_1 = C - I_1$$ → **15173.59**
3. Balance still owed at the end of year 1.
   $$B_1 = B_0 - P_1$$ → **184826.41**
4. Interest in year 2 is smaller, because the balance is smaller.
   $$I_2 = r\,B_1$$ → **11089.58**
5. So more of the same payment goes to principal.
   $$P_2 = C - I_2$$ → **16084.01**
6. Balance at the end of year 2.
   $$B_2 = B_1 - P_2$$ → **168742.4**

## Solving for the term

The same equation can be turned around. If the borrower can afford a payment $C$, the number of years needed to repay $L$ follows from $L = C\,(1 - (1+r)^{-n})/r$ by taking logarithms:

$$
n = -\frac{\ln\left(1 - \dfrac{L\,r}{C}\right)}{\ln(1+r)}.
$$

Paying 20,000 a year on the 200,000 loan at 6% gives $n = -\ln(1 - 0.6)/\ln 1.06 \approx 15.73$ years, so in practice 16 payments, the last one smaller. The formula also shows a limit: if $C \le L\,r = 12{,}000$, the payment does not even cover the first year's interest and the loan is never repaid. Solving for the rate instead has no closed form; it is found numerically, exactly like the internal rate of return in the next lesson.

## How the payments change

The payment stays the same, but its make-up shifts. Early on the balance is large, so most of the payment is interest; as the balance falls, the interest part shrinks and the principal part grows. By construction the balance reaches exactly zero with the last payment.

The figure draws the whole schedule. Each bar is one year's payment, split into interest (bottom) and principal (top); the dashed line is the balance left at the end of each year, on the right-hand axis. Click a year, or move to it with Tab and press Enter, to see that row of the schedule worked out below the chart. Start with year 1 at the defaults (10 years, 6%), then switch the term to 30 years: the payment falls to about 14,530, but 82.6% of the first payment is now interest, and total interest rises to more than the loan itself.

*[Interactive figure: amortization schedule](https://quantsandbox.dev/guide/corporate/annuities)*

## Summary

- An annuity of $C$ for $n$ years is worth $C\,(1 - (1+r)^{-n})/r$ today; an annuity due is worth $(1+r)$ times as much.
- A perpetuity is worth $C/r$, and a growing perpetuity $C/(r - g)$ as long as $g < r$.
- A level loan payment is the loan amount divided by the annuity factor.
- Each payment is interest on the opening balance plus principal; early payments are mostly interest, and longer terms shift the mix further towards interest.

> The next lesson, "Net present value and internal rate of return", values projects whose cash flows are not level, by discounting each one separately with the same tools.

[Try regular contributions and compound growth in the Time Value of Money lab](https://quantsandbox.dev/tvm)

## Interactive labs

- [Time Value of Money & Compound Interest Calculator](https://quantsandbox.dev/tvm)

## Practice questions

### 1. A stream pays 500 one year from now and then grows by 3% a year forever. At a discount rate of 8%, what is it worth today?

**Answer:** 10000

A growing perpetuity is worth $C/(r - g) = 500/(0.08 - 0.03) = 10{,}000$. The first payment, not today's, goes in the numerator.

### 2. A loan of 100,000 carries 5% interest a year. Which annual payment can never repay it, however long the term?

- a) 4,500
- b) 6,000
- c) 10,000
- d) 12,950

**Answer:** a) 4,500

The first year's interest is $L\,r = 5{,}000$. A payment of 4,500 does not even cover it, so the balance grows every year; any payment above 5,000 repays the loan eventually.

---

Source: https://quantsandbox.dev/guide/corporate/annuities

Previous lesson: [Compound Interest and Discounting Explained](https://quantsandbox.dev/guide/corporate/interest-discounting)

Next lesson: [NPV and IRR Explained: Capital Budgeting Basics](https://quantsandbox.dev/guide/corporate/npv-irr)
