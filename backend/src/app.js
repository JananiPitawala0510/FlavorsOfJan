const path = require('path');
const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');

require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

const recipeRoutes = require('./routes/recipeRoutes');
app.use('/api', recipeRoutes);

const aiRoutes = require('./routes/aiRoutes');
app.use('/api', aiRoutes);

app.get('/', (req, res) => {
    res.send('FlavorsOfJan API is running 🚀');
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;