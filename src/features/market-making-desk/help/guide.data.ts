import type { TranslationKey } from "../../../i18n";

/// Playbook size per mission: steps to pass and traps.
export const GUIDE_PLAYBOOK: Readonly<Record<string, { steps: number; traps: number }>> = {
  MM1: { steps: 4, traps: 2 },
  MM2: { steps: 4, traps: 2 },
  MM3: { steps: 4, traps: 2 },
  MM4: { steps: 4, traps: 2 },
  MM5: { steps: 4, traps: 2 },
};

/// Desk panels the guide can point at (DOM id `mmd-<anchor>`).
export const GUIDE_PANELS = ["mission", "ticket", "risk", "book", "price", "tape", "pnl", "events"] as const;
export const GUIDE_KEYS = ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10"] as const;
export const GUIDE_MISTAKES = 6;
export const GUIDE_TERMS = ["spread", "queue", "inventory", "markout", "adverseSelection", "rebate", "takerFee", "reservationPrice"] as const;

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

/// Copy keys of the guide, grouped as the Guide tab shows them.
export const guideKeys = {
  steps: (id: string) => range(GUIDE_PLAYBOOK[id]?.steps ?? 0).map((n) => `mmdGuide${id}Step${n}` as TranslationKey),
  traps: (id: string) => range(GUIDE_PLAYBOOK[id]?.traps ?? 0).map((n) => `mmdGuide${id}Trap${n}` as TranslationKey),
  panel: (anchor: string) => `mmdGuidePanel_${anchor}` as TranslationKey,
  key: (code: string) => `mmdGuideKey${code}` as TranslationKey,
  mistakes: () => range(GUIDE_MISTAKES).map((n) => ({ term: `mmdGuideMistake${n}` as TranslationKey, text: `mmdGuideMistake${n}Fix` as TranslationKey })),
  term: (term: string) => ({ term: `mmdTerm_${term}` as TranslationKey, text: `mmdTerm_${term}_def` as TranslationKey }),
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
