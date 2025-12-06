import type {ReactNode} from "react";

interface MainAreaProps {
    children: ReactNode;
}

export function MainArea({children}: MainAreaProps) {
    return (
        <main
            style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
            }}
        >
            {children}
        </main>
    );
}
