import type {
    CSSProperties,
    TextareaHTMLAttributes,
} from "react";

export interface TextareaProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {
}

export function Textarea({style, className, ...rest}: TextareaProps) {
    const baseStyle: CSSProperties = {
        width: "100%",
        padding: "6px 8px",
        borderRadius: 6,
        border: "1px solid #d1d5db",
        fontSize: 13,
        outline: "none",
        boxSizing: "border-box",
        minHeight: 60,
        resize: "vertical",
    };

    const finalStyle: CSSProperties = {
        ...baseStyle,
        ...style,
    };

    return (
        <textarea
            {...rest}
            className={className}
            style={finalStyle}
        />
    );
}
