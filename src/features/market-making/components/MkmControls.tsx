import SliderField from "../../../components/SliderField";
import { ControlGroup } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import type { MarketMakingLab } from "../useMarketMakingLab";

const pct = (v: number) => `${Math.round(v * 100)}%`;
const signedPct = (v: number) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.round(Math.abs(v) * 100)}%`;

/// Sidebar: the customer flow (secondary to the rail) and the income formula.
export default function MkmControls({ lab }: { lab: MarketMakingLab }) {
  const { t } = useI18n();
  const { url, setUrl } = lab;
  const fixed = url.mode === "challenge";
  return (
    <>
      <ControlGroup label={t("mkmFlow")}>
        <SliderField label={t("mkmLambda")} min={1} max={10} step={0.5} value={url.lambda} onChange={(lambda) => setUrl({ lambda })} formatValue={(v) => `${v}/s`} />
        <SliderField label={t("mkmK")} min={0.2} max={1.5} step={0.05} value={url.k} onChange={(k) => setUrl({ k })} formatValue={(v) => v.toFixed(2)} />
        <SliderField label={t("mkmSigma")} min={0.2} max={3} step={0.1} value={url.sigma} onChange={(sigma) => setUrl({ sigma })} formatValue={(v) => `${v.toFixed(1)}¢`} />
        {fixed ? (
          <p className="mkm-caption">{t("mkmChallengeFlow")}</p>
        ) : (
          <>
            <SliderField label={t("mkmInformed")} min={0} max={0.5} step={0.05} value={url.informed} onChange={(informed) => setUrl({ informed })} formatValue={pct} />
            <SliderField label={t("mkmImbalance")} min={-0.5} max={0.5} step={0.05} value={url.imbalance} onChange={(imbalance) => setUrl({ imbalance })} formatValue={signedPct} />
          </>
        )}
      </ControlGroup>
      <ControlGroup label={t("mkmFormulaTitle")}>
        <p className="mkm-formula">{t("mkmFormula")}</p>
        <p className="mkm-caption">{t("mkmFormulaNote")}</p>
      </ControlGroup>
    </>
  );
}
