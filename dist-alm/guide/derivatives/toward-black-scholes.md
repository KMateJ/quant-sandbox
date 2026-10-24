# Black–Scholes Formula Explained: d1, d2 and N(d2)

How the formula is obtained, what d₁ and d₂ mean, and what the model leaves out. Free interactive lesson with worked examples.

This lesson derives the Black–Scholes price of a European call and put. It puts together three earlier results: pricing as a discounted risk-neutral expectation ("Risk-neutral probabilities"), the log-normal stock price under $\mathbb{Q}$ ("Geometric Brownian motion") and put–call parity ("Put–call parity"). It also connects to "Delta and hedging", since the formula comes with an explicit delta.

## Assumptions

The Black–Scholes model makes the following assumptions. Each one is a simplification, and the last section returns to the ones that matter most.

- The stock follows geometric Brownian motion with constant volatility $\sigma$ and pays no dividends.
- The risk-free rate $r$ is constant and continuously compounded; you can borrow and lend at $r$.
- Trading is continuous, there are no transaction costs or taxes, and short selling is allowed.
- There is no arbitrage.
- The option is European: it can be exercised only at maturity $T$.

Under these assumptions the option can be replicated by continuous delta hedging, so its price is the cost of replication. As in the tree lessons, that cost equals the discounted expected payoff under the risk-neutral measure $\mathbb{Q}$.

## The price as an expectation

For a call with strike $K$ the payoff is $X = (S_T - K)^+$, so

$$
C_0 = e^{-rT}\,\mathbb{E}^{\mathbb{Q}}\left[(S_T - K)^+\right].
$$

Under $\mathbb{Q}$ the stock is GBM with drift $r$. Writing $W_T^{\mathbb{Q}} = \sqrt{T}\,Z$ with $Z \sim N(0,1)$,

$$
S_T = S_0 \exp\!\left( \left(r - \tfrac{1}{2}\sigma^2\right)T + \sigma\sqrt{T}\,Z \right).
$$

## The Black–Scholes differential equation

This expectation can be reached another way, which is how Black and Scholes originally argued. Hold a portfolio that is long one option worth $V(S,t)$ and short $\Delta$ shares. By Itô's lemma the option value changes by

$$
dV = \left( \frac{\partial V}{\partial t} + \tfrac{1}{2}\sigma^2 S^2 \frac{\partial^2 V}{\partial S^2} \right) dt + \frac{\partial V}{\partial S}\,dS.
$$

Choosing $\Delta = \partial V/\partial S$ cancels the random $dS$ term, so the hedged portfolio $\Pi = V - \Delta S$ is riskless and must earn the rate $r$. Setting its return equal to $r\Pi$ gives the **Black–Scholes partial differential equation**:

$$
\frac{\partial V}{\partial t} + \tfrac{1}{2}\sigma^2 S^2 \frac{\partial^2 V}{\partial S^2} + rS\frac{\partial V}{\partial S} - rV = 0.
$$

Every European option on the stock satisfies the same equation; only the terminal condition differs. For the call it is $V(S,T) = (S_T - K)^+$, and solving the PDE with that boundary condition gives exactly the formula derived below. The Feynman–Kac theorem makes the two routes equivalent: it rewrites the solution of this PDE as the discounted risk-neutral expectation.

## Deriving the formula

The computation takes three steps.

1. Find when the option is exercised. $S_T > K$ is equivalent to $Z > -d_2$, where $d_2 = \dfrac{\ln(S_0/K) + (r - \frac{1}{2}\sigma^2)T}{\sigma\sqrt{T}}$.
2. Split the payoff: $(S_T - K)^+ = S_T\,\mathbf{1}_{\{S_T > K\}} - K\,\mathbf{1}_{\{S_T > K\}}$, where $\mathbf{1}$ is 1 if the event happens and 0 otherwise.
3. Take the expectation of each part separately and discount.

The second part is the easy one. Since $Z$ is standard normal and $N$ is symmetric,

$$
\mathbb{Q}(S_T > K) = \mathbb{Q}(Z > -d_2) = N(d_2).
$$

For the first part, write $\varphi$ for the standard normal density. Completing the square in the exponent gives $e^{\sigma\sqrt{T}z - \frac{1}{2}\sigma^2 T}\,\varphi(z) = \varphi(z - \sigma\sqrt{T})$, so

