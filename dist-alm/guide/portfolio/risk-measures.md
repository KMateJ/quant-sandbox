# Value at Risk (VaR) and Expected Shortfall Explained

Loss quantiles, the tail beyond them, normal versus fat-tailed returns, and the square-root-of-time rule. Free interactive lesson with worked examples.

The lesson "Returns and volatility" measured risk by the volatility $\sigma$, the standard deviation of returns. A risk manager usually wants a different kind of answer: an amount of money that the position could lose. This lesson turns a return distribution into two such numbers, Value at Risk and expected shortfall, first under the normal model and then with fat tails, and ends with portfolios, which links back to "Diversification and correlation".

## The loss distribution

Take a position worth $V$ today and fix a **horizon**, for example one trading day or ten. Let $R$ be the simple return of the position over that horizon. The **loss** is the fall in value, counted as a positive number:

$$
L = -(V_h - V) = -V R.
$$

A gain is a negative loss. The distribution of $L$ is the **loss distribution**; risk measures are numbers read off its right tail, where the large losses are. We assume the position is held unchanged over the horizon.

## Value at Risk

Pick a **confidence level** $\alpha$, typically 95% or 99%. The **Value at Risk** $\text{VaR}_\alpha$ is the $\alpha$-quantile of the loss distribution: the smallest amount $\ell$ such that the loss stays at or below $\ell$ with probability at least $\alpha$,

$$
\text{VaR}_\alpha = \min\{\ell : \mathbb{P}(L \le \ell) \ge \alpha\}.
$$

A one-day 99% VaR of 28,000 reads: on 99 days out of 100 the loss should not exceed 28,000. The convention here is that VaR is a positive amount of money and $\alpha$ is close to 1.

## Expected shortfall

VaR is a threshold. It says how often the threshold is crossed, but nothing about how far. The **expected shortfall** answers that: it is the average loss in the worst $1-\alpha$ fraction of outcomes. For a continuous loss distribution this equals

$$
\text{ES}_\alpha = \mathbb{E}\big[L \mid L \ge \text{VaR}_\alpha\big] = \frac{1}{1-\alpha}\int_\alpha^1 \text{VaR}_u\,du.
$$

The second form shows it as the average of all VaRs beyond $\alpha$, so $\text{ES}_\alpha \ge \text{VaR}_\alpha$ always.

## The normal model

Assume the return over the horizon is normal, $R \sim N(\mu, \sigma^2)$. Then $L = V(\sigma Z - \mu)$ with $Z$ standard normal (the sign of $Z$ is flipped, which the symmetry of the normal allows). Let $z_\alpha = N^{-1}(\alpha)$ be the standard normal quantile, so $z_{0.99} \approx 2.326$. Since $L$ is increasing in $Z$, its quantile is

$$
\text{VaR}_\alpha = V\,(\sigma z_\alpha - \mu).
$$

For the expected shortfall we need the mean of $Z$ beyond $z_\alpha$. The standard normal density $\varphi(x) = e^{-x^2/2}/\sqrt{2\pi}$ satisfies $\varphi'(x) = -x\varphi(x)$, so $x\varphi(x)$ has the antiderivative $-\varphi(x)$:

$$
\mathbb{E}[Z \mid Z \ge z_\alpha] = \frac{1}{1-\alpha}\int_{z_\alpha}^{\infty} x\,\varphi(x)\,dx = \frac{1}{1-\alpha}\Big[-\varphi(x)\Big]_{z_\alpha}^{\infty} = \frac{\varphi(z_\alpha)}{1-\alpha}.
$$

Substituting into $L = V(\sigma Z - \mu)$ gives

$$
\text{ES}_\alpha = V\left(\sigma\,\frac{\varphi(z_\alpha)}{1-\alpha} - \mu\right).
$$

At $\alpha = 99\%$ the factor is $\varphi(2.326)/0.01 \approx 2.665$, about 15% above $z_{0.99}$.

## Scaling with the horizon

Volatility is usually estimated from daily returns. As shown in "Returns and volatility", if daily returns are independent and identically distributed, variances add over days, so over $h$ days

$$
\sigma_h = \sigma_1\sqrt{h}, \qquad \mu_h = \mu_1 h.
$$

