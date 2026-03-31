const db = require('../config/db');

const RecipeIngredient = {
    add: (data, callback) => {
        const sql = `
            INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
            VALUES (?, ?, ?, ?)
        `;
        db.query(sql, [
            data.recipe_id,
            data.ingredient_id,
            data.quantity,
            data.unit
        ], callback);
    }
};

module.exports = RecipeIngredient;