import { useEffect, useState } from "react";

/**
 * useDebounce - React hook to debounce a value by a given delay.
 * @param value The value to debounce
 * @param delay The debounce delay in ms (default: 300)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