Over short horizons $\mu$ is tiny compared with $\sigma$ and is often set to zero; then VaR and ES grow like $\sqrt{h}$. The rule relies on three assumptions: returns on different days are independent, volatility stays constant, and the position is not changed during the horizon. Volatility clustering and autocorrelation break the first two, so a scaled 10-day figure is an approximation.

## Worked example

A position of $V = 1{,}000{,}000$ has daily volatility $\sigma = 1.2\%$ and $\mu = 0$. The steps below compute its 99% VaR and ES over one day and its VaR over ten days.

### Worked example: 99% VaR and ES of a 1,000,000 position

1. Multiply the position by its daily volatility.
   $$V\sigma = 1{,}000{,}000 \times 0.012$$ → **12000**
2. Look up the 99% quantile of the standard normal distribution.
   $$z_{0.99} = N^{-1}(0.99)$$ → **2.326**
3. The one-day VaR is $V\sigma$ times the quantile.
   $$\text{VaR}_{0.99} = V\sigma \cdot z_{0.99}$$ → **27916**
4. The one-day ES uses the tail factor $\varphi(z_{0.99})/0.01 \approx 2.665$ in place of the quantile.
   $$\text{ES}_{0.99} = V\sigma \cdot \frac{\varphi(z_{0.99})}{0.01}$$ → **31983**
5. Over ten days the volatility, and with $\mu = 0$ also the VaR, grows by the factor $\sqrt{10} \approx 3.162$.
   $$\text{VaR}^{(10)}_{0.99} = \text{VaR}_{0.99} \cdot \sqrt{10}$$ → **88279**

The ten-day volatility is $\sigma_{10} = 1.2\% \times \sqrt{10} \approx 3.79\%$, and the ten-day ES scales in the same way, to about 101,138.

## Fat tails

Daily returns have more extreme days than the normal predicts. A simple fat-tailed model is the **Student t** distribution with $\nu$ degrees of freedom. Its variance is $\nu/(\nu-2)$, so we rescale it by $\sqrt{(\nu-2)/\nu}$ to unit variance and multiply by $\sigma$. Both models then have the same volatility and differ only in shape: the t puts more weight in the far tail and in the centre, less in between. Small $\nu$ means fat tails; as $\nu \to \infty$ the t becomes normal.

For $\nu = 4$ the multipliers of $\sigma$ are:

- $\alpha = 97.5\%$: VaR 1.96 under both models; ES 2.34 (normal) against 2.82 (t).
- $\alpha = 99\%$: VaR 2.33 against 2.65 (14% higher); ES 2.67 against 3.69 (38% higher).
- $\alpha = 99.9\%$: VaR 3.09 against 5.07; ES 3.37 against 6.84, about twice as much.

In the worked example the fat-tailed one-day 99% VaR is about 31,794 and the ES about 44,280. A VaR at a moderate confidence level hardly sees the tail; the ES, which averages over the tail, does, and the gap widens as $\alpha$ rises.

The figure uses a position of 100 with daily volatility 1.2% and zero mean. Sliders set the confidence level $\alpha$ (90% to 99.5%), the horizon in days (1 to 20, volatility scaled by $\sqrt{h}$) and the degrees of freedom $\nu$ of the fat-tailed model (3 to 30). The chart shows the loss distribution under the normal model and under the Student t with the same volatility, with vertical lines at the two VaRs. The readouts give VaR and ES under both models, per 100 invested. With $\alpha = 99\%$, one day and $\nu = 4$ they read 2.79 and 3.20 (normal) and 3.18 and 4.43 (t). Raise $\alpha$ towards 99.5% and watch the fat-tailed ES move away from the normal one; then lower $\nu$ and see the same effect grow.

