const Recipe = require('../models/recipeModel');
const Ingredient = require('../models/ingredientModel');
const RecipeIngredient = require('../models/recipeIngredientModel');
const Step = require('../models/stepModel');
const db = require('../config/db');


//CREATE FULL RECIPE (ingredients + steps)
exports.addRecipeFull = (req, res) => {
    const { title, servings, ingredients, steps } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    // Step 1: Create recipe
    Recipe.create({ title, servings }, (err, result) => {
        if (err) return res.status(500).json(err);

        const recipeId = result.insertId;

        let tasks = 0;
        let completed = 0;

        const done = () => {
            completed++;
            if (completed === tasks) {
                res.json({
                    message: 'Recipe created successfully',
                    recipeId
                });
            }
        };

        // 🔹 INGREDIENTS
        if (ingredients && ingredients.length > 0) {
            tasks += ingredients.length;

            ingredients.forEach((ing) => {
                Ingredient.findByName(ing.name, (err, results) => {
                    if (err) return;

                    if (results.length > 0) {
                        const ingredientId = results[0].id;

                        RecipeIngredient.add({
                            recipe_id: recipeId,
                            ingredient_id: ingredientId,
                            quantity: ing.quantity,
                            unit: ing.unit
                        }, done);

                    } else {
                        Ingredient.create(ing.name, (err, result) => {
                            if (err) return;

                            RecipeIngredient.add({
                                recipe_id: recipeId,
                                ingredient_id: result.insertId,
                                quantity: ing.quantity,
                                unit: ing.unit
                            }, done);
                        });
                    }
                });
            });
        }

        // 🔹 STEPS
        if (steps && steps.length > 0) {
            tasks += steps.length;

            steps.forEach((step, index) => {
                Step.add({
                    recipe_id: recipeId,
                    step_number: index + 1,
                    instruction: step
                }, done);
            });
        }

        // If no ingredients & steps
        if (tasks === 0) {
            res.json({
                message: 'Recipe created (no ingredients/steps)',
                recipeId
            });
        }
    });
};


//GET ALL RECIPES
exports.getRecipes = (req, res) => {
    Recipe.getAll((err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};


//GET RECIPE BY ID (FULL DETAILS)
exports.getRecipeById = (req, res) => {
    const recipeId = req.params.id;

    const recipeSql = `SELECT * FROM recipes WHERE id = ?`;

    db.query(recipeSql, [recipeId], (err, recipeResult) => {
        if (err) return res.status(500).json(err);

        if (recipeResult.length === 0) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const recipe = recipeResult[0];

        const ingredientSql = `
            SELECT i.name, ri.quantity, ri.unit
            FROM recipe_ingredients ri
            JOIN ingredients i ON ri.ingredient_id = i.id
            WHERE ri.recipe_id = ?
        `;

        db.query(ingredientSql, [recipeId], (err, ingredients) => {
            if (err) return res.status(500).json(err);

            Step.getByRecipeId(recipeId, (err, steps) => {
                if (err) return res.status(500).json(err);

                res.json({
                    ...recipe,
                    ingredients,
                    steps
                });
            });
        });
    });
};


//INGREDIENT MATCHING (SMART FEATURE)
exports.matchRecipes = (req, res) => {
    const userIngredients = req.body.ingredients;

    if (!userIngredients || userIngredients.length === 0) {
        return res.status(400).json({ message: 'No ingredients provided' });
    }

    const sql = `
        SELECT r.id, r.title, i.name
        FROM recipes r
        JOIN recipe_ingredients ri ON r.id = ri.recipe_id
        JOIN ingredients i ON ri.ingredient_id = i.id
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);

        const recipeMap = {};

        results.forEach(row => {
            if (!recipeMap[row.id]) {
                recipeMap[row.id] = {
                    title: row.title,
                    ingredients: []
                };
            }
            recipeMap[row.id].ingredients.push(row.name);
        });

        const matches = [];

        for (let id in recipeMap) {
            const recipe = recipeMap[id];
            const required = recipe.ingredients;

            const matched = required.filter(ing =>
                userIngredients.includes(ing)
            );

            matches.push({
                recipeId: id,
                title: recipe.title,
                matchCount: matched.length,
                totalIngredients: required.length
            });
        }

        matches.sort((a, b) => b.matchCount - a.matchCount);

        res.json(matches);
    });
};

exports.updateRecipe = (req, res) => {
    const recipeId = req.params.id;
    const { title, servings, ingredients, steps } = req.body;

    // 1. Update recipe basic info
    const updateRecipeSql = `
        UPDATE recipes
        SET title = ?, servings = ?
        WHERE id = ?
    `;

    db.query(updateRecipeSql, [title, servings, recipeId], (err) => {
        if (err) return res.status(500).json(err);

        // 2. Delete old ingredients
        db.query(
            'DELETE FROM recipe_ingredients WHERE recipe_id = ?',
            [recipeId],
            (err) => {
                if (err) return res.status(500).json(err);

                // 3. Delete old steps
                db.query(
                    'DELETE FROM recipe_steps WHERE recipe_id = ?',
                    [recipeId],
                    (err) => {
                        if (err) return res.status(500).json(err);

                        // 4. Re-add ingredients
                        if (ingredients && ingredients.length > 0) {
                            ingredients.forEach((ing) => {
                                Ingredient.findByName(ing.name, (err, results) => {
                                    if (err) return;

                                    if (results.length > 0) {
                                        saveRecipeIngredient(recipeId, results[0].id, ing);
                                    } else {
                                        Ingredient.create(ing.name, (err, result) => {
                                            if (err) return;
                                            saveRecipeIngredient(recipeId, result.insertId, ing);
                                        });
                                    }
                                });
                            });
                        }

                        // 5. Re-add steps
                        if (steps && steps.length > 0) {
                            steps.forEach((step, index) => {
                                Step.add({
                                    recipe_id: recipeId,
                                    step_number: index + 1,
                                    instruction: step
                                }, () => {});
                            });
                        }

                        // 6. Final response
                        setTimeout(() => {
                            res.json({
                                message: 'Recipe updated successfully'
                            });
                        }, 500);
                    }
                );
            }
        );
    });
};

function saveRecipeIngredient(recipeId, ingredientId, ing) {
    const RecipeIngredient = require('../models/recipeIngredientModel');

    RecipeIngredient.add({
        recipe_id: recipeId,
        ingredient_id: ingredientId,
        quantity: ing.quantity,
        unit: ing.unit
    }, () => {});
}

exports.deleteRecipe = (req, res) => {
    const recipeId = req.params.id;

    // Step 1: delete steps
    const deleteSteps = `DELETE FROM recipe_steps WHERE recipe_id = ?`;

    db.query(deleteSteps, [recipeId], (err) => {
        if (err) return res.status(500).json(err);

        // Step 2: delete ingredients relation
        const deleteIngredients = `DELETE FROM recipe_ingredients WHERE recipe_id = ?`;

        db.query(deleteIngredients, [recipeId], (err) => {
            if (err) return res.status(500).json(err);

            // Step 3: delete recipe
            const deleteRecipe = `DELETE FROM recipes WHERE id = ?`;

            db.query(deleteRecipe, [recipeId], (err, result) => {
                if (err) return res.status(500).json(err);

                res.json({
                    message: 'Recipe deleted successfully'
                });
            });
        });
    });
};