import { createProgressStore, higherIsBetter } from "../../lib/game/progress";

/// Saved mission progress of the retirement desk; best = total amount spent over the run.
export const RETIREMENT_PROGRESS = createProgressStore("retirement", higherIsBetter);
