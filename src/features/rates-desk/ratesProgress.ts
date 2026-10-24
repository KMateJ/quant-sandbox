import { createProgressStore, higherIsBetter } from "../../lib/game/progress";

/// Saved rates-desk results; best = final hedged P&L.
export const RATES_PROGRESS = createProgressStore("rates", higherIsBetter);
