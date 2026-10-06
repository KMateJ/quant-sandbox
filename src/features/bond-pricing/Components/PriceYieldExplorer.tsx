import { ScatterChart } from "../../../components/charts";
import { IntuitionTrigger } from "../../../components/intuition";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { useI18n } from "../../../i18n";
import { usePriceYieldExplorer, type PriceYieldProps } from "../usePriceYieldExplorer";
import PyOverlayControls from "./PyOverlayControls";

export default function PriceYieldExplorer(props: PriceYieldProps) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const model = usePriceYieldExplorer(props);
  return (
    <div className="bond-py">
      <PyOverlayControls
        showDuration={model.showDuration}
        showConvexity={model.showConvexity}
        onToggleDuration={() => model.setShowDuration((value) => !value)}
        onToggleConvexity={() => model.setShowConvexity((value) => !value)}
      />
      <div className="bond-py-chart">
        <ScatterChart
          series={model.series}
          xDomain={[0, props.maxYtm]}
          yDomain={[0, model.yMax]}
          referenceLines={model.referenceLines}
          bands={model.bands}
          annotations={model.annotations}
          isMobile={isMobile}
          legend={false}
          xFormat={(value) => `${(value * 100).toFixed(2)}%`}
          yFormat={(value) => value.toFixed(2)}
          xLabel={t("bondPyYtmAxis")}
          yLabel={t("bondPyPriceAxis")}
          onDrag={(x) => props.onYtm(Math.min(props.maxYtm, Math.max(0.001, x)))}
        />
      </div>
      <p className="bond-py-hint intuition-reveal">
        {t("bondPyDragHint")} <IntuitionTrigger sectionId="price-yield" />
      </p>
    </div>
  );
}
