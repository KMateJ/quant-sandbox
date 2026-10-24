# Law of Large Numbers and Central Limit Theorem

Why averages settle down, how fast, and why the normal distribution appears: the two theorems behind Monte Carlo and the Brownian limit.

Almost every simulation in this course ends by averaging. A Monte Carlo price is an average of discounted payoffs, a sample volatility is an average of squared returns, and the Brownian motion of "Random walks and Brownian motion" is the limit of a rescaled sum of coin flips. Two theorems explain why averages are so well behaved: the **law of large numbers** says that an average settles down, and the **central limit theorem** says how it fluctuates around the value it settles on. This lesson states both with their hypotheses, proves the simpler one, and uses a figure to show how quickly the second takes hold. The sample means and variances of "Returns and volatility" are the first averages you met.

## Averages of independent draws

Let $X_1, X_2, \dots$ be independent, identically distributed (i.i.d.) random variables with mean $\mu$ and a finite variance $\sigma^2$. The **sample mean** of the first $n$ is $\bar X_n = (X_1 + \cdots + X_n)/n$. Linearity of expectation, and the fact that variances of independent variables add, give two facts that everything below rests on:

$$
E[\bar X_n] = \mu, \qquad \operatorname{Var}(\bar X_n) = \frac{\sigma^2}{n}.
$$

The average is right on average, and its standard deviation $\sigma/\sqrt{n}$, called the **standard error**, shrinks like $1/\sqrt{n}$. Nothing more is assumed yet. The rest of the lesson asks what that shrinking implies.

## The weak law of large numbers

**Theorem (weak law).** For every $\varepsilon > 0$, $P(|\bar X_n - \mu| > \varepsilon) \to 0$ as $n \to \infty$. One says that $\bar X_n$ converges to $\mu$ **in probability**. The proof is Chebyshev's inequality, $P(|Y - E[Y]| \ge \varepsilon) \le \operatorname{Var}(Y)/\varepsilon^2$, applied to $Y = \bar X_n$:

$$
P(|\bar X_n - \mu| \ge \varepsilon) \le \frac{\operatorname{Var}(\bar X_n)}{\varepsilon^2} = \frac{\sigma^2}{n\,\varepsilon^2} \xrightarrow[n \to \infty]{} 0.
$$

Chebyshev's bound is crude, but it needs nothing beyond a finite variance, and the shrinking variance does all the work.

## The strong law

**Theorem (strong law).** If $E|X_i| < \infty$, then $P(\bar X_n \to \mu) = 1$. Here "with probability one", or **almost surely**, means that the sequences of draws for which the averages fail to settle form a set of probability zero. The weak law controls each fixed $n$ separately. The strong law controls the whole path of running averages as $n$ grows, and that is what a single long simulation relies on. It does not even need a finite variance, only a finite mean. We state it without proof.

## The central limit theorem

The laws say where the average ends up, not how it is distributed around that value. To see the shape, standardise it, so that it has mean 0 and variance 1 for every $n$:

$$
Z_n = \frac{\bar X_n - \mu}{\sigma/\sqrt{n}} = \frac{X_1 + \cdots + X_n - n\mu}{\sigma\sqrt{n}}.
$$

**Theorem (central limit theorem).** If the $X_i$ are i.i.d. with finite mean $\mu$ and finite, positive variance $\sigma^2$, then for every $z$

$$
P(Z_n \le z) \to \Phi(z) \quad (n \to \infty),
$$

where $\Phi$ is the standard normal distribution function. The hypotheses matter: independence, a common distribution, and a finite variance. The source distribution is otherwise arbitrary, which is why the walk of "Random walks and Brownian motion", rescaled by $\sqrt{n}$, has a normal limit even though its steps are coin flips. In practice the theorem is used as the approximation $\bar X_n \approx N(\mu, \sigma^2/n)$ for large $n$.

## How fast: the Berry–Esseen bound

The theorem is a statement about a limit. For a finite $n$ it is an approximation, and **Berry–Esseen** measures its error. If $\rho_3 = E|X_i - \mu|^3$ is finite, then

$$
\sup_z \left| P(Z_n \le z) - \Phi(z) \right| \le \frac{C\,\rho_3}{\sigma^3\sqrt{n}}, \qquad C \le 0.4748.
$$

