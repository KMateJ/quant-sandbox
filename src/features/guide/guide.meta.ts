import type { GuideLessonMeta, GuideTrackMeta } from "./guide.types";

/// Ordered lessons. Each belongs to a track and builds on the previous one.
export const guideLessons: GuideLessonMeta[] = [
  {
    id: "instruments",
    track: "derivatives",
    title: {
      hu: "Kifizetések lejáratkor",
      en: "Payoffs at maturity",
    },
    description: {
      hu: "Mi az a derivatíva? Call, put és forward kifizetése a részvényár függvényében.",
      en: "What is a derivative? Call, put and forward payoffs as a function of the stock price.",
    },
  },
  {
    id: "no-arbitrage",
    track: "derivatives",
    title: {
      hu: "Nincs arbitrázs, van fair ár",
      en: "No arbitrage, one fair price",
    },
    description: {
      hu: "Diszkontálás, az egy ár törvénye és a put–call paritás mint első árazási eredmény.",
      en: "Discounting, the law of one price, and put–call parity as a first pricing result.",
    },
  },
  {
    id: "risk-neutral",
    track: "derivatives",
    title: {
      hu: "Kockázatsemleges árazás egy lépésben",
      en: "Risk-neutral pricing in one step",
    },
    description: {
      hu: "Egylépéses binomiális modell: replikáció, a q mérték és a diszkontált várható érték.",
      en: "The one-step binomial model: replication, the q-measure and the discounted expectation.",
    },
  },
  {
    id: "delta-hedging",
    track: "derivatives",
    title: {
      hu: "Replikáció és delta hedge",
      en: "Replication and delta hedging",
    },
    description: {
      hu: "A replikáló portfólió, a delta mint érzékenység, és miért tesz kockázatmentessé.",
      en: "The replicating portfolio, delta as a sensitivity, and why it removes the risk.",
    },
  },
  {
    id: "toward-black-scholes",
    track: "derivatives",
    title: {
      hu: "Egy lépéstől a folytonos időig",
      en: "From one step to continuous time",
    },
    description: {
      hu: "Sok kis lépés, a geometriai Brown-mozgás határeset és a Black–Scholes-kép logikája.",
      en: "Many small steps, the geometric Brownian motion limit, and the logic of Black–Scholes.",
    },
  },
];

/// Tracks group lessons into a coherent, ground-up sequence.
export const guideTracks: GuideTrackMeta[] = [
  {
    id: "derivatives",
    title: {
      hu: "Derivatívák: a kifizetéstől az árazásig",
      en: "Derivatives: from payoff to price",
    },
    description: {
      hu: "Az alapoktól építkező sorozat: mit fizet egy opció, miért van egyetlen fair ára, és hogyan jutunk el a Black–Scholes-modellig.",
      en: "A ground-up series: what an option pays, why it has a single fair price, and how we arrive at the Black–Scholes model.",
    },
    lessons: [
      "instruments",
      "no-arbitrage",
      "risk-neutral",
      "delta-hedging",
      "toward-black-scholes",
    ],
  },
];

/// Backwards-compatible flat list for sidebar/nav lookups by id.
export const guideMeta: GuideLessonMeta[] = guideLessons;
