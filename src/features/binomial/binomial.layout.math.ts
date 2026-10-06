import type { BinomialTreeResult } from "./binomial.types";

/// Preserve the horizontal desktop lattice and top-to-bottom mobile lattice.
export function buildBinomialChartLayout(tree: BinomialTreeResult, vertical: boolean) {
  const steps = tree.nodes.reduce((max, node) => Math.max(max, node.step), 0);
  const nodeWidth = vertical ? 66 : 92;
  const nodeHeight = vertical ? 44 : 48;
  const width = vertical ? 2 * steps * 40 + nodeWidth + 24 : tree.width;
  const height = vertical ? steps * 92 + nodeHeight + 32 : tree.height;
  const nodes = tree.nodes.map((node) => ({
    node,
    x: vertical ? width / 2 + (2 * node.upMoves - node.step) * 40 - nodeWidth / 2 : node.x,
    y: vertical ? 16 + node.step * 92 : node.y,
  }));
  const positions = new Map(nodes.map((node) => [node.node.id, node]));
  const edges = tree.edges.flatMap((edge) => {
    const from = positions.get(edge.fromId);
    const to = positions.get(edge.toId);
    if (!from || !to) return [];
    return [{
      edge,
      x1: from.x + (vertical ? nodeWidth / 2 : nodeWidth),
      y1: from.y + (vertical ? nodeHeight : nodeHeight / 2),
      x2: to.x + (vertical ? nodeWidth / 2 : 0),
      y2: to.y + (vertical ? 0 : nodeHeight / 2),
    }];
  });
  return { width, height, nodeWidth, nodeHeight, nodes, edges };
}
