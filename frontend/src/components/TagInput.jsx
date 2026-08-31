import { useState } from "react";
import Icon from "./Icon";

export default function TagInput({ tags, onAdd, onRemove, placeholder, suggestions = [] }) {
    const [value, setValue] = useState("");

    const commit = () => {
        const clean = value.trim();
        if (clean && !tags.some((t) => t.toLowerCase() === clean.toLowerCase())) {
            onAdd(clean);
        }
        setValue("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit();
        } else if (e.key === "Backspace" && !value && tags.length) {
            onRemove(tags[tags.length - 1]);
        }
    };

    const filteredSuggestions = suggestions
        .filter(
            (s) =>
                value.trim().length > 0 &&
                s.toLowerCase().includes(value.toLowerCase()) &&
                !tags.some((t) => t.toLowerCase() === s.toLowerCase())
        )
        .slice(0, 6);

    return (
        <div>
            <div className="flex min-h-[3.25rem] flex-wrap items-center gap-2 rounded-2xl border-2 border-line bg-card px-3 py-2.5 transition focus-within:border-forest">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1.5 text-sm font-medium text-forest-dark"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => onRemove(tag)}
                            className="text-forest/50 hover:text-rust"
                        >
                            <Icon name="close" className="h-3 w-3" strokeWidth={2.4} />
                        </button>
                    </span>
                ))}

                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={commit}
                    placeholder={tags.length ? "" : placeholder}
                    className="min-w-[8rem] flex-1 bg-transparent px-1 py-1 text-sm text-ink outline-none placeholder:text-ink-faint"
                />
            </div>

            {filteredSuggestions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {filteredSuggestions.map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => {
                                onAdd(s);
                                setValue("");
                            }}
                            className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-medium text-ink-soft hover:border-gold hover:text-gold-dark"
                        >
                            + {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
