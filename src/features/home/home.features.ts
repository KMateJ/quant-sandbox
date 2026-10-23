import type { HomeFeature } from "./home.types";

/// Showcase slides for the home features row; screenshots live in public/features.
export const HOME_FEATURES: HomeFeature[] = [
  { id: "graph", path: "/guide/graph", image: "/features/graph.webp" },
  { id: "desk", path: "/delta-hedging/desk", image: "/features/desk.webp" },
  { id: "heston", path: "/heston", image: "/features/heston.webp" },
  { id: "frontier", path: "/efficient-frontier", image: "/features/frontier.webp" },
];

export const FEATURE_INTERVAL_MS = 6000;
