import { useI18n, type TranslationKey } from "../../../../i18n";
import { formatDrops } from "../shocks.math";
import { SCENARIO_IDS, scenarioPatch } from "../shockPreview.math";
import type { ShocksPageState } from "../useShocksPage";

/// One-click starting scenarios; the active one is marked when the setup matches it exactly.
export default function ScenarioPresets({ page }: { page: ShocksPageState }) {
  const { t } = useI18n();
  const { url, setUrl, net } = page;
  return (
    <div className="syr-shock-scenarios" role="group" aria-label={t("syrShockScnAria")}>
      {SCENARIO_IDS.map((id) => {
        const patch = scenarioPatch(id, net);
        const active = formatDrops(patch.drop) === formatDrops(url.drop) && patch.shape === url.shape && patch.fail === url.fail;
        return (
          <button key={id} type="button" className={`preset-btn${active ? " preset-btn--active" : ""}`} aria-pressed={active}
            onClick={() => setUrl(patch)}>
            {t(`syrShockScn_${id}` as TranslationKey)}
          </button>
        );
      })}
    </div>
  );
}
