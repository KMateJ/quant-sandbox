import { useCallback } from "react";
import { useI18n } from "../../../../i18n";
import { num } from "../../deskFormat";
import type { SetupRow } from "../../missionSetup";

/// Turns a structured setup row into its label and value text.
export function useSetupText() {
  const { t } = useI18n();
  return useCallback(
    (row: SetupRow): { label: string; value: string } => {
      switch (row.kind) {
        case "book": {
          const side = t(row.vars.side === "long" ? "hdMsSideLong" : "hdMsSideShort");
          const value = row.vars.type === "S"
            ? t("hdMsSetupBookStock", { side, qty: row.vars.qty })
            : t("hdMsSetupBookValue", { side, qty: row.vars.qty, strike: row.vars.strike, type: row.vars.type });
          return { label: t("hdMsSetupBook"), value };
        }
        case "spot": return { label: t("hdMsSetupSpot"), value: num(row.vars.spot, 2) };
        case "impliedVol": return { label: t("hdMsSetupImpliedVol"), value: `${num(row.vars.iv, 1)}%` };
        case "realizedVol": return { label: t("hdMsSetupRealizedVol"), value: t("hdMsSetupRealizedHidden") };
        case "horizon": return { label: t("hdMsSetupHorizon"), value: t("hdMsSetupHorizonValue", row.vars) };
        case "band": return { label: t("hdMsSetupBand"), value: t("hdMsSetupBandValue", row.vars) };
        case "ticketFee": return { label: t("hdMsSetupTicketFee"), value: t("hdMsSetupTicketFeeValue", row.vars) };
        case "tradeLimit": return { label: t("hdMsSetupTradeLimit"), value: t("hdMsSetupTradeLimitValue", row.vars) };
        case "gap": return { label: t("hdMsSetupGap"), value: t("hdMsSetupGapValue", { ...row.vars, size: num(row.vars.size, 0) }) };
        case "ivPath": return { label: t("hdMsSetupIvPath"), value: t("hdMsSetupIvPathValue", { ...row.vars, iv: num(row.vars.iv, 0) }) };
        case "physical": return { label: t("hdMsSetupSettlement"), value: t("hdMsSetupPhysical") };
      }
    },
    [t],
  );
}
