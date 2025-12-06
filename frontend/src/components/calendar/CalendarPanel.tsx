import type {ReactNode, CSSProperties} from "react";

interface CalendarPanelProps {
    children: ReactNode;
    style?: CSSProperties;
}

/**
 * Центральная панель календаря (будущий grid/list).
 * Пока просто обёртка вокруг существующего контента.
 */
export function CalendarPanel({children, style}: CalendarPanelProps) {
    return <div style={style}>{children}</div>;
}
