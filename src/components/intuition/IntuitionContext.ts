import { createContext, useContext } from "react";
import type { IntuitionContextValue } from "./intuition.types";

export const IntuitionContext = createContext<IntuitionContextValue | null>(null);

/// Optional context lets shared headers work on pages without an intuition document.
export function useIntuition() {
  return useContext(IntuitionContext);
}
