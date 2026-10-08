export type PrincipalPayment = { time: number; amount: number };

export type DeliverableBond = {
  id: string;
  couponRate: number;
  maturity: number;
  frequency: number;
  principalPayments: PrincipalPayment[];
  cleanPrice: number;
  conversionFactor: number;
  accruedInterest: number;
  priceSource: "given" | "calculated";
  maturityDate?: string;
};

export type CashFlow = {
  time: number;
  coupon: number;
  principal: number;
  presentValue: number;
};

export type DeliveryEconomics = DeliverableBond & {
  adjustedFuturesPrice: number;
  invoiceClean: number;
  invoiceDirty: number;
  marketDirty: number;
  netBasis: number;
  dirtyCostDifference: number;
};

/// Convert a Treasury quote such as 93'08 into decimal points.
export function parseTreasuryQuote(quote: string): number {
  const match = quote.trim().match(/^(\d+)(?:['-](\d{1,2}))?$/);
  if (!match) throw new RangeError(`Invalid Treasury futures quote: ${quote}`);
  const thirtySeconds = Number(match[2] ?? 0);
  if (thirtySeconds > 31) throw new RangeError("Treasury quote fractions must be 0–31/32.");
  return Number(match[1]) + thirtySeconds / 32;
}

/// Coupon and principal schedule from time zero; coupon is paid on outstanding principal.
export function buildCashFlows(
  bond: Pick<DeliverableBond, "couponRate" | "maturity" | "frequency" | "principalPayments">,
): Omit<CashFlow, "presentValue">[] {
  if (!(bond.frequency > 0) || !(bond.maturity > 0)) throw new RangeError("Frequency and maturity must be positive.");
  const periods = Math.ceil(bond.maturity * bond.frequency - 1e-9);
  const couponDates = Array.from({ length: periods }, (_, i) => bond.maturity - (periods - i - 1) / bond.frequency);
  const principal = [...bond.principalPayments].sort((a, b) => a.time - b.time);
  const eventDates = [...new Set([...couponDates, ...principal.map((p) => p.time), bond.maturity])]
    .sort((a, b) => a - b);
  const flows = [];
  let outstanding = 100;
  let accruedCoupon = 0;
  let previousTime = 0;
  for (const time of eventDates) {
    accruedCoupon += outstanding * bond.couponRate * (time - previousTime);
    previousTime = time;
    const paid = principal.filter((p) => Math.abs(p.time - time) < 1e-7)
      .reduce((sum, p) => sum + p.amount, 0);
    if (paid < -1e-9 || paid > outstanding + 1e-7) throw new RangeError("Principal repayments must be non-negative and cannot exceed outstanding principal.");
    const couponDate = couponDates.some((couponTime) => Math.abs(couponTime - time) < 1e-7);
    flows.push({ time, coupon: couponDate ? accruedCoupon : 0, principal: paid });
    if (couponDate) accruedCoupon = 0;
    outstanding -= paid;
  }
  if (Math.abs(outstanding) > 1e-6) throw new RangeError("Principal schedule must repay 100 by maturity.");
  if (principal.some((p) => p.time > bond.maturity || p.time <= 0)) throw new RangeError("Principal repayment dates must be after valuation and no later than maturity.");
  return flows;
}

/// Discount only cash flows strictly after delivery; delivery-date flows belong to the seller.
export function cashFlowsAfterDelivery(
  bond: Pick<DeliverableBond, "couponRate" | "maturity" | "frequency" | "principalPayments">,
  delivery: number,
  yieldRate: number,
): CashFlow[] {
  if (yieldRate <= -bond.frequency) throw new RangeError("Yield must leave a positive per-period discount base.");
  return buildCashFlows(bond)
    .filter((flow) => flow.time > delivery + 1e-8)
    .map((flow) => {
      const df = Math.pow(1 + yieldRate / bond.frequency, -bond.frequency * (flow.time - delivery));
      return { ...flow, presentValue: (flow.coupon + flow.principal) * df };
    });
}

/// Eurex-style 6% theoretical clean price with remaining maturity floored to quarters.
/// The exercise does not specify the full Eurex date/rounding implementation; this explicit
/// classroom convention uses annual compounding and subtracts actual-period accrued coupon interest.
export function eurexConversionFactor(
  couponRate: number,
  maturityDate: string,
  deliveryDate: string,
  notionalYield = 0.06,
): number {
  if (notionalYield <= -1) throw new RangeError("Notional yield must be greater than -100%.");
  const yearsRaw = (Date.parse(`${maturityDate}T00:00:00Z`) - Date.parse(`${deliveryDate}T00:00:00Z`)) / (365.25 * 86400000);
  if (!(yearsRaw > 0)) throw new RangeError("Maturity must follow delivery.");
  const years = Math.floor(yearsRaw * 4 + 1e-9) / 4;
  const n = Math.floor(years + 1e-9);
  const frac = years - n;
  let pv = 0;
  for (let i = 1; i <= n; i++) pv += 100 * couponRate / Math.pow(1 + notionalYield, i);
  if (frac > 1e-9) pv += (100 * couponRate + 100) / Math.pow(1 + notionalYield, n + frac);
  else pv += 100 / Math.pow(1 + notionalYield, n);
  const accrued = accruedInterestOnDates(couponRate, 1, maturityDate, deliveryDate);
  return Math.round(((pv - accrued) / 100) * 1e4) / 1e4;
}

/// Actual/actual accrued coupon estimate between a dated bond's coupon dates.
export function accruedInterestOnDates(
  couponRate: number,
  frequency: number,
  maturityDate: string,
  deliveryDate: string,
  outstanding = 100,
): number {
  if (!(frequency > 0) || 12 % frequency !== 0) throw new RangeError("Coupon frequency must divide twelve.");
  const maturity = new Date(`${maturityDate}T00:00:00Z`);
  const delivery = new Date(`${deliveryDate}T00:00:00Z`);
  if (!Number.isFinite(maturity.getTime()) || !Number.isFinite(delivery.getTime()) || maturity <= delivery) {
    throw new RangeError("Maturity date must follow a valid delivery date.");
  }
  const months = 12 / frequency;
  const lastCoupon = new Date(maturity);
  while (lastCoupon > delivery) lastCoupon.setUTCMonth(lastCoupon.getUTCMonth() - months);
  const nextCoupon = new Date(lastCoupon);
  nextCoupon.setUTCMonth(nextCoupon.getUTCMonth() + months);
  const fraction = (delivery.getTime() - lastCoupon.getTime()) / (nextCoupon.getTime() - lastCoupon.getTime());
  return outstanding * couponRate / frequency * fraction;
}

/// Generalized educational conversion factor: discounted post-delivery cash flows at notional yield,
/// less delivery-date accrued interest, per 100 face. This is not a CME/Eurex contract rule.
export function generalizedConversionFactor(
  bond: Pick<DeliverableBond, "couponRate" | "maturity" | "frequency" | "principalPayments">,
  delivery: number,
  notionalCoupon = 0.06,
  accruedOverride?: number,
): number {
  const flows = cashFlowsAfterDelivery(bond, delivery, notionalCoupon);
  if (flows.length === 0) throw new RangeError("Delivery must occur before the bond's final cash flow.");
  const dirty = flows.reduce((sum, flow) => sum + flow.presentValue, 0);
  const accrued = accruedOverride ?? accruedInterest(bond, delivery);
  return Math.round(((dirty - accrued) / 100) * 1e4) / 1e4;
}

/// Linear accrued-interest estimate between scheduled coupon dates (30/360-style classroom convention).
export function accruedInterest(
  bond: Pick<DeliverableBond, "couponRate" | "frequency" | "maturity" | "principalPayments">,
  elapsed: number,
): number {
  if (elapsed < 0 || elapsed >= bond.maturity) throw new RangeError("Accrual date must fall before bond maturity.");
  const period = 1 / bond.frequency;
  const lastCoupon = bond.maturity - Math.ceil((bond.maturity - elapsed - 1e-8) * bond.frequency) / bond.frequency;
  const sinceCoupon = elapsed - lastCoupon;
  const within = sinceCoupon < 1e-8 ? 0 : sinceCoupon;
  if (within < 1e-8 || Math.abs(within - period) < 1e-8) return 0;
  const outstanding = 100 - bond.principalPayments
    .filter((payment) => payment.time < elapsed - 1e-8)
    .reduce((sum, payment) => sum + payment.amount, 0);
  return outstanding * bond.couponRate / bond.frequency * within / period;
}

/// Compare clean net basis and the corresponding dirty settlement cash flows.
export function deliveryEconomics(bonds: DeliverableBond[], futuresPrice: number): DeliveryEconomics[] {
  if (!Number.isFinite(futuresPrice)) throw new RangeError("Futures price must be finite.");
  return bonds.map((bond) => {
    const adjustedFuturesPrice = futuresPrice * bond.conversionFactor;
    const invoiceClean = adjustedFuturesPrice;
    const invoiceDirty = invoiceClean + bond.accruedInterest;
    const marketDirty = bond.cleanPrice + bond.accruedInterest;
    return {
      ...bond, adjustedFuturesPrice, invoiceClean, invoiceDirty, marketDirty,
      netBasis: bond.cleanPrice - invoiceClean,
      dirtyCostDifference: marketDirty - invoiceDirty,
    };
  });
}

/// Lower envelope of clean net-basis lines and pairwise futures-price switching points.
export function switchingPoints(bonds: DeliverableBond[]): { price: number; from: string; to: string }[] {
  const points: { price: number; from: string; to: string }[] = [];
  for (let i = 0; i < bonds.length; i++) for (let j = i + 1; j < bonds.length; j++) {
    const a = bonds[i], b = bonds[j];
    const denominator = a.conversionFactor - b.conversionFactor;
    if (Math.abs(denominator) < 1e-12) continue;
    const price = (a.cleanPrice - b.cleanPrice) / denominator;
    if (price > 0 && Number.isFinite(price)) {
      const epsilon = Math.max(1e-4, price * 1e-6);
      const lower = bonds.reduce((best, bond) =>
        bond.cleanPrice - (price - epsilon) * bond.conversionFactor <
        best.cleanPrice - (price - epsilon) * best.conversionFactor ? bond : best);
      const upper = bonds.reduce((best, bond) =>
        bond.cleanPrice - (price + epsilon) * bond.conversionFactor <
        best.cleanPrice - (price + epsilon) * best.conversionFactor ? bond : best);
      if (lower.id !== upper.id) points.push({ price, from: lower.id, to: upper.id });
    }
  }
  return points.sort((a, b) => a.price - b.price)
    .filter((point, index, all) => index === 0 || Math.abs(point.price - all[index - 1].price) > 1e-6);
}

export function cheapestBond(economics: DeliveryEconomics[]): DeliveryEconomics | undefined {
  return economics.reduce<DeliveryEconomics | undefined>(
    (best, bond) => !best || bond.netBasis < best.netBasis ? bond : best,
    undefined,
  );
}
