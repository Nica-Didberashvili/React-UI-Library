import { Children, ReactNode } from "react";
import { usePopup } from "../hooks/usePopup";
import { pointer } from "@testing-library/user-event/dist/cjs/pointer/index.js";

export interface PopoverProps {
    trigger: ReactNode;
    children: ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    ariaLabel?: string;
}

export function Popover({
    trigger,
    children,
    open,
    defaultOpen,
    onOpenChange,
    ariaLabel = "Popover",
}: PopoverProps) {
    const popup = usePopup({ open, defaultOpen, onOpenChange });

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
                ref={(node) => {
                    popup.triggerRef.current = node;
                }}
                type="button"
                aria-haspopup="dialog"
                aria-expanded={popup.isOpen}
                aria-controls={popup.contentId}
                onClick={() => popup.toggle()}
                style={{
                    padding: '6px 12px',
                    border: '1px solid #ccc',
                    borderRadius: 6,
                    background: '#fff',
                    cursor: 'pointer',
                }}
            >
                {trigger}
            </button>

            {popup.isOpen && (
                <div
                    ref={(node) => {
                        popup.contentRef.current = node;
                    }}
                    id={popup.contentId}
                    role="dialog"
                    aria-modal="false"
                    aria-label={ariaLabel}
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        padding: 12,
                        background: '#fff',
                        borderRadius: 6,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        minWidth: 200,
                        zIndex: 10,
                    }}
                >
                    {children}
                </div>
            )}
        </div>
    );
}