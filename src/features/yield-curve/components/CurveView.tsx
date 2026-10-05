import { useState } from "react";
import { ChartContainer, Panel } from "../../../components/layout";
import { Tabs } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import type { YieldCurveModel } from "../useYieldCurve";
import type { PresetId } from "../yieldCurve.types";
import { PRESET_IDS, MATURITY_LABELS } from "../presets";
import { buildRateSeries, buildDfSeries } from "../curveSeries";
import { pct2, df4, type RepKey } from "../curveChartUtils";
import MaturityChart from "./MaturityChart";
import NodeTable from "./NodeTable";
import SelectedReadout from "./SelectedReadout";

type Props = { model: YieldCurveModel };

export default function CurveView({ model }: Props) {
  const { t } = useI18n();
  const [input, setInput] = useState<"preset" | "custom">("preset");
  const [mode, setMode] = useState<"rates" | "df">("rates");
  const [active, setActive] = useState<RepKey>("par");
  const [compare, setCompare] = useState(true);

  const { term, selected } = model;
  const repLabels: Record<RepKey, string> = {
    par: t("ycParRate"),
    zero: t("ycZeroRate"),
    forward: t("ycForwardRate"),
  };

  const vals = term.flatMap((p) => [p.par, p.zero, p.fwd]);
  const yDomain: [number, number] =
    mode === "df" ? [0, 1] : [Math.min(0, ...vals), Math.max(...vals) * 1.12];
  const draggable = mode === "rates" && active === "par";
  const series =
    mode === "df"
      ? buildDfSeries(term, t("ycDiscountFactor"))
      : buildRateSeries(term, active, compare, draggable, repLabels);

  return (
    <div className="workspace cols-sidebar">
      <Panel title={t("ycCurveInputs")}>
        <div className="yc-controls">
          <Tabs segmented ariaLabel={t("ycInputMode")} value={input}
            onChange={(v) => setInput(v as "preset" | "custom")}
            items={[
              { id: "preset", label: t("ycPreset") },
              { id: "custom", label: t("ycCustom") },
            ]} />

          {input === "preset" ? (
            <div className="yc-preset-pick" role="group" aria-label={t("ycPreset")}>
              {PRESET_IDS.map((id) => (
                <button key={id} type="button"
                  className={model.preset === id ? "is-active" : undefined}
                  onClick={() => model.applyPreset(id as PresetId)}>
                  {t(`ycPreset_${id}`)}
                </button>
              ))}
            </div>
          ) : (
            <NodeTable nodes={model.nodes} selected={selected}
              onSelect={model.setSelected} onRate={model.setRate} />
          )}

          <Tabs segmented ariaLabel={t("ycRepresentation")} value={mode}
            onChange={(v) => setMode(v as "rates" | "df")}
            items={[
              { id: "rates", label: t("ycRates") },
              { id: "df", label: t("ycDiscountFactors") },
            ]} />

          {mode === "rates" && (
            <>
              <Tabs segmented ariaLabel={t("ycRepresentation")} value={active}
                onChange={(v) => setActive(v as RepKey)}
                items={[
                  { id: "par", label: t("ycParShort") },
                  { id: "zero", label: t("ycZeroShort") },
                  { id: "forward", label: t("ycForwardShort") },
                ]} />
              <label className="yc-check">
                <input type="checkbox" checked={compare}
                  onChange={(e) => setCompare(e.target.checked)} />
                {t("ycCompare")}
              </label>
            </>
          )}
        </div>
      </Panel>

      <div className="module-main">
        <ChartContainer title={t("ycTermStructure")}>
          <div className="chart-wrap">
            <MaturityChart
              labels={MATURITY_LABELS}
              series={series}
              yDomain={yDomain}
              yFormat={mode === "df" ? df4 : pct2}
              yLabel={mode === "df" ? t("ycDiscountFactor") : t("ycYieldAxis")}
              selectedIndex={selected}
              onSelectIndex={model.setSelected}
              onDragRate={
                draggable
                  ? (i, y) => model.setRate(i, Math.max(0, Math.min(0.12, y)))
                  : undefined
              }
            />
          </div>
          {draggable && <p className="yc-hint">{t("ycDragHint")}</p>}
        </ChartContainer>

        <SelectedReadout term={term} selected={selected} onSelect={model.setSelected} />
      </div>
    </div>
  );
}
