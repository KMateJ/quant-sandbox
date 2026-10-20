import { useState } from "react";
import { useI18n } from "../../i18n";
import { modulesInCategory } from "../../modules/registry";
import { LAB_CATEGORIES, LAB_COUNT } from "./home.data";
import { needsGuideFiller } from "./home.model";
import HomeLabCategory from "./HomeLabCategory";
import HomeLabsFilter, { type LabFilter } from "./HomeLabsFilter";

/// Labs index: filter by area and one bento per area.
export default function HomeLabs() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<LabFilter>("all");

  const sections = LAB_CATEGORIES.map((category, index) => ({ category, index, mods: modulesInCategory(category) })).filter(
    (s) => filter === "all" || filter === s.category,
  );

  return (
    <section id="labs" className="home-labs">
      <header className="home-section-head">
        <div>
          <p className="home-eyebrow">{t("homeLabsEyebrow")}</p>
          <h2 className="home-h2">{t("homeLabsTitle", { n: LAB_COUNT })}</h2>
        </div>
        <HomeLabsFilter value={filter} onChange={setFilter} />
      </header>
      {sections.map((s) => (
        <HomeLabCategory
          key={s.category}
          category={s.category}
          index={s.index}
          mods={s.mods}
          guideFiller={needsGuideFiller(s.mods.length)}
        />
      ))}
    </section>
  );
}
