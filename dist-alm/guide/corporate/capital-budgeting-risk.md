# Project Risk: Sensitivity, Scenarios, Monte Carlo NPV

Which inputs move the NPV most, break-even values, scenario analysis and the distribution of NPV from simulation. Free interactive lesson with worked examples.

"Net present value and internal rate of return" turned a project into one number: discount the cash flows at the rate $r$, subtract the investment, accept if the result is positive. Every input to that calculation, though, is a forecast. This lesson asks how much the NPV moves when the forecasts are wrong, and turns the single number into a range and then a distribution. The level cash flows are valued with the annuity factor from "Annuities, perpetuities and loan amortization".

## One number hides the risk

Take a project that costs 1,000 today and runs for 5 years. Each year it sells 100 units at a price of 15, with a variable cost of 8 per unit and a fixed cost of 200. The discount rate is 8%. The annual cash flow is

$$
CF = Q\,(P - c) - F = 100 \times (15 - 8) - 200 = 500,
$$

and since it is the same every year, its present value is the cash flow times the 5-year annuity factor:

$$
NPV = CF \cdot \frac{1 - (1+r)^{-T}}{r} - I = 500 \times 3.9927 - 1{,}000 = 996.36.
$$

A positive NPV of almost 1,000 looks comfortable. But the 100 units and the price of 15 are guesses about a market that does not exist yet. Two projects with the same NPV can differ greatly in how likely they are to lose money, and the single number says nothing about that. The tools below, in increasing order of effort, describe that uncertainty.

## Sensitivity analysis

**Sensitivity analysis** changes one input at a time, holding all the others at their base values, and records the NPV. A common convention is ±10% for every input, so the results are comparable. For the project above:

- Units sold (90 / 110): NPV 716.87 / 1,275.84.
- Price (13.50 / 16.50): NPV 397.45 / 1,595.26.
- Unit cost (7.20 / 8.80): NPV 1,315.77 / 676.94.
- Fixed cost (180 / 220): NPV 1,076.21 / 916.50.
- Investment (900 / 1,100): NPV 1,096.36 / 896.36.
- Discount rate (7.2% / 8.8%): NPV 1,039.17 / 954.96.

The price is by far the most important input: a 10% change in price moves the margin per unit from 7 to 5.50 or 8.50, which is a 21% change in the margin, and the NPV moves by about 600 either way. The discount rate matters least here. Sorting the inputs by the width of their range, often drawn as a **tornado chart**, tells you where to spend effort on better forecasts.

### Worked example: Base NPV and a 10% change in units sold

1. The annual cash flow at the base case.
   $$100 \times (15 - 8) - 200$$ → **500**
2. The 5-year annuity factor at 8%.
   $$\frac{1 - 1.08^{-5}}{0.08}$$ → **3.9927**
3. The base NPV.
   $$500 \times 3.9927 - 1{,}000$$ → **996.36**
4. The cash flow with 10% fewer units (90).
   $$90 \times 7 - 200$$ → **430**
5. The NPV with 90 units.
   $$430 \times 3.9927 - 1{,}000$$ → **716.87**
6. The NPV with 110 units.
   $$570 \times 3.9927 - 1{,}000$$ → **1275.84**

## Break-even analysis

Sensitivity asks how much the NPV moves; **break-even analysis** asks how far an input can move before the NPV reaches zero. Because the NPV is linear in units sold here, the break-even can be found by hand: the project needs an annual cash flow of $1{,}000 / 3.9927 = 250.46$, so

$$
Q^{*}\,(15 - 8) - 200 = 250.46 \quad\Rightarrow\quad Q^{*} = \frac{450.46}{7} = 64.35.
$$

Sales can fall by more than a third before the project destroys value. The same reasoning gives a break-even price of 12.50 (17% below the base) and a break-even unit cost of 10.50 (31% above). For inputs that enter non-linearly, such as the discount rate, the break-even is found numerically; for the rate it is the IRR. A break-even close to the base value is a warning that a modest forecast error will flip the decision.

## Scenario analysis

