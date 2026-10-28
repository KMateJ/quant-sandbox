import { useEffect, useRef, useState } from "react";
import { tournament } from "./asSim.math";
import type { AsParams, Policy, TournamentResult } from "./avellanedaStoikov.types";
import type { AsWorkerRequest, AsWorkerResponse } from "./avellanedaStoikov.worker";

export const PREVIEW_DAYS = 60;
export const FULL_DAYS = 500;

type Shown = { result: TournamentResult; key: string; full: boolean };

/// Tournament of [yours, AS, symmetric]: a small synchronous preview for first paint, the full 500-day run
/// in a worker started by `run()`; a newer request drops older answers.
export function useTournament(policies: Policy[], params: AsParams, seed: number, onDone?: (r: TournamentResult) => void) {
  const key = JSON.stringify([policies, params, seed]);
  const [shown, setShown] = useState<Shown>(() => ({ result: tournament(policies, params, seed, PREVIEW_DAYS), key, full: false }));
  const [pending, setPending] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const requestId = useRef(0);
  const pendingKey = useRef(key);
  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  });

  useEffect(() => () => workerRef.current?.terminate(), []);

  const run = () => {
    if (!workerRef.current) {
      const worker = new Worker(new URL("./avellanedaStoikov.worker.ts", import.meta.url), { type: "module" });
      worker.onmessage = (event: MessageEvent<AsWorkerResponse>) => {
        if (event.data.requestId !== requestId.current) return;
        setShown({ result: event.data.result, key: pendingKey.current, full: true });
        setPending(false);
        doneRef.current?.(event.data.result);
      };
      workerRef.current = worker;
    }
    requestId.current += 1;
    pendingKey.current = key;
    setPending(true);
    const request: AsWorkerRequest = { requestId: requestId.current, policies, params, seed, days: FULL_DAYS };
    workerRef.current.postMessage(request);
  };
  return { ...shown, pending, stale: shown.key !== key, run };
}

export type Tournament = ReturnType<typeof useTournament>;
