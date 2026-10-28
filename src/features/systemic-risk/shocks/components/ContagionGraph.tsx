import { useMemo } from "react";
import NetworkGraph from "../../../../components/charts/network/NetworkGraph";
import type { FinNetwork } from "../../engine/systemic.types";
import { graphEdges, graphNodes, type GraphView } from "../shockGraph.logic";
import { useGraphText } from "../useGraphText";

type Props = {
  net: FinNetwork;
  view: GraphView;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  height?: number;
  ariaLabel: string;
  layoutKey?: string;
  seed?: number;
  /// short labels ("Dealer A") or bare tags for crowded graphs
  bare?: boolean;
};

/// The institution network with per-node status, badges and pulsing edges for one day of a run.
export default function ContagionGraph({ net, view, selectedId, onSelect, height = 460, ariaLabel, layoutKey, seed, bare }: Props) {
  const { labels, shortOf } = useGraphText();
  const nodes = useMemo(() => graphNodes(net, bare ? (i) => i.tag : shortOf, view), [net, view, shortOf, bare]);
  const edges = useMemo(() => graphEdges(net, view.pulses), [net, view.pulses]);
  return (
    <NetworkGraph
      nodes={nodes}
      edges={edges}
      height={height}
      seed={seed}
      layoutKey={layoutKey}
      selectedId={selectedId}
      onSelect={onSelect}
      ariaLabel={ariaLabel}
      labels={labels}
    />
  );
}
