import type { ReactNode } from "react";

export type SegmentedOption<T> = { value: T; label: ReactNode };

type Props<T> = {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
};

/// Row of mutually exclusive preset buttons (a single-choice toggle group).
export default function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: Props<T>) {
  return (
    <div className={className ? `segmented-control ${className}` : "segmented-control"} role="group" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={option.value === value ? "preset-btn preset-btn--active" : "preset-btn"}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
