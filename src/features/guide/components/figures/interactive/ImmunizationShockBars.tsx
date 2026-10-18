import { useI18n } from "../../../../../i18n";
import type { ShockState } from "../../../guide.interactive.immunizationShock.math";
import { money } from "./ImmunizationShockFormat";

type Props = { state: ShockState; scaleMax: number };

/// PV of the assets and of the liability as two bars on one scale; the gap between their ends is the surplus.
export default function ImmunizationShockBars({ state, scaleMax }: Props) {
  const { t } = useI18n();
  const width = (v: number) => `${Math.max(0, Math.min(1, v / scaleMax)) * 100}%`;
  const rows = [
    { key: "assets", label: t("ixImAssets"), value: state.assets },
    { key: "liability", label: t("ixImLiability"), value: state.liability },
  ];
  return (
    <div className="im-bars">
      {rows.map((r) => (
        <div key={r.key} className="im-row">
          <span className="im-row-label">{r.label}</span>
          <div className="im-bar-track">
            <div className={`im-bar im-bar--${r.key}`} style={{ width: width(r.value) }} />
            <span className="im-bar-value">{money(r.value)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