Inputs rarely move one at a time. A weak market usually means both fewer units and a lower price. **Scenario analysis** moves several inputs together into a consistent story. With a best case of 120 units at 16.50 and a worst case of 80 units at 13.50 (all else at base), the NPV is 2,274.02 in the best case, 996.36 in the base case and −41.75 in the worst case. The joint move is much larger than either one-input range, and the worst case is now a loss.

Scenarios are easy to explain to a decision maker, but they show only three points. They do not say how likely the worst case is, and the choice of 'worst' is itself a judgement.

## Monte Carlo simulation

**Monte Carlo simulation** replaces each uncertain input by a probability distribution, draws many joint samples, and computes the NPV for each one. The result is a whole distribution of NPVs. In the figure, units sold are normal with mean 100 and standard deviation 20, the price is normal with mean 15 and standard deviation 1.5 (both truncated at zero), and the other inputs are fixed. The standard deviation is the same measure of spread as in "Returns and volatility"; here it measures how far a forecast is likely to be off.

*[Interactive figure: npv distribution](https://quantsandbox.dev/guide/corporate/capital-budgeting-risk)*

With 5,000 seeded draws at the default settings, the base-case NPV is 996.36, the mean of the simulated NPVs is 993.77 (the inputs enter almost linearly, so the mean stays close to the base case, apart from sampling noise), the probability of a negative NPV is 11.0% and the 5th percentile is −271.85. Set both standard deviations to zero and the histogram collapses to a single bar at 996.36; widen them and the mass left of the zero marker grows.

> The simulation is only as good as its input distributions. Units and price are drawn independently here; in practice they are often correlated (a high price may cut sales), and ignoring that correlation can make the spread too wide or too narrow.

## What to do with the distribution

The mean simulated NPV is still the number to compare with zero when the firm is diversified and the rate $r$ already prices the project's risk. Discounting at $r$ and then penalising the spread again would count the risk twice. The distribution adds information that the mean does not: the **probability of a loss**, the size of a bad outcome (the 5th percentile, the same idea as value at risk), and which inputs drive the downside. That information guides practical decisions: whether to run a pilot to learn about demand before investing in full, whether to sign a fixed-price contract to remove price risk, or whether the firm can survive the bad tail at all.

Some of those decisions are themselves valuable: the right to wait, expand or abandon once the uncertainty resolves is worth more the wider the distribution. That is the subject of the real options lesson later in this track.

## Summary

- A single NPV hides how uncertain its inputs are; the same NPV can carry very different risk.
- Sensitivity analysis moves one input at a time (for example ±10%) and ranks the inputs by their effect on NPV.
- Break-even analysis finds the value of an input at which NPV is zero; for the default project, 64.35 units a year.
- Scenario analysis moves several inputs together into best, base and worst cases.
- Monte Carlo simulation gives the whole NPV distribution: its mean, the probability of a loss and percentiles of the downside.

[Open the NPV & IRR Lab to run sensitivities and scenarios on your own cash flows](https://quantsandbox.dev/npv-irr)

## Interactive labs

- [NPV & IRR Calculator with NPV Profile](https://quantsandbox.dev/npv-irr)
- [Monte Carlo Option Pricing Simulator](https://quantsandbox.dev/monte-carlo)

## Practice questions

### 1. What does a sensitivity analysis change at each step?

- a) All inputs together, in their best or worst direction
- b) One input, with all the others held at their base values
- c) The discount rate only
- d) Random draws of every input

**Answer:** b) One input, with all the others held at their base values

Sensitivity analysis moves one input at a time and keeps the others at the base case, so each NPV change can be attributed to that input. Moving inputs together is scenario analysis; random draws are Monte Carlo simulation.

### 2. With all other inputs at their base values, how many units per year must the project sell for its NPV to be zero?

**Answer:** 64.35 units

The required annual cash flow is $1{,}000 / 3.9927 = 250.46$. Adding back the fixed cost gives a margin of 450.46, and dividing by the unit margin of 7 gives 64.35 units.

---

Source: https://quantsandbox.dev/guide/corporate/capital-budgeting-risk

Previous lesson: [NPV and IRR Explained: Capital Budgeting Basics](https://quantsandbox.dev/guide/corporate/npv-irr)

Next lesson: [WACC Explained: Weighted Average Cost of Capital](https://quantsandbox.dev/guide/corporate/wacc)
