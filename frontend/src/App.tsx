import { useState } from "react";

type HealthResponse = {
  status: string;
};

type ThemeName = "light" | "dark";

const lightTheme = {
  pageBg: "linear-gradient(180deg, #fff7ed, #fee2e2)",
  cardBg: "rgba(255, 255, 255, 0.96)",
  cardBorder: "rgba(248, 187, 208, 0.9)",
  mainText: "#3f3f46",
  mutedText: "#78716c",
  accent: "#ec4899",
  accentText: "#f9fafb",
  calendarPlaceholderBorder: "1px dashed rgba(248, 187, 208, 0.9)",
};

const darkTheme = {
  pageBg: "linear-gradient(180deg, #020617, #111827)",
  cardBg: "rgba(15, 23, 42, 0.96)",
  cardBorder: "rgba(148, 163, 184, 0.5)",
  mainText: "#e5e7eb",
  mutedText: "#9ca3af",
  accent: "#22c55e",
  accentText: "#022c22",
  calendarPlaceholderBorder: "1px dashed rgba(148, 163, 184, 0.7)",
};

function App() {
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeName>("light");

  const palette = theme === "light" ? lightTheme : darkTheme;

  const handleCheckBackend = async () => {
    try {
      setLoading(true);
      setError(null);
      setHealthStatus(null);

      const response = await fetch("/api/health");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = (await response.json()) as HealthResponse;
      setHealthStatus(data.status);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
        background: palette.pageBg,
        color: palette.mainText,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "32px",
        paddingBottom: "40px",
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "24px 40px 40px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            borderRadius: "20px",
            padding: "24px 24px 28px",
            backgroundColor: palette.cardBg,
            border: `1px solid ${palette.cardBorder}`,
            boxShadow:
              theme === "light"
                ? "0 20px 40px -20px rgba(248, 113, 113, 0.35)"
                : "0 25px 50px -20px rgba(15, 23, 42, 0.8)",
          }}
        >
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              alignItems: "center",
              marginBottom: "24px",
              flexWrap: "wrap",
            }}
          >
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
              }}
            >
              <button
                onClick={handleToggleTheme}
                style={{
                  padding: "8px 14px",
                  borderRadius: "999px",
                  border: "1px solid rgba(148,163,184,0.5)",
                  backgroundColor:
                    theme === "light" ? "rgba(249,250,251,0.9)" : "#020617",
                  color: palette.mainText,
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                {theme === "light" ? "Тёмная тема" : "Светлая тема"}
              </button>

              <button
                onClick={handleCheckBackend}
                disabled={loading}
                style={{
                  padding: "8px 16px",
                  borderRadius: "999px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                  backgroundColor: palette.accent,
                  color: palette.accentText,
                  opacity: loading ? 0.7 : 1,
                  whiteSpace: "nowrap",
                }}
              >
                {loading ? "Проверка..." : "Проверить backend"}
              </button>
            </div>
          </header>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
              gap: "16px",
            }}
          >
            <div
              style={{
                borderRadius: "16px",
                padding: "16px 16px 18px",
                backgroundColor: palette.cardBg,
                border: `1px solid ${palette.cardBorder}`,
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  marginBottom: "8px",
                }}
              >
                Календарь релизов
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: palette.mutedText,
                  marginBottom: 12,
                }}
              >
                Здесь позже будет полноценный календарь с релизами паков поз на
                Telegram / VK / Boosty / Tumblr.
              </p>
              <div
                style={{
                  height: "280px",
                  borderRadius: "12px",
                  border: palette.calendarPlaceholderBorder,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  color: palette.mutedText,
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                Заглушка календаря (MVP этап 1)
              </div>
            </div>

            <div
              style={{
                borderRadius: "16px",
                padding: "16px 16px 18px",
                backgroundColor: palette.cardBg,
                border: `1px solid ${palette.cardBorder}`,
              }}
            >
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  marginBottom: "8px",
                }}
              >
                Статус backend
              </h2>
              <div style={{ fontSize: "14px" }}>
                {healthStatus && (
                  <p
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>✅</span>
                    <span>
                      Backend ответил:{" "}
                      <span style={{ fontWeight: 600 }}>{healthStatus}</span>
                    </span>
                  </p>
                )}
                {error && (
                  <p
                    style={{
                      color: "#b91c1c",
                    }}
                  >
                    ❌ Ошибка при запросе: {error}
                  </p>
                )}
                {!healthStatus && !error && (
                  <p style={{ color: palette.mutedText }}>
                    Нажми кнопку «Проверить backend», чтобы убедиться, что
                    сервер жив.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
