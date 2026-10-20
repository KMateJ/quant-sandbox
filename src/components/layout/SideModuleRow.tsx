import type { MouseEvent } from "react";
import { NavLink } from "react-router-dom";
import { useI18n } from "../../i18n";
import type { ModuleDef, ModuleStatus } from "../../modules/registry";
import ModuleIcon from "./ModuleIcon";
import SideSubNav from "./SideSubNav";

const STATUS_KEY: Partial<Record<ModuleStatus, "statusBeta" | "statusPlanned">> = {
  beta: "statusBeta",
  planned: "statusPlanned",
};

type Props = {
  module: ModuleDef;
  active: boolean;
  open: boolean;
  onToggle: () => void;
};

/// One module in the sidebar tree. Modules with sub-pages expand: clicking the active row
/// toggles its children in place, the chevron toggles any row without navigating.
export default function SideModuleRow({ module: m, active, open, onToggle }: Props) {
  const { t } = useI18n();
  const label = t(m.navKey);
  const statusKey = STATUS_KEY[m.status];
  const status = statusKey ? t(statusKey) : undefined;
  const hasChildren = Boolean(m.subNav?.length);
  const childrenId = `side-children-${m.id}`;

  const onRowClick = (event: MouseEvent) => {
    if (!hasChildren || !active) return;
    event.preventDefault();
    onToggle();
  };

  return (
    <div className={hasChildren ? "side-node has-children" : "side-node"}>
      <NavLink
        to={m.path}
        end={m.end}
        className={active ? "side-row active" : "side-row"}
        aria-current={active ? "page" : undefined}
        aria-expanded={hasChildren ? open : undefined}
        aria-controls={hasChildren ? childrenId : undefined}
        title={status ? `${label} (${status})` : label}
        onClick={onRowClick}
      >
        <span className="side-icon" aria-hidden="true">
          <ModuleIcon id={m.icon ?? m.id} />
        </span>
        <span className="side-label">{label}</span>
        {/* Beta is a dot so the name keeps its room; "planned" stays a text badge. */}
        {m.status === "beta" ? <span className="side-status-dot" role="img" aria-label={status} /> : null}
        {m.status === "planned" ? <span className="side-badge">{status}</span> : null}
      </NavLink>
      {hasChildren && (
        <button
          type="button"
          className={open ? "side-expander open" : "side-expander"}
          aria-label={t(open ? "navCollapseSection" : "navExpandSection", { name: label })}
          aria-expanded={open}
          aria-controls={childrenId}
          onClick={onToggle}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      )}
      {hasChildren && (
        <div id={childrenId} className={open ? "side-collapse open" : "side-collapse"} inert={!open}>
          <div className="side-collapse-inner">
            <SideSubNav items={m.subNav!} />
          </div>
        </div>
      )}
    </div>
  );
}
