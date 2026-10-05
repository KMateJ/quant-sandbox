import type { ReactNode } from "react";

type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  status?: ReactNode;
  actions?: ReactNode;
};

/// Workspace page header: title, optional description/status badge and right-aligned actions.
export default function PageHeader({
  title,
  description,
  status,
  actions,
}: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header-main">
        <div className="page-header-title-row">
          <h1 className="page-header-title">{title}</h1>
          {status ? <span className="page-header-status">{status}</span> : null}
        </div>
        {description ? (
          <p className="page-header-desc">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="page-header-actions">{actions}</div> : null}
    </header>
  );
}
