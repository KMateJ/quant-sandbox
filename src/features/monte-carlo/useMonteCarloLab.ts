import { useEffect, useRef, useState } from "react";
import { monteCarloLab } from "./monteCarloLab.math";
import type { McLabParams, McLabResult } from "./monteCarlo.types";
import type { McWorkerRequest, McWorkerResponse } from "./monteCarlo.worker";

const DEBOUNCE_MS = 120;

/// Runs the lab simulation off the main thread. The first result is computed synchronously (so the
/// pre-rendered page and the first paint have data); later inputs are debounced and sent to a worker,
/// and the previous result stays on screen, marked `pending`, until the new one arrives.
export function useMonteCarloLab(params: McLabParams) {
  const [shown, setShown] = useState<{ result: McLabResult; params: McLabParams }>(() => ({ result: monteCarloLab(params), params }));
  const workerRef = useRef<Worker | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    const worker = new Worker(new URL("./monteCarlo.worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (event: MessageEvent<McWorkerResponse>) => {
      if (event.data.requestId !== requestId.current) return;
      setShown({ result: event.data.result, params: event.data.params });
    };
    workerRef.current = worker;
    return () => worker.terminate();
  }, []);

  const wanted = JSON.stringify(params);
  const have = JSON.stringify(shown.params);
  useEffect(() => {
    if (wanted === have) {
      // Back to what is shown: drop any answer still on its way.
      requestId.current += 1;
      return;
    }
    const timer = window.setTimeout(() => {
      requestId.current += 1;
      const request: McWorkerRequest = { requestId: requestId.current, params: JSON.parse(wanted) as McLabParams };
      workerRef.current?.postMessage(request);
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [wanted, have]);

  return { ...shown, pending: wanted !== have };
}
