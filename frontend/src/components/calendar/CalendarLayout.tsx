import type {ReactNode, CSSProperties} from "react";

interface CalendarLayoutProps {
    panel: ReactNode;   // центральная часть: календарь / список
    details: ReactNode; // правая колонка: выбранный день / upcoming
}

/**
 * Двухколоночный layout для календаря:
 * слева календарь, справа — детали.
 * Пока это заготовка, использовать начнём позже.
 */
export function CalendarLayout({panel, details}: CalendarLayoutProps) {
    const containerStyle: CSSProperties = {
        display: "grid",
        gridTemplateColumns: "minmax(0, 2.2fr) minmax(260px, 340px)",
        gap: 16,
        alignItems: "flex-start",
        width: "100%",
        boxSizing: "border-box",
    };

    return (
        <div style={containerStyle}>
            <div>{panel}</div>
            <aside>{details}</aside>
        </div>
    );
}
