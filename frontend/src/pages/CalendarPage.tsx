import { LegacyAppContent } from "../LegacyAppContent";

/**
 * Пока это просто оболочка вокруг старого LegacyAppContent.
 * Дальше мы будем постепенно переносить сюда логику календаря,
 * паков и релизов, разбивая на подкомпоненты.
 */
export function CalendarPage() {
    return <LegacyAppContent />;
}
