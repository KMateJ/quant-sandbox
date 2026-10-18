import type { McEstimator } from "./monteCarlo.types";

/// Line and band colour per estimator (plain keeps the lab's original estimate colour).
export const ESTIMATOR_COLOR: Record<McEstimator, string> = { plain: "#38bdf8", antithetic: "#f59e0b", control: "#a855f7" };

/// i18n key of each estimator's name.
export const ESTIMATOR_LABEL = { plain: "monteCarloPlain", antithetic: "monteCarloAntithetic", control: "monteCarloControl" } as const;
