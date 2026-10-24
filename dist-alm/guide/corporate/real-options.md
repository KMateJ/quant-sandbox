# Real Options Valuation: Delay, Expand and Abandon

Options to delay, expand and abandon a project, valued on a binomial tree, and the expanded NPV. Free interactive lesson with worked examples.

The lessons "Net present value and internal rate of return" and "Discounted cash flow valuation" valued a project as if its plan were fixed today. Real managers can wait, expand, scale down or stop as information arrives. This lesson values that flexibility with the binomial tree from "Multi-step trees and backward induction" and the early-exercise logic from "American options and early exercise".

## Flexibility in investment decisions

The static NPV rule compares the present value $V$ of a project's cash flows with the investment $I$ and accepts when $V - I > 0$. It treats the decision as **now or never**: invest today on the current plan, or drop the project for good. Most real projects are not like that. A firm holding a licence or a plot of land can usually **delay** the investment, **expand** capacity if demand turns out strong, **abandon** the project and sell the assets if it goes badly, or **switch** inputs or outputs. Each of these is a right without an obligation, so each has the payoff shape of an option. Such options on real assets are called **real options**.

## Mapping a project to an option

Take the right to invest in a project. Exercising it means paying $I$ and receiving a project worth $V$, so the payoff is $(V - I)^+$, the payoff of a call. The pieces translate as follows:

- Underlying: the present value $V$ of the project's cash flows, the quantity a DCF valuation produces.
- Strike: the investment cost $I$.
- Maturity $T$: how long the opportunity stays open (a licence period, a patent life, a lease on land).
- Volatility $\sigma$: the uncertainty of $V$, how much the project's value can change per year.
- Dividend yield $\delta$: the cash flows the project would already pay while the firm is waiting, as a yield on $V$. They are lost by waiting.

Since the firm can invest at any date up to $T$, the option to delay is an **American call** on $V$ with strike $I$.

## When waiting pays

With $\delta = 0$ the argument from "American options and early exercise" carries over. Investing at time $t$ gives $V_t - I$, while keeping the right is worth at least $V_t - Ie^{-r(T-t)}$, which is larger: waiting delays the payment of $I$ and keeps the protection against a fall in $V$. So with no forgone cash flows it is never optimal to invest before $T$.

With $\delta > 0$ waiting has a cost. A project already running pays roughly $\delta V$ per year, and a firm that waits receives none of it. When the project is deep in the money, a fall below $I$ is unlikely, so the protection is worth little, while the forgone cash flow $\delta V$ is large because $V$ is large. Then investing at once beats waiting, exactly as a large dividend can make early exercise of an American call optimal.

## Valuation on a binomial tree

Split $[0, T]$ into $n$ steps of length $\Delta t = T/n$. As in "Multi-step trees and backward induction", $V$ moves up by $u = e^{\sigma\sqrt{\Delta t}}$ or down by $d = 1/u$ in each step. The forgone cash flows lower the risk-neutral growth of $V$ from $r$ to $r - \delta$, so the risk-neutral probability is

$$
q = \frac{e^{(r-\delta)\Delta t} - d}{u - d}.
$$

At maturity the value of the opportunity is $(V_T - I)^+$. At every earlier node the firm compares investing now with waiting one more step, and backward induction keeps the better of the two:

$$
F = \max\Big(V - I,\; e^{-r\Delta t}\big[q\,F_{\text{up}} + (1-q)\,F_{\text{down}}\big]\Big).
$$

The value $F_0$ at the root is the value of the investment opportunity, called the **expanded NPV**. A now-or-never decision is worth $\max(V_0 - I, 0)$, since a project with negative NPV is simply rejected. The difference is the value of flexibility.

> Expanded NPV = now-or-never value + value of flexibility, where the now-or-never value is $\max(V_0 - I, 0)$. Some texts write expanded NPV = static NPV + option premium; with a negative static NPV the premium then also covers the shortfall below zero.

## Worked example

Let $V_0 = 100$, $I = 105$, $\sigma = 30\%$, $r = 5\%$, $\delta = 4\%$ and $T = 3$ years, with one step per year ($\Delta t = 1$). Then $u = e^{0.3} \approx 1.3499$, $d \approx 0.7408$, the one-step discount factor is $e^{-0.05} \approx 0.9512$, and

$$
q = \frac{e^{0.01} - 0.7408}{1.3499 - 0.7408} \approx 0.4421.
$$

The static NPV is $100 - 105 = -5$, so the now-or-never rule rejects the project. The tree tells a different story.

- Year 3: $V$ is 245.96, 134.99, 74.08 or 40.66. The opportunity is worth $(V - 105)^+$: 140.96, 29.99, 0 and 0.
- Year 2, $V = 182.21$: waiting is worth $0.9512\,(0.4421 \cdot 140.96 + 0.5579 \cdot 29.99) \approx 75.19$, investing gives 77.21. **Invest.** The forgone cash flow in the last year, about $182.21\,(1 - e^{-0.04}) \approx 7.14$, exceeds the interest saved on $I$, about 5.12.
- Year 2, $V = 100$: waiting 12.61 against $-5$ now, so wait. At $V = 54.88$ the opportunity is worthless.
- Year 1, $V = 134.99$: waiting $0.9512\,(0.4421 \cdot 77.21 + 0.5579 \cdot 12.61) \approx 39.16$ against 29.99 now, so wait. At $V = 74.08$: waiting 5.30, wait.
- Year 0: waiting $0.9512\,(0.4421 \cdot 39.16 + 0.5579 \cdot 5.30) \approx 19.28$ against $-5$ now, so wait.

