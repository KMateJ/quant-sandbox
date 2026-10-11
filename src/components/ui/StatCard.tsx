import type { ReactNode } from "react";

/// Compact label/value tile using the shared `.stat-card` styles.
export default function StatCard({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <div className="stat-card">
      <div className="stat-title">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
