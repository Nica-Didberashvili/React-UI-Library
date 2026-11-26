import {
  forwardRef,
  ComponentPropsWithoutRef,
  useRef,
  useEffect,
  useId,
} from "react";

export interface CheckboxProps
  extends Omit<ComponentPropsWithoutRef<"input">, "type"> {
  label?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, indeterminate, className, id, ...props }, forwardedRef) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;

    const innerRef = useRef<HTMLInputElement>(null);

    // Sync innerRef with the forwarded ref.
    const setRefs = (node: HTMLInputElement | null) => {
      innerRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

    useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = !!indeterminate;
      }
    }, [indeterminate]);

    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="checkbox"
          id={checkboxId}
          ref={setRefs}
          className={className}
          style={{ width: 16, height: 16, cursor: "pointer" }}
          {...props}
        />
        {label && (
          <label htmlFor={checkboxId} style={{ cursor: "pointer" }}>
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";