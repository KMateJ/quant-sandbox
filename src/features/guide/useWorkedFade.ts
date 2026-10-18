import { useState } from "react";
import { blankSteps, checkBlanks, maxFadeLevel } from "./guide.check.logic";
import type { GuideWorkedStep } from "./guide.content.types";

/// State of a faded worked example: the fade level (0 = full example), typed results and their verdicts.
export function useWorkedFade(steps: GuideWorkedStep[], decimalComma: boolean) {
  const [level, setLevel] = useState(0);
  const [inputs, setInputs] = useState<Record<number, string>>({});
  const [verdicts, setVerdicts] = useState<Record<number, boolean> | null>(null);
  const [revealed, setRevealed] = useState(false);

  const max = maxFadeLevel(steps);
  const blanks = blankSteps(steps, level);
  const allCorrect = verdicts !== null && blanks.every((i) => verdicts[i]);

  const goTo = (next: number) => {
    setLevel(Math.max(0, Math.min(next, max)));
    setInputs({});
    setVerdicts(null);
    setRevealed(false);
  };

  return {
    level,
    max,
    blanks,
    inputs,
    verdicts,
    revealed,
    allCorrect,
    setInput: (i: number, value: string) => {
      setInputs((prev) => ({ ...prev, [i]: value }));
      // Editing a checked blank clears its verdict until the next check.
      setVerdicts((prev) => {
        if (!prev || !(i in prev)) return prev;
        const rest = { ...prev };
        delete rest[i];
        return rest;
      });
    },
    check: () => setVerdicts(checkBlanks(steps, level, inputs, decimalComma)),
    reveal: () => setRevealed(true),
    fadeMore: () => goTo(level + 1),
    showFull: () => goTo(0),
  };
}
