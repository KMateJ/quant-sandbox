import { AttributionBars, signedMoney } from "../../../components/game";
import { useI18n } from "../../../i18n";
import type { AlmDeskModel } from "../useAlmDesk";

const ZERO = { carry: 0, rate: 0, convexity: 0, cost: 0 };

/// Last year's surplus change split into carry, rates, convexity and costs.
export default function AlmAttribution({ desk }: { desk: AlmDeskModel }) {
  const { t } = useI18n();
  const a = desk.state.game.history.at(-1)?.attribution ?? ZERO;
  const row = (label: string, value: number) => ({ label, value, display: signedMoney(value) });
  return (
    <AttributionBars
      id="almd-attr"
      title={t("almdAttrTitle")}
      rows={[row(t("almdAttrCarry"), a.carry), row(t("almdAttrRate"), a.rate), row(t("almdAttrConvexity"), a.convexity), row(t("almdAttrCost"), a.cost)]}
      total={row(t("almdAttrTotal"), a.carry + a.rate + a.convexity + a.cost)}
    />
  );
}
