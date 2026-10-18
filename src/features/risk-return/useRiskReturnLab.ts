import { useCallback, useMemo, useState } from "react";
import { usePinnedScatter, type DragHandle, type HandleValue } from "../../components/charts";
import { useUrlState } from "../../components/useUrlState";
import { useI18n } from "../../i18n";
import {
  allocationReturn,
  allocationVolatility,
  clamp,
  constrainedOptimalWeight,
  optimalRiskyWeight,
  riskyAssetSharpe,
  weightFromVolatility,
} from "./riskReturn.math";
import { buildCalChart, RR_COLORS } from "./riskReturn.chart";
import { RR_RANGES, RR_URL_SCHEMA, type RiskReturnState } from "./riskReturn.url";

type Domain = { x: [number, number]; y: [number, number] };

const MAX_WEIGHT = RR_RANGES.weight[1];
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
const overlap = (a: readonly [number, number], b: [number, number]): [number, number] => [
  Math.max(a[0], b[0]),
  Math.min(a[1], b[1]),
];

/// State, derived numbers and chart model of the risk–return lab (URL-backed, with pin & compare).
export function useRiskReturnLab() {
  const { t } = useI18n();
  const [state, setState] = useUrlState(RR_URL_SCHEMA);
  const { mu, sigma, rf, w, cmp, muB, sigmaB, A } = state;
  // Axis domains stay put while an asset is dragged, so the pointer and the marker do not run away.
  const [frozen, setFrozen] = useState<Domain | null>(null);

  const sharpe = riskyAssetSharpe(mu, sigma, rf);
  const yStar = optimalRiskyWeight(mu, sigma, rf, A);
  const yFeasible = constrainedOptimalWeight(mu, sigma, rf, A, MAX_WEIGHT);

  const chart = useMemo(
    () =>
      buildCalChart({
        asset: { mu, sigma },
        riskFree: rf,
        weight: w,
        maxWeight: MAX_WEIGHT,
        assetB: cmp ? { mu: muB, sigma: sigmaB } : undefined,
        riskAversion: A,
        optimalWeight: yFeasible,
        frozenDomain: frozen ?? undefined,
        labels: {
          cal: t("riskReturnCalLabel"),
          riskFree: t("riskReturnRiskFreePoint"),
          risky: t("riskReturnRiskyPoint"),
          assetA: t("riskReturnAssetA"),
          assetB: t("riskReturnAssetB"),
          current: t("riskReturnCurrentPoint"),
          lending: t("riskReturnLending"),
          leverage: t("riskReturnBorrowing"),
          slope: t("riskReturnSlopeLabel"),
          optimal: t("riskReturnOptimalPoint"),
          indifference: t("riskReturnIndifference"),
        },
      }),
    [mu, sigma, rf, w, cmp, muB, sigmaB, A, yFeasible, frozen, t]
  );

  const ghostLabel = useCallback((label: string) => t("pinnedSuffix", { label }), [t]);
  const pin = usePinnedScatter(chart.series, ghostLabel, true);

  const bounds = { x: overlap(RR_RANGES.sigma, chart.xDomain), y: overlap(RR_RANGES.mu, chart.yDomain) };
  const assetHandle = (id: string, x: number, y: number, label: string, color: string): DragHandle => ({
    id, axis: "xy", x, y, label, color, bounds, step: 0.001, format: pct,
  });
  const handles = [assetHandle("a", sigma, mu, cmp ? t("riskReturnAssetA") : t("riskReturnRiskyPoint"), RR_COLORS.risky)];
  if (cmp) handles.push(assetHandle("b", sigmaB, muB, t("riskReturnAssetB"), RR_COLORS.riskyB));

  const set = (patch: Partial<RiskReturnState>) => setState(patch);
  const onHandle = (id: string, v: HandleValue) => {
    if (v.x === undefined || v.y === undefined) return;
    set(id === "a" ? { sigma: v.x, mu: v.y } : { sigmaB: v.x, muB: v.y });
  };

  return {
    state,
    set,
    maxWeight: MAX_WEIGHT,
    sharpe,
    yStar,
    yFeasible,
    portReturn: allocationReturn(mu, rf, w),
    portVol: allocationVolatility(sigma, w),
    chart: { ...chart, series: [...chart.guides, ...pin.series] },
    pin,
    handles,
    onHandle,
    freeze: () => setFrozen({ x: chart.xDomain, y: chart.yDomain }),
    unfreeze: () => setFrozen(null),
    onDragPortfolio: (x: number) => set({ w: weightFromVolatility(x, sigma, MAX_WEIGHT) }),
    useOptimal: () => set({ w: clamp(Math.round(yFeasible * 100) / 100, 0, MAX_WEIGHT) }),
  };
}

export type RiskReturnLab = ReturnType<typeof useRiskReturnLab>;
