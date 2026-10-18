import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  HeatmapAxis,
  MonteCarloConfig,
  MonteCarloResult,
  ProjectModel,
  RealOptionConfig,
  Scenario,
} from "./npvIrr.types";
import { DEFAULT_MODEL, syncCustomFlows } from "./npvIrr.presets";
import { defaultScenarios, makeScenario } from "./npvIrr.scenarios";
import {
  cashflowSchedule,
  modelNpv,
  npvProfile,
  patternInflow,
  projectMetrics,
} from "./npvIrr.math";
import { tornado } from "./npvIrr.sensitivity";
import { interpret } from "./npvIrr.interpret";
import { realOptionValue } from "./npvIrr.realOptions";
import type { TranslationKey } from "../../i18n";
import type { MonteCarloRequest, MonteCarloResponse } from "./npvIrr.worker";
import { useNpvUrlSync } from "./useNpvUrlSync";

export const RATE_MAX = 0.4;
const PROFILE_STEPS = 90;

const DEFAULT_MC: MonteCarloConfig = {
  iterations: 5000,
  seed: 42,
  distribution: "normal",
  cashflowVol: 0.2,
  growthUncertainty: 0.03,
  rateUncertainty: 0.02,
};

const DEFAULT_OPTION: RealOptionConfig = {
  enabled: true,
  expansionInvestment: 800,
  additionalAnnual: 260,
  expansionYear: 3,
  probability: 0.5,
};

/// Effective yearly flows used to seed the custom pattern so the curve stays continuous.
function seedCustom(model: ProjectModel): number[] {
  return Array.from({ length: model.years }, (_, i) => Math.round(patternInflow(model, i + 1)));
}

