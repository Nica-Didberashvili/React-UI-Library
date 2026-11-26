import {
  forwardRef,
  useRef,
  useState,
  KeyboardEvent,
} from "react";
import { usePopup } from "../hooks/usePopup";
import { useControllableState } from "../hooks/useControllableState";

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
}

function nextEnabled(
  options: DropdownOption[],
  from: number,
  dir: 1 | -1
): number {
  const n = options.length;
  if (n === 0) return 0;
  let i = from;
  for (let step = 0; step < n; step++) {
    i = (i + dir + n) % n;
    if (!options[i].disabled) return i;
  }
  return from;
}

export const Dropdown = forwardRef<HTMLButtonElement, DropdownProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      options,
      placeholder = "Select…",
      disabled,
    },
    forwardedRef
  ) => {
    const popup = usePopup();
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [highlighted, setHighlighted] = useState(0);

    const [currentValue, setCurrentValue] = useControllableState<string>({
      value,
      defaultValue: defaultValue ?? "",
      onChange: onValueChange,
    });

    const selectedOption = options.find((o) => o.value === currentValue);
    const optionId = (i: number) => `${popup.contentId}-opt-${i}`;

    const setTriggerRef = (node: HTMLButtonElement | null) => {
      triggerRef.current = node;
      popup.triggerRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

    const select = (i: number) => {
      const opt = options[i];
      if (!opt || opt.disabled) return;
      setCurrentValue(opt.value);
      popup.setIsOpen(false);
      triggerRef.current?.focus();
    };

    const openAndHighlight = () => {
      const selectedIdx = options.findIndex((o) => o.value === currentValue);
      setHighlighted(
        selectedIdx >= 0 ? selectedIdx : nextEnabled(options, -1, 1)
      );
      popup.setIsOpen(true);
    };

    const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (!popup.isOpen) openAndHighlight();
          else setHighlighted((h) => nextEnabled(options, h, 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          if (!popup.isOpen) openAndHighlight();
          else setHighlighted((h) => nextEnabled(options, h, -1));
          break;
        case "Home":
          if (popup.isOpen) {
            e.preventDefault();
            setHighlighted(nextEnabled(options, -1, 1));
          }
          break;
        case "End":
          if (popup.isOpen) {
            e.preventDefault();
            setHighlighted(nextEnabled(options, options.length, -1));
          }
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (!popup.isOpen) openAndHighlight();
          else select(highlighted);
          break;
      }
    };

    return (
      <div style={{ position: "relative", width: 220 }}>
        <button
          ref={setTriggerRef}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={popup.isOpen}
          aria-controls={popup.contentId}
          onClick={() =>
            popup.isOpen ? popup.setIsOpen(false) : openAndHighlight()
          }
          onKeyDown={onTriggerKeyDown}
          style={{
            width: "100%",
            padding: "8px 12px",
            textAlign: "left",
            border: "1px solid #ccc",
            borderRadius: 6,
            background: "#fff",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          {selectedOption?.label ?? placeholder}
        </button>

        {popup.isOpen && (
          <ul
            ref={(node) => {
              popup.contentRef.current = node;
            }}
            role="listbox"
            id={popup.contentId}
            aria-label="Options"
            aria-activedescendant={optionId(highlighted)}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              margin: 4,
              padding: 4,
              listStyle: "none",
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: 6,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              maxHeight: 200,
              overflowY: "auto",
              zIndex: 10,
            }}
          >
            {options.map((opt, i) => {
              const isSelected = opt.value === currentValue;
              const isHighlighted = i === highlighted;
              return (
                <li
                  key={opt.value}
                  id={optionId(i)}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={opt.disabled || undefined}
                  onMouseEnter={() => !opt.disabled && setHighlighted(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => select(i)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 4,
                    cursor: opt.disabled ? "not-allowed" : "pointer",
                    color: opt.disabled ? "#aaa" : "#111",
                    background:
                      isHighlighted && !opt.disabled
                        ? "#e8f0fe"
                        : "transparent",
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {opt.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
);
Dropdown.displayName = "Dropdown";