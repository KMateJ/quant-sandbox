import type { TranslationKey } from "../../i18n";
import { urlEnum, urlNumber, urlString } from "../../lib/urlState";
import type { DepositPlan } from "./tvm.math";

export const SOLVE_FOR = ["fv", "payment", "rate", "years"] as const;
export type SolveFor = (typeof SOLVE_FOR)[number];

/// The race's three plans; with the defaults, A and B pay in the same 40,000, A just starts 20 years earlier.
export const DEFAULT_PLANS: DepositPlan[] = [
  { kind: "annual", amount: 1000, start: 0 },
  { kind: "annual", amount: 2000, start: 20 },
  { kind: "lump", amount: 10000, start: 0 },
];
export const RACE_YEARS = 40;
export const PLAN_LABELS: TranslationKey[] = ["tvmRacePlanA", "tvmRacePlanB", "tvmRacePlanC"];

const amount = (i: number) => urlNumber(DEFAULT_PLANS[i].amount, 0, 100_000, 0);
const start = (i: number) => urlNumber(DEFAULT_PLANS[i].start, 0, RACE_YEARS - 1, 0);

/// Query-string schema of the TVM lab: the four inputs, what is solved for, the target, and the race plans.
export const TVM_URL_SCHEMA = {
  p: urlNumber(1000, 0, 10_000, 0),
  pmt: urlNumber(200, 0, 2000, 0),
  r: urlNumber(0.06, 0, 0.15, 4),
  n: urlNumber(20, 1, 40, 0),
  solve: urlEnum(SOLVE_FOR, "fv"),
  target: urlNumber(10_000, 0, 100_000_000, 0),
  a1: amount(0), s1: start(0),
  a2: amount(1), s2: start(1),
  a3: amount(2), s3: start(2),
  /// Sequence-of-returns panel: yearly withdrawal as a share of the starting wealth, and the return order ("" = as given).
  wd: urlNumber(0.06, 0, 0.1, 3),
  seq: urlString(""),
};
