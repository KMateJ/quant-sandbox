import { useMemo } from "react";
import SectionCard from "../../../components/SectionCard";
import type { BinomialTreeResult } from "../binomial.types";
import { useI18n } from "../../../i18n";

type BinomialTreeChartProps = {
  tree: BinomialTreeResult;
  showPrimaryMetric: boolean;
  showSecondaryMetric: boolean;
  treeOpen: boolean;
  onToggleTree: () => void;
};

export default function BinomialTreeChart({
  tree,
  showPrimaryMetric,
  showSecondaryMetric,
  treeOpen,
  onToggleTree,
}: BinomialTreeChartProps) {
  const nodeMap = useMemo(() => new Map(tree.nodes.map((node) => [node.id, node])), [tree.nodes]);
  const { language, t } = useI18n();
  const isRates = tree.mode === "rates";

  const title = isRates
    ? language === "hu"
      ? "Binomiális kamatlábfa"
      : "Binomial rate tree"
    : t("binomialTreeTitle");

  const subtitle = isRates
    ? language === "hu"
      ? "Rövid kamatok és kötvényértékek a diszkrét rácson"
      : "Short rates and bond values on the discrete lattice"
    : t("binomialTreeSubtitle");

  return (
    <SectionCard
      className="chart-card "
      title={title}
      subtitle={subtitle}
      headerLeft={
        <button type="button" className="toggle-button" onClick={onToggleTree}>
          {treeOpen ? "-" : "+"}
        </button>
      }
    >
      {treeOpen && (
        <div className="binomial-svg-wrap">
          <svg viewBox={`0 0 ${tree.width} ${tree.height}`} width="100%" height="100%" role="img">
            {tree.edges.map((edge) => {
              const from = nodeMap.get(edge.fromId);
              const to = nodeMap.get(edge.toId);

              if (!from || !to) return null;

              const x1 = from.x + 92;
              const y1 = from.y + 24;
              const x2 = to.x;
              const y2 = to.y + 24;
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;

              return (
                <g key={edge.id}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#7c8aa0" strokeWidth="1.5" />
                  <text
                    x={midX}
                    y={edge.kind === "up" ? midY - 8 : midY + 16}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#94a3b8"
                  >
                    {edge.probabilityLabel}
                  </text>
                </g>
              );
            })}

            {tree.nodes.map((node) => (
              <g key={node.id}>
                <rect
                  x={node.x}
                  y={node.y}
                  rx="10"
                  ry="10"
                  width="92"
                  height="48"
                  fill="#162235"
                  stroke="#415269"
                  strokeWidth="1.2"
                />

                <text x={node.x + 46} y={node.y + 14} textAnchor="middle" fontSize="11" fill="#e2e8f0">
                  t={node.step}
                </text>

                {showPrimaryMetric && (
                  <text
                    x={node.x + 46}
                    y={node.y + (showSecondaryMetric ? 27 : 31)}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#60a5fa"
                  >
                    {isRates
                      ? `r=${(node.shortRate ?? 0).toFixed(2)}`
                      : `S=${(node.stockPrice ?? 0).toFixed(2)}`}
                  </text>
                )}

                {showSecondaryMetric && (
                  <text
                    x={node.x + 46}
                    y={node.y + (showPrimaryMetric ? 40 : 31)}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#fbbf24"
                  >
                    {isRates
                      ? `B=${(node.bondValue ?? 0).toFixed(2)}`
                      : `V=${(node.optionValue ?? 0).toFixed(2)}`}
                  </text>
                )}
              </g>
            ))}
          </svg>
        </div>
      )}

      {!treeOpen && (
        <div className="param-summary">
          <div>q = {tree.q.toFixed(3)}</div>
          <div>{isRates ? `P₀ = ${tree.price.toFixed(3)}` : `V₀ = ${tree.price.toFixed(3)}`}</div>
        </div>
      )}
    </SectionCard>
  );
}
