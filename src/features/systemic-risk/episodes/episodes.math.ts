import { DEFAULT_PARAMS, presetNetwork } from "../engine/presets.math";
import { simulate } from "../engine/simulate.math";
import type { SimResult } from "../engine/systemic.types";
import type { Episode } from "./episodes.types";

/// Switch keys of an episode that are turned off, parsed from a comma list (unknown keys are dropped).
export const parseOff = (ep: Episode, raw: string): Set<string> =>
  new Set(raw.split(",").filter((k) => ep.switches.some((s) => s.key === k)));

/// Event keys whose interventions the `off` switches remove.
const removedEvents = (ep: Episode, off: ReadonlySet<string>): Set<string> =>
  new Set(ep.switches.filter((s) => off.has(s.key)).flatMap((s) => s.events));

/// The episode's network (stylised archetypes; the same one for every what-if).
export const episodeNetwork = (ep: Episode) => presetNetwork(ep.net, ep.seed);

/// Replays the episode on its network: every event's shocks, and the interventions of events not removed by `off`.
export function episodeRun(ep: Episode, off: ReadonlySet<string> = new Set()): SimResult {
  const removed = removedEvents(ep, off);
  const kept = ep.events.filter((e) => !removed.has(e.key));
  const params = { ...DEFAULT_PARAMS, ...ep.params };
  return simulate(
    episodeNetwork(ep),
    ep.events.flatMap((e) => e.shocks),
    params,
    kept.flatMap((e) => e.interventions),
  );
}

/// Index of the latest event whose model day is at or before `day` (-1 before the first event).
export function eventAtDay(ep: Episode, day: number): number {
  let at = -1;
  ep.events.forEach((e, i) => { if (e.day <= day) at = i; });
  return at;
}

/// What removing one switch does, against the run with the same other switches: extra failures and extra loss ($bn).
export function counterfactualDelta(ep: Episode, switchKey: string, off: ReadonlySet<string> = new Set()) {
  const base = episodeRun(ep, new Set([...off].filter((k) => k !== switchKey)));
  const alt = episodeRun(ep, new Set([...off, switchKey]));
  return { defaults: alt.defaults.length - base.defaults.length, totalLoss: alt.totalLoss - base.totalLoss };
}

/// Cumulative defaults and losses by day, for the compare chart.
export function runSeries(run: SimResult) {
  const failed = new Set<string>();
  let loss = 0;
  return run.days.map((d) => {
    for (const [id, s] of Object.entries(d.status)) if (s === "failed") failed.add(id);
    loss += d.losses.direct + d.losses.fireSale + d.losses.funding + d.losses.ccp;
    return { day: d.day, defaults: failed.size, loss };
  });
}

/// Failures under the as-happened run versus a what-if, for the delta line.
export const runTotals = (run: SimResult) => ({ defaults: run.defaults.length, loss: run.totalLoss });
