/// Same literal union as the help shell's panel anchors (kept local so the guide stays independent).
export type GuideAnchor =
  | "quotes" | "mission" | "risk" | "blotter" | "price" | "delta" | "pnl"
  | "matrix" | "profile" | "positions" | "ticket" | "chain" | "keys";

/// Playbook sizes per mission: steps, then traps. Copy keys are `hdGuide<Mission>Step<n>` / `hdGuide<Mission>Trap<n>`.
export const GUIDE_PLAYBOOKS: Record<string, { steps: number; traps: number }> = {
  M1: { steps: 5, traps: 3 },
  M2: { steps: 4, traps: 3 },
  M3: { steps: 5, traps: 3 },
  M4: { steps: 4, traps: 3 },
  M5: { steps: 4, traps: 3 },
};

/// Panel entries in screen order; copy key `hdGuidePanel<Anchor>`.
export const GUIDE_PANELS: readonly GuideAnchor[] = [
  "quotes", "mission", "risk", "blotter", "price", "delta", "pnl", "matrix", "profile", "positions", "ticket", "chain", "keys",
];

/// Keys listed in the guide; copy key `hdGuideKey<Code>`.
export const GUIDE_KEYS = ["F1", "F2", "F3", "F4", "F5", "F8", "F9"] as const;

/// Number of common mistakes; copy keys `hdGuideMistake<n>Title` / `Body`.
export const GUIDE_MISTAKES = 8;

/// Glossary terms; copy keys `hdGuideTerm<Term>` / `hdGuideTerm<Term>Def`.
export const GUIDE_TERMS = [
  "delta", "gamma", "theta", "vega", "band", "breach", "hedge", "spread", "iv", "rv", "assignment", "gap",
] as const;

/// Guide sections in display order.
export const GUIDE_SECTIONS = ["mission", "panels", "keys", "mistakes", "terms", "others"] as const;
export type GuideSection = (typeof GUIDE_SECTIONS)[number];
