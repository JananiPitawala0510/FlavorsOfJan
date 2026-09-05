const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

// Resolve a recipe's stored image path (e.g. "/uploads/123.jpg") to a full URL
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (/^https?:\/\//i.test(imagePath)) return imagePath;
    return `${API_ORIGIN}${imagePath}`;
}; //used to get the full URL of the image stored in the backend, if the imagePath is already a full URL, it returns it as is, otherwise it prepends the API_ORIGIN to the imagePath to form a complete URL.

const buildRecipeFormData = ({ title, servings, ingredients, steps }, imageFile, removeImage) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('servings', servings ?? '');
    formData.append('ingredients', JSON.stringify(ingredients));
    formData.append('steps', JSON.stringify(steps));
    if (imageFile) formData.append('image', imageFile);
    if (removeImage) formData.append('removeImage', 'true');
    return formData;
};

// Get all recipes
export const fetchRecipes = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/recipes`);
        if (!response.ok) throw new Error('Failed to fetch recipes');
        return await response.json();
    } catch (error) {
        console.error('Error fetching recipes:', error);
        throw error;
    }
};

// Get single recipe by ID
export const fetchRecipeById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
        if (!response.ok) throw new Error('Failed to fetch recipe');
        return await response.json();
    } catch (error) {
        console.error('Error fetching recipe:', error);
        throw error;
    }
};

// Create recipe (optionally with a photo)
export const createRecipe = async (recipeData, imageFile) => {
    try {
        const response = await fetch(`${API_BASE_URL}/recipes/full`, {
            method: 'POST',
            body: buildRecipeFormData(recipeData, imageFile, false),
        });
        if (!response.ok) throw new Error('Failed to create recipe');
        return await response.json();
    } catch (error) {
        console.error('Error creating recipe:', error);
        throw error;
    }
};

// Update recipe (optionally replacing or removing its photo)
export const updateRecipe = async (id, recipeData, imageFile, removeImage) => {
    try {
        const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
            method: 'PUT',
            body: buildRecipeFormData(recipeData, imageFile, removeImage),
        });
        if (!response.ok) throw new Error('Failed to update recipe');
        return await response.json();
    } catch (error) {
        console.error('Error updating recipe:', error);
        throw error;
    }
};

// Delete recipe
export const deleteRecipe = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete recipe');
        return await response.json();
    } catch (error) {
        console.error('Error deleting recipe:', error);
        throw error;
    }
};

// Match recipes by ingredients
export const matchRecipes = async (ingredients) => {
    try {
        const response = await fetch(`${API_BASE_URL}/recipes/match`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ingredients }),
        });
        if (!response.ok) throw new Error('Failed to match recipes');
        return await response.json();
    } catch (error) {
        console.error('Error matching recipes:', error);
        throw error;
    }
};
