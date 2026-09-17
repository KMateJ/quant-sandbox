import { useMemo } from "react";
import SectionCard from "../../../components/SectionCard";
import { useMediaQuery } from "../../../components/useMediaQuery";
import SwitchRow from "../../../components/SwitchRow";
import type { BinomialTreeResult, OptionKind, TreeMode } from "../binomial.types";
import { useI18n } from "../../../i18n";

type BinomialTreeChartProps = {
  tree: BinomialTreeResult;
  optionKind: OptionKind;
  showPrimaryMetric: boolean;
  showSecondaryMetric: boolean;
  primaryToggleLabel: string;
  secondaryToggleLabel: string;
  onModeChange: (value: TreeMode) => void;
  onOptionKindChange: (value: OptionKind) => void;
  onTogglePrimaryMetric: () => void;
  onToggleSecondaryMetric: () => void;
};

// Vertical layout used on phones: time flows top -> bottom and the whole
// lattice is scaled to fit the screen width instead of scrolling sideways.
const V_NODE_W = 66;
const V_NODE_H = 44;
const V_UNIT_X = 40; // half-pitch between neighbouring nodes in a row
const V_STEP_Y = 92;
const V_PAD_X = 12;
const V_PAD_TOP = 16;
const V_PAD_BOTTOM = 16;

function buildVerticalLayout(tree: BinomialTreeResult) {
  const steps = tree.nodes.reduce((max, node) => Math.max(max, node.step), 0);
  const width = 2 * steps * V_UNIT_X + V_NODE_W + V_PAD_X * 2;
  const height = steps * V_STEP_Y + V_NODE_H + V_PAD_TOP + V_PAD_BOTTOM;
  const centerX = width / 2;

  const positions = new Map<string, { cx: number; cy: number }>();
  const nodes = tree.nodes.map((node) => {
    const offset = 2 * node.upMoves - node.step;
    const cx = centerX + offset * V_UNIT_X;
    const cy = V_PAD_TOP + node.step * V_STEP_Y + V_NODE_H / 2;
    positions.set(node.id, { cx, cy });
    return { node, cx, cy };
  });

  const edges = tree.edges
    .map((edge) => {
      const from = positions.get(edge.fromId);
      const to = positions.get(edge.toId);
      if (!from || !to) return null;
      return {
        id: edge.id,
        x1: from.cx,
        y1: from.cy + V_NODE_H / 2,
        x2: to.cx,
        y2: to.cy - V_NODE_H / 2,
      };
    })
    .filter((edge): edge is NonNullable<typeof edge> => edge !== null);

  return { width, height, nodes, edges };
}

export default function BinomialTreeChart({
  tree,
  optionKind,
  showPrimaryMetric,
  showSecondaryMetric,
  primaryToggleLabel,
  secondaryToggleLabel,
  onModeChange,
  onOptionKindChange,
  onTogglePrimaryMetric,
  onToggleSecondaryMetric,
}: BinomialTreeChartProps) {
  const nodeMap = useMemo(() => new Map(tree.nodes.map((node) => [node.id, node])), [tree.nodes]);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const vertical = useMemo(() => buildVerticalLayout(tree), [tree]);
  const { language, t } = useI18n();
  const isRates = tree.mode === "rates";

  const modeEquityLabel = language === "hu" ? "Részvényfa" : "Equity tree";
  const modeRatesLabel = language === "hu" ? "Kamatlábfa" : "Rate tree";

  const title = isRates
    ? language === "hu"
      ? "Binomiális kamatlábfa"
      : "Binomial rate tree"
    : t("binomialTreeTitle");

  return (
    <SectionCard
      className="chart-card "
      title={title}
    >
      {isMobile && (
        <SwitchRow
          groups={[
            {
              key: "mode",
              options: [
                { label: modeEquityLabel, active: !isRates, onSelect: () => onModeChange("equity") },
                { label: modeRatesLabel, active: isRates, onSelect: () => onModeChange("rates") },
              ],
            },
            ...(!isRates
              ? [
                  {
                    key: "type",
                    options: [
                      {
                        label: t("binomialOptionCall"),
                        active: optionKind === "call",
                        onSelect: () => onOptionKindChange("call"),
                      },
                      {
                        label: t("binomialOptionPut"),
                        active: optionKind === "put",
                        onSelect: () => onOptionKindChange("put"),
                      },
                    ],
                  },
                ]
              : []),
            {
              key: "display",
              options: [
                { label: primaryToggleLabel, active: showPrimaryMetric, onSelect: onTogglePrimaryMetric },
                { label: secondaryToggleLabel, active: showSecondaryMetric, onSelect: onToggleSecondaryMetric },
              ],
            },
          ]}
        />
      )}

      {isMobile && (
        <div className="binomial-svg-wrap binomial-svg-wrap--vertical">          <svg viewBox={`0 0 ${vertical.width} ${vertical.height}`} width="100%" role="img">
            {vertical.edges.map((edge) => (
              <line
                key={edge.id}
                x1={edge.x1}
                y1={edge.y1}
                x2={edge.x2}
                y2={edge.y2}
                stroke="#7c8aa0"
                strokeWidth="1.3"
              />
            ))}

            {vertical.nodes.map(({ node, cx, cy }) => {
              const x = cx - V_NODE_W / 2;
              const y = cy - V_NODE_H / 2;
              return (
                <g key={node.id}>
                  <rect
                    x={x}
                    y={y}
                    rx="9"
                    ry="9"
                    width={V_NODE_W}
                    height={V_NODE_H}
                    fill="#162235"
                    stroke="#415269"
                    strokeWidth="1.2"
                  />

                  <text x={cx} y={y + 13} textAnchor="middle" fontSize="10" fill="#e2e8f0">
                    t={node.step}
                  </text>

                  {showPrimaryMetric && (
                    <text
                      x={cx}
                      y={y + (showSecondaryMetric ? 26 : 30)}
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
                      x={cx}
                      y={y + (showPrimaryMetric ? 39 : 30)}
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
              );
            })}
          </svg>
        </div>
      )}

      {!isMobile && (
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
    </SectionCard>
  );
}
