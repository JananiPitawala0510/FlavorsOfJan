import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import RecipeBook from "./pages/RecipeBook";
import Match from "./pages/Match";
import AddRecipe from "./pages/AddRecipe";
import EditRecipe from "./pages/EditRecipe";
import Discover from "./pages/Discover";
import { ToastProvider } from "./context/ToastProvider";

function App() {
    return (
        <Router>
            <ToastProvider> 
                <div className="flex min-h-screen flex-col bg-paper">
                    <Navbar />

                    <main className="flex-1">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/recipes" element={<RecipeBook />} />
                            <Route path="/match" element={<Match />} />
                            <Route path="/add" element={<AddRecipe />} />
                            <Route path="/edit/:id" element={<EditRecipe />} />
                            <Route path="/discover" element={<Discover />} />
                        </Routes>
                    </main>

                    <Footer />
                </div>
            </ToastProvider>
        </Router>
    );
}

export default App;

// This file defines the main App component for the React application. It sets up routing using React Router, includes a Navbar and Footer, and wraps the content in a ToastProvider for managing toast notifications. The Routes component defines different routes for various pages in the application, such as Dashboard, RecipeBook, Match, AddRecipe, EditRecipe, and Discover.
// ToastProvider is a context provider that allows components within the application to access and manage toast notifications, providing a consistent way to display messages to users.