import { forwardRef, useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import Icon from "./Icon";
import { getImageUrl } from "../services/recipeService";

const accents = [
    { wash: "from-forest/25 via-forest/10 to-transparent", icon: "text-forest-light" },
    { wash: "from-gold/30 via-gold/10 to-transparent", icon: "text-gold-light" },
    { wash: "from-rust/25 via-rust/10 to-transparent", icon: "text-rust" },
];

function pickAccent(seed) {
    const n = Number(seed) || String(seed ?? "").length;
    return accents[n % accents.length];
}

function ImageFallback({ recipe }) {
    const accent = pickAccent(recipe?.id);
    const initial = recipe?.title?.trim()?.[0]?.toUpperCase() || "?";

    return (
        <div className={`relative flex h-full w-full items-center justify-center bg-gradient-to-br ${accent.wash} bg-forest-dark`}>
            <Icon name="leaf" className={`absolute h-32 w-32 -rotate-12 opacity-20 ${accent.icon}`} strokeWidth={1} />
            <span className="font-display text-7xl font-semibold text-paper/90">{initial}</span>
        </div>
    );
}

// One physical page: the recipe's photo (left side of the spread)
const ImagePage = forwardRef(function ImagePage({ recipe }, ref) {
    const imageUrl = getImageUrl(recipe.image_url);

    // react-pageflip sets inline styles (display/position/height) directly on
    // this ref'd element, which would clobber Tailwind classes here — so this
    // node stays a plain, unstyled-by-us container and all real styling lives
    // on the inner div instead.
    return (
        <div ref={ref} className="h-full w-full overflow-hidden rounded-l-[22px] bg-forest-dark shadow-book sm:rounded-l-[26px]">
            <div className="relative h-full w-full">
                {imageUrl ? (
                    <img src={imageUrl} alt={recipe.title} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                    <ImageFallback recipe={recipe} />
                )}
                <div className="absolute -top-1 right-6 h-11 w-7 rounded-b-md bg-gold shadow-sm" />
            </div>
        </div>
    );
});

// One physical page: the recipe's details (right side of the spread)
const ContentPage = forwardRef(function ContentPage(
    { recipe, index, total, onEdit, onDelete, onDownloadPdf },
    ref
) {
    const [downloading, setDownloading] = useState(false);
    const [hasMoreBelow, setHasMoreBelow] = useState(false);
    const scrollRef = useRef(null);

    const handleDownload = async () => {
        if (downloading) return;
        setDownloading(true);
        try {
            await onDownloadPdf(recipe);
        } finally {
            setDownloading(false);
        }
    };

    const checkOverflow = () => {
        const el = scrollRef.current;
        if (!el) return;
        setHasMoreBelow(el.scrollHeight - el.scrollTop - el.clientHeight > 8);
    };

    useEffect(() => {
        checkOverflow();
        window.addEventListener("resize", checkOverflow);
        return () => window.removeEventListener("resize", checkOverflow);
    }, [recipe]);

    // Same reasoning as ImagePage: react-pageflip overrides this ref'd
    // element's inline style (including `display`), which silently breaks a
    // flex-column layout placed directly on it — so the flex layout lives on
    // an inner wrapper instead.
    return (
        <div ref={ref} className="h-full w-full overflow-hidden rounded-r-[22px] bg-card shadow-book paper-grain sm:rounded-r-[26px]">
            <div className="flex h-full w-full flex-col p-6 sm:p-9">
                <div className="flex-shrink-0">
                    <div className="flex items-start justify-between gap-3">
                        <h1 className="line-clamp-2 font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl">
                            {recipe.title}
                        </h1>

                        <div className="-mr-1 -mt-1 flex flex-shrink-0 items-center gap-1">
                            <button
                                onClick={handleDownload}
                                disabled={downloading}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-faint transition hover:bg-gold-50 hover:text-gold-dark disabled:opacity-50"
                                title="Download recipe as PDF"
                            >
                                <Icon name={downloading ? "loader" : "download"} className={`h-4 w-4 ${downloading ? "animate-spin" : ""}`} />
                            </button>
                            <button
                                onClick={() => onEdit(recipe)}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-faint transition hover:bg-forest-50 hover:text-forest"
                                title="Edit recipe"
                            >
                                <Icon name="pencil" className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => onDelete(recipe)}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-faint transition hover:bg-rust-50 hover:text-rust"
                                title="Delete recipe"
                            >
                                <Icon name="trash" className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-2 flex items-center gap-1.5 text-sm text-ink-soft">
                        <Icon name="users" className="h-4 w-4 flex-shrink-0 text-gold-dark" />
                        <span>
                            Serves <strong className="text-ink">{recipe.servings || "—"}</strong>
                        </span>
                    </div>
                </div>

                <div className="mt-4 h-px w-full flex-shrink-0 bg-gradient-to-r from-line via-line to-transparent" />

                {/* Scrolls internally so long recipes never overflow the page */}
                <div className="relative mt-5 min-h-0 flex-1">
                    <div ref={scrollRef} onScroll={checkOverflow} className="h-full overflow-y-auto pr-1">
                        <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-forest-dark">
                            Ingredients
                        </h2>
                        <ul className="space-y-2.5">
                            {recipe.ingredients?.length > 0 ? (
                                recipe.ingredients.map((ing, idx) => (
                                    <li key={idx} className="flex items-baseline justify-between gap-3 text-base text-ink">
                                        <span className="flex items-baseline gap-2">
                                            <span className="h-1.5 w-1.5 flex-shrink-0 translate-y-[-2px] rounded-full bg-gold" />
                                            <span className="capitalize">{ing.name}</span>
                                        </span>
                                        <span className="flex-1 border-b border-dotted border-line translate-y-[-4px]" />
                                        <span className="flex-shrink-0 font-semibold text-ink-soft">
                                            {ing.quantity} {ing.unit}
                                        </span>
                                    </li>
                                ))
                            ) : (
                                <p className="text-base italic text-ink-faint">No ingredients added</p>
                            )}
                        </ul>

                        <h2 className="mb-3 mt-6 text-sm font-bold uppercase tracking-widest text-forest-dark">
                            Method
                        </h2>
                        <ol className="space-y-4">
                            {recipe.steps?.length > 0 ? (
                                recipe.steps.map((step, idx) => (
                                    <li key={idx} className="flex gap-3.5">
                                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-forest text-xs font-bold text-paper">
                                            {idx + 1}
                                        </span>
                                        <span className="pt-0.5 text-base leading-relaxed text-ink">
                                            {step.instruction || step}
                                        </span>
                                    </li>
                                ))
                            ) : (
                                <p className="text-base italic text-ink-faint">No steps added</p>
                            )}
                        </ol>
                    </div>

                    {hasMoreBelow && (
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center rounded-b-xl bg-gradient-to-t from-card via-card/90 to-transparent pb-1 pt-8">
                            <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-gold-dark">
                                <Icon name="chevronRight" className="h-3 w-3 rotate-90" strokeWidth={2.4} />
                                More below
                            </span>
                        </div>
                    )}
                </div>

                <div className="mt-4 flex-shrink-0 border-t border-line pt-4 text-center font-display text-sm italic text-ink-faint">
                    Recipe {index + 1} of {total}
                </div>
            </div>
        </div>
    );
});

