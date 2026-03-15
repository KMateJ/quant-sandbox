# React + TypeScript + Vite

## License

This project is licensed under the Creative Commons BY-NC-SA 4.0 License.

The code may be used and modified for educational purposes,
but commercial use is not permitted.


# Quant Sandbox

Interactive mathematics and quantitative finance demos.

This repository contains small interactive visual tools intended primarily as study aids for students of the **Insurance and Financial Mathematics program at ELTE and Corvinus University of Budapest**.

The goal of the project is to provide intuitive visualizations for concepts that often appear abstract in lectures or textbooks.

Maintenance of this project follows a rather informal  
*"I work on it when I feel like it"* model.  
If you would like to see additional topics implemented, feel free to reach out.

---

# Current demos

### Black–Scholes option pricing

Interactive visualization of the Black–Scholes model.

The tool allows you to explore how option price and the main Greeks depend on:

- underlying price
- volatility
- interest rate
- maturity

Multiple maturities are shown simultaneously to illustrate the shape of the pricing surface.

---

### Binomial option pricing tree

A recombining binomial model visualization for option pricing.

Adjustable parameters:

- initial price \(S_0\)
- strike \(K\)
- up factor \(u\)
- down factor \(d\)
- interest rate \(r\)
- number of steps \(N\)

The tool shows:

- the stock price tree
- option values at each node
- risk-neutral probabilities
- the root **replicating portfolio**.

---

### Diffusion equation demo

A simple visualization of the diffusion equation solution

\[
u(t,x) = e^{-k n^2 t}\sin(nx)
\]

The sliders allow exploration of:

- diffusion coefficient \(k\)
- spatial frequency \(n\)
- time interval
- number of curves displayed

The visualization illustrates how diffusion damps higher-frequency components over time.

---

# Tech stack

- React
- TypeScript
- Recharts
- Custom SVG visualizations

The project focuses on **clarity and educational value** rather than production-level architecture.

---

# Running the project

```bash
npm install
npm run dev