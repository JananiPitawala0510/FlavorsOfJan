import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/Logo.png";
import Icon from "./Icon";

const links = [
    { name: "Home", path: "/", icon: "home" },
    { name: "Recipe Book", path: "/recipes", icon: "book" },
    { name: "Match Recipes", path: "/match", icon: "carrot" },
    { name: "Add Recipe", path: "/add", icon: "plus" },
    { name: "FlavorMate", path: "/discover", icon: "sparkles" },
];

export default function Navbar() {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-40 border-b border-line/80 bg-paper/85 backdrop-blur-md">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
                {/* BRAND */}
                <Link
                    to="/"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3"
                >
                    <img
                        src={logo}
                        alt="FlavorsOfJan"
                        className="h-12 w-12 rounded-full object-contain shadow-soft"
                    />

                    <div>
                        <h1 className="font-display text-xl font-bold leading-none tracking-tight text-ink">
                            Flavors<span className="font-sans text-gold-dark">OfJan</span>
                        </h1>
                        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
                            My Cooking Journal
                        </p>
                    </div>
                </Link>

                {/* DESKTOP NAVIGATION */}
                <div className="hidden items-center gap-1.5 lg:flex">
                    {links.map((link) => {
                        const active = location.pathname === link.path;

                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`relative flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                                    active
                                        ? "bg-forest text-paper shadow-soft"
                                        : "text-ink-soft hover:bg-paper-deep hover:text-ink"
                                }`}
                            >
                                <Icon name={link.icon} className="h-4 w-4" strokeWidth={2} />
                                {link.name}
                                {link.badge && (
                                    <span className="rounded-full bg-gold px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                                        {link.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* MOBILE BUTTON */}
                <button
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-ink transition hover:bg-paper-deep lg:hidden"
                >
                    <Icon name={menuOpen ? "close" : "menu"} className="h-5 w-5" />
                </button>
            </div>

            {/* MOBILE MENU */}
            {menuOpen && (
                <div className="border-t border-line bg-paper px-5 py-4 lg:hidden animate-fade-in">
                    <div className="grid gap-2">
                        {links.map((link) => {
                            const active = location.pathname === link.path;

                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMenuOpen(false)}
                                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
                                        active
                                            ? "bg-forest text-paper"
                                            : "text-ink-soft hover:bg-paper-deep"
                                    }`}
                                >
                                    <Icon name={link.icon} className="h-4 w-4" strokeWidth={2} />
                                    {link.name}
                                    {link.badge && (
                                        <span className="ml-auto rounded-full bg-gold px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                                            {link.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
}
