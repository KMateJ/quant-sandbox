import { useUrlState } from "../../../components/useUrlState";
import SliderField from "../../../components/SliderField";
import SeedControl from "../../../components/SeedControl";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../../components/layout";
import { useI18n } from "../../../i18n";
import ItoBothSides from "../components/ItoBothSides";
import ItoLemmaParts from "../components/ItoLemmaParts";
import { LEMMA_URL_SCHEMA } from "../itoPages.url";

/// Itô's lemma on one path: the both-sides view plus the split of f(W) into its integral and drift parts.
export default function ItosLemmaPage() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [{ fn, n, T, seed }, setUrl] = useUrlState(LEMMA_URL_SCHEMA);

  return (
    <>
      <PageHeader title={t("itoLemTitle")} description={t("itoLemDesc")} />
      <Workspace columns="sidebar">
        <Panel title={t("itoLemControls")}>
          <div className="controls-grid">
            <SliderField label={t("itoProcessHorizonLabel")} min={0.25} max={5} step={0.25} value={T} onChange={(v) => setUrl({ T: v })} formatValue={(v) => v.toFixed(2)} />
            <SeedControl seed={seed} setSeed={(s) => setUrl({ seed: s })} compact />
          </div>
          <p className="lp-ensemble-hint">{t("itoLemHint")}</p>
        </Panel>
        <ChartContainer title={t("itoBsTitle")}>
          <ItoBothSides fn={fn} n={Number(n)} classic horizon={T} seed={seed} isMobile={isMobile}
            onChange={({ n: steps, fn: f }) => setUrl({ ...(f ? { fn: f } : {}), ...(steps !== undefined ? { n: String(steps) as typeof n } : {}) })} />
        </ChartContainer>
      </Workspace>
      <Workspace className="lp-section">
        <ChartContainer title={t("itoLemPartsTitle")}>
          <ItoLemmaParts fn={fn} n={Number(n)} horizon={T} seed={seed} isMobile={isMobile} />
        </ChartContainer>
      </Workspace>
    </>
  );
}
