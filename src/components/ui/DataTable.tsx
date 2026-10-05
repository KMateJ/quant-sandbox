import type { ReactNode } from "react";

export type DataColumn<T> = {
  key: string;
  header: ReactNode;
  /// Right-align numeric columns with tabular figures.
  align?: "start" | "end";
  render: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: DataColumn<T>[];
  rows: T[];
  getRowKey: (row: T, index: number) => string | number;
  caption?: ReactNode;
  className?: string;
};

/// Compact, horizontally scrollable schedule table driven by a column spec.
export default function DataTable<T>({
  columns,
  rows,
  getRowKey,
  caption,
  className = "",
}: DataTableProps<T>) {
  const classes = ["data-table", className].filter(Boolean).join(" ");
  return (
    <div className="data-table-scroll">
      <table className={classes}>
        {caption ? <caption>{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={c.align === "end" ? "num" : undefined}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={getRowKey(row, i)}>
              {columns.map((c) => (
                <td key={c.key} className={c.align === "end" ? "num" : undefined}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
