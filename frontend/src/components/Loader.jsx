import Icon from "./Icon";

export default function Loader({ label = "Loading…", fullscreen = false }) {
    const content = (
        <div className="flex flex-col items-center gap-4 text-forest">
            <div className="relative flex h-16 w-16 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/20" />
                <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-card shadow-soft">
                    <Icon name="book" className="h-6 w-6 text-gold" strokeWidth={1.6} />
                </span>
            </div>
            <p className="font-display text-lg italic text-ink-soft">{label}</p>
        </div>
    );

    if (fullscreen) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center px-6">
                {content}
            </div>
        );
    }

    return content;
}
