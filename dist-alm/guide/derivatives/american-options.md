# American Options and Early Exercise in Binomial Trees

Early exercise in a tree, why calls without dividends are never exercised early, the early-exercise premium of a put and the exercise boundary.

All options priced so far could be exercised only at maturity. Many traded options, including most single-stock options, can be exercised at any time up to maturity. This lesson prices that extra right with the tree from "Multi-step trees and backward induction", shows why it is worthless for a call on a stock without dividends but valuable for a put, and explains how "Put–call parity" changes.

## European and American exercise

A **European** option gives the right to exercise only at maturity $T$. An **American** option gives the right to exercise at any time $t \le T$. Exercising a call at time $t$ pays $S_t - K$; exercising a put pays $K - S_t$. This amount is the **intrinsic value** of the option at time $t$: $(S_t - K)^+$ for a call and $(K - S_t)^+$ for a put.

Throughout the lesson the stock pays no dividends, and $r$ is the continuously compounded risk-free rate.

Two inequalities follow directly from the definition. An American option gives every right the European one gives, and more, so it is worth at least as much. And an American option can always be exercised immediately, so it is worth at least its intrinsic value. If it traded below that, buying it and exercising at once would be an arbitrage.

$$
V^{\text{Am}}_t \ \ge\ V^{\text{Eu}}_t, \qquad V^{\text{Am}}_t \ \ge\ \text{intrinsic value at } t.
$$

## Backward induction with early exercise

In a tree the holder of an American option decides at each node whether to exercise. Exercising gives the intrinsic value. Not exercising keeps the option alive one more step, which is worth the discounted risk-neutral average of the two successor values, the **continuation value**. A rational holder takes the larger of the two. Backward induction therefore changes in a single place:

$$
V_{i,j} = \max\Big( \underbrace{(K - S_{i,j})^+}_{\text{exercise}},\ \underbrace{e^{-r\Delta t}\big[q\,V_{i+1,j+1} + (1-q)\,V_{i+1,j}\big]}_{\text{continuation}} \Big),
$$

written here for a put, with $q = (e^{r\Delta t} - d)/(u - d)$ as before. At maturity the value is the payoff. Nodes where the exercise value is larger form the **exercise region**: if the stock reaches such a node, the holder exercises there.

> **American option in a tree.** At every node take the larger of the intrinsic value and the continuation value. A node where the intrinsic value wins is a node where the option is exercised.

## Worked example

Take the two-step tree of "Multi-step trees and backward induction": $S_0 = 100$, $T = 1$, $\sigma = 20\%$, $r = 5\%$, $n = 2$, so $u \approx 1.1519$, $d \approx 0.8681$, $q \approx 0.5539$ and the one-step discount factor is $e^{-0.025} \approx 0.9753$. Price a put with $K = 100$.

1. Prices at maturity: $100u^2 \approx 132.69$, $100$, $100d^2 \approx 75.36$. Put payoffs: $0$, $0$, $24.64$.
2. Upper node after one step ($S \approx 115.19$): both successors pay 0, so the continuation value is 0 and so is the intrinsic value.
3. Lower node after one step ($S \approx 86.81$): continuation value $0.9753\,(0.5539\cdot 0 + 0.4461\cdot 24.64) \approx 10.72$. Intrinsic value $100 - 86.81 = 13.19$. Exercise wins, so the node is worth $13.19$.
4. Root, American: $0.9753\,(0.5539\cdot 0 + 0.4461\cdot 13.19) \approx 5.74$. At the root the intrinsic value is 0, so the holder waits.
5. Root, European: the same calculation with $10.72$ in place of $13.19$ gives $\approx 4.66$.

The right to exercise early is worth $5.74 - 4.66 = 1.07$ in this coarse tree. It comes entirely from the lower node, where the stock has fallen far enough that taking $K - S$ now beats waiting.

The figure below draws the same tree node by node. Every node shows the stock price $S$ and the put value $P$; nodes where exercising now beats waiting are highlighted. Select 2 steps and click the lower node after one step: the panel writes out the continuation value $0.9753\,(0.5539\cdot 0 + 0.4461\cdot 24.64) \approx 10.72$, the intrinsic value $13.19$, and their maximum. Switch the rule to European and that node falls back to its continuation value, so the root drops from $5.74$ to $4.66$. With more steps more nodes near the bottom of the tree are exercised, and the premium readout shows how much the right is worth at each tree size (for example $0.33$ with 3 steps and $0.79$ with 4); the coarse trees jump around before settling, as in "Multi-step trees and backward induction".

