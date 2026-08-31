// Input validation helper
const validateRecipeInput = (title, ingredients, steps) => {
    const errors = [];

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        errors.push('Title is required and must be a non-empty string');
    }

    if (ingredients && !Array.isArray(ingredients)) {
        errors.push('Ingredients must be an array');
    }

    if (ingredients && ingredients.length > 0) {
        ingredients.forEach((ing, index) => {
            if (!ing.name || typeof ing.name !== 'string') {
                errors.push(`Ingredient ${index + 1}: name is required`);
            }
            if (!ing.quantity || typeof ing.quantity !== 'number') {
                errors.push(`Ingredient ${index + 1}: quantity must be a number`);
            }
            if (!ing.unit || typeof ing.unit !== 'string') {
                errors.push(`Ingredient ${index + 1}: unit is required`);
            }
        });
    }

    if (steps && !Array.isArray(steps)) {
        errors.push('Steps must be an array');
    }

    if (steps && steps.length > 0) {
        steps.forEach((step, index) => {
            if (typeof step !== 'string' || step.trim().length === 0) {
                errors.push(`Step ${index + 1}: must be a non-empty string`);
            }
        });
    }

    return errors;
};

const validateIngredientInput = (ingredients) => {
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
        return ['Ingredients must be a non-empty array'];
    }
    return [];
};

module.exports = { validateRecipeInput, validateIngredientInput };
