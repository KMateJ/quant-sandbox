import { NavLink } from "react-router-dom";
import { useI18n } from "../../i18n";
import {
  CATEGORY_LABEL_KEYS,
  CATEGORY_ORDER,
  modulesInCategory,
} from "../../modules/registry";

/// Mobile navigation drawer: categories and their modules from the registry.
export default function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useI18n();
  if (!open) return null;

  return (
    <div className="mobile-nav" role="dialog" aria-modal="true">
      <button
        type="button"
        className="mobile-nav-backdrop"
        aria-label="Close navigation"
        onClick={onClose}
      />
      <nav className="mobile-nav-panel" aria-label="Main navigation">
        <NavLink to="/" end className="mobile-nav-home">
          {t("navHome")}
        </NavLink>
        {CATEGORY_ORDER.map((cat) => {
          const items = modulesInCategory(cat);
          if (!items.length) return null;
          return <MobileNavGroup key={cat} category={cat} />;
        })}
      </nav>
    </div>
  );
}

function MobileNavGroup({ category }: { category: (typeof CATEGORY_ORDER)[number] }) {
  const { t } = useI18n();
  const items = modulesInCategory(category);
  return (
    <div className="mobile-nav-group">
      <div className="mobile-nav-label">{t(CATEGORY_LABEL_KEYS[category])}</div>
      {items.map((m) => (
        <NavLink
          key={m.id}
          to={m.path}
          end={m.end}
          className={({ isActive }) =>
            isActive ? "mobile-nav-item active" : "mobile-nav-item"
          }
        >
          {t(m.navKey)}
        </NavLink>
      ))}
    </div>
  );
}
