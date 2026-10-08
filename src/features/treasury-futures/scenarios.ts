import {
  accruedInterest,
  accruedInterestOnDates,
  cashFlowsAfterDelivery,
  eurexConversionFactor,
  generalizedConversionFactor,
  type DeliverableBond,
} from "./treasuryFutures.math";

export type ScenarioId = "bund" | "five-bonds" | "fractional-quote" | "amortizing";
export type Scenario = { id: ScenarioId; delivery: number; deliveryDate?: string; notionalCoupon: number; marketYield: number; futures: number; bonds: DeliverableBond[]; note: string };

const bullet = (maturity: number): { time: number; amount: number }[] => [{ time: maturity, amount: 100 }];
const parPayments = (maturity: number, count: number, years: number): { time: number; amount: number }[] =>
  Array.from({ length: count }, (_, i) => ({ time: maturity - years + (i + 1) * years / count, amount: 100 / count }));

export const SCENARIO_LABELS: Record<ScenarioId, string> = {
  bund: "Exercise 1 · Eurex Bund",
  "five-bonds": "Exercise 2 · Five-bond CTD",
  "fractional-quote": "Exercise 3 · 93'08 quote",
  amortizing: "Exercise 4 · Amortizing bonds",
};

export function loadScenario(id: ScenarioId): Scenario {
  if (id === "bund") {
    const deliveryDate = "2027-03-10";
    return {
      id, delivery: 0, deliveryDate, notionalCoupon: 0.06, marketYield: 0.06, futures: 0,
      note: "Assumed: 10 March 2027 is a business day; remaining maturity is floored to a quarter-year; annual compounding at the notional coupon; accrued coupon uses actual elapsed days over the actual coupon period; clean factor rounded to 4 decimals. These classroom assumptions do not reproduce every Eurex production-date convention.",
      bonds: [
        { id: "A", couponRate: 0.0025, maturity: 8.9336, maturityDate: "2036-02-15", frequency: 1, principalPayments: bullet(8.9336), cleanPrice: 0, conversionFactor: eurexConversionFactor(0.0025, "2036-02-15", deliveryDate), accruedInterest: accruedInterestOnDates(0.0025, 1, "2036-02-15", deliveryDate), priceSource: "given" },
        { id: "B", couponRate: 0.005, maturity: 9.4305, maturityDate: "2036-08-15", frequency: 1, principalPayments: bullet(9.4305), cleanPrice: 0, conversionFactor: eurexConversionFactor(0.005, "2036-08-15", deliveryDate), accruedInterest: accruedInterestOnDates(0.005, 1, "2036-08-15", deliveryDate), priceSource: "given" },
      ],
    };
  }

  if (id === "five-bonds") {
    return {
      id, delivery: 0, notionalCoupon: 0.06, marketYield: 0, futures: 150,
      note: "Worksheet market clean prices and conversion factors are used as given. Accrued interest is omitted from the worksheet; the default display uses zero and can be edited.",
      bonds: [
        ["A", 89.7, 0.5922], ["B", 91.3, 0.6011], ["C", 95.4, 0.63], ["D", 88.2, 0.5844], ["E", 92.3, 0.6102],
      ].map(([id, cleanPrice, conversionFactor]) => ({
        id: String(id), couponRate: 0, maturity: 1, frequency: 1, principalPayments: bullet(1),
        cleanPrice: Number(cleanPrice), conversionFactor: Number(conversionFactor), accruedInterest: 0, priceSource: "given" as const,
      })),
    };
  }

  if (id === "fractional-quote") {
    return {
      id, delivery: 0, notionalCoupon: 0.06, marketYield: 0, futures: 93 + 8 / 32,
      note: "The 93'08 quotation is converted exactly to 93.25 (8/32). Worksheet clean prices and conversion factors are used as given; accrued interest is unspecified and set to zero.",
      bonds: [
        ["A", 99.5, 1.0382], ["B", 143.5, 1.5188], ["C", 119.75, 1.2615],
      ].map(([id, cleanPrice, conversionFactor]) => ({
        id: String(id), couponRate: 0, maturity: 1, frequency: 1, principalPayments: bullet(1),
        cleanPrice: Number(cleanPrice), conversionFactor: Number(conversionFactor), accruedInterest: 0, priceSource: "given" as const,
      })),
    };
  }

  const delivery = 2, marketYield = 0.09, notionalCoupon = 0.06;
  const definitions = [
    { id: "A", couponRate: 0.10, maturity: 5.25, frequency: 1, principalPayments: parPayments(5.25, 2, 2) },
    { id: "B", couponRate: 0.10, maturity: 3, frequency: 2, principalPayments: bullet(3) },
    { id: "C", couponRate: 0.16, maturity: 3.25, frequency: 2, principalPayments: parPayments(3.25, 4, 2) },
  ];
  const bonds = definitions.map((bond) => {
    const ai = accruedInterest(bond, delivery);
    const marketFlows = cashFlowsAfterDelivery(bond, delivery, marketYield);
    const cleanPrice = marketFlows.reduce((sum, flow) => sum + flow.presentValue, 0) - ai;
    return {
      ...bond, cleanPrice, accruedInterest: ai,
      conversionFactor: generalizedConversionFactor(bond, delivery, notionalCoupon),
      priceSource: "calculated" as const,
    };
  });
  return {
    id, delivery, notionalCoupon, marketYield, futures: 100, bonds,
    note: "The worksheet gives no futures quote or exact coupon-calendar/day-count convention. Futures is initialized to 100 for experimentation. Assumed: valuation at delivery; coupon/principal cash flows on or before delivery belong to the prior holder; post-delivery flows are discounted at nominal 9% with each bond's coupon frequency; linear accrued interest; factors are clean theoretical 6% prices rounded to 4 decimals. This generalized classroom factor is not a CME/Eurex contract factor.",
  };
}

export function recalculateDeliveryBond(
  bond: DeliverableBond,
  delivery: number,
  marketYield: number,
  notionalCoupon: number,
): DeliverableBond {
  const accrued = accruedInterest(bond, delivery);
  const marketFlows = cashFlowsAfterDelivery(bond, delivery, marketYield);
  return {
    ...bond,
    accruedInterest: accrued,
    cleanPrice: marketFlows.reduce((sum, flow) => sum + flow.presentValue, 0) - accrued,
    conversionFactor: generalizedConversionFactor(bond, delivery, notionalCoupon),
    priceSource: "calculated",
  };
}
