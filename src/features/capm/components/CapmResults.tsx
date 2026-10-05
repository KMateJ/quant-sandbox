import type { ReactNode } from "react";

export type ResultRow = {
  label: ReactNode;
  value: string;
  /// Optional accent colour for the value (e.g. alpha sign).
  accent?: string;
};

/// Compact derived-value block: label/value rows separated by rules, not individual cards.
export default function CapmResults({ rows }: { rows: ResultRow[] }) {
  return (
    <dl className="capm-results">
      {rows.map((r, i) => (
        <div className="capm-result-row" key={i}>
          <dt className="capm-result-label">{r.label}</dt>
          <dd
            className="capm-result-value"
            style={r.accent ? { color: r.accent } : undefined}
          >
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
