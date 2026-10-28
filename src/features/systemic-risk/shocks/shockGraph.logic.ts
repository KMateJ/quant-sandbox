import { SERIES_PALETTE } from "../../../components/charts/chart.theme";
import type { NetEdge, NetNode } from "../../../components/charts/network/network.types";
import { balance } from "../engine/metrics.math";
import type { FinNetwork, InstKind, Institution, Status } from "../engine/systemic.types";

const KIND_ORDER: InstKind[] = ["dealer", "bank", "regional", "mmf", "hedgeFund", "insurer", "ccp"];

/// Edge colour by exposure type is not used: width carries the amount, a dash marks repo, and the arrow points
/// from the borrower to the lender because that is the way a loss travels.
export type GraphView = {
  status?: Record<string, Status>;
  /// text beside a node (equity lost, rescue chunks, …)
  badges?: Record<string, string>;
  /// edge ids `a>b` to pulse
  pulses?: Set<string>;
};

/// Nodes sized by total assets, coloured by institution kind, grouped by kind.
export function graphNodes(net: FinNetwork, label: (i: Institution) => string, view: GraphView = {}): NetNode[] {
  const assets = new Map(net.institutions.map((i) => [i.id, balance(i, net).assets]));
  const top = Math.max(1, ...assets.values());
  return net.institutions.map((i) => ({
    id: i.id,
    label: label(i),
    radius: 7 + 11 * Math.sqrt((assets.get(i.id) ?? 0) / top),
    fill: SERIES_PALETTE[KIND_ORDER.indexOf(i.kind) % SERIES_PALETTE.length],
    group: i.kind,
    status: view.status?.[i.id],
    badge: view.badges?.[i.id],
  }));
}

/// One edge per exposure, borrower → lender, thicker for larger amounts.
export function graphEdges(net: FinNetwork, pulses?: Set<string>): NetEdge[] {
  const top = Math.max(1, ...net.exposures.map((e) => e.amount));
  return net.exposures.map((e) => ({
    id: e.id,
    source: e.borrower,
    target: e.lender,
    width: 0.8 + 2.4 * Math.sqrt(e.amount / top),
    color: "var(--muted)",
    dashed: e.type === "repo",
    directed: true,
    active: pulses?.has(`${e.borrower}>${e.lender}`) ?? false,
  }));
}
