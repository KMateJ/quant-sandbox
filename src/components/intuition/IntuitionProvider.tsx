import { useCallback, useId, useRef, useState, type ReactNode } from "react";
import { IntuitionContext } from "./IntuitionContext";
import IntuitionPanel from "./IntuitionPanel";
import type { IntuitionDocument } from "./intuition.types";

type Props = { document?: IntuitionDocument; children: ReactNode };

/// Scope a document to a page; triggers can live anywhere in its component tree.
export default function IntuitionProvider({ document, children }: Props) {
  const panelId = useId();
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [state, setState] = useState({ open: false, sectionId: undefined as string | undefined, request: 0 });
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);
  const show = useCallback((sectionId?: string) => {
    if (!document) throw new Error("An intuition document is required.");
    if (sectionId && !document.sections.some((s) => s.id === sectionId)) {
      throw new Error(`Unknown intuition section: ${sectionId}`);
    }
    returnFocusRef.current = window.document.activeElement instanceof HTMLElement ? window.document.activeElement : null;
    setState((s) => ({ open: true, sectionId, request: s.request + 1 }));
  }, [document]);

  if (!document) return children;
  const ids = document.sections.map((s) => s.id);
  if (ids.some((id) => !id) || new Set(ids).size !== ids.length) {
    throw new Error("Intuition sections must have unique, non-empty IDs.");
  }

  return (
    <IntuitionContext.Provider value={{ document, panelId, ...state, show, close, returnFocusRef }}>
      {children}
      <IntuitionPanel />
    </IntuitionContext.Provider>
  );
}
