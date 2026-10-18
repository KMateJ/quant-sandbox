import type { GuideBlock, GuideLessonContent } from "./guide.content.types";
import type { GuideId, GuideLessonMeta, GuideTrackId } from "./guide.types";

export type GraphLanguage = "en" | "hu";

/// A lesson title quoted in running text: `start`/`end` span the quotes too, `titleStart`/`titleEnd` only the title.
export type LessonCitation = { id: GuideId; start: number; end: number; titleStart: number; titleEnd: number };

/// `rank` is the node's PageRank in the prerequisite graph, scaled so the average node is 1.
export type GraphNode =
  | { id: string; kind: "lesson"; lessonId: GuideId; track: GuideTrackId; degree: number; rank: number }
  | { id: string; kind: "lab"; moduleId: string; degree: number; rank: number };

/// citation: source quotes target (target is read first) · sequence: reading order · practice: lesson → lab.
export type GraphEdge = { source: string; target: string; kind: "citation" | "sequence" | "practice" };

export type GuideGraph = { nodes: GraphNode[]; edges: GraphEdge[] };

export type GraphSources = {
  lessons: GuideLessonMeta[];
  content: Record<GuideId, GuideLessonContent>;
  /// Registered lesson title in a language (normally `translations[lang][lesson.titleKey]`).
  titleOf: (lesson: GuideLessonMeta, lang: GraphLanguage) => string;
  /// Registry module id for a lab path such as "/payoff?lab=replicate", if it is a module.
  moduleIdForPath: (path: string) => string | undefined;
};

const QUOTES: Record<GraphLanguage, RegExp> = {
  en: /"([^"\n]+)"|“([^”\n]+)”/g,
  hu: /„([^”\n]+)”/g,
};

export const lessonNodeId = (id: GuideId) => `lesson:${id}`;
export const labNodeId = (moduleId: string) => `lab:${moduleId}`;

/// Every quoted span in `text` that exactly equals a registered lesson title of `lang`, in order.
/// Partial matches are ignored, and a lesson never cites itself (`selfId`).
export function findLessonCitations(
  text: string,
  lang: GraphLanguage,
  titles: ReadonlyMap<string, GuideId>,
  selfId?: GuideId
): LessonCitation[] {
  const found: LessonCitation[] = [];
  for (const match of text.matchAll(QUOTES[lang])) {
    const title = match[1] ?? match[2];
    const id = titles.get(title);
    if (!id || id === selfId) continue;
    const start = match.index ?? 0;
    found.push({ id, start, end: start + match[0].length, titleStart: start + 1, titleEnd: start + 1 + title.length });
  }
  return found;
}

/// Title → lesson lookup for one language, as `findLessonCitations` expects.
export function titleIndex(sources: Pick<GraphSources, "lessons" | "titleOf">, lang: GraphLanguage): Map<string, GuideId> {
  return new Map(sources.lessons.map((l) => [sources.titleOf(l, lang), l.id]));
}

/// Plain text of the blocks that can carry citations.
export function blockTexts(blocks: GuideBlock[]): string[] {
  return blocks.flatMap((b) => {
    switch (b.kind) {
      case "p":
      case "h":
      case "note":
        return [b.text];
      case "list":
        return b.items;
      case "lab":
        return [b.text];
      default:
        return [];
    }
  });
}

/// Every lesson-to-lesson citation in either language, before any filtering (source quotes target).
/// `preview` marks citations in the notes after a lesson's last heading (its Summary): signposts to what comes
/// next, not prerequisites.
export function lessonCitations(sources: GraphSources): { source: GuideId; target: GuideId; lang: GraphLanguage; preview: boolean }[] {
  const indexes = { en: titleIndex(sources, "en"), hu: titleIndex(sources, "hu") };
  const out: { source: GuideId; target: GuideId; lang: GraphLanguage; preview: boolean }[] = [];
  for (const lesson of sources.lessons) {
    for (const lang of ["en", "hu"] as const) {
      const blocks = sources.content[lesson.id]?.[lang] ?? [];
      const lastHeading = blocks.map((b) => b.kind).lastIndexOf("h");
      blocks.forEach((block, i) => {
        const preview = block.kind === "note" && i > lastHeading;
        for (const text of blockTexts([block])) {
          for (const c of findLessonCitations(text, lang, indexes[lang], lesson.id)) out.push({ source: lesson.id, target: c.id, lang, preview });
        }
      });
    }
  }
  return out;
}