$$
\mathbb{E}^{\mathbb{Q}}\left[S_T\,\mathbf{1}_{\{S_T > K\}}\right] = S_0 e^{rT} \int_{-d_2}^{\infty} \varphi(z - \sigma\sqrt{T})\,dz = S_0 e^{rT}\, N(d_2 + \sigma\sqrt{T}).
$$

Define $d_1 = d_2 + \sigma\sqrt{T}$. Discounting both parts by $e^{-rT}$ gives the **Black–Scholes formula**:

$$
C_0 = S_0\,N(d_1) - K e^{-rT} N(d_2), \qquad d_{1,2} = \frac{\ln(S_0/K) + \left(r \pm \frac{1}{2}\sigma^2\right)T}{\sigma\sqrt{T}}.
$$

The real drift $\mu$ does not appear anywhere. Two investors who disagree about the expected return but agree on $\sigma$ agree on the price.

## Reading the two terms

The formula has the shape "stock received minus strike paid, each weighted by something".

- $N(d_2)$ is the $\mathbb{Q}$-probability that the call is exercised, so $Ke^{-rT}N(d_2)$ is the present value of the expected strike payment.
- $S_0 N(d_1)$ is the present value of receiving the stock in the states where the call is exercised. It is larger than $S_0 N(d_2)$ because exercise happens exactly when $S_T$ is high.
- $N(d_1) = \partial C_0/\partial S_0$ is the call's **delta**: the replicating portfolio holds $N(d_1)$ shares and borrows $Ke^{-rT}N(d_2)$.

The last point is the continuous version of the tree result $C = \Delta S + B$, with $\Delta = N(d_1)$ and $B = -Ke^{-rT}N(d_2)$. Differentiating the formula also produces terms from $d_1$ and $d_2$ depending on $S_0$, but they cancel exactly.

> $C_0 = S_0N(d_1) - Ke^{-rT}N(d_2)$, with $d_2 = d_1 - \sigma\sqrt{T}$. $N(d_2)$ is the risk-neutral exercise probability and $N(d_1)$ is the delta.

## The put

Put–call parity $C_0 - P_0 = S_0 - Ke^{-rT}$ holds in any arbitrage-free model, so it holds here. Solving for $P_0$ and using $1 - N(x) = N(-x)$:

$$
P_0 = K e^{-rT} N(-d_2) - S_0\,N(-d_1).
$$

The put's delta is $N(d_1) - 1 = -N(-d_1)$, between $-1$ and $0$.

## A worked example

Take $S_0 = 100$, $K = 100$, $r = 5\%$, $\sigma = 20\%$, $T = 1$. Then

$$
d_1 = \frac{\ln 1 + (0.05 + 0.02)}{0.2} = 0.35, \qquad d_2 = 0.35 - 0.2 = 0.15.
$$

From normal tables $N(0.35) \approx 0.6368$ and $N(0.15) \approx 0.5596$. The discount factor is $e^{-0.05} \approx 0.9512$. So $C_0 \approx 100 \cdot 0.6368 - 95.12 \cdot 0.5596 \approx 10.45$, and by parity $P_0 \approx 10.45 - (100 - 95.12) \approx 5.57$. The call has delta 0.637 and a 56% risk-neutral chance of being exercised.

### Worked example: An in-the-money call over six months

1. Take $S_0 = 110$, $K = 100$, $r = 5\%$, $\sigma = 25\%$ and $T = 0.5$, so $\sigma\sqrt{T} \approx 0.1768$.
   $$d_1 = \frac{\ln 1.1 + (0.05 + 0.03125) \cdot 0.5}{0.1768}$$ → **0.769**
2. Subtract $\sigma\sqrt{T}$:
   $$d_2 = d_1 - \sigma\sqrt{T}$$ → **0.5922**
3. The delta:
   $$N(d_1)$$ → **0.779**
4. The risk-neutral probability of exercise:
   $$N(d_2)$$ → **0.7231**
5. The price, with $Ke^{-rT} = 100\,e^{-0.025} \approx 97.53$:
   $$C_0 = 110 \cdot 0.779 - 97.53 \cdot 0.7231$$ → **15.17**

