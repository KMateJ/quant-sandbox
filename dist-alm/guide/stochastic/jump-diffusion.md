# Merton Jump-Diffusion Model and Poisson Jumps

The Poisson process, compound jumps, the Merton model, and how jumps create fat tails and a smile. Free interactive lesson with worked examples.

Every model in this track so far moves continuously: Brownian motion from "Random walks and Brownian motion", "Geometric Brownian motion" built on it, and the processes of "Mean reversion: Ornstein–Uhlenbeck and Vasicek". Real prices sometimes gap. An earnings surprise, a default or a market crash moves the price by several percent between two trades, with nothing in between. This lesson adds such jumps to geometric Brownian motion and works out their effect on returns, option prices and hedging.

## The Poisson process

Jumps arrive at random times, so we first need a model for counting them. The **Poisson process** $N_t$ counts the events up to time $t$. It starts at $N_0 = 0$, increases by exactly 1 at each event and is constant in between. Its single parameter is the **intensity** $\lambda > 0$, the expected number of events per year. The modelling assumptions are:

- In a short interval of length $dt$ an event occurs with probability $\lambda\,dt$, and two or more events with negligible probability.
- The numbers of events in non-overlapping intervals are independent (**independent increments**), as for Brownian motion.

From these assumptions the number of events up to $t$ follows the Poisson distribution:

$$
\Pr(N_t = n) = e^{-\lambda t}\,\frac{(\lambda t)^n}{n!}, \qquad n = 0, 1, 2, \ldots
$$

Its mean and its variance are both $\lambda t$.

## The compound Poisson process

A count alone does not move a price; each event needs a size. Let $J_1, J_2, \ldots$ be independent, identically distributed jump sizes, independent of $N$. The **compound Poisson process** adds up the jumps that have occurred so far:

$$
Y_t = \sum_{i=1}^{N_t} J_i.
$$

Think of the claims arriving at an insurer: $N_t$ is the number of claims, $J_i$ the size of each, and $Y_t$ the total paid. Conditioning on the number of jumps gives the mean $\mathbb{E}[Y_t] = \lambda t\,\mathbb{E}[J]$ and the variance $\operatorname{Var}(Y_t) = \lambda t\,\mathbb{E}[J^2]$.

## The Merton jump-diffusion model

Merton (1976) adds such jumps to geometric Brownian motion. The jumps act on the log price: when a jump of size $J$ occurs, the price is multiplied by $e^J$, so its relative change is $e^J - 1$. Merton assumes normal log-jumps, $J \sim N(\mu_J, \sigma_J^2)$, independent of each other, of $N$ and of $W$. The dynamics are

$$
\frac{dS_t}{S_{t-}} = (\mu - \lambda\kappa)\,dt + \sigma\,dW_t + \big(e^{J} - 1\big)\,dN_t, \qquad \kappa = \mathbb{E}\big[e^{J} - 1\big] = e^{\mu_J + \sigma_J^2/2} - 1.
$$

$S_{t-}$ is the price just before a possible jump. Between jumps the price follows geometric Brownian motion; at a jump it is multiplied by $e^J$. The jump term has expected value $\lambda\kappa\,dt$ per instant, so the **compensator** $-\lambda\kappa$ in the drift cancels it and the expected return stays $\mu$. With $\mu_J = -10\%$ and $\sigma_J = 15\%$, $\kappa \approx -8.5\%$: an average jump costs 8.5% of the price, and with $\lambda = 0.5$ the compensator raises the drift by about 4.25% per year.

Under the risk-neutral measure $\mathbb{Q}$ the discounted price must be a martingale, so $\mu$ is replaced by $r$ and the drift becomes $r - \lambda\kappa$. "Change of measure and Girsanov's theorem" covered only the Brownian part, where a change of measure shifts the drift of $W$. With jumps the compensator term $-\lambda\kappa$ is needed as well, otherwise the expected jump loss would make the discounted price drift.

Applying "Itô's lemma" to $\ln S$ between jumps gives the familiar $-\sigma^2/2$ correction, and each jump adds $J$ to the log price. The log return over $[0, T]$ is therefore

$$
\ln\frac{S_T}{S_0} = \Big(\mu - \lambda\kappa - \frac{\sigma^2}{2}\Big)T + \sigma W_T + \sum_{i=1}^{N_T} J_i.
$$

## The distribution of the log return

Condition on the number of jumps. Given $N_T = n$, the log return is a constant plus $\sigma W_T$ plus $n$ independent normal jumps, a sum of independent normals. Writing $m = (\mu - \lambda\kappa - \sigma^2/2)T$,

$$
\ln\frac{S_T}{S_0}\;\Big|\;N_T = n \;\sim\; N\big(m + n\mu_J,\ \sigma^2 T + n\sigma_J^2\big).
$$

Averaging over $n$ with the Poisson weights gives the density $f$ of the log return as a **Poisson mixture of normals**:

