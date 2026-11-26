import { useEffect, useRef, useId } from "react";
import { createPortal } from "react-dom";
import { useControllableState } from "../hooks/useControllableState";

export interface ModalProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  children?: React.ReactNode;
}

export function Modal({
  open,
  defaultOpen = false,
  onOpenChange,
  title,
  children,
}: ModalProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [isOpen, setIsOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, setIsOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      handleClose();
    }
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onClick={handleBackdropClick}
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      style={{
        border: "none",
        borderRadius: 8,
        padding: 0,
        width: "100%",
        maxWidth: 500,
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      }}
    >
      <div style={{ padding: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          {title ? (
            <h2 id={titleId} style={{ margin: 0, fontSize: 20 }}>
              {title}
            </h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            style={{
              background: "transparent",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div>{children}</div>
      </div>
    </dialog>,
    document.body
  );
}