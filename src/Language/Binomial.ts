export const binomialHu = {
    binomialToggleStocks: "Részvényárak",
    binomialToggleValues: "Opcióértékek",

    binomialExplanationTitle: "Intuíció",
    binomialExplanationSubtitle: "Mit mutat ez a modell?",
    binomialExplanationP1:
      "Ebben a binomiális modellben minden időlépésben a részvényár kétféleképpen változhat: vagy megszorzódik u-val, vagy d-vel.",
    binomialExplanationP2:
      "A modellben minden periódus 1 év. A kockázatsemleges valószínűség: q = (1 + r - d) / (u - d).",
    binomialExplanationP3:
      "Először a fa legvégén kiszámoljuk a payoffot, például call opciónál max(S - K, 0). Ezután visszafelé haladunk, és minden csomópontban a következő két lehetséges érték diszkontált várható értékét vesszük.",
    binomialExplanationP4:
      "Klasszikus arbitrázsmentes helyzetben teljesül, hogy d < 1 + r < u, ekkor a q valóban 0 és 1 közé esik.",
    binomialExplanationP5:
      "A gyökércsomópontban az opció értéke egy replikáló portfólióval is előállítható: egy megfelelő számú részvény és egy kötvénypozíció együtt ugyanazt a kifizetést adja, mint az opció a következő lépés két lehetséges állapotában.",

    binomialTreeTitle: "Binomiális árazási fa",
    binomialTreeSubtitle: "A részvényárak és az opcióértékek diszkrét modellje",

    binomialOptionCall: "Call",
    binomialOptionPut: "Put",
    binomialS0Label: "S₀ (kezdeti ár)",
    binomialKLabel: "K (strike)",
    binomialULabel: "u (up factor)",
    binomialDLabel: "d (down factor)",
    binomialRLabel: "r (éves kamat)",
    binomialStepsLabel: "Lépések száma",
    binomialStepsUnit: "db",
    binomialPeriodLength: "Periódushossz",
    binomialPeriodValue: "Δt = 1 év",

    binomialSummaryTitle: "Összefoglaló",
    binomialSummarySubtitle: "A modell fő mennyiségei",
    binomialWarningTitle: "Figyelmeztetés",
    binomialPrice: "Opció ára",
    binomialReplicatingPortfolio: "Gyökérbeli replikáló portfólió",
    binomialStockPosition: "Részvény",
    binomialCashPosition: "Cash",
    binomialDiscountFactor: "Diszkont faktor",
}

export const binomialEn = {
    binomialToggleStocks: "Stock prices",
    binomialToggleValues: "Option values",

    binomialExplanationTitle: "Intuition",
    binomialExplanationSubtitle: "What does this model show?",
    binomialExplanationP1:
      "In this binomial model, at each time step the stock price can move in two ways: it is multiplied either by u or by d.",
    binomialExplanationP2:
      "Each period in the model is 1 year. The risk-neutral probability is: q = (1 + r - d) / (u - d).",
    binomialExplanationP3:
      "First, we compute the payoff at the terminal nodes of the tree, for example max(S - K, 0) for a call option. Then we move backward, and at each node we take the discounted expected value of the two possible next outcomes.",
    binomialExplanationP4:
      "In the classical no-arbitrage case, we have d < 1 + r < u, and then q indeed lies between 0 and 1.",
    binomialExplanationP5:
      "At the root node, the option value can also be replicated by a replicating portfolio: an appropriate number of shares together with a bond position produces the same payoff as the option in the two possible states of the next step.",

    binomialTreeTitle: "Binomial pricing tree",
    binomialTreeSubtitle: "A discrete model of stock prices and option values",

    binomialOptionCall: "Call",
    binomialOptionPut: "Put",
    binomialS0Label: "S₀ (initial price)",
    binomialKLabel: "K (strike)",
    binomialULabel: "u (up factor)",
    binomialDLabel: "d (down factor)",
    binomialRLabel: "r (annual rate)",
    binomialStepsLabel: "Number of steps",
    binomialStepsUnit: "steps",
    binomialPeriodLength: "Period length",
    binomialPeriodValue: "Δt = 1 year",

    binomialSummaryTitle: "Summary",
    binomialSummarySubtitle: "Key quantities of the model",
    binomialWarningTitle: "Warning",
    binomialPrice: "Option price",
    binomialReplicatingPortfolio: "Replicating portfolio at the root",
    binomialStockPosition: "Stock",
    binomialCashPosition: "Cash",
    binomialDiscountFactor: "Discount factor",
}