import type { GraphEdge } from "./guide.graph";
import { guideTracks, trackLessons } from "./guide.meta";
import type { GuideId, GuideTrackId } from "./guide.types";

export type PathLevel = { depth: number; ids: string[] };

/// CSS colour of a guide track (knowledge graph only).
export const trackColor = (track: GuideTrackId) => `var(--track-${track})`;

/// Nodes read directly before `id`: citation targets it quotes, and sequence sources leading into it.
function before(edges: GraphEdge[], id: string): string[] {
  const out: string[] = [];
  for (const e of edges) {
    if (e.kind === "citation" && e.source === id) out.push(e.target);
    else if (e.kind === "sequence" && e.target === id) out.push(e.source);
  }
  return out;
}

/// Nodes read directly after `id` (the reverse of `before`).
function after(edges: GraphEdge[], id: string): string[] {
  const out: string[] = [];
  for (const e of edges) {
    if (e.kind === "citation" && e.target === id) out.push(e.source);
    else if (e.kind === "sequence" && e.source === id) out.push(e.target);
  }
  return out;
}

const unique = (ids: string[], self: string) => [...new Set(ids)].filter((x) => x !== self);

/// Lessons to read before `target`, grouped by shortest distance (1 = directly before).
/// Prerequisite edges: citation (target before source) and sequence (source before target); practice ignored.
/// Depths ≥ `maxDepth` merge into the last level. Ids inside a level keep `order` (curriculum) order.
export function prerequisiteLevels(
  edges: GraphEdge[],
  target: string,
  order: ReadonlyMap<string, number>,
  maxDepth = 3,
): PathLevel[] {
  const depth = new Map<string, number>([[target, 0]]);
  let frontier = [target];
  for (let d = 1; frontier.length; d++) {
    const next: string[] = [];
    for (const id of frontier) {
      for (const prev of before(edges, id)) {
        if (depth.has(prev)) continue;
        depth.set(prev, d);
        next.push(prev);
      }
    }
    frontier = next;
  }
  depth.delete(target);

  const rank = (id: string) => order.get(id) ?? Number.POSITIVE_INFINITY;
  const levels = new Map<number, string[]>();
  for (const [id, d] of depth) {
    const level = Math.min(d, maxDepth);
    levels.set(level, [...(levels.get(level) ?? []), id]);
  }
  return [...levels.entries()]
    .sort(([a], [b]) => a - b)
    .map(([d, ids]) => ({ depth: d, ids: ids.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b)) }));
}

/// Direct neighbours of a lesson node: what it builds on (read before) and what it leads to (read after).
export function lessonLinks(edges: GraphEdge[], id: string): { buildsOn: string[]; leadsTo: string[] } {
  return { buildsOn: unique(before(edges, id), id), leadsTo: unique(after(edges, id), id) };
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/// Short code of a lesson: track number and lesson number, e.g. "02.03"; `undefined` for an unknown id.
export function lessonCode(id: GuideId | string): string | undefined {
  for (const [ti, track] of guideTracks.entries()) {
    const li = trackLessons(track).findIndex((l) => l.id === id);
    if (li >= 0) return `${pad2(ti + 1)}.${pad2(li + 1)}`;
  }
  return undefined;
}
