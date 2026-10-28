import { systemicRanking } from "../engine/metrics.math";
import { compareRescues, type RescueOutcome } from "../engine/policies.math";
import type { FinNetwork, Intervention, Shock, SimParams } from "../engine/systemic.types";

export const RESCUE_CHUNK = 10;
export const RESCUE_CHUNKS = 4;
export const RESCUE_BUDGET = RESCUE_CHUNK * RESCUE_CHUNKS;
export const RESCUE_MBS_DROP = 0.3;

/// The fixed rescue scenario: the most systemic dealer (or the top-ranked institution if there is none) defaults
/// on day 0 while mortgage-backed securities lose 20%.
export function rescueScenario(net: FinNetwork): { failed: string; shocks: Shock[] } {
  const ranking = systemicRanking(net).map((r) => r.id);
  const dealers = ranking.filter((id) => net.institutions.find((i) => i.id === id)?.kind === "dealer");
  const failed = dealers[0] ?? ranking[0];
  return { failed, shocks: [{ kind: "default", id: failed }, { kind: "asset", asset: "mbs", drop: RESCUE_MBS_DROP, shape: "instant" }] };
}

/// Adds one chunk for `id`; ignored once the budget of four chunks is spent.
export const addChunk = (placed: string[], id: string): string[] =>
  placed.length >= RESCUE_CHUNKS ? placed : [...placed, id];

/// Removes the latest chunk placed on `id`.
export function removeChunk(placed: string[], id: string): string[] {
  const at = placed.lastIndexOf(id);
  return at < 0 ? placed : placed.filter((_, i) => i !== at);
}

export const chunkCount = (placed: string[], id: string) => placed.filter((p) => p === id).length;

/// Day-0 capital injections for the placed chunks, one intervention per institution.
export function chunksToInterventions(placed: string[]): Intervention[] {
  const ids = [...new Set(placed)];
  return ids.map((id) => ({ kind: "capital", id, amount: RESCUE_CHUNK * chunkCount(placed, id), day: 0 }));
}

/// All policies and the player's plan on the identical scenario.
export function rescueRows(net: FinNetwork, params: SimParams, placed: string[]): RescueOutcome[] {
  return compareRescues(net, rescueScenario(net).shocks, params, RESCUE_BUDGET, RESCUE_CHUNK, chunksToInterventions(placed));
}

/// A hit: the player's plan ends with no more defaults than the DebtRank policy's (ties count).
export function rescueHit(rows: RescueOutcome[]): boolean {
  const mine = rows.find((r) => r.policy === "yours");
  const ref = rows.find((r) => r.policy === "debtRank");
  return Boolean(mine && ref && mine.defaults <= ref.defaults);
}
