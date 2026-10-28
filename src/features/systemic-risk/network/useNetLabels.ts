import { useMemo } from "react";
import type { NetLabels } from "../../../components/charts/network/network.types";
import { useI18n } from "../../../i18n";

/// Translated strings for the generic network chart.
export function useNetLabels(): NetLabels {
  const { t } = useI18n();
  return useMemo(() => ({
    zoomIn: t("netZoomIn"), zoomOut: t("netZoomOut"), fit: t("netFit"), zoomGroup: t("netZoomGroup"),
    status: { ok: t("netStatusOk"), stressed: t("netStatusStressed"), critical: t("netStatusCritical"), failed: t("netStatusFailed") },
    connectHint: t("netConnectHint"), connecting: t("netConnecting"),
  }), [t]);
}