/// Builds lesson, lab and track-order connections from the curriculum and lesson text (both languages).
/// Citation edges point from the citing lesson to the cited one, which is read earlier; pointers to later
/// lessons in the same track ("the next lesson …") are already covered by the sequence edges.
export function buildGuideGraph(sources: GraphSources): GuideGraph {
  const { lessons, content, moduleIdForPath } = sources;
  const position = new Map(lessons.map((l, i) => [l.id, { i, track: l.track }]));
  const edges = new Map<string, GraphEdge>();
  const add = (edge: GraphEdge) => edges.set(`${edge.kind}|${edge.source}|${edge.target}`, edge);
  const labs = new Set<string>();
  const addLab = (lesson: GuideId, moduleId: string) => {
    labs.add(moduleId);
    add({ source: lessonNodeId(lesson), target: labNodeId(moduleId), kind: "practice" });
  };

  lessons.forEach((lesson, i) => {
    const previous = lessons.slice(0, i).reverse().find((l) => l.track === lesson.track);
    if (previous) add({ source: lessonNodeId(previous.id), target: lessonNodeId(lesson.id), kind: "sequence" });
    for (const lang of ["en", "hu"] as const) {
      for (const block of content[lesson.id]?.[lang] ?? []) {
        const moduleId = block.kind === "lab" ? moduleIdForPath(block.to) : undefined;
        if (moduleId) addLab(lesson.id, moduleId);
      }
    }
    lesson.labs.forEach((m) => addLab(lesson.id, m));
  });

  for (const c of lessonCitations(sources)) {
    if (c.preview) continue;
    const from = position.get(c.source);
    const to = position.get(c.target);
    if (from && to && from.track === to.track && to.i > from.i) continue;
    add({ source: lessonNodeId(c.source), target: lessonNodeId(c.target), kind: "citation" });
  }

  const edgeList = [...edges.values()];
  const degree = new Map<string, number>();
  for (const e of edgeList) {
    degree.set(e.source, (degree.get(e.source) ?? 0) + 1);
    degree.set(e.target, (degree.get(e.target) ?? 0) + 1);
  }
  const nodes: GraphNode[] = [
    ...lessons.map((l) => ({ id: lessonNodeId(l.id), kind: "lesson" as const, lessonId: l.id, track: l.track, degree: degree.get(lessonNodeId(l.id)) ?? 0, rank: 1 })),
    ...[...labs].sort().map((m) => ({ id: labNodeId(m), kind: "lab" as const, moduleId: m, degree: degree.get(labNodeId(m)) ?? 0, rank: 1 })),
  ];
  const ranks = pageRank(nodes.map((n) => n.id), edgeList);
  return { nodes: nodes.map((n) => ({ ...n, rank: ranks.get(n.id) ?? 1 })), edges: edgeList };
}

/// Nodes and edges within `hops` of `centre`, with each node's distance (0 = centre).
export function neighbourhood(graph: GuideGraph, centre: string, hops: number) {
  const distance = new Map<string, number>([[centre, 0]]);
  let frontier = [centre];
  for (let h = 1; h <= hops; h += 1) {
    const next: string[] = [];
    for (const e of graph.edges) {
      for (const [from, to] of [[e.source, e.target], [e.target, e.source]]) {
        if (frontier.includes(from) && !distance.has(to)) {
          distance.set(to, h);
          next.push(to);
        }
      }
    }
    frontier = next;
  }
  return {
    distance,
    nodes: graph.nodes.filter((n) => distance.has(n.id)),
    edges: graph.edges.filter((e) => distance.has(e.source) && distance.has(e.target)),
  };
}

/// Reading-order problems: a lesson quoting a lesson of its own track that comes more than one step later
/// (the immediate next lesson is a normal "next lesson" pointer).
export function readingOrderIssues(sources: GraphSources) {
  const position = new Map(sources.lessons.map((l, i) => [l.id, { i, track: l.track }]));
  const trackIndex = (id: GuideId) => {
    const p = position.get(id)!;
    return sources.lessons.filter((l, i) => l.track === p.track && i < p.i).length;
  };
  const seen = new Set<string>();
  return lessonCitations(sources).filter((c) => {
    const from = position.get(c.source);
    const to = position.get(c.target);
    const key = `${c.source}>${c.target}`;
    if (c.preview || !from || !to || from.track !== to.track || seen.has(key)) return false;
    seen.add(key);
    return trackIndex(c.target) - trackIndex(c.source) > 1;
  });
}

/// Edge key used to highlight edges of a path.
export const edgeKey = (e: Pick<GraphEdge, "source" | "target">) => `${e.source}>${e.target}`;

