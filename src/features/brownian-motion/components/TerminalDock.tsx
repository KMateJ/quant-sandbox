import { binDensity, binValues } from "../../../lib/stats";
import type { PlotFrame } from "../../../components/charts";

type Props = {
  frame: PlotFrame;
  /// Path values at the cursor time.
  sample: ArrayLike<number>;
  /// Exact N(μt, σ²t) density at the cursor time.
  pdf: (x: number) => number;
  yDomain: [number, number];
  /// x where the dock starts, and the width of its tallest bar, both in time units.
  anchor: number;
  span: number;
};

const BINS = 36;
const CURVE_POINTS = 80;

/// Sideways histogram of the paths at the cursor time with the exact normal density, docked at the right edge
/// of the path chart so both share the y-axis.
export default function TerminalDock({ frame, sample, pdf, yDomain, anchor, span }: Props) {
  const bins = binValues(sample, yDomain, BINS).bins;
  const dens = binDensity(bins);
  const curve = Array.from({ length: CURVE_POINTS + 1 }, (_, i) => {
    const y = yDomain[0] + ((yDomain[1] - yDomain[0]) * i) / CURVE_POINTS;
    return { y, d: pdf(y) };
  }).filter((p) => Number.isFinite(p.d));
  const peak = Math.max(1e-9, ...dens, ...curve.map((p) => p.d));
  const x0 = frame.x(anchor);
  const w = (d: number) => frame.x(anchor + (d / peak) * span) - x0;

  return (
    <g pointerEvents="none">
      <line x1={x0} x2={x0} y1={0} y2={frame.height} stroke="var(--border-hover)" />
      {bins.map((b, i) => (
        <rect key={b.x0} x={x0} y={frame.y(b.x1)} width={Math.max(0, w(dens[i]))} height={Math.max(0, frame.y(b.x0) - frame.y(b.x1) - 1)} fill="var(--primary)" opacity={0.45} />
      ))}
      <polyline fill="none" stroke="var(--text)" strokeWidth={1.75} points={curve.map((p) => `${x0 + w(p.d)},${frame.y(p.y)}`).join(" ")} />
    </g>
  );
}
