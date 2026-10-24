/// Parsed JSON object under `key`, or `{}` when storage is missing, unreadable or not an object.
export function readJsonObject<T extends object>(key: string): T {
  try {
    if (typeof localStorage === "undefined") return {} as T;
    const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? "{}");
    return (parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {}) as T;
  } catch {
    return {} as T;
  }
}

/// Writes `value` as JSON; failures (private mode, quota, server) are ignored.
export function writeJsonObject(key: string, value: object): void {
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable: the value lives for this session only.
  }
}

/// Calls `onChange` when another tab writes `key`; no-op on the server.
export function onStorageKey(key: string, onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: StorageEvent) => {
    if (e.key === key) onChange();
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}
