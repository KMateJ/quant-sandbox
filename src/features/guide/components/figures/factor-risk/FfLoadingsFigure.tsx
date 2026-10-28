import { useMemo, useState } from "react";
import SliderField from "../../../../../components/SliderField";
import { SegmentedControl } from "../../../../../components/ui";
import { useI18n } from "../../../../../i18n";
import { ffFit, type FfModel } from "../../../guide.famaFrench.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt, pct } from "../figureFormat";
import FfLoadingsBars from "./FfLoadingsBars";

const MODELS: FfModel[] = ["capm", "ff3", "ff5"];
const MODEL_LABEL: Record<FfModel, string> = { capm: "CAPM", ff3: "FF3", ff5: "FF5" };

/// A simulated fund's excess returns regressed on CAPM, FF3 or FF5: loadings, alpha and its t-statistic.
export default function FfLoadingsFigure() {
  const { t } = useI18n();
  const [size, setSize] = useState(0.5);
  const [value, setValue] = useState(0.4);
  const [months, setMonths] = useState(240);
  const [model, setModel] = useState<FfModel>("capm");
  const fit = useMemo(() => ffFit({ size, value, months }, model), [size, value, months, model]);

  return (
    <GuideFigure title={t("gfFfLoadingsTitle")} labId="fama-french">
      <div className="gf-sliders">
        <SliderField label={t("gfFfSize")} min={-0.5} max={1} step={0.05} value={size} onChange={setSize} formatValue={(v) => v.toFixed(2)} />
        <SliderField label={t("gfFfValue")} min={-0.5} max={1} step={0.05} value={value} onChange={setValue} formatValue={(v) => v.toFixed(2)} />
        <SliderField label={t("gfFfMonths")} min={60} max={600} step={12} value={months} onChange={setMonths} formatValue={(v) => t("gfFfMonthsValue", { n: v })} />
      </div>
      <div className="gf-toolbar">
        <SegmentedControl<FfModel> ariaLabel={t("gfFfModel")} value={model} onChange={setModel} options={MODELS.map((m) => ({ value: m, label: MODEL_LABEL[m] }))} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfFfAria")}>
        <FfLoadingsBars loadings={fit.loadings} truth={fit.truth} labels={{ omitted: t("gfFfOmitted"), truth: t("gfFfTruth") }} />
      </div>
      <FigureReadout
        items={[
          { label: t("gfFfAlpha"), value: pct(fit.alphaAnnual, 2), tone: "accent" },
          { label: t("gfFfAlphaT"), value: fmt(fit.alphaT, 2), tone: "strong" },
          { label: "R²", value: fmt(fit.r2, 3) },
        ]}
      />
      <p className="gf-hint">{t("gfFfNote")}</p>
    </GuideFigure>
  );
}
