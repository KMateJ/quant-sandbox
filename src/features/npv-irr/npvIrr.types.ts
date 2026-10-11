/// A point on the NPV profile: discount rate and the resulting net present value.
export type NpvPoint = {
  rate: number;
  npv: number;
};

/// How the yearly inflows evolve over the project horizon.
export type CashflowPattern = "constant" | "growing" | "custom";

/// Whether cashflows land at the end or the beginning of each period (annuity-due).
export type CashflowTiming = "end" | "begin";

/// Full project assumption set — the single source of truth for every calculation.
export type ProjectModel = {
  outlay: number;
  annual: number;
  years: number;
  rate: number;
  pattern: CashflowPattern;
  growth: number;
  inflation: number;
  taxRate: number;
  terminalValue: number;
  timing: CashflowTiming;
  /// Overrides used when `pattern === "custom"`, one nominal inflow per year.
  customFlows: number[];
};

/// One line of the project cashflow stream (year 0 carries the initial outlay).
export type CashflowItem = {
  year: number;
  /// Effective discounting time (shifted one period earlier for begin-of-year timing).
  time: number;
  /// Signed nominal cashflow for the year (negative at t=0).
  nominal: number;
};

/// A row of the discounted cashflow schedule (year 0 is the initial outlay).
export type NpvScheduleRow = {
  year: number;
  cashflow: number;
  discount: number;
  pv: number;
  cumulativePv: number;
};

/// Headline capital-budgeting metrics for a project at its discount rate.
export type ProjectMetrics = {
  npv: number;
  irr: number;
  /// Secondary IRR when the sign pattern admits a second root, else null.
  irrSecondary: number | null;
  pi: number;
  payback: number | null;
  pvInflows: number;
};

/// A named set of assumptions compared against others.
export type Scenario = {
  id: string;
  name: string;
  color: string;
  model: ProjectModel;
};

/// A ready-made example project the user can load from the header.
export type ProjectPreset = {
  id: string;
  labelKey: string;
  model: ProjectModel;
};

/// Which assumption a tornado bar perturbs.
export type SensitivityVar = "annual" | "rate" | "outlay" | "years" | "growth";

/// One tornado bar: low/high NPV when a variable swings by ±range.
export type TornadoRow = {
  variable: SensitivityVar;
  low: number;
  high: number;
  lowValue: number;
  highValue: number;
  baseValue: number;
  swing: number;
};

/// A single cell of the 2-D NPV sensitivity grid.
export type HeatmapCell = {
  xValue: number;
  yValue: number;
  npv: number;
};

/// Parameters that can be mapped onto a heatmap axis.
export type HeatmapAxis = "rate" | "annual" | "outlay" | "years" | "growth";

/// Probability distribution used to perturb a Monte Carlo input.
export type DistributionKind = "normal" | "uniform" | "triangular";

/// Monte Carlo simulation configuration.
export type MonteCarloConfig = {
  iterations: number;
  seed: number;
  distribution: DistributionKind;
  cashflowVol: number;
  growthUncertainty: number;
  rateUncertainty: number;
};

/// Aggregated Monte Carlo outcome statistics plus histogram bins.
export type MonteCarloResult = {
  mean: number;
  median: number;
  std: number;
  probPositive: number;
  p5: number;
  p95: number;
  min: number;
  max: number;
  iterations: number;
  bins: { x0: number; x1: number; count: number }[];
};

/// Option-to-expand assumptions layered on top of the base project.
export type RealOptionConfig = {
  enabled: boolean;
  expansionInvestment: number;
  additionalAnnual: number;
  expansionYear: number;
  probability: number;
};

/// Value decomposition of a project with an embedded expansion option.
export type RealOptionResult = {
  baseNpv: number;
  expansionNpvIfTaken: number;
  optionValue: number;
  flexibleNpv: number;
};
