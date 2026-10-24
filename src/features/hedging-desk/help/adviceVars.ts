import { money, num, pct, signed, signedMoney } from "../../../components/game/gameFormat";
import type { Advice, AdviceId } from "./advice.types";

type Formatter = (x: number) => string;

const count: Formatter = (x) => num(x, 0);
const dollars1: Formatter = (x) => "$" + num(x, 1);

const SIGNED = new Set(["delta", "before", "after", "gamma", "net", "held"]);
const SIGNED_MONEY = new Set(["pnl", "vegaPnl", "vega"]);
const MONEY = new Set(["loss", "fee", "costs", "perDollar"]);
const DOLLARS_1 = new Set(["breakeven", "implied"]);
const MONEY_LIMIT: AdviceId[] = ["vegaDeadline", "pnlDrift", "costsHigh"];

/// Number formatting per variable name; `limit` is a dollar amount only for the dollar-limited rules.
function formatterFor(id: AdviceId, name: string): Formatter {
  if (SIGNED.has(name)) return (x) => signed(x);
  if (SIGNED_MONEY.has(name)) return signedMoney;
  if (MONEY.has(name) || (name === "limit" && MONEY_LIMIT.includes(id))) return money;
  if (DOLLARS_1.has(name)) return dollars1;
  if (name === "iv") return (x) => pct(x / 100, 0);
  return count;
}

/// Advice variables as display strings for the copy templates, e.g. `delta: -549` → `"−549"`.
export function formatAdviceVars(advice: Advice): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, value] of Object.entries(advice.vars)) out[name] = formatterFor(advice.id, name)(value);
  return out;
}
