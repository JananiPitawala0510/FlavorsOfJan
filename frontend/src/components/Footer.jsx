import { Link } from "react-router-dom";
import logo from "../assets/Logo.png";
import Icon from "./Icon";

export default function Footer() {
    return (
        <footer className="border-t border-line bg-paper-warm">
            <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:px-8 md:grid-cols-3 lg:px-10">
                <div>
                    <Link to="/" className="flex items-center gap-3">
                        <img src={logo} alt="FlavorsOfJan" className="h-10 w-10 rounded-full shadow-soft" />
                        <span className="font-display text-lg font-bold text-ink">
                            Flavors<span className="font-sans text-gold-dark">OfJan</span>
                        </span>
                    </Link>
                    <p className="mt-3 max-w-xs text-sm leading-6 text-ink-soft">
                        A personal cooking journal where every recipe kept, flipped through, and
                        cooked again.
                    </p>
                </div>

                <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                        Explore
                    </h4>
                    <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                        <li><Link to="/recipes" className="hover:text-forest">Recipe Book</Link></li>
                        <li><Link to="/match" className="hover:text-forest">Match by Ingredients</Link></li>
                        <li><Link to="/add" className="hover:text-forest">Add a Recipe</Link></li>
                        <li><Link to="/discover" className="hover:text-forest">FlavorMate</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                        Made with
                    </h4>
                    <p className="mt-4 flex items-center gap-2 text-sm text-ink-soft">
                        <Icon name="leaf" className="h-4 w-4 text-forest" />
                        Warmth, patience, and a love.
                    </p>
                </div>
            </div>

            <div className="border-t border-line px-6 py-5 text-center text-xs text-ink-faint sm:px-8 lg:px-10">
                &copy; {new Date().getFullYear()} FlavorsOfJan. A personal project, made for the love of cooking.
            </div>
        </footer>
    );
}