$$
f(x) = \sum_{n=0}^{\infty} e^{-\lambda T}\frac{(\lambda T)^n}{n!}\;\varphi\big(x;\ m + n\mu_J,\ \sigma^2 T + n\sigma_J^2\big),
$$

where $\varphi(x; a, b)$ is the normal density with mean $a$ and variance $b$. Each normal component is a scenario with a given number of jumps.

## Moments and fat tails

The shape is easiest to read from **cumulants**. The first two are the mean and the variance; the third and fourth, divided by the matching powers of the standard deviation, give the **skewness** and the **excess kurtosis** (kurtosis minus 3, zero for a normal). Cumulants of independent sums add. The diffusion part is normal and contributes only to the variance, $\sigma^2 T$. For a compound Poisson sum the $k$-th cumulant is $\lambda T\,\mathbb{E}[J^k]$. Hence

$$
\operatorname{Var} = \sigma^2 T + \lambda T(\mu_J^2 + \sigma_J^2), \qquad c_3 = \lambda T(\mu_J^3 + 3\mu_J\sigma_J^2), \qquad c_4 = \lambda T(\mu_J^4 + 6\mu_J^2\sigma_J^2 + 3\sigma_J^4),
$$

with skewness $c_3/\operatorname{Var}^{3/2}$ and excess kurtosis $c_4/\operatorname{Var}^2$. When $\mu_J < 0$, $c_3$ is negative: the distribution has a longer left tail. $c_4$ is always positive, so the tails are **fat**: extreme returns are more likely than under a normal with the same variance. Both effects shrink with the horizon, since skewness scales like $1/\sqrt{T}$ and excess kurtosis like $1/T$.

> In the Merton model the log return is a Poisson mixture of normals. Its variance is $\sigma^2T + \lambda T(\mu_J^2 + \sigma_J^2)$; negative mean jumps give negative skew, and the excess kurtosis is always positive.

## Worked example

Take $\sigma = 15\%$, $\lambda = 0.5$ per year, $\mu_J = -10\%$, $\sigma_J = 15\%$ and $T = 1$.

- Number of jumps: $\Pr(N_1 = 0) = e^{-0.5} \approx 60.65\%$, $\Pr(N_1 = 1) = 0.5\,e^{-0.5} \approx 30.33\%$, $\Pr(N_1 = 2) \approx 7.58\%$, and three or more about 1.44%.
- Variance: $0.15^2 + 0.5\,(0.01 + 0.0225) = 0.0225 + 0.01625 = 0.03875$, a standard deviation of 19.69%. The jumps supply $0.01625/0.03875 \approx 41.9\%$ of the variance.
- Skewness: $c_3 = 0.5\,(-0.001 - 0.00675) = -0.003875$, divided by $0.03875^{3/2}$ gives $-0.51$.
- Excess kurtosis: $c_4 = 0.5\,(0.0001 + 0.00135 + 0.00151875) \approx 0.00148$, divided by $0.03875^2$ gives $0.99$.
- Probability of a log return below $-30\%$: 10.85% under Merton, 11.26% under the normal with the same mean and variance.

The last line looks surprising: $-30\%$ lies only about 1.2 standard deviations below the mean, and there the normal has slightly more mass. The fat tail shows further out. Below $-50\%$ the probabilities are 2.46% against 1.29%, and below $-60\%$ 1.10% against 0.31%, more than three times as much. Over one month the same parameters give a skewness of about $-1.76$ and an excess kurtosis of about 11.9.

The figure keeps the diffusion volatility at $\sigma = 15\%$ and the horizon at $T = 1$ year. Sliders set the jump intensity $\lambda$ (0 to 3 per year, default 0.5), the mean log-jump $\mu_J$ ($-30\%$ to $+10\%$, default $-10\%$) and the jump volatility $\sigma_J$ (0% to 30%, default 15%). The chart shows the density of the 1-year log return under the Merton model and the normal density with the same mean and variance, for log returns from $-100\%$ to $+100\%$. It shows the shape of the distribution: the diffusion part is centred at $-\sigma^2/2$ and the compensator is left out, which would shift both curves by a constant without changing their shape. The readouts give the share of the variance due to jumps, the skewness, the excess kurtosis, and the probability of a log return below $-30\%$ under both. Set $\lambda = 0$ and the two curves coincide. Then make $\mu_J$ strongly negative and watch the left tail of the Merton density thicken while its peak grows taller and narrower than the normal's.

*[Interactive figure: jump density](https://quantsandbox.dev/guide/stochastic/jump-diffusion)*

## Option prices and the smile

Merton assumed that jump risk is specific to the firm and can be diversified away, so the jump intensity and the jump distribution are the same under $\mathbb{Q}$ as under $\mathbb{P}$. Conditional on $n$ jumps the price at $T$ is log-normal, so the conditional option price is a Black–Scholes price. Averaging over $n$ gives **Merton's formula**:

$$
C_0 = \sum_{n=0}^{\infty} e^{-\lambda' T}\frac{(\lambda' T)^n}{n!}\;C^{\text{BS}}\big(S_0, K, T, \sigma_n, r_n\big),
$$

