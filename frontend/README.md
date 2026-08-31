# FlavorsOfJan Frontend 🍳📖

A modern, beautiful React frontend for managing and browsing recipes with a flipbook interface.

## Features

✨ **Dashboard** - Beautiful landing page with navigation
📖 **Recipe Book** - Flipbook-style recipe viewer with smooth navigation
🔍 **Match Recipes** - Smart ingredient-based recipe finder
➕ **Add Recipe** - Create new recipes with ingredients and steps
🎨 **Responsive Design** - Works great on desktop and mobile
⚡ **Real-time Updates** - Live connection to backend API

## Folder Structure

```
src/
├── components/           # Reusable components
│   ├── Navbar.jsx       # Navigation bar
│   └── FlipBook.jsx     # Book flip component
├── pages/               # Page components
│   ├── Dashboard.jsx    # Home page
│   ├── RecipeBook.jsx   # Recipe flipbook viewer
│   ├── Match.jsx        # Recipe matcher
│   └── AddRecipe.jsx    # Add recipe form
├── services/            # API communication
│   └── recipeService.js # Recipe API calls
├── App.jsx              # Main app component with routing
├── App.css              # Global styles
├── index.css            # Tailwind directives
└── main.jsx            # React entry point
```

## Setup & Installation

### Prerequisites
- Node.js (v14+)
- Backend server running on `http://localhost:5000`

### Installation

1. Install dependencies:
```bash
cd backend/frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## Pages

### 🏠 Dashboard (`/`)
- Landing page with hero section
- Navigation hub
- Quick links to all features

### 📖 Recipe Book (`/recipes`)
- Browse all recipes in flipbook style
- Click to flip pages
- View ingredients and steps
- Smooth page transitions
- Shows recipe count

### 🔍 Match (`/match`)
- Search recipes by ingredients
- Enter comma-separated ingredients
- Shows match count and percentage
- Visual progress bars
- Real-time results

### ➕ Add Recipe (`/add`)
- Create new recipes
- Dynamic ingredient input
- Dynamic step input
- Form validation
- Success feedback

## Components

### Navbar
- Fixed navigation bar
- Links to all pages
- Responsive design

### FlipBook
- Displays recipes as book pages
- Flip between ingredients and steps
- Previous/Next navigation
- Page counter
- Beautiful styling

## API Integration

The frontend communicates with the backend at `http://localhost:5000/api`

### Endpoints Used:
- `GET /recipes` - Fetch all recipes
- `GET /recipes/:id` - Fetch single recipe
- `POST /recipes/full` - Create recipe
- `PUT /recipes/:id` - Update recipe
- `DELETE /recipes/:id` - Delete recipe
- `POST /recipes/match` - Match recipes by ingredients

## Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Custom Colors** - Orange/amber theme
- **Responsive** - Mobile-first design
- **Animations** - Smooth transitions and hover effects

## Environment Configuration

The backend API URL is hardcoded to `http://localhost:5000/api`

To change it, edit `src/services/recipeService.js`:
```javascript
const API_BASE_URL = 'http://your-api-url/api';
```

## Error Handling

- API errors are caught and displayed to users
- User-friendly error messages
- Retry functionality available
- Form validation with error feedback

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Future Enhancements

- [ ] Recipe images/photos
- [ ] User authentication
- [ ] Save favorite recipes
- [ ] Share recipes
- [ ] Print recipes
- [ ] Dark mode
- [ ] Search & filter
- [ ] Rating system
- [ ] Comments
- [ ] Recipe collections/categories

## Troubleshooting

### Backend connection error?
- Make sure backend server is running on `localhost:5000`
- Check browser console for CORS errors
- Verify API endpoints are correct

### Recipes not loading?
- Check if backend is running
- Verify recipes exist in database
- Check browser console for errors

### Styling issues?
- Clear browser cache
- Rebuild with `npm run build`
- Check Tailwind CSS configuration

## License

ISC
