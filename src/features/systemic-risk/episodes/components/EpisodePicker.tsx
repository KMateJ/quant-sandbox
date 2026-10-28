import { useI18n } from "../../../../i18n";
import { EPISODE_IDS, type EpisodeId } from "../episodes.types";

type Props = { value: EpisodeId; onPick: (id: EpisodeId) => void };

/// Four rows, title and period; the selected row is tinted.
export default function EpisodePicker({ value, onPick }: Props) {
  const { t } = useI18n();
  return (
    <ul className="syrep-picker" aria-label={t("syrEpPickerAria")}>
      {EPISODE_IDS.map((id) => (
        <li key={id}>
          <button type="button" className={id === value ? "syrep-pick is-active" : "syrep-pick"} aria-pressed={id === value} onClick={() => onPick(id)}>
            <span className="syrep-pick-title">{t(`syrEpEp_${id}_title`)}</span>
            <span className="syrep-pick-period">{t(`syrEpEp_${id}_period`)}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
