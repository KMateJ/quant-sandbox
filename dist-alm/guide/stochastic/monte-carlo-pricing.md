# Monte Carlo Option Pricing and Standard Error

Estimating option prices by simulation: standard error, confidence intervals and convergence to Black–Scholes. Free interactive lesson with worked examples.

Many quantities in finance are expected values: the price of an option is a discounted expected payoff, a risk measure is a tail probability. When the expectation has no closed form, it can be estimated by **Monte Carlo simulation**: draw many random outcomes and average them. This lesson explains why the average works, how fast it converges, and how to price a European call this way, using the stock price solution from "Itô's lemma".

## Expectations as long-run averages

Let $X$ be a random variable whose mean $\mathbb{E}[X]$ we want. Draw $N$ independent copies $X_1, \dots, X_N$ with the same distribution and form the **sample mean**

$$
\hat\mu_N = \frac{1}{N} \sum_{i=1}^{N} X_i.
$$

The **law of large numbers** says that $\hat\mu_N \to \mathbb{E}[X]$ as $N \to \infty$. This is the entire idea of Monte Carlo: replace an integral that is hard to compute by an average over simulated outcomes that are easy to generate.

The estimator is **unbiased**: $\mathbb{E}[\hat\mu_N] = \mathbb{E}[X]$ for every $N$. Any single run is off by a random error, but the error has no systematic direction.

## Standard error

Let $s$ be the standard deviation of one draw $X_i$. Since the draws are independent, the variance of their sum is $N s^2$, and dividing by $N$ gives

$$
\operatorname{Var}(\hat\mu_N) = \frac{s^2}{N}, \qquad \operatorname{SE} = \operatorname{sd}(\hat\mu_N) = \frac{s}{\sqrt{N}}.
$$

This is the **standard error** of the estimate. It falls like $1/\sqrt{N}$, the same square-root law that governed the random walk in "Random walks and Brownian motion". The consequence is sobering: to make the error 10 times smaller you need 100 times as many simulations.

> Monte Carlo error: $\operatorname{SE} = s/\sqrt{N}$. One extra digit of accuracy costs a hundredfold more draws.

## Confidence intervals

By the central limit theorem, for large $N$ the estimate $\hat\mu_N$ is approximately normal around the true mean with standard deviation $\operatorname{SE}$. The true value $s$ is unknown, so we use the sample standard deviation of the draws in its place. An approximate **95% confidence interval** for $\mathbb{E}[X]$ is

$$
\hat\mu_N \pm 1.96\,\frac{s}{\sqrt{N}}.
$$

If the whole experiment were repeated many times, about 95% of such intervals would contain the true mean. Always report a Monte Carlo estimate together with its interval: the estimate alone says nothing about how much to trust it.

## Pricing a European call

"Risk-neutral probabilities" showed that a derivative's price is its discounted expected payoff under the measure $\mathbb{Q}$. For a European call with strike $K$ and maturity $T$,

$$
C_0 = e^{-rT}\,\mathbb{E}^{\mathbb{Q}}\big[\max(S_T - K,\ 0)\big].
$$

Under $\mathbb{Q}$ the stock follows GBM with drift $r$. By Itô's lemma its terminal value is exact: $S_T = S_0 \exp((r - \tfrac12\sigma^2)T + \sigma W_T)$, and $W_T = \sqrt{T}\,Z$ with $Z$ standard normal. No time-stepping is needed for a payoff that depends only on $S_T$. The algorithm is:

1. Draw $N$ independent standard normal numbers $Z_1, \dots, Z_N$.
2. Compute terminal prices $S_T^{(i)} = S_0 \exp\big((r - \tfrac12\sigma^2)T + \sigma\sqrt{T}\,Z_i\big)$.
3. Compute payoffs $\max(S_T^{(i)} - K, 0)$ and discount each by $e^{-rT}$.
4. Average the discounted payoffs; their sample standard deviation divided by $\sqrt{N}$ is the standard error.

The figure runs this algorithm in front of you for $S_0 = K = 100$, $r = 5\%$, $\sigma = 20\%$ and $T = 1$. Each draw of $S_T$ drops into a histogram of terminal prices; the bins to the right of the strike line are tinted, because only there does the call pay. Press +1 a few times and watch single draws land, mostly near 100 and some far out. Then press Play: draws arrive faster and faster, the histogram takes the skewed log-normal shape, and the strip below shows the running estimate with its 95% band narrowing around the Black–Scholes price of 10.45. The readouts give the number of draws, the estimate, its standard error and the share of draws that end in the money, which settles near $N(d_2) \approx 0.56$. Reset starts a new sample.

