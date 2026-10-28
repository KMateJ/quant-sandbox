import { PageHeader, Panel, Workspace } from "../../../components/layout";
import { useI18n } from "../../../i18n";
import EpisodeGraph from "../episodes/components/EpisodeGraph";
import EpisodePicker from "../episodes/components/EpisodePicker";
import EpisodeTimeline from "../episodes/components/EpisodeTimeline";
import EventDetail from "../episodes/components/EventDetail";
import WhatIfPanel from "../episodes/components/WhatIfPanel";
import WithoutPredict from "../episodes/components/WithoutPredict";
import { useEpisodesPage } from "../episodes/useEpisodesPage";

/// Historical episodes: four real crises replayed on a stylised network, with switches that remove a rescue.
export default function EpisodesPage() {
  const { t } = useI18n();
  const page = useEpisodesPage();
  return (
    <>
      <PageHeader
        title={t("syrEpTitle")}
        description={t("syrEpDesc")}
        actions={<button type="button" className="preset-btn" onClick={page.reset}>{t("syrEpReset")}</button>}
      />
      <Workspace columns="thirds" className="syrep-workspace">
        <div className="syrep-col">
          <Panel title={t("syrEpPickerTitle")}>
            <EpisodePicker value={page.url.ep} onPick={page.pick} />
          </Panel>
          <Panel title={t("syrEpTimelineTitle")}>
            <EpisodeTimeline episode={page.episode} current={page.current} onJump={page.jumpTo} />
          </Panel>
        </div>
        <div className="syrep-col">
          <EpisodeGraph page={page} />
          <EventDetail page={page} />
        </div>
        <div className="syrep-col">
          <WhatIfPanel page={page} />
          <WithoutPredict page={page} />
        </div>
      </Workspace>
    </>
  );
}
