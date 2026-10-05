import { NavLink } from "react-router-dom";
import { useI18n } from "../../i18n";
import ModuleIcon from "../../components/layout/ModuleIcon";
import SectionCard from "../../components/SectionCard";
import {
  CATEGORY_ORDER,
  CATEGORY_LABEL_KEYS,
  CATEGORY_ACCENT,
  modulesInCategory,
  type ModuleStatus,
} from "../../modules/registry";

const STATUS_KEY: Partial<Record<ModuleStatus, "statusBeta" | "statusPlanned">> = {
  beta: "statusBeta",
  planned: "statusPlanned",
};

/// Registry-driven Explore grid: every module grouped by category.
export default function HomeModules() {
  const { t } = useI18n();

  return (
    <SectionCard title={t("exploreTitle")} subtitle={t("exploreSubtitle")}>
      <div className="mod-explore">
        {CATEGORY_ORDER.map((category) => {
          const mods = modulesInCategory(category);
          if (mods.length === 0) return null;
          return (
            <div
              key={category}
              className="mod-group"
              style={{ ["--mod-accent" as string]: CATEGORY_ACCENT[category] }}
            >
              <div className="mod-group-label">{t(CATEGORY_LABEL_KEYS[category])}</div>
              <div className="mod-grid">
                {mods.map((m) => {
                  const statusKey = STATUS_KEY[m.status];
                  return (
                    <NavLink key={m.id} to={m.path} end={m.end} className="mod-card">
                      <span className="mod-icon" aria-hidden="true">
                        <ModuleIcon id={m.id} />
                      </span>
                      <span className="mod-name">{t(m.navKey)}</span>
                      {statusKey ? (
                        <span className="mod-badge">{t(statusKey)}</span>
                      ) : null}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
