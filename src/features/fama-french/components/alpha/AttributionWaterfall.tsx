import { WaterfallChart } from "../../../../components/charts";
import { useI18n } from "../../../../i18n";
import { isSignificant } from "../../alpha.math";
import type { AlphaTabModel } from "../../useAlphaTab";

const pct = (v: number) => `${v < 0 ? "−" : ""}${Math.abs(v * 100).toFixed(1)}%`;

/// Where the fund's annual excess return comes from: alpha first, then each factor's beta times its premium.
export default function AttributionWaterfall({ m }: { m: AlphaTabModel }) {
  const { t } = useI18n();
  const { fit } = m;
  const words = t(isSignificant(fit.alphaT) ? "ffmSignificant" : "ffmNotSignificant");
  return (
    <>
      <WaterfallChart steps={m.steps} height={260} valueFormat={pct} ariaLabel={t("ffmWaterfallAria")} />
      <p className="ffm-alpha-words" role="status">
        {t("ffmAlphaWords", { alpha: pct(fit.alphaAnnual), t: fit.alphaT.toFixed(1), words })}
      </p>
    </>
  );
}
