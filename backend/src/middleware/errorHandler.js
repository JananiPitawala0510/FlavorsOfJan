// Middleware to wrap async route handlers
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    if (err.status) {
        return res.status(err.status).json({ message: err.message });
    }

    if (err.name === 'MulterError' || err.message?.includes('images are allowed')) {
        return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: 'Internal server error' });
};

module.exports = { asyncHandler, errorHandler };
