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
  const layout = useMemo(() => buildBinomialChartLayout(tree, vertical, showPrimaryMetric, showSecondaryMetric), [tree, vertical, showPrimaryMetric, showSecondaryMetric]);
  const isRates = tree.mode === "rates";
  const center = layout.nodeWidth / 2;
  return (
    <div className={`binomial-svg-wrap${vertical ? " binomial-svg-wrap--vertical" : ""}`}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} width="100%" height={vertical ? undefined : "100%"} role="img" aria-label={label}>
        {layout.edges.map(({ edge, fromStep, x1, y1, x2, y2 }) => (
          <g key={edge.id}>
            <line className="bn-edge" x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={vertical ? 1.3 : 1.5} />
            {!vertical && fromStep === 0 && (
              <text className="bn-edge-label" x={(x1 + x2) / 2} y={(y1 + y2) / 2 + (edge.kind === "up" ? -8 : 16)} textAnchor="middle" fontSize="11">
                {edge.probabilityLabel}
              </text>
            )}
          </g>
        ))}
        {layout.nodes.map(({ node, x, y }) => (
          <g key={node.id}>
            <rect className="bn-node" x={x} y={y} rx={2} ry={2} width={layout.nodeWidth} height={layout.nodeHeight} strokeWidth="1.2" />
            <text className="bn-node-step" x={x + center} y={y + layout.lines.step} textAnchor="middle" fontSize={vertical ? 10 : 11}>
              t={node.step}
            </text>
            {showPrimaryMetric && (
              <text className="bn-node-primary" x={x + center} y={y + layout.lines.primary} textAnchor="middle" fontSize="11">
                {isRates ? `r=${(node.shortRate ?? 0).toFixed(2)}` : `S=${(node.stockPrice ?? 0).toFixed(2)}`}
              </text>
            )}
            {showSecondaryMetric && (
              <text className="bn-node-secondary" x={x + center} y={y + layout.lines.secondary} textAnchor="middle" fontSize="11">
                {isRates ? `B=${(node.bondValue ?? 0).toFixed(2)}` : `V=${(node.optionValue ?? 0).toFixed(2)}`}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
