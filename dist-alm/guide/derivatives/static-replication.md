# Breeden–Litzenberger and Static Option Replication

The risk-neutral density from call prices, and building any payoff from bonds, forwards and options. Free interactive lesson with worked examples.

The previous lessons priced options inside a model: a tree, geometric Brownian motion, a stochastic variance. This lesson goes the other way. It starts from the call prices quoted in the market and asks what they tell us without any model. Two results answer it. Breeden–Litzenberger reads the risk-neutral distribution of $S_T$ off call prices, and Carr–Madan builds any European payoff from bonds, a forward and options. Both extend the last section of "Combining positions" and use the pricing rule from "Risk-neutral probabilities".

## Prices as discounted expectations

A **European payoff** is paid only at maturity $T$ and depends only on the price at that date: $X = f(S_T)$. Calls, puts, forwards and the butterfly are all of this kind. By the rule from "Risk-neutral probabilities", its price today is the discounted expectation under $\mathbb{Q}$. Suppose $S_T$ has a **risk-neutral density** $q(K)$ under $\mathbb{Q}$, so that $\mathbb{Q}(a < S_T < b) = \int_a^b q(K)\,dK$. Then

$$
V_0 = e^{-rT}\,\mathbb{E}^{\mathbb{Q}}[f(S_T)] = e^{-rT}\int_0^{\infty} f(K)\,q(K)\,dK.
$$

The variable of integration is called $K$ on purpose: it runs over the possible values of $S_T$, and these will be matched with strikes. If we knew $q$, every European payoff could be priced by one integral. The question is where $q$ comes from.

## The butterfly and the density

Take three calls with strikes $K - h$, $K$ and $K + h$, all with the same maturity. Write $C(K)$ for the price today of the call with strike $K$. The butterfly from "Combining positions" buys one $K-h$ call, sells two $K$ calls and buys one $K+h$ call. Its payoff is a tent of height $h$ centred at $K$ and zero outside $(K-h, K+h)$. Divide the position by $h^2$: the tent now has height $1/h$ and base $2h$, so its area is 1.

As $h$ shrinks the tent becomes a narrow spike of area 1 at $K$. Its expected payoff is approximately $q(K)$ times its area, so it tends to the density $q(K)$. Pricing the scaled butterfly by the formula above gives

$$
\frac{C(K-h) - 2C(K) + C(K+h)}{h^2} \;\longrightarrow\; e^{-rT}\,q(K) \qquad (h \to 0).
$$

The left-hand side is the central difference that approximates a second derivative, so the limit is $\partial^2 C/\partial K^2$.

## The Breeden–Litzenberger formula

The same result follows by differentiating the call price directly. Write it as an integral over the density:

$$
C(K) = e^{-rT}\int_K^{\infty} (s - K)\,q(s)\,ds.
$$

Differentiate with respect to $K$. The integrand vanishes at the lower limit $s = K$, so only the derivative of $(s - K)$ remains:

$$
\frac{\partial C}{\partial K} = -e^{-rT}\int_K^{\infty} q(s)\,ds = -e^{-rT}\,\mathbb{Q}(S_T > K).
$$

So the slope of the call price across strikes is minus the discounted probability of exercise. Differentiating once more removes the integral:

$$
\frac{\partial^2 C}{\partial K^2} = e^{-rT}\,q(K) \quad\Longleftrightarrow\quad q(K) = e^{rT}\,\frac{\partial^2 C}{\partial K^2}.
$$

> **Breeden–Litzenberger:** the risk-neutral density of $S_T$ is $q(K) = e^{rT}\,\partial^2 C/\partial K^2$. It is read directly from call prices across strikes, with no model for how the price moves.

## The implied density and the skew

In "The Black–Scholes formula" a single $\sigma$ gives every call price, and the density read off them is the lognormal density of geometric Brownian motion. "Implied volatility and the volatility smile" showed that markets quote a different implied volatility for each strike, typically higher for low strikes. Feeding such prices into Breeden–Litzenberger gives a density that is no longer lognormal: higher prices for low-strike options mean more risk-neutral probability of large falls, so the left tail is fatter.

An example: with $S_0 = 100$, $r = 5\%$, $T = 1$ and a flat $\sigma = 20\%$, the probability $\mathbb{Q}(S_T < 80)$ is about 10.0%. Let the implied volatility instead be $\sigma(K) = 0.2 - 0.2\ln(K/F)$, with forward price $F = S_0e^{rT}$. The density read off these prices gives about 11.9%.

