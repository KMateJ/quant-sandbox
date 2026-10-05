import type { ReactNode } from "react";

type ControlGroupProps = {
  label?: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
};

/// Labelled grouping of related controls; hierarchy via spacing, not containers.
export default function ControlGroup({
  label,
  hint,
  children,
  className = "",
}: ControlGroupProps) {
  const classes = ["control-group", className].filter(Boolean).join(" ");
  return (
    <div className={classes}>
      {(label || hint) && (
        <div className="control-group-head">
          {label ? <span className="control-group-label">{label}</span> : <span />}
          {hint ? <span className="control-group-hint">{hint}</span> : null}
        </div>
      )}
      <div className="control-group-body">{children}</div>
    </div>
  );
}
