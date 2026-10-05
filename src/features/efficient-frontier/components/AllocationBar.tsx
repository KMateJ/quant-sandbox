import type { Asset } from "../../portfolio-lab/portfolioLab.types";

type Props = {
  assets: Asset[];
  weights: number[];
};

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// Horizontal allocation bar plus a compact signed-weight list for the selection.
export default function AllocationBar({ assets, weights }: Props) {
  const posTotal = weights.reduce((a, w) => a + Math.max(0, w), 0) || 1;
  const rows = assets
    .map((a, i) => ({ asset: a, weight: weights[i] }))
    .sort((a, b) => b.weight - a.weight);

  return (
    <div className="alloc">
      <div className="alloc-bar" role="img" aria-label="Portfolio allocation">
        {assets.map((a, i) =>
          weights[i] > 0.0005 ? (
            <span
              key={a.id}
              className="alloc-seg"
              style={{ width: `${(weights[i] / posTotal) * 100}%`, background: a.color }}
              title={`${a.name} ${pct(weights[i])}`}
            />
          ) : null
        )}
      </div>
      <ul className="alloc-list">
        {rows.map(({ asset, weight }) => (
          <li key={asset.id} className="alloc-item">
            <span className="weight-dot" style={{ background: asset.color }} />
            <span className="alloc-name">{asset.name}</span>
            <span className={weight < -0.0005 ? "alloc-pct alloc-pct--short" : "alloc-pct"}>{pct(weight)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
