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
