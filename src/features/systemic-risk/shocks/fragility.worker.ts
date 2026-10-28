/// <reference lib="webworker" />

import { fragilityJob, type FragilityRequest } from "./fragility.protocol";

self.onmessage = (event: MessageEvent<FragilityRequest>) => {
  for (const response of fragilityJob(event.data)) self.postMessage(response);
};

export {};
