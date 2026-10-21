import type { BinomialTreeResult } from "./binomial.types";

const LINE_PITCH = 15;
const VERTICAL_ROW_PITCH = 100;

/// Text baselines inside a node box: step label, then up to two metric lines.
function nodeLines(showPrimary: boolean, showSecondary: boolean) {
  const both = showPrimary && showSecondary;
  return {
    step: LINE_PITCH,
    primary: both ? 2 * LINE_PITCH : 2 * LINE_PITCH + 2,
    secondary: both ? 3 * LINE_PITCH : 2 * LINE_PITCH + 2,
  };
}

/// Preserve the horizontal desktop lattice and top-to-bottom mobile lattice.
export function buildBinomialChartLayout(
  tree: BinomialTreeResult,
  vertical: boolean,
  showPrimary = true,
  showSecondary = true,
) {
  const steps = tree.nodes.reduce((max, node) => Math.max(max, node.step), 0);
  const nodeWidth = vertical ? 66 : 92;
  const nodeHeight = vertical ? 52 : 56;
  const width = vertical ? 2 * steps * 40 + nodeWidth + 24 : tree.width;
  const height = vertical ? steps * VERTICAL_ROW_PITCH + nodeHeight + 32 : tree.height;
  const nodes = tree.nodes.map((node) => ({
    node,
    x: vertical ? width / 2 + (2 * node.upMoves - node.step) * 40 - nodeWidth / 2 : node.x,
    y: vertical ? 16 + node.step * VERTICAL_ROW_PITCH : node.y,
  }));
  const positions = new Map(nodes.map((node) => [node.node.id, node]));
  const edges = tree.edges.flatMap((edge) => {
    const from = positions.get(edge.fromId);
    const to = positions.get(edge.toId);
    if (!from || !to) return [];
    return [{
      edge,
      fromStep: from.node.step,
      x1: from.x + (vertical ? nodeWidth / 2 : nodeWidth),
      y1: from.y + (vertical ? nodeHeight : nodeHeight / 2),
      x2: to.x + (vertical ? nodeWidth / 2 : 0),
      y2: to.y + (vertical ? 0 : nodeHeight / 2),
    }];
  });
  return { width, height, nodeWidth, nodeHeight, lines: nodeLines(showPrimary, showSecondary), nodes, edges };
}
