import { createProgressStore, higherIsBetter } from "../../lib/game/progress";

/// Saved mission progress of the market making desk; best = final P&L in $.
export const MM_PROGRESS = createProgressStore("mm", higherIsBetter);
