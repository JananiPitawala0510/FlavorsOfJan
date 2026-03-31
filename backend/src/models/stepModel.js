const db = require('../config/db');

const Step = {
    add: (data, callback) => {
        const sql = `
            INSERT INTO recipe_steps (recipe_id, step_number, instruction)
            VALUES (?, ?, ?)
        `;
        db.query(sql, [data.recipe_id, data.step_number, data.instruction], callback);
    },

    getByRecipeId: (recipeId, callback) => {
        const sql = `
            SELECT * FROM recipe_steps
            WHERE recipe_id = ?
            ORDER BY step_number ASC
        `;
        db.query(sql, [recipeId], callback);
    }
};

module.exports = Step;