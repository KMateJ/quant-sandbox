import { useCallback, useMemo } from "react";
import type { NetLabels } from "../../../components/charts/network/network.types";
import { useI18n, type TranslationKey } from "../../../i18n";
import type { Institution } from "../engine/systemic.types";

/// Chart labels and institution names ("Dealer bank A") for the network graph, from the i18n tables.
export function useGraphText() {
  const { t } = useI18n();
  const labels: NetLabels = useMemo(() => ({
    zoomIn: t("netZoomIn"), zoomOut: t("netZoomOut"), fit: t("netFit"), zoomGroup: t("netZoomGroup"),
    status: { ok: t("netStatusOk"), stressed: t("netStatusStressed"), critical: t("netStatusCritical"), failed: t("netStatusFailed") },
    connectHint: t("netConnectHint"), connecting: t("netConnecting"),
  }), [t]);
  const nameOf = useCallback((i: Institution) => `${t(`syrKind_${i.kind}` as TranslationKey)} ${i.tag}`, [t]);
  const shortOf = useCallback((i: Institution) => `${t(`syrShockShort_${i.kind}` as TranslationKey)} ${i.tag}`, [t]);
  return { labels, nameOf, shortOf };
}
