/// Guide content ids; copy lives in `RetirementDeskHelp.ts` under `retrGd*` keys.

/// Steps and traps per mission playbook (`retrGdPlay_<id>_step<n>` / `_trap<n>`, 1-based).
export const PLAYBOOKS: Readonly<Record<string, { steps: number; traps: number }>> = {
  T1: { steps: 3, traps: 2 },
  T2: { steps: 3, traps: 2 },
  T3: { steps: 3, traps: 2 },
  T4: { steps: 3, traps: 2 },
  T5: { steps: 3, traps: 2 },
};

/// Desk panels the guide can point at (`retrGdPanel_<anchor>`); anchors are `retr-<anchor>` ids.
export const GUIDE_PANELS = ["mission", "risk", "events", "wealth", "returns", "odds", "years", "ticket", "rules"] as const;

/// Keys explained in the guide (`retrGdKey_<code>`).
export const GUIDE_KEYS = ["F1", "F2", "F3", "F4", "F8", "F9"] as const;

/// Common mistakes (`retrGdMistake<n>`, 1-based).
export const GUIDE_MISTAKES = 6;

/// Glossary terms (`retrGdTerm_<id>` and `retrGdTermText_<id>`).
export const GUIDE_TERMS = ["withdrawalRate", "sequenceRisk", "guardrails", "successOdds", "realReturn", "yearsOfCover"] as const;
