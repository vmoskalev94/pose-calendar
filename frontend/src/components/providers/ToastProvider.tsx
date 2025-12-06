import type {ReactNode} from "react";

interface ToastProviderProps {
    children: ReactNode;
}

export function ToastProvider({children}: ToastProviderProps) {
    // В будущем здесь будет слой уведомлений (toasts/snackbars).
    return <>{children}</>;
}
