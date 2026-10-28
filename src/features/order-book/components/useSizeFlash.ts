import { useEffect, useState } from "react";
import type { LadderEntry } from "../../../lib/market/ladder";

const sizes = (rows: LadderEntry[]) => new Map(rows.map((r) => [r.price, r.bidSize + r.askSize]));

/// Prices whose size changed since the previous rows, cleared after 300 ms.
export function useSizeFlash(rows: LadderEntry[]): Set<number> {
  const [seen, setSeen] = useState(rows);
  const [changed, setChanged] = useState<Set<number>>(() => new Set());
  if (seen !== rows) {
    const before = sizes(seen);
    setSeen(rows);
    setChanged(new Set(rows.filter((r) => before.has(r.price) && before.get(r.price) !== r.bidSize + r.askSize).map((r) => r.price)));
  }
  useEffect(() => {
    if (!changed.size) return;
    const id = window.setTimeout(() => setChanged(new Set()), 300);
    return () => window.clearTimeout(id);
  }, [changed]);
  return changed;
}
