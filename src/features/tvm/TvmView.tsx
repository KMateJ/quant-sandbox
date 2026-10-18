import { useMediaQuery } from "../../components/useMediaQuery";
import { PageHeader, Workspace, Panel } from "../../components/layout";
import { useI18n } from "../../i18n";
import TvmChart from "./TvmChart";
import TvmControls from "./TvmControls";
import TvmDoubling from "./TvmDoubling";
import TvmRace from "./TvmRace";
import TvmResults from "./TvmResults";
import TvmSequence from "./TvmSequence";
import { useTvmLab } from "./useTvmLab";

export default function TvmView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const lab = useTvmLab();

  return (
    <>
      <PageHeader title={t("tvmTitle")} description={t("tvmDesc")} />

      <Workspace columns="sidebar">
        <Panel title={t("tvmControlsTitle")}>
          <TvmControls lab={lab} />
          <TvmResults lab={lab} />
          <TvmDoubling rate={lab.eff.rate} />
        </Panel>

        <TvmChart lab={lab} isMobile={isMobile} />
      </Workspace>

      <TvmRace lab={lab} />
      <TvmSequence lab={lab} isMobile={isMobile} />
    </>
  );
}
