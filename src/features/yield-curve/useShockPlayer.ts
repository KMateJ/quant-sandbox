import { useEffect, useMemo, useState } from "react";
import { usePlayback } from "../../components/playback";
import { presetFor } from "./presets";
import type { YieldCurveModel } from "./useYieldCurve";
import { buildTermStructure, isFeasible, pathAt, shockPath, type Shock } from "./yieldCurve.math";
import type { CurveNode } from "./yieldCurve.types";

/// Playback steps spent on each shock, and how long one shock takes to play.
export const STEPS_PER_SHOCK = 100;
const MS_PER_SHOCK = 1200;

/// Plays `shocks` one after another on the model's par curve. The frames are derived for the player's own chart
/// (nothing is committed per frame); reaching the end commits the final curve once, and `undo` puts the curve
/// from before the first shock back.
export function useShockPlayer(model: YieldCurveModel, shocks: Shock[]) {
  const { nodes, load } = model;
  const steps = shocks.length * STEPS_PER_SHOCK;
  const playback = usePlayback({ steps, initial: 0, durationMs: MS_PER_SHOCK * shocks.length });
  const { step, playing } = playback;
  const engaged = playing || step > 0;

  // The curve the shocks start from, frozen while the player is engaged (committing the end must not move it).
  const [frozen, setFrozen] = useState<CurveNode[] | null>(null);
  if (engaged && frozen === null) setFrozen(nodes);
  if (!engaged && frozen !== null) setFrozen(null);
  const start = frozen ?? nodes;
  const path = useMemo(() => shockPath(start, shocks), [start, shocks]);

  // A shock that pushes a quote past what bootstraps (e.g. a big rise at the 30Y) can't be played.
  const valid = useMemo(() => path.every(isFeasible), [path]);
  const frame = engaged && valid ? pathAt(path, step, STEPS_PER_SHOCK) : start;
  const term = useMemo(() => buildTermStructure(isFeasible(frame) ? frame : start), [frame, start]);

  const finished = engaged && valid && step === steps && !playing;
  useEffect(() => {
    if (finished) load(path[path.length - 1], "custom");
  }, [finished, path, load]);

  return {
    playback,
    steps,
    path,
    /// The par curve and derived term structure at the current playback position.
    term,
    engaged,
    valid,
    /// Index of the shock being played (0-based), clamped to the last one.
    leg: Math.min(shocks.length - 1, Math.floor(step / STEPS_PER_SHOCK)),
    /// Moves to the start of the previous (-1) or next (+1) shock.
    jump: (direction: -1 | 1) => {
      const leg = direction > 0 ? Math.floor(step / STEPS_PER_SHOCK) + 1 : Math.ceil(step / STEPS_PER_SHOCK) - 1;
      playback.setStep(Math.max(0, Math.min(shocks.length, leg)) * STEPS_PER_SHOCK);
    },
    /// Back to the curve from before the first shock.
    undo: () => {
      playback.reset();
      if (frozen) load(frozen, presetFor(frozen));
    },
  };
}
