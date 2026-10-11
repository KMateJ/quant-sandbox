import SliderField from "../../../components/SliderField";
import NumberInput from "../../../components/NumberInput";
import { Tabs, type TabItem } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { pct } from "../npvIrr.format";
import type { DistributionKind, MonteCarloConfig } from "../npvIrr.types";

type MonteCarloControlsProps = {
  config: MonteCarloConfig;
  setConfig: (c: MonteCarloConfig) => void;
  run: () => void;
  running: boolean;
};

/// Monte Carlo inputs: uncertainty magnitudes, distribution, iterations and seed.
export default function MonteCarloControls({ config, setConfig, run, running }: MonteCarloControlsProps) {
  const { t } = useI18n();
  const patch = (p: Partial<MonteCarloConfig>) => setConfig({ ...config, ...p });

  const distTabs: TabItem<DistributionKind>[] = [
    { id: "normal", label: t("npvDistNormal") },
    { id: "uniform", label: t("npvDistUniform") },
    { id: "triangular", label: t("npvDistTriangular") },
  ];

  return (
    <div className="npv-mc-controls">
      <div className="npv-field-row">
        <span className="npv-field-label">{t("npvDistLabel")}</span>
        <Tabs segmented items={distTabs} value={config.distribution} onChange={(id) => patch({ distribution: id })} ariaLabel={t("npvDistLabel")} />
      </div>
      <div className="controls-grid">
        <SliderField label={t("npvCashflowVol")} min={0} max={0.6} step={0.01} value={config.cashflowVol} onChange={(v) => patch({ cashflowVol: v })} formatValue={(v) => pct(v, 0)} />
        <SliderField label={t("npvGrowthUncertainty")} min={0} max={0.1} step={0.0025} value={config.growthUncertainty} onChange={(v) => patch({ growthUncertainty: v })} formatValue={(v) => pct(v)} />
        <SliderField label={t("npvRateUncertainty")} min={0} max={0.08} step={0.0025} value={config.rateUncertainty} onChange={(v) => patch({ rateUncertainty: v })} formatValue={(v) => pct(v)} />
        <SliderField label={t("npvIterations")} min={1000} max={50000} step={1000} value={config.iterations} onChange={(v) => patch({ iterations: v })} formatValue={(v) => v.toLocaleString("en-US")} />
        <NumberInput label={t("npvSeed")} value={config.seed} onChange={(v) => patch({ seed: Math.max(0, Math.round(v)) })} min={0} step={1} />
      </div>
      <button type="button" className="npv-run-button" onClick={run} disabled={running}>
        {running ? t("npvRunning") : t("npvRunSimulation")}
      </button>
      <p className="npv-hint">{t("npvMcDisclaimer")}</p>
    </div>
  );
}
