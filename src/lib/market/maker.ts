import type { Side } from "./market.types";

/// One maker execution in currency units; `side` is the maker's side (buy = maker bought), `fee` + is a rebate.
export type MakerFill = { t: number; side: Side; price: number; size: number; mid: number; fee: number };
export type Ledger = { cash: number; inventory: number; fees: number; fills: MakerFill[] };
/// `inventory` is the residual: P&L from holding inventory beyond the markout horizon.
export type PnlParts = { spread: number; adverse: number; inventory: number; fees: number; total: number };

/// A flat ledger with no fills.
export function emptyLedger(): Ledger {
  return { cash: 0, inventory: 0, fees: 0, fills: [] };
}

const sgn = (f: MakerFill) => (f.side === "buy" ? 1 : -1);

/// Book one fill: cash ∓ price·size, inventory ± size, fees += fee.
export function applyFill(l: Ledger, f: MakerFill): Ledger {
  return {
    cash: l.cash - sgn(f) * f.price * f.size,
    inventory: l.inventory + sgn(f) * f.size,
    fees: l.fees + f.fee,
    fills: [...l.fills, f],
  };
}

/// Marked-to-mid P&L: cash + inventory·mid + fees.
export const pnlTotal = (l: Ledger, mid: number) => l.cash + l.inventory * mid + l.fees;

/// Exact split: spread capture vs mid at fill, adverse move over `markout`, fees, inventory as the residual.
export function decompose(l: Ledger, midAt: (t: number) => number, endT: number, markout: number): PnlParts {
  let spread = 0;
  let adverse = 0;
  for (const f of l.fills) {
    spread += sgn(f) * (f.mid - f.price) * f.size;
    adverse += sgn(f) * (midAt(Math.min(f.t + markout, endT)) - f.mid) * f.size;
  }
  const total = pnlTotal(l, midAt(endT));
  return { spread, adverse, inventory: total - spread - adverse - l.fees, fees: l.fees, total };
}
