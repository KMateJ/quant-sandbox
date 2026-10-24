import { useProgress } from "../../components/game/gameHooks";
import type { ProgressMap } from "../../lib/game/game.types";
import { HEDGING_PROGRESS } from "./deskProgress";

/// Mission progress from localStorage; "nothing completed" during pre-render and hydration.
export const useDeskProgress = (): ProgressMap => useProgress(HEDGING_PROGRESS);
