type Flow = { t: number; cf: number; pv: number };

type Props = { flows: Flow[]; duration: number; years: number; label: string; durationLabel: string };

const W = 640;
const H = 250;
const PAD = 36;
const BEAM_Y = 190;

/// Cash flows as bars standing on a beam (faint: amount, solid: present value); the fulcrum sits at the
/// Macaulay duration, where the present values balance.
export default function DurationBalanceSvg({ flows, duration, years, label, durationLabel }: Props) {
  const x = (t: number) => PAD + ((W - 2 * PAD) * t) / (years + 0.5);
  const maxCf = Math.max(...flows.map((f) => f.cf));
  const h = (v: number) => (v / maxCf) * (BEAM_Y - 30);
  const barW = Math.max(4, Math.min(22, (W - 2 * PAD) / (years + 1) - 6));
  const fx = x(duration);

  return (
    <svg className="gi2-balance" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      {flows.map((f) => (
        <g key={f.t}>
          <rect className="gi2-bar-cf" x={x(f.t) - barW / 2} y={BEAM_Y - h(f.cf)} width={barW} height={h(f.cf)} />
          <rect className="gi2-bar-pv" x={x(f.t) - barW / 2} y={BEAM_Y - h(f.pv)} width={barW} height={h(f.pv)} />
          {(years <= 12 || f.t % 5 === 0) && <text className="gi2-tick" x={x(f.t)} y={BEAM_Y + 34} textAnchor="middle">{f.t}</text>}
        </g>
      ))}
      <line className="gi2-beam" x1={x(0)} x2={x(years + 0.5)} y1={BEAM_Y} y2={BEAM_Y} />
      <path className="gi2-fulcrum" d={`M${fx} ${BEAM_Y + 2} l-11 20 h22 z`} />
      <text className="gi2-fulcrum-label" x={fx} y={14} textAnchor="middle">
        {durationLabel}
      </text>
      <line className="gi2-fulcrum-guide" x1={fx} x2={fx} y1={22} y2={BEAM_Y} />
    </svg>
  );
}