*[Interactive figure: var es](https://quantsandbox.dev/guide/portfolio/risk-measures)*

## Historical simulation

Instead of assuming a distribution, **historical simulation** reuses the past. Take, say, the last 500 daily returns, apply each to today's position to get 500 hypothetical losses, and sort them. The 99% VaR is about the fifth-largest loss and the ES the average of the five largest. The method captures fat tails and correlations as they actually occurred, but only those in the window: a calm window gives a low VaR right before a crisis.

## Properties of VaR and ES

Because VaR is a single quantile, two positions with the same VaR can have very different losses beyond it. Worse, VaR is not **subadditive**: the VaR of a portfolio can exceed the sum of the VaRs of its parts. Example: two independent bonds each lose 100 with probability 4% and nothing otherwise. Each has a 95% VaR of 0, since a loss occurs with probability below 5%. Holding both, the probability of at least one default is $1 - 0.96^2 = 7.84\%$, so the portfolio's 95% VaR is 100. Measured by VaR, diversification looks harmful.

Expected shortfall is subadditive, $\text{ES}(L_1 + L_2) \le \text{ES}(L_1) + \text{ES}(L_2)$; in the example each bond has ES 80 and the pair 103.2, well below 160. Together with three simpler properties (monotonicity, translation invariance, positive homogeneity) this makes ES a **coherent risk measure**.

> VaR answers "how bad can it get on a normal bad day"; ES answers "how bad is it on average once that line is crossed". For this reason the Basel Fundamental Review of the Trading Book (FRTB) replaced 99% VaR by 97.5% ES for market risk capital. Under the normal model the two are almost equal (2.326 against 2.338 standard deviations); with fat tails ES is larger.

## Portfolio VaR

For a portfolio with weights $w$ and return covariance matrix $\Sigma$, the lesson "Diversification and correlation" gives $\sigma_p^2 = w^\top\Sigma\,w$, and in the normal model $\text{VaR}_\alpha = V(\sigma_p z_\alpha - \mu_p)$. With correlations below one, $\sigma_p$ is less than the weighted average of the volatilities, so the portfolio VaR is less than the sum of the separate VaRs. Splitting the 1,000,000 above into two positions of 500,000, each with daily volatility 1.2% and correlation 0.3, gives $\sigma_p = 1.2\% \times \sqrt{0.65} \approx 0.97\%$ and a 99% VaR of about 22,507 instead of 27,916.

## Summary

- The loss over a horizon is $L = -VR$; $\text{VaR}_\alpha$ is its $\alpha$-quantile, a positive amount of money.
- $\text{ES}_\alpha$ is the average loss in the worst $1-\alpha$ tail and is never below VaR.
- Normal model: $\text{VaR}_\alpha = V(\sigma z_\alpha - \mu)$, $\text{ES}_\alpha = V(\sigma\varphi(z_\alpha)/(1-\alpha) - \mu)$, with $\sigma_h = \sigma_1\sqrt{h}$ under independence and constant volatility.
- With fat tails VaR rises moderately but ES much more, increasingly so at high confidence levels.
- ES is subadditive and coherent, VaR is not; regulation (FRTB) uses 97.5% ES.

[Estimate means, volatilities and the risk–return trade-off in the Risk & Return lab](https://quantsandbox.dev/risk-return)

## Interactive labs

- [Capital Allocation Line & Sharpe Ratio Visualizer](https://quantsandbox.dev/risk-return)
- [Two-Asset Portfolio: Diversification & Correlation](https://quantsandbox.dev/portfolio-lab)

## Practice questions

### 1. A position of 500,000 has daily volatility $\sigma = 2\%$ and $\mu = 0$. What is its one-day 95% VaR in the normal model? Use $z_{0.95} \approx 1.645$.

**Answer:** 16449

$\text{VaR}_{0.95} = V\sigma z_{0.95} = 500{,}000 \times 0.02 \times 1.645 \approx 16{,}450$ (16,449 with the exact quantile 1.6449). On about one day in twenty the loss should exceed this amount.

### 2. Which risk measure can make a diversified portfolio look riskier than the sum of its parts?

- a) Value at Risk
- b) Expected shortfall
- c) Both of them
- d) Neither of them

**Answer:** a) Value at Risk

VaR is not subadditive: in the two-bond example each bond has a 95% VaR of 0, but the pair has 100. ES is subadditive, so $\text{ES}(L_1 + L_2) \le \text{ES}(L_1) + \text{ES}(L_2)$ always holds.

---

Source: https://quantsandbox.dev/guide/portfolio/risk-measures

Previous lesson: [Factor Models: Single-Index Model and Systematic Risk](https://quantsandbox.dev/guide/portfolio/factor-models)

Next lesson: [Portfolio Constraints: No-Short-Sales Frontier](https://quantsandbox.dev/guide/portfolio/portfolio-constraints)
