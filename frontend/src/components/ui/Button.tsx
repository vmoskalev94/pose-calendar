import type {
    ButtonHTMLAttributes,
    CSSProperties,
    ReactNode,
} from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: ReactNode;
}

export function Button({
                           variant = "primary",
                           size = "md",
                           children,
                           style,
                           className,
                           ...rest
                       }: ButtonProps) {
    const baseStyle: CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        borderRadius: 8,
        border: "1px solid transparent",
        fontSize: 13,
        fontWeight: 500,
        cursor: rest.disabled ? "not-allowed" : "pointer",
        opacity: rest.disabled ? 0.6 : 1,
        transition: "background-color 0.15s ease, border-color 0.15s ease",
    };

    const sizeStyle: Record<ButtonSize, CSSProperties> = {
        sm: {padding: "4px 10px"},
        md: {padding: "6px 14px"},
        lg: {padding: "8px 18px", fontSize: 14},
    };

    const variantStyle: Record<ButtonVariant, CSSProperties> = {
        primary: {
            backgroundColor: "#2563eb",
            color: "#ffffff",
            borderColor: "#2563eb",
        },
        secondary: {
            backgroundColor: "#f3f4f6",
            color: "#111827",
            borderColor: "#d1d5db",
        },
        ghost: {
            backgroundColor: "transparent",
            color: "#111827",
            borderColor: "transparent",
        },
    };

    const finalStyle: CSSProperties = {
        ...baseStyle,
        ...sizeStyle[size],
        ...variantStyle[variant],
        ...style,
    };

    return (
        <button
            {...rest}
            className={className}
            style={finalStyle}
        >
            {children}
        </button>
    );
}
