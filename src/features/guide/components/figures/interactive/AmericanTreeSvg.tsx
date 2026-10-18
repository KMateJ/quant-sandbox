import type { KeyboardEvent } from "react";
import { useI18n } from "../../../../../i18n";
import type { TreeNode } from "../../../guide.interactive.americanTree.math";
import { fmt } from "../figureFormat";

type Props = {
  nodes: TreeNode[][];
  selected: { i: number; j: number };
  onSelect: (i: number, j: number) => void;
};

const NODE_W = 88;
const NODE_H = 38;
const WIDTH = 640;
const PAD = 8;
const ROW_GAP = 25;

/// Recombining tree, today on the left; every node is a focusable button that selects it.
export default function AmericanTreeSvg({ nodes, selected, onSelect }: Props) {
  const { t } = useI18n();
  const steps = nodes.length - 1;
  const height = 2 * steps * ROW_GAP + NODE_H + 2 * PAD;
  const colW = (WIDTH - 2 * PAD - NODE_W) / steps;
  const pos = (n: TreeNode) => ({ x: PAD + n.i * colW, y: height / 2 - (2 * n.j - n.i) * ROW_GAP - NODE_H / 2 });
  const decisionLabel = { exercise: t("ixAtExercise"), continue: t("ixAtContinue"), terminal: t("ixAtTerminal") };

  const onKey = (event: KeyboardEvent, n: TreeNode) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onSelect(n.i, n.j);
  };

  return (
    <svg className="ixat-svg" viewBox={`0 0 ${WIDTH} ${height}`} role="group" aria-label={t("ixAtTreeAria", { steps })}>
      {nodes.slice(0, -1).flatMap((row) =>
        row.map((n) => {
          const a = pos(n);
          const up = pos(nodes[n.i + 1][n.j + 1]);
          const down = pos(nodes[n.i + 1][n.j]);
          const x0 = a.x + NODE_W;
          const y0 = a.y + NODE_H / 2;
          return (
            <path
              key={`e${n.i}-${n.j}`}
              className="ixat-edge"
              d={`M${x0} ${y0} L${up.x} ${up.y + NODE_H / 2} M${x0} ${y0} L${down.x} ${down.y + NODE_H / 2}`}
            />
          );
        })
      )}
      {nodes.flat().map((n) => {
        const { x, y } = pos(n);
        const isSelected = n.i === selected.i && n.j === selected.j;
        const className = `ixat-node ixat-node--${n.decision}${isSelected ? " is-selected" : ""}`;
        return (
          <g
            key={`n${n.i}-${n.j}`}
            className={className}
            transform={`translate(${x},${y})`}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            aria-label={t("ixAtNodeAria", { step: n.i, s: fmt(n.s), v: fmt(n.value), decision: decisionLabel[n.decision] })}
            onClick={() => onSelect(n.i, n.j)}
            onKeyDown={(event) => onKey(event, n)}
          >
            <rect width={NODE_W} height={NODE_H} rx={4} />
            <text className="ixat-node-main" x={NODE_W / 2} y={16} textAnchor="middle">S {fmt(n.s)}</text>
            <text className="ixat-node-sub" x={NODE_W / 2} y={31} textAnchor="middle">P {fmt(n.value)}</text>
          </g>
        );
      })}
    </svg>
  );
}
