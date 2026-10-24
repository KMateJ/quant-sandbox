import { createProgressStore, higherIsBetter } from "../../lib/game/progress";

/// Saved mission progress of the portfolio desk; best = final NAV minus the 60/40 NAV.
export const PORTFOLIO_PROGRESS = createProgressStore("portfolio", higherIsBetter);
