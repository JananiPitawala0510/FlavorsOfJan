import Icon from "./Icon";
import Button from "./Button";

export default function EmptyState({
    icon = "book",
    title,
    description,
    actionLabel,
    actionTo,
    onAction,
    tone = "default",
}) {
    const isError = tone === "error";

    return (
        <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-line bg-card p-10 text-center shadow-soft animate-fade-up">
            <div
                className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${
                    isError ? "bg-rust-50 text-rust" : "bg-gold-50 text-gold-dark"
                }`}
            >
                <Icon name={isError ? "alert" : icon} className="h-8 w-8" strokeWidth={1.6} />
            </div>

            <h3 className="font-display text-2xl font-semibold text-ink">{title}</h3>

            {description && (
                <p className="mt-2 text-sm leading-6 text-ink-soft">{description}</p>
            )}

            {(actionLabel && (actionTo || onAction)) && (
                <div className="mt-6">
                    <Button
                        to={actionTo}
                        onClick={onAction}
                        variant={isError ? "danger" : "primary"}
                        icon={isError ? undefined : "arrowRight"}
                        iconPosition="right"
                    >
                        {actionLabel}
                    </Button>
                </div>
            )}
        </div>
    );
}
