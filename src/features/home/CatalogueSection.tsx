import { NavLink } from "react-router-dom";
import { useI18n } from "../../i18n";
import ModuleIcon from "../../components/layout/ModuleIcon";
import {
  CATEGORY_LABEL_KEYS,
  CATEGORY_DESC_KEYS,
  CATEGORY_ACCENT,
  type ModuleCategory,
  type ModuleDef,
  type ModuleStatus,
} from "../../modules/registry";

const STATUS_KEY: Partial<Record<ModuleStatus, "statusBeta" | "statusPlanned">> = {
  beta: "statusBeta",
  planned: "statusPlanned",
};

type Props = { category: ModuleCategory; mods: ModuleDef[] };

/// One category block in the home catalogue: heading, description and its module cards.
export default function CatalogueSection({ category, mods }: Props) {
  const { t } = useI18n();
  const count = mods.length;
  const countWord = count === 1 ? t("moduleCountOne") : t("moduleCountMany");

  return (
    <section
      className="catalogue-section"
      style={{ ["--mod-accent" as string]: CATEGORY_ACCENT[category] }}
    >
      <header className="catalogue-section-head">
        <span className="catalogue-section-title">{t(CATEGORY_LABEL_KEYS[category])}</span>
        <span className="catalogue-section-desc">{t(CATEGORY_DESC_KEYS[category])}</span>
        <span className="catalogue-section-count">{`${count} ${countWord}`}</span>
      </header>
      <div className="mod-grid">
        {mods.map((m) => {
          const statusKey = STATUS_KEY[m.status];
          return (
            <NavLink key={m.id} to={m.path} end={m.end} className="mod-card">
              <span className="mod-icon" aria-hidden="true">
                <ModuleIcon id={m.icon ?? m.id} />
              </span>
              <span className="mod-name">{t(m.navKey)}</span>
              {statusKey ? <span className="mod-badge">{t(statusKey)}</span> : null}
            </NavLink>
          );
        })}
      </div>
    </section>
  );
}
