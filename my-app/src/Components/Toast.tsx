import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";

export type ToastVariant = "default" | "success" | "error" | "warning";

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastMessage extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

function ToastItem({
  message,
  onDismiss,
}: {
  message: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const duration = message.duration ?? 3000;
    if (duration === Infinity) return;

    const timer = setTimeout(() => {
      onDismiss(message.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [message.id, message.duration, onDismiss]);

  const colors: Record<ToastVariant, string> = {
    default: "#fff",
    success: "#f0fdf4",
    error: "#fef2f2",
    warning: "#fffbeb",
  };

  const borders: Record<ToastVariant, string> = {
    default: "#e2e8f0",
    success: "#bbf7d0",
    error: "#fecaca",
    warning: "#fde68a",
  };

  const textColors: Record<ToastVariant, string> = {
    default: "#0f172a",
    success: "#166534",
    error: "#991b1b",
    warning: "#92400e",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        background: colors[message.variant || "default"],
        border: `1px solid ${borders[message.variant || "default"]}`,
        color: textColors[message.variant || "default"],
        borderRadius: 8,
        padding: "12px 16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
        width: 320,
        animation: "slideIn 0.2s ease-out",
      }}
    >
      <div>
        <strong style={{ display: "block", fontSize: 14, marginBottom: 2 }}>
          {message.title}
        </strong>
        {message.description && (
          <span style={{ fontSize: 13, opacity: 0.9 }}>{message.description}</span>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(message.id)}
        aria-label="Close notification"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "inherit",
          opacity: 0.5,
          fontSize: 16,
          padding: 0,
          lineHeight: 1,
        }}
      >
        ✕
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const toast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    setMessages((prev) => [...prev, { id, ...options }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            zIndex: 9999,
          }}
        >
          {messages.map((m) => (
            <ToastItem key={m.id} message={m} onDismiss={dismiss} />
          ))}
        </div>,
        document.body
      )}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}