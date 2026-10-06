import type { TranslationKey } from "../../i18n";
import type { OptObjective } from "./portfolioOptimization.types";

export const frontierObjectives: Record<OptObjective, { labelKey: TranslationKey; sectionId: string }> = {
  minVariance: { labelKey: "optObjMinVar", sectionId: "efficient-frontier" },
  maxSharpe: { labelKey: "optObjMaxSharpe", sectionId: "sharpe-ratio" },
  targetReturn: { labelKey: "optObjTargetReturn", sectionId: "target-return" },
  targetVolatility: { labelKey: "optObjTargetVol", sectionId: "target-volatility" },
};
