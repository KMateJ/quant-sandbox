import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import type { ProjectModel } from "./npvIrr.types";
import { modelFromParams, modelKey, paramsWithModel } from "./npvIrr.url";

/// Keeps the active project model and the query string in step, so a link reproduces the project.
/// The lab keeps several scenarios in memory, so the URL is a mirror rather than the source of truth:
/// on load (and on back/forward or a followed link) a query that differs from the model is applied to it,
/// and edits to the model are written back with `replace`, so they don't add history entries.
/// Runs in an effect, so pre-rendered HTML (no query string) hydrates with the defaults first.
export function useNpvUrlSync(model: ProjectModel, apply: (next: ProjectModel) => void) {
  const [params, setParams] = useSearchParams();
  const query = params.toString();
  const current = modelKey(model);
  // The model text last read from or written to the URL; null until the first sync.
  const synced = useRef<string | null>(null);
  // A URL model handed to `apply` that hasn't rendered yet. Until it has, nothing is written back,
  // or the old model would overwrite the link (StrictMode runs this effect twice on mount).
  const pending = useRef<string | null>(null);

  useEffect(() => {
    if (pending.current !== null) {
      if (current !== pending.current) return;
      pending.current = null;
    }
    const fromUrl = modelKey(modelFromParams(params));
    if (synced.current === null || fromUrl !== synced.current) {
      // First load, or the URL changed from outside: the URL wins.
      synced.current = fromUrl;
      if (fromUrl !== current) {
        pending.current = fromUrl;
        apply(modelFromParams(params));
      }
      return;
    }
    if (current !== fromUrl) {
      synced.current = current;
      setParams((prev) => paramsWithModel(model, prev), { replace: true });
    }
    // `params` / `model` are represented by `query` / `current`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, current]);
}
