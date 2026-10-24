# Black-76 and Garman–Kohlhagen Option Pricing

Black–Scholes with a continuous yield, the forward price as the common thread, Black-76 for futures and Garman–Kohlhagen for currencies.

"The Black–Scholes formula" prices an option on a stock that pays no dividends. Real underlyings are more varied: stocks and indices pay dividends, a currency earns interest abroad, and a futures contract costs nothing to hold. This lesson shows that all of them need the same small change, and that the change is easiest to see through the forward price from "Arbitrage and the forward price".

## A continuous dividend yield

Suppose the stock pays a dividend at a continuous rate $q$ of its price. Holding one share for time $T$ then also earns the dividends, which reinvested in the stock turn one share into $e^{qT}$ shares at expiry. To end with exactly one share, replicate with only $e^{-qT}$ shares today. The stock price that matters in the model is therefore the price net of dividends to come, $S_0 e^{-qT}$, and the formula is the old one with that substitution:

$$
c = S_0 e^{-qT} N(d_1) - K e^{-rT} N(d_2), \qquad p = K e^{-rT} N(-d_2) - S_0 e^{-qT} N(-d_1),
$$

$$
d_1 = \frac{\ln(S_0/K) + (r - q + \tfrac12\sigma^2)\,T}{\sigma\sqrt T}, \qquad d_2 = d_1 - \sigma\sqrt T.
$$

Only two things changed: the spot is discounted at $q$, and the drift in $d_1$ is $r - q$ instead of $r$. A higher yield makes a call cheaper and a put dearer, because dividends leave the stock lower at expiry. Setting $q = 0$ returns the original formula exactly.

## The forward price as the common thread

The forward price of the stock for delivery at $T$ is $F = S_0 e^{(r-q)T}$, as in "Arbitrage and the forward price" with the dividend income subtracted. Substitute $S_0 e^{-qT} = F e^{-rT}$ into the call formula and the yield disappears from view:

$$
c = e^{-rT}\,\bigl[\,F\,N(d_1) - K\,N(d_2)\,\bigr], \qquad d_1 = \frac{\ln(F/K) + \tfrac12\sigma^2 T}{\sigma\sqrt T}.
$$

This is the one formula behind every case below. The option depends on the underlying only through its forward price $F$, the strike and the volatility; what changes from one underlying to the next is how $F$ is built from today's price.

## Index options

A stock index pays the dividends of its many members, which add up to a fairly smooth stream. Treating it as a continuous yield $q$ is the standard approximation, and the formula above applies with $S_0$ the index level. A single stock paying a few large dividends is different: a common fix replaces $S_0$ by the price less the present value of the dividends due before expiry, and then uses the ordinary formula (the escrowed-dividend method). We do not derive it here.

## Currency options: Garman–Kohlhagen

Prices are quoted in the domestic currency per unit of foreign currency, with domestic rate $r_d$ and foreign rate $r_f$. A holder of the foreign currency earns the foreign interest rate, which plays exactly the role of a dividend yield: $q = r_f$. The forward exchange rate is $F = S_0 e^{(r_d - r_f)T}$, the covered interest parity relation, and the call is $e^{-r_d T}[F N(d_1) - K N(d_2)]$. This is the Garman–Kohlhagen formula.

## Options on futures: Black-76

A futures contract needs no investment to enter, so holding it earns nothing and costs nothing to finance. Its price behaves like a stock paying a yield equal to the interest rate, $q = r$, so $F e^{-rT}$ stands in for $S_0 e^{-qT}$ in the formula and the rate drops out of $d_1$. With $F$ the futures price, the call is again $e^{-rT}[F N(d_1) - K N(d_2)]$; this is the Black-76 formula, widely used for options on commodities, interest rate futures and, with forward yields, caps and swaptions. For the futures themselves see "Bond futures and the cheapest-to-deliver".

The figure uses a stock with strike 100 and spot 100, volatility 20% and one year to expiry. At the defaults (rate 5%, dividend yield 3%) the call costs 8.65 against 10.45 without a yield, the put costs 6.73, and the forward is 102.02. Raise the yield and watch the call curve sink towards the payoff line; set it to zero and the two curves coincide.

*[Interactive figure: dividend yield price](https://quantsandbox.dev/guide/derivatives/options-on-other-underlyings)*

## Put–call parity with a yield

The relation from "Put–call parity" survives with the same substitution: a call minus a put is a forward, valued at today's money,

$$
c - p = S_0 e^{-qT} - K e^{-rT}.
$$

A call and a put on the same underlying, strike and expiry therefore carry the same information about the yield.

### Worked example: A Garman–Kohlhagen call on EUR/USD

1. Forward rate (spot 1.10, dollar rate 5%, euro rate 3%, one year).
   $$F = S_0\,e^{(r_d - r_f)T}$$ → **1.1222**
2. With strike 1.10 and volatility 10%, the first normal argument.
   $$d_1 = \frac{\ln(F/K) + \tfrac12\sigma^2 T}{\sigma\sqrt T}$$ → **0.25**
3. The second argument.
   $$d_2 = d_1 - \sigma\sqrt T$$ → **0.15**
4. With $N(d_1) = 0.5987$ and $N(d_2) = 0.5596$, the call in dollars per euro.
   $$c = e^{-r_d T}\,[F\,N(d_1) - K\,N(d_2)]$$ → **0.0536**

## Summary

- With a continuous yield $q$, replace $S_0$ by $S_0 e^{-qT}$ in the Black–Scholes formula; $d_1$ then has drift $r - q$.
- Every case is one formula in the forward price: $c = e^{-rT}[F N(d_1) - K N(d_2)]$ with $F = S_0 e^{(r-q)T}$.
- Indices use the dividend yield, currencies the foreign rate (Garman–Kohlhagen), futures $q = r$ (Black-76).
- Put–call parity becomes $c - p = S_0 e^{-qT} - K e^{-rT}$.

> A later lesson, "Implied volatility and the volatility smile", turns the question around: given a market price, which $\sigma$ does the formula need.

[Price calls and puts in the Black–Scholes lab](https://quantsandbox.dev/black-scholes)

## Interactive labs

- [Black–Scholes Calculator & Option Greeks Visualizer](https://quantsandbox.dev/black-scholes)

## Practice questions

### 1. A stock at 50 pays a continuous dividend yield of 2%; the risk-free rate is 4%. A European call with strike 50 and six months to expiry costs 4.41. What is the put with the same strike and expiry?

**Answer:** 3.92

By parity $p = c - S_0 e^{-qT} + K e^{-rT} = 4.41 - 50e^{-0.01} + 50e^{-0.02} = 4.41 - 49.50 + 49.01 \approx 3.92$.

### 2. Which yield turns the generalised formula into the Black-76 formula for an option on a futures price?

- a) $q = 0$
- b) $q = r$
- c) $q = r_f - r$
- d) $q = \sigma$

**Answer:** b) $q = r$

A futures contract earns no income and needs no financing, so it behaves like an asset whose yield equals the interest rate: $q = r$. Then $S_0 e^{(r-q)T}$ is simply the futures price.

---

Source: https://quantsandbox.dev/guide/derivatives/options-on-other-underlyings

Previous lesson: [Option Greeks Explained: Gamma, Vega, Theta and Rho](https://quantsandbox.dev/guide/derivatives/greeks)

Next lesson: [Implied Volatility and the Volatility Smile](https://quantsandbox.dev/guide/derivatives/implied-volatility)
