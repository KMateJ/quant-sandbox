import { impliedVolFromCallPrice } from "../heston/heston.math";

// #region Minimal complex arithmetic

type C = { re: number; im: number };
const c = (re: number, im = 0): C => ({ re, im });
const add = (a: C, b: C): C => c(a.re + b.re, a.im + b.im);
const sub = (a: C, b: C): C => c(a.re - b.re, a.im - b.im);
const mul = (a: C, b: C): C => c(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const div = (a: C, b: C): C => {
  const d = b.re * b.re + b.im * b.im;
  return c((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d);
};
const exp = (a: C): C => {
  const m = Math.exp(a.re);
  return c(m * Math.cos(a.im), m * Math.sin(a.im));
};
const log = (a: C): C => c(Math.log(Math.hypot(a.re, a.im)), Math.atan2(a.im, a.re));
const sqrt = (a: C): C => {
  const m = Math.sqrt(Math.hypot(a.re, a.im));
  const angle = Math.atan2(a.im, a.re) / 2;
  return c(m * Math.cos(angle), m * Math.sin(angle));
};
// #endregion

export type HestonModel = { S0: number; r: number; T: number; v0: number; theta: number; kappa: number; xi: number; rho: number };

/// Characteristic function of ln S_T under Heston ("little trap" form, stable for long maturities).
function hestonCf(u: C, m: HestonModel): C {
  const { S0, r, T, v0, theta, kappa, xi, rho } = m;
  const iu = mul(c(0, 1), u);
  const beta = sub(c(kappa), mul(c(rho * xi), iu));
  const d = sqrt(add(mul(beta, beta), mul(c(xi * xi), add(iu, mul(u, u)))));
  const g = div(sub(beta, d), add(beta, d));
  const edt = exp(mul(c(-T), d));
  const oneMinusGEdt = sub(c(1), mul(g, edt));
  const A = mul(iu, c(Math.log(S0) + r * T));
  const B = mul(
    c((kappa * theta) / (xi * xi)),
    sub(mul(sub(beta, d), c(T)), mul(c(2), log(div(oneMinusGEdt, sub(c(1), g))))),
  );
  const D = mul(c(v0 / (xi * xi)), div(mul(sub(beta, d), sub(c(1), edt)), oneMinusGEdt));
  return exp(add(add(A, B), D));
}

const U_MAX = 120;
const U_STEPS = 600;

/// Heston European call price, C = S₀P₁ − Ke^{−rT}P₂, with the two probabilities by numerical Fourier inversion.
export function hestonCall(K: number, m: HestonModel): number {
  const lnK = Math.log(K);
  const forward = hestonCf(c(0, -1), m); // = S₀e^{rT}
  const du = U_MAX / U_STEPS;
  let p1 = 0;
  let p2 = 0;
  for (let j = 0; j < U_STEPS; j++) {
    const u = (j + 0.5) * du;
    const kernel = div(exp(c(0, -u * lnK)), c(0, u));
    p1 += mul(kernel, div(hestonCf(c(u, -1), m), forward)).re;
    p2 += mul(kernel, hestonCf(c(u), m)).re;
  }
  const P1 = 0.5 + (p1 * du) / Math.PI;
  const P2 = 0.5 + (p2 * du) / Math.PI;
  return m.S0 * P1 - K * Math.exp(-m.r * m.T) * P2;
}

/// Black–Scholes implied volatility of the Heston price for each strike in [kMin, kMax].
export function hestonSmile(m: HestonModel, kMin = 70, kMax = 130, points = 25) {
  return Array.from({ length: points }, (_, i) => {
    const K = kMin + ((kMax - kMin) * i) / (points - 1);
    return { K, iv: impliedVolFromCallPrice(hestonCall(K, m), m.S0, K, m.T, m.r) };
  });
}
