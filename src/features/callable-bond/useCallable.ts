import { useMemo } from "react";
import { useUrlState } from "../../components/useUrlState";
import type { CallableSpec } from "../../lib/finance/callable";
import { labAt, negativeRanges, priceCurve } from "./callable.math";
import { CB_SCHEMA, Y_MAX, Y_MIN } from "./callable.url";

/// Callable bond lab state: URL-backed terms and yield, and every number derived from them.
export function useCallable() {
  const [url, setUrl] = useUrlState(CB_SCHEMA);
  const spec: CallableSpec = useMemo(
    () => ({ coupon: url.c, maturity: url.m, freq: Number(url.freq), callPrice: url.call, protection: Math.min(url.prot, url.m) }),
    [url.c, url.m, url.freq, url.call, url.prot],
  );
  const curve = useMemo(() => priceCurve(spec), [spec]);
  const ranges = useMemo(() => negativeRanges(spec), [spec]);
  const now = useMemo(() => labAt(spec, url.y), [spec, url.y]);
  return {
    url,
    spec,
    y: url.y,
    curve,
    ranges,
    now,
    callable: spec.protection < spec.maturity,
    setY: (y: number) => setUrl({ y: Math.min(Y_MAX, Math.max(Y_MIN, y)) }),
    setUrl,
  };
}

export type CallableModel = ReturnType<typeof useCallable>;
