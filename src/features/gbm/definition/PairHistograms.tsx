import { Histogram } from "../../../components/charts";
import { binValues } from "../../../lib/stats";
import { densityCurve, terminalValues } from "../../../lib/stats/ensemble";
import { useI18n } from "../../../i18n";
import { MODEL_COLOR, type PairView } from "./pairView";

/// End values of both models on the same x-axis with their exact densities: normal against log-normal.
export default function PairHistograms({ view, isMobile }: { view: PairView; isMobile: boolean }) {
  const { t } = useI18n();
  const { pair, paths, steps, yDomain, laws } = view;
  const hist = (model: "abm" | "gbm") => {
    const end = terminalValues(pair[model], paths, steps + 1);
    return (
      <figure className="gdef-half">
        <figcaption className={`gdef-tag is-${model}`}>{t(model === "abm" ? "gdefAbm" : "gdefGbm")}</figcaption>
        <Histogram bins={binValues(end, yDomain, 36).bins} density={densityCurve(laws[model], yDomain)} color={MODEL_COLOR[model]}
          height={isMobile ? 180 : 220} xFormat={(v) => v.toFixed(0)} yFormat={() => ""}
          ariaLabel={t("gdefHistAria", { model: t(model === "abm" ? "gdefAbm" : "gdefGbm") })} />
      </figure>
    );
  };
  return <div className="gdef-pair">{hist("abm")}{hist("gbm")}</div>;
}
