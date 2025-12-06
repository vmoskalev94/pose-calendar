import type {
    LabelHTMLAttributes,
    ReactNode,
    CSSProperties,
} from "react";

export interface LabelProps
    extends LabelHTMLAttributes<HTMLLabelElement> {
    children: ReactNode;
}

export function Label({style, className, children, ...rest}: LabelProps) {
    const baseStyle: CSSProperties = {
        display: "inline-flex",
        fontSize: 12,
        fontWeight: 500,
        color: "#374151",
        marginBottom: 4,
    };

    const finalStyle: CSSProperties = {
        ...baseStyle,
        ...style,
    };

    return (
        <label
            {...rest}
            className={className}
            style={finalStyle}
        >
            {children}
        </label>
    );
}
