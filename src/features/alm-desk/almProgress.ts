import { createProgressStore, higherIsBetter } from "../../lib/game/progress";

/// Saved ALM desk results per mission; best = highest final surplus among passed runs.
export const ALM_PROGRESS = createProgressStore("alm", higherIsBetter);
