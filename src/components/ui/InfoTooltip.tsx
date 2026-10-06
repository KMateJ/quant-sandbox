import { useEffect, useId, useRef, useState, type ReactNode, type ButtonHTMLAttributes, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useTooltipPosition } from "./useTooltipPosition";

type InfoTooltipProps = Pick<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "aria-controls" | "aria-expanded" | "aria-haspopup"> & {
  /// Short hover/focus explanation. Keep concise; use Popover/HelpDrawer for long form.
  content: ReactNode;
  label?: string;
  className?: string;
  glyph?: ReactNode;
};

function TooltipBubble({ id, content, anchor, onEnter, onLeave }: {
  id: string;
  content: ReactNode;
  anchor: RefObject<HTMLButtonElement | null>;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const bubble = useRef<HTMLSpanElement>(null);
  const position = useTooltipPosition(anchor, bubble);
  return createPortal(
    <span
      ref={bubble}
      role="tooltip"
      id={id}
      className="info-tooltip-bubble"
      style={{ left: position?.left ?? 0, top: position?.top ?? 0, visibility: position ? "visible" : "hidden" }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {content}
    </span>,
    document.body,
  );
}

/// Info icon that reveals a concise tooltip on hover/focus (progressive disclosure, level 1).
export default function InfoTooltip({
  content,
  label = "More information",
  className = "",
  glyph,
  ...buttonProps
}: InfoTooltipProps) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const hovered = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const cancelClose = () => clearTimeout(closeTimer.current);
  const show = () => { cancelClose(); setOpen(true); };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      if (!hovered.current && document.activeElement !== trigger.current) setOpen(false);
    }, 100);
  };
  const onEnter = () => { hovered.current = true; show(); };
  const onLeave = () => { hovered.current = false; scheduleClose(); };
  useEffect(() => () => clearTimeout(closeTimer.current), []);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      clearTimeout(closeTimer.current);
      setOpen(false);
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [open]);
  const classes = ["info-tooltip", className].filter(Boolean).join(" ");
  return (
    <span className={classes} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button
        ref={trigger}
        type="button"
        className="info-tooltip-trigger"
        aria-label={label}
        aria-describedby={open ? id : undefined}
        onFocus={show}
        onBlur={scheduleClose}
        {...buttonProps}
        onClick={(event) => {
          if (!buttonProps.onClick) return;
          cancelClose();
          setOpen(false);
          buttonProps.onClick(event);
        }}
      >
        {glyph ?? <svg
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
        </svg>}
      </button>
      {open && <TooltipBubble id={id} content={content} anchor={trigger} onEnter={onEnter} onLeave={onLeave} />}
    </span>
  );
}
