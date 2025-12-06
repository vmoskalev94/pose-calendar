export function TopBar() {
    return (
        <header
            style={{
                padding: "12px 20px",
                borderBottom: "1px solid #ddd",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
            }}
        >
            <div style={{fontWeight: 600, fontSize: "16px"}}>Calendar</div>

            {/* Здесь позже будут: месяц, Today, переключатель режима, поиск, фильтры, кнопки +Новый пак/+Новый релиз */}
            <div style={{fontSize: "12px", opacity: 0.7}}>
                TopBar placeholder (будет заменён позже)
            </div>
        </header>
    );
}
