import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Icon from "../components/Icon";
import RecipeForm from "../components/RecipeForm";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { fetchRecipeById, updateRecipe, getImageUrl } from "../services/recipeService";
import { useToast } from "../context/useToast";

export default function EditRecipe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [initialData, setInitialData] = useState(null);
    const [fetchError, setFetchError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saveError, setSaveError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const recipe = await fetchRecipeById(id);
                if (cancelled) return;
                setInitialData({
                    title: recipe.title || "",
                    servings: recipe.servings || "",
                    ingredients:
                        recipe.ingredients?.length > 0
                            ? recipe.ingredients.map((ing) => ({
                                  name: ing.name,
                                  quantity: ing.quantity,
                                  unit: ing.unit,
                              }))
                            : [{ name: "", quantity: "", unit: "g" }],
                    steps:
                        recipe.steps?.length > 0
                            ? recipe.steps.map((s) => s.instruction || s)
                            : [""],
                    imageUrl: getImageUrl(recipe.image_url),
                });
            } catch (err) {
                if (!cancelled) setFetchError("This recipe couldn't be found.");
                console.error(err);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [id]);

    const handleSubmit = async (payload, imageFile, removeImage) => {
        setSaveError(null);
        try {
            setLoading(true);
            await updateRecipe(id, payload, imageFile, removeImage);
            showToast(`"${payload.title}" was updated.`);
            navigate("/recipes");
        } catch (err) {
            setSaveError("Couldn't save your changes. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (fetchError) {
        return (
            <div className="flex min-h-[80vh] items-center justify-center bg-paper px-6">
                <EmptyState
                    tone="error"
                    title="Recipe not found"
                    description={fetchError}
                    actionLabel="Back to recipe book"
                    actionTo="/recipes"
                />
            </div>
        );
    }

    if (!initialData) {
        return (
            <div className="min-h-[80vh] bg-paper">
                <Loader label="Fetching your recipe…" fullscreen />
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] bg-paper px-4 py-14 sm:py-20">
            <div className="mx-auto max-w-3xl">
                <div className="mb-10 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-50 text-forest">
                        <Icon name="pencil" className="h-7 w-7" strokeWidth={1.6} />
                    </div>
                    <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
                        Edit Recipe
                    </h1>
                    <p className="mt-3 text-base text-ink-soft">
                        Refine {initialData.title ? `"${initialData.title}"` : "your recipe"} to
                        get it just right.
                    </p>
                </div>

                <div className="rounded-3xl border border-line bg-card p-6 shadow-soft sm:p-10">
                    <RecipeForm
                        initialData={initialData}
                        submitLabel="Save changes"
                        loading={loading}
                        error={saveError}
                        onSubmit={handleSubmit}
                        onCancel={() => navigate("/recipes")}
                    />
                </div>
            </div>
        </div>
    );
}