/// Central lab state: scenarios, the active model, every derived metric and the
/// Monte Carlo worker. All tabs read from this one hook so numbers stay consistent.
export function useNpvLab(t: (key: TranslationKey) => string) {
  const [scenarios, setScenarios] = useState<Scenario[]>(() => defaultScenarios(DEFAULT_MODEL));
  const [activeId, setActiveId] = useState<string>(() => scenarios[0].id);
  const [sensRange, setSensRange] = useState(0.25);
  const [heatAxes, setHeatAxes] = useState<{ x: HeatmapAxis; y: HeatmapAxis }>({ x: "rate", y: "annual" });
  const [mcConfig, setMcConfig] = useState<MonteCarloConfig>(DEFAULT_MC);
  const [mcResult, setMcResult] = useState<MonteCarloResult | null>(null);
  const [mcRunning, setMcRunning] = useState(false);
  const [option, setOption] = useState<RealOptionConfig>(DEFAULT_OPTION);

  const active = scenarios.find((s) => s.id === activeId) ?? scenarios[0];
  const model = active.model;

  const patchActive = useCallback(
    (fn: (model: ProjectModel) => ProjectModel) => {
      setScenarios((prev) => prev.map((s) => (s.id === activeId ? { ...s, model: fn(s.model) } : s)));
    },
    [activeId]
  );

  const updateModel = useCallback(
    (patch: Partial<ProjectModel>) => {
      patchActive((prev) => {
        const merged: ProjectModel = { ...prev, ...patch };
        if (patch.pattern === "custom" && prev.pattern !== "custom") {
          merged.customFlows = seedCustom(prev);
        }
        merged.customFlows = syncCustomFlows(merged);
        return merged;
      });
    },
    [patchActive]
  );

  const setCustomFlow = useCallback(
    (index: number, value: number) => {
      patchActive((prev) => {
        const customFlows = prev.customFlows.slice();
        customFlows[index] = value;
        return { ...prev, customFlows };
      });
    },
    [patchActive]
  );

  const loadModel = useCallback(
    (next: ProjectModel) => {
      patchActive(() => ({ ...next, customFlows: syncCustomFlows(next) }));
      setMcResult(null);
    },
    [patchActive]
  );

  // The active model mirrors the query string (see useNpvUrlSync).
  useNpvUrlSync(model, useCallback((next: ProjectModel) => patchActive(() => next), [patchActive]));

  const reset = useCallback(() => {
    const fresh = defaultScenarios(DEFAULT_MODEL);
    setScenarios(fresh);
    setActiveId(fresh[0].id);
    setMcResult(null);
    setMcConfig(DEFAULT_MC);
    setOption(DEFAULT_OPTION);
  }, []);

  const addScenario = useCallback(() => {
    const sc = makeScenario(`${t("npvScenarioNew")} ${scenarios.length + 1}`, model, scenarios.map((s) => s.color));
    setScenarios((prev) => [...prev, sc]);
    setActiveId(sc.id);
  }, [scenarios, model, t]);

  const duplicateScenario = useCallback(
    (sourceId: string) => {
      const src = scenarios.find((s) => s.id === sourceId);
      if (!src) return;
      const sc = makeScenario(`${src.name} ${t("npvScenarioCopy")}`, src.model, scenarios.map((s) => s.color));
      setScenarios((prev) => [...prev, sc]);
      setActiveId(sc.id);
    },
    [scenarios, t]
  );

  const renameScenario = useCallback((sourceId: string, name: string) => {
    setScenarios((prev) => prev.map((s) => (s.id === sourceId ? { ...s, name } : s)));
  }, []);

  const deleteScenario = useCallback(
    (sourceId: string) => {
      if (scenarios.length <= 1) return;
      const next = scenarios.filter((s) => s.id !== sourceId);
      setScenarios(next);
      if (sourceId === activeId) setActiveId(next[0].id);
    },
    [scenarios, activeId]
  );

  const recolorScenario = useCallback((sourceId: string, color: string) => {
    setScenarios((prev) => prev.map((s) => (s.id === sourceId ? { ...s, color } : s)));
  }, []);

  const metrics = useMemo(() => projectMetrics(model), [model]);
  const schedule = useMemo(() => cashflowSchedule(model), [model]);
  const profile = useMemo(() => npvProfile(model, 0, RATE_MAX, PROFILE_STEPS), [model]);
  const tornadoRows = useMemo(() => tornado(model, sensRange), [model, sensRange]);
  const insights = useMemo(
    () => interpret(model, metrics, tornadoRows, t),
    [model, metrics, tornadoRows, t]
  );
  const scenarioStats = useMemo(
    () => scenarios.map((s) => ({ scenario: s, metrics: projectMetrics(s.model) })),
    [scenarios]
  );
  const scenarioProfiles = useMemo(
    () => scenarios.map((s) => ({ scenario: s, profile: npvProfile(s.model, 0, RATE_MAX, PROFILE_STEPS) })),
    [scenarios]
  );
  const realOption = useMemo(() => realOptionValue(model, option), [model, option]);

  const workerRef = useRef<Worker | null>(null);
  const requestId = useRef(0);
  useEffect(() => {
    const worker = new Worker(new URL("./npvIrr.worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (event: MessageEvent<MonteCarloResponse>) => {
      if (event.data.requestId !== requestId.current) return;
      setMcResult(event.data.result);
      setMcRunning(false);
    };
    workerRef.current = worker;
    return () => worker.terminate();
  }, []);

  const runSimulation = useCallback(() => {
    if (!workerRef.current) return;
    requestId.current += 1;
    setMcRunning(true);
    const request: MonteCarloRequest = { requestId: requestId.current, model, config: mcConfig };
    workerRef.current.postMessage(request);
  }, [model, mcConfig]);

  return {
    scenarios,
    activeId,
    active,
    model,
    metrics,
    schedule,
    profile,
    tornadoRows,
    insights,
    scenarioStats,
    scenarioProfiles,
    sensRange,
    setSensRange,
    heatAxes,
    setHeatAxes,
    mcConfig,
    setMcConfig,
    mcResult,
    mcRunning,
    runSimulation,
    option,
    setOption,
    realOption,
    setActiveId,
    updateModel,
    setCustomFlow,
    loadModel,
    reset,
    addScenario,
    duplicateScenario,
    renameScenario,
    deleteScenario,
    recolorScenario,
    modelNpvAt: (rate: number) => modelNpv(model, rate),
  };
}

export type NpvLab = ReturnType<typeof useNpvLab>;
