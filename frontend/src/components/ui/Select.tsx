import type {
    CSSProperties,
    SelectHTMLAttributes,
} from "react";

export interface SelectProps
    extends SelectHTMLAttributes<HTMLSelectElement> {
}

export function Select({style, className, children, ...rest}: SelectProps) {
    const baseStyle: CSSProperties = {
        width: "100%",
        padding: "6px 8px",
        borderRadius: 6,
        border: "1px solid #d1d5db",
        fontSize: 13,
        outline: "none",
        boxSizing: "border-box",
        backgroundColor: "#ffffff",
    };

    const finalStyle: CSSProperties = {
        ...baseStyle,
        ...style,
    };

    return (
        <select
            {...rest}
            className={className}
            style={finalStyle}
        >
            {children}
        </select>
    );
}
