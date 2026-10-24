/// Guide content ids; copy lives in `RatesDeskHelp.ts` under `ratdGd*` keys.

/// Steps and traps per mission playbook (`ratdGdPlay_<id>_step<n>` / `_trap<n>`, 1-based).
export const PLAYBOOKS: Readonly<Record<string, { steps: number; traps: number }>> = {
  R1: { steps: 3, traps: 2 },
  R2: { steps: 3, traps: 2 },
  R3: { steps: 3, traps: 2 },
  R4: { steps: 3, traps: 2 },
  R5: { steps: 3, traps: 2 },
};

/// Desk panels the guide can point at (`ratdGdPanel_<anchor>`); anchors are `ratd-<anchor>` ids.
export const GUIDE_PANELS = ["mission", "risk", "events", "curve", "moves", "pnl", "positions", "ticket", "ctd", "scen"] as const;

/// Keys explained in the guide (`ratdGdKey_<code>`).
export const GUIDE_KEYS = ["F1", "F2", "F3", "F4", "F6", "F8", "F9"] as const;

/// Common mistakes (`ratdGdMistake<n>`, 1-based).
export const GUIDE_MISTAKES = 6;

/// Glossary terms (`ratdGdTerm_<id>` and `ratdGdTermText_<id>`).
export const GUIDE_TERMS = ["dv01", "keyRateDv01", "ctd", "conversionFactor", "basis", "steepener", "roll", "calendarSpread"] as const;
