import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import RecipeForm from "../components/RecipeForm";
import { createRecipe } from "../services/recipeService";
import { useToast } from "../context/useToast";

export default function AddRecipe() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (payload, imageFile) => { //payload means the form data
        setError(null);
        try {
            setLoading(true);
            const created = await createRecipe(payload, imageFile);

            showToast(`"${payload.title}" was added to your cookbook.`);
            navigate(`/recipes?open=${created.recipeId}`);
        } catch (err) {
            setError("Couldn't save this recipe. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] bg-paper px-4 py-14 sm:py-20">
            <div className="mx-auto max-w-3xl">
                <div className="mb-10 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rust-50 text-rust">
                        <Icon name="pencil" className="h-7 w-7" strokeWidth={1.6} />
                    </div>
                    <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
                        Add a New Recipe
                    </h1>
                    <p className="mt-3 text-base text-ink-soft">
                        Write it down while it's fresh — future you will thank you.
                    </p>
                </div>

                <div className="rounded-3xl border border-line bg-card p-6 shadow-soft sm:p-10">
                    <RecipeForm
                        submitLabel="Save recipe"
                        loading={loading}
                        error={error}
                        onSubmit={handleSubmit}
                        onCancel={() => navigate("/recipes")}
                    />
                </div>
            </div>
        </div>
    );
}
