import type {
    CSSProperties,
    InputHTMLAttributes,
} from "react";

export interface InputProps
    extends InputHTMLAttributes<HTMLInputElement> {
}

export function Input({style, className, ...rest}: InputProps) {
    const baseStyle: CSSProperties = {
        width: "100%",
        padding: "6px 8px",
        borderRadius: 6,
        border: "1px solid #d1d5db",
        fontSize: 13,
        outline: "none",
        boxSizing: "border-box",
    };

    const finalStyle: CSSProperties = {
        ...baseStyle,
        ...style,
    };

    return (
        <input
            {...rest}
            className={className}
            style={finalStyle}
        />
    );
}
