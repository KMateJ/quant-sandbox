import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { parseUrlState, writeUrlState, type UrlSchema } from "../lib/urlState";

type Update<S> = Partial<S> | ((prev: S) => Partial<S>);

/// Page state that lives in the query string, so a configuration can be shared or linked from a guide.
/// The URL is the single source of truth; updates replace the history entry, and defaults are left out.
export function useUrlState<S>(schema: UrlSchema<S>): [S, (update: Update<S>) => void] {
  const [params, setParams] = useSearchParams();
  const query = params.toString();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- re-parse only when the query string changes
  const state = useMemo(() => parseUrlState(schema, params), [schema, query]);

  const setState = useCallback(
    (update: Update<S>) =>
      setParams(
        (prev) => {
          const current = parseUrlState(schema, prev);
          const patch = typeof update === "function" ? update(current) : update;
          return writeUrlState(schema, { ...current, ...patch }, prev);
        },
        { replace: true },
      ),
    [schema, setParams],
  );

  return [state, setState];
}
