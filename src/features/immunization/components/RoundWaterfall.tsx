import { WaterfallChart, type WaterfallStep } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import { moneyShort } from "../immunization.math";
import type { RoundResult } from "../immunization.types";

/// "Why did the surplus move?" for one round: time (carry), the rate move, convexity and trading cost.
export default function RoundWaterfall({ result }: { result: RoundResult }) {
  const { t } = useI18n();
  const { carry, rate, convexity, cost } = result.attribution;
  const start = result.surplus - (carry + rate + convexity + cost);
  const steps: WaterfallStep[] = [
    { key: "start", label: t("imStart"), value: start, kind: "total" },
    { key: "carry", label: t("imCarry"), value: carry },
    { key: "rate", label: t("imRateEffect"), value: rate },
    { key: "convexity", label: t("imConvexityEffect"), value: convexity },
    { key: "cost", label: t("imTradeCost"), value: cost },
    { key: "end", label: t("imEnd"), value: result.surplus, kind: "total" },
  ];
  return (
    <div className="im-waterfall">
      <h4 className="im-subtitle">{t("imWaterfall", { n: result.round })}</h4>
      <WaterfallChart steps={steps} ariaLabel={t("imWaterfallAria")} valueFormat={moneyShort} height={220} />
    </div>
  );
}
