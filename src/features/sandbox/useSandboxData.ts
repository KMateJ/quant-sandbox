import { useSyncExternalStore } from "react";
import { modules, type ModuleDef, type ModuleSubNavItem } from "../../modules/registry";
import { progressKey } from "../../lib/game/progress";
import { readChallenges, subscribeChallenges } from "../../lib/game/challengeScores";
import type { ChallengeStats } from "../../lib/game/game.types";
import { DESK_IDS, LEGACY_KEYS } from "./sandbox.data";
import { deskSummary } from "./sandbox.math";

export type SandboxDesk = { module: ModuleDef; item: ModuleSubNavItem; deskId: string; completed: string[] };

const EMPTY_CHALLENGES: Readonly<Record<string, ChallengeStats>> = {};
const NO_RAW = "";

/// Raw stored progress strings of every desk, joined; a string snapshot stays stable between reads.
function readRaw(ids: string[]): string {
  try {
    if (typeof localStorage === "undefined") return NO_RAW;
    return JSON.stringify(ids.map((id) => localStorage.getItem(progressKey(id)) ?? (LEGACY_KEYS[id] ? localStorage.getItem(LEGACY_KEYS[id]) : null)));
  } catch {
    return NO_RAW;
  }
}

function subscribeStorage(listener: () => void) {
  window.addEventListener("storage", listener);
  return () => window.removeEventListener("storage", listener);
}

const parse = (raw: string | null) => {
  try {
    const v: unknown = raw ? JSON.parse(raw) : {};
    return v && typeof v === "object" ? (v as Record<string, { completed?: boolean }>) : {};
  } catch {
    return {};
  }
};

/// Registry desks with their saved missions, plus saved challenge stats; empty on the server.
export function useSandboxData(): { desks: SandboxDesk[]; challenges: Readonly<Record<string, ChallengeStats>> } {
  const found = modules.flatMap((module) => {
    const item = module.subNav?.find((i) => i.id === "desk");
    const deskId = DESK_IDS[module.id];
    return item && deskId ? [{ module, item, deskId }] : [];
  });
  const ids = found.map((d) => d.deskId);
  const raw = useSyncExternalStore(subscribeStorage, () => readRaw(ids), () => NO_RAW);
  const stored: (string | null)[] = raw ? JSON.parse(raw) : [];
  const challenges = useSyncExternalStore(subscribeChallenges, readChallenges, () => EMPTY_CHALLENGES);
  const desks = found.map((d, i) => ({ ...d, completed: deskSummary(parse(stored[i] ?? null)).completed }));
  return { desks, challenges };
}
