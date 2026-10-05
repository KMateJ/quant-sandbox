import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useI18n } from "../../i18n";
import {
  CATEGORY_LABEL_KEYS,
  modulesInCategory,
  type ModuleCategory,
  type ModuleStatus,
} from "../../modules/registry";
import { useActiveModule } from "./useActiveModule";
import ConnectedGuides from "./ConnectedGuides";
import ModuleIcon from "./ModuleIcon";

const STATUS_KEY: Partial<Record<ModuleStatus, "statusBeta" | "statusPlanned">> = {
  beta: "statusBeta",
  planned: "statusPlanned",
};

/// Collapsible left rail: category label + module tree + Connected Guides.
export default function Sidebar({ category }: { category: ModuleCategory }) {
  const { t } = useI18n();
  const { activeModule } = useActiveModule();
  const [pinned, setPinned] = useState(true);
  const items = modulesInCategory(category);

  return (
    <aside className={pinned ? "sidebar pinned" : "sidebar"} aria-label="Module navigation">
      <div className="sidebar-inner">
        <div className="sidebar-head">
          <span className="side-section-label">{t(CATEGORY_LABEL_KEYS[category])}</span>
          <button
            type="button"
            className="sidebar-pin"
            aria-pressed={pinned}
            aria-label={pinned ? "Collapse sidebar" : "Expand sidebar"}
            onClick={() => setPinned((p) => !p)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={pinned ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
            </svg>
          </button>
        </div>

        <nav className="side-tree">
          {items.map((m) => {
            const label = t(m.navKey);
            const active = m.id === activeModule?.id;
            const statusKey = STATUS_KEY[m.status];
            return (
              <NavLink
                key={m.id}
                to={m.path}
                end={m.end}
                className={active ? "side-row active" : "side-row"}
                title={label}
              >
                <span className="side-icon" aria-hidden="true">
                  <ModuleIcon id={m.id} />
                </span>
                <span className="side-label">{label}</span>
                {statusKey ? (
                  <span className="side-badge">{t(statusKey)}</span>
                ) : null}
              </NavLink>
            );
          })}
        </nav>

        {activeModule?.relatedGuides?.length ? (
          <ConnectedGuides ids={activeModule.relatedGuides} />
        ) : null}
      </div>
    </aside>
  );
}

