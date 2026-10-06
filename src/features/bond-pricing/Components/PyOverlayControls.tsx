import { useI18n } from "../../../i18n";
import { BOND_COLORS } from "../bondColors";
import { IntuitionTrigger } from "../../../components/intuition";

type Props = {
  showDuration: boolean;
  showConvexity: boolean;
  onToggleDuration: () => void;
  onToggleConvexity: () => void;
};

/// Combined legend + toggle row for the price–yield overlays: the curve is always
/// shown, while the duration and duration+convexity approximations are optional.
export default function PyOverlayControls({
  showDuration,
  showConvexity,
  onToggleDuration,
  onToggleConvexity,
}: Props) {
  const { t } = useI18n();

  return (
    <div className="bond-py-controls">
      <span className="bond-py-legend-item intuition-reveal">
        <i className="line solid" style={{ color: BOND_COLORS.curve }} />
        {t("bondPyCurve")}
        <IntuitionTrigger sectionId="price-yield" />
      </span>
      <span className="bond-py-overlays-label">{t("bondPyOverlaysLabel")}</span>
      <span className="intuition-reveal intuition-control-help">
      <button
        type="button"
        className={`bond-py-toggle${showDuration ? " active" : ""}`}
        aria-pressed={showDuration}
        onClick={onToggleDuration}
      >
        <i className="line dash" style={{ color: BOND_COLORS.durationApprox }} />
        {t("bondPyDuration")}
      </button>
      <IntuitionTrigger sectionId="modified-duration" />
      </span>
      <span className="intuition-reveal intuition-control-help">
      <button
        type="button"
        className={`bond-py-toggle${showConvexity ? " active" : ""}`}
        aria-pressed={showConvexity}
        onClick={onToggleConvexity}
      >
        <i className="line dot" style={{ color: BOND_COLORS.convexityApprox }} />
        {t("bondPyConvexity")}
      </button>
      <IntuitionTrigger sectionId="convexity" />
      </span>
    </div>
  );
}
