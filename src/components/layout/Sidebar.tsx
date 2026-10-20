import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useI18n } from "../../i18n";
import { CATEGORY_LABEL_KEYS, modulesInCategory, type ModuleCategory } from "../../modules/registry";
import { useActiveModule } from "./useActiveModule";
import { useSidebarPin } from "./useSidebarPin";
import { useActiveIndicator } from "./useActiveIndicator";
import ConnectedGuides from "./ConnectedGuides";
import SideModuleRow from "./SideModuleRow";

/// Collapsible left rail: category label + module tree + Connected Guides.
/// Unpinned, it is an icon rail that opens as an overlay on hover or keyboard focus.
export default function Sidebar({ category }: { category: ModuleCategory }) {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const { activeModule } = useActiveModule();
  const { pinned, toggle } = useSidebarPin();
  // Explicit open/closed choices per module; without one, the active module is open (a guide track only on one of its lessons).
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const treeRef = useRef<HTMLElement>(null);
  const items = modulesInCategory(category);
  useActiveIndicator(treeRef, ".side-row.active", `${category}:${pathname}:${pinned}:${JSON.stringify(expanded)}`);

  const pinLabel = pinned ? t("navCollapseSidebar") : t("navExpandSidebar");

  return (
    <aside className={pinned ? "sidebar pinned" : "sidebar"} aria-label={t("navModulesAria")}>
      <div className="sidebar-inner">
        <div className="sidebar-head">
          <span className="side-section-label">{t(CATEGORY_LABEL_KEYS[category])}</span>
          <button
            type="button"
            className="sidebar-pin"
            aria-pressed={pinned}
            aria-label={pinLabel}
            aria-keyshortcuts="["
            title={`${pinLabel} ( [ )`}
            onClick={toggle}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        <nav className="side-tree" ref={treeRef}>
          <span className="side-indicator" aria-hidden="true" />
          {items.map((m) => {
            const active = m.id === activeModule?.id;
            const open = expanded[m.id] ?? (active && (m.category !== "guides" || pathname !== m.path));
            return (
              <SideModuleRow
                key={m.id}
                module={m}
                active={active}
                open={open}
                onToggle={() => setExpanded((prev) => ({ ...prev, [m.id]: !open }))}
              />
            );
          })}
        </nav>

        {activeModule && <ConnectedGuides moduleId={activeModule.id} ids={activeModule.relatedGuides} />}
      </div>
    </aside>
  );
}