*[Interactive figure: mc histogram](https://quantsandbox.dev/guide/stochastic/monte-carlo-pricing)*

## A small worked example

Take $S_0 = 100$, $K = 100$, $r = 5\%$, $\sigma = 20\%$, $T = 1$. Then $(r - \tfrac12\sigma^2)T = 0.03$ and $\sigma\sqrt{T} = 0.2$. Suppose five draws are $Z = 0.5,\ -1.2,\ 1.5,\ 0.1,\ -0.3$. The terminal prices are $100\,e^{0.03 + 0.2Z}$:

- $Z = 0.5$: $S_T = 100\,e^{0.13} \approx 113.88$, payoff $13.88$.
- $Z = -1.2$: $S_T = 100\,e^{-0.21} \approx 81.06$, payoff $0$.
- $Z = 1.5$: $S_T = 100\,e^{0.33} \approx 139.10$, payoff $39.10$.
- $Z = 0.1$: $S_T = 100\,e^{0.05} \approx 105.13$, payoff $5.13$.
- $Z = -0.3$: $S_T = 100\,e^{-0.03} \approx 97.04$, payoff $0$.

The average payoff is $58.11 / 5 \approx 11.62$, and discounting gives $11.62\,e^{-0.05} \approx 11.05$. The Black–Scholes price for these inputs is $10.45$. Five draws are far too few: the estimate is in the right region, but its error is large.

### Worked example: One more draw, step by step

1. With the same inputs ($S_0 = K = 100$, $r = 5\%$, $\sigma = 20\%$, $T = 1$), take the draw $Z = 0.8$. Terminal price.
   $$S_T = S_0\,e^{(r - \frac12\sigma^2)T + \sigma\sqrt{T}\,Z}$$ → **120.92**
2. Payoff of the call.
   $$(S_T - K)^+$$ → **20.92**
3. Discounted payoff, this draw's contribution to the average.
   $$e^{-rT}(S_T - K)^+$$ → **19.9**

## Comparing with Black–Scholes

For these inputs the standard deviation of one discounted payoff is about $s \approx 14.72$, larger than the price itself, because most of the value comes from a minority of paths that end far in the money. The standard error and the half-width of the 95% interval are therefore

- $N = 100$: $\operatorname{SE} \approx 1.47$, interval $\pm 2.89$.
- $N = 1000$: $\operatorname{SE} \approx 0.47$, interval $\pm 0.91$.
- $N = 5000$: $\operatorname{SE} \approx 0.21$, interval $\pm 0.41$.

Even 5000 paths pin the price down only to within about $\pm 0.41$ of the Black–Scholes value $10.45$. At $\sigma = 40\%$ the price rises to about $18.02$ and the payoff standard deviation to about $31.29$, so the interval at $N = 5000$ widens to about $\pm 0.87$: more volatile payoffs need more draws for the same accuracy.

The figure prices this call ($S_0 = 100$, $K = 100$, $r = 5\%$, $T = 1$) with terminal prices drawn exactly from GBM under $\mathbb{Q}$. It plots the running Monte Carlo estimate against the number of simulations up to 5000, with the band $\pm 1.96\,\operatorname{SE}$ around it and the Black–Scholes price as a horizontal line. Press "New sample" a few times: the early part of the curve jumps around, while the band narrows like $1/\sqrt{N}$ and nearly always contains the line. Move the $\sigma$ slider and note that the band widens. The readouts at $N = 5000$ give the estimate, its standard error, the Black–Scholes price and the error.

*[Interactive figure: monte carlo convergence](https://quantsandbox.dev/guide/stochastic/monte-carlo-pricing)*

For a European call the closed form is obviously better. Monte Carlo pays off for payoffs that depend on the whole path (Asian or barrier options), for many underlyings at once, and for models such as Heston where no simple formula exists. The flexibility is the same in all cases; only the payoff function changes.

## Variance reduction

Since the error is $s/\sqrt{N}$, there are two ways to improve it: raise $N$, or lower $s$. Techniques that lower $s$ are called **variance reduction**. The simplest is **antithetic variates**: for every draw $Z$ also use $-Z$, and average the two payoffs. The pair moves in opposite directions, so much of their noise cancels. Another is a **control variate**: simulate alongside a quantity whose mean is known exactly, such as the discounted stock price with mean $S_0$, and correct the estimate by the observed error in that quantity.

## Summary

- Monte Carlo estimates an expectation by the average of $N$ independent simulated outcomes; the law of large numbers makes it converge.
- The standard error is $s/\sqrt{N}$: halving the error needs four times as many draws.
- A 95% confidence interval is the estimate $\pm 1.96\,s/\sqrt{N}$.
- A European call is priced by averaging $e^{-rT}\max(S_T - K, 0)$ over risk-neutral draws of $S_T = S_0 e^{(r - \sigma^2/2)T + \sigma\sqrt{T}Z}$; the result converges to Black–Scholes.
- Its real strength is flexibility: path-dependent payoffs and models without closed forms.

> Monte Carlo price $= e^{-rT} \times$ average payoff, reported with its standard error $s/\sqrt{N}$.

[Watch the Monte Carlo estimate and its confidence interval converge in the Monte Carlo lab](https://quantsandbox.dev/monte-carlo)

## Interactive labs

- [Monte Carlo Option Pricing Simulator](https://quantsandbox.dev/monte-carlo)
- [Geometric Brownian Motion (GBM) Simulator](https://quantsandbox.dev/gbm)

## Practice questions

### 1. With $N = 10\,000$ draws the standard error of a price estimate is $0.20$. How many draws give a standard error of $0.05$?

**Answer:** 160000

The standard error falls like $1/\sqrt{N}$. Quartering it needs $4^2 = 16$ times as many draws: $160\,000$.

### 2. A Monte Carlo estimate is $10.40$ with standard error $0.15$. What is the upper end of the 95% confidence interval?

**Answer:** 10.694

$10.40 + 1.96 \cdot 0.15 = 10.694$; the interval is $[10.106,\ 10.694]$.

---

Source: https://quantsandbox.dev/guide/stochastic/monte-carlo-pricing

Previous lesson: [Girsanov's Theorem and Change of Measure Explained](https://quantsandbox.dev/guide/stochastic/change-of-measure)

Next lesson: [Euler–Maruyama Scheme: Simulating SDEs Step by Step](https://quantsandbox.dev/guide/stochastic/sde-simulation)
