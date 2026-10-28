import type { Intervention, Shock, SimParams } from "../engine/systemic.types";

/// Archetype roles an episode event can point at; copy turns them into "Troubled investment bank" and so on.
export type EpisodeRole = "troubledBank" | "insurer" | "mmf" | "macroFund" | "regional" | "dealers" | "banks" | "market";

/// One dated event. `key` is the copy key stem; `day` is the model day it is replayed on (not a calendar claim).
export type EpisodeEvent = {
  date: string;
  key: string;
  day: number;
  role: EpisodeRole;
  /// Institution id the graph highlights.
  actor?: string;
  shocks: Shock[];
  interventions: Intervention[];
};

/// A what-if switch: removes the interventions of the listed events.
export type EpisodeSwitch = { key: string; events: string[] };

export type Episode = {
  id: EpisodeId;
  net: "core-periphery" | "starter";
  seed: number;
  params?: Partial<SimParams>;
  events: EpisodeEvent[];
  switches: EpisodeSwitch[];
};

export const EPISODE_IDS = ["gfc", "ltcm", "covid2020", "svb2023"] as const;
export type EpisodeId = (typeof EPISODE_IDS)[number];
