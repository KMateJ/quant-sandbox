import { PageHeader } from "../../../components/layout";
import { SegmentedControl } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import FragilityPanel from "../shocks/components/FragilityPanel";
import RescueView from "../shocks/components/RescueView";
import SimulateView from "../shocks/components/SimulateView";
import type { ShockMode } from "../shocks/shocks.url";
import { useShocksPage } from "../shocks/useShocksPage";

/// Shock simulation page: fail an institution or crash an asset class and play the contagion, then the rescue
/// game and the robust-yet-fragile sweep.
export default function ShocksPage() {
  const { t } = useI18n();
  const page = useShocksPage();
  const { url, setUrl } = page;
  return (
    <>
      <PageHeader
        title={t("syrShockTitle")}
        description={t("syrShockDesc")}
        actions={
          <>
            <SegmentedControl<ShockMode>
              ariaLabel={t("syrShockModeAria")}
              value={url.mode}
              onChange={(mode) => setUrl({ mode })}
              options={[
                { value: "simulate", label: t("syrShockModeSimulate") },
                { value: "rescue", label: t("syrShockModeRescue") },
                { value: "fragile", label: t("syrShockModeFragile") },
              ]}
            />
            <button type="button" className="preset-btn" onClick={page.reset}>{t("syrShockReset")}</button>
          </>
        }
      />
      {url.mode === "simulate" && <SimulateView page={page} />}
      {url.mode === "rescue" && <RescueView page={page} />}
      {url.mode === "fragile" && <FragilityPanel seed={url.seed} />}
    </>
  );
}
