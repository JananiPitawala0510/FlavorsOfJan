const express = require('express');
const router = express.Router();

const recipeController = require('../controllers/recipeController');

// CREATE FULL RECIPE (ONLY ONE CREATE ROUTE)
router.post('/recipes/full', recipeController.addRecipeFull);

// GET ALL RECIPES
router.get('/recipes', recipeController.getRecipes);

// GET ONE RECIPE
router.get('/recipes/:id', recipeController.getRecipeById);

// MATCH RECIPES
router.post('/recipes/match', recipeController.matchRecipes);

router.put('/recipes/:id', recipeController.updateRecipe);

router.delete('/recipes/:id', recipeController.deleteRecipe);

module.exports = router;