*[Interactive figure: american tree](https://quantsandbox.dev/guide/derivatives/american-options)*

Repeat the calculation with a higher strike, $K = 105$, on the same tree.

### Worked example: American and European put with K = 105 on the two-step tree

1. Put payoff at the lowest final node, $S = 100d^2$.
   $$K - 100d^2$$ → **29.64**
2. Upper node after one step: continuation value (its intrinsic value is 0, since $S > K$).
   $$e^{-r\Delta t}\big[q \cdot 0 + (1-q)(K - 100)\big]$$ → **2.18**
3. Lower node: continuation value.
   $$e^{-r\Delta t}\big[q\,(K - 100) + (1-q)(K - 100d^2)\big]$$ → **15.6**
4. Lower node: intrinsic value, which beats the continuation value, so the put is exercised there.
   $$K - 100d$$ → **18.19**
5. American put at the root (the intrinsic value 5 is lower, so the holder waits).
   $$e^{-r\Delta t}\big[q\,V_u + (1-q)\,V_d\big]$$ → **9.09**
6. European put at the root, using the continuation value at the lower node.
   $$e^{-r\Delta t}\big[q\,C_u + (1-q)\,C_d\big]$$ → **7.96**

## No early exercise of a call

For a call on a stock without dividends the extra right is worthless. A European call is bounded below by the no-arbitrage bound from "Put–call parity":

$$
C^{\text{Eu}}_t \ \ge\ S_t - K e^{-r(T-t)} \ >\ S_t - K \qquad (r > 0,\ t < T).
$$

So even a European call, which cannot be exercised before $T$, is worth more than the $S_t - K$ that early exercise would give. Selling the call is always better than exercising it, and the American call has the same price as the European one. The reason is that exercising early pays $K$ sooner than necessary, which loses interest, and gives up the protection the option provides if the stock falls.

For a put the interest argument works the other way. Exercising early *receives* $K$ sooner, and the cash then earns interest. When the stock is far below the strike, the interest on $K$ outweighs the remaining chance of a further fall, and early exercise is optimal. The **early-exercise premium** $P^{\text{Am}} - P^{\text{Eu}}$ is therefore positive for a put.

## The exercise boundary

For an American put, the exercise region at each time $t$ consists of all stock prices below a critical level $S^*(t)$, the **exercise boundary**. Above $S^*(t)$ the holder waits; at or below it, the holder exercises. The boundary lies below $K$ and rises towards $K$ as $t$ approaches $T$, because with little time left there is little reason to wait. It is not given by a closed-form formula; the tree finds it numerically as the dividing line between exercise and continuation nodes.

## Put–call parity for American options

Parity $C - P = S_0 - Ke^{-rT}$ relies on both options being held to maturity. With early exercise the equality becomes a pair of bounds. For a stock without dividends,

$$
S_0 - K \ \le\ C^{\text{Am}} - P^{\text{Am}} \ \le\ S_0 - K e^{-rT}.
$$

The right-hand inequality holds because $C^{\text{Am}} = C^{\text{Eu}}$ and $P^{\text{Am}} \ge P^{\text{Eu}}$. Example with the parameters above, $K = 100$ and a 100-step tree: $C \approx 10.43$ and $P^{\text{Am}} \approx 6.08$, so $C - P^{\text{Am}} \approx 4.35$, which lies between $0$ and $100 - 100e^{-0.05} \approx 4.88$.

## European and American put compared

The figure prices both puts on a CRR tree with 100 steps, $S_0 = 100$, $r = 5\%$ and $T = 1$. It plots the European and the American put value against the stock price from 50 to 150, together with the payoff $(K - S)^+$, and a solid line marks $S_0 = 100$. Sliders set the strike $K$ and the volatility $\sigma$. The readouts give, at $S_0 = 100$, both put values, their difference, and the **critical price** $S^*$: the highest stock price at which the American put equals its payoff, so that exercising today is optimal. It is the exercise boundary $S^*(t)$ of the previous section, read off today. At the defaults $K = 100$, $\sigma = 20\%$ the European put is worth about 5.55, the American about 6.08, a premium of about 0.53, and $S^* \approx 81.6$. Below $S^*$ the American curve runs along the payoff line, while the European curve drops below the payoff. Raise $K$ to 120 and note that the premium grows to about 2.73 and $S^*$ moves up to about 98, because the put is deep in the money and the interest on $K$ matters more. Raise $\sigma$ instead and $S^*$ falls: with more volatility, waiting for a further fall is worth more.

*[Interactive figure: american boundary](https://quantsandbox.dev/guide/derivatives/american-options)*

## Summary

- An American option can be exercised at any time; it is worth at least the European option and at least its intrinsic value.
- In a tree, each node takes the larger of the intrinsic value and the discounted risk-neutral continuation value.
- An American call on a stock without dividends is never exercised early, so it has the European price; an American put can be worth more than the European put.
- Early exercise of a put is optimal below an exercise boundary $S^*(t) < K$ that rises towards $K$ near maturity.
- Put–call parity becomes the bounds $S_0 - K \le C^{\text{Am}} - P^{\text{Am}} \le S_0 - Ke^{-rT}$.

[Price options on a multi-step tree in the Binomial lab](https://quantsandbox.dev/binomial)

## Interactive labs

- [Binomial Option Pricing Tree Calculator](https://quantsandbox.dev/binomial)

## Practice questions

### 1. At a node of the tree $S = 80$, the strike of an American put is $K = 100$, and the continuation value is $18.5$. What is the node worth?

**Answer:** 20

The node takes the larger of the intrinsic value $100 - 80 = 20$ and the continuation value $18.5$, so 20, and the put is exercised there.

### 2. Why is an American call on a stock without dividends never exercised early?

- a) Because even the European call is worth at least $S_t - Ke^{-r(T-t)} > S_t - K$, so selling beats exercising.
- b) Because calls are usually out of the money.
- c) Because the contract forbids exercise before maturity.
- d) Because the delta of a call is below 1.

**Answer:** a) Because even the European call is worth at least $S_t - Ke^{-r(T-t)} > S_t - K$, so selling beats exercising.

Exercising pays $K$ early and loses the interest on it, and gives up the protection against a fall. The no-arbitrage bound from put–call parity makes the live option worth more than $S_t - K$.

---

Source: https://quantsandbox.dev/guide/derivatives/american-options

Previous lesson: [Binomial Trees and Backward Induction (CRR Model)](https://quantsandbox.dev/guide/derivatives/multi-step-trees)

Next lesson: [Delta Hedging Explained: Delta, Gamma and Rebalancing](https://quantsandbox.dev/guide/derivatives/delta-hedging)
