import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useMediaQuery } from "../useMediaQuery";

type HelpDrawerProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  closeLabel?: string;
  context?: string;
  id?: string;
  bodyRef?: RefObject<HTMLDivElement | null>;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

/// Slide-in drawer for long-form contextual help (progressive disclosure, level 3).
export default function HelpDrawer({
  open,
  onClose,
  title,
  children,
  closeLabel = "Close",
  context,
  id,
  bodyRef,
  returnFocusRef,
}: HelpDrawerProps) {
  const panel = useRef<HTMLElement>(null);
  const modal = useMediaQuery("(max-width: 900px)");
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const returnFocus = returnFocusRef?.current ?? opener;
    if (!panel.current?.contains(document.activeElement)) {
      panel.current?.querySelector<HTMLElement>("button")?.focus({ preventScroll: true });
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key !== "Tab" || !modal || !panel.current) return;
      const stops = Array.from(panel.current.querySelectorAll<HTMLElement>(
        'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]'
      )).filter((element) => element.getClientRects().length > 0);
      const first = stops[0];
      const last = stops[stops.length - 1];
      if ((e.shiftKey && (document.activeElement === first || !stops.includes(document.activeElement as HTMLElement))) ||
        (!e.shiftKey && (document.activeElement === last || !stops.includes(document.activeElement as HTMLElement)))) {
        e.preventDefault();
        (e.shiftKey ? last : first)?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    const padding = document.body.style.paddingRight;
    const siblings = modal ? Array.from(document.body.children).filter(
      (element): element is HTMLElement => element instanceof HTMLElement && !element.contains(panel.current)
    ).map((element) => ({ element, inert: element.inert })) : [];
    if (modal) {
      siblings.forEach(({ element }) => { element.inert = true; });
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbar > 0) document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbar}px`;
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      if (modal) {
        siblings.forEach(({ element, inert }) => { element.inert = inert; });
        document.body.style.overflow = overflow;
        document.body.style.paddingRight = padding;
      }
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    };
  }, [open, onClose, modal, returnFocusRef]);

  if (!open) return null;

  return createPortal(
    <div className={`help-drawer${modal ? " help-drawer--modal" : ""}`}>
      {modal && <button
        type="button"
        className="help-drawer-backdrop"
        aria-label={closeLabel}
        onClick={onClose}
        tabIndex={-1}
      />}
      <aside ref={panel} id={id} className="help-drawer-panel" role="dialog" aria-modal={modal || undefined} aria-label={typeof title === "string" ? title : undefined}>
        <header className="help-drawer-head">
          <div>
            <h2 className="help-drawer-title">{title}</h2>
            {context && <p className="intuition-context" aria-live="polite">{context}</p>}
          </div>
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
        <div ref={bodyRef} className="help-drawer-body">{children}</div>
      </aside>
    </div>,
    document.body
  );
}
