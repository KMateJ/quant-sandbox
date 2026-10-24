# Reflection Principle: Maximum of Brownian Motion

The strong Markov property, the law of the running maximum and the density of the first passage time. Free interactive lesson with worked examples.

This lesson computes the distribution of the running maximum of Brownian motion and of the first time it reaches a given level. The tool is the reflection principle, which rests on the strong Markov property from "Properties of Brownian motion" and on the notion of a stopping time from "Filtrations, adapted processes and stopping times". The results are exact closed forms, and they are the basis of barrier option pricing.

## Running maximum and first passage time

Let $W$ be a standard Brownian motion with natural filtration $(\mathcal{F}^W_t)$ and fix a level $a > 0$. Define the **running maximum** and the **first passage time**

$$
M_t = \max_{0 \le s \le t} W_s, \qquad \tau_a = \inf\{t \ge 0 : W_t = a\}.
$$

The maximum exists because the path is continuous on the compact interval $[0, t]$. Since $W_0 = 0 < a$ and paths are continuous, the intermediate value theorem gives the identity of events

$$
\{\tau_a \le t\} = \{M_t \ge a\}, \qquad W_{\tau_a} = a \ \text{ on } \{\tau_a < \infty\}.
$$

$\tau_a$ is a stopping time. By continuity, $M_t \ge a$ holds exactly when for every $n$ some rational $q \in [0, t]$ has $W_q > a - 1/n$, so

$$
\{\tau_a \le t\} = \bigcap_{n \ge 1}\ \bigcup_{q \in \mathbb{Q} \cap [0,t]} \{W_q > a - 1/n\} \in \mathcal{F}^W_t,
$$

a countable combination of events that are each known at time $t$. By recurrence, $\tau_a < \infty$ almost surely; this also follows from the formula below.

## The reflection argument

Define the **reflected path**: follow $W$ until it first reaches $a$, then mirror it in the line $y = a$:

$$
\widetilde W_t = \begin{cases} W_t, & t \le \tau_a, \\ 2a - W_t, & t > \tau_a. \end{cases}
$$

**Claim:** $\widetilde W$ is again a standard Brownian motion. This is where the strong Markov property enters. Applied at the stopping time $\tau_a$, it says that $B_s = W_{\tau_a + s} - a$, $s \ge 0$, is a Brownian motion independent of $\mathcal{F}_{\tau_a}$, and in particular of the stopped path $(W_{t \wedge \tau_a})_{t \ge 0}$. By symmetry $-B$ is also a Brownian motion independent of $\mathcal{F}_{\tau_a}$. Hence the pairs (stopped path, $B$) and (stopped path, $-B$) have the same joint law. $W$ is obtained from the first pair by gluing $a + B$ onto the stopped path at $\tau_a$, and $\widetilde W$ from the second pair by the same gluing map, so $W$ and $\widetilde W$ have the same law.

Both requirements are essential. At a fixed time $s$ the ordinary Markov property would suffice, but $\tau_a$ is random. And the argument would fail for a random time that looks ahead, such as the time at which the maximum over $[0, 1]$ is attained: after that time the path is forced to stay below its maximum, so it is not a fresh Brownian motion.

Now count paths. $\widetilde W$ reaches $a$ at the same time $\tau_a$ as $W$, and on $\{\tau_a \le t\}$ we have $\widetilde W_t = 2a - W_t$, so $W_t < a$ exactly when $\widetilde W_t > a$. Using that $\widetilde W$ has the law of $W$, and that $\{W_t > a\} \subset \{\tau_a \le t\}$,

$$
\mathbb{P}(M_t \ge a,\ W_t < a) = \mathbb{P}(\tau_a \le t,\ \widetilde W_t > a) = \mathbb{P}(\tau_a \le t,\ W_t > a) = \mathbb{P}(W_t > a).
$$

Since $\mathbb{P}(W_t = a) = 0$, splitting $\{M_t \ge a\}$ by the sign of $W_t - a$ gives the theorem.

> Reflection principle: for $a > 0$ and $t > 0$, $\mathbb{P}(M_t \ge a) = 2\,\mathbb{P}(W_t \ge a) = 2\big(1 - \Phi(a/\sqrt{t})\big)$. In particular $M_t$ has the same law as $|W_t|$.

The last statement holds because $\mathbb{P}(|W_t| \ge a) = 2\,\mathbb{P}(W_t \ge a)$ for $a > 0$. A fair picture is a mirror placed at height $a$: every path that touches $a$ and ends below it has a mirror twin that ends above it, equally likely, so touching paths split evenly between the two sides. For the coin-flip walk the same argument with steps of $\pm 1$ is exact and is André's classical solution of the ballot problem.

## Worked numbers

Take $a = 1$, $t = 1$. Then $\mathbb{P}(W_1 \ge 1) = 1 - \Phi(1) \approx 0.1587$, and

$$
\mathbb{P}(M_1 \ge 1) = 2\big(1 - \Phi(1)\big) \approx 0.3173.
$$

