import type { ReactNode } from "react";

type PanelProps = {
  title?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  /// Visually dominant panel (e.g. the primary chart); grows to fill space.
  dominant?: boolean;
  /// Remove inner padding for edge-to-edge content such as charts.
  flush?: boolean;
  className?: string;
};

/// Reusable workspace panel: optional header (title + actions), body, optional footer.
export default function Panel({
  title,
  actions,
  footer,
  children,
  dominant = false,
  flush = false,
  className = "",
}: PanelProps) {
  const classes = ["panel", dominant ? "dominant" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes}>
      {(title || actions) && (
        <header className="panel-head">
          {title ? <h2 className="panel-title">{title}</h2> : <span />}
          {actions ? <div className="panel-actions">{actions}</div> : null}
        </header>
      )}
      <div className={flush ? "panel-body flush" : "panel-body"}>{children}</div>
      {footer ? <footer className="panel-foot">{footer}</footer> : null}
    </section>
  );
}
