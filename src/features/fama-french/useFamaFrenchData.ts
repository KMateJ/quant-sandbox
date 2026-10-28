import { useEffect, useState } from "react";
import { toFfData } from "./famaFrench.math";
import type { FfData, FfRaw } from "./famaFrench.types";

type DataState = { status: "loading" | "ready" | "error"; data?: FfData };

let cached: FfData | null = null;

/// Loads the bundled Ken French snapshot as its own chunk, only when the lab opens; never part of the pre-rendered HTML.
export function useFamaFrenchData(): DataState {
  const [state, setState] = useState<DataState>(() => (cached ? { status: "ready", data: cached } : { status: "loading" }));

  useEffect(() => {
    if (cached) return;
    let alive = true;
    import("./data/famaFrench.json")
      .then((module) => {
        cached = toFfData(module.default as unknown as FfRaw);
        if (alive) setState({ status: "ready", data: cached });
      })
      .catch(() => {
        if (alive) setState({ status: "error" });
      });
    return () => {
      alive = false;
    };
  }, []);

  return state;
}
