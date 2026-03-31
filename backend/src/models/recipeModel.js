const db = require('../config/db');

const Recipe = {
    create: (data, callback) => {
        const sql = `
            INSERT INTO recipes (title, servings)
            VALUES (?, ?)
        `;
        db.query(sql, [data.title, data.servings], callback);
    },

    getAll: (callback) => {
        const sql = `SELECT * FROM recipes`;
        db.query(sql, callback);
    }
};

module.exports = Recipe;