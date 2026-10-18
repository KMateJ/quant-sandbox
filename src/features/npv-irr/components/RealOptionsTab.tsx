import { Panel, ChartContainer } from "../../../components/layout";
import SliderField from "../../../components/SliderField";
import { SegmentedControl } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import KpiCard from "./KpiCard";
import NpvBars from "./NpvBars";
import { money, pct } from "../npvIrr.format";
import type { NpvLab } from "../useNpvLab";

type RealOptionsTabProps = { lab: NpvLab };

/// Real options: the value a flexible option to expand adds over a rigid commitment.
export default function RealOptionsTab({ lab }: RealOptionsTabProps) {
  const { t } = useI18n();
  const { option, setOption, realOption } = lab;
  const patch = (p: Partial<typeof option>) => setOption({ ...option, ...p });
  const rigid = realOption.baseNpv + realOption.expansionNpvIfTaken;

  const bars = [
    { label: t("npvNoFlex"), value: realOption.baseNpv, color: "#64748b" },
    { label: t("npvRigid"), value: rigid, color: "#f97316" },
    { label: t("npvWithOption"), value: realOption.flexibleNpv, color: "#22c55e" },
  ];

  return (
    <div className="npv-realoptions-tab">
      <Panel title={t("npvOptionControls")}>
        <SegmentedControl<"on" | "off">
          options={[
            { value: "on", label: t("npvOptionOn") },
            { value: "off", label: t("npvOptionOff") },
          ]}
          value={option.enabled ? "on" : "off"}
          onChange={(v) => patch({ enabled: v === "on" })}
          ariaLabel={t("npvOptionControls")}
        />
        <div className="controls-grid">
          <SliderField label={t("npvExpansionInvest")} min={0} max={5000} step={50} value={option.expansionInvestment} onChange={(v) => patch({ expansionInvestment: v })} formatValue={money} />
          <SliderField label={t("npvAdditionalAnnual")} min={0} max={2000} step={10} value={option.additionalAnnual} onChange={(v) => patch({ additionalAnnual: v })} formatValue={money} />
          <SliderField label={t("npvExpansionYear")} min={1} max={Math.max(1, lab.model.years)} step={1} value={option.expansionYear} onChange={(v) => patch({ expansionYear: v })} formatValue={(v) => v.toFixed(0)} />
          <SliderField label={t("npvOptionProbability")} min={0} max={1} step={0.05} value={option.probability} onChange={(v) => patch({ probability: v })} formatValue={(v) => pct(v, 0)} />
        </div>
        <p className="npv-hint">{t("npvOptionExplainer")}</p>
      </Panel>

      <div className="module-main">
        <div className="metric-strip">
          <KpiCard label={t("npvOptionValue")} value={money(realOption.optionValue)} tone={realOption.optionValue > 0 ? "good" : "neutral"} info={t("npvInfoOptionValue")} />
          <KpiCard label={t("npvFlexibleValue")} value={money(realOption.flexibleNpv)} tone={realOption.flexibleNpv >= 0 ? "good" : "bad"} />
          <KpiCard label={t("npvExpansionNpv")} value={money(realOption.expansionNpvIfTaken)} tone={realOption.expansionNpvIfTaken >= 0 ? "good" : "bad"} sub={t("npvIfExercised")} />
        </div>
        <ChartContainer title={t("npvFlexComparison")}>
          <div className="npv-bars-wrap">
            <NpvBars data={bars} valueFormat={money} />
          </div>
          <p className="npv-chart-hint">{t("npvFlexHint")}</p>
        </ChartContainer>
      </div>
    </div>
  );
}
