import { useState } from "react";
import Icon from "../components/Icon";
import Button from "../components/Button";
import { useToast } from "../context/useToast";

const ideas = [
    "Something cozy for a rainy night, using what's already in my pantry",
    "A quick weeknight dinner with chicken and whatever vegetables I have",
    "A dessert that uses up three overripe bananas",
];

export default function Discover() {
    const { showToast } = useToast();
    const [prompt, setPrompt] = useState("");

    const handleNotify = (e) => {
        e.preventDefault();
        showToast("Thanks for your interest! AI Discovery is still in the oven.");
        setPrompt("");
    };

    return (
        <div className="min-h-[80vh] bg-paper px-4 py-14 sm:py-20">
            <div className="mx-auto max-w-3xl">
                <div className="mb-10 text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-gold-dark">
                        <Icon name="sparkles" className="h-3.5 w-3.5" />
                        Coming soon
                    </span>

                    <h1 className="mt-5 font-display text-3xl font-semibold text-ink sm:text-4xl">
                        AI-Assisted Recipe Discovery
                    </h1>
                    <p className="mx-auto mt-3 max-w-xl text-base text-ink-soft">
                        Describe a craving, a mood, or a fridge full of odds and ends — an AI
                        cooking companion will help translate it into a recipe worth making.
                    </p>
                </div>

                <form
                    onSubmit={handleNotify}
                    className="rounded-3xl border border-line bg-card p-6 shadow-soft sm:p-8"
                >
                    <label className="mb-3 block text-sm font-semibold uppercase tracking-wide text-ink-soft">
                        Try describing what you're in the mood for
                    </label>

                    <div className="relative">
                        <Icon
                            name="sparkles"
                            className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-gold"
                        />
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g. Something warm and spiced for a cold evening…"
                            className="h-28 w-full resize-none rounded-2xl border-2 border-line bg-paper px-4 py-3.5 pl-12 text-sm text-ink outline-none transition focus:border-gold"
                        />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {ideas.map((idea) => (
                            <button
                                key={idea}
                                type="button"
                                onClick={() => setPrompt(idea)}
                                className="rounded-full border border-line bg-paper px-3 py-1.5 text-left text-xs font-medium text-ink-soft transition hover:border-gold hover:text-gold-dark"
                            >
                                {idea}
                            </button>
                        ))}
                    </div>

                    <Button type="submit" className="mt-6 w-full" size="lg" icon="sparkles">
                        Notify me when it's ready
                    </Button>
                </form>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                    {[
                        {
                            icon: "sparkles",
                            title: "Describe, don't search",
                            body: "Skip the keyword guessing — just say what you're craving.",
                        },
                        {
                            icon: "carrot",
                            title: "Built on your pantry",
                            body: "Suggestions will lean on the ingredients you already track.",
                        },
                        {
                            icon: "book",
                            title: "Saved to your book",
                            body: "Anything you love can be saved straight into your journal.",
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="rounded-2xl border border-line bg-card p-5 text-center shadow-soft"
                        >
                            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest">
                                <Icon name={item.icon} className="h-5 w-5" strokeWidth={1.6} />
                            </div>
                            <h3 className="font-display text-base font-semibold text-ink">
                                {item.title}
                            </h3>
                            <p className="mt-1.5 text-xs leading-5 text-ink-soft">{item.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
