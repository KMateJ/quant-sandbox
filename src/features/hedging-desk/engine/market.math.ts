import { makeRng, nextNormal } from "../../../lib/math/random";
import { TRADING_DAYS } from "./desk.config";
import type { Market, MarketSpec } from "./desk.types";

/// The spec's overnight gap for `seed`: its day and signed move in percent, or null without a gap.
/// Drawn from a separate event RNG so the diffusion path never depends on events.
export function gapEvent(spec: MarketSpec, seed: number): { day: number; move: number } | null {
  if (!spec.gap) return null;
  const rng = makeRng((seed ^ 0x9e3779b9) >>> 0);
  const { from, to, size } = spec.gap;
  const day = from + Math.floor(rng() * (to - from + 1));
  const sign = rng() < 0.5 ? -1 : 1;
  return { day, move: sign * size * 100 };
}

/// Implied vol in force on `day`: the latest schedule entry at or before it, else the spec's vol.
export function ivOnDay(spec: MarketSpec, day: number): number {
  let iv = spec.impliedVol;
  let at = -1;
  for (const e of spec.ivSchedule ?? []) {
    if (e.day <= day && e.day > at) {
      iv = e.iv;
      at = e.day;
    }
  }
  return iv;
}

/// Daily GBM path at realized vol (normals drawn in day order), with the spec's IV schedule. The gap
/// day's move is the jump alone (its normal is still drawn, so later days keep their draws).
export function buildMarket(spec: MarketSpec, seed: number): Market {
  const rng = makeRng(seed);
  const dt = 1 / TRADING_DAYS;
  const sigma = spec.realizedVol;
  const drift = (spec.rate - 0.5 * sigma * sigma) * dt;
  const gap = gapEvent(spec, seed);
  const spot = [spec.s0];
  for (let i = 0; i < spec.days; i++) {
    const diffusion = Math.exp(drift + sigma * Math.sqrt(dt) * nextNormal(rng));
    spot.push(spot[i] * (gap && gap.day === i + 1 ? 1 + gap.move / 100 : diffusion));
  }
  const iv = Array.from({ length: spec.days + 1 }, (_, d) => ivOnDay(spec, d));
  return { spot, iv, rate: spec.rate, days: spec.days, strikes: [...spec.strikes], gapDay: gap?.day ?? null };
}
