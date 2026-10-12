import SliderField from "../../components/SliderField";
import { ControlGroup, SegmentedControl } from "../../components/ui";
import { useI18n } from "../../i18n";
import GeometrySimControls from "./GeometrySimControls";
import { PG_MONITORING_STEPS } from "./pathGeometry.types";
import type { HittingExperiment } from "./useHittingExperiment";

export default function HittingControls({ e }: { e: HittingExperiment }) {
  const { t } = useI18n();
  return (
    <GeometrySimControls sim={e.sim} maxPaths={2000}>
      <ControlGroup label={t("pgBarrier")}>
        <SliderField label="a" min={0.2} max={2.5} step={0.05} value={e.barrier} onChange={e.setBarrier} formatValue={(v) => v.toFixed(2)} />
      </ControlGroup>
      <ControlGroup label={t("pgHitDrift")} hint={<span className="stoch-control-hint">{t("pgHitDriftHint")}</span>}>
        <SliderField label="μ" min={-1} max={1} step={0.05} value={e.drift} onChange={e.setDrift} formatValue={(v) => v.toFixed(2)} />
      </ControlGroup>
      <ControlGroup label={t("pgHitMonitoring")} hint={<span className="stoch-control-hint">{t("pgHitMonitoringHint")}</span>}>
        <SegmentedControl
          options={PG_MONITORING_STEPS.map((value) => ({ value, label: String(value) }))}
          value={e.monitoring}
          onChange={(value) => e.setMonitoring(Number(value))}
          ariaLabel={t("pgHitMonitoring")}
        />
      </ControlGroup>
      <button className="preset-btn" type="button" onClick={e.nextPath}>
        {t("pgHitNextMissed")}
      </button>
    </GeometrySimControls>
  );
}
