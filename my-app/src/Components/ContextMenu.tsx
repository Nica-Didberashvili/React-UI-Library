import { useState, ReactNode, MouseEvent } from "react";
import { usePopup } from "../hooks/usePopup";

export interface ContextMenuProps {
  children: ReactNode;
  menu: ReactNode;
}

export function ContextMenu({ children, menu }: ContextMenuProps) {
  const popup = usePopup();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    popup.setIsOpen(true);
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      style={{ border: "1px dashed #ccc", padding: 40, textAlign: "center" }}
    >
      {children}

      {popup.isOpen && (
        <div
          ref={(node) => {
            popup.contentRef.current = node;
          }}
          id={popup.contentId}
          role="menu"
          onClick={() => popup.setIsOpen(false)}
          style={{
            position: "fixed",
            top: position.y,
            left: position.x,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: 6,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: 4,
            minWidth: 160,
            zIndex: 1000,
          }}
        >
          {menu}
        </div>
      )}
    </div>
  );
}

export function ContextMenuItem({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      style={{
        display: "block",
        width: "100%",
        padding: "8px 12px",
        textAlign: "left",
        background: "transparent",
        border: "none",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0f0")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {children}
    </button>
  );
}