About one path in three reaches level 1 within one unit of time, although only one in six ends above it. Since $M_1 \sim |W_1|$, the expected maximum is $\mathbb{E}[M_1] = \mathbb{E}|W_1| = \sqrt{2/\pi} \approx 0.7979$.

Application: model the log price as driftless, $\ln(S_t/S_0) = \sigma W_t$, with $S_0 = 100$ and $\sigma = 20\%$. The probability that the stock touches 120 within one year is the probability that $W$ reaches $a = \ln(1.2)/0.2 \approx 0.9116$ by $t = 1$:

$$
\mathbb{P}\Big(\max_{s \le 1} S_s \ge 120\Big) = 2\big(1 - \Phi(0.9116)\big) \approx 0.362.
$$

With a drift $\nu$ in the log price, $X_s = \nu s + \sigma W_s$, the reflection principle no longer applies directly, because the drifted process is not symmetric. The answer, obtained in "Change of measure and Girsanov's theorem" by removing the drift, is

$$
\mathbb{P}\Big(\max_{s \le T} X_s \ge m\Big) = 1 - \Phi\Big(\frac{m - \nu T}{\sigma\sqrt{T}}\Big) + e^{2\nu m/\sigma^2}\,\Phi\Big(\frac{-m - \nu T}{\sigma\sqrt{T}}\Big).
$$

For $\nu = 0$ it reduces to $2(1 - \Phi(m/(\sigma\sqrt{T})))$. With $\nu = -\sigma^2/2 = -0.02$ (zero expected stock return) the touching probability above becomes about $0.330$.

The figure fixes $T = 1$ and lets you set the level $a$ between 0.2 and 2.5 (default 1). It draws one sample path that reaches $a$ (paths are resampled until one does), the line $y = a$, and, dashed, the reflection of the path after $\tau_a$; "New path" draws another. The readouts come from 20 000 simulated paths with 500 steps each: the share of paths with maximum at least $a$, the exact value $2(1 - \Phi(a))$, and the share with $W_1 \ge a$. The first is close to twice the third. It is also slightly below the exact value, because the simulated maximum is taken only over the 500 grid points and misses crossings that happen between them; at $a = 1$ it comes out near $0.30$ rather than $0.317$. The lesson "The Brownian bridge" computes the probability of such a hidden crossing.

