import { useMemo } from "react";
import { EventLog } from "../../../components/game";
import { useI18n } from "../../../i18n";
import { eventText } from "../eventText";
import type { AlmDeskModel } from "../useAlmDesk";

/// Newest-first log of shocks, trades, maturities, misses and liability changes.
export default function AlmEvents({ desk }: { desk: AlmDeskModel }) {
  const { t } = useI18n();
  const { events } = desk.state;
  const rows = useMemo(() => [...events].reverse().map((e) => eventText(e, t)), [events, t]);
  return <EventLog id="almd-events" title={t("almdEventsTitle")} rows={rows} />;
}
