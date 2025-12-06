import type {ReactNode, CSSProperties} from "react";

interface DetailsPanelProps {
    children: ReactNode;
    style?: CSSProperties;
}

/**
 * Правая колонка деталей (выбранный день / upcoming / выбранный пак).
 * Пока просто обёртка вокруг существующего контента.
 */
export function DetailsPanel({children, style}: DetailsPanelProps) {
    return <aside style={style}>{children}</aside>;
}
