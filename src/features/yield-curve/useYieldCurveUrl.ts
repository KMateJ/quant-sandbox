import { useEffect, useRef } from "react";
import { useUrlState } from "../../components/useUrlState";
import type { YieldCurveModel } from "./useYieldCurve";
import { nodesFromUrl, urlFromNodes, YC_SCHEMA, type YcTab } from "./yieldCurve.url";

/// URL quotes carry three decimals of a percent; closer curves count as the same.
const SAME = 1e-5;

/// Keeps the open tab, preset and custom quotes of the lab in the URL: a link restores the curve, and
/// edits write back. Nothing is written before the first committed change, so a plain visit stays clean.
export function useYieldCurveUrl(model: YieldCurveModel): [YcTab, (tab: YcTab) => void] {
  const [url, setUrl] = useUrlState(YC_SCHEMA);
  const { load, nodes, preset, version } = model;
  // `setUrl` changes with every navigation, so it is read from here rather than listed as a dependency.
  const latest = useRef({ nodes, preset, setUrl });

  useEffect(() => {
    latest.current = { nodes, preset, setUrl };
  });

  // URL → curve (first load, back/forward). Skipped when the curve already matches, so the round trip of an
  // edit through the URL never counts as a second change.
  useEffect(() => {
    const target = nodesFromUrl(url.preset, url.n);
    const { nodes: now, preset: nowPreset } = latest.current;
    const same = target.preset === nowPreset && target.nodes.every((n, i) => Math.abs(n.rate - now[i].rate) < SAME);
    if (!same) load(target.nodes, target.preset);
  }, [url.preset, url.n, load]);

  // Curve → URL, on committed changes only (not on animation frames).
  useEffect(() => {
    const { nodes: now, preset: nowPreset, setUrl: write } = latest.current;
    if (version > 0) write(urlFromNodes(nowPreset, now));
  }, [version]);

  return [url.tab, (tab) => setUrl({ tab })];
}
