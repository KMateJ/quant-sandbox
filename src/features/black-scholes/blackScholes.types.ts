export const METRIC_KEYS = ["price", "delta", "gamma", "vega", "theta", "rho"] as const;
export type MetricKey = (typeof METRIC_KEYS)[number];

export const OPTION_TYPES = ["call", "put"] as const;
export type OptionType = (typeof OPTION_TYPES)[number];
