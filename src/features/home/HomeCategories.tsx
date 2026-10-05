import { NavLink } from "react-router-dom";
import { useI18n } from "../../i18n";
import ModuleIcon from "../../components/layout/ModuleIcon";
import SectionCard from "../../components/SectionCard";
import {
  CATEGORY_ORDER,
  CATEGORY_LABEL_KEYS,
  CATEGORY_DESC_KEYS,
  CATEGORY_ACCENT,
  modulesInCategory,
} from "../../modules/registry";

/// Registry-driven overview of every module area, reflecting the full catalogue.
export default function HomeCategories() {
  const { t } = useI18n();

  const cards = CATEGORY_ORDER.map((category) => {
    const mods = modulesInCategory(category);
    if (mods.length === 0) return null;
    const count = mods.length;
    const countWord = count === 1 ? t("moduleCountOne") : t("moduleCountMany");
    return (
      <NavLink
        key={category}
        to={mods[0].path}
        className="cat-card"
        style={{ ["--mod-accent" as string]: CATEGORY_ACCENT[category] }}
      >
        <span className="cat-icon" aria-hidden="true">
          <ModuleIcon id={mods[0].id} />
        </span>
        <span className="cat-body">
          <span className="cat-title">{t(CATEGORY_LABEL_KEYS[category])}</span>
          <span className="cat-desc">{t(CATEGORY_DESC_KEYS[category])}</span>
        </span>
        <span className="cat-count">{`${count} ${countWord}`}</span>
      </NavLink>
    );
  });

  return (
    <SectionCard title={t("categoriesTitle")} subtitle={t("categoriesSubtitle")}>
      <div className="cat-grid">{cards}</div>
    </SectionCard>
  );
}
