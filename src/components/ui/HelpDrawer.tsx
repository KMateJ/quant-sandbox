import { useEffect, type ReactNode } from "react";

type HelpDrawerProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  closeLabel?: string;
};

/// Slide-in drawer for long-form contextual help (progressive disclosure, level 3).
export default function HelpDrawer({
  open,
  onClose,
  title,
  children,
  closeLabel = "Close",
}: HelpDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="help-drawer">
      <button
        type="button"
        className="help-drawer-backdrop"
        aria-label={closeLabel}
        onClick={onClose}
      />
      <aside className="help-drawer-panel" role="dialog" aria-label={typeof title === "string" ? title : undefined}>
        <header className="help-drawer-head">
          <h2 className="help-drawer-title">{title}</h2>
          <button
            type="button"
            className="help-drawer-close"
            aria-label={closeLabel}
            onClick={onClose}
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
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>
        <div className="help-drawer-body">{children}</div>
      </aside>
    </div>
  );
}
