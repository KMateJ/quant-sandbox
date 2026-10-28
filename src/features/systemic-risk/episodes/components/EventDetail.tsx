import { Panel } from "../../../../components/layout";
import { useI18n } from "../../../../i18n";
import { evKey, formatEventDate } from "../episodes.format";
import type { EpisodesPage } from "../useEpisodesPage";

/// The current event's text, or the episode summary before the first event.
export default function EventDetail({ page }: { page: EpisodesPage }) {
  const { t, language } = useI18n();
  const { episode, current } = page;
  const event = episode.events[current];
  return (
    <Panel title={event ? t(evKey(event.key, "title")) : t(`syrEpEp_${episode.id}_title`)}>
      {event && (
        <p className="syrep-date"><time dateTime={event.date}>{formatEventDate(event.date, language)}</time></p>
      )}
      <p>{event ? t(evKey(event.key, "text")) : t(`syrEpEp_${episode.id}_summary`)}</p>
      <p className="syrep-shows"><strong>{t("syrEpShows")}</strong> {t(`syrEpEp_${episode.id}_shows`)}</p>
      <p className="syrep-note">{t("syrEpModelNote")}</p>
    </Panel>
  );
}
