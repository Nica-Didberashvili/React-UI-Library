import {
  createContext,
  useContext,
  useId,
  forwardRef,
  ComponentPropsWithoutRef,
  ReactNode,
} from "react";
import { useControllableState } from "../hooks/useControllableState";

interface RadioGroupContextValue {
  name: string;
  value: string;
  setValue: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(
  undefined
);

function useRadioGroup() {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) throw new Error("Radio must be used within <RadioGroup>");
  return ctx;
}

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  children: ReactNode;
}

export function RadioGroup({
  value,
  defaultValue = "",
  onValueChange,
  name,
  children,
}: RadioGroupProps) {
  const generatedName = useId();
  const groupName = name || generatedName;

  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  return (
    <RadioGroupContext.Provider
      value={{ name: groupName, value: current, setValue: setCurrent }}
    >
      <div role="radiogroup">{children}</div>
    </RadioGroupContext.Provider>
  );
}

export interface RadioProps
  extends Omit<ComponentPropsWithoutRef<"input">, "type" | "name" | "checked"> {
  value: string;
  label?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ value, label, id, className, ...props }, ref) => {
    const generatedId = useId();
    const radioId = id || generatedId;
    const { name, value: groupValue, setValue } = useRadioGroup();
    const isChecked = groupValue === value;

    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          ref={ref}
          type="radio"
          id={radioId}
          name={name}
          value={value}
          checked={isChecked}
          onChange={() => setValue(value)}
          className={className}
          style={{ width: 16, height: 16, cursor: "pointer" }}
          {...props}
        />
        {label && (
          <label htmlFor={radioId} style={{ cursor: "pointer" }}>
            {label}
          </label>
        )}
      </div>
    );
  }
);
Radio.displayName = "Radio";