import type { HestonControlsState } from "./heston.types";

export const hestonPresets: Record<string, Partial<HestonControlsState>> = {
  almostBs: {
    v0: 0.04,
    theta: 0.04,
    kappa: 4,
    xi: 0.05,
    rho: 0,
  },
  equitySkew: {
    v0: 0.04,
    theta: 0.04,
    kappa: 2,
    xi: 0.6,
    rho: -0.7,
  },
  wildVol: {
    v0: 0.04,
    theta: 0.04,
    kappa: 1,
    xi: 1.2,
    rho: -0.2,
  },
};