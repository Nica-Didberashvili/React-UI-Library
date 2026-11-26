import { forwardRef, ComponentPropsWithoutRef, useId } from "react";

export interface InputProps extends ComponentPropsWithoutRef<"input"> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {label && <label htmlFor={inputId}>{label}</label>}

        <input
          ref={ref}
          id={inputId}
          className={`ui-input ${error ? "ui-input-error" : ""} ${className || ""}`}
          style={{
            padding: 8,
            border: error ? "1px solid red" : "1px solid #ccc",
            borderRadius: 4,
          }}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />

        {error && (
          <span id={errorId} style={{ color: "red", fontSize: 12 }}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";