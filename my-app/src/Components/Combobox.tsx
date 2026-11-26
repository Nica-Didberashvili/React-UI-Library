import { useState, useRef, KeyboardEvent } from "react";
import { usePopup } from "../hooks/usePopup";
import { useControllableState } from "../hooks/useControllableState";

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  "aria-label"?: string;
}

export function Combobox({ value, onValueChange, options, placeholder, 'aria-label': ariaLabel = "Search" }: ComboboxProps) {
  const popup = usePopup();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);

  const [selectedValue, setSelectedValue] = useControllableState<string>({
    value,
    defaultValue: "",
    onChange: onValueChange,
  });

  const selectedLabel = options.find((o) => o.value === selectedValue)?.label ?? "";
  if (query === "" && selectedValue && document.activeElement !== inputRef.current) {
    setQuery(selectedLabel);
  }

  const filtered = query === selectedLabel && selectedValue
    ? options
    : options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));

  const select = (opt: ComboboxOption) => {
    setSelectedValue(opt.value);
    setQuery(opt.label);
    popup.setIsOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!popup.isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      popup.setIsOpen(true);
      return;
    }

    if (!popup.isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlighted]) select(filtered[highlighted]);
    }
  };

  return (
    <div style={{ position: "relative", width: 220 }}>
      <input
        ref={(node) => {
          inputRef.current = node;
          popup.triggerRef.current = node;
        }}
        type="text"
        role="combobox"
        aria-label={ariaLabel}
        aria-expanded={popup.isOpen}
        aria-controls={popup.contentId}
        aria-autocomplete="list"
        aria-activedescendant={popup.isOpen ? `${popup.contentId}-opt-${highlighted}` : undefined}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          popup.setIsOpen(true);
          setHighlighted(0);
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "8px 12px", border: "1px solid #ccc",
          borderRadius: 6, fontSize: 14, boxSizing: "border-box"
        }}
      />

      {popup.isOpen && (
        <ul
          ref={(node) => { popup.contentRef.current = node; }}
          role="listbox"
          id={popup.contentId}
          aria-label="Options"
          style={{
            position: "absolute", top: "100%", left: 0, right: 0,
            margin: 4, padding: 4, listStyle: "none", background: "#fff",
            border: "1px solid #ccc", borderRadius: 6, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10
          }}
        >
          {filtered.length === 0 ? (
            <li style={{ padding: "8px 10px", color: "#666" }}>No results</li>
          ) : (
            filtered.map((opt, i) => (
              <li
                key={opt.value}
                id={`${popup.contentId}-opt-${i}`}
                role="option"
                aria-selected={opt.value === selectedValue}
                onMouseEnter={() => setHighlighted(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(opt)}
                style={{
                  padding: "8px 10px", borderRadius: 4, cursor: "pointer",
                  background: i === highlighted ? "#e8f0fe" : "transparent",
                }}
              >
                {opt.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}