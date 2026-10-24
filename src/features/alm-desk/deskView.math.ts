import { macaulay, pricePerFace } from "../../lib/finance/immunization";
import { DEFAULT_CONFIG, TENORS, assetsValue, liabilityDuration, liabilityFlows, liabilityPv, shiftCurve, yieldAt, yearsLeft } from "../immunization/immunization.math";
import type { Curve } from "../immunization/immunization.types";
import type { AlmMission, AlmState } from "./engine/alm.types";
import { almConfig } from "./engine/book.math";

export type HoldingRow = {
  kind: "bond" | "cash" | "liability";
  tenor: number;
  left: number;
  coupon: number;
  face: number;
  /// Price per 100 face.
  price: number;
  value: number;
  weight: number;
  dv01: number;
};

/// Rows of the holdings table: each bond, cash, then the liability (value = PV, weight vs assets).
export function holdingRows(state: AlmState, mission: AlmMission): HoldingRow[] {
  const cfg = almConfig(mission);
  const g = state.game;
  const total = assetsValue(g);
  const bonds = [...g.positions]
    .sort((a, b) => a.slot - b.slot)
    .map((p): HoldingRow => {
      const y = yieldAt(g.curve, p.maturity);
      const ppf = pricePerFace(p.coupon, p.maturity, y);
      const value = p.face * ppf;
      return {
        kind: "bond",
        tenor: TENORS[p.slot],
        left: p.maturity,
        coupon: p.coupon,
        face: p.face,
        price: ppf * 100,
        value,
        weight: value / total,
        dv01: ((value * macaulay(p.coupon, p.maturity, y)) / (1 + y)) * 1e-4,
      };
    });
  const cash: HoldingRow = { kind: "cash", tenor: 0, left: 0, coupon: yieldAt(g.curve, 1), face: g.cash, price: 100, value: g.cash, weight: g.cash / total, dv01: 0 };
  const pv = liabilityPv(g, cfg);
  const owed = liabilityFlows(g, cfg).reduce((sum, f) => sum + f.amount, 0);
  const liability: HoldingRow = {
    kind: "liability",
    tenor: cfg.years,
    left: yearsLeft(g, cfg),
    coupon: 0,
    face: owed,
    price: (pv / owed) * 100,
    value: pv,
    weight: pv / total,
    dv01: pv * liabilityDuration(g, cfg) * 1e-4,
  };
  return [...bonds, cash, liability];
}

/// The curve at the start and after each year played (index = round), rebuilt from the logged shocks.
export function curveHistory(state: AlmState, mission: AlmMission): Curve[] {
  const level0 = mission.config.level0 ?? DEFAULT_CONFIG.level0;
  const out: Curve[] = [{ level: level0, slope: 0 }];
  for (const h of state.game.history) out.push(shiftCurve(out[out.length - 1], h.shock));
  return out;
}

/// Long minus short yield in bp, e.g. the 2s10s slope.
export const spreadBp = (curve: Curve, short: number, long: number) => (yieldAt(curve, long) - yieldAt(curve, short)) * 1e4;

/// `[min − pad, max + pad]` over finite values, so a flat series still gets a readable axis.
export function paddedDomain(values: (number | undefined)[], pad: number): [number, number] {
  const xs = values.filter((v): v is number => v !== undefined && Number.isFinite(v));
  return xs.length ? [Math.min(...xs) - pad, Math.max(...xs) + pad] : [-pad, pad];
}

/// Symmetric `±max(floor, 1.15·max|v|)` for a series centred on zero.
export function symmetricDomain(values: (number | undefined)[], floor: number): [number, number] {
  const m = Math.max(0, ...values.map((v) => (v !== undefined && Number.isFinite(v) ? Math.abs(v) : 0)));
  const edge = Math.max(floor, 1.15 * m);
  return [-edge, edge];
}
