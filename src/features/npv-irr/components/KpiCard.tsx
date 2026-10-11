import type { ReactNode } from "react";
import { InfoTooltip } from "../../../components/ui";

type KpiCardProps = {
  label: string;
  value: string;
  tone?: "good" | "bad" | "neutral";
  sub?: ReactNode;
  info?: ReactNode;
};

const toneVar: Record<string, string | undefined> = {
  good: "var(--positive)",
  bad: "var(--negative)",
  neutral: undefined,
};

/// Compact headline metric card used across the lab (NPV, IRR, PI, payback …).
export default function KpiCard({ label, value, tone = "neutral", sub, info }: KpiCardProps) {
  return (
    <div className="stat-card npv-kpi">
      <div className="stat-title">
        {label}
        {info ? <InfoTooltip content={info} /> : null}
      </div>
      <div className="stat-value" style={{ color: toneVar[tone] }}>
        {value}
      </div>
      {sub ? <div className="npv-kpi-sub">{sub}</div> : null}
    </div>
  );
}
