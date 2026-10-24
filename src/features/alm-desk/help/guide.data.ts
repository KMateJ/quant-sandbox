import type { TranslationKey } from "../../../i18n";

/// Playbook size per mission: steps to pass and traps.
export const GUIDE_PLAYBOOK: Readonly<Record<string, { steps: number; traps: number }>> = {
  A1: { steps: 5, traps: 3 },
  A2: { steps: 4, traps: 3 },
  A3: { steps: 4, traps: 3 },
  A4: { steps: 4, traps: 3 },
  A5: { steps: 4, traps: 3 },
};

/// Desk panels the guide can point at (DOM id `almd-<anchor>`).
export const GUIDE_PANELS = ["mission", "risk", "events", "curve", "surplus", "attr", "holdings", "ticket", "grid"] as const;
export const GUIDE_KEYS = ["F1", "F2", "F4", "F8", "F9"] as const;
export const GUIDE_MISTAKES = 6;
export const GUIDE_TERMS = ["duration", "modifiedDuration", "convexity", "dv01", "rollDown", "twist", "surplus", "fundedRatio"] as const;

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

/// Copy keys of the guide, grouped as the Guide tab shows them.
export const guideKeys = {
  steps: (id: string) => range(GUIDE_PLAYBOOK[id]?.steps ?? 0).map((n) => `almdGuide${id}Step${n}` as TranslationKey),
  traps: (id: string) => range(GUIDE_PLAYBOOK[id]?.traps ?? 0).map((n) => `almdGuide${id}Trap${n}` as TranslationKey),
  panel: (anchor: string) => `almdGuidePanel_${anchor}` as TranslationKey,
  key: (code: string) => `almdGuideKey${code}` as TranslationKey,
  mistakes: () => range(GUIDE_MISTAKES).map((n) => ({ term: `almdGuideMistake${n}` as TranslationKey, text: `almdGuideMistake${n}Fix` as TranslationKey })),
  term: (term: string) => ({ term: `almdTerm_${term}` as TranslationKey, text: `almdTerm_${term}_def` as TranslationKey }),
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
