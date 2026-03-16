import { useMemo } from "react";
import SectionCard from "../../../components/SectionCard";
import type { BinomialTreeResult } from "../binomial.types";

type BinomialTreeChartProps = {
  tree: BinomialTreeResult;
  showStockPrices: boolean;
  showOptionValues: boolean;
  treeOpen: boolean;
  onToggleTree: () => void;
};

export default function BinomialTreeChart({
  tree,
  showStockPrices,
  showOptionValues,
  treeOpen,
  onToggleTree,
}: BinomialTreeChartProps) {
  const nodeMap = useMemo(() => {
    return new Map(tree.nodes.map((node) => [node.id, node]));
  }, [tree.nodes]);

  return (
    <SectionCard
      className="chart-card "
      title="Binomiális árazási fa"
      subtitle="A részvényárak és az opcióértékek diszkrét modellje"
      headerLeft={
      <button
        type="button"
        className="toggle-button"
        onClick={onToggleTree}
      >
        {treeOpen ? "-" : "+"}
      </button>
    }

    >
        {treeOpen && (

       
      <div className="binomial-svg-wrap">
        <svg
          viewBox={`0 0 ${tree.width} ${tree.height}`}
          width="100%"
          height="100%"
          role="img"
        >
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
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#7c8aa0"
                  strokeWidth="1.5"
                />
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

              <text
                x={node.x + 46}
                y={node.y + 14}
                textAnchor="middle"
                fontSize="11"
                fill="#e2e8f0"
              >
                t={node.step}
              </text>

              {showStockPrices && (
                <text
                  x={node.x + 46}
                  y={node.y + (showOptionValues ? 27 : 31)}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#60a5fa"
                >
                  S={node.stockPrice.toFixed(2)}
                </text>
              )}

              {showOptionValues && (
                <text
                  x={node.x + 46}
                  y={node.y + (showStockPrices ? 40 : 31)}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#fbbf24"
                >
                  V={node.optionValue.toFixed(2)}
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
            <div>V₀ = {tree.price.toFixed(3)}</div>
          </div>
        )}
    </SectionCard>
    
  );
}