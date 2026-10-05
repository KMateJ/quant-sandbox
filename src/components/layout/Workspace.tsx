import type { ReactNode } from "react";

type WorkspaceProps = {
  children: ReactNode;
  /// Column template for the panel grid; defaults to a single column.
  columns?: "single" | "sidebar" | "split" | "thirds";
  className?: string;
};

/// Grid region that hosts panels/charts below the page header.
export default function Workspace({
  children,
  columns = "single",
  className = "",
}: WorkspaceProps) {
  const classes = ["workspace", `cols-${columns}`, className]
    .filter(Boolean)
    .join(" ");
  return <div className={classes}>{children}</div>;
}
