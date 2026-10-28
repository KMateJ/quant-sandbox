import MathSteps, { type MathStep } from "./MathSteps";

const STEPS: MathStep[] = [
  { textKey: "stochBrMath1", equation: "E[W(t) | W(T) = b] = b·t/T", emphasis: true },
  { textKey: "stochBrMath2", equation: "Var(W(t) | W(T)) = t − t²/T = t(T − t)/T" },
  { textKey: "stochBrMath3", equation: "B(t) = W(t) − (t/T)·(W(T) − b)" },
  { textKey: "stochBrMath4" },
];

export default function BridgeMathematics() {
  return <MathSteps steps={STEPS} nextKey="stochBrNext" />;
}
