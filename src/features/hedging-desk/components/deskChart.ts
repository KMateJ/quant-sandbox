import type { HedgingDeskModel } from "../useHedgingDesk";

type Translate = (key: string, vars?: Record<string, unknown>) => string;

/// Shared x axis for the desk's day charts: always `[0, days]`, tooltip `D{day}`.
export function dayAxis(desk: HedgingDeskModel, t: Translate) {
  return {
    xDomain: [0, desk.market.days] as [number, number],
    tooltipLabel: (x: number) => t("hdChartDay", { day: Math.round(x) }),
    xFormat: (x: number) => String(Math.round(x)),
  };
}

/// Symmetric y domain `±max(floor, pad·max|v|)`.
export function symmetricDomain(values: number[], floor: number, pad = 1.15): [number, number] {
  let m = 0;
  for (const v of values) if (Math.abs(v) > m) m = Math.abs(v);
  const edge = Math.max(floor, pad * m);
  return [-edge, edge];
}

/// Short axis label for dollar ticks: `−15k`, `+2.5k`, `400`.
export function compactTick(x: number): string {
  const a = Math.abs(x);
  const body = a >= 1000 ? `${Number((a / 1000).toFixed(a >= 10000 ? 0 : 1))}k` : String(Math.round(a));
  return (x < 0 && body !== "0" ? "−" : "") + body;
}
