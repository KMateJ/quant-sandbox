import type { HelpAnchor, HelpTab } from "./help.types";

export const HELP_TABS: readonly HelpTab[] = ["next", "whatIf", "guide"];

/// Mirrored by the `$hd-help-anchors` list in `_hedging-desk-help.scss`.
export const HELP_ANCHORS: readonly HelpAnchor[] = [
  "quotes", "mission", "risk", "blotter", "price", "delta", "pnl",
  "matrix", "profile", "positions", "ticket", "chain", "keys",
];

/// How long "show me" keeps a panel outlined.
export const POINT_MS = 2500;
