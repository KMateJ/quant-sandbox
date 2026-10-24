# NPV and IRR Explained: Capital Budgeting Basics

Project cash flows, NPV, the NPV profile, IRR, the profitability index and where the IRR misleads. Free interactive lesson with worked examples.

A firm constantly decides which projects to take on: a new machine, a new product line, a new plant. Each project costs money now and is expected to return money later. This lesson turns that comparison into two numbers, the net present value and the internal rate of return, using the discounting from "Interest, compounding and discounting".

## Cash flows of a project

Describe a project by its **cash flows**: the amounts of money it pays out or brings in, by date. Write $CF_t$ for the net cash flow at the end of year $t$, with $t = 0$ meaning today. A typical project has a negative $CF_0$ (the investment) followed by positive cash flows $CF_1, \dots, CF_N$.

Two modelling choices are made here. Cash flows arrive at the end of each year, and the rate used to discount them is quoted with annual compounding. Both match the lab.

## The discount rate

In this lesson $r$ is the **discount rate** of the project: the annual return investors could earn elsewhere on an investment of the same risk. It is also called the *opportunity cost of capital* or the *required return*. It is not a risk-free rate; it is higher, because project cash flows are uncertain.

## Net present value

Discount every cash flow back to today with the annual discount factor $1/(1+r)^t$ and add them up. The result is the **net present value**:

$$
\text{NPV}(r) = CF_0 + \frac{CF_1}{1+r} + \frac{CF_2}{(1+r)^2} + \cdots + \frac{CF_N}{(1+r)^N} = \sum_{t=0}^{N} \frac{CF_t}{(1+r)^t}.
$$

The NPV is the value the project adds today. Investors could reproduce the project's future cash flows in the market for their present value; the project delivers them for the cost $-CF_0$ instead. The difference is a gain (or loss) to the owners.

> NPV rule: accept a project when $\text{NPV} > 0$. Among mutually exclusive projects, choose the one with the highest NPV.

## A project with equal annual cash flows

Consider a project that costs 100 today and pays the same amount $C$ at the end of each of the next $N$ years. The cash flows after $t = 0$ form an **annuity**, and their present value has a closed form. Summing the geometric series gives

$$
\sum_{t=1}^{N} \frac{C}{(1+r)^t} = C \cdot \frac{1 - (1+r)^{-N}}{r}, \qquad \text{NPV}(r) = -100 + C \cdot \frac{1 - (1+r)^{-N}}{r}.
$$

Example: $C = 30$, $N = 5$ and $r = 10\%$.

### Worked example: NPV of a project with equal annual cash flows

1. The annuity factor: the present value of 1 a year for $N$ years.
   $$\frac{1 - (1+r)^{-N}}{r}$$ → **3.7908**
2. Present value of the inflows: $C$ times the annuity factor.
   $$\text{PV} = C \cdot \frac{1 - (1+r)^{-N}}{r}$$ → **113.72**
3. Subtract the investment to get the NPV; it is positive, so the project creates value.
   $$\text{NPV} = -100 + \text{PV}$$ → **13.72**

With $N = 4$ instead, the inflows are worth only about $95.10$ and the NPV is $-4.90$.

## The NPV profile

Plot the NPV against the discount rate. This curve is the **NPV profile**. At $r = 0$ it equals the plain sum of the cash flows ($-100 + 5 \times 30 = 50$ in the example). As $r$ rises, later cash flows are discounted more heavily and the NPV falls. For the example project it is $29.88$ at $5\%$, $13.72$ at $10\%$, $0.56$ at $15\%$ and $-10.28$ at $20\%$.

## Internal rate of return

The **internal rate of return** (IRR) is the discount rate at which the NPV is exactly zero:

$$
\sum_{t=0}^{N} \frac{CF_t}{(1+\text{IRR})^t} = 0.
$$

It is where the NPV profile crosses the horizontal axis. There is no general formula for it; it is found numerically, by trying rates until the NPV changes sign and then narrowing the interval. For the example project the IRR is about $15.24\%$. Read it as the annual return the project itself earns on the money tied up in it.

For a project with one outflow followed by inflows, the profile falls steadily, so the IRR rule agrees with the NPV rule: the NPV is positive exactly when $r < \text{IRR}$.

The figure plots the NPV profile, for rates from 0 to 40%, of a project that costs 100 and pays $C$ per year for $N$ years. Sliders set $C$, $N$ and $r$; the readouts show the NPV at $r$, the IRR and the undiscounted sum of the cash flows. At the default settings ($C = 25$, $N = 5$, $r = 10\%$) the NPV is about $-5.23$ and the IRR about $7.93\%$: the project loses value. Raise $C$, lengthen $N$ or lower $r$ until the NPV crosses zero. Moving $r$ slides along the curve without changing it, so the IRR stays fixed.

