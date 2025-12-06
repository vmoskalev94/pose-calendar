import type {ReactNode} from "react";

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({children}: ThemeProviderProps) {
    // Пока просто пробрасываем children без логики темы.
    // Позже сюда добавим переключатель светлая/тёмная тема.
    return <>{children}</>;
}
