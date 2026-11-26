import { useRef, useState, ReactNode } from "react";
import { usePopup } from "../hooks/usePopup";

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  delay?: number;
}

export function Tooltip({ content, children, delay = 300 }: TooltipProps) {
  const popup = usePopup();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      popup.setIsOpen(true);
    }, delay);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    popup.setIsOpen(false);
  };

  return (
    <span
      ref={(node) => {
        popup.triggerRef.current = node;
      }}
      style={{ position: "relative", display: "inline-block" }}
      tabIndex={0}
      aria-describedby={popup.isOpen ? popup.contentId : undefined}
      onMouseEnter={() => {
        if (!dismissed) show();
      }}
      onMouseLeave={() => {
        hide();
        setDismissed(false);
      }}
      onFocus={() => {
        if (!dismissed) show();
      }}
      onBlur={() => {
        hide();
        setDismissed(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setDismissed(true);
          hide();
        }
      }}
    >
      {children}
      {popup.isOpen && (
        <div
          ref={(node) => {
            popup.contentRef.current = node;
          }}
          id={popup.contentId}
          role="tooltip"
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "4px 8px",
            background: "#222",
            color: "#fff",
            borderRadius: 4,
            fontSize: 12,
            whiteSpace: "nowrap",
            zIndex: 10,
          }}
        >
          {content}
        </div>
      )}
    </span>
  );
}