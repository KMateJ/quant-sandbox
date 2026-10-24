import { recalculateDeliveryBond, type Scenario } from "./scenarios";
import { accruedInterestOnDates, eurexConversionFactor, generalizedConversionFactor, type DeliverableBond } from "./treasuryFutures.math";

export type SettingsPatch = { notionalCoupon?: number; delivery?: number; deliveryDate?: string; marketYield?: number };

const YEAR_MS = 365.25 * 86400000;
const AMORTIZING_YEARS = 2;

/// `count` equal principal repayments of 100/count spread over the last two years before `maturity`.
export function amortizedPayments(maturity: number, count: number): DeliverableBond["principalPayments"] {
  const years = Math.min(AMORTIZING_YEARS, maturity);
  return Array.from({ length: count }, (_, j) => ({ time: maturity - years + ((j + 1) * years) / count, amount: 100 / count }));
}

/// Applies a bond patch and recomputes scenario-dependent fields (accrued, CF, principal). Throws `TfInputError` on bad input.
export function patchBond(data: Scenario, index: number, patch: Partial<DeliverableBond>): Scenario {
  const bonds = data.bonds.map((bond, i) => {
    if (i !== index) return bond;
    const next = { ...bond, ...patch };
    if (data.id === "bund" && ["couponRate", "maturity", "frequency"].some((key) => key in patch)) {
      if ("maturity" in patch) {
        const timestamp = Date.parse(`${data.deliveryDate}T00:00:00Z`) + next.maturity * YEAR_MS;
        next.maturityDate = new Date(timestamp).toISOString().slice(0, 10);
      }
      next.principalPayments = [{ time: next.maturity, amount: 100 }];
      next.accruedInterest = accruedInterestOnDates(next.couponRate, next.frequency, next.maturityDate!, data.deliveryDate!);
      next.conversionFactor = next.frequency === 1
        ? eurexConversionFactor(next.couponRate, next.maturityDate!, data.deliveryDate!, data.notionalCoupon)
        : generalizedConversionFactor(next, 0, data.notionalCoupon, next.accruedInterest);
    }
    if (data.id === "amortizing" && Object.keys(patch).some((key) => ["couponRate", "maturity", "frequency", "principalPayments"].includes(key))) {
      if ("maturity" in patch) next.principalPayments = amortizedPayments(next.maturity, bond.principalPayments.length);
      return recalculateDeliveryBond(next, data.delivery, data.marketYield, data.notionalCoupon);
    }
    return next;
  });
  return { ...data, bonds };
}

/// Applies notional coupon / delivery / market-yield changes to every bond. Throws `TfInputError` on bad input.
export function patchSettings(data: Scenario, patch: SettingsPatch): Scenario {
  const next = { ...data, ...patch };
  if (data.id === "bund") next.bonds = data.bonds.map((bond) => {
    const maturity = (Date.parse(`${bond.maturityDate}T00:00:00Z`) - Date.parse(`${next.deliveryDate}T00:00:00Z`)) / YEAR_MS;
    const accrued = accruedInterestOnDates(bond.couponRate, bond.frequency, bond.maturityDate!, next.deliveryDate!);
    const updated = { ...bond, maturity, accruedInterest: accrued, principalPayments: [{ time: maturity, amount: 100 }] };
    return {
      ...updated,
      conversionFactor: bond.frequency === 1
        ? eurexConversionFactor(bond.couponRate, bond.maturityDate!, next.deliveryDate!, next.notionalCoupon)
        : generalizedConversionFactor(updated, 0, next.notionalCoupon, accrued),
    };
  });
  if (data.id === "amortizing") next.bonds = data.bonds.map((bond) => recalculateDeliveryBond(bond, next.delivery, next.marketYield, next.notionalCoupon));
  return next;
}

/// Next unused id: A…Z, then A2…Z2, A3…; never repeats an id still in the basket.
export function nextBondId(bonds: readonly DeliverableBond[]): string {
  const used = new Set(bonds.map((b) => b.id));
  for (let round = 1; ; round++) {
    for (let c = 0; c < 26; c++) {
      const id = String.fromCharCode(65 + c) + (round > 1 ? round : "");
      if (!used.has(id)) return id;
    }
  }
}

/// A fresh 6%, 5-year semi-annual bullet bond at par with the next free id.
export function newBond(bonds: readonly DeliverableBond[]): DeliverableBond {
  return {
    id: nextBondId(bonds), couponRate: 0.06, maturity: 5, frequency: 2,
    principalPayments: [{ time: 5, amount: 100 }], cleanPrice: 100, conversionFactor: 1,
    accruedInterest: 0, priceSource: "given",
  };
}
