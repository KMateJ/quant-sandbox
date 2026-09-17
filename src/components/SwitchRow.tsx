export type SwitchOption = {
  label: string;
  active: boolean;
  onSelect: () => void;
};

export type SwitchGroup = {
  key: string;
  options: SwitchOption[];
};

type SwitchRowProps = {
  groups: SwitchGroup[];
};

// Compact, horizontally scrollable row of segmented toggles. Used on phones to
// surface a card's switches (mode, option type, metric, …) in a single line.
export default function SwitchRow({ groups }: SwitchRowProps) {
  return (
    <div className="switch-row">
      {groups.map((group) => (
        <div key={group.key} className="switch-group metric-switch" role="group">
          {group.options.map((option) => (
            <button
              key={option.label}
              type="button"
              className={option.active ? "metric-button active" : "metric-button"}
              aria-pressed={option.active}
              onClick={option.onSelect}
            >
              {option.label}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
