import SliderField from "../../../components/SliderField";
import SeedControl from "../../../components/SeedControl";
import { ControlGroup, SegmentedControl } from "../../../components/ui";
import { IntuitionTrigger } from "../../../components/intuition";
import { useI18n } from "../../../i18n";
import { HEDGE_FREQUENCIES } from "../deltaHedging.math";
import type { DeltaHedgingModel } from "../useDeltaHedging";

const FREQ_KEYS = { 4: "deltaHedgingFreqQuarterly", 12: "deltaHedgingFreqMonthly", 52: "deltaHedgingFreqWeekly", 252: "deltaHedgingFreqDaily" } as const;

/// Sidebar: option and market inputs, the rebalancing frequency and the random seed.
export default function DeltaHedgingControls({ model }: { model: DeltaHedgingModel }) {
  const { t } = useI18n();
  const { url, set, freq, result } = model;
  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

  return (
    <>
      <ControlGroup label={t("deltaHedgingOptionGroup")}>
        <div className="controls-grid">
          <SliderField label={t("deltaHedgingS0Label")} sectionId="spot-strike" min={10} max={300} step={5} value={url.s0} onChange={(s0) => set({ s0 })} formatValue={(v) => v.toFixed(0)} />
          <SliderField label={t("deltaHedgingStrikeLabel")} sectionId="spot-strike" min={10} max={300} step={5} value={url.k} onChange={(k) => set({ k })} formatValue={(v) => v.toFixed(0)} />
          <SliderField label={t("deltaHedgingMaturityLabel")} sectionId="maturity" min={0.25} max={3} step={0.25} value={url.T} onChange={(T) => set({ T })} formatValue={(v) => `${v.toFixed(2)} ${t("deltaHedgingYears")}`} />
          <SliderField label={t("deltaHedgingRateLabel")} sectionId="rate" min={0} max={0.1} step={0.0025} value={url.r} onChange={(r) => set({ r })} formatValue={pct} />
          <SliderField label={t("deltaHedgingVolLabel")} sectionId="volatility" min={0.05} max={0.6} step={0.01} value={url.sigma} onChange={(sigma) => set({ sigma })} formatValue={pct} />
        </div>
      </ControlGroup>

      <ControlGroup
        label={<span className="intuition-reveal">{t("deltaHedgingFreqLabel")} <IntuitionTrigger sectionId="rebalancing" /></span>}
        hint={t("deltaHedgingFreqHint", { n: result.rebalances })}
      >
        <SegmentedControl<number>
          options={HEDGE_FREQUENCIES.map((f) => ({ value: f, label: t(FREQ_KEYS[f]) }))}
          value={freq}
          onChange={(f) => set({ freq: String(f) as typeof url.freq })}
          ariaLabel={t("deltaHedgingFreqLabel")}
        />
      </ControlGroup>

      <ControlGroup label={<span className="intuition-reveal">{t("deltaHedgingPathGroup")} <IntuitionTrigger sectionId="random-path" /></span>}>
        <SeedControl seed={url.seed} setSeed={(seed) => set({ seed })} compact />
      </ControlGroup>
    </>
  );
}
