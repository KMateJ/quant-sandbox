import type { Asset } from "../portfolioLab.types";

type Props = {
  assets: Asset[];
  corr: number[][];
  onChange: (i: number, j: number, v: number) => void;
};

// Low-intensity diverging tint so the matrix doubles as a heatmap without hiding the number.
const cellBg = (r: number) => {
  const intensity = Math.min(Math.abs(r), 1) * 42;
  const accent = r >= 0 ? "var(--corr-pos)" : "var(--corr-neg)";
  return `color-mix(in srgb, ${accent} ${intensity}%, transparent)`;
};

/// Editable N×N correlation heatmap: lower triangle editable, upper triangle mirrored
/// (dimmed, derived), diagonal locked at 1.00.
export default function CorrelationMatrix({ assets, corr, onChange }: Props) {
  const n = assets.length;
  return (
    <div className="corr-matrix-scroll">
      <table className="corr-matrix">
        <thead>
          <tr>
            <th className="corr-corner" />
            {assets.map((a) => (
              <th key={a.id} className="corr-head" scope="col">
                <span className="corr-head-dot" style={{ background: a.color }} />
                {a.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {assets.map((rowAsset, i) => (
            <tr key={rowAsset.id}>
              <th scope="row" className="corr-row-head">
                <span className="corr-head-dot" style={{ background: rowAsset.color }} />
                {rowAsset.name}
              </th>
              {Array.from({ length: n }, (_, j) => {
                const r = corr[i][j];
                if (i === j) {
                  return (
                    <td key={j} className="corr-cell corr-cell--diag">
                      1.00
                    </td>
                  );
                }
                if (i < j) {
                  return (
                    <td key={j} className="corr-cell corr-cell--mirror" style={{ background: cellBg(r) }}>
                      {r.toFixed(2)}
                    </td>
                  );
                }
                return (
                  <td key={j} className="corr-cell" style={{ background: cellBg(r) }}>
                    <input
                      className="corr-input"
                      type="number"
                      min={-1}
                      max={1}
                      step={0.05}
                      value={Number(r.toFixed(2))}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (!Number.isNaN(v)) onChange(i, j, Math.max(-1, Math.min(1, v)));
                      }}
                      aria-label={`${rowAsset.name} × ${assets[j].name}`}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
