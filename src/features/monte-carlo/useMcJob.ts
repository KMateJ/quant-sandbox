import { useEffect, useRef, useState } from "react";
import type { McJobKind, McJobResponse } from "./monteCarloPages.worker";

const DEBOUNCE_MS = 150;

/// Runs a Monte Carlo sub-page job off the main thread. The first result is computed synchronously with `compute`
/// (so the pre-rendered page has data); later inputs are debounced and sent to the worker, and the previous
/// result stays on screen, marked `pending`, until the new one arrives.
export function useMcJob<P, R>(kind: McJobKind, params: P, compute: (p: P) => R) {
  const [shown, setShown] = useState<{ result: R; params: P }>(() => ({ result: compute(params), params }));
  const workerRef = useRef<Worker | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    const worker = new Worker(new URL("./monteCarloPages.worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (event: MessageEvent<McJobResponse>) => {
      if (event.data.requestId !== requestId.current) return;
      setShown({ result: event.data.result as R, params: event.data.params as P });
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
      workerRef.current?.postMessage({ kind, requestId: requestId.current, params: JSON.parse(wanted) });
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [wanted, have, kind]);

  return { ...shown, pending: wanted !== have };
}
