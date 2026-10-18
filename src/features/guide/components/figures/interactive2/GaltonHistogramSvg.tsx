type Bin = { x: number; count: number; normal: number };

const W = 640;
const H = 240;
const PAD = 28;

/// Endpoint counts as bars with the scaled normal density drawn over them.
export default function GaltonHistogramSvg({ bins, label }: { bins: Bin[]; label: string }) {
  const top = Math.max(1, ...bins.map((b) => Math.max(b.count, b.normal))) * 1.1;
  const step = (W - 2 * PAD) / bins.length;
  const x = (i: number) => PAD + i * step;
  const y = (v: number) => H - PAD - ((H - 2 * PAD) * v) / top;
  const curve = bins.map((b, i) => `${i ? "L" : "M"}${x(i) + step / 2} ${y(b.normal)}`).join(" ");

  return (
    <svg className="gi2-galton" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      {bins.map((b, i) => (
        <g key={b.x}>
          <rect className="gi2-bar-pv" x={x(i) + 1} y={y(b.count)} width={Math.max(step - 2, 1)} height={H - PAD - y(b.count)} />
          {(bins.length <= 21 || i % 2 === 0) && <text className="gi2-tick" x={x(i) + step / 2} y={H - PAD + 16} textAnchor="middle">{b.x}</text>}
        </g>
      ))}
      <line className="gi2-beam" x1={PAD} x2={W - PAD} y1={H - PAD} y2={H - PAD} />
      <path className="gi2-normal" d={curve} />
    </svg>
  );
}