The expanded NPV is 19.28. A project that the static rule rejects is a valuable opportunity, provided the firm keeps the right to wait. All of its 19.28 is value of flexibility.

### Worked example: The tree inputs and the expanded NPV

1. Up factor for one-year steps with $\sigma = 30\%$.
   $$u = e^{0.3}$$ → **1.3499**
2. Down factor, the reciprocal.
   $$d = 1/u$$ → **0.7408**
3. Risk-neutral probability, with the growth of $V$ lowered by the forgone yield $\delta = 4\%$.
   $$q = \frac{e^{0.05 - 0.04} - d}{u - d}$$ → **0.4421**
4. Backward induction from year 3, keeping the larger of investing and waiting at every node, gives the value at the root.
   $$F_0 = \max\big(V_0 - I,\; e^{-r}[q\,F_{\text{up}} + (1-q)\,F_{\text{down}}]\big)$$ → **19.28**

The figure uses the same setting: $V_0 = 100$, $r = 5\%$ and a 3-step tree over $T = 3$ years. Sliders set the investment cost $I$ (60 to 140), the volatility $\sigma$ (10% to 60%) and the forgone cash-flow yield $\delta$ (0% to 10%). The chart plots the static NPV $V_0 - I$ and the expanded NPV against $I$ from 60 to 140, with a vertical line at the chosen $I$. The readouts show the static NPV, the expanded NPV, the value of flexibility (expanded NPV minus $\max(V_0 - I, 0)$) and today's decision. Set $\delta = 0$ and note that the expanded NPV stays above the static NPV for every $I$, so waiting always has value. Raise $\delta$ and lower $I$ to find the region where investing now is optimal. Raise $\sigma$ and watch the expanded NPV curve lift away from the static line.

*[Interactive figure: real option tree](https://quantsandbox.dev/guide/corporate/real-options)*

## The option to expand

Suppose that by paying an extra $I_e$ the firm can scale the project up by a fraction $x$, turning $V$ into $(1 + x)V$. At a date when the option can be used, the project with the option is worth $\max\big(V,\,(1+x)V - I_e\big) = V + (xV - I_e)^+$. The expansion right is therefore a call on $xV$ with strike $I_e$, valued on the same tree by adding this term at the decision nodes. It pays off exactly in the states where demand turned out strong.

## The option to abandon

If the firm can stop the project and sell its assets for a **salvage value** $A$, then at each decision date the project is worth $\max(V, A) = V + (A - V)^+$. The abandonment right is a **put** on $V$ with strike $A$. It limits the downside: in bad states the firm walks away with $A$ instead of keeping a project worth less. On the tree, each node takes the larger of the continuation value and $A$.

## Limits of the analogy

Option pricing rests on replication: the option's payoff can be copied by trading the underlying, which pins the price down. A project's value $V$ is not traded, so no such portfolio exists in general. The risk-neutral valuation used above is then an approximation, justified if some traded asset (a commodity, a listed firm in the same business) moves closely with $V$. The inputs are also harder to estimate than for a stock option: $\sigma$ and $\delta$ have to be inferred from forecasts, and competitors may take the opportunity away before $T$.

## Summary

- Static NPV assumes a now-or-never decision; the rights to delay, expand, abandon or switch are options on the project value $V$.
- The option to delay is an American call on $V$ with strike $I$; the forgone cash-flow yield $\delta$ plays the role of a dividend yield.
- With $\delta = 0$ investing early is never optimal; with $\delta > 0$ investing at once can be optimal when the project is deep in the money.
- On a binomial tree with $q = (e^{(r-\delta)\Delta t} - d)/(u - d)$, each node takes the maximum of investing now and waiting; the root value is the expanded NPV.
- Expanding is a call and abandoning is a put on $V$; since $V$ is not traded, the valuation is an approximation.

[Value an option to expand a project in the Real options tab of the NPV & IRR lab](https://quantsandbox.dev/npv-irr)

## Interactive labs

- [NPV & IRR Calculator with NPV Profile](https://quantsandbox.dev/npv-irr)

## Practice questions

### 1. A firm holds a three-year licence to build a plant. Waiting costs nothing in forgone cash flows ($\delta = 0$), and today $V > I$. When should the firm invest?

- a) Now, because the static NPV is positive.
- b) Not before the licence expires; then invest if $V_T > I$.
- c) As soon as $V$ exceeds $I$ by $\sigma V$.
- d) Never: with $\delta = 0$ the option is worthless.

**Answer:** b) Not before the licence expires; then invest if $V_T > I$.

With $\delta = 0$ the option to delay is like an American call on a stock without dividends. Keeping the right is worth at least $V_t - Ie^{-r(T-t)}$, more than the $V_t - I$ from investing now, so investing before $T$ is never optimal.

### 2. On a tree with one step per year, $\sigma = 25\%$, $r = 5\%$ and $\delta = 1\%$, what is the risk-neutral probability $q$ of an up move?

**Answer:** 0.5186

$u = e^{0.25} \approx 1.2840$ and $d = 1/u \approx 0.7788$, so $q = (e^{0.04} - 0.7788)/(1.2840 - 0.7788) \approx 0.2620/0.5052 \approx 0.519$.

---

Source: https://quantsandbox.dev/guide/corporate/real-options

Previous lesson: [Valuation Multiples: P/E, EV/EBITDA, Peers](https://quantsandbox.dev/guide/corporate/valuation-multiples)
