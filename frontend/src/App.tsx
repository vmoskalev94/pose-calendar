import { useEffect, useState } from "react";
import { Api } from "./api";
import type {
  PackDto,
  ChecklistItemDto,
  ReleaseDto,
  CalendarEventDto,
} from "./types";

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
  const [theme, setTheme] = useState<ThemeName>("light");
  const palette = theme === "light" ? lightTheme : darkTheme;

  // health
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthError, setHealthError] = useState<string | null>(null);

  // packs
  const [packs, setPacks] = useState<PackDto[]>([]);
  const [packsLoading, setPacksLoading] = useState(false);
  const [packsError, setPacksError] = useState<string | null>(null);
  const [selectedPackId, setSelectedPackId] = useState<number | null>(null);

  // checklist
  const [checklist, setChecklist] = useState<ChecklistItemDto[]>([]);
  const [checklistLoading, setChecklistLoading] = useState(false);
  const [checklistError, setChecklistError] = useState<string | null>(null);

  // releases for selected pack
  const [releases, setReleases] = useState<ReleaseDto[]>([]);
  const [releasesLoading, setReleasesLoading] = useState(false);
  const [releasesError, setReleasesError] = useState<string | null>(null);

  // calendar
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventDto[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);
  const [calendarRangeLabel, setCalendarRangeLabel] = useState<string>("");

  const selectedPack =
    selectedPackId != null
      ? packs.find((p) => p.id === selectedPackId) ?? null
      : null;

  // --- Health check ---
  const handleCheckBackend = async () => {
    try {
      setHealthLoading(true);
      setHealthError(null);
      setHealthStatus(null);

      const response = await fetch("/api/health");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = (await response.json()) as HealthResponse;
      setHealthStatus(data.status);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setHealthError(e.message);
      } else {
        setHealthError("Unknown error");
      }
    } finally {
      setHealthLoading(false);
    }
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // --- Load packs on mount ---
  useEffect(() => {
    const loadPacks = async () => {
      try {
        setPacksLoading(true);
        setPacksError(null);
        const data = await Api.getPacks();
        setPacks(data);

        if (data.length > 0 && selectedPackId == null) {
          setSelectedPackId(data[0].id);
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        setPacksError(message);
      } finally {
        setPacksLoading(false);
      }
    };

    void loadPacks();
  }, [selectedPackId]);

  // --- Load checklist + releases when pack changes ---
  useEffect(() => {
    if (selectedPackId == null) {
      setChecklist([]);
      setReleases([]);
      setChecklistError(null);
      setReleasesError(null);
      return;
    }

    const loadDetails = async (packId: number) => {
      try {
        setChecklistLoading(true);
        setReleasesLoading(true);
        setChecklistError(null);
        setReleasesError(null);

        const [checklistData, releasesData] = await Promise.all([
          Api.getChecklist(packId),
          Api.getReleasesForPack(packId),
        ]);

        setChecklist(checklistData);
        setReleases(releasesData);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        setChecklistError(message);
        setReleasesError(message);
      } finally {
        setChecklistLoading(false);
        setReleasesLoading(false);
      }
    };

    void loadDetails(selectedPackId);
  }, [selectedPackId]);

  // --- Load calendar for current month ---
  const handleLoadCurrentMonthCalendar = async () => {
    const { from, to, label } = getCurrentMonthRange();
    try {
      setCalendarLoading(true);
      setCalendarError(null);
      setCalendarRangeLabel(label);
      const data = await Api.getCalendarEvents(from, to);
      setCalendarEvents(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setCalendarError(message);
    } finally {
      setCalendarLoading(false);
    }
  };

  const handleChecklistToggle = async (item: ChecklistItemDto) => {
    const newDone = !item.done;

    // оптимистичное обновление
    setChecklist((prev) =>
      prev.map((it) =>
        it.id === item.id
          ? {
              ...it,
              done: newDone,
            }
          : it
      )
    );
    setChecklistError(null);

    try {
      const updated = await Api.toggleChecklistItemDone(item.id, newDone);
      setChecklist((prev) =>
        prev.map((it) => (it.id === updated.id ? updated : it))
      );
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setChecklistError(message);

      // откат
      setChecklist((prev) =>
        prev.map((it) => (it.id === item.id ? item : it))
      );
    }
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
          maxWidth: 1280,
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
                disabled={healthLoading}
                style={{
                  padding: "8px 16px",
                  borderRadius: "999px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                  backgroundColor: palette.accent,
                  color: palette.accentText,
                  opacity: healthLoading ? 0.7 : 1,
                  whiteSpace: "nowrap",
                }}
              >
                {healthLoading ? "Проверка..." : "Проверить backend"}
              </button>
            </div>
          </header>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 2fr)",
              gap: "16px",
              alignItems: "flex-start",
            }}
          >
            {/* Левая колонка: паки + статус backend */}
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
                Паки поз
              </h2>

              {packsLoading && (
                <p style={{ fontSize: 14, color: palette.mutedText }}>
                  Загрузка паков...
                </p>
              )}

              {packsError && (
                <p style={{ fontSize: 14, color: "#b91c1c" }}>
                  Ошибка загрузки: {packsError}
                </p>
              )}

              {!packsLoading && !packsError && packs.length === 0 && (
                <p style={{ fontSize: 14, color: palette.mutedText }}>
                  Пока нет ни одного пака. Создай его через API, а потом
                  обнови страницу.
                </p>
              )}

              {packs.length > 0 && (
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    maxHeight: 260,
                    overflowY: "auto",
                  }}
                >
                  {packs.map((pack) => {
                    const isSelected = pack.id === selectedPackId;
                    return (
                      <button
                        key={pack.id}
                        onClick={() => setSelectedPackId(pack.id)}
                        style={{
                          textAlign: "left",
                          borderRadius: 10,
                          border: isSelected
                            ? `1px solid ${palette.accent}`
                            : "1px solid rgba(148,163,184,0.4)",
                          padding: "8px 10px",
                          backgroundColor: isSelected
                            ? theme === "light"
                              ? "rgba(253, 224, 230, 0.9)"
                              : "rgba(30, 64, 175, 0.5)"
                            : "transparent",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            marginBottom: 2,
                          }}
                        >
                          {pack.nameRu}
                        </div>
                        {pack.nameEn && (
                          <div
                            style={{
                              fontSize: 12,
                              color: palette.mutedText,
                              marginBottom: 2,
                            }}
                          >
                            {pack.nameEn}
                          </div>
                        )}
                        <div
                          style={{
                            display: "flex",
                            gap: 6,
                            fontSize: 11,
                            color: palette.mutedText,
                          }}
                        >
                          <span>{pack.type}</span>
                          <span>•</span>
                          <span>{pack.status}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Статус backend */}
              <div
                style={{
                  marginTop: 16,
                  paddingTop: 12,
                  borderTop: `1px solid ${palette.cardBorder}`,
                  fontSize: 14,
                }}
              >
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                >
                  Статус backend
                </h3>
                {healthStatus && (
                  <p
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span>✅</span>
                    <span>
                      Backend ответил:{" "}
                      <span style={{ fontWeight: 600 }}>{healthStatus}</span>
                    </span>
                  </p>
                )}
                {healthError && (
                  <p
                    style={{
                      color: "#b91c1c",
                    }}
                  >
                    ❌ Ошибка при запросе: {healthError}
                  </p>
                )}
                {!healthStatus && !healthError && (
                  <p style={{ color: palette.mutedText }}>
                    Нажми «Проверить backend», чтобы убедиться, что сервер жив.
                  </p>
                )}
              </div>
            </div>

            {/* Правая колонка: календарь + детали пака */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* Календарь релизов */}
              <div
                style={{
                  borderRadius: "16px",
                  padding: "16px 16px 18px",
                  backgroundColor: palette.cardBg,
                  border: `1px solid ${palette.cardBorder}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 8,
                    alignItems: "center",
                    marginBottom: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "18px",
                      fontWeight: 600,
                    }}
                  >
                    Календарь релизов
                  </h2>
                  <button
                    onClick={handleLoadCurrentMonthCalendar}
                    disabled={calendarLoading}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 999,
                      border: "1px solid rgba(148,163,184,0.5)",
                      backgroundColor:
                        theme === "light" ? "rgba(249, 250, 251, 0.9)" : "#020617",
                      color: palette.mainText,
                      cursor: "pointer",
                      fontSize: 13,
                      whiteSpace: "nowrap",
                      opacity: calendarLoading ? 0.7 : 1,
                    }}
                  >
                    {calendarLoading
                      ? "Загрузка..."
                      : "Загрузить релизы за текущий месяц"}
                  </button>
                </div>

                {calendarRangeLabel && (
                  <p
                    style={{
                      fontSize: 12,
                      color: palette.mutedText,
                      marginBottom: 6,
                    }}
                  >
                    {calendarRangeLabel}
                  </p>
                )}

                {calendarError && (
                  <p style={{ fontSize: 14, color: "#b91c1c" }}>
                    Ошибка загрузки календаря: {calendarError}
                  </p>
                )}

                <div
                  style={{
                    marginTop: 6,
                    borderRadius: 12,
                    border: calendarEvents.length
                      ? "none"
                      : palette.calendarPlaceholderBorder,
                    padding: calendarEvents.length ? 0 : 10,
                    maxHeight: 220,
                    overflowY: "auto",
                  }}
                >
                  {calendarEvents.length === 0 && !calendarLoading && !calendarError && (
                    <div
                      style={{
                        height: 180,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        color: palette.mutedText,
                        textAlign: "center",
                      }}
                    >
                      Пока нет загруженных событий календаря. Нажми кнопку выше,
                      чтобы подгрузить релизы.
                    </div>
                  )}

                  {calendarEvents.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                        paddingRight: 4,
                      }}
                    >
                      {calendarEvents.map((event) => (
                        <div
                          key={event.releaseId}
                          style={{
                            borderRadius: 10,
                            border: `1px solid ${palette.cardBorder}`,
                            padding: "6px 8px",
                            fontSize: 13,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 8,
                              marginBottom: 2,
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 600,
                              }}
                            >
                              {formatDateTimeShort(event.releaseDateTime)}
                            </span>
                            <span
                              style={{
                                fontSize: 11,
                                color: palette.mutedText,
                              }}
                            >
                              {event.packType} · {event.packStatus}
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              marginBottom: 2,
                            }}
                          >
                            {event.packNameRu}
                          </div>
                          {event.packNameEn && (
                            <div
                              style={{
                                fontSize: 12,
                                color: palette.mutedText,
                              }}
                            >
                              {event.packNameEn}
                            </div>
                          )}
                          <div
                            style={{
                              fontSize: 11,
                              color: palette.mutedText,
                              marginTop: 4,
                            }}
                          >
                            Площадки:{" "}
                            {[
                              event.telegramPlanned && "Telegram",
                              event.vkPlanned && "VK",
                              event.boostyPlanned && "Boosty",
                              event.tumblrPlanned && "Tumblr",
                            ]
                              .filter(Boolean)
                              .join(" · ") || "не указаны"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Детали выбранного пака + чеклист + релизы */}
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
                    fontSize: 16,
                    fontWeight: 600,
                    marginBottom: 8,
                  }}
                >
                  Выбранный пак
                </h2>

                {!selectedPack && (
                  <p style={{ fontSize: 14, color: palette.mutedText }}>
                    Выбери пак слева, чтобы посмотреть чек-лист и релизы.
                  </p>
                )}

                {selectedPack && (
                  <>
                    <div
                      style={{
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          marginBottom: 2,
                        }}
                      >
                        {selectedPack.nameRu}
                      </div>
                      {selectedPack.nameEn && (
                        <div
                          style={{
                            fontSize: 13,
                            color: palette.mutedText,
                            marginBottom: 4,
                          }}
                        >
                          {selectedPack.nameEn}
                        </div>
                      )}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 6,
                          fontSize: 11,
                          color: palette.mutedText,
                        }}
                      >
                        <span>Тип: {selectedPack.type}</span>
                        <span>•</span>
                        <span>Статус: {selectedPack.status}</span>
                        {selectedPack.tags && (
                          <>
                            <span>•</span>
                            <span>{selectedPack.tags}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Чек-лист */}
                    <div
                      style={{
                        marginTop: 8,
                        marginBottom: 10,
                      }}
                    >
                      <h3
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          marginBottom: 6,
                        }}
                      >
                        Чек-лист
                      </h3>

                      {checklistLoading && (
                        <p style={{ fontSize: 13, color: palette.mutedText }}>
                          Загрузка чек-листа...
                        </p>
                      )}

                      {checklistError && (
                        <p style={{ fontSize: 13, color: "#b91c1c" }}>
                          Ошибка чек-листа: {checklistError}
                        </p>
                      )}

                      {!checklistLoading &&
                        !checklistError &&
                        checklist.length === 0 && (
                          <p
                            style={{
                              fontSize: 13,
                              color: palette.mutedText,
                            }}
                          >
                            Чек-лист пуст.
                          </p>
                        )}

                      {checklist.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                            maxHeight: 180,
                            overflowY: "auto",
                            paddingRight: 4,
                          }}
                        >
                          {checklist.map((item) => (
                            <label
                              key={item.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                fontSize: 13,
                                cursor: "pointer",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={item.done}
                                onChange={() => handleChecklistToggle(item)}
                              />
                              <span
                                style={{
                                  textDecoration: item.done
                                    ? "line-through"
                                    : "none",
                                  color: item.done
                                    ? palette.mutedText
                                    : palette.mainText,
                                }}
                              >
                                {item.title}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Релизы */}
                    <div>
                      <h3
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          marginBottom: 6,
                        }}
                      >
                        Релизы
                      </h3>

                      {releasesLoading && (
                        <p style={{ fontSize: 13, color: palette.mutedText }}>
                          Загрузка релизов...
                        </p>
                      )}

                      {releasesError && (
                        <p style={{ fontSize: 13, color: "#b91c1c" }}>
                          Ошибка релизов: {releasesError}
                        </p>
                      )}

                      {!releasesLoading &&
                        !releasesError &&
                        releases.length === 0 && (
                          <p
                            style={{
                              fontSize: 13,
                              color: palette.mutedText,
                            }}
                          >
                            Для этого пака ещё нет релизов. Создай их через API,
                            а здесь появится список.
                          </p>
                        )}

                      {releases.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                            maxHeight: 140,
                            overflowY: "auto",
                            paddingRight: 4,
                          }}
                        >
                          {releases.map((release) => (
                            <div
                              key={release.id}
                              style={{
                                borderRadius: 8,
                                border: `1px solid ${palette.cardBorder}`,
                                padding: "4px 8px",
                                fontSize: 12,
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: 600,
                                  marginBottom: 2,
                                }}
                              >
                                {formatDateTimeShort(release.releaseDateTime)}
                              </div>
                              <div
                                style={{
                                  color: palette.mutedText,
                                }}
                              >
                                Площадки:{" "}
                                {[
                                  release.telegramPlanned && "Telegram",
                                  release.vkPlanned && "VK",
                                  release.boostyPlanned && "Boosty",
                                  release.tumblrPlanned && "Tumblr",
                                ]
                                  .filter(Boolean)
                                  .join(" · ") || "не указаны"}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
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

function getCurrentMonthRange(): { from: string; to: string; label: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1..12

  const pad = (n: number) => n.toString().padStart(2, "0");
  const lastDay = new Date(year, month, 0).getDate();

  const from = `${year}-${pad(month)}-01T00:00:00`;
  const to = `${year}-${pad(month)}-${pad(lastDay)}T23:59:59`;
  const label = `Текущий месяц: ${pad(month)}.${year}`;

  return { from, to, label };
}

function formatDateTimeShort(dateTime: string): string {
  const d = new Date(dateTime);
  if (Number.isNaN(d.getTime())) {
    return dateTime;
  }
  return d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
