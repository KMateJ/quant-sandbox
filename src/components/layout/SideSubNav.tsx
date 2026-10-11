import { Link, useLocation } from "react-router-dom";
import { useI18n } from "../../i18n";
import type { ModuleSubNavItem } from "../../modules/registry";

/// Nested links under the active sidebar module (e.g. studio lessons).
export default function SideSubNav({ items }: { items: ModuleSubNavItem[] }) {
  const { t } = useI18n();
  const { pathname, search } = useLocation();
  const current = pathname + search;

  return (
    <div className="side-subtree">
      {items.map((item) => {
        const active = item.to === current;
        const label = t(item.labelKey);
        return (
          <Link
            key={item.id}
            to={item.to}
            className={active ? "side-subrow active" : "side-subrow"}
            aria-current={active ? "page" : undefined}
            title={label}
          >
            {item.prefix ? <span className="side-sub-number">{item.prefix}</span> : null}
            <span className="side-sub-label">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
