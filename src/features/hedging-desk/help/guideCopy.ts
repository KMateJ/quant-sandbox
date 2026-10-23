import type { TranslationKey } from "../../../i18n";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const k = (s: string) => `hdGuide${s}` as TranslationKey;

/// Key of playbook step `n` (1-based) of a mission, e.g. `hdGuideM1Step1`.
export const playbookStepKey = (id: string, n: number) => k(`${id}Step${n}`);
/// Key of playbook trap `n` (1-based) of a mission.
export const playbookTrapKey = (id: string, n: number) => k(`${id}Trap${n}`);
/// Key of a panel entry, e.g. `matrix` gives `hdGuidePanelMatrix`.
export const panelKey = (anchor: string) => k(`Panel${cap(anchor)}`);
/// Key of a function-key entry, e.g. `F4` gives `hdGuideKeyF4`.
export const keyKey = (code: string) => k(`Key${code}`);
/// Title key of mistake `n` (1-based).
export const mistakeTitleKey = (n: number) => k(`Mistake${n}Title`);
/// Body key of mistake `n` (1-based).
export const mistakeBodyKey = (n: number) => k(`Mistake${n}Body`);
/// Term label key, e.g. `iv` gives `hdGuideTermIv`.
export const termKey = (term: string) => k(`Term${cap(term)}`);
/// Term definition key, e.g. `iv` gives `hdGuideTermIvDef`.
export const termDefKey = (term: string) => k(`Term${cap(term)}Def`);
