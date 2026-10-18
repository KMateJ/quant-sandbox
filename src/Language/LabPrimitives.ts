// Strings of the shared lab primitives (PredictReveal and friends). Keys are prefixed lp.

export const labPrimitivesHu = {
  lpPredictTitle: "Tippelj először",
  lpYourGuess: "A tipped",
  lpGuessHere: "Kattints az ábrára a tipped megadásához",
  lpReveal: "Felfedés",
  lpTryAgain: "Újra",
  lpTruth: "Valós érték",
  lpError: "Eltérés",
  lpHit: "Talált: a tűréshatáron belül ({{tol}}).",
  lpMiss: "Nem talált: a tűréshatár {{tol}}.",
  lpAttempts: "{{hits}} / {{n}} találat",
  lpNoGuess: "Még nincs tipp",
};

export const labPrimitivesEn: Record<keyof typeof labPrimitivesHu, string> = {
  lpPredictTitle: "Predict first",
  lpYourGuess: "Your guess",
  lpGuessHere: "Click the chart to place your guess",
  lpReveal: "Reveal",
  lpTryAgain: "Try again",
  lpTruth: "True value",
  lpError: "Error",
  lpHit: "Hit: within the tolerance ({{tol}}).",
  lpMiss: "Miss: the tolerance is {{tol}}.",
  lpAttempts: "{{hits}} / {{n}} hits",
  lpNoGuess: "No guess yet",
};
