/// <reference lib="webworker" />

import { runMonteCarlo } from "./npvIrr.monteCarlo";
import type { MonteCarloConfig, MonteCarloResult, ProjectModel } from "./npvIrr.types";

export type MonteCarloRequest = {
  requestId: number;
  model: ProjectModel;
  config: MonteCarloConfig;
};

export type MonteCarloResponse = {
  requestId: number;
  result: MonteCarloResult;
};

self.onmessage = (event: MessageEvent<MonteCarloRequest>) => {
  const { requestId, model, config } = event.data;
  const result = runMonteCarlo(model, config);
  const response: MonteCarloResponse = { requestId, result };
  self.postMessage(response);
};

export {};
