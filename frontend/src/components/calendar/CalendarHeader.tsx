import type {CSSProperties} from "react";
import {Button} from "../ui/Button";

export interface CalendarHeaderPalette {
    mainText: string;
    mutedText: string;
    accent: string;
    accentText: string;
}

export interface CalendarHeaderProps {
    theme: "light" | "dark";
    palette: CalendarHeaderPalette;
    onToggleTheme: () => void;
    onCheckBackend: () => void;
    healthLoading: boolean;
}

/**
 * Шапка страницы календаря:
 * заголовок, подпись, переключатель темы, кнопка проверки backend.
 * Пока без месяца/переключателя вида — это добавим позже.
 */
export function CalendarHeader({
                                   theme,
                                   palette,
                                   onToggleTheme,
                                   onCheckBackend,
                                   healthLoading,
                               }: CalendarHeaderProps) {
    const headerStyle: CSSProperties = {
        display: "flex",
        justifyContent: "space-between",
        gap: "16px",
        alignItems: "center",
        marginBottom: "24px",
        flexWrap: "wrap",
    };

    return (
        <header style={headerStyle}>
            <div>
                <h1
                    style={{
                        fontSize: "28px",
                        fontWeight: 700,
                        marginBottom: "4px",
                    }}
                >
                    Pose Calendar
                </h1>
                <p
                    style={{
                        color: palette.mutedText,
                        fontSize: "14px",
                    }}
                >
                    Локальное приложение для планирования выходов паков поз.
                </p>
            </div>

            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onToggleTheme}
                    style={{
                        padding: "8px 14px",
                        borderRadius: 999,
                        border: "1px solid rgba(148,163,184,0.5)",
                        backgroundColor:
                            theme === "light" ? "rgba(249,250,251,0.9)" : "#020617",
                        color: palette.mainText,
                        fontSize: "13px",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                    }}
                >
                    {theme === "light" ? "Тёмная тема" : "Светлая тема"}
                </Button>

                <Button
                    variant="primary"
                    size="md"
                    onClick={onCheckBackend}
                    disabled={healthLoading}
                    style={{
                        padding: "8px 16px",
                        borderRadius: 999,
                        backgroundColor: palette.accent,
                        color: palette.accentText,
                        fontSize: "14px",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        opacity: healthLoading ? 0.7 : 1,
                    }}
                >
                    {healthLoading ? "Проверка..." : "Проверить backend"}
                </Button>
            </div>
        </header>
    );
}
