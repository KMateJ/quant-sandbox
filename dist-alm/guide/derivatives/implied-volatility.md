# Implied Volatility and the Volatility Smile

Inverting Black–Scholes for σ, vega, and what the smile and the term structure say about the model. Free interactive lesson with worked examples.

"The Black–Scholes formula" turns five inputs into an option price. This lesson runs the formula backwards: it takes the market price as given and asks which volatility produces it. The answer, the implied volatility, is how options are actually quoted, and comparing it across strikes and maturities shows where the model disagrees with the market.

## The one unobserved input

Look at the inputs of the call price $C_0 = S_0N(d_1) - Ke^{-rT}N(d_2)$. The stock price $S_0$ is on the screen, the strike $K$ and maturity $T$ are written in the contract, and the risk-free rate $r$ can be read off government bills. The volatility $\sigma$ is different: it describes how much the stock will move between now and $T$, and nobody can observe that in advance. A historical estimate from past returns is one guess, but traders do not have to agree on it.

So the formula can be read the other way round. If the market already shows a price for the option, the only free input is $\sigma$, and we can solve for it.

## Price as a function of volatility

Fix $S_0$, $K$, $T$ and $r$, and treat the call price as a function of $\sigma$ alone. Its derivative is the option's **vega**. Differentiating the formula (the terms from $d_1$ and $d_2$ combine as they did for delta) gives

$$
\mathcal{V} = \frac{\partial C_0}{\partial \sigma} = S_0\,\varphi(d_1)\sqrt{T} > 0,
$$

where $\varphi$ is the standard normal density. Vega is strictly positive, so the price is strictly increasing in $\sigma$. At the two ends, as $\sigma \to 0$ the stock grows deterministically and the price falls to $\max(S_0 - Ke^{-rT}, 0)$; as $\sigma \to \infty$ the call approaches the stock itself and the price rises to $S_0$. These are exactly the no-arbitrage bounds from "Put–call parity":

$$
\max\left(S_0 - Ke^{-rT},\, 0\right) < C_0 < S_0.
$$

A continuous, strictly increasing function that sweeps the whole interval between the bounds hits every price inside it exactly once. A quoted price inside the bounds therefore pins down one and only one $\sigma$. A price outside the bounds is an arbitrage, and no volatility can explain it.

> The **implied volatility** of an option is the unique $\sigma$ for which the Black–Scholes price equals the market price. It exists whenever the price lies strictly between the no-arbitrage bounds.

## Solving for the volatility

There is no closed-form inverse of the formula, so the implied volatility is found numerically. Two methods are standard.

1. **Bisection.** Start with a low $\sigma_L$ whose price is below the quote and a high $\sigma_H$ whose price is above it. Price the midpoint; if it is too high, it becomes the new $\sigma_H$, otherwise the new $\sigma_L$. Each step halves the interval, so the method always converges, slowly but surely.
2. **Newton's method.** Start from a guess $\sigma_0$ and follow the tangent of the price curve to the quoted price. The slope of the tangent is vega, so each step is $\sigma_{n+1} = \sigma_n - (C(\sigma_n) - C^{\text{mkt}})/\mathcal{V}(\sigma_n)$. Near the answer the number of correct digits roughly doubles per step.

Newton is much faster but can overshoot when vega is small, which happens for options far from the money or very close to maturity. Production code often combines the two: Newton steps, with a bisection fallback whenever a step leaves the bracketing interval.

## A worked example

Take $S_0 = 100$, $K = 100$, $T = 1$, $r = 5\%$, and a quoted call price of 12.00. The bounds are $100 - 100e^{-0.05} \approx 4.88$ and 100, so the quote is admissible. From "The Black–Scholes formula" we know that $\sigma = 20\%$ gives 10.45, which is too low, and $\sigma = 30\%$ gives 14.23, which is too high. Bisection on $[20\%, 30\%]$:

- $\sigma = 25\%$: price 12.34, too high, so the interval becomes $[20\%, 25\%]$.
- $\sigma = 22.5\%$: price 11.39, too low, so the interval becomes $[22.5\%, 25\%]$.
- $\sigma = 23.75\%$: price 11.86, too low, so the interval becomes $[23.75\%, 25\%]$.

Newton from $\sigma_0 = 20\%$ is quicker. Vega there is $\mathcal{V} \approx 37.52$ (price per unit of $\sigma$, so about 0.375 per volatility point):

$$
\sigma_1 = 0.20 - \frac{10.4506 - 12}{37.52} \approx 0.2413, \qquad C(\sigma_1) \approx 12.0066.
$$

A second step, with $\mathcal{V} \approx 37.81$, moves $\sigma$ by $-0.0066/37.81 \approx -0.0002$ and lands on $\sigma \approx 24.11\%$, correct to four digits. The market is pricing this option as if the stock had an annual volatility of 24.11%.

### Worked example: Two Newton steps for a quote of 9.00

1. Start from $\sigma_0 = 20\%$, where the price is 10.4506 and vega is 37.52. The first step, in percent:
   $$\sigma_1 = 0.20 - \frac{10.4506 - 9}{37.52}$$ → **16.13%**
2. Price at $\sigma_1$, now only slightly above the quote:
   $$C(\sigma_1)$$ → **9.01**
3. Second step, with vega $\approx 36.96$ at $\sigma_1$:
   $$\sigma_2 = \sigma_1 - \frac{C(\sigma_1) - 9}{36.96}$$ → **16.11%**

