// Strings for the "multiples-peers" guide figure. Keys are prefixed ixMp to stay unique.
import type { multiplesPeersHu } from "./multiplesPeers.hu";

export const multiplesPeersEn: Record<keyof typeof multiplesPeersHu, string> = {
  ixMpTitle: "Peer multiples and the value of a target",
  ixMpHint: "Drag the target sideways (or use the arrow keys) to set its expected growth. Click a peer to drop it from the fit or bring it back.",
  ixMpAria: "EV/EBITDA multiples of peer firms against expected growth, with the regression line and a draggable target",
  ixMpGrowth: "Expected growth",
  ixMpMultiple: "EV/EBITDA",
  ixMpTargetLabel: "Target",
  ixMpTargetAria: "Expected growth of the target",
  ixMpPeerAria: "Peer {{id}}: growth {{growth}}, EV/EBITDA {{multiple}}, {{state}}",
  ixMpIncluded: "included in the fit",
  ixMpExcluded: "excluded from the fit",
  ixMpLegendIncluded: "Peer in the fit",
  ixMpLegendExcluded: "Excluded peer",
  ixMpLegendLine: "Regression line",
  ixMpReset: "Include all peers",
  ixMpMedian: "Peer median",
  ixMpLineMultiple: "Multiple on the line",
  ixMpEv: "Implied enterprise value",
  ixMpEquity: "Implied equity value",
  ixMpNote: "EBITDA 50, net debt 120 (millions). Implied enterprise value is multiple × EBITDA; equity value subtracts net debt.",
};
