# Brownian Motion Simulator with Drift & Volatility

Simulate arithmetic Brownian motion: drift, volatility and reproducible seeded sample paths, with the mean and spread over time.

## About this tool

Brownian motion is the continuous-time random walk at the heart of financial models. This simulator draws arithmetic Brownian motion with a chosen drift and volatility, using reproducible seeded paths, so you can see how the drift sets the trend and the volatility sets the spread that grows over time.

## Frequently asked questions

### What is the difference between drift and volatility?

Drift μ is the average change per unit time, the slope of the mean path. Volatility σ scales the random part; the spread around the mean grows like σ√t.

### Can arithmetic Brownian motion become negative?

Yes. Its value is normally distributed, so it can take any real value. That is why stock prices are usually modelled with geometric Brownian motion instead.

### What is Brownian motion in finance?

A continuous-time random process whose changes over non-overlapping intervals are independent and normally distributed, with a variance proportional to the length of the interval. It models the unpredictable part of prices and interest rates; arithmetic Brownian motion X_t = X₀ + μt + σW_t adds a constant drift to it.

### Why are Brownian paths so jagged?

Over a short interval Δt a typical move has size σ√Δt, which is much larger than Δt itself. Zooming in therefore never makes the path look straight: Brownian motion is continuous but nowhere differentiable.

## Learn the theory

- [Random walks and Brownian motion](https://quantsandbox.dev/guide/stochastic/random-walks): The coin-flip walk, variance that grows linearly in time, and its limit: Brownian motion.
- [Itô's lemma](https://quantsandbox.dev/guide/stochastic/ito-lemma): Quadratic variation, the chain rule for Brownian motion, and the −½σ² drift of the log price.
- [Conditional expectation and martingales](https://quantsandbox.dev/guide/stochastic/martingales): Conditional expectation given the past, fair games, why no betting strategy beats a martingale, and discounted prices under Q.
- [Properties of Brownian motion](https://quantsandbox.dev/guide/stochastic/brownian-properties): Definition, the Gaussian characterisation, scaling, time inversion, the Markov property, quadratic variation and rough paths.
- [The Brownian bridge](https://quantsandbox.dev/guide/stochastic/brownian-bridge): Brownian motion with a fixed endpoint: construction, covariance, independence and applications.
- [The Itô integral](https://quantsandbox.dev/guide/stochastic/ito-integral): Simple integrands, the Itô isometry, the martingale property and the derivation of ∫W dW = (W² − t)/2.

Open the interactive tool: https://quantsandbox.dev/brownian-motion
