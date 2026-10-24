import type { TranslationKey } from "../../../i18n";

/// Playbook size per mission: steps to pass and traps.
export const GUIDE_PLAYBOOK: Readonly<Record<string, { steps: number; traps: number }>> = {
  P1: { steps: 4, traps: 3 },
  P2: { steps: 4, traps: 3 },
  P3: { steps: 4, traps: 3 },
  P4: { steps: 4, traps: 3 },
  P5: { steps: 4, traps: 3 },
};

/// Desk panels the guide can point at (DOM id `pmgr-<anchor>`).
export const GUIDE_PANELS = ["mission", "risk", "events", "nav", "frontier", "corr", "positions", "ticket", "heat"] as const;
export const GUIDE_KEYS = ["F1", "F2", "F3", "F4", "F6", "F8", "F9"] as const;
export const GUIDE_MISTAKES = 6;
export const GUIDE_TERMS = ["exAnteVol", "realizedVol", "riskShare", "riskParity", "drawdown", "trackingError", "ewma", "correlation"] as const;

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

/// Copy keys of the guide, grouped as the Guide tab shows them.
export const guideKeys = {
  steps: (id: string) => range(GUIDE_PLAYBOOK[id]?.steps ?? 0).map((n) => `pmgrGuide${id}Step${n}` as TranslationKey),
  traps: (id: string) => range(GUIDE_PLAYBOOK[id]?.traps ?? 0).map((n) => `pmgrGuide${id}Trap${n}` as TranslationKey),
  panel: (anchor: string) => `pmgrGuidePanel_${anchor}` as TranslationKey,
  key: (code: string) => `pmgrGuideKey${code}` as TranslationKey,
  mistakes: () => range(GUIDE_MISTAKES).map((n) => ({ term: `pmgrGuideMistake${n}` as TranslationKey, text: `pmgrGuideMistake${n}Fix` as TranslationKey })),
  term: (term: string) => ({ term: `pmgrTerm_${term}` as TranslationKey, text: `pmgrTerm_${term}_def` as TranslationKey }),
};

/// Every key the guide reads (for the copy test).
export function allGuideKeys(missionIds: readonly string[]): string[] {
  return [
    ...missionIds.flatMap((id) => [...guideKeys.steps(id), ...guideKeys.traps(id)]),
    ...GUIDE_PANELS.map(guideKeys.panel),
    ...GUIDE_KEYS.map(guideKeys.key),
    ...guideKeys.mistakes().flatMap((m) => [m.term, m.text]),
    ...GUIDE_TERMS.flatMap((x) => Object.values(guideKeys.term(x))),
  ];
}
