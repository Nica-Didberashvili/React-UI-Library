import {
  createContext,
  useContext,
  useId,
  useRef,
  forwardRef,
  ComponentPropsWithoutRef,
  KeyboardEvent,
  ReactNode,
  useState,
} from "react";

interface AccordionContextValue {
  openItems: string[];
  toggle: (value: string) => void;
  type: "single" | "multiple";
  baseId: string;
}

const AccordionContext = createContext<AccordionContextValue | undefined>(
  undefined
);

function useAccordion() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion parts must be used within <Accordion>");
  return ctx;
}

export interface AccordionProps {
  type?: "single" | "multiple";
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  children: ReactNode;
}

export function Accordion({
  type = "single",
  defaultValue = [],
  value,
  onValueChange,
  children,
}: AccordionProps) {
  const baseId = useId();
  const [internal, setInternal] = useState<string[]>(defaultValue);
  const openItems = value !== undefined ? value : internal;

  const toggle = (item: string) => {
    let next: string[];
    if (type === "single") {
      next = openItems.includes(item) ? [] : [item];
    } else {
      next = openItems.includes(item)
        ? openItems.filter((i) => i !== item)
        : [...openItems, item];
    }
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggle, type, baseId }}>
      <div>{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  triggerId: string;
  panelId: string;
}

const AccordionItemContext = createContext<
  AccordionItemContextValue | undefined
>(undefined);

function useAccordionItem() {
  const ctx = useContext(AccordionItemContext);
  if (!ctx) throw new Error("Accordion parts must be inside <AccordionItem>");
  return ctx;
}

export interface AccordionItemProps {
  value: string;
  children: ReactNode;
}

export function AccordionItem({ value, children }: AccordionItemProps) {
  const { openItems, baseId } = useAccordion();
  const isOpen = openItems.includes(value);
  const triggerId = `${baseId}-trigger-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  return (
    <AccordionItemContext.Provider
      value={{ value, isOpen, triggerId, panelId }}
    >
      <div style={{ borderBottom: "1px solid #eee" }}>{children}</div>
    </AccordionItemContext.Provider>
  );
}

export const AccordionTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<"button">
>(({ className, children, ...props }, ref) => {
  const { toggle } = useAccordion();
  const { value, isOpen, triggerId, panelId } = useAccordionItem();
  const internalRef = useRef<HTMLButtonElement>(null);

  const setRefs = (node: HTMLButtonElement | null) => {
    internalRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const triggers = Array.from(
      internalRef.current?.parentElement?.parentElement?.querySelectorAll<HTMLButtonElement>(
        '[aria-expanded]'
      ) ?? []
    );
    const idx = triggers.indexOf(internalRef.current!);
    const next =
      e.key === "ArrowDown"
        ? triggers[(idx + 1) % triggers.length]
        : triggers[(idx - 1 + triggers.length) % triggers.length];
    next?.focus();
  };

  return (
    <h3 style={{ margin: 0 }}>
      <button
        ref={setRefs}
        type="button"
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => toggle(value)}
        onKeyDown={handleKeyDown}
        className={className}
        style={{
          width: "100%",
          padding: 12,
          textAlign: "left",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
        }}
        {...props}
      >
        {children}
        <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
      </button>
    </h3>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionPanel = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, ref) => {
  const { isOpen, triggerId, panelId } = useAccordionItem();

  return (
    <div
      ref={ref}
      role="region"
      id={panelId}
      aria-labelledby={triggerId}
      hidden={!isOpen}
      className={className}
      style={{ padding: isOpen ? 12 : 0 }}
      {...props}
    >
      {isOpen && children}
    </div>
  );
});
AccordionPanel.displayName = "AccordionPanel";