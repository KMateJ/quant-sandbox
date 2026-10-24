import type { BookBond, FactorShock, FutureSpec, RatesMission } from "./rates.types";

const BOOK: BookBond[] = [
  { id: "2Y", coupon: 0.04, maturity: 2, face: 20_000_000 },
  { id: "7Y", coupon: 0.0425, maturity: 7, face: 15_000_000 },
  { id: "10Y", coupon: 0.045, maturity: 10, face: 10_000_000 },
  { id: "25Y", coupon: 0.0475, maturity: 25, face: 6_000_000 },
];
const TU: FutureSpec = { id: "2Y", size: 200_000, basket: [[0.04, 1.8], [0.045, 1.9], [0.0375, 2.0]] };
const FV: FutureSpec = { id: "5Y", size: 100_000, basket: [[0.04, 4.2], [0.0425, 4.6], [0.045, 5.0]] };
const TY: FutureSpec = { id: "10Y", size: 100_000, basket: [[0.0425, 6.6], [0.045, 7.5], [0.0475, 9.0], [0.05, 9.8]] };
const START = { level: 0.045, slope: -0.01, curvature: 0.005 };
const SIGMA = { level: 0.0005, slope: 0.0004, curvature: 0.0004 };
const ZERO = { level: 0, slope: 0, curvature: 0 };
const shock = (drift: Partial<typeof ZERO> = {}): FactorShock => ({ sigma: SIGMA, drift: { ...ZERO, ...drift } });
const base = { days: 20, start: START, book: BOOK, futures: [TU, FV, TY], opening: [0, 0, 0], costPerContract: 15 };

/// The rates desk's five missions.
export const RATES_MISSIONS: readonly RatesMission[] = [
  {
    ...base,
    id: "R1",
    shock: shock(),
    objectives: [{ kind: "dv01Misses", band: 1000, allowed: 2 }, { kind: "pnlWithin", limit: 75_000 }, { kind: "costsBelow", limit: 12_000 }],
  },
  {
    ...base,
    id: "R2",
    shock: shock({ slope: -0.0002 }),
    objectives: [{ kind: "krdMisses", limit: 2000, allowed: 2 }, { kind: "pnlWithin", limit: 100_000 }],
  },
  {
    ...base,
    id: "R3",
    start: { ...START, level: 0.055 },
    shock: shock({ level: 0.0003 }),
    objectives: [{ kind: "dv01Misses", band: 1000, allowed: 1 }, { kind: "pnlWithin", limit: 50_000 }],
  },
  {
    ...base,
    id: "R4",
    book: [],
    shock: shock({ slope: -0.00015 }),
    objectives: [{ kind: "dv01Misses", band: 1000, allowed: 2 }, { kind: "pnlAbove", target: 15_000 }, { kind: "costsBelow", limit: 8000 }],
  },
  {
    ...base,
    id: "R5",
    futures: [TU, FV, { ...TY, id: "10Y-F", expiryDay: 10 }, { ...TY, id: "10Y-B", calendarSpread: -0.15 }],
    opening: [0, 0, -481, 0],
    shock: shock(),
    objectives: [{ kind: "dv01Misses", band: 1000, allowed: 1 }, { kind: "costsBelow", limit: 15_000 }],
  },
];

/// Mission by id; falls back to R1.
export const ratesMissionById = (id: string): RatesMission => RATES_MISSIONS.find((m) => m.id === id) ?? RATES_MISSIONS[0];
