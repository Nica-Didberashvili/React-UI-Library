import { forwardRef, useRef, useState, KeyboardEvent } from "react";
import { usePopup } from "../hooks/usePopup";
import { useControllableState } from "../hooks/useControllableState";

export interface SelectOption<T> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SelectProps<T> {
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
}

export function Select<T extends string | number>({
  value,
  defaultValue,
  onValueChange,
  options,
  placeholder = "Select…",
}: SelectProps<T>) {
  const popup = usePopup();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [highlighted, setHighlighted] = useState(0);

  const [currentValue, setCurrentValue] = useControllableState<T>({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  
  const selectedOption = options.find((o) => o.value === currentValue);

  const select = (i: number) => {
    const opt = options[i];
    if (!opt || opt.disabled) return;
    setCurrentValue(opt.value);
    popup.setIsOpen(false);
    triggerRef.current?.focus();
  };

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!popup.isOpen) popup.setIsOpen(true);
      else setHighlighted((h) => Math.min(h + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!popup.isOpen) popup.setIsOpen(true);
      else setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!popup.isOpen) popup.setIsOpen(true);
      else select(highlighted);
    }
  };

  return (
    <div style={{ position: "relative", width: 220 }}>
      <button
        ref={(node) => {
          triggerRef.current = node;
          popup.triggerRef.current = node;
        }}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={popup.isOpen}
        aria-controls={popup.contentId}
        onClick={() => popup.toggle()}
        onKeyDown={onTriggerKeyDown}
        style={{
          width: "100%", padding: "8px 12px", textAlign: "left",
          border: "1px solid #ccc", borderRadius: 6, background: "#fff", cursor: "pointer"
        }}
      >
        {selectedOption?.label ?? placeholder}
      </button>

      {popup.isOpen && (
        <ul
          ref={(node) => { popup.contentRef.current = node; }}
          role="listbox"
          id={popup.contentId}
          aria-label="Options"
          aria-activedescendant={`${popup.contentId}-opt-${highlighted}`}
          style={{
            position: "absolute", top: "100%", left: 0, right: 0,
            margin: 4, padding: 4, listStyle: "none", background: "#fff",
            border: "1px solid #ccc", borderRadius: 6, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10
          }}
        >
          {options.map((opt, i) => (
            <li
              key={String(opt.value)}
              id={`${popup.contentId}-opt-${i}`}
              role="option"
              aria-selected={opt.value === currentValue}
              aria-disabled={opt.disabled || undefined}
              onMouseEnter={() => !opt.disabled && setHighlighted(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => select(i)}
              style={{
                padding: "8px 10px", borderRadius: 4, cursor: opt.disabled ? "not-allowed" : "pointer",
                background: i === highlighted ? "#e8f0fe" : "transparent",
                color: opt.disabled ? "#aaa" : "#111",
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}