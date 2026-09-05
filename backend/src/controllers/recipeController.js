const util = require('util');
const fs = require('fs');
const path = require('path');
const Recipe = require('../models/recipeModel');
const Ingredient = require('../models/ingredientModel');
const RecipeIngredient = require('../models/recipeIngredientModel');
const Step = require('../models/stepModel');
const db = require('../config/db');
const { validateRecipeInput, validateIngredientInput } = require('../middleware/validation');
const { UPLOAD_DIR } = require('../middleware/upload');

// Promisify db.query
const query = util.promisify(db.query).bind(db);

// Multipart form fields arrive as JSON strings; plain JSON requests send real arrays
const parseJSONField = (value, fallback) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value.trim().length > 0) {
        try {
            return JSON.parse(value);
        } catch {
            return fallback;
        }
    }
    return fallback;
};

const deleteUploadedImage = (imageUrl) => {
    if (!imageUrl || !imageUrl.startsWith('/uploads/')) return;
    const filePath = path.join(UPLOAD_DIR, path.basename(imageUrl));
    fs.unlink(filePath, () => {});
};

// CREATE FULL RECIPE (ingredients + steps)
exports.addRecipeFull = async (req, res, next) => {
    try {
        const { title, servings } = req.body;
        const ingredients = parseJSONField(req.body.ingredients, []);
        const steps = parseJSONField(req.body.steps, []);

        // Validate input
        const errors = validateRecipeInput(title, ingredients, steps);
        if (errors.length > 0) {
            if (req.file) deleteUploadedImage(`/uploads/${req.file.filename}`);
            return res.status(400).json({
                message: 'Validation failed',
                errors
            });
        }

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        // Step 1: Create recipe
        const recipeResult = await query(
            'INSERT INTO recipes (title, servings, image_url) VALUES (?, ?, ?)',
            [title.trim(), servings || null, imageUrl]
        );
        const recipeId = recipeResult.insertId; //creating a new recipe and getting its ID for further use

        // Step 2: Add ingredients
        if (ingredients && ingredients.length > 0) {
            for (const ing of ingredients) {
                try {
                    const existingIngredients = await query(
                        'SELECT * FROM ingredients WHERE name = ?',
                        [ing.name.trim()]
                    );

                    let ingredientId;
                    if (existingIngredients.length > 0) {
                        ingredientId = existingIngredients[0].id;
                    } else {
                        const ingredientResult = await query(
                            'INSERT INTO ingredients (name) VALUES (?)',
                            [ing.name.trim()]
                        );
                        ingredientId = ingredientResult.insertId;
                    }

                    await query(
                        'INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (?, ?, ?, ?)',
                        [recipeId, ingredientId, ing.quantity, ing.unit.trim()]
                    );
                } catch (err) {
                    console.error(`Error processing ingredient ${ing.name}:`, err);
                    throw err;
                }
            }
        }

        // Step 3: Add steps
        if (steps && steps.length > 0) {
            for (let index = 0; index < steps.length; index++) {
                try {
                    await query(
                        'INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES (?, ?, ?)',
                        [recipeId, index + 1, steps[index].trim()]
                    );
                } catch (err) {
                    console.error(`Error processing step ${index + 1}:`, err);
                    throw err;
                }
            }
        }

        return res.status(201).json({
            message: 'Recipe created successfully',
            recipeId
        });
    } catch (error) {
        next(error);
    }
};

// GET ALL RECIPES
exports.getRecipes = async (req, res, next) => {
    try {
        const results = await query('SELECT * FROM recipes');
        res.json(results);
    } catch (error) {
        next(error);
    }
};

// GET RECIPE BY ID (FULL DETAILS)
exports.getRecipeById = async (req, res, next) => {
    try {
        const recipeId = req.params.id;

        // Validate ID
        if (!recipeId || isNaN(recipeId)) {
            return res.status(400).json({ message: 'Invalid recipe ID' });
        }

        const recipes = await query('SELECT * FROM recipes WHERE id = ?', [recipeId]);
        
        if (recipes.length === 0) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const recipe = recipes[0];

        const ingredients = await query(
            `SELECT i.name, ri.quantity, ri.unit
             FROM recipe_ingredients ri
             JOIN ingredients i ON ri.ingredient_id = i.id
             WHERE ri.recipe_id = ?`,
            [recipeId]
        );

        const steps = await query(
            `SELECT * FROM recipe_steps
             WHERE recipe_id = ?
             ORDER BY step_number ASC`,
            [recipeId]
        );

        res.json({
            ...recipe,
            ingredients,
            steps
        });
    } catch (error) {
        next(error);
    }
};

