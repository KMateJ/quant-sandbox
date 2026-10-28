import { windowCentre } from "../../lib/market/ladder";
import type { MmHist, MmQuote } from "./engine/mm.types";

/// Closest a quote may sit to mid, in ticks.
export const MIN_OFFSET = 0.5;
/// Seconds of history the price chart shows.
export const CHART_WINDOW = 120;

type Offsets = Pick<MmQuote, "bidOffset" | "askOffset">;

const clamp = (x: number) => Math.max(MIN_OFFSET, x);

/// Both offsets moved by `bid` / `ask` ticks, clamped at the minimum.
export const shiftOffsets = (q: Offsets, bid: number, ask: number): Offsets => ({
  bidOffset: clamp(q.bidOffset + bid),
  askOffset: clamp(q.askOffset + ask),
});

/// One tick further from mid on both sides.
export const widen = (q: Offsets) => shiftOffsets(q, 1, 1);
/// One tick closer to mid on both sides.
export const tighten = (q: Offsets) => shiftOffsets(q, -1, -1);
/// Both quotes one tick lower: sell more readily, buy less readily.
export const skewToSell = (q: Offsets) => shiftOffsets(q, 1, -1);
/// Both quotes one tick higher: buy more readily, sell less readily.
export const skewToBuy = (q: Offsets) => shiftOffsets(q, -1, 1);

/// Session clock: simulated 10:mm:ss and seconds left.
export function clockParts(t: number, seconds: number) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return { mm: pad(Math.floor(t / 60)), ss: pad(t % 60), left: Math.max(0, seconds - t) };
}

/// Ladder centre in ticks after folding the mid history through `windowCentre` (stable, no render state).
export function ladderCentre(hist: readonly MmHist[], tick: number): number {
  let c: number | null = null;
  for (const h of hist) c = windowCentre(c, h.mid / tick);
  return c ?? 0;
}

/// The last `CHART_WINDOW` seconds of history as chart rows (quotes missing → undefined, so the line breaks).
export function chartRows(hist: readonly MmHist[]) {
  return hist.slice(-CHART_WINDOW - 1).map((h) => ({ t: h.t, mid: h.mid, bid: h.bid ?? undefined, ask: h.ask ?? undefined, inv: h.inv }));
}

/// Inventory word: long, short or flat.
export const inventoryWord = (inv: number) => (inv > 0 ? "long" : inv < 0 ? "short" : "flat");
