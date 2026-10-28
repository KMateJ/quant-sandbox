import { Panel } from "../../../../components/layout";
import { SegmentedControl } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import type { Channels } from "../../engine/systemic.types";
import { encodeChannels, decodeChannels, NO_FAIL } from "../shocks.math";
import type { ShocksPageState } from "../useShocksPage";
import { useGraphText } from "../useGraphText";
import AssetShockBars from "./AssetShockBars";
import ChannelSwitches from "./ChannelSwitches";
import ScenarioPresets from "./ScenarioPresets";
import ShockPreview from "./ShockPreview";

type Shape = "instant" | "gradual";

/// Shock setup: which institution fails, how far each asset class crashes and how, and the contagion channels.
export default function ShockSetup({ page }: { page: ShocksPageState }) {
  const { t } = useI18n();
  const { nameOf } = useGraphText();
  const { url, setUrl, fail, net } = page;
  const failedInst = net.institutions.find((i) => i.id === fail);
  const toggle = (key: keyof Channels) => setUrl({ ch: encodeChannels({ ...decodeChannels(url.ch), [key]: !decodeChannels(url.ch)[key] }) });
  return (
    <Panel title={t("syrShockSetup")}>
      <h3 className="syr-shock-sub">{t("syrShockScenarios")}</h3>
      <ScenarioPresets page={page} />
      <div className="syr-shock-fail">
        <p>{failedInst ? t("syrShockFailed", { name: nameOf(failedInst) }) : t("syrShockFailHint")}</p>
        {failedInst && <button type="button" className="preset-btn" onClick={() => setUrl({ fail: NO_FAIL })}>{t("syrShockNoFail")}</button>}
      </div>
      <h3 className="syr-shock-sub">{t("syrShockCrash")}</h3>
      <AssetShockBars drops={url.drop} onDrop={page.setDrop} />
      <SegmentedControl<Shape>
        ariaLabel={t("syrShockShapeAria")}
        value={url.shape}
        onChange={(shape) => setUrl({ shape })}
        options={[{ value: "instant", label: t("syrShockInstant") }, { value: "gradual", label: t("syrShockGradual") }]}
      />
      <ShockPreview page={page} />
      <h3 className="syr-shock-sub">{t("syrShockChannels")}</h3>
      <ChannelSwitches channels={decodeChannels(url.ch)} onToggle={toggle} />
    </Panel>
  );
}