/// Everything to read before `target`, in a valid reading order: lessons it builds on (citations), the earlier
/// lessons of its track (sequence), and their prerequisites in turn, across tracks. Ties follow curriculum order.
/// Returns the ordered steps (target last), the lessons `target` cites directly, and the prerequisite edges used.
export function learningPath(graph: GuideGraph, target: string, curriculumOrder: ReadonlyMap<string, number>) {
  // prerequisite → dependants, as "you need X before Y" pairs.
  const needs = new Map<string, string[]>();
  const used: GraphEdge[] = [];
  for (const e of graph.edges) {
    const pair = e.kind === "citation" ? [e.target, e.source] : e.kind === "sequence" ? [e.source, e.target] : null;
    if (!pair) continue;
    const [before, after] = pair;
    needs.set(after, [...(needs.get(after) ?? []), before]);
  }
  const ancestors = new Set<string>();
  const stack = [target];
  while (stack.length) {
    for (const before of needs.get(stack.pop()!) ?? []) {
      if (!ancestors.has(before) && before !== target) {
        ancestors.add(before);
        stack.push(before);
      }
    }
  }
  const members = new Set([...ancestors, target]);
  for (const e of graph.edges) if (e.kind !== "practice" && members.has(e.source) && members.has(e.target)) used.push(e);

  // Kahn's algorithm over the prerequisite subgraph, picking the earliest lesson in curriculum order first.
  const indegree = new Map([...members].map((id) => [id, (needs.get(id) ?? []).filter((b) => members.has(b)).length]));
  const rank = (id: string) => curriculumOrder.get(id) ?? Number.MAX_SAFE_INTEGER;
  const ready = [...members].filter((id) => indegree.get(id) === 0);
  const steps: string[] = [];
  while (steps.length < members.size) {
    // A stray mutual citation (a preview in one lesson, a dependency in the other) would stall the sort;
    // fall back to the earliest remaining lesson in curriculum order instead of dropping the rest.
    if (!ready.length) ready.push([...members].filter((id) => !steps.includes(id)).sort((a, b) => rank(a) - rank(b))[0]);
    ready.sort((a, b) => rank(a) - rank(b));
    const next = ready.shift()!;
    if (steps.includes(next)) continue;
    steps.push(next);
    for (const [after, befores] of needs) {
      if (members.has(after) && befores.includes(next)) {
        indegree.set(after, indegree.get(after)! - 1);
        if (indegree.get(after) === 0 && !steps.includes(after)) ready.push(after);
      }
    }
  }
  const direct = new Set(graph.edges.filter((e) => e.kind === "citation" && e.source === target).map((e) => e.target));
  return { steps, direct, edges: new Set(used.map(edgeKey)) };
}

/// How much rank each kind of link passes, and in which direction. A lesson "votes" for what it builds on;
/// a later lesson passes a little to the one before it in its track; lessons pass some to the labs that practise them.
export const RANK_LINKS: Record<GraphEdge["kind"], { weight: number; reverse: boolean }> = {
  citation: { weight: 1, reverse: false },
  sequence: { weight: 0.5, reverse: true },
  practice: { weight: 0.3, reverse: false },
};

/// Weighted PageRank by power iteration (damping 0.85; dangling nodes spread their rank evenly), scaled so the
/// mean is 1. Foundational lessons that many others build on, directly or through other lessons, rank highest.
export function pageRank(ids: string[], edges: GraphEdge[], damping = 0.85, maxIter = 200, tol = 1e-12): Map<string, number> {
  const n = ids.length;
  const index = new Map(ids.map((id, i) => [id, i]));
  const out: { to: number; w: number }[][] = ids.map(() => []);
  for (const e of edges) {
    const link = RANK_LINKS[e.kind];
    const [from, to] = link.reverse ? [e.target, e.source] : [e.source, e.target];
    const a = index.get(from), b = index.get(to);
    if (a !== undefined && b !== undefined) out[a].push({ to: b, w: link.weight });
  }
  const totals = out.map((links) => links.reduce((sum, l) => sum + l.w, 0));
  let rank = new Array<number>(n).fill(1 / n);
  for (let it = 0; it < maxIter; it += 1) {
    const dangling = rank.reduce((sum, r, i) => (totals[i] === 0 ? sum + r : sum), 0);
    const next = new Array<number>(n).fill((1 - damping) / n + (damping * dangling) / n);
    out.forEach((links, i) => {
      for (const l of links) next[l.to] += (damping * rank[i] * l.w) / totals[i];
    });
    const delta = next.reduce((sum, r, i) => sum + Math.abs(r - rank[i]), 0);
    rank = next;
    if (delta < tol) break;
  }
  return new Map(ids.map((id, i) => [id, rank[i] * n]));
}
