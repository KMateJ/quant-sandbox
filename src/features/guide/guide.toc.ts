/// Stable, language-independent anchor id for the n-th section heading of a lesson.
export const headingId = (index: number) => `s-${index + 1}`;

/// Whitespace-normalised heading text for the table of contents.
export const tocLabel = (text: string | null) => (text ?? "").replace(/\s+/g, " ").trim();

const WORDS_PER_MINUTE = 200;

/// Estimated reading time in whole minutes (at least 1).
export function readingMinutes(text: string | null): number {
  const words = (text ?? "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/// Index of the last heading whose top has scrolled above `offset`, or 0.
export function activeHeadingIndex(tops: number[], offset: number): number {
  let active = 0;
  tops.forEach((top, i) => {
    if (top - offset <= 0) active = i;
  });
  return active;
}
