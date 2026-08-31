const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { upload } = require('../middleware/upload');

const recipeController = require('../controllers/recipeController');

// CREATE FULL RECIPE (ONLY ONE CREATE ROUTE)
router.post('/recipes/full', upload.single('image'), asyncHandler(recipeController.addRecipeFull));

// GET ALL RECIPES
router.get('/recipes', asyncHandler(recipeController.getRecipes));

// GET ONE RECIPE
router.get('/recipes/:id', asyncHandler(recipeController.getRecipeById));

// MATCH RECIPES
router.post('/recipes/match', asyncHandler(recipeController.matchRecipes));

// UPDATE RECIPE
router.put('/recipes/:id', upload.single('image'), asyncHandler(recipeController.updateRecipe));

// DELETE RECIPE
router.delete('/recipes/:id', asyncHandler(recipeController.deleteRecipe));

module.exports = router;