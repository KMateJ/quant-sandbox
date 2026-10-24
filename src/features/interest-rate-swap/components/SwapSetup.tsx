import { Panel } from "../../../components/layout";
import Tabs from "../../../components/ui/Tabs";
import { useI18n, type TranslationKey } from "../../../i18n";
import { PRESET_IDS } from "../../yield-curve/presets";
import type { PresetId } from "../../yield-curve/yieldCurve.types";
import { FREQS, SIDES } from "../swap.url";
import { rate } from "../swapFormat";
import type { SwapModel } from "../useSwap";

/// Swap terms (notional, tenor, payment frequency, side), the curve preset and the lock-the-rate action.
export default function SwapSetup({ lab }: { lab: SwapModel }) {
  const { t } = useI18n();
  const { url, setUrl, locked, par, spec } = lab;
  return (
    <Panel title={t("irsSetup")}>
      <div className="irs-setup">
        <label className="irs-field">
          <span>{t("irsNotional")}</span>
          <input type="number" min={100000} max={1000000000} step={1000000} value={url.notional}
            onChange={(e) => e.target.value !== "" && setUrl({ notional: e.target.valueAsNumber })} />
        </label>
        <label className="irs-field">
          <span>{t("irsTenor", { n: url.tenor })}</span>
          <input type="range" min={1} max={10} step={1} value={url.tenor} onChange={(e) => setUrl({ tenor: Number(e.target.value) })} />
        </label>
        <div className="irs-field">
          <span>{t("irsFreq")}</span>
          <Tabs segmented ariaLabel={t("irsFreq")} value={url.freq} onChange={(freq) => setUrl({ freq })}
            items={FREQS.map((id) => ({ id, label: t(`irsFreq_${id}` as TranslationKey) }))} />
        </div>
        <div className="irs-field">
          <span>{t("irsSide")}</span>
          <Tabs segmented ariaLabel={t("irsSide")} value={url.side} onChange={(side) => setUrl({ side })}
            items={SIDES.map((id) => ({ id, label: t(`irsSide_${id}` as TranslationKey) }))} />
        </div>
        <label className="irs-field">
          <span>{t("irsCurve")}</span>
          <select value={lab.preset} onChange={(e) => lab.setPreset(e.target.value as PresetId)}>
            {PRESET_IDS.map((id) => <option key={id} value={id}>{t(`irsPreset_${id}` as TranslationKey)}</option>)}
            {lab.preset === "custom" && <option value="custom">{t("irsPreset_custom")}</option>}
          </select>
        </label>
      </div>
      <dl className="irs-rates">
        <div><dt>{t("irsParRate")}</dt><dd>{rate(par)}</dd></div>
        <div><dt>{t("irsFixedRate")}</dt><dd>{rate(spec.fixedRate)}</dd></div>
      </dl>
      <p className="irs-hint">{t(locked ? "irsLockedHint" : "irsParHint")}</p>
      <button type="button" className="irs-lock" aria-pressed={locked} onClick={locked ? lab.unlock : lab.lock} disabled={!locked && !lab.curve}>
        {t(locked ? "irsUnlock" : "irsLock")}
      </button>
    </Panel>
  );
}
