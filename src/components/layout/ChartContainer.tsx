import type { ReactNode } from "react";

type ChartContainerProps = {
  title?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  /// Fixed pixel height; omit to let the chart fill available space.
  height?: number;
  className?: string;
  id?: string;
};

/// Dominant, edge-to-edge frame for a data visualisation.
export default function ChartContainer({
  title,
  actions,
  children,
  height,
  className = "",
  id,
}: ChartContainerProps) {
  const classes = ["chart-container", className].filter(Boolean).join(" ");
  return (
    <figure className={classes} id={id}>
      {(title || actions) && (
        <figcaption className="chart-container-head">
          {title ? <span className="chart-container-title">{title}</span> : <span />}
          {actions ? <div className="chart-container-actions">{actions}</div> : null}
        </figcaption>
      )}
      <div
        className="chart-container-body"
        style={height ? { height } : undefined}
      >
        {children}
      </div>
    </figure>
  );
}