// INGREDIENT MATCHING (SMART FEATURE)
exports.matchRecipes = async (req, res, next) => { //req,res,next are the request, response, and next middleware function in Express.js. This function is used to match recipes based on the ingredients provided in the request body.
    try {
        const userIngredients = req.body.ingredients;

        // Validate input
        const errors = validateIngredientInput(userIngredients);
        if (errors.length > 0) { //If there are validation errors, it returns a 400 Bad Request response with the validation errors in the response body. eg. if the user sends an empty array or invalid data types for ingredients, the server will respond with a 400 status code and a message indicating that validation failed, along with the specific errors.
            return res.status(400).json({ 
                message: 'Validation failed',
                errors 
            });
        }

        const results = await query(`
            SELECT r.id, r.title, i.name
            FROM recipes r
            JOIN recipe_ingredients ri ON r.id = ri.recipe_id
            JOIN ingredients i ON ri.ingredient_id = i.id
        `);

        const recipeMap = {};

        results.forEach(row => {
            if (!recipeMap[row.id]) {
                recipeMap[row.id] = {
                    title: row.title,
                    ingredients: []
                };
            }
            recipeMap[row.id].ingredients.push(row.name);
        }); //This code iterates over the results of the SQL query and constructs a recipeMap object. Each recipe ID is used as a key in the recipeMap, and the corresponding value is an object containing the recipe title and an array of its ingredients. If a recipe ID is encountered for the first time, it initializes a new entry in the recipeMap with the title and an empty ingredients array. Then, it pushes the ingredient name into the ingredients array for that recipe ID.

        const matches = [];

        for (let id in recipeMap) {
            const recipe = recipeMap[id];
            const required = recipe.ingredients;

            const matched = required.filter(ing =>
                userIngredients.some(userIng => 
                    userIng.toLowerCase() === ing.toLowerCase()
                )
            );

            matches.push({
                recipeId: id,
                title: recipe.title,
                matchCount: matched.length,
                totalIngredients: required.length,
                matchPercentage: Math.round((matched.length / required.length) * 100)
            });
        }

        matches.sort((a, b) => b.matchCount - a.matchCount); //Sort the matches in descending order based on the number of matched ingredients, so that recipes with more matches appear first.

        res.json(matches);
    } catch (error) {
        next(error);
    }
};

// UPDATE RECIPE
exports.updateRecipe = async (req, res, next) => {
    try {
        const recipeId = req.params.id;
        const { title, servings, removeImage } = req.body;
        const ingredients = parseJSONField(req.body.ingredients, []);
        const steps = parseJSONField(req.body.steps, []);

        // Validate ID
        if (!recipeId || isNaN(recipeId)) {
            return res.status(400).json({ message: 'Invalid recipe ID' });
        }

        // Validate input
        const errors = validateRecipeInput(title, ingredients, steps);
        if (errors.length > 0) {
            if (req.file) deleteUploadedImage(`/uploads/${req.file.filename}`);
            return res.status(400).json({
                message: 'Validation failed',
                errors
            });
        }

        // Check if recipe exists
        const existingRecipes = await query('SELECT id, image_url FROM recipes WHERE id = ?', [recipeId]);
        if (existingRecipes.length === 0) {
            if (req.file) deleteUploadedImage(`/uploads/${req.file.filename}`);
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const previousImageUrl = existingRecipes[0].image_url;
        let imageUrl = previousImageUrl;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        } else if (removeImage === 'true' || removeImage === true) {
            imageUrl = null;
        } //If the user wants to remove the image, the imageUrl is set to null.
        if (imageUrl !== previousImageUrl) {
            deleteUploadedImage(previousImageUrl);
        } //If the image URL has changed, the previous image is deleted.

        // Update recipe basic info
        await query(
            'UPDATE recipes SET title = ?, servings = ?, image_url = ? WHERE id = ?',
            [title.trim(), servings || null, imageUrl, recipeId]
        );

        // Delete old ingredients
        await query('DELETE FROM recipe_ingredients WHERE recipe_id = ?', [recipeId]);

        // Delete old steps
        await query('DELETE FROM recipe_steps WHERE recipe_id = ?', [recipeId]);

        // Re-add ingredients
        if (ingredients && ingredients.length > 0) {
            for (const ing of ingredients) {
                try {
                    const existingIngredients = await query(
                        'SELECT * FROM ingredients WHERE name = ?',
                        [ing.name.trim()]
                    );

                    let ingredientId;
                    if (existingIngredients.length > 0) {
                        ingredientId = existingIngredients[0].id;
                    } else {
                        const ingredientResult = await query(
                            'INSERT INTO ingredients (name) VALUES (?)',
                            [ing.name.trim()]
                        );
                        ingredientId = ingredientResult.insertId;
                    }

                    await query(
                        'INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (?, ?, ?, ?)',
                        [recipeId, ingredientId, ing.quantity, ing.unit.trim()]
                    );
                } catch (err) {
                    console.error(`Error processing ingredient ${ing.name}:`, err);
                    throw err;
                }
            }
        }

        // Re-add steps
        if (steps && steps.length > 0) {
            for (let index = 0; index < steps.length; index++) {
                try {
                    await query(
                        'INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES (?, ?, ?)',
                        [recipeId, index + 1, steps[index].trim()]
                    );
                } catch (err) {
                    console.error(`Error processing step ${index + 1}:`, err);
                    throw err;
                }
            }
        }

        res.json({
            message: 'Recipe updated successfully',
            recipeId
        });
    } catch (error) {
        next(error);
    }
};

// DELETE RECIPE
exports.deleteRecipe = async (req, res, next) => {
    try {
        const recipeId = req.params.id;

        // Validate ID
        if (!recipeId || isNaN(recipeId)) {
            return res.status(400).json({ message: 'Invalid recipe ID' });
        }

        // Check if recipe exists
        const existingRecipes = await query('SELECT id, image_url FROM recipes WHERE id = ?', [recipeId]);
        if (existingRecipes.length === 0) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Delete steps
        await query('DELETE FROM recipe_steps WHERE recipe_id = ?', [recipeId]);

        // Delete ingredients relation
        await query('DELETE FROM recipe_ingredients WHERE recipe_id = ?', [recipeId]);

        // Delete recipe
        await query('DELETE FROM recipes WHERE id = ?', [recipeId]);

        deleteUploadedImage(existingRecipes[0].image_url);

        res.json({
            message: 'Recipe deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};