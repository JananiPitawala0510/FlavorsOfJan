import { Link } from "react-router-dom";
import Icon from "./Icon";

const accents = [
    { bg: "bg-forest-50", text: "text-forest-dark", ring: "stroke-forest" },
    { bg: "bg-gold-50", text: "text-gold-dark", ring: "stroke-gold" },
    { bg: "bg-rust-50", text: "text-rust-dark", ring: "stroke-rust" },
];

function pickAccent(seed) {
    const n = typeof seed === "number" ? seed : String(seed).length;
    return accents[n % accents.length];
}

export default function RecipeCard({ recipe }) {
    const accent = pickAccent(recipe.recipeId ?? recipe.title);
    const pct = recipe.matchPercentage ?? 0;
    const circumference = 2 * Math.PI * 20;
    const offset = circumference - (pct / 100) * circumference;

    return (
        <Link
            to={`/recipes?open=${recipe.recipeId}`}
            className="group flex items-center gap-5 rounded-2xl border border-line bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
        >
            <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center">
                <svg viewBox="0 0 48 48" className="h-14 w-14 -rotate-90">
                    <circle cx="24" cy="24" r="20" fill="none" strokeWidth="4" className="stroke-paper-deep" />
                    <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        strokeWidth="4"
                        strokeLinecap="round"
                        className={accent.ring}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)" }}
                    />
                </svg>
                <span className={`absolute text-xs font-bold ${accent.text}`}>{pct}%</span>
            </div>

            <div className="min-w-0 flex-1">
                <h3 className="truncate font-display text-lg font-semibold text-ink group-hover:text-forest">
                    {recipe.title}
                </h3>
                <p className="mt-1 text-sm text-ink-soft">
                    {recipe.matchCount} of {recipe.totalIngredients} ingredients on hand
                </p>
            </div>

            <Icon
                name="chevronRight"
                className="h-5 w-5 flex-shrink-0 text-ink-faint transition group-hover:translate-x-1 group-hover:text-forest"
            />
        </Link>
    );
}
