import { useEffect, useState } from "react";
import { classifyAccuracy, GAME_LENGTH, tickTest } from "./spreadEstimation.math";
import type { Print } from "./spreadEstimation.types";

/// One classify game over the first `GAME_LENGTH` prints: tap Buy / Sell (keys B / S, ← undoes).
/// `onFinish` fires once with your accuracy when the last print is classified.
export function useClassifyGame(prints: Print[], resetKey: unknown, onFinish?: (accuracy: number) => void) {
  const game = prints.slice(0, GAME_LENGTH);
  const [guesses, setGuesses] = useState<(1 | -1)[]>([]);
  const [key, setKey] = useState(resetKey);
  if (key !== resetKey) {
    setKey(resetKey);
    setGuesses([]);
  }
  const done = guesses.length >= game.length;

  const guess = (q: 1 | -1) => {
    if (done) return;
    const next = [...guesses, q];
    setGuesses(next);
    if (next.length === game.length) onFinish?.(classifyAccuracy(next, game));
  };
  const undo = () => !done && setGuesses((g) => g.slice(0, -1));
  const restart = () => setGuesses([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const k = e.key.toLowerCase();
      if (k === "b") guess(1);
      else if (k === "s") guess(-1);
      else if (e.key === "ArrowLeft") undo();
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const accuracy = classifyAccuracy(guesses, game);
  const tickAccuracy = classifyAccuracy(tickTest(game), game);
  const wrong = done ? new Set(guesses.flatMap((g, i) => (g === game[i].q ? [] : [i]))) : new Set<number>();
  return { game, guesses, done, guess, undo, restart, accuracy, tickAccuracy, wrong, current: guesses.length };
}

export type ClassifyGame = ReturnType<typeof useClassifyGame>;
