import { useState, useCallback } from "react";

interface UseControllableStateProps<T> {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
}

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateProps<T>): [
  T,
  (next: T | ((prev: T) => T)) => void
] {
  const [internalState, setInternalState] = useState<T | undefined>(defaultValue);

  const isControlled = value !== undefined;

  const currentValue = (isControlled ? value : internalState) as T;

  const setValue = useCallback(
    (nextValue: T | ((prev: T) => T)) => {
      const resolvedValue =
        typeof nextValue === "function"
          ? (nextValue as (prev: T) => T)(currentValue)
          : nextValue;

      if (!isControlled) {
        setInternalState(resolvedValue);
      }

      onChange?.(resolvedValue);
    },
    [isControlled, currentValue, onChange]
  );

  return [currentValue, setValue];
}