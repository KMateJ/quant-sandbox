import { useEffect, useRef, useState } from "react";
import { exoticRun, type ExoticRun } from "./monteCarloExotic.math";
import type { McLabParams } from "./monteCarlo.types";
import type { McExoticRequest, McExoticResponse } from "./monteCarlo.worker";

const DEBOUNCE_MS = 150;

/// Path-dependent run off the main thread, like useMonteCarloLab: the first run is synchronous (pre-rendered page),
/// later inputs are debounced and sent to the lab's worker; the old run stays on screen, marked `pending`.
/// The barrier is not an input: knock-outs are applied on the main thread from each path's maximum.
export function useExoticRun(params: McLabParams) {
  const [shown, setShown] = useState<{ run: ExoticRun; params: McLabParams }>(() => ({ run: exoticRun(params), params }));
  const workerRef = useRef<Worker | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    const worker = new Worker(new URL("./monteCarlo.worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (event: MessageEvent<McExoticResponse>) => {
      if (event.data.kind !== "exotic" || event.data.requestId !== requestId.current) return;
      setShown({ run: event.data.run, params: event.data.params });
    };
    workerRef.current = worker;
    return () => worker.terminate();
  }, []);

  const wanted = JSON.stringify(params);
  const have = JSON.stringify(shown.params);
  useEffect(() => {
    if (wanted === have) {
      requestId.current += 1;
      return;
    }
    const timer = window.setTimeout(() => {
      requestId.current += 1;
      const request: McExoticRequest = { kind: "exotic", requestId: requestId.current, params: JSON.parse(wanted) as McLabParams };
      workerRef.current?.postMessage(request);
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [wanted, have]);

  return { ...shown, pending: wanted !== have };
}
