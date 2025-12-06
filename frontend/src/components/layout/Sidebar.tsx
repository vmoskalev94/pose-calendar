import type {ReactNode} from "react";

interface SidebarProps {
    children?: ReactNode;
}

export function Sidebar({children}: SidebarProps) {
    return (
        <aside
            style={{
                width: "260px",
                padding: "16px",
                borderRight: "1px solid #ddd",
                backgroundColor: "#ffffff",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
            }}
        >
            <div style={{fontWeight: 700, fontSize: "18px"}}>Pose Calendar</div>

            {/* Навигация-заглушка, позже заменим на реальные пункты меню */}
            <nav style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                <span style={{fontSize: "14px", opacity: 0.7}}>Calendar</span>
                <span style={{fontSize: "14px", opacity: 0.4}}>Packs</span>
                <span style={{fontSize: "14px", opacity: 0.4}}>Analytics</span>
                <span style={{fontSize: "14px", opacity: 0.4}}>Settings</span>
            </nav>

            <div style={{marginTop: "auto", fontSize: "12px", opacity: 0.6}}>
                {/* Здесь позже будет профиль / индикатор backend / переключатель темы */}
                Status: dev
            </div>

            {children}
        </aside>
    );
}
