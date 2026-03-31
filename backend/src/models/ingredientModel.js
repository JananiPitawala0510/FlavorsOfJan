const db = require('../config/db');

const Ingredient = {
    findByName: (name, callback) => {
        const sql = `SELECT * FROM ingredients WHERE name = ?`;
        db.query(sql, [name], callback);
    },

    create: (name, callback) => {
        const sql = `INSERT INTO ingredients (name) VALUES (?)`;
        db.query(sql, [name], callback);
    }
};

module.exports = Ingredient;