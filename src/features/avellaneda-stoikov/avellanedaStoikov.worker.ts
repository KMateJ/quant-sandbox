/// <reference lib="webworker" />

import { tournament } from "./asSim.math";
import type { AsParams, Policy, TournamentResult } from "./avellanedaStoikov.types";

export type AsWorkerRequest = { requestId: number; policies: Policy[]; params: AsParams; seed: number; days: number };
export type AsWorkerResponse = { requestId: number; result: TournamentResult };

self.onmessage = (event: MessageEvent<AsWorkerRequest>) => {
  const { requestId, policies, params, seed, days } = event.data;
  const response: AsWorkerResponse = { requestId, result: tournament(policies, params, seed, days) };
  self.postMessage(response);
};

export {};
