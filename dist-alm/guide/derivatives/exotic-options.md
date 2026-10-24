# Exotic Options: Barrier, Asian and Digital Options

Path-dependent payoffs, the effect of a knock-out barrier and of averaging, and why Monte Carlo is the natural tool.

So far every option in this track paid a function of the final price $S_T$ alone. This lesson looks at options whose payoff is either non-standard or depends on the whole price path: digital, barrier and Asian options. It uses the pricing rule from "Risk-neutral probabilities", the formula from "The Black–Scholes formula" and the simulation method from "Monte Carlo option pricing", and it shows where the static replication of "Static replication: Breeden–Litzenberger and Carr–Madan" stops working.

## Exotic options

An option is called **exotic** when it is not a plain European or American call or put. There are two ways to depart from the standard contract. The payoff can be a different function of $S_T$, such as a fixed cash amount. Or the payoff can be **path-dependent**: it depends on prices at dates before $T$, for example on the maximum or the average of the path.

The difference matters for hedging. A European payoff $f(S_T)$ can be built statically from bonds, a forward and vanilla options, as the Carr–Madan result showed. A path-dependent payoff cannot in general: two paths that end at the same $S_T$ can pay different amounts, so no portfolio of instruments that pay a function of $S_T$ can match it. The pricing rule is unchanged, though. The price is still the discounted $\mathbb{Q}$-expectation of the payoff $X$:

$$
V_0 = e^{-rT}\,\mathbb{E}^{\mathbb{Q}}[X].
$$

## Digital options

A **digital** (cash-or-nothing) call pays 1 at $T$ if $S_T > K$ and nothing otherwise. Its payoff is the indicator $\mathbf{1}\{S_T > K\}$, a step instead of a ramp. The expected payoff is the risk-neutral probability of finishing above the strike, which "The Black–Scholes formula" identified as $N(d_2)$. Discounting gives

$$
D_0 = e^{-rT}\,\mathbb{Q}(S_T > K) = e^{-rT} N(d_2), \qquad d_2 = \frac{\ln(S_0/K) + (r - \tfrac12\sigma^2)T}{\sigma\sqrt{T}}.
$$

With $S_0 = K = 100$, $r = 5\%$, $\sigma = 20\%$ and $T = 1$, $d_2 = 0.03/0.2 = 0.15$, $N(d_2) \approx 0.5596$ and $D_0 \approx 0.5323$. The digital is still a European payoff. It is the limit of a tight call spread from "Combining positions": long $1/h$ calls struck at $K$ and short $1/h$ calls struck at $K + h$, with $h \to 0$.

Its delta shows why digitals are hard to hedge. Differentiating $D_0$ with respect to $S_0$ gives $\Delta = e^{-rT}\varphi(d_2)/(S_0\sigma\sqrt{T})$, where $\varphi$ is the standard normal density. At the money the factor $1/\sqrt{T}$ makes it blow up as expiry approaches: about $0.019$ with one year left, $0.069$ with one month and $0.381$ with one day. Near expiry the hedge must swing between holding almost nothing and holding a large position as the price crosses $K$.

### Worked example: An out-of-the-money digital call

1. Same market, strike raised to $K = 110$:
   $$d_2 = \frac{\ln(100/110) + (0.05 - 0.02) \cdot 1}{0.2}$$ → **-0.3266**
2. Risk-neutral probability of finishing above 110:
   $$N(d_2)$$ → **0.372**
3. Discount the expected payment of 1:
   $$D_0 = e^{-0.05} \cdot 0.372$$ → **0.3539**

## Barrier options

A **barrier option** is a vanilla option that is switched off or on when the price touches a level $B$. A **knock-out** option dies, paying nothing, if the barrier is touched before $T$; a **knock-in** option comes to life only if it is touched. The most common example is the **up-and-out call** with $B > K$. Writing $M_T$ for the maximum of the path up to $T$, its payoff is

$$
X = (S_T - K)^+\,\mathbf{1}\{M_T < B\}.
$$

The payoff is never larger than the vanilla payoff, so the up-and-out call is cheaper than the vanilla. It loses exactly the paths that matter most to a call holder: those that rise far. As $B$ falls toward $K$ its value goes to zero, because a path that finishes above $K \ge B$ must have touched $B$. As $B$ rises the barrier is touched less often and the price approaches the vanilla price.

Volatility acts in two directions. Higher $\sigma$ makes large final payoffs more likely, which raises the vanilla price, but it also makes touching $B$ more likely. With a barrier close to the spot the second effect wins, and the up-and-out call can get cheaper as $\sigma$ rises.

## In–out parity

Hold an up-and-in call and an up-and-out call with the same $K$, $B$ and $T$. On every path exactly one of them is alive, and the live one pays $(S_T - K)^+$. Together they pay the vanilla payoff on every path, so by the law of one price

$$
C_0^{\text{in}} + C_0^{\text{out}} = C_0.
$$

Pricing one of the two barrier options therefore prices the other.

## Discrete and continuous monitoring

A contract must say how the barrier is checked. Textbook formulas assume **continuous monitoring**: the price is watched at every instant. Real contracts often use **discrete monitoring**, for example at each daily close. A path can cross $B$ between two observation dates and come back unnoticed, so a discretely monitored knock-out is knocked out less often and is worth more than its continuously monitored version. The figure below monitors 100 dates in the year.

## Asian options

An **Asian option** pays on the average price over a set of monitoring dates $t_1, \dots, t_n$ instead of the final price. The arithmetic-average Asian call pays

$$
X = (A_T - K)^+, \qquad A_T = \frac{1}{n}\sum_{k=1}^{n} S_{t_k}.
$$