The figure shows the same construction. Spot $S_0 = 100$ and $r = 5\%$ are fixed; sliders set the quoted call price, the strike $K$ and the maturity $T$. The curve is the Black–Scholes call price against $\sigma$ from 1% to 100%, the horizontal line is the quoted price, and the vertical line marks where they cross: the implied volatility. The readouts show the implied volatility, vega at that volatility, and the lower and upper no-arbitrage bounds. Raise the quoted price and watch the crossing move right, so implied volatility rises. Then push the price below the lower bound: the horizontal line no longer meets the curve and the implied volatility readout shows a dash.

*[Interactive figure: implied vol](https://quantsandbox.dev/guide/derivatives/implied-volatility)*

## Quoting in volatility

Because the map between price and implied volatility is one-to-one, traders quote options in volatility rather than in money. The reason is comparability. A price of 12.00 means little until you know the strike, the maturity and the stock price; an implied volatility of 24% can be compared directly across strikes, maturities and even underlyings, and with the volatility you expect the stock to realise. The price is recovered by plugging the quoted volatility into the formula.

Calls and puts with the same strike and maturity share the same implied volatility. Put–call parity $C_0 - P_0 = S_0 - Ke^{-rT}$ holds for market prices without any model, and it also holds for Black–Scholes prices at every $\sigma$. If $\sigma^*$ reproduces the market call, then

$$
P_0^{\text{mkt}} = C_0^{\text{mkt}} - S_0 + Ke^{-rT} = C^{\text{BS}}(\sigma^*) - S_0 + Ke^{-rT} = P^{\text{BS}}(\sigma^*).
$$

In the example the put must cost $12.00 - (100 - 95.12) \approx 7.12$, and its implied volatility is again 24.11%.

## The volatility smile and the skew

If the Black–Scholes model were correct, the stock would have one volatility, and every option on it would show that same implied volatility. Market data do not look like that. Plotting implied volatility against the strike for a fixed maturity gives a curve, not a flat line. On equity indices it slopes downward: low-strike options, in particular out-of-the-money puts, carry clearly higher implied volatilities than at-the-money options, and high strikes somewhat lower ones. This shape is called the **skew**. In other markets, for example currencies, the curve is closer to symmetric and rises on both sides, which is where the name **volatility smile** comes from.

Implied volatility also varies with maturity at a fixed strike, which is called the **term structure** of volatility. In calm markets short-dated volatility tends to be below long-dated volatility; after a sharp sell-off the order often reverses. The two effects together form the implied volatility surface over strike and maturity.

## What the smile says about the model

The smile is the market's way of saying that it does not price with a lognormal distribution and a constant $\sigma$. A high implied volatility at low strikes means that out-of-the-money puts cost more than the model allows, so the market assigns more probability to large falls than a lognormal distribution does: the risk-neutral distribution has a **fatter left tail**. The term structure says that volatility itself is not a fixed number but moves over time, and in equity markets it tends to rise when prices fall.

Traders still use Black–Scholes, but as a quoting convention rather than as a description of the stock. The formula is a fixed, well-understood map between price and volatility, and the smile records how the market deviates from it. Implied volatility has been described as the wrong number to put in the wrong formula to get the right price. A model in which volatility itself is random, and which produces a smile on its own, is the topic of the next lesson.

## Summary

- Every Black–Scholes input except $\sigma$ is observable; the implied volatility is the $\sigma$ that reproduces the market price.
- Vega $S_0\varphi(d_1)\sqrt{T}$ is positive, so the price increases strictly in $\sigma$, and any price strictly inside $\max(S_0 - Ke^{-rT}, 0) < C_0 < S_0$ gives exactly one implied volatility.
- It is found by bisection (safe) or Newton's method with vega (fast); in the example a price of 12.00 gives 24.11%.
- Calls and puts with the same $K$ and $T$ have the same implied volatility, by put–call parity.
- Implied volatility varies with strike (smile, skew) and maturity (term structure), so the market does not price with a single lognormal $\sigma$.

> Black–Scholes survives as a quoting convention. The next lesson builds a model whose prices produce a smile; its lab is the Heston lab.

[See how the price responds to volatility in the Black–Scholes lab](https://quantsandbox.dev/black-scholes)

## Interactive labs

- [Black–Scholes Calculator & Option Greeks Visualizer](https://quantsandbox.dev/black-scholes)
- [Heston Stochastic Volatility Model Simulator](https://quantsandbox.dev/heston)

## Practice questions

### 1. A call trades above the Black–Scholes price computed with $\sigma = 20\%$. What can you say about its implied volatility?

- a) It is above 20%
- b) It is below 20%
- c) It is exactly 20%
- d) Nothing without knowing the real drift

**Answer:** a) It is above 20%

The price is strictly increasing in $\sigma$ (vega is positive), so a higher price needs a higher volatility.

### 2. Same option ($S_0 = K = 100$, $T = 1$, $r = 5\%$), but now the quoted call price is 9.00. What is its implied volatility, in percent?

**Answer:** 16.11%

At 20% the price is 10.45, too high, and at 10% it is about 6.80, too low. The first bisection step prices 15% at 8.59, too low, so the answer lies in $[15\%, 20\%]$; continuing gives about 16.11%.

---

Source: https://quantsandbox.dev/guide/derivatives/implied-volatility

Previous lesson: [Black-76 and Garman–Kohlhagen Option Pricing](https://quantsandbox.dev/guide/derivatives/options-on-other-underlyings)

Next lesson: [Heston Model: Stochastic Volatility and the Smile](https://quantsandbox.dev/guide/derivatives/stochastic-volatility)
