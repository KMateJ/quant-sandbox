import { useId, type ReactNode, type ButtonHTMLAttributes } from "react";

type InfoTooltipProps = Pick<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "aria-controls" | "aria-expanded" | "aria-haspopup"> & {
  /// Short hover/focus explanation. Keep concise; use Popover/HelpDrawer for long form.
  content: ReactNode;
  label?: string;
  className?: string;
};

/// Info icon that reveals a concise tooltip on hover/focus (progressive disclosure, level 1).
export default function InfoTooltip({
  content,
  label = "More information",
  className = "",
  ...buttonProps
}: InfoTooltipProps) {
  const id = useId();
  const classes = ["info-tooltip", className].filter(Boolean).join(" ");
  return (
    <span className={classes}>
      <button
        type="button"
        className="info-tooltip-trigger"
        aria-label={label}
        aria-describedby={id}
        {...buttonProps}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      </button>
      <span role="tooltip" id={id} className="info-tooltip-bubble">
        {content}
      </span>
    </span>
  );
}
