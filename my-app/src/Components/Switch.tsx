import { useId } from "react";
import { useControllableState } from "../hooks/useControllableState";

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  label,
}: SwitchProps) {
  const id = useId();

  const [isChecked, setIsChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <input
        type="checkbox"
        role="switch"
        id={id}
        checked={isChecked}
        disabled={disabled}
        aria-checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
        style={{
          // sr-only: visually hidden but still focusable and accessible
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      />

      <label
        htmlFor={id}
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          backgroundColor: isChecked ? "#0079bf" : "#ccc",
          position: "relative",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "background-color 0.2s",
          display: "inline-block",
        }}
      >
        <span
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            backgroundColor: "white",
            position: "absolute",
            top: 2,
            left: isChecked ? 22 : 2,
            transition: "left 0.2s",
          }}
        />
      </label>

      {label && <label htmlFor={id}>{label}</label>}
    </div>
  );
}