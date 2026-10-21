import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { PositionGroup, PresetKey, StrategyLeg, ViewMode } from "./payoff.types";
import { addSyntheticOverlay, buildChartData, collectRelevantStrikes, detectSyntheticMatches, getPrimarySyntheticMatch, getXAxisDomain } from "./payoff.math";
import { flattenPositions, liveGroups, positionComponents } from "./payoff.positions";
import { buildSearchParams, readUrlState, serializeGroups, serializeLegs } from "./payoff.url";
import { useMediaQuery } from "../../components/useMediaQuery";
import { useI18n } from "../../i18n";

export { serializeLegs, serializeGroups };

type Positions = { legs: StrategyLeg[]; groups: PositionGroup[] };

const serializePositions = (p: Positions) => `${serializeLegs(p.legs)}#${serializeGroups(p.legs, p.groups)}`;

/// Strategy builder state (legs + positions), mirrored to the URL, plus derived chart data.
export function usePayoffView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [searchParams, setSearchParams] = useSearchParams();
  const initialState = useMemo(() => readUrlState(searchParams), [searchParams]);

  const [positions, setPositions] = useState<Positions>({ legs: initialState.legs, groups: initialState.groups });
  const { legs } = positions;
  const setLegs = (next: StrategyLeg[]) => setPositions((prev) => ({ ...prev, legs: next }));
  const setGroups = (next: PositionGroup[]) => setPositions((prev) => ({ ...prev, groups: next }));
  const [mode, setMode] = useState<ViewMode>(initialState.mode);
  const [showComponents, setShowComponents] = useState(initialState.showComponents);
  const [selectedPreset, setSelectedPreset] = useState<PresetKey | null>(
    initialState.selectedPreset
  );

  const paramsString = searchParams.toString();
  const groups = useMemo(() => liveGroups(legs, positions.groups), [legs, positions.groups]);

  useEffect(() => {
    const nextState = readUrlState(searchParams);
    const nextSerialized = serializePositions(nextState);

    setMode((prev) => (prev === nextState.mode ? prev : nextState.mode));
    setShowComponents((prev) =>
      prev === nextState.showComponents ? prev : nextState.showComponents
    );
    setSelectedPreset((prev) =>
      prev === nextState.selectedPreset ? prev : nextState.selectedPreset
    );
    setPositions((prev) =>
      serializePositions(prev) === nextSerialized ? prev : { legs: nextState.legs, groups: nextState.groups }
    );
  }, [paramsString, searchParams]);

  useEffect(() => {
    const nextParams = buildSearchParams(mode, showComponents, selectedPreset, legs, groups);
    const nextParamsString = nextParams.toString();

    if (nextParamsString !== paramsString) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [legs, groups, mode, paramsString, selectedPreset, setSearchParams, showComponents]);

  const effectiveLegs = useMemo(() => flattenPositions(legs, groups), [legs, groups]);
  const components = useMemo(
    () => (showComponents ? positionComponents(legs, groups, (i) => `${t("payoffChartLegPrefix")}${i + 1}`) : []),
    [legs, groups, showComponents, t]
  );

  const xDomain = useMemo(() => getXAxisDomain(effectiveLegs), [effectiveLegs]);

  const baseChartData = useMemo(
    () => buildChartData(effectiveLegs, mode, xDomain[0], xDomain[1], 140, components),
    [effectiveLegs, mode, components, xDomain]
  );

  const syntheticMatches = useMemo(() => detectSyntheticMatches(effectiveLegs), [effectiveLegs]);
  const primarySyntheticMatch = useMemo(() => getPrimarySyntheticMatch(effectiveLegs), [effectiveLegs]);

  const chartData = useMemo(
    () => addSyntheticOverlay(baseChartData, primarySyntheticMatch, mode),
    [baseChartData, primarySyntheticMatch, mode]
  );

  const strikes = useMemo(() => collectRelevantStrikes(effectiveLegs), [effectiveLegs]);

  return {
    isMobile, legs, setLegs, groups, setGroups, setPositions, effectiveLegs, components, mode, setMode,
    showComponents, setShowComponents, selectedPreset, setSelectedPreset,
    xDomain, syntheticMatches, primarySyntheticMatch, chartData, strikes,
  };
}

export type PayoffViewModel = ReturnType<typeof usePayoffView>;