The error shrinks like $1/\sqrt{n}$ and is larger when $\rho_3/\sigma^3$ is large, that is, for skewed or heavy-tailed sources. It equals about 1.30 for the uniform law and $12/e - 2 \approx 2.41$ for the exponential law.

The figure averages $n$ draws from the source you choose, 4,000 times, standardises each average and draws the histogram against the standard normal density. The first readout is the **Kolmogorov distance**, the largest gap between the two distribution functions. With the exponential source and $n = 10$ it is about 0.05, and at $n = 100$ about 0.02, which is close to the 0.014 that sampling noise alone produces with 4,000 averages. Switch to the Bernoulli source with $p = 0.1$, a very skewed coin: the distance is about 0.24 at $n = 10$ and still about 0.09 at $n = 100$. Berry–Esseen is conservative, since for the exponential source at $n = 10$ it would allow 0.36, but its message is the one the figure shows: skewed sources converge more slowly. The second readout, the simulated standard deviation of the average, matches $\sigma/\sqrt{n}$ at every $n$, which is the weak law at work.

*[Interactive figure: clt convergence](https://quantsandbox.dev/guide/stochastic/law-of-large-numbers-clt)*

## Where the theorems are used

A Monte Carlo price is a sample mean $\bar X_n$ of discounted payoffs. The strong law says that it converges to the true price. The central limit theorem gives the error bar: the estimate lies within $\pm 1.96\,\sigma/\sqrt{n}$ of the truth in about 95% of runs, which is the band that returns when the track prices options by simulation. Because the error falls like $1/\sqrt{n}$, every extra correct digit costs a hundred times as many draws.

### Worked example: The error bar of a Monte Carlo estimate

1. Payoffs with standard deviation 2, averaged over 10,000 draws: the standard error.
   $$\frac{\sigma}{\sqrt{n}} = \frac{2}{\sqrt{10\,000}}$$ → **0.02**
2. The 95% half-width is 1.96 standard errors.
   $$1.96 \times 0.02$$ → **0.0392**
3. To halve the half-width the standard error must halve, so the draws must quadruple.
   $$n_{\text{new}} = 4 \times 10\,000$$ → **40000**

The same theorem is behind the Brownian limit. A random walk with steps of mean 0 and variance 1, observed after $n$ steps and divided by $\sqrt{n}$, is a standardised sum, so its distribution at a fixed time is approximately normal. Brownian motion is the continuous-time object whose every time slice has exactly that normal distribution.

## Summary

- The sample mean of i.i.d. draws has mean $\mu$ and standard error $\sigma/\sqrt{n}$.
- The weak law (by Chebyshev) says the average converges in probability; the strong law says the whole sequence of averages converges almost surely, needing only a finite mean.
- The central limit theorem says the standardised average becomes normal, whatever the source, provided the variance is finite.
- Berry–Esseen bounds the error by a constant times $1/\sqrt{n}$; skewed sources converge more slowly.

> The next lesson, "Probability spaces, σ-algebras and random variables", makes precise what "with probability one" and "random variable" mean.

[Watch the central limit theorem emerge in the Stochastic Studio](https://quantsandbox.dev/stochastic-models/clt)

## Interactive labs

- [Stochastic Calculus Course: Random Walks to Brownian Motion](https://quantsandbox.dev/stochastic-models)
- [Monte Carlo Option Pricing Simulator](https://quantsandbox.dev/monte-carlo)

## Practice questions

### 1. Besides independence and a common distribution, which assumption does the classical central limit theorem need?

- a) A finite variance
- b) A bounded range of values
- c) A symmetric distribution
- d) A normal source distribution

**Answer:** a) A finite variance

Only a finite, positive variance is needed. The source may be skewed, discrete or unbounded; heavy tails with infinite variance are exactly where the theorem fails.

### 2. A Monte Carlo estimate based on 2,500 draws has a standard error of 0.05. How many draws are needed for a standard error of 0.01?

**Answer:** 62500

The standard error falls like $1/\sqrt{n}$. Going from 0.05 to 0.01 is a factor of 5, so the draws must grow by $5^2 = 25$, from 2,500 to 62,500.

---

Source: https://quantsandbox.dev/guide/stochastic/law-of-large-numbers-clt

Previous lesson: [Random Walks and Brownian Motion Explained](https://quantsandbox.dev/guide/stochastic/random-walks)

Next lesson: [Probability Spaces, Sigma-Algebras, Random Variables](https://quantsandbox.dev/guide/stochastic/probability-spaces)