$$
\lambda' = \lambda(1 + \kappa), \qquad \sigma_n^2 = \sigma^2 + \frac{n\sigma_J^2}{T}, \qquad r_n = r - \lambda\kappa + \frac{n\ln(1 + \kappa)}{T}.
$$

Each term is the Black–Scholes price of the scenario with $n$ jumps.

Invert these prices to implied volatilities, as in "Implied volatility and the volatility smile". Because the risk-neutral distribution has a fat, negatively skewed left tail, out-of-the-money puts are worth more than Black–Scholes with a single volatility allows, and the implied volatility rises for low strikes: a skew. Since skewness and excess kurtosis decay with the horizon, the skew is steepest at short maturities and flattens for long ones. A pure diffusion behaves differently: over a very short horizon its log return is almost normal, so it struggles to produce a steep short-dated skew. Jumps are one way to explain the short-dated skew seen in equity markets; the other, a random volatility, is the subject of "Stochastic volatility and the Heston model", and practical models often combine both. The Heston lab lets you price options under stochastic volatility for comparison.

## Hedging and incompleteness

In the Black–Scholes setting a position of $\Delta$ shares, rebalanced continuously, removes all risk from an option. With jumps this fails. When a jump occurs, the option changes by $C(S e^J) - C(S)$, which is not linear in the random jump size $e^J - 1$. A stock position can offset the change for one jump size but not for all of them, and rebalancing cannot react to an instantaneous jump. Some risk remains, and the market with only the stock and the bond is **incomplete**: the option price is no longer fixed by replication but depends on how the market prices jump risk.

### Worked example: Splitting the variance between diffusion and jumps

1. Diffusion variance over one year with $\sigma = 15\%$.
   $$\sigma^2 T = 0.15^2$$ → **0.0225**
2. Jump variance with the figure's defaults $\lambda = 0.5$, $\mu_J = -10\%$, $\sigma_J = 15\%$.
   $$\lambda T(\mu_J^2 + \sigma_J^2) = 0.5\,(0.01 + 0.0225)$$ → **0.01625**
3. Total variance of the log return.
   $$0.0225 + 0.01625$$ → **0.03875**
4. Share of the variance from the diffusion.
   $$0.0225 / 0.03875$$ → **0.5806**

## Summary

- The Poisson process $N_t$ counts events with intensity $\lambda$: $\Pr(N_t = n) = e^{-\lambda t}(\lambda t)^n/n!$, mean and variance $\lambda t$, independent increments.
- The Merton model $dS/S_{-} = (\mu - \lambda\kappa)\,dt + \sigma\,dW + (e^J - 1)\,dN$ adds normal log-jumps to geometric Brownian motion; the compensator $-\lambda\kappa$ keeps the expected return, and under $\mathbb{Q}$ makes the discounted price a martingale.
- The log return is a Poisson mixture of normals with variance $\sigma^2T + \lambda T(\mu_J^2 + \sigma_J^2)$, negative skew for $\mu_J < 0$ and fat tails, strongest at short horizons.
- Merton's option price is a Poisson-weighted sum of Black–Scholes prices; the implied volatility shows a skew that is steepest at short maturities.
- A jump cannot be delta-hedged, so the market is incomplete.

[Simulate price paths and price options by simulation in the Monte Carlo lab](https://quantsandbox.dev/monte-carlo)

## Interactive labs

- [Monte Carlo Option Pricing Simulator](https://quantsandbox.dev/monte-carlo)
- [Heston Stochastic Volatility Model Simulator](https://quantsandbox.dev/heston)

## Practice questions

### 1. Jumps arrive as a Poisson process with intensity $\lambda = 2$ per year. How many jumps do you expect in one year?

**Answer:** 2

$\mathbb{E}[N_t] = \lambda t = 2 \times 1 = 2$; the variance of the count is also 2.

### 2. Adding normal log-jumps to geometric Brownian motion changes the excess kurtosis of the log return how?

- a) It raises it above zero.
- b) It lowers it below zero.
- c) It leaves it at zero.
- d) Its sign depends on $\mu_J$.

**Answer:** a) It raises it above zero.

The fourth cumulant $\lambda T(\mu_J^4 + 6\mu_J^2\sigma_J^2 + 3\sigma_J^4)$ is positive whatever the sign of $\mu_J$, so the tails are fatter than the normal's. The sign of $\mu_J$ sets the skew, not the kurtosis.

---

Source: https://quantsandbox.dev/guide/stochastic/jump-diffusion

Previous lesson: [Ornstein–Uhlenbeck Process and the Vasicek Model](https://quantsandbox.dev/guide/stochastic/mean-reversion)
