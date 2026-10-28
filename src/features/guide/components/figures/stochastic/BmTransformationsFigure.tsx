import { useMemo, useState } from "react";
import { LineChart } from "../../../../../components/charts";
import SliderField from "../../../../../components/SliderField";
import { SegmentedControl } from "../../../../../components/ui";
import { useI18n, type TranslationKey } from "../../../../../i18n";
import { transformedRows, type Transformation } from "../../../guide.stochastic.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt } from "../figureFormat";
import { bandSeries, pathSeries } from "../figureSeries";

const KINDS: Transformation[] = ["scaling", "inversion", "symmetry", "shift"];
const KIND_KEY: Record<Transformation, TranslationKey> = { scaling: "gsScaling", inversion: "gsInversion", symmetry: "gsSymmetry", shift: "gsShift" };
const FORMULA: Record<Transformation, string> = { scaling: "c^(−1/2) W(ct)", inversion: "t · W(1/t)", symmetry: "−W(t)", shift: "W(s+t) − W(s)" };
const PATHS = 8;

/// Each transformation of W is again a standard Brownian motion: same √t envelope, Var X₁ ≈ 1, Cov(X₀.₅, X₁) ≈ 0.5.
export default function BmTransformationsFigure() {
  const { t } = useI18n();
  const [kind, setKind] = useState<Transformation>("inversion");
  const [c, setC] = useState(2);
  const [s, setS] = useState(1);
  const [seed, setSeed] = useState(1);
  const param = kind === "scaling" ? c : kind === "shift" ? s : 0;
  const model = useMemo(() => transformedRows(kind, param, PATHS, seed), [kind, param, seed]);

  return (
    <GuideFigure title={t("gsTransformTitle")} labId="brownian-motion">
      <div className="gf-toolbar">
        <SegmentedControl<Transformation> ariaLabel={t("gsTransformLabel")} value={kind} onChange={setKind} options={KINDS.map((v) => ({ value: v, label: t(KIND_KEY[v]) }))} />
        <button type="button" className="preset-btn" onClick={() => setSeed((v) => v + 1)}>{t("gfNewPaths")}</button>
      </div>
      {kind === "scaling" && <SliderField label="c" min={0.25} max={4} step={0.05} value={c} onChange={setC} formatValue={(v) => v.toFixed(2)} />}
      {kind === "shift" && <SliderField label="s" min={0} max={2} step={0.05} value={s} onChange={setS} formatValue={(v) => v.toFixed(2)} />}
      <p className="gf-hint">X(t) = {FORMULA[kind]}</p>
      <div className="gf-chart" role="img" aria-label={t("gsTransformAria", { name: t(KIND_KEY[kind]) })}>
        <LineChart
          data={model.rows}
          xKey="t"
          series={[...pathSeries(PATHS), bandSeries("env1", "±√t", "5 3"), bandSeries("env1n", "", "5 3"), bandSeries("env2", "±2√t", "2 4"), bandSeries("env2n", "", "2 4")]}
          yDomain={[-3, 3]}
          curve="linear"
          tooltipLabel={(x) => `t = ${x.toFixed(2)}`}
          valueFormat={(v) => v.toFixed(2)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gsVarX1"), value: fmt(model.var1, 3), tone: "accent" },
          { label: t("gsCovX"), value: fmt(model.cov, 3), tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
