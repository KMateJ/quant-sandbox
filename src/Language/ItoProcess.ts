export const itoProcessHu = {
  itoProcessTitle: "Itô-folyamat",
  itoProcessDesc:
    "Itô-lemma a logaritmusra: GBM esetén d ln S = (μ − ½σ²)dt + σ dW. A korrigált drift a naiv μ alatt marad.",
  itoProcessControlsTitle: "Paraméterek",
  itoProcessS0Label: "Kezdőár (S₀)",
  itoProcessDriftLabel: "Drift (μ)",
  itoProcessVolLabel: "Volatilitás (σ)",
  itoProcessHorizonLabel: "Időhorizont (T)",
  itoProcessPathsLabel: "Pályák száma",
  itoProcessSeedLabel: "Mag (seed)",
  itoProcessMetricsLabel: "Mutatók",
  itoProcessNaiveDrift: "Naiv drift (μ)",
  itoProcessCorrectedDrift: "Korrigált drift (μ − ½σ²)",
  itoProcessCorrection: "Itô-korrekció (−½σ²)",
  itoProcessCorrectionHelp:
    "A −½σ² tag a volatilitásból adódó konvexitási korrekció; emiatt a ln S várható értéke lassabban nő.",
  itoProcessChartTitle: "ln(S) pályák és a drift",
  itoProcessCorrectLabel: "Korrigált drift",
  itoProcessNaiveLabel: "Naiv drift",
};

export const itoProcessEn = {
  itoProcessTitle: "Itô Process",
  itoProcessDesc:
    "Itô's lemma on the log: for GBM, d ln S = (μ − ½σ²)dt + σ dW. The corrected drift sits below the naive μ.",
  itoProcessControlsTitle: "Parameters",
  itoProcessS0Label: "Initial price (S₀)",
  itoProcessDriftLabel: "Drift (μ)",
  itoProcessVolLabel: "Volatility (σ)",
  itoProcessHorizonLabel: "Time horizon (T)",
  itoProcessPathsLabel: "Number of paths",
  itoProcessSeedLabel: "Seed",
  itoProcessMetricsLabel: "Metrics",
  itoProcessNaiveDrift: "Naive drift (μ)",
  itoProcessCorrectedDrift: "Corrected drift (μ − ½σ²)",
  itoProcessCorrection: "Itô correction (−½σ²)",
  itoProcessCorrectionHelp:
    "The −½σ² term is the convexity correction from volatility; it makes the expected ln S grow more slowly.",
  itoProcessChartTitle: "ln(S) paths and drift",
  itoProcessCorrectLabel: "Corrected drift",
  itoProcessNaiveLabel: "Naive drift",
};
