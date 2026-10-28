import { makeRng, nextNormal } from "../../lib/math/random";

/// Two Brownian motions with correlation ρ built by Cholesky: dW₂ = ρ dW₁ + √(1 − ρ²) dZ with dW₁, dZ independent.
/// Returns the increments and the running paths (length steps + 1, starting at 0). Seeded.
export function correlatedBrownian(rho: number, horizon: number, steps: number, seed: number) {
  const rng = makeRng(seed);
  const sd = Math.sqrt(horizon / steps);
  const c = Math.sqrt(Math.max(0, 1 - rho * rho));
  const dW1: number[] = [];
  const dW2: number[] = [];
  const w1 = [0];
  const w2 = [0];
  for (let i = 0; i < steps; i++) {
    const z1 = nextNormal(rng);
    const z2 = nextNormal(rng);
    const a = sd * z1;
    const b = sd * (rho * z1 + c * z2);
    dW1.push(a);
    dW2.push(b);
    w1.push(w1[i] + a);
    w2.push(w2[i] + b);
  }
  return { dW1, dW2, w1, w2 };
}
