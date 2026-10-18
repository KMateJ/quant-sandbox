/// <reference lib="webworker" />

import { exoticRun, type ExoticRun } from "./monteCarloExotic.math";
import { monteCarloLab } from "./monteCarloLab.math";
import type { McLabParams, McLabResult } from "./monteCarlo.types";

export type McWorkerRequest = { requestId: number; params: McLabParams };
export type McWorkerResponse = { requestId: number; params: McLabParams; result: McLabResult };
/// Path-dependent payoffs run on their own paths (a separate request, so the European analysis is untouched).
export type McExoticRequest = { kind: "exotic"; requestId: number; params: McLabParams };
export type McExoticResponse = { kind: "exotic"; requestId: number; params: McLabParams; run: ExoticRun };

self.onmessage = (event: MessageEvent<McWorkerRequest | McExoticRequest>) => {
  const data = event.data;
  if ("kind" in data && data.kind === "exotic") {
    const run = exoticRun(data.params);
    const response: McExoticResponse = { kind: "exotic", requestId: data.requestId, params: data.params, run };
    self.postMessage(response, [run.european.buffer, run.asian.buffer, run.lookback.buffer, run.maxS.buffer, run.paths.buffer]);
    return;
  }
  const { requestId, params } = data;
  const result = monteCarloLab(params);
  const response: McWorkerResponse = { requestId, params, result };
  // The large arrays move to the main thread instead of being copied.
  self.postMessage(response, [result.terminal.buffer, result.payoff.buffer, result.paths.buffer]);
};

export {};
