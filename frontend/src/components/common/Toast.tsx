import { createContext, useCallback, useContext, useRef, useState } from "react";
import type { ReactNode } from "react";
import styles from "./Toast.module.css";

type ToastType = "success" | "error";
type ToastItem = { id: number; message: string; type: ToastType };

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast는 ToastProvider 내부에서만 사용할 수 있습니다.");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={styles.viewport} role="status" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${styles.toast} ${t.type === "error" ? styles.error : styles.success}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
