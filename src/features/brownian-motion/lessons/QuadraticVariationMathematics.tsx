import MathSteps, { type MathStep } from "./MathSteps";

const STEPS: MathStep[] = [
  { textKey: "stochQvMath1", equation: "E Σ(ΔW_i)² = T,   Var Σ(ΔW_i)² = 2T²/n → 0", emphasis: true },
  { textKey: "stochQvMath2", equation: "[W]_T = lim Σ (W(t_{i+1}) − W(t_i))² = T" },
  { textKey: "stochQvMath3", equation: "E Σ|ΔW_i| = √(2nT/π) → ∞" },
  { textKey: "stochQvMath4" },
];

export default function QuadraticVariationMathematics() {
  return <MathSteps steps={STEPS} nextKey="stochQvNext" />;
}