*[Interactive figure: npv profile](https://quantsandbox.dev/guide/corporate/npv-irr)*

## Profitability index

The **profitability index** divides the present value of the inflows by the initial investment:

$$
\text{PI} = \frac{\sum_{t=1}^{N} CF_t/(1+r)^t}{-CF_0}.
$$

In the example $\text{PI} = 113.72/100 \approx 1.14$: each unit invested returns 1.14 units of present value. $\text{PI} > 1$ is the same condition as $\text{NPV} > 0$. The index is useful when capital is limited and projects must be ranked by value per unit invested.

## Where the IRR misleads

The IRR is popular because a percentage is easy to communicate, but it can give wrong answers in two situations.

**Mutually exclusive projects.** Project A costs 100 and returns 120 after one year; project B costs 100 and returns 150 after three years. A has an IRR of $20\%$, B only about $14.47\%$. At $r = 10\%$, however, the NPV of A is $120/1.1 - 100 \approx 9.09$, and that of B is $150/1.1^3 - 100 \approx 12.70$. B adds more value. The profiles cross at about $11.80\%$; below that rate the NPV ranking and the IRR ranking disagree, and the NPV ranking is the right one, because it measures value in money, not in percent.

**Cash flows that change sign more than once.** A project with cash flows $-100$, $+230$, $-132$ has NPV zero at both $10\%$ and $20\%$. Its profile rises and then falls, so there are two IRRs and neither is a meaningful rate of return. The NPV at the actual discount rate still answers the question.

In the next figure you build the cash flows yourself. Each darker bar is the cash flow of one year, from year 0 to year 6; drag it up or down to change it. The lighter bar behind it is its present value $CF_t/(1+r)^t$ at the rate $r$, so you can see how much less a later flow is worth today. The readouts give the NPV at $r$, the IRR and the undiscounted sum. The default flows are the project from before, $-100$ now and 25 a year for five years, with NPV $-5.23$ at $10\%$ and an IRR of $7.93\%$. Now drag year 0 to $-40$ and year 6 to $-100$, a project that ends with a clean-up cost. The flows change sign twice, the NPV is zero at about $13.3\%$ and again at about $30.8\%$, and the IRR readout reports several possible IRRs. The NPV is $-1.68$ at $r = 10\%$ and $+1.28$ at $r = 20\%$: whether the project is worth taking depends on the actual discount rate, which only the NPV uses.

*[Interactive figure: cashflow builder](https://quantsandbox.dev/guide/corporate/npv-irr)*

## Summary

- A project is a list of dated cash flows; discount each at the project's discount rate $r$ and add them to get the NPV.
- Accept projects with positive NPV; among exclusive alternatives, take the highest NPV.
- The IRR is the rate at which the NPV is zero, where the NPV profile crosses the axis.
- The profitability index is the present value of the inflows per unit invested; $\text{PI} > 1$ exactly when $\text{NPV} > 0$.
- For ranking exclusive projects and for cash flows that change sign several times, trust the NPV over the IRR.

> A later lesson, "The weighted average cost of capital", estimates the discount rate $r$ that every NPV calculation needs.

[Build project cash flows and explore NPV, IRR and the NPV profile in the NPV & IRR lab](https://quantsandbox.dev/npv-irr)

## Interactive labs

- [NPV & IRR Calculator with NPV Profile](https://quantsandbox.dev/npv-irr)

## Practice questions

### 1. A project costs 100 today, pays nothing after one year and pays 121 after two years. What is its IRR?

**Answer:** 10%

The IRR solves $-100 + 121/(1+\text{IRR})^2 = 0$, so $(1+\text{IRR})^2 = 1.21$ and $\text{IRR} = 10\%$: the rate at which the NPV is exactly zero.

### 2. Two mutually exclusive projects: A has the higher IRR, B has the higher NPV at the firm's discount rate. Which one should the firm take?

- a) A, because its percentage return is higher
- b) B, because it adds more value at the actual discount rate
- c) Either, since both have a positive NPV
- d) Neither, until the IRRs agree

**Answer:** b) B, because it adds more value at the actual discount rate

The NPV measures value in money at the rate the firm actually faces; the IRR ranks percentages and ignores scale and timing. When the two rankings disagree, the NPV is the right one.

---

Source: https://quantsandbox.dev/guide/corporate/npv-irr

Previous lesson: [Annuities, Perpetuities and Loan Amortization](https://quantsandbox.dev/guide/corporate/annuities)

Next lesson: [Project Risk: Sensitivity, Scenarios, Monte Carlo NPV](https://quantsandbox.dev/guide/corporate/capital-budgeting-risk)
