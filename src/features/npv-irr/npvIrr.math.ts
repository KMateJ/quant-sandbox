import { irr, npv } from "../../lib/finance/annuity";
import type {
  CashflowItem,
  NpvPoint,
  NpvScheduleRow,
  ProjectMetrics,
  ProjectModel,
} from "./npvIrr.types";

/// Nominal yearly inflow for `year` (1-based) under the model's cashflow pattern.
/// Custom flows are taken verbatim; constant/growing apply growth, tax and inflation.
export function patternInflow(model: ProjectModel, year: number): number {
  if (model.pattern === "custom") return model.customFlows[year - 1] ?? 0;
  const base =
    model.pattern === "growing"
      ? model.annual * Math.pow(1 + model.growth, year - 1)
      : model.annual;
  const afterTax = base * (1 - model.taxRate);
  return afterTax / Math.pow(1 + model.inflation, year);
}

/// The full signed cashflow stream: outlay at t=0, then inflows plus a terminal value.
/// Begin-of-year timing shifts every inflow one period earlier for discounting.
export function cashflowItems(model: ProjectModel): CashflowItem[] {
  const shift = model.timing === "begin" ? 1 : 0;
  const items: CashflowItem[] = [{ year: 0, time: 0, nominal: -model.outlay }];
  for (let year = 1; year <= model.years; year++) {
    let nominal = patternInflow(model, year);
    if (year === model.years) nominal += model.terminalValue;
    items.push({ year, time: Math.max(0, year - shift), nominal });
  }
  return items;
}

/// Collapse the (possibly timing-shifted) stream onto an integer-indexed array
/// suitable for the shared `npv`/`irr` helpers.
export function cashflowArray(model: ProjectModel): number[] {
  const items = cashflowItems(model);
  const maxTime = items.reduce((m, it) => Math.max(m, it.time), 0);
  const arr = new Array<number>(maxTime + 1).fill(0);
  for (const it of items) arr[it.time] += it.nominal;
  return arr;
}

/// Present value of the inflows (positive cashflows) alone, at `rate`.
function presentValueInflows(items: CashflowItem[], rate: number): number {
  let total = 0;
  for (const it of items) {
    if (it.nominal > 0) total += it.nominal / Math.pow(1 + rate, it.time);
  }
  return total;
}

/// Second IRR root when the cashflow sign pattern changes more than once
/// (non-conventional projects). Scans for a sign change away from the primary IRR.
function secondaryIrr(arr: number[], primary: number): number | null {
  if (!Number.isFinite(primary)) return null;
  const f = (r: number) => npv(r, arr);
  let prevR = -0.9;
  let prevV = f(prevR);
  for (let r = -0.9 + 0.01; r <= 2; r += 0.01) {
    const v = f(r);
    if (prevV * v < 0) {
      const root = prevR + (0 - prevV) * (r - prevR) / (v - prevV);
      if (Math.abs(root - primary) > 1e-3) return root;
    }
    prevR = r;
    prevV = v;
  }
  return null;
}

/// All headline metrics derived from one model — the single source of truth.
export function projectMetrics(model: ProjectModel): ProjectMetrics {
  const items = cashflowItems(model);
  const arr = cashflowArray(model);
  const value = npv(model.rate, arr);
  const irrValue = irr(arr);
  const pvInflows = presentValueInflows(items, model.rate);
  const pi = model.outlay === 0 ? NaN : pvInflows / model.outlay;
  return {
    npv: value,
    irr: irrValue,
    irrSecondary: secondaryIrr(arr, irrValue),
    pi,
    payback: discountedPayback(cashflowSchedule(model)),
    pvInflows,
  };
}

/// Net present value of `model` at a given discount `rate` (overrides model rate).
export function modelNpv(model: ProjectModel, rate: number): number {
  return npv(rate, cashflowArray(model));
}

/// NPV profile: NPV across discount rates in [rMin, rMax].
export function npvProfile(
  model: ProjectModel,
  rMin: number,
  rMax: number,
  steps: number
): NpvPoint[] {
  const arr = cashflowArray(model);
  const points: NpvPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const rate = rMin + (i / steps) * (rMax - rMin);
    points.push({ rate, npv: npv(rate, arr) });
  }
  return points;
}

/// Per-year discounted cashflow schedule with a running cumulative present value.
export function cashflowSchedule(model: ProjectModel): NpvScheduleRow[] {
  const items = cashflowItems(model);
  const rows: NpvScheduleRow[] = [];
  let cumulativePv = 0;
  for (const it of items) {
    const discount = 1 / Math.pow(1 + model.rate, it.time);
    const pv = it.nominal * discount;
    cumulativePv += pv;
    rows.push({ year: it.year, cashflow: it.nominal, discount, pv, cumulativePv });
  }
  return rows;
}

/// Discounted payback: interpolated year where cumulative present value turns non-negative.
export function discountedPayback(rows: NpvScheduleRow[]): number | null {
  for (let i = 1; i < rows.length; i++) {
    const prev = rows[i - 1].cumulativePv;
    const curr = rows[i].cumulativePv;
    if (prev < 0 && curr >= 0) {
      return rows[i - 1].year + -prev / (curr - prev);
    }
  }
  return null;
}
