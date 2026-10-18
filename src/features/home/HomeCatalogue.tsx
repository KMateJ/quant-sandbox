import { useMemo, useState } from "react";
import { useI18n } from "../../i18n";
import SectionCard from "../../components/SectionCard";
import { CATEGORY_ORDER, modulesInCategory } from "../../modules/registry";
import CatalogueSection from "./CatalogueSection";

/// Registry-driven, searchable module catalogue grouped by area.
export default function HomeCatalogue() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const sections = useMemo(
    () =>
      CATEGORY_ORDER.map((category) => ({
        category,
        mods: modulesInCategory(category).filter(
          (m) => !q || t(m.navKey).toLowerCase().includes(q)
        ),
      })).filter((s) => s.mods.length > 0),
    [q, t]
  );
  const total = sections.reduce((n, s) => n + s.mods.length, 0);

  return (
    <SectionCard title={t("exploreTitle")} subtitle={t("exploreSubtitle")}>
      <div className="catalogue-search">
        <span className="catalogue-search-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" />
          </svg>
        </span>
        <input
          type="search"
          className="catalogue-search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("homeSearchPlaceholder")}
          aria-label={t("homeSearchAria")}
        />
        {q ? <span className="catalogue-count">{t("homeMatchCount", { n: total })}</span> : null}
      </div>

      {sections.length === 0 ? (
        <p className="catalogue-empty">{t("homeNoResults", { query: query.trim() })}</p>
      ) : (
        <div className="catalogue-sections">
          {sections.map((s) => (
            <CatalogueSection key={s.category} category={s.category} mods={s.mods} />
          ))}
        </div>
      )}
    </SectionCard>
  );
}
