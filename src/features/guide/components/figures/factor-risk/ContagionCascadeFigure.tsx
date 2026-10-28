import { useMemo, useState } from "react";
import SliderField from "../../../../../components/SliderField";
import { SegmentedControl } from "../../../../../components/ui";
import { useI18n } from "../../../../../i18n";
import { letterTag } from "../../../../systemic-risk/engine/presets.math";
import { cascadeSnapshot, contagionCascade } from "../../../guide.systemic.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { pct } from "../figureFormat";
import ContagionCascadeNetwork from "./ContagionCascadeNetwork";

const N = 8;
const DEGREES = [1, 2, 7] as const;
type Degree = (typeof DEGREES)[number];
const DEGREE_KEY = { 1: "gfSysCcRing", 2: "gfSysCcTwo", 7: "gfSysCcComplete" } as const;

/// Sequential default cascade on eight banks: pick the shocked bank, set buffers and recovery, step through the rounds.
export default function ContagionCascadeFigure() {
  const { t } = useI18n();
  const [shocked, setShocked] = useState(0);
  const [shock, setShock] = useState(0.5);
  const [equityRatio, setEquity] = useState(0.06);
  const [recovery, setRecovery] = useState(0);
  const [degree, setDegree] = useState<Degree>(2);
  const [step, setStep] = useState(0);
  const r = useMemo(() => contagionCascade({ n: N, degree, shocked, shock, equityRatio, recovery }), [degree, shocked, shock, equityRatio, recovery]);
  const s = cascadeSnapshot(r, step);
  const reset = <T,>(f: (v: T) => void) => (v: T) => { f(v); setStep(0); };

  return (
    <GuideFigure title={t("gfSysCascadeTitle")} labId="systemic-risk">
      <div className="gf-sliders">
        <SliderField label={t("gfSysCcShock")} min={0} max={1} step={0.05} value={shock} onChange={reset(setShock)} formatValue={(v) => pct(v, 0)} />
        <SliderField label={t("gfSysCcEquity")} min={0.02} max={0.15} step={0.01} value={equityRatio} onChange={reset(setEquity)} formatValue={(v) => pct(v, 0)} />
        <SliderField label={t("gfSysCcRecovery")} min={0} max={1} step={0.05} value={recovery} onChange={reset(setRecovery)} formatValue={(v) => pct(v, 0)} />
      </div>
      <div className="gf-toolbar">
        <SegmentedControl<Degree> ariaLabel={t("gfSysCcNetwork")} value={degree} onChange={reset(setDegree)} options={DEGREES.map((d) => ({ value: d, label: t(DEGREE_KEY[d]) }))} />
        <SegmentedControl<number> ariaLabel={t("gfSysCcShocked")} value={shocked} onChange={reset(setShocked)} options={Array.from({ length: N }, (_, i) => ({ value: i, label: letterTag(i) }))} />
      </div>
      <div className="gf-toolbar">
        <button type="button" className="preset-btn" disabled={s.last} onClick={() => setStep((x) => x + 1)}>{t("gfSysCcNext")}</button>
        <button type="button" className="preset-btn" disabled={s.last} onClick={() => setStep(r.losses.length - 1)}>{t("gfSysCcRunAll")}</button>
        <button type="button" className="preset-btn" onClick={() => setStep(0)}>{t("gfSysCcReset")}</button>
      </div>
      <div className="gf-chart gf-chart--auto" role="img" aria-label={t("gfSysCcAria")}>
        <ContagionCascadeNetwork borrowers={r.borrowers} failed={s.failed} loss={s.loss} equity={r.equity} shocked={shocked} onPick={reset(setShocked)}
          labels={{ failed: t("gfSysCcFailed"), buffer: t("gfSysCcBuffer"), shocked: t("gfSysCcShocked") }} />
      </div>
      <FigureReadout
        items={[
          { label: t("gfSysCcRound"), value: t("gfSysCcRoundOf", { r: Math.min(step, r.losses.length - 1) + 1, n: r.losses.length }) },
          { label: t("gfSysCcDefaulted"), value: `${s.defaulted} / ${N}`, tone: "strong" },
          { label: t("gfSysCcRounds"), value: s.last ? String(r.rounds) : "…" },
          { label: t("gfSysCcLosses"), value: pct(s.lossShare, 1), tone: "accent" },
        ]}
      />
      <p className="gf-hint">{t("gfSysCcHint", { exposure: r.exposure.toFixed(1), equity: r.equity.toFixed(0) })}</p>
    </GuideFigure>
  );
}
