/// Registry module id → game desk id (the `qs.game.<deskId>.progress.v1` key). Desks themselves come from
/// the registry (`subNav` item `id: "desk"`); this table only names their progress store.
export const DESK_IDS: Readonly<Record<string, string>> = {
  "delta-hedging": "hedging",
  immunization: "alm",
  "yield-curve": "rates",
  "portfolio-lab": "portfolio",
  tvm: "retirement",
};

/// Missions per desk (pack decision: five each).
export const DESK_MISSIONS = 5;

/// Pre-kit progress keys, read while a desk's new key is still empty.
export const LEGACY_KEYS: Readonly<Record<string, string>> = { hedging: "qs.hedgingDesk.progress.v1" };
