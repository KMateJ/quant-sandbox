import MathSteps, { type MathStep } from "./MathSteps";

const STEPS: MathStep[] = [
  { textKey: "stochTrMath1", equation: "−W(t),  W(ct)/√c,  W(t + s) − W(s),  t·W(1/t)  =  W(t)  (in law)", emphasis: true },
  { textKey: "stochTrMath2", equation: "Cov(W(cs)/√c, W(ct)/√c) = min(cs, ct)/c = min(s, t)" },
  { textKey: "stochTrMath3", equation: "Cov(s·W(1/s), t·W(1/t)) = st·min(1/s, 1/t) = min(s, t)" },
  { textKey: "stochTrMath4", equation: "Var(W(t + s) − W(s)) = t" },
];

export default function TransformationsMathematics() {
  return <MathSteps steps={STEPS} nextKey="stochTrNext" />;
}
