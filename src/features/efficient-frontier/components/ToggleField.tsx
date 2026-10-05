import { useI18n } from "../../../i18n";

type Props = {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
};

/// Compact label + On/Off segmented switch (no pills), for boolean constraints.
export default function ToggleField({ label, value, onChange }: Props) {
  const { t } = useI18n();
  return (
    <div className="opt-toggle">
      <span className="opt-toggle-label">{label}</span>
      <div className="segmented" role="group" aria-label={label}>
        <button type="button" className={value ? "tab active" : "tab"} aria-pressed={value} onClick={() => onChange(true)}>
          {t("optOn")}
        </button>
        <button type="button" className={!value ? "tab active" : "tab"} aria-pressed={!value} onClick={() => onChange(false)}>
          {t("optOff")}
        </button>
      </div>
    </div>
  );
}
