import { useI18n } from "../../i18n";
import { CATEGORY_LABEL_KEYS } from "../../modules/registry";
import { LAB_CATEGORIES, type LabCategory } from "./home.data";

export type LabFilter = LabCategory | "all";

/// Row of area filters (All + each area); the active one is underlined.
export default function HomeLabsFilter({ value, onChange }: { value: LabFilter; onChange: (f: LabFilter) => void }) {
  const { t } = useI18n();
  const options: { id: LabFilter; label: string }[] = [
    { id: "all", label: t("homeFilterAll") },
    ...LAB_CATEGORIES.map((c) => ({ id: c, label: t(CATEGORY_LABEL_KEYS[c]) })),
  ];

  return (
    <div className="home-filters" role="group" aria-label={t("homeFilterAria")}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          className="home-filter"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
