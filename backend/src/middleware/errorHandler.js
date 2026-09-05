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

//this is used to handle errors in the backend. The asyncHandler function wraps asynchronous route handlers and catches any errors that occur, passing them to the next middleware (errorHandler). The errorHandler middleware logs the error and sends an appropriate response to the client based on the type of error encountered.
