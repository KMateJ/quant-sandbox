import { useEffect } from "react";
import { parseUrlState } from "../../lib/urlState";
import { PORTFOLIO_URL_SCHEMA } from "./portfolioLab.url";
import { encodeAllocation } from "./portfolioLab.weights";

type UrlState = { rf: number; w: string };

const WRITE_DELAY_MS = 250;

/// Mirrors the risk-free rate and the allocation into the query string. Writes are debounced, so dragging a
/// weight bar or the rf slider doesn't flood the history API. The rf lives in the shared universe (the
/// Optimization lab reads it too), so a linked `rf` is pushed into it once on mount.
export function usePortfolioUrlSync(
  allocation: number[],
  riskFree: number,
  setRiskFree: (v: number) => void,
  url: UrlState,
  setUrl: (patch: Partial<UrlState>) => void
) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("rf")) setRiskFree(parseUrlState(PORTFOLIO_URL_SCHEMA, params).rf);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- apply the linked rate once, on mount
  }, []);

  useEffect(() => {
    const w = encodeAllocation(allocation);
    if (w === url.w && Math.abs(riskFree - url.rf) < 1e-6) return;
    const id = window.setTimeout(() => setUrl({ rf: riskFree, w }), WRITE_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [allocation, riskFree, url.w, url.rf, setUrl]);
}
