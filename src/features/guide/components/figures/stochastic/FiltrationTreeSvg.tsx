import { COIN_PATHS } from "../../../guide.stochastic.math";

type Props = { k: number; times: (number | null)[]; label: string; noneLabel: string };

const W = 640;
const H = 300;
const X0 = 40;
const DX = 150;
const leafY = (i: number) => 24 + i * 34;

/// Binary tree of three coin flips: nodes up to time k are revealed; leaves are grouped into the atoms of 𝓕_k.
export default function FiltrationTreeSvg({ k, times, label, noneLabel }: Props) {
  // A node at depth d is identified by its prefix; its y is the mean of its leaves' y.
  const nodeY = (prefix: string) => {
    const leaves = COIN_PATHS.map((p, i) => (p.startsWith(prefix) ? leafY(i) : null)).filter((v): v is number => v !== null);
    return leaves.reduce((a, b) => a + b, 0) / leaves.length;
  };
  const prefixes = (d: number) => [...new Set(COIN_PATHS.map((p) => p.slice(0, d)))];
  const atoms = prefixes(k);

  return (
    <svg className="gs-tree" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      {atoms.map((prefix, i) => {
        const ys = COIN_PATHS.map((p, j) => (p.startsWith(prefix) ? leafY(j) : null)).filter((v): v is number => v !== null);
        return <rect key={prefix} className={`gs-atom gs-block-${i % 6}`} x={X0 + 3 * DX - 14} y={Math.min(...ys) - 14} width={150} height={Math.max(...ys) - Math.min(...ys) + 28} rx={4} />;
      })}
      {[1, 2, 3].flatMap((d) => prefixes(d).map((prefix) => {
        const parent = prefix.slice(0, -1);
        const known = d <= k;
        return (
          <g key={prefix}>
            <line className={known ? "gs-edge is-known" : "gs-edge"} x1={X0 + (d - 1) * DX} y1={nodeY(parent)} x2={X0 + d * DX} y2={nodeY(prefix)} />
            <text className={known ? "gs-flip is-known" : "gs-flip"} x={X0 + (d - 0.5) * DX} y={(nodeY(parent) + nodeY(prefix)) / 2 - 6} textAnchor="middle">
              {prefix.at(-1)}
            </text>
          </g>
        );
      }))}
      <circle className="gs-node is-known" cx={X0} cy={nodeY("")} r={5} />
      {COIN_PATHS.map((p, i) => (
        <text key={p} className="gs-leaf" x={X0 + 3 * DX + 10} y={leafY(i) + 4}>
          {p} · τ = {times[i] ?? noneLabel}
        </text>
      ))}
    </svg>
  );
}
