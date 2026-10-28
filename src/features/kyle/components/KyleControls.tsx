import SliderField from "../../../components/SliderField";
import { ControlGroup, SegmentedControl } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { cCoef, expectedOptimalProfit } from "../kyle.math";
import type { KylePlay } from "../kyle.url";
import type { KyleLab } from "../useKyleLab";
import { fmtLambda, fmtMoney } from "./kyleFormat";

/// Sidebar: auctions, noise volume, plan/live play and the model with its numbers filled in.
export default function KyleControls({ lab }: { lab: KyleLab }) {
  const { t } = useI18n();
  const { url, setUrl, params, lambda } = lab;
  return (
    <>
      <ControlGroup label={t("kylSetup")}>
        <SliderField label={t("kylAuctions")} min={1} max={20} step={1} value={url.n} onChange={(n) => setUrl({ n })} />
        <SliderField label={t("kylNoise")} min={200} max={4000} step={100} value={url.s} onChange={(s) => setUrl({ s })} />
        {url.mode !== "challenge" && (
          <SegmentedControl<KylePlay>
            ariaLabel={t("kylPlayLabel")}
            options={[
              { value: "plan", label: t("kylPlayPlan") },
              { value: "live", label: t("kylPlayLive") },
            ]}
            value={url.play}
            onChange={(play) => setUrl({ play })}
          />
        )}
      </ControlGroup>
      <ControlGroup label={t("kylModelTitle")}>
        <p className="kyl-formula">{t("kylFormulaPrice", { lambda: fmtLambda(lambda) })}</p>
        <p className="kyl-formula">{t("kylFormulaOrder")}</p>
        <p className="kyl-formula">
          {t("kylFormulaProfit", { c: cCoef(params.n).toFixed(3), exp: fmtMoney(expectedOptimalProfit(params.sigmaV, params, lambda)) })}
        </p>
        <p className="kyl-caption">{t("kylFormulaNote", { sv: params.sigmaV, s: params.s.toLocaleString("en-US") })}</p>
      </ControlGroup>
    </>
  );
}
