import type { TranslationKey } from "../../../i18n";
import { instrumentLabel } from "../sidePanels.math";
import type { WhatIfBlock, WhatIfId, WhatIfResult, WhatIfVerdict } from "./whatIf.types";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/// i18n key of a scenario title.
export const whatIfTitleKey = (id: WhatIfId) => `hdWi${cap(id)}Title` as TranslationKey;
/// i18n key of a scenario explanation.
export const whatIfBodyKey = (id: WhatIfId) => `hdWi${cap(id)}Body` as TranslationKey;
/// i18n key of a verdict line.
export const whatIfVerdictKey = (v: WhatIfVerdict) => `hdWiV${cap(v)}` as TranslationKey;
/// i18n key of a block message.
export const whatIfBlockKey = (b: WhatIfBlock) => `hdWiB${cap(b)}` as TranslationKey;

/// Tone class suffix for a verdict line.
export function verdictTone(v: WhatIfVerdict): "done" | "urgent" | "info" {
  if (v === "fixesDelta" || v === "cutsGamma" || v === "cutsVega") return "done";
  if (v === "missesBand" || v === "wrongWay" || v === "addsShortGamma" || v === "addsVega" || v === "costly") return "urgent";
  return "info";
}

/// Variables for the explanation text: size and ticker of the first option leg.
export function whatIfVars(r: WhatIfResult): { qty: number; inst: string } {
  const leg = r.orders.find((o) => o.id !== "STOCK") ?? r.orders[0];
  return { qty: leg?.qty ?? 0, inst: leg ? instrumentLabel(leg.id) : "" };
}
