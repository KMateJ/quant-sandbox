import SwitchRow from "../../../../components/SwitchRow";
import { useI18n, type TranslationKey } from "../../../../i18n";
import type { Channels } from "../../engine/systemic.types";
import { CHANNEL_KEYS } from "../shocks.math";

type Props = { channels: Channels; onToggle: (key: keyof Channels) => void };

/// One on/off switch per contagion channel, each with a one-line explanation.
export default function ChannelSwitches({ channels, onToggle }: Props) {
  const { t } = useI18n();
  return (
    <div className="syr-shock-channels">
      {CHANNEL_KEYS.map((key) => {
        const on = channels[key];
        return (
          <div key={key} className="syr-shock-channel">
            <div className="syr-shock-channel-name">{t(`syrShockCh_${key}` as TranslationKey)}</div>
            <p>{t(`syrShockChHelp_${key}` as TranslationKey)}</p>
            <SwitchRow groups={[{
              key,
              options: [
                { label: t("syrShockOn"), active: on, onSelect: () => !on && onToggle(key) },
                { label: t("syrShockOff"), active: !on, onSelect: () => on && onToggle(key) },
              ],
            }]} />
          </div>
        );
      })}
    </div>
  );
}
