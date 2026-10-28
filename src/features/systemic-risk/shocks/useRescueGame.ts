import { useMemo, useState } from "react";
import { recordChallenge } from "../../../lib/game/challengeScores";
import { simulate } from "../engine/simulate.math";
import type { FinNetwork, SimParams } from "../engine/systemic.types";
import { addChunk, chunksToInterventions, removeChunk, rescueHit, rescueRows, rescueScenario } from "./rescue.math";

const CHALLENGE = "syr-rescue";

/// Rescue round: place up to four chunks of capital, run the scenario and compare with the policies.
/// One run is one recorded round; changing the plan afterwards clears the result.
export function useRescueGame(net: FinNetwork, params: SimParams) {
  const [placed, setPlaced] = useState<string[]>([]);
  const [ran, setRan] = useState(false);
  const scenario = useMemo(() => rescueScenario(net), [net]);
  const rows = useMemo(() => (ran ? rescueRows(net, params, placed) : null), [ran, net, params, placed]);
  const shown = useMemo(
    () => simulate(net, scenario.shocks, params, ran ? chunksToInterventions(placed) : []),
    [net, scenario, params, ran, placed],
  );
  const edit = (next: string[]) => { setPlaced(next); setRan(false); };

  return {
    placed, rows, shown, scenario, challengeId: CHALLENGE,
    hit: rows ? rescueHit(rows) : null,
    add: (id: string) => edit(addChunk(placed, id)),
    remove: (id: string) => edit(removeChunk(placed, id)),
    clear: () => edit([]),
    run: () => {
      if (ran) return;
      setRan(true);
      recordChallenge(CHALLENGE, rescueHit(rescueRows(net, params, placed)), Date.now());
    },
  };
}

export type RescueGame = ReturnType<typeof useRescueGame>;
