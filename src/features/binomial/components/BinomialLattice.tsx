import { useMemo } from "react";
import type { BinomialTreeResult } from "../binomial.types";
import { buildBinomialChartLayout } from "../binomial.layout.math";

type Props = {
  tree: BinomialTreeResult;
  vertical: boolean;
  showPrimaryMetric: boolean;
  showSecondaryMetric: boolean;
  label: string;
};

export default function BinomialLattice({
  tree, vertical, showPrimaryMetric, showSecondaryMetric, label,
}: Props) {
  const layout = useMemo(() => buildBinomialChartLayout(tree, vertical), [tree, vertical]);
  const isRates = tree.mode === "rates";
  const center = layout.nodeWidth / 2;
  return (
    <div className={`binomial-svg-wrap${vertical ? " binomial-svg-wrap--vertical" : ""}`}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} width="100%" height={vertical ? undefined : "100%"} role="img" aria-label={label}>
        {layout.edges.map(({ edge, x1, y1, x2, y2 }) => (
          <g key={edge.id}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#7c8aa0" strokeWidth={vertical ? 1.3 : 1.5} />
            {!vertical && (
              <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 + (edge.kind === "up" ? -8 : 16)} textAnchor="middle" fontSize="11" fill="#94a3b8">
                {edge.probabilityLabel}
              </text>
            )}
          </g>
        ))}
        {layout.nodes.map(({ node, x, y }) => (
          <g key={node.id}>
            <rect x={x} y={y} rx={vertical ? 9 : 10} ry={vertical ? 9 : 10} width={layout.nodeWidth} height={layout.nodeHeight} fill="#162235" stroke="#415269" strokeWidth="1.2" />
            <text x={x + center} y={y + (vertical ? 13 : 14)} textAnchor="middle" fontSize={vertical ? 10 : 11} fill="#e2e8f0">
              t={node.step}
            </text>
            {showPrimaryMetric && (
              <text x={x + center} y={y + (showSecondaryMetric ? 26 : 30) + (vertical ? 0 : 1)} textAnchor="middle" fontSize="11" fill="#60a5fa">
                {isRates ? `r=${(node.shortRate ?? 0).toFixed(2)}` : `S=${(node.stockPrice ?? 0).toFixed(2)}`}
              </text>
            )}
            {showSecondaryMetric && (
              <text x={x + center} y={y + (showPrimaryMetric ? 39 : 30) + (vertical ? 0 : 1)} textAnchor="middle" fontSize="11" fill="#fbbf24">
                {isRates ? `B=${(node.bondValue ?? 0).toFixed(2)}` : `V=${(node.optionValue ?? 0).toFixed(2)}`}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
