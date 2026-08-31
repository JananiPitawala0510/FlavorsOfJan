import { useCallback, useRef, useState } from "react";
import Icon from "../components/Icon";
import { ToastContext } from "./useToast";

let idSeq = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timers = useRef({});

    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        clearTimeout(timers.current[id]);
        delete timers.current[id];
    }, []);

    const showToast = useCallback((message, type = "success") => {
        const id = ++idSeq;
        setToasts((prev) => [...prev, { id, message, type }]);
        timers.current[id] = setTimeout(() => dismiss(id), 3600);
    }, [dismiss]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex flex-col items-center gap-3 px-4">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`pointer-events-auto flex items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-lift animate-fade-up ${
                            t.type === "error"
                                ? "border-rust/30 bg-rust-50 text-rust-dark"
                                : "border-forest/20 bg-card text-ink"
                        }`}
                    >
                        <span
                            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${
                                t.type === "error" ? "bg-rust text-white" : "bg-forest text-paper"
                            }`}
                        >
                            <Icon
                                name={t.type === "error" ? "alert" : "check"}
                                className="h-4 w-4"
                                strokeWidth={2}
                            />
                        </span>
                        <p className="text-sm font-medium">{t.message}</p>
                        <button
                            onClick={() => dismiss(t.id)}
                            className="ml-1 text-ink-faint hover:text-ink"
                        >
                            <Icon name="close" className="h-3.5 w-3.5" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
