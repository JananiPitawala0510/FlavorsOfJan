import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FlipBook from "../components/FlipBook";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import { fetchRecipes, fetchRecipeById, deleteRecipe } from "../services/recipeService";
import { useToast } from "../context/useToast";

export default function RecipeBook() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [searchParams, setSearchParams] = useSearchParams();

    const [recipes, setRecipes] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeRecipe, setActiveRecipe] = useState(null);
    const [pageLoading, setPageLoading] = useState(false);
    const cache = useRef(new Map());

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadRecipes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadRecipes = async () => {
        try {
            setLoading(true);
            const data = await fetchRecipes();
            setRecipes(data);
            setError(null);

            const openId = searchParams.get("open");
            if (openId) {
                const idx = data.findIndex((r) => String(r.id) === String(openId));
                if (idx >= 0) setCurrentIndex(idx);
                setSearchParams({}, { replace: true });
            }
        } catch (err) {
            setError("Could not reach the kitchen. Make sure the backend is running.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadActiveRecipe = useCallback(async (id) => {
        if (!id) return;
        if (cache.current.has(id)) {
            setActiveRecipe(cache.current.get(id));
            return;
        }
        try {
            setPageLoading(true);
            const detail = await fetchRecipeById(id);
            cache.current.set(id, detail);
            setActiveRecipe(detail);
        } catch (err) {
            console.error(err);
            setActiveRecipe(null);
        } finally {
            setPageLoading(false);
        }
    }, []);

    useEffect(() => {
        const current = recipes[currentIndex];
        if (current) loadActiveRecipe(current.id);
    }, [currentIndex, recipes, loadActiveRecipe]);

    useEffect(() => {
        if (currentIndex > recipes.length - 1) {
            setCurrentIndex(Math.max(0, recipes.length - 1));
        }
    }, [recipes, currentIndex]);

    const handlePrevPage = useCallback(() => {
        setCurrentIndex((i) => Math.max(0, i - 1));
    }, []);

    const handleNextPage = useCallback(() => {
        setCurrentIndex((i) => Math.min(recipes.length - 1, i + 1));
    }, [recipes.length]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "ArrowLeft") handlePrevPage();
            if (e.key === "ArrowRight") handleNextPage();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [handlePrevPage, handleNextPage]);

    const handleEdit = () => {
        const current = recipes[currentIndex];
        if (current) navigate(`/edit/${current.id}`);
    };

    const handleDeleteConfirmed = async () => {
        const current = recipes[currentIndex];
        if (!current) return;
        try {
            setDeleting(true);
            await deleteRecipe(current.id);
            cache.current.delete(current.id);
            setRecipes((prev) => prev.filter((r) => r.id !== current.id));
            showToast(`"${current.title}" was removed from your book.`);
            setConfirmOpen(false);
        } catch (err) {
            console.error(err);
            showToast("Couldn't delete that recipe. Please try again.", "error");
        } finally {
            setDeleting(false);
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
                    Use the arrows — or your keyboard's ← and → — to turn the page.
                </p>
            </div>

            <FlipBook
                recipe={activeRecipe}
                loading={pageLoading}
                currentIndex={currentIndex}
                total={recipes.length}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
                onEdit={handleEdit}
                onDelete={() => setConfirmOpen(true)}
            />

            <ConfirmDialog
                open={confirmOpen}
                title="Delete this recipe?"
                description={`"${recipes[currentIndex]?.title}" will be permanently removed from your cookbook. This can't be undone.`}
                confirmLabel="Delete recipe"
                loading={deleting}
                onConfirm={handleDeleteConfirmed}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
}
