import { useState } from "react";
import Icon from "../components/Icon";
import Button from "../components/Button";
import TagInput from "../components/TagInput";
import RecipeCard from "../components/RecipeCard";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import { matchRecipes } from "../services/recipeService";

export default function Match() {
    const [ingredients, setIngredients] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState(null);

    const addIngredient = (ing) => setIngredients((prev) => [...prev, ing]); // udsed to add ingredients to the list of ingredients in the state, by appending the new ingredient to the previous list of ingredients.
    const removeIngredient = (ing) =>
        setIngredients((prev) => prev.filter((i) => i !== ing));

    const handleSearch = async (e) => {
        e.preventDefault();

        if (ingredients.length === 0) {
            setError("Add at least one ingredient to search with.");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const results = await matchRecipes(ingredients);
            setMatches(results);
            setSearched(true);
        } catch (err) {
            setError("Couldn't search recipes right now. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] bg-paper px-4 py-14 sm:py-20">
            <div className="mx-auto max-w-3xl">
                {/* Header */}
                <div className="mb-10 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-50 text-forest">
                        <Icon name="carrot" className="h-7 w-7" strokeWidth={1.6} />
                    </div>
                    <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
                        What's in your kitchen?
                    </h1>
                    <p className="mt-3 text-base text-ink-soft">
                        Add the ingredients you have on hand, and we'll find the recipes that
                        fit best.
                    </p>
                </div>

                {/* Search form */}
                <form
                    onSubmit={handleSearch}
                    className="rounded-3xl border border-line bg-card p-6 shadow-soft sm:p-8"
                >
                    <label className="mb-3 block text-sm font-semibold uppercase tracking-wide text-ink-soft">
                        Your ingredients
                    </label>

                    <TagInput
                        tags={ingredients}
                        onAdd={addIngredient}
                        onRemove={removeIngredient}
                        placeholder="Type an ingredient and press Enter…"
                    />

                    <Button type="submit" className="mt-5 w-full" size="lg" loading={loading} icon="search">
                        {loading ? "Searching your cookbook…" : "Find matching recipes"}
                    </Button>
                </form>

                {/* Error */}
                {error && (
                    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-rust/30 bg-rust-50 p-4 text-rust-dark">
                        <Icon name="alert" className="mt-0.5 h-5 w-5 flex-shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Results */}
                <div className="mt-10">
                    {loading ? (
                        <Loader label="Comparing your pantry to the cookbook…" />
                    ) : searched ? (
                        matches.length > 0 ? (
                            <>
                                <h2 className="mb-5 font-display text-2xl font-semibold text-ink">
                                    {matches.length} recipe{matches.length !== 1 ? "s" : ""} found
                                </h2>
                                <div className="space-y-4">
                                    {matches.map((recipe) => (
                                        <RecipeCard key={recipe.recipeId} recipe={recipe} /> // maps the recipes to the RecipeCard component means that the RecipeCard component will be rendered for each recipe in the matches array when clicked, the recipe will be passed as a prop to the RecipeCard component
                                    ))} 
                                </div> 
                            </> 
                        ) : (
                            <EmptyState
                                icon="search"
                                title="No matches yet"
                                description="Try adding a few more ingredients, or add new recipes to your book."
                                actionLabel="Add a recipe"
                                actionTo="/add"
                            />
                        )
                    ) : (
                        <EmptyState
                            icon="leaf"
                            title="Ready when you are"
                            description="Add a few ingredients above to see which recipes you can cook right now."
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
