import type {ReactNode} from "react";

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({children}: AppShellProps) {
    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                backgroundColor: "#f5f5f7",
            }}
        >
            {children}
        </div>
    );
}