The figure fixes $S_0 = 100$, $r = 5\%$ and $T = 1$. Sliders set the volatility $\sigma$, a skew that moves the implied volatility linearly in $\ln(K/F)$ (0 means flat Black–Scholes), and the centre $K$ and half-width $h$ of a butterfly. The chart shows the density $q(K)$ read off the call prices; with a non-zero skew the lognormal density of the flat-volatility model is drawn for comparison. The readouts give the butterfly price divided by $h^2$, the exact value $e^{-rT}q(K)$ it approximates, and the total mass $\int q\,dK$, which stays close to 1. Shrink $h$ and watch the butterfly approach the density value; then make the skew negative and watch the left tail grow.

*[Interactive figure: bl density](https://quantsandbox.dev/guide/derivatives/static-replication)*

With $\sigma = 20\%$, no skew and centre 100, the exact value is $e^{-rT}q(100) \approx 0.01876$. A butterfly with $h = 5$ gives 0.01867 and one with $h = 1$ gives 0.01876.

## The spanning formula

Breeden–Litzenberger turns call prices into a density. Carr–Madan does the reverse: it writes a payoff as a combination of option payoffs. Let $f$ be twice differentiable and fix any level $a > 0$, called the anchor. Taylor's theorem with the remainder written as an integral (one integration by parts) gives, for $S > a$,

$$
f(S) = f(a) + f'(a)(S - a) + \int_a^S f''(K)\,(S - K)\,dK.
$$

For $S > a$ the factor $(S - K)$ is positive inside the integral and $(S-K)^+ = 0$ for $K > S$, so the integral equals $\int_a^{\infty} f''(K)(S-K)^+\,dK$. The case $S < a$ is the mirror image and produces puts. Both cases combine into

$$
f(S) = f(a) + f'(a)(S - a) + \int_0^a f''(K)\,(K - S)^+\,dK + \int_a^{\infty} f''(K)\,(S - K)^+\,dK.
$$

Read it term by term: $f(a)$ zero-coupon bonds, $f'(a)$ forward contracts with delivery price $a$, and at every strike $K$ an amount $f''(K)\,dK$ of puts below the anchor and calls above it. Taking prices of both sides, with $P(K)$ the put price:

$$
V_0 = e^{-rT}f(a) + e^{-rT}f'(a)(F - a) + \int_0^a f''(K)\,P(K)\,dK + \int_a^{\infty} f''(K)\,C(K)\,dK.
$$

Choosing $a = F$ makes the forward cost nothing, and every option in the portfolio is out of the money: puts below $F$, calls above it. The log contract behind a variance swap is replicated exactly this way, with $f''(K) = 1/K^2$.

## Piecewise-linear payoffs

If $f$ is made of straight pieces, $f''$ is zero everywhere except at the kinks. At a kink $K_i$ the slope jumps by $c_i$ (slope after minus slope before), and $f''$ acts like a point mass of size $c_i$ there. The integrals collapse into sums, and the portfolio holds finitely many options, $c_i$ of them at each kink. With $a = 0$ there are no puts and we recover the bonds-stock-calls recipe of "Combining positions"; with $a$ above the last kink there are only puts.

> **Carr–Madan:** for any anchor $a$, a payoff is $f(a)$ bonds, $f'(a)$ forwards struck at $a$, puts below $a$ and calls above it, with $f''(K)\,dK$ options at strike $K$. Every choice of $a$ pays the same at $T$, so without arbitrage every choice costs the same.

## A worked example

Take the payoff that is 0 below 90, rises with slope 1 from 90 to 100 and stays at 10 above 100. Its kinks are at 90 (slope change $+1$) and 100 (slope change $-1$). Use $S_0 = 100$, $r = 5\%$, $T = 1$ and Black–Scholes prices with $\sigma = 20\%$, so $F = 100e^{0.05} \approx 105.13$.

- Calls ($a = 0$): $f(0) = 0$ and $f'(0) = 0$, so long one 90 call and short one 100 call, the bull call spread. Cost $16.70 - 10.45 = 6.25$.
- Around $F$ ($a = F$): $f(F) = 10$ and $f'(F) = 0$; both kinks lie below $F$, so they become puts. Hold 10 bonds, long one 90 put and short one 100 put. Cost $10 \times 0.9512 + 2.31 - 5.57 = 6.25$.

Check the second portfolio at $S_T = 95$: $10 + 0 - 5 = 5$, the target value. The two portfolios have the same payoff for every $S_T$, so they have the same price; their equality is put–call parity applied at each kink. A kink above $F$ would have been replicated with a call.

### Worked example: A bull spread replicated around the forward

1. Target: the 100/110 bull call spread, slope 1 between 100 and 110. Same market, so $F \approx 105.13$. At the anchor $a = F$ the payoff is
   $$f(F) = F - 100$$ → **5.13**
2. Hold $f(F)$ zero-coupon bonds and $f'(F) = 1$ forward struck at $F$, which costs nothing. The bonds cost
   $$e^{-rT}f(F)$$ → **4.88**
3. The kink at 100 lies below $F$ (slope change $+1$), so buy one 100 put:
   $$P(100)$$ → **5.57**
4. The kink at 110 lies above $F$ (slope change $-1$), so sell one 110 call:
   $$C(110)$$ → **6.04**
5. Total cost of the portfolio around $F$:
   $$4.88 + 5.57 - 6.04$$ → **4.41**
6. It matches the calls-only recipe ($a = 0$), as it must:
   $$C(100) - C(110) = 10.45 - 6.04$$ → **4.41**

## Finitely many strikes

Listed options trade only at a grid of strikes, say every 5. A payoff with kinks between grid points, or with curved pieces, can then be replicated only approximately: the portfolio follows the straight-line interpolation of $f$ between neighbouring strikes. The same limitation affects the density, because $\partial^2 C/\partial K^2$ must be estimated from finitely many prices, and the far tails, where few strikes are quoted, are the least reliable part.

## Summary

- The price of a European payoff $f(S_T)$ is $e^{-rT}\int f(K)\,q(K)\,dK$, with $q$ the risk-neutral density.
- A butterfly scaled by $1/h^2$ prices a narrow spike; in the limit $q(K) = e^{rT}\,\partial^2 C/\partial K^2$, and $\partial C/\partial K = -e^{-rT}\mathbb{Q}(S_T > K)$.
- The density implied by a negative skew has a fatter left tail than the lognormal.
- Carr–Madan writes any payoff as bonds, a forward and options weighted by $f''$; for piecewise-linear payoffs this is one option position per kink, sized by the slope change.
- Different anchors give different portfolios with the same payoff and therefore the same price; with a finite strike grid the replication is approximate.

[Draw a payoff and compare its three replicating portfolios in the Replicate payoff tab of the Payoff lab](https://quantsandbox.dev/payoff?lab=replicate)

## Interactive labs

- [Option Payoff Diagram & Strategy Builder](https://quantsandbox.dev/payoff)
- [Black–Scholes Calculator & Option Greeks Visualizer](https://quantsandbox.dev/black-scholes)

## Practice questions

### 1. Which identity is the Breeden–Litzenberger formula?

- a) $\partial^2 C/\partial K^2 = e^{-rT}q(K)$
- b) $\partial C/\partial K = e^{-rT}q(K)$
- c) $\partial^2 C/\partial S^2 = e^{-rT}q(K)$
- d) $\partial C/\partial K = N(d_1)$

**Answer:** a) $\partial^2 C/\partial K^2 = e^{-rT}q(K)$

The first strike derivative is $-e^{-rT}\mathbb{Q}(S_T > K)$; differentiating once more gives the discounted density. The second derivative in $S$ is gamma, a different object.

### 2. With the flat 20% prices above, the 95/100/105 butterfly costs $C(95) - 2C(100) + C(105) \approx 0.4667$. What estimate of the risk-neutral density $q(100)$ does it give?

**Answer:** 0.01963

Divide by $h^2 = 25$ to get $0.01867 \approx e^{-rT}q(100)$, then undo the discounting: $q(100) \approx e^{0.05} \cdot 0.01867 \approx 0.0196$.

---

Source: https://quantsandbox.dev/guide/derivatives/static-replication

Previous lesson: [Heston Model: Stochastic Volatility and the Smile](https://quantsandbox.dev/guide/derivatives/stochastic-volatility)

Next lesson: [Exotic Options: Barrier, Asian and Digital Options](https://quantsandbox.dev/guide/derivatives/exotic-options)
