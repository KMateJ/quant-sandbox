import type { MissionDef } from "./engine/desk.types";
import { parseInstrument } from "./engine/instruments.math";

/// One line of a mission's setup table; the UI turns `kind` + `vars` into text.
export type SetupRow =
  | { kind: "book"; vars: { side: "long" | "short"; qty: number; type: "C" | "P" | "S"; strike: number } }
  | { kind: "spot"; vars: { spot: number } }
  | { kind: "impliedVol"; vars: { iv: number } }
  | { kind: "realizedVol"; vars: Record<string, never> }
  | { kind: "horizon"; vars: { days: number } }
  | { kind: "band"; vars: { band: number } }
  | { kind: "ticketFee"; vars: { fee: number } }
  | { kind: "tradeLimit"; vars: { limit: number } }
  | { kind: "gap"; vars: { size: number; from: number; to: number } }
  | { kind: "ivPath"; vars: { day: number; iv: number } }
  | { kind: "physical"; vars: Record<string, never> };

/// Setup rows generated from mission data; optional mechanics appear only when set.
export function setupRows(mission: MissionDef): SetupRow[] {
  const { market, costs } = mission;
  const rows: SetupRow[] = mission.opening.map((o) => {
    const inst = parseInstrument(o.id);
    const side = o.side === "buy" ? "long" : "short";
    return inst.kind === "stock"
      ? { kind: "book", vars: { side, qty: o.qty, type: "S", strike: 0 } }
      : { kind: "book", vars: { side, qty: o.qty, type: inst.type, strike: inst.strike } };
  });
  rows.push(
    { kind: "spot", vars: { spot: market.s0 } },
    { kind: "impliedVol", vars: { iv: market.impliedVol * 100 } },
    { kind: "realizedVol", vars: {} },
    { kind: "horizon", vars: { days: market.days } },
    { kind: "band", vars: { band: mission.band } },
  );
  if (costs.ticketFee > 0) rows.push({ kind: "ticketFee", vars: { fee: costs.ticketFee } });
  if (mission.maxTrades !== undefined) rows.push({ kind: "tradeLimit", vars: { limit: mission.maxTrades } });
  if (market.gap) rows.push({ kind: "gap", vars: { size: market.gap.size * 100, from: market.gap.from, to: market.gap.to } });
  for (const s of market.ivSchedule ?? []) rows.push({ kind: "ivPath", vars: { day: s.day, iv: s.iv * 100 } });
  if (mission.settlement === "physical") rows.push({ kind: "physical", vars: {} });
  return rows;
}
