import { useState } from "react";
import { ChartContainer, Panel } from "../../../components/layout";
import { DataTable, type DataColumn } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import type { YieldCurveModel } from "../useYieldCurve";
import type { TermPoint } from "../yieldCurve.types";
import { MATURITY_LABELS } from "../presets";
import { pct2, df4 } from "../curveChartUtils";
import { buildBootstrapSeries, couponDfSum, instrumentKind } from "../bootstrap";
import MaturityChart from "./MaturityChart";

type Props = { model: YieldCurveModel };

export default function BootstrapView({ model }: Props) {
  const { t } = useI18n();
  const { term, nodes } = model;
  const [step, setStep] = useState(3);
  const p = term[step];

  const vals = term.flatMap((d) => [d.par, d.zero]);
  const yDomain: [number, number] = [Math.min(0, ...vals), Math.max(...vals) * 1.12];

  const sumPrev = p ? couponDfSum(term, p.t) : 0;
  const isDeposit = p ? instrumentKind(p.t) === "deposit" : true;

  const columns: DataColumn<TermPoint & { index: number }>[] = [
    { key: "kind", header: t("ycColInstrument"), render: (r) => t(`ycKind_${instrumentKind(r.t)}`) },
    { key: "mat", header: t("ycColMaturity"), render: (r) => r.label },
    {
      key: "quote", header: t("ycColQuote"), align: "end",
      render: (r) => (
        <span className="yc-rate-input">
          <input type="number" step={0.05}
            value={Number((nodes[r.index].rate * 100).toFixed(4))}
            onFocus={() => setStep(r.index)}
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
        <ChartContainer
          title={t("ycBootstrapChart")}
          actions={
            <div className="yc-stepper">
              <button type="button" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
                {t("ycPrev")}
              </button>
              <span>{t("ycStep")} {step + 1}/{term.length} · {p?.label}</span>
              <button type="button" disabled={step === term.length - 1} onClick={() => setStep((s) => s + 1)}>
                {t("ycNext")}
              </button>
            </div>
          }
        >
          <div className="chart-wrap">
            <MaturityChart
              labels={MATURITY_LABELS}
              series={buildBootstrapSeries(term, step, t("ycParRate"), t("ycZeroRate"))}
              yDomain={yDomain}
              yFormat={pct2}
              yLabel={t("ycYieldAxis")}
              selectedIndex={step}
              onSelectIndex={setStep}
            />
          </div>
        </ChartContainer>

        {p && (
          <div className="yc-formula">
            <div className="yc-formula-title">
              {t("ycSolveFor")} {p.label} ({t(`ycKind_${instrumentKind(p.t)}`)})
            </div>
            {isDeposit ? (
              <>
                <code>DF({p.label}) = 1 / (1 + {pct2(p.par)})^{p.t} = {df4(p.df)}</code>
                <code>z({p.label}) = DF^(-1/{p.t}) - 1 = {pct2(p.zero)}</code>
              </>
            ) : (
              <>
                <code>
                  DF({p.label}) = (1 - {pct2(p.par)} · {df4(sumPrev)}) / (1 + {pct2(p.par)}) = {df4(p.df)}
                </code>
                <code>z({p.label}) = DF({p.label})^(-1/{p.t}) - 1 = {pct2(p.zero)}</code>
                <p className="yc-formula-note">{t("ycBootstrapNote")}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
