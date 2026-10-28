import { useMemo } from "react";
import NetworkGraph from "../../../../components/charts/network/NetworkGraph";
import type { NetLabels } from "../../../../components/charts/network/network.types";
import { Panel } from "../../../../components/layout";
import { PlaybackControls } from "../../../../components/playback";
import { useI18n } from "../../../../i18n";
import { graphEdges, graphNodes } from "../../shocks/shockGraph.logic";
import { evKey } from "../episodes.format";
import type { EpisodesPage } from "../useEpisodesPage";

/// The stylised network at the cursor day: statuses from the what-if run, the current event's actor selected.
export default function EpisodeGraph({ page }: { page: EpisodesPage }) {
  const { t } = useI18n();
  const { episode, net, whatIf, playback, current } = page;
  const event = episode.events[current];
  const labels: NetLabels = useMemo(() => ({
    zoomIn: t("netZoomIn"), zoomOut: t("netZoomOut"), fit: t("netFit"), zoomGroup: t("netZoomGroup"),
    status: { ok: t("netStatusOk"), stressed: t("netStatusStressed"), critical: t("netStatusCritical"), failed: t("netStatusFailed") },
    connectHint: t("netConnectHint"), connecting: t("netConnecting"),
  }), [t]);
  const status = whatIf.days[playback.step].status;
  const nodes = useMemo(
    () => graphNodes(net, (i) => i.id.toUpperCase(), { status }),
    [net, status],
  );
  const edges = useMemo(() => graphEdges(net), [net]);
  const role = event ? t(`syrEpRole_${event.role}`) : "";
  const caption = !event ? t("syrEpNoEvent") : event.actor
    ? t(evKey(event.key, "actor"))
    : t("syrEpMarketCaption", { role });

  return (
    <Panel
      dominant
      flush
      title={t("syrEpGraphTitle")}
      footer={
        <>
          <p className="syrep-caption">{caption}</p>
          <p className="syrep-caption">{t("syrEpLabelKey")}</p>
          <PlaybackControls playback={playback} steps={page.steps} label={t("syrEpDay")} showStepButtons showSpeed formatStep={(d) => t("syrEpDayValue", { day: d })} />
        </>
      }
    >
      <NetworkGraph
        nodes={nodes}
        edges={edges}
        height={520}
        seed={episode.seed}
        layoutKey={episode.id}
        selectedId={event?.actor ?? null}
        ariaLabel={t("syrEpGraphAria")}
        labels={labels}
      />
    </Panel>
  );
}
