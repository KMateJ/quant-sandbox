export type SearchItem = {
  id: string;
  kind: "lab" | "lesson";
  title: string;
  context: string;
  extra?: string;
  href: string;
};

/// Lower-case and strip diacritics, so "Itô" and "kötvény" match "ito" and "kotveny".
export function normalise(s: string): string {
  return s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

const words = (s: string) => normalise(s).split(/[^\p{L}\p{N}]+/u).filter(Boolean);

/// 3 = title starts with the query, 2 = every query word starts a title word, 1 = found elsewhere, 0 = no match.
function score(item: SearchItem, query: string, queryWords: string[]): number {
  const title = normalise(item.title);
  const haystack = `${title} ${normalise(item.context)} ${normalise(item.extra ?? "")}`;
  if (!queryWords.every((w) => haystack.includes(w))) return 0;
  if (title.startsWith(query)) return 3;
  const titleWords = words(item.title);
  return queryWords.every((w) => titleWords.some((tw) => tw.startsWith(w))) ? 2 : 1;
}

/// Items matching every query word, best first: title prefix 3 > title word 2 > context/extra 1; labs before lessons on ties; at most `limit` per kind.
export function searchItems(items: SearchItem[], query: string, limit = 8): SearchItem[] {
  const queryWords = words(query);
  if (!queryWords.length) return [];
  const q = queryWords.join(" ");
  const taken = { lab: 0, lesson: 0 };
  return items
    .map((item, index) => ({ item, index, s: score(item, q, queryWords) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s || Number(b.item.kind === "lab") - Number(a.item.kind === "lab") || a.index - b.index)
    .filter((r) => taken[r.item.kind]++ < limit)
    .map((r) => r.item);
}
