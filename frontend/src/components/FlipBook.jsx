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
            <Icon name="leaf" className={`absolute h-40 w-40 -rotate-12 opacity-20 ${accent.icon}`} strokeWidth={1} />
            <span className="font-display text-8xl font-semibold text-paper/90">{initial}</span>
        </div>
    );
}

export default function FlipBook({
    recipe,
    loading,
    currentIndex,
    total,
    onPrevPage,
    onNextPage,
    onEdit,
    onDelete,
}) {
    const imageUrl = recipe ? getImageUrl(recipe.image_url) : null;

    return (
        <div className="book-stage flex w-full flex-col items-center px-2">
            <div className="flex w-full max-w-5xl items-center justify-center gap-3 sm:gap-6">
                {/* Left control */}
                <button
                    onClick={onPrevPage}
                    disabled={currentIndex === 0}
                    className="group flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-line bg-card text-forest shadow-soft transition hover:-translate-x-0.5 hover:border-forest disabled:pointer-events-none disabled:opacity-30 sm:h-12 sm:w-12"
                    title="Previous recipe"
                >
                    <Icon name="chevronLeft" className="h-5 w-5" />
                </button>

                {/* Book spread */}
                <div className="relative w-full max-w-4xl">
                    <div className="absolute inset-x-3 -bottom-3 h-full rounded-[28px] bg-forest-dark/25 blur-sm" />
                    <div className="absolute inset-x-1.5 -bottom-1.5 h-full rounded-[28px] bg-forest/30" />

                    <div
                        key={currentIndex}
                        className="relative flex min-h-[560px] flex-col overflow-hidden rounded-[28px] border border-line bg-card shadow-book animate-fade-in sm:flex-row sm:min-h-[540px]"
                    >
                        {loading ? (
                            <div className="flex h-full min-h-[560px] w-full items-center justify-center sm:min-h-[540px]">
                                <div className="flex flex-col items-center gap-3 text-forest">
                                    <Icon name="loader" className="h-8 w-8 animate-spin text-gold" />
                                    <p className="font-display italic text-ink-soft">Turning the page…</p>
                                </div>
                            </div>
                        ) : !recipe ? (
                            <div className="flex h-full min-h-[560px] w-full items-center justify-center sm:min-h-[540px]">
                                <p className="font-display text-xl italic text-ink-soft">Recipe not found.</p>
                            </div>
                        ) : (
                            <>
                                {/* Spine */}
                                <div className="pointer-events-none absolute inset-y-6 left-[42%] hidden w-px bg-gradient-to-b from-transparent via-line to-transparent sm:block" />

                                {/* Left page: photo */}
                                <div className="relative h-56 w-full flex-shrink-0 sm:h-auto sm:w-[42%]">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={recipe.title}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <ImageFallback recipe={recipe} />
                                    )}
                                    <div className="absolute -top-1 right-6 h-12 w-7 rounded-b-md bg-gold shadow-sm" />
                                </div>

                                {/* Right page: recipe */}
                                <div className="flex flex-1 flex-col p-6 paper-grain sm:p-9">
                                    <div className="mb-4 flex items-start justify-between gap-3">
                                        <div>
                                            <h1 className="font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl">
                                                {recipe.title}
                                            </h1>
                                            <div className="mt-2 flex items-center gap-2 text-sm text-ink-soft">
                                                <Icon name="users" className="h-4 w-4 text-gold-dark" />
                                                <span>
                                                    Serves <strong className="text-ink">{recipe.servings || "—"}</strong>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-shrink-0 items-center gap-1">
                                            <button
                                                onClick={onEdit}
                                                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-faint transition hover:bg-forest-50 hover:text-forest"
                                                title="Edit recipe"
                                            >
                                                <Icon name="pencil" className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={onDelete}
                                                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-faint transition hover:bg-rust-50 hover:text-rust"
                                                title="Delete recipe"
                                            >
                                                <Icon name="trash" className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="h-px w-full bg-gradient-to-r from-line via-line to-transparent" />

                                    <div className="mt-5">
                                        <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-forest-dark">
                                            Ingredients
                                        </h2>
                                        <ul className="space-y-2.5">
                                            {recipe.ingredients?.length > 0 ? (
                                                recipe.ingredients.map((ing, idx) => (
                                                    <li key={idx} className="flex items-baseline justify-between gap-3 text-ink">
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
                                                <p className="italic text-ink-faint">No ingredients added</p>
                                            )}
                                        </ul>
                                    </div>

                                    <div className="mt-6">
                                        <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-forest-dark">
                                            Method
                                        </h2>
                                        <ol className="space-y-3.5">
                                            {recipe.steps?.length > 0 ? (
                                                recipe.steps.map((step, idx) => (
                                                    <li key={idx} className="flex gap-3">
                                                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-forest text-xs font-bold text-paper">
                                                            {idx + 1}
                                                        </span>
                                                        <span className="pt-0.5 text-sm leading-relaxed text-ink">
                                                            {step.instruction || step}
                                                        </span>
                                                    </li>
                                                ))
                                            ) : (
                                                <p className="italic text-ink-faint">No steps added</p>
                                            )}
                                        </ol>
                                    </div>

                                    <div className="flex-1" />

                                    <div className="mt-4 border-t border-line pt-4 text-center font-display text-xs italic text-ink-faint">
                                        Page {currentIndex + 1} of {total}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Right control */}
                <button
                    onClick={onNextPage}
                    disabled={currentIndex === total - 1}
                    className="group flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-line bg-card text-forest shadow-soft transition hover:translate-x-0.5 hover:border-forest disabled:pointer-events-none disabled:opacity-30 sm:h-12 sm:w-12"
                    title="Next recipe"
                >
                    <Icon name="chevronRight" className="h-5 w-5" />
                </button>
            </div>

            {/* Progress dots */}
            {total > 1 && total <= 20 && (
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                    {Array.from({ length: total }).map((_, idx) => (
                        <span
                            key={idx}
                            className={`h-1.5 rounded-full transition-all ${
                                idx === currentIndex ? "w-6 bg-gold" : "w-1.5 bg-line"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
