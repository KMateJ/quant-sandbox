/// <reference lib="webworker" />

import { feynmanKacRun, varianceReductionRun } from "./monteCarloPages.math";

/// Simulation jobs of the Monte Carlo sub-pages, keyed by the page that asks for them.
const MC_JOBS = { vr: varianceReductionRun, fk: feynmanKacRun };
export type McJobKind = keyof typeof MC_JOBS;
export type McJobRequest = { kind: McJobKind; requestId: number; params: never };
export type McJobResponse = { kind: McJobKind; requestId: number; params: unknown; result: unknown };

self.onmessage = (event: MessageEvent<McJobRequest>) => {
  const { kind, requestId, params } = event.data;
  const result = (MC_JOBS[kind] as (p: unknown) => unknown)(params);
  const response: McJobResponse = { kind, requestId, params, result };
  self.postMessage(response);
};

export {};
