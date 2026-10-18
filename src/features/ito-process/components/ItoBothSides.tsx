import { useMemo, useState } from "react";
import { DragHandles, LineChart, type ChartSeries } from "../../../components/charts";
import { SegmentedControl } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { fineIncrements, itoBothSides, ITO_FINE_STEPS, type ItoFn } from "../itoProcess.math";
import ItoBothSidesErrors from "./ItoBothSidesErrors";

export type ItoSidesState = { fn: ItoFn; n: number; classic: boolean };
type Props = ItoSidesState & { horizon: number; seed: number; isMobile: boolean; onChange: (patch: Partial<ItoSidesState>) => void };

const NS = [4, 16, 64, 256, 1024];
const FN_LABEL: Record<ItoFn, string> = { square: "W²", exp: "eᵂ", sin: "sin W" };
const f4 = (v: number) => v.toFixed(4);

/// f(W_T) − f(0) against the Itô sum with and without ½∫f″dt on one seeded path, as the grid refines.
export default function ItoBothSides({ fn, n, classic, horizon, seed, isMobile, onChange }: Props) {
  const { t } = useI18n();
  const dw = useMemo(() => fineIncrements(horizon, ITO_FINE_STEPS, seed), [horizon, seed]);
  const rows = useMemo(() => itoBothSides(fn, dw, horizon, n), [fn, dw, horizon, n]);
  const [cursor, setCursor] = useState(horizon / 2);
  const at = rows[Math.min(n, Math.max(0, Math.round((cursor / horizon) * n)))];
  const end = rows[n];
  const gap = end.target - end.ito;

  const series: ChartSeries[] = [
    { key: "target", label: t("itoBsTarget"), color: "var(--text)", strokeWidth: 2.5 },
    { key: "corrected", label: t("itoBsCorrected"), color: "#22c55e", strokeWidth: 2 },
    ...(classic ? [{ key: "ito", label: t("itoBsIto"), color: "#f59e0b", strokeWidth: 2, dash: "6 4" }] : []),
  ];

  return (
    <div className="ito-bs">
      <p className="ito-stepper-text">{t("itoBsIntro")}</p>
      <div className="ito-bs-controls">
        <SegmentedControl<ItoFn> ariaLabel={t("itoBsFn")} value={fn} onChange={(v) => onChange({ fn: v })}
          options={(Object.keys(FN_LABEL) as ItoFn[]).map((k) => ({ value: k, label: FN_LABEL[k] }))} />
        <SegmentedControl<number> ariaLabel={t("itoBsSteps")} value={n} onChange={(v) => onChange({ n: v })}
          options={NS.map((k) => ({ value: k, label: `n = ${k}` }))} />
        <SegmentedControl<"on" | "off"> ariaLabel={t("itoBsClassic")} value={classic ? "on" : "off"} onChange={(v) => onChange({ classic: v === "on" })}
          options={[{ value: "on", label: `${t("itoBsShow")}: ${t("itoBsClassic")}` }, { value: "off", label: t("itoBsHide") }]} />
      </div>
      <div className="chart-wrap" role="img" aria-label={t("itoBsAria")}>
        <LineChart data={rows} xKey="t" series={series} xDomain={[0, horizon]} curve="linear" isMobile={isMobile}
          tooltipLabel={(x) => `t = ${x.toFixed(3)}`} valueFormat={f4}
          layer={(frame) => (
            <>
              {classic && (
                <g className="ito-bs-gap">
                  <line x1={frame.x(horizon) - 6} x2={frame.x(horizon) - 6} y1={frame.y(end.ito)} y2={frame.y(end.target)} />
                  <text x={frame.x(horizon) - 10} y={(frame.y(end.ito) + frame.y(end.target)) / 2} textAnchor="end">
                    {t("itoBsGap", { gap: f4(gap) })}
                  </text>
                </g>
              )}
              <DragHandles frame={frame} onChange={(_, v) => v.x !== undefined && setCursor(v.x)}
                handles={[{ id: "t", axis: "x", x: at.t, min: 0, max: horizon, step: horizon / Math.min(n, 64), label: t("itoBsCursor"), format: (v) => `t = ${v.toFixed(3)}` }]} />
            </>
          )} />
      </div>
      <p className="lp-ensemble-hint">{t("itoBsCursorHint")}</p>
      <dl className="lp-ensemble-readout" aria-live="polite">
        <div><dt>{t("itoBsTarget")}, {t("itoBsAtT", { t: at.t.toFixed(3) })}</dt><dd>{f4(at.target)}</dd></div>
        <div><dt>{t("itoBsCorrected")}, {t("itoBsAtT", { t: at.t.toFixed(3) })}</dt><dd>{f4(at.corrected)}</dd></div>
        {classic && <div><dt>{t("itoBsIto")}, {t("itoBsAtT", { t: at.t.toFixed(3) })}</dt><dd>{f4(at.ito)}</dd></div>}
      </dl>
      <dl className="lp-ensemble-readout">
        <div><dt>{t("itoBsTarget")} (T)</dt><dd>{f4(end.target)}</dd></div>
        <div><dt>{t("itoBsCorrected")}</dt><dd>{f4(end.corrected)}</dd></div>
        <div><dt>{t("itoBsErrCorrected")}</dt><dd>{f4(end.corrected - end.target)}</dd></div>
        {classic && <div><dt>{t("itoBsIto")}</dt><dd>{f4(end.ito)}</dd></div>}
        {classic && <div><dt>{t("itoBsErrIto")}</dt><dd>{f4(end.ito - end.target)}</dd></div>}
      </dl>
      <ItoBothSidesErrors fn={fn} horizon={horizon} seed={seed} ns={NS} n={n} isMobile={isMobile} />
    </div>
  );
}
