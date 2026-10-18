import type { GuideCheckAnswer, GuideCheckBlock, GuideLessonContent, GuideWorkedStep } from "./guide.content.types";
import type { GuideId } from "./guide.types";

// #region Answers

/// Reads a typed number. With `decimalComma` (Hungarian) a comma is the decimal mark; otherwise commas are
/// thousands separators unless the text is clearly a decimal like "0,35". Spaces and a trailing unit are ignored.
export function parseAnswer(text: string, decimalComma: boolean): number | null {
  let s = text.replace(/\s/g, "").replace(/[%a-zA-ZéÉ]+$/, "").replace(/−/g, "-");
  if (decimalComma ? s.includes(",") : !/^-?\d{1,3}(,\d{3})+(\.\d*)?$/.test(s) && /^-?\d*,\d+$/.test(s)) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else {
    s = s.replace(/,/g, "");
  }
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return null;
  return Number(s);
}

export type NumberVerdict = "correct" | "high" | "low";

/// Whether `guess` is within `tolerance` of `value`, and if not, on which side.
export function judgeNumber(guess: number, value: number, tolerance: number): NumberVerdict {
  if (Math.abs(guess - value) <= tolerance + 1e-12) return "correct";
  return guess > value ? "high" : "low";
}

export type CheckVerdict = NumberVerdict | "wrong" | "invalid";

/// Judges a check: typed text for a number answer, the chosen option index for a choice.
export function judgeCheck(answer: GuideCheckAnswer, input: string | number | null, decimalComma: boolean): CheckVerdict {
  if (answer.type === "choice") {
    if (typeof input !== "number") return "invalid";
    return input === answer.correct ? "correct" : "wrong";
  }
  const guess = typeof input === "string" ? parseAnswer(input, decimalComma) : null;
  return guess === null ? "invalid" : judgeNumber(guess, answer.value, answer.tolerance);
}

/// A result for display: grouped digits, the decimals it was written with, and the unit.
export function formatResult(value: number, unit: string | undefined, language: "en" | "hu"): string {
  const decimals = (String(value).split(".")[1] ?? "").length;
  const n = new Intl.NumberFormat(language === "hu" ? "hu-HU" : "en-US", { maximumFractionDigits: decimals }).format(value);
  return unit ? `${n}${unit === "%" ? "" : " "}${unit}` : n;
}
// #endregion

// #region Faded worked examples

/// Indices of the steps that carry a checkable result, in order.
export const resultSteps = (steps: GuideWorkedStep[]) =>
  steps.flatMap((s, i) => (s.result ? [i] : []));

/// Highest fade level: every result is blank.
export const maxFadeLevel = (steps: GuideWorkedStep[]) => resultSteps(steps).length;

/// Steps whose results are blanks at fade level `level` (0 = full example): the last `level` result steps.
export function blankSteps(steps: GuideWorkedStep[], level: number): number[] {
  const withResult = resultSteps(steps);
  const k = Math.max(0, Math.min(level, withResult.length));
  return k === 0 ? [] : withResult.slice(-k);
}

/// Per blank step, whether the typed answer is within tolerance (unparsable text counts as wrong).
export function checkBlanks(
  steps: GuideWorkedStep[],
  level: number,
  inputs: Record<number, string>,
  decimalComma: boolean,
): Record<number, boolean> {
  const out: Record<number, boolean> = {};
  for (const i of blankSteps(steps, level)) {
    const r = steps[i].result!;
    const guess = parseAnswer(inputs[i] ?? "", decimalComma);
    out[i] = guess !== null && judgeNumber(guess, r.value, r.tolerance) === "correct";
  }
  return out;
}
// #endregion

// #region Review queue

export const DAY_MS = 24 * 60 * 60 * 1000;

/// Last answer to a check: when, and when it was last answered correctly.
export type CheckRecord = { lastAt: number; lastCorrectAt?: number };

export type LessonCheck = { lessonId: GuideId; block: GuideCheckBlock };

/// Every check block of the given lessons, in reading order, for one language.
export function collectChecks(
  lessonIds: GuideId[],
  content: Partial<Record<GuideId, GuideLessonContent>>,
  language: "en" | "hu",
): LessonCheck[] {
  return lessonIds.flatMap((lessonId) =>
    (content[lessonId]?.[language] ?? []).flatMap((block) => (block.kind === "check" ? [{ lessonId, block }] : [])),
  );
}

export type ReviewInput = {
  checks: LessonCheck[];
  readIds: readonly string[];
  /// When each lesson was marked read; a read lesson without a time predates the timestamps and counts as old.
  readAt: Readonly<Record<string, number>>;
  answers: Readonly<Record<string, CheckRecord>>;
  now: number;
  limit?: number;
};

/// Checks due for review: from lessons read at least a day ago, not answered correctly in the last three days.
/// Least recently answered first (never answered before anything else), ties in reading order.
export function selectReviewQueue({ checks, readIds, readAt, answers, now, limit = 3 }: ReviewInput): LessonCheck[] {
  const due = checks.filter(({ lessonId, block }) => {
    if (!readIds.includes(lessonId)) return false;
    const at = readAt[lessonId];
    if (at !== undefined && now - at < DAY_MS) return false;
    const correct = answers[block.id]?.lastCorrectAt;
    return correct === undefined || now - correct >= 3 * DAY_MS;
  });
  const lastAt = (c: LessonCheck) => answers[c.block.id]?.lastAt ?? 0;
  return due
    .map((c, i) => ({ c, i }))
    .sort((a, b) => lastAt(a.c) - lastAt(b.c) || a.i - b.i)
    .slice(0, limit)
    .map(({ c }) => c);
}

/// The record after answering a check at `now`.
export const recordAnswer = (prev: CheckRecord | undefined, correct: boolean, now: number): CheckRecord => ({
  lastAt: now,
  lastCorrectAt: correct ? now : prev?.lastCorrectAt,
});
// #endregion

/// Anchor of a lesson's question group on its track page (lesson pages link to it).
export const checksAnchor = (lessonId: GuideId) => `checks-${lessonId}`;
