const express = require('express');
const cors = require('cors');

require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

const recipeRoutes = require('./routes/recipeRoutes');
app.use('/api', recipeRoutes);

app.get('/', (req, res) => {
    res.send('FlavorsOfJan API is running 🚀');
});

module.exports = app;