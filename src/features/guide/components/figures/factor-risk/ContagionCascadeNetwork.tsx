import { letterTag } from "../../../../systemic-risk/engine/presets.math";

type Props = {
  borrowers: number[][];
  failed: boolean[];
  loss: number[];
  equity: number;
  shocked: number;
  onPick: (i: number) => void;
  labels: { failed: string; buffer: string; shocked: string };
};

const W = 520;
const H = 340;
const R = 125;
const NODE = 24;

/// Banks on a circle with arrows from lender to borrower; failed banks are filled and labelled.
export default function ContagionCascadeNetwork({ borrowers, failed, loss, equity, shocked, onPick, labels }: Props) {
  const n = borrowers.length;
  const pos = Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI * i) / n - Math.PI / 2;
    return { x: W / 2 + R * Math.cos(a), y: H / 2 + R * Math.sin(a) };
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W }}>
      <defs>
        <marker id="cc-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--muted)" />
        </marker>
      </defs>
      {borrowers.flatMap((bs, i) =>
        bs.map((j) => {
          const a = pos[i];
          const b = pos[j];
          const d = Math.hypot(b.x - a.x, b.y - a.y);
          const ux = (b.x - a.x) / d;
          const uy = (b.y - a.y) / d;
          return (
            <line key={`${i}-${j}`} x1={a.x + ux * NODE} y1={a.y + uy * NODE} x2={b.x - ux * NODE} y2={b.y - uy * NODE}
              stroke={failed[j] ? "var(--negative)" : "var(--border)"} strokeWidth={failed[j] ? 1.6 : 1} markerEnd="url(#cc-arrow)" />
          );
        }),
      )}
      {pos.map((p, i) => {
        const left = Math.max(0, equity - loss[i]);
        const out = p.y > H / 2 + 1 ? 1 : -1;
        return (
          <g key={i} onClick={() => onPick(i)} style={{ cursor: "pointer" }} role="button" aria-label={`${labels.shocked} ${letterTag(i)}`}>
            <rect x={p.x - NODE} y={p.y - NODE} width={2 * NODE} height={2 * NODE}
              fill={failed[i] ? "var(--negative)" : "var(--surface)"} stroke={i === shocked ? "var(--primary)" : "var(--border)"} strokeWidth={i === shocked ? 2.5 : 1} />
            <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize={15} fontWeight={600} fill={failed[i] ? "var(--bg)" : "var(--text)"}>{letterTag(i)}</text>
            <text x={p.x} y={p.y + out * (NODE + 12)} textAnchor="middle" dominantBaseline="middle" fontSize={11} fill={failed[i] ? "var(--negative)" : "var(--muted)"}>
              {failed[i] ? labels.failed : `${labels.buffer} ${left.toFixed(1)}`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
