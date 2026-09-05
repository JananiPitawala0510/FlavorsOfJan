import { useState } from "react";
import Icon from "../components/Icon";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { sendChatMessage } from "../services/aiService";

const ideas = [
    "Something cozy for a rainy night, using what's already in my pantry",
    "A quick weeknight dinner with chicken and whatever vegetables I have",
    "A dessert that uses up three overripe bananas",
];

export default function Discover() {
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmed = prompt.trim();
        if (!trimmed || loading) return;

        setError(null);
        const history = messages;
        setMessages([...history, { role: "user", content: trimmed }]);
        setPrompt("");
        setLoading(true);

        try {
            const reply = await sendChatMessage(trimmed, history);
            setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
        } catch (err) {
            setError(err.message || "FlavorMate couldn't respond right now.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] bg-paper px-4 py-14 sm:py-20">
            <div className="mx-auto max-w-3xl">
                <div className="mb-10 text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-gold-dark">
                        <Icon name="sparkles" className="h-3.5 w-3.5" />
                        AI cooking companion
                    </span>

                    <h1 className="mt-5 font-display text-3xl font-semibold text-ink sm:text-4xl">
                        Ask FlavorMate
                    </h1>
                    <p className="mx-auto mt-3 max-w-xl text-base text-ink-soft">
                        Got a craving, a mood, or a fridge full of random ingredients? Tell FlavorMate, and it’ll help you turn what you have into something worth cooking.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
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
                                onClick={() => setPrompt(idea)} // Set the prompt when an idea is clicked
                                className="rounded-full border border-line bg-paper px-3 py-1.5 text-left text-xs font-medium text-ink-soft transition hover:border-gold hover:text-gold-dark"
                            >
                                {idea}
                            </button>
                        ))}
                    </div>

                    <Button
                        type="submit"
                        className="mt-6 w-full"
                        size="lg"
                        icon="sparkles"
                        loading={loading}
                        disabled={!prompt.trim()}
                    >
                        Ask FlavorMate
                    </Button>
                </form>

                {error && (
                    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-rust/30 bg-rust-50 p-4 text-rust-dark">
                        <Icon name="alert" className="mt-0.5 h-5 w-5 flex-shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {messages.length > 0 && (
                    <div className="mt-8 space-y-4">
                        {messages.map((msg, idx) =>
                            msg.role === "user" ? (
                                <div key={idx} className="flex justify-end">
                                    <p className="max-w-[85%] rounded-2xl rounded-br-md bg-forest px-4 py-3 text-sm text-paper">
                                        {msg.content}
                                    </p> 
                                </div> // Display user messages on the right side with a green background
                            ) : (
                                <div key={idx} className="flex justify-start">
                                    <div className="flex max-w-[90%] gap-3 rounded-2xl rounded-bl-md border border-line bg-card px-4 py-3.5 shadow-soft">
                                        <Icon
                                            name="sparkles"
                                            className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold"
                                        />
                                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
                                            {msg.content}
                                        </p>
                                    </div>
                                </div>
                            )
                        )}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="rounded-2xl rounded-bl-md border border-line bg-card px-4 py-3">
                                    <Loader label="FlavorMate is thinking…" />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                    {[
                        {
                            icon: "sparkles",
                            title: "Describe, don't search",
                            body: "Skip the keyword guessing, just say what you're craving.",
                        },
                        {
                            icon: "carrot",
                            title: "Built on your pantry",
                            body: "Suggestions lean on the ingredients and recipes you already track.",
                        },
                        {
                            icon: "book",
                            title: "Saved to your book",
                            body: "Anything you love can be added straight into your journal.",
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
