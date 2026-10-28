import type { McVrMethod } from "./monteCarlo.types";

/// Line and band colour per estimator (plain keeps the lab's original estimate colour).
export const ESTIMATOR_COLOR: Record<McVrMethod, string> = { plain: "#38bdf8", antithetic: "#f59e0b", control: "#a855f7", both: "#ef4444" };

/// i18n key of each estimator's name.
export const ESTIMATOR_LABEL = { plain: "monteCarloPlain", antithetic: "monteCarloAntithetic", control: "monteCarloControl", both: "monteCarloBoth" } as const;
