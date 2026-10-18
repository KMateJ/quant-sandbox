import type { GuideId } from "./guide.types";

export type InlineSegment =
  | { kind: "text"; value: string }
  | { kind: "math"; value: string }
  | { kind: "strong"; value: string }
  | { kind: "em"; value: string }
  /// A quoted lesson title, linked to that lesson.
  | { kind: "link"; value: string; lessonId: GuideId };

/// Finds lesson-title citations in plain text (title range, without the quotes).
export type CitationFinder = (text: string) => { id: GuideId; titleStart: number; titleEnd: number }[];

// Math first, so `*` inside TeX is never read as emphasis.
const TOKEN = /\$([^$]+)\$|\*\*([^*]+)\*\*|\*([^*\s][^*]*)\*/g;

/// Splits plain text at cited lesson titles; the quotes stay as text around the link.
function linkCitations(text: string, cite?: CitationFinder): InlineSegment[] {
  const out: InlineSegment[] = [];
  let last = 0;
  for (const c of cite?.(text) ?? []) {
    if (c.titleStart > last) out.push({ kind: "text", value: text.slice(last, c.titleStart) });
    out.push({ kind: "link", value: text.slice(c.titleStart, c.titleEnd), lessonId: c.id });
    last = c.titleEnd;
  }
  if (last < text.length) out.push({ kind: "text", value: text.slice(last) });
  return out;
}

/// Splits lesson text into plain, `$math$`, `**strong**` and `*em*` segments; with `cite`,
/// quoted lesson titles in plain text become links (never inside math or emphasis).
export function parseInline(text: string, cite?: CitationFinder): InlineSegment[] {
  const out: InlineSegment[] = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    if (at > last) out.push(...linkCitations(text.slice(last, at), cite));
    if (m[1] !== undefined) out.push({ kind: "math", value: m[1] });
    else if (m[2] !== undefined) out.push({ kind: "strong", value: m[2] });
    else out.push({ kind: "em", value: m[3] });
    last = at + m[0].length;
  }
  if (last < text.length) out.push(...linkCitations(text.slice(last), cite));
  return out;
}
