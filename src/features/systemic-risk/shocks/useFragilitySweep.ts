import { useEffect, useRef, useState } from "react";
import { resolveSweep, type FragilityPoint } from "../engine/fragility.math";
import type { FragilityRequest, FragilityResponse } from "./fragility.protocol";

type Run = { seed: number; points: FragilityPoint[] };

/// Runs the robust-yet-fragile sweep in a worker, one degree at a time. The worker starts when the component
/// using this hook mounts (fragile mode) and restarts when the seed changes.
export function useFragilitySweep(seed: number) {
  const [run, setRun] = useState<Run>({ seed, points: [] });
  const requestId = useRef(0);

  useEffect(() => {
    const worker = new Worker(new URL("./fragility.worker.ts", import.meta.url), { type: "module" });
    const id = ++requestId.current;
    worker.onmessage = (event: MessageEvent<FragilityResponse>) => {
      if (event.data.requestId !== id) return;
      const { point } = event.data;
      setRun((r) => (r.seed === seed ? { seed, points: [...r.points, point] } : { seed, points: [point] }));
    };
    const request: FragilityRequest = { requestId: id, params: { seed } };
    worker.postMessage(request);
    return () => worker.terminate();
  }, [seed]);

  const total = resolveSweep({ seed }).degrees.length;
  const points = run.seed === seed ? run.points : [];
  return { points, total, done: points.length === total };
}
