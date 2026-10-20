import { useEffect, useRef, type CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import { useI18n } from "../../i18n";
import type { ModuleSubNavItem } from "../../modules/registry";
import { revealInScroller } from "./useActiveIndicator";

/// Nested links under the active sidebar module (e.g. studio lessons, guide lessons).
/// Rows fade in one after another on open; the current one is kept in view as the route changes.
export default function SideSubNav({ items, numberClass }: { items: ModuleSubNavItem[]; numberClass?: (itemId: string) => string | undefined }) {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    revealInScroller(ref.current?.querySelector<HTMLElement>(".side-subrow.active") ?? null);
  }, [pathname]);

  return (
    <div className="side-subtree" ref={ref}>
      {items.map((item, index) => {
        const active = item.to === pathname;
        const label = t(item.labelKey);
        return (
          <Link
            key={item.id}
            to={item.to}
            className={active ? "side-subrow active" : "side-subrow"}
            aria-current={active ? "page" : undefined}
            title={label}
            style={{ "--i": Math.min(index, 12) } as CSSProperties}
          >
            {item.prefix ? <span className={["side-sub-number", numberClass?.(item.id)].filter(Boolean).join(" ")}>{item.prefix}</span> : null}
            <span className="side-sub-label">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
