import type { Point } from "../../../lib/graph/forceLayout";

/// Health of a node. Never colour alone: the chart adds a ring style or a cross for each.
export type NetStatus = "ok" | "stressed" | "critical" | "failed";

export type NetNode = {
  id: string;
  label: string;
  radius: number;
  fill: string;
  /// Nodes of one group start close together in the layout.
  group: string;
  status?: NetStatus;
  /// Short text beside the node (e.g. a rank or a percentage).
  badge?: string;
};

export type NetEdge = {
  id: string;
  source: string;
  target: string;
  width: number;
  color: string;
  dashed?: boolean;
  directed?: boolean;
  /// Drawn thicker with a one-shot dash animation (e.g. a loss travelling along it).
  active?: boolean;
};

export type NetLabels = {
  zoomIn: string;
  zoomOut: string;
  fit: string;
  zoomGroup: string;
  status: Record<NetStatus, string>;
  /// Shown under the graph while `connectMode` is on.
  connectHint: string;
  /// Spoken and shown after pressing C on a selected node; `{{name}}` is the source node.
  connecting: string;
};

export type NetworkGraphProps = {
  nodes: NetNode[];
  edges: NetEdge[];
  height: number;
  seed?: number;
  /// Extra key that forces a new layout (e.g. when a page swaps in a different network of the same nodes).
  layoutKey?: string;
  /// Fixed positions (in the graph's own box); without them a seeded force layout is used.
  positions?: Map<string, Point>;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  onEdgeSelect?: (id: string) => void;
  connectMode?: boolean;
  onConnect?: (from: string, to: string) => void;
  dimmed?: ReadonlySet<string>;
  ariaLabel: string;
  labels: NetLabels;
};
