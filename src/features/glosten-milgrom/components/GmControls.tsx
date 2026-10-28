import SliderField from "../../../components/SliderField";
import { ControlGroup, SegmentedControl } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { askAt, bidAt, pBuy } from "../glostenMilgrom.math";
import type { GlostenMilgromLab } from "../useGlostenMilgromLab";
import { fmt3 } from "./gmChart";

const pct = (v: number) => `${Math.round(v * 100)}%`;

/// Sidebar: model inputs and the ask formula with the current numbers filled in.
export default function GmControls({ lab }: { lab: GlostenMilgromLab }) {
  const { t } = useI18n();
  const { url, setUrl, params, belief } = lab;
  const b1 = pBuy(1, params.pi);
  const b0 = pBuy(0, params.pi);
  return (
    <>
      <ControlGroup label={t("glmModel")}>
        <SliderField label={t("glmPi")} min={0} max={0.95} step={0.01} value={url.pi} onChange={(pi) => setUrl({ pi })} formatValue={pct} />
        <SliderField label={t("glmPrior")} min={0.05} max={0.95} step={0.01} value={url.prior} onChange={(prior) => setUrl({ prior })} formatValue={(v) => v.toFixed(2)} />
        <SliderField label={t("glmTradesN")} min={10} max={80} step={1} value={url.n} onChange={(n) => setUrl({ n })} />
        <SegmentedControl
          ariaLabel={t("glmTrueValue")}
          options={[
            { value: "0", label: t("glmValue0") },
            { value: "1", label: t("glmValue1") },
          ]}
          value={url.trueV}
          onChange={(trueV) => setUrl({ trueV })}
        />
      </ControlGroup>
      <ControlGroup label={t("glmFormulaTitle")}>
        <p className="glm-formula">{t("glmFormulaAsk", { mu: fmt3(belief), b1: fmt3(b1), b0: fmt3(b0), ask: fmt3(askAt(belief, params.pi)) })}</p>
        <p className="glm-formula">{t("glmFormulaBid", { mu: fmt3(belief), s1: fmt3(1 - b1), s0: fmt3(1 - b0), bid: fmt3(bidAt(belief, params.pi)) })}</p>
        <p className="glm-caption">{t("glmFormulaNote")}</p>
      </ControlGroup>
    </>
  );
}
