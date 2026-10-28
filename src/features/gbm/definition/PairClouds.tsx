import { PathCloudChart } from "../../../components/charts";
import type { PathOverlay } from "../../../components/charts";
import { pathPoints } from "../../../lib/stats/ensemble";
import { useI18n } from "../../../i18n";
import { MODEL_COLOR, type PairView } from "./pairView";

/// The two path clouds on one shared y-axis, with the same shock sequence highlighted in both.
export default function PairClouds({ view, isMobile }: { view: PairView; isMobile: boolean }) {
  const { t } = useI18n();
  const { pair, paths, steps, dt, horizon, yDomain, hero: heroIndex } = view;
  const zero: PathOverlay = { key: "zero", color: "var(--negative)", dash: "3 3", strokeWidth: 1.5, points: [{ x: 0, y: 0 }, { x: horizon, y: 0 }] };
  const chart = (model: "abm" | "gbm") => {
    const hero: PathOverlay = { key: "hero", color: "var(--text)", strokeWidth: 2, points: pathPoints(pair[model], paths, steps + 1, heroIndex, dt) };
    return (
      <figure className="gdef-half">
        <figcaption className={`gdef-tag is-${model}`}>{t(model === "abm" ? "gdefAbm" : "gdefGbm")}</figcaption>
        <div className="sde-chart">
          <PathCloudChart values={pair[model]} pathCount={paths} stepCount={steps + 1} dx={dt} xDomain={[0, horizon]} yDomain={yDomain}
            color={MODEL_COLOR[model]} maxOpacity={0.22} overlays={[zero, hero]} isMobile={isMobile}
            ariaLabel={t("gdefPathsAria", { model: t(model === "abm" ? "gdefAbm" : "gdefGbm") })} />
        </div>
      </figure>
    );
  };
  return <div className="gdef-pair">{chart("abm")}{chart("gbm")}</div>;
}
