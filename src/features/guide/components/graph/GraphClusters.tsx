import { useI18n } from "../../../../i18n";
import { CATEGORY_LABEL_KEYS } from "../../../../modules/registry";
import type { GraphNode } from "../../guide.graph";
import type { Point } from "../../guide.graph.layout";
import type { GuideTrackId } from "../../guide.types";
import { trackColor } from "../../guide.ui";

type Props = { nodes: GraphNode[]; at: (id: string) => Point };

/// Faint track names above each track's cluster (screen space), so the map reads at a glance.
export default function GraphClusters({ nodes, at }: Props) {
  const { t } = useI18n();
  const clusters = new Map<GuideTrackId, { x: number; top: number; n: number }>();
  for (const n of nodes) {
    if (n.kind !== "lesson") continue;
    const p = at(n.id);
    const c = clusters.get(n.track) ?? { x: 0, top: Infinity, n: 0 };
    clusters.set(n.track, { x: c.x + p.x, top: Math.min(c.top, p.y), n: c.n + 1 });
  }
  return (
    <g className="gg-clusters" aria-hidden="true">
      {[...clusters].map(([track, c]) => (
        <text key={track} x={c.x / c.n} y={c.top - 22} textAnchor="middle" className="gg-cluster" style={{ fill: trackColor(track) }}>
          {t(CATEGORY_LABEL_KEYS[track])}
        </text>
      ))}
    </g>
  );
}
