# FlavorsOfJan Backend API

A Node.js/Express API for managing recipes with ingredients and step-by-step instructions.

## Setup

### Prerequisites
- Node.js (v14+)
- MySQL 8.0+

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in the backend folder with:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=flavorsofjan
PORT=5000
```

3. Set up database:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p flavorsofjan < database/seed.sql
```

4. Start the server:
```bash
npm start
```

The API will run on `http://localhost:5000`

## API Endpoints

### Recipes

#### Get All Recipes
```
GET /api/recipes
```

#### Get Recipe by ID
```
GET /api/recipes/:id
```

#### Create Recipe
```
POST /api/recipes/full
Content-Type: application/json

{
  "title": "Pasta Carbonara",
  "servings": 4,
  "ingredients": [
    {
      "name": "Spaghetti",
      "quantity": 400,
      "unit": "g"
    }
  ],
  "steps": [
    "Cook the pasta",
    "Mix with sauce"
  ]
}
```

#### Update Recipe
```
PUT /api/recipes/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "servings": 2,
  "ingredients": [...],
  "steps": [...]
}
```

#### Delete Recipe
```
DELETE /api/recipes/:id
```

#### Match Recipes by Ingredients
```
POST /api/recipes/match
Content-Type: application/json

{
  "ingredients": ["flour", "sugar", "eggs"]
}
```

Response includes:
- `recipeId`: Recipe ID
- `title`: Recipe title
- `matchCount`: Number of matching ingredients
- `totalIngredients`: Total ingredients in recipe
- `matchPercentage`: Percentage of matching ingredients

## Architecture

### Folder Structure
```
backend/
├── src/
│   ├── app.js              # Express app configuration
│   ├── config/
│   │   └── db.js           # Database connection
│   ├── controllers/
│   │   └── recipeController.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── models/
│   │   ├── recipeModel.js
│   │   ├── ingredientModel.js
│   │   ├── recipeIngredientModel.js
│   │   └── stepModel.js
│   └── routes/
│       └── recipeRoutes.js
├── .env                    # Environment variables
└── server.js              # Server entry point
```

## Features

✅ Create recipes with ingredients and steps
✅ View recipes with all details
✅ Update recipes
✅ Delete recipes
✅ Smart ingredient matching
✅ Input validation
✅ Error handling
✅ Environment-based configuration
✅ SQL injection protection (parameterized queries)

## Error Handling

All errors are handled globally. The API returns:
```json
{
  "message": "Error description"
}
```

With appropriate HTTP status codes:
- `400`: Bad Request (validation error)
- `404`: Not Found
- `500`: Server Error

## Security Notes

- Database credentials are stored in `.env` (not committed to git)
- All queries use parameterized statements to prevent SQL injection
- Input validation on all endpoints
- CORS enabled for frontend communication

## Future Improvements

- [ ] Authentication & Authorization
- [ ] Rate limiting
- [ ] Request logging
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Unit tests
- [ ] Integration tests
- [ ] Caching
