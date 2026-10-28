import SliderField from "../../../components/SliderField";
import { ControlGroup } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import type { AvsLab } from "../useAvellanedaStoikovLab";

/// Sidebar: γ, σ and k (secondary to the puck and the sketch) and the fixed paper settings.
export default function AsControls({ lab }: { lab: AvsLab }) {
  const { t } = useI18n();
  const { url, setUrl, params } = lab;
  return (
    <>
      <ControlGroup label={t("avsModel")}>
        <SliderField label={t("avsGamma")} min={0.01} max={1} step={0.01} value={url.gamma} onChange={(gamma) => setUrl({ gamma })} formatValue={(v) => v.toFixed(2)} />
        <SliderField label={t("avsSigma")} min={0.5} max={4} step={0.1} value={url.sigma} onChange={(sigma) => setUrl({ sigma })} formatValue={(v) => v.toFixed(1)} />
        <SliderField label={t("avsK")} min={0.5} max={3} step={0.05} value={url.k} onChange={(k) => setUrl({ k })} formatValue={(v) => v.toFixed(2)} />
      </ControlGroup>
      <ControlGroup label={t("avsSetup")}>
        <p className="avs-caption">{t("avsPaperSetup", { s0: params.s0, A: params.A, dt: params.dt })}</p>
      </ControlGroup>
    </>
  );
}