*[Interactive figure: reflection max](https://quantsandbox.dev/guide/stochastic/reflection-principle)*

## The law of the first passage time

Because $\{\tau_a \le t\} = \{M_t \ge a\}$, the reflection principle gives the distribution function of $\tau_a$, and differentiating in $t$ (using $\tfrac{d}{dt}\,a t^{-1/2} = -\tfrac12 a t^{-3/2}$) gives its density:

$$
\mathbb{P}(\tau_a \le t) = 2\Big(1 - \Phi\Big(\frac{a}{\sqrt{t}}\Big)\Big), \qquad f_{\tau_a}(t) = \frac{a}{\sqrt{2\pi t^3}}\,e^{-a^2/(2t)}, \quad t > 0.
$$

This is the **Lévy distribution**. Two facts follow:

- $\mathbb{P}(\tau_a < \infty) = \lim_{t \to \infty} 2(1 - \Phi(a/\sqrt{t})) = 2(1 - \Phi(0)) = 1$: every level is reached almost surely.
- $\mathbb{E}[\tau_a] = \infty$: for large $t$, $t\,f_{\tau_a}(t) \approx a\,(2\pi)^{-1/2}\,t^{-1/2}$, which is not integrable on $[1, \infty)$.

The level is certain to be reached, but the expected waiting time is infinite. The median is finite: $\mathbb{P}(\tau_a \le t) = \tfrac12$ when $a/\sqrt{t} = \Phi^{-1}(0.75) \approx 0.6745$, that is $t \approx 2.198\,a^2$. The factor $a^2$ is scaling at work: $\tau_a$ has the same law as $a^2\tau_1$. This also explains a point from "Conditional expectation and martingales": $W$ is a martingale with $W_0 = 0$, yet $W_{\tau_a} = a$. Stopping at $\tau_a$ turns a fair game into a sure gain only because $\tau_a$ is unbounded with infinite mean, so the optional stopping theorem does not apply.

## Joint law of the maximum and the endpoint

The same reflection gives more. For $a \ge 0$ and $x \le a$, on $\{\tau_a \le t\}$ the condition $W_t \le x$ is equivalent to $\widetilde W_t \ge 2a - x$, and $2a - x \ge a$ forces $\tau_a \le t$. Hence

$$
\mathbb{P}(M_t \ge a,\ W_t \le x) = \mathbb{P}(W_t \ge 2a - x) = 1 - \Phi\Big(\frac{2a - x}{\sqrt{t}}\Big), \qquad a \ge 0,\ x \le a.
$$

Differentiating in $a$ and $x$ gives the joint density

$$
f_{M_t, W_t}(m, w) = \frac{2(2m - w)}{\sqrt{2\pi t^3}}\,\exp\Big(-\frac{(2m - w)^2}{2t}\Big), \qquad m \ge 0,\ w \le m.
$$

For example, the probability that the path reaches 1 by time 1 but ends at or below 0 is $\mathbb{P}(W_1 \ge 2) = 1 - \Phi(2) \approx 0.0228$.

This joint law is what barrier options need. An up-and-out call pays $(S_T - K)^+$ only if the price stays below a barrier $H$ throughout $[0, T]$. Under the Black–Scholes model the log price is a drifted Brownian motion, and the price of the option is a discounted integral of the payoff against the joint density of the maximum and the endpoint, adjusted for the drift as above. The closed-form barrier prices used in practice come from exactly this computation.

### Worked example: Hitting the level 1

1. The standard normal CDF at 1.
   $$\Phi(1)$$ → **0.8413**
2. By the reflection principle the maximum up to $t = 1$ reaches 1 with twice the probability that $W_1$ ends above 1.
   $$\mathbb{P}\big(\max_{t \le 1} W_t \ge 1\big) = 2\big(1 - \Phi(1)\big)$$ → **0.3173**
3. $\{\tau_1 \le 1\}$ is the same event as $\{\max_{t \le 1} W_t \ge 1\}$, so it has the same probability.
   $$\mathbb{P}(\tau_1 \le 1) = 2\big(1 - \Phi(1/\sqrt{1})\big)$$ → **0.3173**
4. With four times as long to wait, the argument of $\Phi$ halves.
   $$\mathbb{P}(\tau_1 \le 4) = 2\big(1 - \Phi(1/\sqrt{4})\big)$$ → **0.6171**

## Summary

- $\tau_a = \inf\{t : W_t = a\}$ is a stopping time and $\{\tau_a \le t\} = \{M_t \ge a\}$.
- The strong Markov property at $\tau_a$ makes the path reflected after $\tau_a$ a Brownian motion; this gives $\mathbb{P}(M_t \ge a) = 2(1 - \Phi(a/\sqrt{t}))$ and $M_t \sim |W_t|$.
- $\tau_a$ has the Lévy density $a(2\pi t^3)^{-1/2}e^{-a^2/(2t)}$: it is finite almost surely but has infinite mean.
- $\mathbb{P}(M_t \ge a, W_t \le x) = 1 - \Phi((2a - x)/\sqrt{t})$ for $x \le a$; this joint law prices barrier options.
- On a discrete time grid the simulated maximum is biased low because crossings between grid points are missed.

[Reflect simulated paths at a level in the Stochastic Models studio](https://quantsandbox.dev/stochastic-models/reflection)

## Interactive labs

- [Stochastic Calculus Course: Random Walks to Brownian Motion](https://quantsandbox.dev/stochastic-models)

## Practice questions

### 1. What is $\mathbb{P}(M_4 \ge 1)$, the probability that Brownian motion reaches level 1 by time 4?

**Answer:** 0.6171

$\mathbb{P}(M_4 \ge 1) = 2\big(1 - \Phi(1/\sqrt{4})\big) = 2\big(1 - \Phi(0.5)\big) \approx 2 \times 0.3085 = 0.6171$.

### 2. For $a > 0$, which statement about $\tau_a = \inf\{t \ge 0 : W_t = a\}$ is correct?

- a) $\mathbb{P}(\tau_a < \infty) = 1$ and $\mathbb{E}[\tau_a] = a^2$
- b) $\mathbb{P}(\tau_a < \infty) = 1$ and $\mathbb{E}[\tau_a] = \infty$
- c) $\mathbb{P}(\tau_a < \infty) = \tfrac12$ and $\mathbb{E}[\tau_a] = \infty$
- d) $\mathbb{P}(\tau_a < \infty) = 2(1 - \Phi(a))$

**Answer:** b) $\mathbb{P}(\tau_a < \infty) = 1$ and $\mathbb{E}[\tau_a] = \infty$

Letting $t \to \infty$ in $2(1 - \Phi(a/\sqrt{t}))$ gives 1, while the Lévy density decays only like $t^{-3/2}$, so $t\,f_{\tau_a}(t)$ is not integrable and the mean is infinite. The value $2(1 - \Phi(a))$ is $\mathbb{P}(\tau_a \le 1)$.

### 3. Compute $\mathbb{P}(M_1 \ge 1,\ W_1 \le 0)$.

**Answer:** 0.0228

With $a = 1$, $x = 0$: $\mathbb{P}(M_1 \ge 1,\ W_1 \le 0) = \mathbb{P}(W_1 \ge 2a - x) = \mathbb{P}(W_1 \ge 2) = 1 - \Phi(2) \approx 0.0228$.

---

Source: https://quantsandbox.dev/guide/stochastic/reflection-principle

Previous lesson: [Brownian Motion Properties: Scaling and Time Inversion](https://quantsandbox.dev/guide/stochastic/brownian-properties)

Next lesson: [Brownian Bridge: Definition, Mean and Variance](https://quantsandbox.dev/guide/stochastic/brownian-bridge)
