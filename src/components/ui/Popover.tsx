import { useEffect, useRef, useState, type ReactNode } from "react";

type PopoverProps = {
  /// Trigger element (usually a button or info icon).
  trigger: ReactNode;
  children: ReactNode;
  align?: "start" | "end";
  className?: string;
};

/// Click-to-open popover for richer help than a tooltip (progressive disclosure, level 2).
export default function Popover({
  trigger,
  children,
  align = "start",
  className = "",
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const classes = ["popover", className].filter(Boolean).join(" ");
  return (
    <div className={classes} ref={rootRef}>
      <span
        className="popover-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {trigger}
      </span>
      {open ? (
        <div className={`popover-panel align-${align}`} role="dialog">
          {children}
        </div>
      ) : null}
    </div>
  );
}
