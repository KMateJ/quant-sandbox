import { useState } from "react";
import { SketchLayer } from "../../../components/charts";
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
  const [sketching, setSketching] = useState(false);
  const { term, beforeTerm, selected } = model;
  const labels = { par: t("ycMarketCurve"), zero: t("ycBootstrappedCurve"), forward: t("ycImpliedCurve") };
  const domain = rateDomain([...term, ...beforeTerm]);
  const rateEffects = buildEffectOverlay(beforeTerm, term, ["zero", "fwd"]);
  const dfEffects = buildEffectOverlay(beforeTerm, term, ["df"]);
  // A sketch session is one edit: the axis is frozen and the before/after overlay compares against the curve before it.
  const toggleSketch = () => {
    if (sketching) { model.endEdit(); setDragDomain(null); }
    else { model.beginEdit(selected); setDragDomain(domain); }
    setSketching(!sketching);
  };

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
        <ChartContainer title={t("ycTermStructure")} actions={<>
          <button type="button" className={sketching ? "preset-btn preset-btn--active" : "preset-btn"} aria-pressed={sketching} onClick={toggleSketch}>
            {t(sketching ? "ycSketchDone" : "ycSketch")}
          </button>
          <span className="yc-chart-selection">{t("ycSelectedMaturity")}: {term[selected].label}</span>
        </>}>
          <CurveLegend />
          <div className="chart-wrap yc-term-chart">
            <MaturityChart labels={MATURITY_LABELS}
              series={[...buildRateSeries(term, labels), ...rateEffects.series]}
              annotations={rateEffects.annotations} yDomain={dragDomain ?? domain} legend={false} yNumTicks={5}
              yFormat={pct2} yLabel={t("ycYieldAxis")} selectedIndex={selected}
              onSelectIndex={model.setSelected}
              onDragStart={(i) => { setDragDomain(domain); model.beginEdit(i); }}
              onDragEnd={() => { setDragDomain(null); model.endEdit(); }}
              onDragRate={(i, y) => model.setRate(i, Math.max(0, Math.min(0.12, y)))}
              layer={sketching ? (frame) => (
                <SketchLayer frame={frame} mode="curve" xGrid={term.map((_, i) => i)} yRange={[0, 0.12]} smooth={0.3}
                  value={model.nodes.map((n, i) => ({ x: i, y: n.rate }))}
                  onChange={(points) => model.sketchRates(points.map((p) => p.y))}
                  ariaLabel={t("ycSketchAria")} />
              ) : undefined} />
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
          <div className="yc-chart-caption"><span>{t(sketching ? "ycSketchHint" : "ycDragHint")}</span><span>{t("ycChartKey")}</span></div>
        </ChartContainer>
      </div>
      <SelectedReadout model={model} />
    </div>
  );
}
