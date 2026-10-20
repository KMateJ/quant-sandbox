import { ChartContainer, Panel } from "../../../components/layout";
import { PlaybackControls, usePlayback } from "../../../components/playback";
import { DataTable, type DataColumn } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import type { YieldCurveModel } from "../useYieldCurve";
import type { TermPoint } from "../yieldCurve.types";
import { MATURITY_LABELS } from "../presets";
import { pct2 } from "../curveChartUtils";
import { buildBootstrapSeries, instrumentKind } from "../bootstrap";
import BootstrapEquation from "./BootstrapEquation";
import MaturityChart from "./MaturityChart";

type Props = { model: YieldCurveModel };

export default function BootstrapView({ model }: Props) {
  const { t } = useI18n();
  const { term, nodes } = model;
  const last = term.length - 1;
  const playback = usePlayback({ steps: last, initial: 3, durationMs: 8000 });
  const step = playback.step;

  const vals = term.flatMap((d) => [d.par, d.zero]);
  const yDomain: [number, number] = [Math.min(0, ...vals), Math.max(...vals) * 1.12];

  const columns: DataColumn<TermPoint & { index: number }>[] = [
    { key: "kind", header: t("ycColInstrument"), render: (r) => t(`ycKind_${instrumentKind(r.t)}`) },
    { key: "mat", header: t("ycColMaturity"), render: (r) => r.label },
    {
      key: "quote", header: t("ycColQuote"), align: "end",
      render: (r) => (
        <span className="yc-rate-input">
          <input type="number" step={0.05}
            value={Number((nodes[r.index].rate * 100).toFixed(4))}
            onFocus={() => playback.setStep(r.index)}
            onChange={(e) => {
              const raw = Number(e.target.value);
              if (!Number.isNaN(raw)) model.setRate(r.index, raw / 100);
            }} />
          <span>%</span>
        </span>
      ),
    },
  ];

  return (
    <div className="workspace cols-sidebar">
      <Panel title={t("ycBootstrapInstruments")}>
        <DataTable
          className="yc-instruments"
          columns={columns}
          rows={term.map((d, i) => ({ ...d, index: i }))}
          getRowKey={(r) => r.label}
        />
      </Panel>

      <div className="module-main">
        <ChartContainer title={t("ycBootstrapChart")}>
          <PlaybackControls
            playback={playback}
            steps={last}
            label={t("ycColMaturity")}
            formatStep={(k) => `${term[k]?.label ?? ""} (${k + 1}/${term.length})`}
            showStepButtons
          />
          <div className="chart-wrap">
            <MaturityChart
              labels={MATURITY_LABELS}
              series={buildBootstrapSeries(term, step, t("ycParRate"), t("ycZeroRate"))}
              yDomain={yDomain}
              yFormat={pct2}
              yLabel={t("ycYieldAxis")}
              selectedIndex={step}
              onSelectIndex={playback.setStep}
            />
          </div>
        </ChartContainer>
        <BootstrapEquation term={term} step={step} />
      </div>
    </div>
  );
}
