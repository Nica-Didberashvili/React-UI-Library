import {
  createContext,
  useContext,
  useId,
  useRef,
  forwardRef,
  ComponentPropsWithoutRef,
  KeyboardEvent,
} from "react";
import { useControllableState } from "../hooks/useControllableState";

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error("Tabs components must be used within <Tabs>");
  }
  return ctx;
}

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export function Tabs({
  value,
  defaultValue = "",
  onValueChange,
  children,
}: TabsProps) {
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const baseId = useId();

  return (
    <TabsContext.Provider value={{ value: current, setValue: setCurrent, baseId }}>
      {children}
    </TabsContext.Provider>
  );
}

export const TabsList = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="tablist"
      className={className}
      style={{ display: "flex", gap: 4, borderBottom: "1px solid #ccc" }}
      {...props}
    >
      {children}
    </div>
  );
});
TabsList.displayName = "TabsList";

export interface TabsTriggerProps
  extends Omit<ComponentPropsWithoutRef<"button">, "value"> {
  value: string;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, className, children, ...props }, ref) => {
    const { value: selected, setValue, baseId } = useTabsContext();
    const isSelected = selected === value;
    const triggerId = `${baseId}-trigger-${value}`;
    const panelId = `${baseId}-panel-${value}`;
    const internalRef = useRef<HTMLButtonElement>(null);

    const setRefs = (node: HTMLButtonElement | null) => {
      internalRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      const tablist = internalRef.current?.parentElement;
      if (!tablist) return;
      const triggers = Array.from(
        tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      );
      const currentIndex = triggers.indexOf(internalRef.current!);

      let nextIndex: number | null = null;
      if (e.key === "ArrowRight") nextIndex = (currentIndex + 1) % triggers.length;
      else if (e.key === "ArrowLeft")
        nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
      else if (e.key === "Home") nextIndex = 0;
      else if (e.key === "End") nextIndex = triggers.length - 1;

      if (nextIndex !== null) {
        e.preventDefault();
        const nextTrigger = triggers[nextIndex];
        nextTrigger.focus();
        nextTrigger.click();
      }
    };

    return (
      <button
        ref={setRefs}
        type="button"
        role="tab"
        id={triggerId}
        aria-selected={isSelected}
        aria-controls={panelId}
        tabIndex={isSelected ? 0 : -1}
        onClick={() => setValue(value)}
        onKeyDown={handleKeyDown}
        className={className}
        style={{
          padding: "8px 16px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          borderBottom: isSelected ? "2px solid #0079bf" : "2px solid transparent",
          fontWeight: isSelected ? 600 : 400,
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

export interface TabsPanelProps
  extends Omit<ComponentPropsWithoutRef<"div">, "value"> {
  value: string;
}

export const TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(
  ({ value, className, children, ...props }, ref) => {
    const { value: selected, baseId } = useTabsContext();
    const isSelected = selected === value;
    const triggerId = `${baseId}-trigger-${value}`;
    const panelId = `${baseId}-panel-${value}`;

    if (!isSelected) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={panelId}
        aria-labelledby={triggerId}
        tabIndex={0}
        className={className}
        style={{ padding: 16 }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsPanel.displayName = "TabsPanel";