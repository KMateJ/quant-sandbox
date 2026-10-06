import { IntuitionTrigger } from "../../../components/intuition";
import { useI18n } from "../../../i18n";
import { YC_COLORS } from "../curveChartUtils";

export default function CurveLegend() {
  const { t } = useI18n();
  const entries = [
    { name: t("ycParRate"), role: t("ycMarketInput"), color: YC_COLORS.par, section: "par-rate" },
    { name: t("ycZeroRate"), role: t("ycBootstrapped"), color: YC_COLORS.zero, section: "zero-rate" },
    { name: t("ycForwardRate"), role: t("ycImplied"), color: YC_COLORS.forward, section: "forward-rate" },
  ];
  return (
    <div className="yc-curve-legend">
      {entries.map(({ name, role, color, section }) => (
        <span key={section} className="yc-curve-key">
          <i style={{ background: color }} />
          <strong>{name}</strong><span>{role}</span>
          <IntuitionTrigger variant="question" sectionId={section} />
        </span>
      ))}
    </div>
  );
}
