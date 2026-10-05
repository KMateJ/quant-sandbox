import type { ReactNode } from "react";

export type TabItem<T extends string = string> = {
  id: T;
  label: ReactNode;
  disabled?: boolean;
};

type TabsProps<T extends string = string> = {
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
  /// Compact segmented control instead of underlined tabs.
  segmented?: boolean;
  className?: string;
};

/// Accessible tab / segmented control. No pills — underline or restrained segment.
export default function Tabs<T extends string = string>({
  items,
  value,
  onChange,
  ariaLabel,
  segmented = false,
  className = "",
}: TabsProps<T>) {
  const classes = [segmented ? "segmented" : "tabs", className]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={classes} role="tablist" aria-label={ariaLabel}>
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={item.disabled}
            className={active ? "tab active" : "tab"}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
