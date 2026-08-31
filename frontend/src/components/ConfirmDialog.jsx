import { useEffect } from "react";
import Icon from "./Icon";
import Button from "./Button";

export default function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    tone = "danger",
    loading = false,
    onConfirm,
    onCancel,
}) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onCancel?.();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onCancel]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in"
                onClick={onCancel}
            />

            <div className="relative w-full max-w-sm rounded-3xl bg-card p-7 shadow-book animate-scale-in">
                <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${
                        tone === "danger" ? "bg-rust-50 text-rust" : "bg-gold-50 text-gold-dark"
                    }`}
                >
                    <Icon name="alert" className="h-6 w-6" strokeWidth={1.6} />
                </div>

                <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
                {description && (
                    <p className="mt-2 text-sm leading-6 text-ink-soft">{description}</p>
                )}

                <div className="mt-6 flex gap-3">
                    <Button variant="ghost" className="flex-1" onClick={onCancel}>
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={tone === "danger" ? "danger" : "primary"}
                        className={`flex-1 ${tone === "danger" ? "!bg-rust !text-white !border-rust hover:!bg-rust-dark" : ""}`}
                        onClick={onConfirm}
                        loading={loading}
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}