An average moves less than the price itself: early prices in the average have had little time to drift away, and their errors partly cancel. For averaging over the whole period the volatility of the average is roughly $\sigma/\sqrt{3}$, about 11.5% when $\sigma = 20\%$. Lower volatility means a smaller time value, so the Asian call is cheaper than the vanilla. Averaging also makes the contract hard to manipulate by moving the price on a single day.

A sum of log-normal prices is not log-normal, so the arithmetic Asian call has no closed form. The geometric average is log-normal and has a Black–Scholes-type formula; since it moves closely with the arithmetic one, it is a natural control variate in the sense of "Monte Carlo option pricing".

## Pricing by Monte Carlo

For path-dependent payoffs a single draw of $S_T$ is not enough: we need the whole path at the monitoring dates. Under $\mathbb{Q}$ the stock follows geometric Brownian motion with drift $r$, and the exact solution steps from one date to the next with $\Delta t = T/n$:

$$
S_{t_{k+1}} = S_{t_k}\exp\big((r - \tfrac12\sigma^2)\Delta t + \sigma\sqrt{\Delta t}\,Z_{k+1}\big).
$$

1. Simulate $N$ paths at the $n$ monitoring dates with independent standard normal $Z$'s.
2. On each path record what the payoff needs: $S_T$, the running maximum $M_T$, the average $A_T$.
3. Compute each path's payoff, average over the $N$ paths and multiply by $e^{-rT}$.

The same paths price all the contracts at once; only the payoff function changes. The standard error behaves as described in "Monte Carlo option pricing".

## A worked example

Take $S_0 = 100$, $K = 100$, $r = 5\%$, $T = 1$, $\sigma = 20\%$, 100 monitoring dates, barrier $B = 130$, and simulate 20 000 paths (seed 1). The estimates are:

- Vanilla call: $10.37$; the Black–Scholes price is $10.45$, within about one standard error ($\approx 0.10$).
- Asian call: $5.77$, a little over half the vanilla price.
- Up-and-out call with $B = 130$: $3.69$, so the up-and-in call is worth $10.37 - 3.69 = 6.68$ by in–out parity.
- Digital call paying 1: $0.530$, against the closed form $e^{-rT}N(d_2) \approx 0.532$.

The barrier removes almost two thirds of the vanilla value, because a 30% rise within a year is not unusual at 20% volatility.

The figure uses these settings: $S_0 = 100$, $K = 100$, $r = 5\%$, $T = 1$, with 20 000 paths simulated under $\mathbb{Q}$ and monitored at 100 dates. The sliders set the volatility $\sigma$ (10% to 50%) and the barrier level $B$ (105 to 250), and "New sample" draws new paths. The chart plots the up-and-out call price against $B$ from 105 to 250, with the vanilla Black–Scholes price as a horizontal line and a vertical line at the chosen $B$. The readouts give the Monte Carlo vanilla call, the Asian call, the up-and-out call at $B$ and the digital call paying 1. Push $B$ down toward $K$ and watch the barrier price fall to zero. Then raise $\sigma$: the vanilla gets dearer, while at $B = 130$ the up-and-out call gets cheaper, from about $3.69$ at 20% to about $1.88$ at 30%.

*[Interactive figure: exotic prices](https://quantsandbox.dev/guide/derivatives/exotic-options)*

> Path-dependent options rarely have closed forms, but they are priced by the same rule as any other claim: simulate paths under $\mathbb{Q}$, evaluate the payoff on each path, average and discount.

## Summary

- An exotic option has a non-standard payoff or one that depends on the path; path-dependent payoffs cannot in general be replicated statically with vanillas.
- A digital call pays 1 if $S_T > K$; its price is $e^{-rT}N(d_2)$ and its delta spikes near expiry at the money.
- An up-and-out call is cheaper than the vanilla, falls to zero as $B$ approaches $K$, and satisfies $C_0^{\text{in}} + C_0^{\text{out}} = C_0$; discrete monitoring knocks out less often.
- Averaging lowers volatility, so an arithmetic Asian call is cheaper than the vanilla and has no closed form.
- Monte Carlo prices all of them from the same simulated paths at the monitoring dates.

[Simulate risk-neutral paths and price payoffs in the Monte Carlo lab](https://quantsandbox.dev/monte-carlo)

## Interactive labs

- [Monte Carlo Option Pricing Simulator](https://quantsandbox.dev/monte-carlo)
- [Option Payoff Diagram & Strategy Builder](https://quantsandbox.dev/payoff)

## Practice questions

### 1. A cash-or-nothing call pays 1 if $S_T > K$. With $S_0 = K = 100$, $r = 5\%$, $\sigma = 20\%$ and $T = 1$, what is it worth today?

**Answer:** 0.5323

$d_2 = 0.15$ and $N(0.15) \approx 0.5596$, so $D_0 = e^{-0.05} \cdot 0.5596 \approx 0.5323$.

### 2. Compare an up-and-out call (barrier $B > K$) with the vanilla call with the same $K$ and $T$.

- a) The up-and-out call is worth less
- b) The up-and-out call is worth more
- c) They are worth the same
- d) It depends on whether $B$ is touched

**Answer:** a) The up-and-out call is worth less

On every path the barrier payoff is at most the vanilla payoff, and on paths that touch $B$ it is zero while the vanilla may pay. So its price is lower, by the value of the up-and-in call.

---

Source: https://quantsandbox.dev/guide/derivatives/exotic-options

Previous lesson: [Breeden–Litzenberger and Static Option Replication](https://quantsandbox.dev/guide/derivatives/static-replication)
