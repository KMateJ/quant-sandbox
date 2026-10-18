import type { TranslationKey } from "../../../i18n";
import type { OptPoint } from "../portfolioOptimization.types";

type T = (key: TranslationKey, options?: Record<string, string | number>) => string;

/// Colour of the selected portfolio in every linked view.
export const SELECTED_COLOR = "#f97316";
/// Colour of the draggable target line.
export const TARGET_COLOR = "#f59e0b";

export const pct1 = (v: number) => `${(v * 100).toFixed(1)}%`;

/// "σ 12.3% · μ 8.1%" readout for a frontier portfolio (screen-reader value text and hover label).
export const pointReadout = (t: T, p: OptPoint) => t("optPointReadout", { vol: pct1(p.vol), ret: pct1(p.ret) });
