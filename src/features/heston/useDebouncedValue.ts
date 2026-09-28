import { useEffect, useRef, useState } from "react";

export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

// Cheap fields (e.g. S0, K, r) are throttled so they stay live while dragging
// and feel instant; expensive fields use a longer trailing debounce so heavy
// recomputes only fire once the user pauses.
export function useAdaptiveDebouncedValue<T extends Record<string, unknown>>(
  value: T,
  expensiveKeys: readonly (keyof T)[],
  fastDelay: number,
  slowDelay: number
): T {
  const [debounced, setDebounced] = useState(value);
  const lastEmittedRef = useRef(value);
  const lastEmitTimeRef = useRef(0);

  useEffect(() => {
    const prev = lastEmittedRef.current;
    const expensiveChanged = expensiveKeys.some((key) => prev[key] !== value[key]);

    const emit = () => {
      lastEmittedRef.current = value;
      lastEmitTimeRef.current = Date.now();
      setDebounced(value);
    };

    if (expensiveChanged) {
      const id = window.setTimeout(emit, slowDelay);
      return () => window.clearTimeout(id);
    }

    const elapsed = Date.now() - lastEmitTimeRef.current;
    const wait = Math.max(0, fastDelay - elapsed);
    const id = window.setTimeout(emit, wait);
    return () => window.clearTimeout(id);
  }, [value, expensiveKeys, fastDelay, slowDelay]);

  return debounced;
}