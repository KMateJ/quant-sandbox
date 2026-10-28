import type { ReactNode } from "react";
import { useI18n } from "../../../../i18n";
import { KIND_ORDER, TYPE_ORDER } from "../network.types";
import { KIND_COLOR, TYPE_COLOR } from "../networkView.math";
import type { NetworkPageModel } from "../useNetworkPage";

type Item = { id: string; label: string; swatch: ReactNode; active: boolean };

function ToggleSet({ items, label, onToggle }: { items: Item[]; label: string; onToggle: (id: string) => void }) {
  return (
    <div className="syr-toggles" role="group" aria-label={label}>
      {items.map((i) => (
        <button key={i.id} type="button" className={i.active ? "syr-toggle is-active" : "syr-toggle"} aria-pressed={i.active} onClick={() => onToggle(i.id)}>
          {i.swatch}
          <span>{i.label}</span>
        </button>
      ))}
    </div>
  );
}

/// Legend and filter in one: kinds (colour key, with words) and exposure types (line sample), each toggling visibility.
export default function FilterLegend({ m }: { m: NetworkPageModel }) {
  const { t } = useI18n();
  const present = new Set(m.net.institutions.map((i) => i.kind));
  const kinds: Item[] = KIND_ORDER.filter((k) => present.has(k)).map((k) => ({
    id: k,
    label: m.kindName(k),
    active: m.kinds.has(k),
    swatch: <span className="syr-swatch" style={m.s.color === "kind" ? { background: KIND_COLOR[k] } : undefined} aria-hidden="true" />,
  }));
  const types: Item[] = TYPE_ORDER.map((k) => ({
    id: k,
    label: t(`syrType_${k}`),
    active: m.types.has(k),
    swatch: (
      <svg className="syr-line" width="26" height="8" aria-hidden="true">
        <line x1="1" y1="4" x2="25" y2="4" style={{ stroke: TYPE_COLOR[k] }} strokeWidth="2" strokeDasharray={k === "repo" ? "5 3" : undefined} />
      </svg>
    ),
  }));
  return (
    <div className="syr-legend">
      <ToggleSet items={kinds} label={t("syrFilterKinds")} onToggle={(id) => m.toggleKind(id as never)} />
      <ToggleSet items={types} label={t("syrFilterTypes")} onToggle={(id) => m.toggleType(id as never)} />
      {m.s.color !== "kind" && <p className="syr-ramp">{t(`syrRamp_${m.s.color}`)}</p>}
    </div>
  );
}
