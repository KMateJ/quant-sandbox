import type { TranslationKey } from "../../../i18n";
import type { AdviceId, AdviceTone } from "./advice.types";

const cap = (id: string) => id.charAt(0).toUpperCase() + id.slice(1);

/// Title key of an advice item, e.g. `outsideBand` → `hdAdvOutsideBandTitle`.
export const adviceTitleKey = (id: AdviceId) => `hdAdv${cap(id)}Title` as TranslationKey;
/// Body key of an advice item, e.g. `outsideBand` → `hdAdvOutsideBandBody`.
export const adviceBodyKey = (id: AdviceId) => `hdAdv${cap(id)}Body` as TranslationKey;
/// Group heading key of a tone, e.g. `urgent` → `hdAdvHeadUrgent`.
export const adviceHeadKey = (tone: AdviceTone) => `hdAdvHead${cap(tone)}` as TranslationKey;
