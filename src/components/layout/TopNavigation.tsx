import { NavLink } from "react-router-dom";
import { useI18n } from "../../i18n";
import {
  CATEGORY_LABEL_KEYS,
  CATEGORY_ORDER,
  modulesInCategory,
} from "../../modules/registry";
import ThemeToggle from "../ui/ThemeToggle";
import LanguageMenu from "../ui/LanguageMenu";
import { useActiveModule } from "./useActiveModule";

type Props = {
  navOpen: boolean;
  onToggleNav: () => void;
};

export default function TopNavigation({ navOpen, onToggleNav }: Props) {
  const { t } = useI18n();
  const { activeCategory } = useActiveModule();

  return (
    <header className="topnav">
      <div className="topnav-inner">
        <NavLink to="/" end className="brand">
          {t("brandTitle")}
        </NavLink>

        <nav className="cat-tabs" aria-label="Categories">
          {CATEGORY_ORDER.map((cat) => {
            const first = modulesInCategory(cat)[0];
            if (!first) return null;
            const active = cat === activeCategory;
            return (
              <NavLink
                key={cat}
                to={first.path}
                className={active ? "cat-tab active" : "cat-tab"}
              >
                {t(CATEGORY_LABEL_KEYS[cat])}
              </NavLink>
            );
          })}
        </nav>

        <div className="topnav-controls">
          <ThemeToggle />
          <LanguageMenu />
          <button
            type="button"
            className="nav-toggle"
            aria-label={t("navMenuLabel")}
            aria-expanded={navOpen}
            aria-haspopup="menu"
            onClick={onToggleNav}
          >
            <span className="nav-toggle-bars" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
