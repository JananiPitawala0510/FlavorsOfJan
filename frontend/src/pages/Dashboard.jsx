import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import Button from "../components/Button";
import logo from "../assets/Logo.png";

const features = [
    {
        icon: "book",
        title: "Browse Recipes",
        description: "Explore every recipe saved in a beautiful, flippable digital cookbook.",
        to: "/recipes",
        cta: "Open the book",
        tone: "forest",
    },
    {
        icon: "carrot",
        title: "Match Recipes",
        description: "Let's see what's in the kitchen and we'll surface the dishes we can make tonight.",
        to: "/match",
        cta: "Find a recipe",
        tone: "gold",
    },
    {
        icon: "pencil",
        title: "Add a Recipe",
        description: "Capture a new creation of ingredients, steps, and the little details that matter.",
        to: "/add",
        cta: "Start writing",
        tone: "rust",
    },
];

const toneClasses = {
    forest: "bg-forest-50 text-forest-dark",
    gold: "bg-gold-50 text-gold-dark",
    rust: "bg-rust-50 text-rust-dark",
};

export default function Dashboard() {
    return (
        <div className="bg-paper">
            {/* Hero */}
            <section className="relative overflow-hidden px-6 pb-24 pt-20 sm:pt-28">
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-24 right-[-10%] h-96 w-96 rounded-full bg-gold-50 blur-3xl"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute bottom-0 left-[-10%] h-80 w-80 rounded-full bg-forest-50 blur-3xl"
                />

                <div className="relative mx-auto max-w-4xl text-center">
                    <div className="mb-8 flex justify-center animate-fade-up">
                        <img
                            src={logo}
                            alt="FlavorsOfJan"
                            className="h-24 w-24 animate-float rounded-full shadow-lift sm:h-28 sm:w-28"
                        />
                    </div>

                    <p
                        className="mb-4 inline-flex items-center gap-2 rounded-full bg-forest-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-forest-dark animate-fade-up"
                        style={{ animationDelay: "80ms" }}
                    >
                        <Icon name="leaf" className="h-3.5 w-3.5" />
                        My personal cooking journal
                    </p>

                    <h1
                        className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink animate-fade-up sm:text-6xl md:text-7xl"
                        style={{ animationDelay: "140ms" }}
                    >
                        Flavors<span className="font-sans text-gold-dark">OfJan</span>
                    </h1>

                    <p
                        className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-ink-soft animate-fade-up sm:text-xl"
                        style={{ animationDelay: "200ms" }}
                    >
                        For the recipes that became favorites, the meals that became memories, and the moments in between.
                    </p>

                    <div
                        className="mt-10 flex flex-col items-center justify-center gap-4 animate-fade-up sm:flex-row"
                        style={{ animationDelay: "260ms" }}
                    >
                        <Button to="/recipes" size="lg" icon="book">
                            My Recipe Book
                        </Button>
                        <Button to="/match" size="lg" variant="secondary" icon="carrot">
                            Let's Match Ingredients
                        </Button>
                    </div>
                </div>
            </section>

            {/* Feature cards */}
            <section className="px-6 pb-24">
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {features.map((feature, idx) => (
                            <Link
                                key={feature.to}
                                to={feature.to}
                                className="group flex flex-col rounded-3xl border border-line bg-card p-8 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-lift animate-fade-up"
                                style={{ animationDelay: `${idx * 90 + 80}ms` }}
                            >
                                <div
                                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${toneClasses[feature.tone]}`}
                                >
                                    <Icon name={feature.icon} className="h-7 w-7" strokeWidth={1.6} />
                                </div>

                                <h3 className="font-display text-xl font-semibold text-ink">
                                    {feature.title}
                                </h3>

                                <p className="mt-3 flex-1 text-sm leading-6 text-ink-soft">
                                    {feature.description}
                                </p>

                                <p className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-forest">
                                    {feature.cta}
                                    <Icon
                                        name="arrowRight"
                                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                    />
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI teaser strip */}
            <section className="px-6 pb-24">
                <Link
                    to="/discover"
                    className="group mx-auto flex max-w-6xl flex-col items-center gap-6 overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-forest to-forest-dark p-10 text-center shadow-lift transition-transform hover:-translate-y-1 sm:flex-row sm:text-left"
                >
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gold/20 text-gold-light">
                        <Icon name="sparkles" className="h-8 w-8" strokeWidth={1.5} />
                    </div>

                    <div className="flex-1">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gold-light">
                            New
                        </span>
                        <h3 className="mt-3 font-display text-2xl font-semibold text-paper sm:text-3xl">
                            Ask FlavorMate
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-paper/75 sm:max-w-xl">
                            Sometimes you know what you want. Sometimes you just know you’re hungry. FlavorMate helps you find the recipe in between.
                        </p>
                    </div>

                    <Icon
                        name="arrowRight"
                        className="h-6 w-6 flex-shrink-0 text-gold-light transition-transform group-hover:translate-x-1"
                    />
                </Link>
            </section>
        </div>
    );
}
