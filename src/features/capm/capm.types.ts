/// A named security positioned by its beta and either a fixed actual return or a persistent alpha.
export type CapmAsset = {
  name: string;
  beta: number;
  /// Fixed actual return (e.g. the user-selected asset). Ignored when `alpha` is set.
  expectedReturn?: number;
  /// Reference asset: a persistent alpha offset from the SML, so its actual return tracks E[rm] by beta.
  alpha?: number;
};

/// One market/asset return pair used in the beta regression scatter.
export type BetaObservation = {
  market: number;
  asset: number;
};

/// Which visualisation is active in the CAPM workspace.
export type CapmTab = "sml" | "assets" | "beta";
