import { useState } from "react";
import { ChartContainer, Panel } from "../../../components/layout";
import { IntuitionTrigger } from "../../../components/intuition";
import { useI18n } from "../../../i18n";
import type { YieldCurveModel } from "../useYieldCurve";
import { PRESET_IDS, MATURITY_LABELS } from "../presets";
import { buildRateSeries, buildDfSeries, buildEffectOverlay } from "../curveSeries";
import { pct2 } from "../curveChartUtils";
import MaturityChart from "./MaturityChart";
import NodeTable from "./NodeTable";
import SelectedReadout from "./SelectedReadout";
import CurveLegend from "./CurveLegend";
import { rateDomain } from "../effects.math";

export default function CurveView({ model }: { model: YieldCurveModel }) {
  const { t } = useI18n();
  const [dragDomain, setDragDomain] = useState<[number, number] | null>(null);
  const { term, beforeTerm, selected } = model;
  const labels = { par: t("ycMarketCurve"), zero: t("ycBootstrappedCurve"), forward: t("ycImpliedCurve") };
  const domain = rateDomain([...term, ...beforeTerm]);
  const rateEffects = buildEffectOverlay(beforeTerm, term, ["zero", "fwd"]);
  const dfEffects = buildEffectOverlay(beforeTerm, term, ["df"]);

  return (
    <div className="workspace cols-sidebar yc-workspace">
      <Panel title={<>{t("ycMarketInputs")} <IntuitionTrigger variant="question" sectionId="par-rate" /></>}>
        <div className="yc-controls">
          <p className="yc-input-intro">{t("ycInputIntro")}</p>
          <div className="yc-preset-pick" role="group" aria-label={t("ycPreset")}>
            {PRESET_IDS.map((id) => (
              <button key={id} type="button" className={model.preset === id ? "is-active" : undefined}
                aria-pressed={model.preset === id} onClick={() => model.applyPreset(id)}>
                {t(`ycPreset_${id}`)}
              </button>
            ))}
          </div>
          <NodeTable model={model} />
          <div className="yc-input-footer">
            <span>{t("ycQuoteRange")}</span>
            <button type="button" onClick={model.reset}>{t("ycReset")}</button>
          </div>
        </div>
      </Panel>

      <div className="module-main">
        <ChartContainer title={t("ycTermStructure")} actions={<span className="yc-chart-selection">{t("ycSelectedMaturity")}: {term[selected].label}</span>}>
          <CurveLegend />
          <div className="chart-wrap yc-term-chart">
            <MaturityChart labels={MATURITY_LABELS}
              series={[...buildRateSeries(term, labels), ...rateEffects.series]}
              annotations={rateEffects.annotations} yDomain={dragDomain ?? domain} legend={false} yNumTicks={5}
              yFormat={pct2} yLabel={t("ycYieldAxis")} selectedIndex={selected}
              onSelectIndex={model.setSelected}
              onDragStart={(i) => { setDragDomain(domain); model.beginEdit(i); }}
              onDragEnd={() => { setDragDomain(null); model.endEdit(); }}
              onDragRate={(i, y) => model.setRate(i, Math.max(0, Math.min(0.12, y)))} />
          </div>
          <div className="yc-df-heading">
            <span>{t("ycDiscountFactor")} <IntuitionTrigger variant="question" sectionId="discount-factor" /></span>
            <span>{t("ycDfUnit")}</span>
          </div>
          <div className="chart-wrap yc-df-chart">
            <MaturityChart labels={MATURITY_LABELS}
              series={[...buildDfSeries(term, t("ycDiscountFactor")), ...dfEffects.series]}
              annotations={dfEffects.annotations} yDomain={[0, 1.06]} legend={false} yNumTicks={3}
              yFormat={(value) => value.toFixed(2)} yLabel={t("ycDiscountFactor")} selectedIndex={selected}
              onSelectIndex={model.setSelected} />
          </div>
          <div className="yc-chart-caption"><span>{t("ycDragHint")}</span><span>{t("ycChartKey")}</span></div>
        </ChartContainer>
      </div>
      <SelectedReadout model={model} />
    </div>
  );
}
