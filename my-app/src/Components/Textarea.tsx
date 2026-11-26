import { forwardRef, ComponentPropsWithoutRef, useId } from "react";

export interface TextareaProps
  extends ComponentPropsWithoutRef<"textarea"> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {label && <label htmlFor={textareaId}>{label}</label>}

        <textarea
          ref={ref}
          id={textareaId}
          className={`ui-textarea ${error ? "ui-textarea-error" : ""} ${className || ""}`}
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

Textarea.displayName = "Textarea";