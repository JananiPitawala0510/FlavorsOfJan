const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');

const aiController = require('../controllers/aiController');

// FLAVORMATE CHAT
router.post('/ai/chat', asyncHandler(aiController.chat));

module.exports = router;
