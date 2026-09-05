import { useRef, useState } from "react";
import Icon from "./Icon";
import Button from "./Button";

const UNITS = ["g", "kg", "ml", "l", "cup", "tbsp", "tsp", "pcs"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export default function RecipeForm({ initialData, submitLabel, loading, error, onSubmit, onCancel }) {
    const [formData, setFormData] = useState(
        initialData || {
            title: "",
            servings: "",
            ingredients: [{ name: "", quantity: "", unit: "g" }],
            steps: [""],
        }
    );
    const [formError, setFormError] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || null);
    const [imageRemoved, setImageRemoved] = useState(false);
    const fileInputRef = useRef(null);

    const handlePhotoSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setFormError("Please choose an image file.");
            return;
        }
        if (file.size > MAX_IMAGE_BYTES) {
            setFormError("Photos must be 5MB or smaller.");
            return;
        }

        setFormError(null);
        setImageFile(file);
        setImageRemoved(false);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleRemovePhoto = () => {
        setImageFile(null);
        setImagePreview(null);
        setImageRemoved(true);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleIngredientChange = (index, field, value) => {
        const next = [...formData.ingredients];
        next[index] = {
            ...next[index],
            [field]: field === "quantity" ? (value ? parseFloat(value) : "") : value,
        };
        setFormData({ ...formData, ingredients: next });
    };

    const addIngredient = () =>
        setFormData({
            ...formData,
            ingredients: [...formData.ingredients, { name: "", quantity: "", unit: "g" }],
        });

    const removeIngredient = (index) =>
        setFormData({
            ...formData,
            ingredients: formData.ingredients.filter((_, i) => i !== index),
        });

    const handleStepChange = (index, value) => {
        const next = [...formData.steps];
        next[index] = value;
        setFormData({ ...formData, steps: next });
    };

    const addStep = () => setFormData({ ...formData, steps: [...formData.steps, ""] });

    const removeStep = (index) =>
        setFormData({ ...formData, steps: formData.steps.filter((_, i) => i !== index) });

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError(null);

        if (!formData.title.trim()) {
            setFormError("Please give your recipe a title.");
            return;
        }

        const validIngredients = formData.ingredients.filter(
            (ing) => ing.name.trim() && ing.quantity && ing.unit.trim()
        );
        const validSteps = formData.steps.filter((step) => step.trim());

        if (validIngredients.length === 0) {
            setFormError("Add at least one complete ingredient.");
            return;
        }
        if (validSteps.length === 0) {
            setFormError("Add at least one step.");
            return;
        }

        onSubmit(
            {
                title: formData.title.trim(),
                servings: formData.servings || null,
                ingredients: validIngredients,
                steps: validSteps,
            },
            imageFile,
            imageRemoved
        );
    };

    const displayError = error || formError;

    return (
        <form onSubmit={handleSubmit} className="space-y-10">
            {displayError && (
                <div className="flex items-start gap-3 rounded-2xl border border-rust/30 bg-rust-50 p-4 text-rust-dark">
                    <Icon name="alert" className="mt-0.5 h-5 w-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{displayError}</p>
                </div>
            )}

            {/* Title & servings */}
            <section className="grid gap-6 sm:grid-cols-[1fr_auto]">
                <div>
                    <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-ink-soft">
                        Recipe title
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Grandma's Pasta Carbonara"
                        className="w-full rounded-2xl border-2 border-line bg-card px-4 py-3.5 font-display text-lg text-ink outline-none transition focus:border-forest"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-ink-soft">
                        Servings
                    </label>
                    <div className="relative">
                        <Icon
                            name="users"
                            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
                        />
                        <input
                            type="number"
                            min="1"
                            value={formData.servings}
                            onChange={(e) =>
                                setFormData({ ...formData, servings: parseInt(e.target.value) || "" })
                            }
                            placeholder="4"
                            className="w-28 rounded-2xl border-2 border-line bg-card py-3.5 pl-10 pr-4 text-ink outline-none transition focus:border-forest sm:w-32"
                        />
                    </div>
                </div>
            </section>

            {/* Photo */}
            <section>
                <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-ink-soft">
                    Recipe photo
                </label>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative flex h-40 w-full flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-line bg-paper sm:w-56">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Recipe preview" className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-ink-faint">
                                <Icon name="carrot" className="h-7 w-7" strokeWidth={1.4} />
                                <span className="text-xs font-medium">No photo yet</span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            icon="pencil"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {imagePreview ? "Change photo" : "Add photo"}
                        </Button>
                        {imagePreview && (
                            <Button type="button" variant="danger" size="sm" icon="trash" onClick={handleRemovePhoto}>
                                Remove
                            </Button>
                        )}
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handlePhotoSelect}
                        className="hidden"
                    />
                </div>
            </section>

            {/* Ingredients */}
            <section>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-display text-xl font-semibold text-ink">Ingredients</h2>
                    <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">
                        At least one required
                    </span>
                </div>

                <div className="space-y-3">
                    {formData.ingredients.map((ingredient, index) => (
                        <div
                            key={index}
                            className="flex flex-col gap-3 rounded-2xl border border-line bg-card p-3 sm:flex-row sm:items-center"
                        >
                            <input
                                type="text"
                                value={ingredient.name}
                                onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                                placeholder="Ingredient name"
                                className="flex-1 rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-forest"
                            />
                            <div className="flex gap-3">
                                <input
                                    type="number"
                                    step="0.01"
                                    value={ingredient.quantity}
                                    onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                                    placeholder="Qty"
                                    className="w-20 rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-forest"
                                />
                                <select
    value={ingredient.unit}
    onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
    className="w-24 rounded-xl border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-forest"
>
    {UNITS.map((unit) => (
        <option key={unit} value={unit}>
            {unit}
        </option>
    ))}
</select>
                                {formData.ingredients.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeIngredient(index)}
                                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-ink-faint transition hover:bg-rust-50 hover:text-rust"
                                    >
                                        <Icon name="trash" className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={addIngredient}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-forest-dark"
                >
                    <Icon name="plus" className="h-4 w-4" />
                    Add ingredient
                </button>
            </section>

            {/* Steps */}
            <section>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-display text-xl font-semibold text-ink">Steps</h2>
                    <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">
                        At least one required
                    </span>
                </div>

                <div className="space-y-3">
                    {formData.steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <span className="mt-2.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-forest text-xs font-bold text-paper">
                                {index + 1}
                            </span>
                            <textarea
                                value={step}
                                onChange={(e) => handleStepChange(index, e.target.value)}
                                placeholder="Describe this step..."
                                className="h-20 flex-1 resize-none rounded-2xl border border-line bg-card px-4 py-3 text-sm text-ink outline-none focus:border-forest"
                            />
                            {formData.steps.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeStep(index)}
                                    className="mt-2 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-ink-faint transition hover:bg-rust-50 hover:text-rust"
                                >
                                    <Icon name="trash" className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={addStep}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-forest-dark"
                >
                    <Icon name="plus" className="h-4 w-4" />
                    Add step
                </button>
            </section>

            <div className="flex gap-4 border-t border-line pt-6">
                <Button type="submit" variant="primary" size="lg" className="flex-1" loading={loading}>
                    {submitLabel}
                </Button>
                <Button type="button" variant="ghost" size="lg" onClick={onCancel}>
                    Cancel
                </Button>
            </div>

            <datalist id="unit-suggestions">
                {UNITS.map((u) => (
                    <option key={u} value={u} />
                ))}
            </datalist>
        </form>
    );
}
