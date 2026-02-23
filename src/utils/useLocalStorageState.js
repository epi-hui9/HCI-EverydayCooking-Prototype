import { useCallback, useEffect, useState } from "react";

export function useLocalStorageState(key, defaultValue) {
  const [value, _setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return defaultValue;
      return JSON.parse(raw);
    } catch {
      return defaultValue;
    }
  });

  // ✅ Synchronous persist: guarantees save even if component unmounts immediately
  const setValue = useCallback(
    (updater) => {
      _setValue((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // ignore quota / private mode failures
        }
        return next;
      });
    },
    [key]
  );

  // Keep a safety net (covers cases like key changes)
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }, [key, value]);

  return [value, setValue];
}