## How the price depends on the inputs

- **Stock price** $S_0$: the call rises and the put falls; the slopes are the deltas.
- **Volatility** $\sigma$: both prices rise. The holder gains from large moves on one side and loses at most the premium on the other.
- **Maturity** $T$: without dividends the call rises with $T$; more time means more spread in $S_T$ and a smaller present value of the strike.
- **Rate** $r$: the call rises and the put falls, because the strike is paid later and discounted more.

Two limits check the formula. As $\sigma \to 0$ the stock grows deterministically at $r$ and $C_0 \to (S_0 - Ke^{-rT})^+$, the lower bound from "Put–call parity". As $T \to 0$ the price tends to the payoff $(S_0 - K)^+$.

The figure plots the price against $S_0$ for $K = 100$, with the payoff at maturity dashed. Switch between call and put. Raise $\sigma$ or $T$ and note that the curve lifts away from the payoff, most near the strike (a deep in-the-money put is the exception: its value can sit below the payoff); lower them and the curve collapses onto the payoff. The readouts at $S_0 = 100$ show the price, $d_1$, $d_2$, $N(d_1)$ and $N(d_2)$, so you can repeat the worked example.

*[Interactive figure: black scholes price](https://quantsandbox.dev/guide/derivatives/toward-black-scholes)*

## Limitations of the model

Market option prices can be turned back into a volatility: the **implied volatility** is the $\sigma$ that makes the Black–Scholes formula match the observed price. If the model were exact, every option on the same stock would have the same implied volatility. In practice, implied volatility varies with strike (the **volatility smile** or skew, with low strikes usually more expensive) and with maturity.

The main causes are assumptions that fail: volatility is not constant but changes randomly and tends to rise when prices fall; prices sometimes jump; and returns have fatter tails than the normal distribution. Models such as Heston keep the risk-neutral pricing framework but let the volatility follow its own random process, which produces a smile. Black–Scholes remains the common language: prices are quoted as implied volatilities, and its delta is the starting point for hedging.

## Summary

- Under the Black–Scholes assumptions, $C_0 = e^{-rT}\mathbb{E}^{\mathbb{Q}}[(S_T - K)^+]$ with $S_T$ log-normal and drift $r$.
- The result is $C_0 = S_0N(d_1) - Ke^{-rT}N(d_2)$; the put follows from parity.
- $N(d_2)$ is the risk-neutral exercise probability, $N(d_1)$ the delta; the real drift $\mu$ does not enter.
- Prices rise with $\sigma$; the volatility smile shows that a single constant $\sigma$ does not fit the market, which the Heston lab addresses.

[Explore prices and Greeks in the Black–Scholes lab](https://quantsandbox.dev/black-scholes)

## Interactive labs

- [Black–Scholes Calculator & Option Greeks Visualizer](https://quantsandbox.dev/black-scholes)
- [Heston Stochastic Volatility Model Simulator](https://quantsandbox.dev/heston)

## Practice questions

### 1. In the Black–Scholes formula, what does $N(d_2)$ measure?

- a) The risk-neutral probability that the call finishes in the money
- b) The real-world probability that the call finishes in the money
- c) The call's delta
- d) The discount factor $e^{-rT}$

**Answer:** a) The risk-neutral probability that the call finishes in the money

$N(d_2) = \mathbb{Q}(S_T > K)$, a probability under $\mathbb{Q}$, not under the real measure. The delta is $N(d_1)$.

### 2. Price a European call with $S_0 = K = 100$, $r = 5\%$, $\sigma = 20\%$ and $T = 1$.

**Answer:** 10.45

$d_1 = 0.35$, $d_2 = 0.15$, so $C_0 = 100\,N(0.35) - 100\,e^{-0.05}N(0.15) \approx 63.68 - 53.23 = 10.45$.

---

Source: https://quantsandbox.dev/guide/derivatives/toward-black-scholes

Previous lesson: [Geometric Brownian Motion: The Stock Price Model](https://quantsandbox.dev/guide/derivatives/gbm)

Next lesson: [Option Greeks Explained: Gamma, Vega, Theta and Rho](https://quantsandbox.dev/guide/derivatives/greeks)
