import { Link } from "react-router-dom";
import Icon from "./Icon";

const variants = {
    primary:
        "bg-forest text-paper hover:bg-forest-dark shadow-soft hover:shadow-card",
    gold: "bg-gold text-white hover:bg-gold-dark shadow-soft hover:shadow-card",
    secondary:
        "bg-transparent text-forest border border-forest/30 hover:border-forest hover:bg-forest-50",
    ghost: "bg-transparent text-ink-soft hover:bg-paper-deep hover:text-ink",
    danger: "bg-transparent text-rust border border-rust/30 hover:bg-rust-50 hover:border-rust",
};

const sizes = {
    sm: "px-3.5 py-1.5 text-sm gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2.5",
};

export default function Button({
    as,
    to,
    variant = "primary",
    size = "md",
    icon,
    iconPosition = "left",
    loading = false,
    disabled = false,
    className = "",
    children,
    ...rest
}) {
    const classes = `inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${variants[variant]} ${sizes[size]} ${className}`;

    const content = (
        <>
            {loading ? (
                <Icon name="loader" className="h-4 w-4 animate-spin" />
            ) : (
                icon && iconPosition === "left" && <Icon name={icon} className="h-4 w-4" />
            )}
            <span>{children}</span>
            {!loading && icon && iconPosition === "right" && (
                <Icon name={icon} className="h-4 w-4" />
            )}
        </>
    );

    if (to) {
        return (
            <Link to={to} className={classes} {...rest}>
                {content}
            </Link>
        );
    }

    const Component = as || "button";
    return (
        <Component className={classes} disabled={disabled || loading} {...rest}>
            {content}
        </Component>
    );
}
