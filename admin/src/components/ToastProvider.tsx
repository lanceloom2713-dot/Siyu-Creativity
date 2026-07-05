import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

type Toast = {
  id: string;
  message: string;
  type: "success" | "error";
};

type ToastContextValue = {
  notify: (message: string, type?: Toast["type"]) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const value = useMemo(
    () => ({
      notify: (message: string, type: Toast["type"] = "success") => {
        const id = crypto.randomUUID();
        setToasts((items) => [...items, { id, message, type }]);
        window.setTimeout(() => {
          setToasts((items) => items.filter((toast) => toast.id !== id));
        }, 3200);
      }
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-5 top-5 z-50 grid w-[min(360px,calc(100vw-40px))] gap-3">
        {toasts.map((toast) => {
          const Icon = toast.type === "success" ? CheckCircle2 : XCircle;
          return (
            <div className="flex items-start gap-3 rounded-lg border border-ink/10 bg-panel p-4 text-sm font-semibold text-ink shadow-panel" key={toast.id}>
              <Icon className={toast.type === "success" ? "text-green-700" : "text-red-600"} size={18} />
              <p>{toast.message}</p>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
