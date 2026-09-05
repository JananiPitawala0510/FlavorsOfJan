import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FlipBook from "../components/FlipBook";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import { fetchRecipes, fetchRecipeById, deleteRecipe } from "../services/recipeService";
import { downloadRecipePdf } from "../utils/generateRecipePdf";
import { useToast } from "../context/useToast";

export default function RecipeBook() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [searchParams, setSearchParams] = useSearchParams();

    const [recipes, setRecipes] = useState([]);
    const [startPage, setStartPage] = useState(0);
    const [bookKey, setBookKey] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [recipeToDelete, setRecipeToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const loadRecipes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const list = await fetchRecipes();
            const details = await Promise.all(list.map((r) => fetchRecipeById(r.id)));

            const openId = searchParams.get("open");
            const openIndex = openId ? details.findIndex((r) => String(r.id) === String(openId)) : -1;
            if (openId) setSearchParams({}, { replace: true });

            setRecipes(details);
            setStartPage(openIndex >= 0 ? openIndex * 2 : 0);
            setBookKey((k) => k + 1);
        } catch (err) {
            setError("Could not reach the kitchen. Make sure the backend is running.");
            console.error(err);
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        loadRecipes();
    }, [loadRecipes]);

    const handleEdit = (recipe) => navigate(`/edit/${recipe.id}`);

    const handleDeleteConfirmed = async () => {
        if (!recipeToDelete) return;
        try {
            setDeleting(true);
            await deleteRecipe(recipeToDelete.id);

            const deletedIndex = recipes.findIndex((r) => r.id === recipeToDelete.id);
            const remaining = recipes.filter((r) => r.id !== recipeToDelete.id);
            const nextIndex = Math.max(0, Math.min(deletedIndex, remaining.length - 1));

            setRecipes(remaining);
            setStartPage(nextIndex * 2);
            setBookKey((k) => k + 1);
            showToast(`"${recipeToDelete.title}" was removed from your book.`);
            setRecipeToDelete(null);
        } catch (err) {
            console.error(err);
            showToast("Couldn't delete that recipe. Please try again.", "error");
        } finally {
            setDeleting(false);
        }
    };

    const handleDownloadPdf = async (recipe) => {
        try {
            await downloadRecipePdf(recipe);
        } catch (err) {
            console.error(err);
            showToast("Couldn't generate the PDF. Please try again.", "error");
        }
    };

    if (loading) {
        return (
            <div className="min-h-[80vh] bg-paper">
                <Loader label="Opening your cookbook…" fullscreen />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[80vh] items-center justify-center bg-paper px-6">
                <EmptyState
                    tone="error"
                    title="The book won't open"
                    description={error}
                    actionLabel="Try again"
                    onAction={loadRecipes}
                />
            </div>
        );
    }

    if (recipes.length === 0) {
        return (
            <div className="flex min-h-[80vh] items-center justify-center bg-paper px-6">
                <EmptyState
                    icon="book"
                    title="Your cookbook is empty"
                    description="Add your first recipe and it'll appear here, ready to flip through."
                    actionLabel="Add a recipe"
                    actionTo="/add"
                />
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] bg-paper px-4 py-14 sm:py-20">
            <div className="mx-auto mb-10 max-w-2xl text-center">
                <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
                    Your Recipe Book
                </h1>
                <p className="mt-2 text-sm text-ink-soft">
                    Drag a page corner, use the arrows, or your keyboard's ← and → to turn the page.
                </p>
            </div>

            <FlipBook
                key={bookKey}
                recipes={recipes}
                startPage={startPage}
                onEdit={handleEdit}
                onDelete={setRecipeToDelete}
                onDownloadPdf={handleDownloadPdf}
            />

            <ConfirmDialog
                open={!!recipeToDelete}
                title="Delete this recipe?"
                description={`"${recipeToDelete?.title}" will be permanently removed from your cookbook. This can't be undone.`}
                confirmLabel="Delete recipe"
                loading={deleting}
                onConfirm={handleDeleteConfirmed}
                onCancel={() => setRecipeToDelete(null)}
            />
        </div>
    );
}
