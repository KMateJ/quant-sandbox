import type { TranslationKey } from "../../../i18n";

const cap = (id: string) => id.charAt(0).toUpperCase() + id.slice(1);

/// Caption title key of a demo step, e.g. `clientFill` → `hdDemoClientFillTitle`.
export const stepTitleKey = (id: string) => `hdDemo${cap(id)}Title` as TranslationKey;
/// Caption body key of a demo step, e.g. `clientFill` → `hdDemoClientFillBody`.
export const stepBodyKey = (id: string) => `hdDemo${cap(id)}Body` as TranslationKey;
