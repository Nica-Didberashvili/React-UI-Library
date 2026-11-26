import { useEffect, useId, useRef, RefObject } from "react";
import { useControllableState } from "./useControllableState";

export interface UsePopupOptions {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface UsePopupReturn {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggle: () => void;
  close: () => void;
  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLElement | null>;
  contentId: string;
}

export function usePopup({
  open,
  defaultOpen = false,
  onOpenChange,
}: UsePopupOptions = {}): UsePopupReturn {
  const contentId = useId();
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);

  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  useEffect(() => {
    if (!isOpen) return;

    const onDocMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !contentRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, setIsOpen]);

  const prevOpen = useRef(isOpen);
  useEffect(() => {
    if (prevOpen.current && !isOpen) {
      if (contentRef.current?.contains(document.activeElement)) {
        triggerRef.current?.focus();
      }
    }
    prevOpen.current = isOpen;
  }, [isOpen]);

  return {
    isOpen,
    setIsOpen,
    toggle: () => setIsOpen(!isOpen),
    close: () => setIsOpen(false),
    triggerRef,
    contentRef,
    contentId,
  };
}