export default function FlipBook({ recipes, startPage = 0, onEdit, onDelete, onDownloadPdf }) {
    const bookRef = useRef(null);
    const [pageIndex, setPageIndex] = useState(startPage);
    const lastPage = recipes.length * 2 - 1;

    const flipPrev = () => bookRef.current?.pageFlip()?.flipPrev();
    const flipNext = () => bookRef.current?.pageFlip()?.flipNext();

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "ArrowLeft") flipPrev();
            if (e.key === "ArrowRight") flipNext();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <div className="flex w-full flex-col items-center px-2">
            <div className="flex w-full max-w-6xl items-center justify-center gap-1 sm:gap-6">
                <button
                    onClick={flipPrev}
                    disabled={pageIndex <= 0}
                    className="group flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-line bg-card text-forest shadow-soft transition hover:-translate-x-0.5 hover:border-forest disabled:pointer-events-none disabled:opacity-30 sm:h-12 sm:w-12"
                    title="Previous recipe"
                >
                    <Icon name="chevronLeft" className="h-5 w-5" />
                </button>

                <div className="relative w-full max-w-5xl">
                    <div className="absolute inset-x-3 -bottom-3 h-full rounded-[26px] bg-forest-dark/25 blur-sm" />
                    <div className="absolute inset-x-1.5 -bottom-1.5 h-full rounded-[26px] bg-forest/30" />

                    <div className="relative mx-auto flex justify-center rounded-[26px] bg-forest-dark/90 p-1">
                        <HTMLFlipBook
                            ref={bookRef}
                            width={940}
                            height={940}
                            size="stretch"
                            minWidth={220}
                            maxWidth={560}
                            minHeight={420}
                            maxHeight={820}
                            showCover={false}
                            usePortrait={true}
                            mobileScrollSupport={true}
                            disableFlipByClick={true}
                            flippingTime={650}
                            maxShadowOpacity={0.35}
                            startPage={startPage}
                            onFlip={(e) => setPageIndex(e.data)}
                            className="mx-auto"
                        >
                            {recipes.flatMap((recipe, index) => [
                                <ImagePage recipe={recipe} key={`img-${recipe.id}`} />,
                                <ContentPage
                                    recipe={recipe}
                                    index={index}
                                    total={recipes.length}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onDownloadPdf={onDownloadPdf}
                                    key={`content-${recipe.id}`}
                                />,
                            ])}
                        </HTMLFlipBook>
                    </div>
                </div>

                <button
                    onClick={flipNext}
                    disabled={pageIndex >= lastPage}
                    className="group flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-line bg-card text-forest shadow-soft transition hover:translate-x-0.5 hover:border-forest disabled:pointer-events-none disabled:opacity-30 sm:h-12 sm:w-12"
                    title="Next recipe"
                >
                    <Icon name="chevronRight" className="h-5 w-5" />
                </button>
            </div>

            {recipes.length > 1 && recipes.length <= 20 && (
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                    {recipes.map((recipe, idx) => (
                        <span
                            key={recipe.id}
                            className={`h-1.5 rounded-full transition-all ${
                                idx === Math.floor(pageIndex / 2) ? "w-6 bg-gold" : "w-1.5 bg-line"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
