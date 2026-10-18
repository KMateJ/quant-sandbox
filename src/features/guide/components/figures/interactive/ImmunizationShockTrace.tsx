import { useI18n } from "../../../../../i18n";
import { IMMUNIZATION } from "../../../guide.interactive.immunizationShock.math";

type Props = {
  curve: { shock: number; surplus: number }[];
  /// Indices of curve points the reader has passed through.
  visited: ReadonlySet<number>;
  shock: number;
  surplus: number;
};

const W = 600;
const H = 150;
const PAD = { left: 8, right: 8, top: 12, bottom: 22 };

/// Surplus against the shock: the whole curve faint, the visited stretches solid, a dot at the current shock.
export default function ImmunizationShockTrace({ curve, visited, shock, surplus }: Props) {
  const { t } = useI18n();
  // The range always includes zero, so the sign of the surplus is visible against the zero line.
  const lo = Math.min(0, ...curve.map((c) => c.surplus));
  const hi = Math.max(0, ...curve.map((c) => c.surplus));
  const span = Math.max(1, hi - lo);
  const x = (s: number) => PAD.left + ((s + IMMUNIZATION.maxShock) / (2 * IMMUNIZATION.maxShock)) * (W - PAD.left - PAD.right);
  const y = (v: number) => PAD.top + (1 - (v - lo) / span) * (H - PAD.top - PAD.bottom);
  const line = (pts: typeof curve) => pts.map((c, i) => `${i ? "L" : "M"}${x(c.shock).toFixed(1)} ${y(c.surplus).toFixed(1)}`).join("");
  const segments = curve.slice(1).flatMap((c, i) => (visited.has(i) && visited.has(i + 1) ? [line([curve[i], c])] : []));

  return (
    <figure className="im-trace">
      <figcaption className="im-trace-caption">{t("ixImTrace")}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t("ixImTraceAria")}>
        <line className="im-trace-zero" x1={PAD.left} x2={W - PAD.right} y1={y(0)} y2={y(0)} />
        <line className="im-trace-zero" x1={x(0)} x2={x(0)} y1={PAD.top} y2={H - PAD.bottom} />
        <path className="im-trace-all" d={line(curve)} />
        {segments.map((d, i) => <path key={i} className="im-trace-seen" d={d} />)}
        <circle className="im-trace-dot" cx={x(shock)} cy={y(surplus)} r={5} />
        <text className="im-trace-tick" x={PAD.left} y={H - 6}>−300 bp</text>
        <text className="im-trace-tick" x={x(0)} y={H - 6} textAnchor="middle">0</text>
        <text className="im-trace-tick" x={W - PAD.right} y={H - 6} textAnchor="end">+300 bp</text>
      </svg>
    </figure>
  );
}
