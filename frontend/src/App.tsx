import { useEffect, useState, FormEvent } from "react";
import { Api } from "./api";
import type {
  PackDto,
  ChecklistItemDto,
  ReleaseDto,
  CalendarEventDto,
  PackType,
  PackStatus,
} from "./types";

type ThemeName = "light" | "dark";

type PackFormState = {
  nameRu: string;
  nameEn: string;
  type: PackType;
  tags: string;
  description: string;
  screensDir: string;
};

type ReleaseFormState = {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  packId: number | null;
  telegramPlanned: boolean;
  vkPlanned: boolean;
  boostyPlanned: boolean;
  tumblrPlanned: boolean;
};

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

const PACK_TYPE_OPTIONS: { value: PackType; label: string }[] = [
  { value: "FREE", label: "Бесплатный" },
  { value: "SUBSCRIPTION_L1", label: "Подписка L1" },
  { value: "SUBSCRIPTION_L2", label: "Подписка L2" },
  { value: "EXCLUSIVE", label: "Эксклюзив" },
  { value: "EARLY_ACCESS", label: "Ранний доступ" },
];

type HealthResponse = {
  status: string;
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
  const [calendarRange, setCalendarRange] = useState<{
    from: string;
    to: string;
  } | null>(null);

  // форма создания пака
  const [createForm, setCreateForm] = useState<PackFormState>({
    nameRu: "",
    nameEn: "",
    type: "FREE",
    tags: "",
    description: "",
    screensDir: "",
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // форма создания релиза
  const [releaseForm, setReleaseForm] = useState<ReleaseFormState>({
    date: "",
    time: "19:00",
    packId: null,
    telegramPlanned: true,
    vkPlanned: true,
    boostyPlanned: false,
    tumblrPlanned: false,
  });
  const [isReleaseFormOpen, setIsReleaseFormOpen] = useState(false);
  const [releaseCreateLoading, setReleaseCreateLoading] = useState(false);
  const [releaseCreateError, setReleaseCreateError] = useState<string | null>(
    null
  );

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

  // --- Создание пака ---
  const handleCreateFieldChange = (
    field: keyof PackFormState,
    value: string
  ) => {
    setCreateForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreatePack = async (e: FormEvent) => {
    e.preventDefault();

    if (!createForm.nameRu.trim()) {
      setCreateError("Название (по-русски) обязательно");
      return;
    }

    setCreateLoading(true);
    setCreateError(null);

    try {
      const newPack = await Api.createPack({
        nameRu: createForm.nameRu.trim(),
        nameEn: createForm.nameEn.trim() || null,
        type: createForm.type,
        posesCount: null,
        couplePosesCount: null,
        tags: createForm.tags.trim() || null,
        description: createForm.description.trim() || null,
        sourceDir: null,
        screensDir: createForm.screensDir.trim() || null,
        coverFile: null,
        packageFile: null,
      });

      setPacks((prev) => [...prev, newPack]);
      setSelectedPackId(newPack.id);

      setCreateForm({
        nameRu: "",
        nameEn: "",
        type: "FREE",
        tags: "",
        description: "",
        screensDir: "",
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Ошибка создания пака";
      setCreateError(message);
    } finally {
      setCreateLoading(false);
    }
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
      setCalendarRange({ from, to });
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

  const handleOpenReleaseForm = () => {
    if (packs.length === 0) {
      return;
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    setReleaseForm((prev) => ({
      ...prev,
      date: prev.date || `${year}-${month}-${day}`,
      packId:
        prev.packId ??
        selectedPackId ??
        (packs.length > 0 ? packs[0].id : null),
    }));
    setReleaseCreateError(null);
    setIsReleaseFormOpen(true);
  };

  const handleCancelReleaseForm = () => {
    setIsReleaseFormOpen(false);
    setReleaseCreateError(null);
  };

  const handleReleaseDateChange = (value: string) => {
    setReleaseForm((prev) => ({
      ...prev,
      date: value,
    }));
  };

  const handleReleaseTimeChange = (value: string) => {
    setReleaseForm((prev) => ({
      ...prev,
      time: value,
    }));
  };

  const handleReleasePackChange = (value: string) => {
    setReleaseForm((prev) => ({
      ...prev,
      packId: value ? Number(value) : null,
    }));
  };

  const toggleReleaseFlag = (
    field: "telegramPlanned" | "vkPlanned" | "boostyPlanned" | "tumblrPlanned"
  ) => {
    setReleaseForm((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleCreateRelease = async (e: FormEvent) => {
    e.preventDefault();

    if (!releaseForm.date || !releaseForm.time) {
      setReleaseCreateError("Выбери дату и время релиза");
      return;
    }
    if (!releaseForm.packId) {
      setReleaseCreateError("Выбери пак для релиза");
      return;
    }

    const iso = `${releaseForm.date}T${releaseForm.time}:00`;

    try {
      setReleaseCreateLoading(true);
      setReleaseCreateError(null);

      const newRelease = await Api.createRelease({
        packId: releaseForm.packId,
        releaseDateTimeIso: iso,
        telegramPlanned: releaseForm.telegramPlanned,
        vkPlanned: releaseForm.vkPlanned,
        boostyPlanned: releaseForm.boostyPlanned,
        tumblrPlanned: releaseForm.tumblrPlanned,
      });

      // обновим список релизов для выбранного пака
      if (selectedPackId === newRelease.packId) {
        setReleases((prev) => {
          const next = [...prev, newRelease];
          return next.sort((a, b) =>
            a.releaseDateTime.localeCompare(b.releaseDateTime)
          );
        });
      }

      // обновим календарь, если уже загружали диапазон
      if (calendarRange) {
        const refreshed = await Api.getCalendarEvents(
          calendarRange.from,
          calendarRange.to
        );
        setCalendarEvents(refreshed);
      }

      setIsReleaseFormOpen(false);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Ошибка создания релиза";
      setReleaseCreateError(message);
    } finally {
      setReleaseCreateLoading(false);
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
                flexWrap: "wrap",
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
            {/* Левая колонка: форма + паки + статус backend */}
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

              {/* Форма создания пака */}
              <form
                onSubmit={handleCreatePack}
                style={{
                  marginBottom: 12,
                  padding: "10px 10px 12px",
                  borderRadius: 12,
                  backgroundColor:
                    theme === "light"
                      ? "rgba(255,255,255,0.96)"
                      : "rgba(15,23,42,0.96)",
                  border: `1px dashed ${palette.cardBorder}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 2,
                  }}
                >
                  Создать новый пак
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Название (RU) *"
                    value={createForm.nameRu}
                    onChange={(e) =>
                      handleCreateFieldChange("nameRu", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      borderRadius: 8,
                      border:
                        createError && !createForm.nameRu.trim()
                          ? "1px solid #f97373"
                          : theme === "light"
                          ? "1px solid rgba(209, 213, 219, 0.9)"
                          : "1px solid rgba(55, 65, 81, 0.9)",
                      backgroundColor:
                        theme === "light"
                          ? "rgba(255,255,255,0.95)"
                          : "rgba(15,23,42,0.9)",
                      color: palette.mainText,
                      fontSize: 13,
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Название (EN)"
                    value={createForm.nameEn}
                    onChange={(e) =>
                      handleCreateFieldChange("nameEn", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      borderRadius: 8,
                      border:
                        theme === "light"
                          ? "1px solid rgba(209, 213, 219, 0.9)"
                          : "1px solid rgba(55, 65, 81, 0.9)",
                      backgroundColor:
                        theme === "light"
                          ? "rgba(255,255,255,0.95)"
                          : "rgba(15,23,42,0.9)",
                      color: palette.mainText,
                      fontSize: 13,
                      outline: "none",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                  }}
                >
                  <select
                    value={createForm.type}
                    onChange={(e) =>
                      handleCreateFieldChange(
                        "type",
                        e.target.value as PackFormState["type"]
                      )
                    }
                    style={{
                      flex: "0 0 130px",
                      padding: "6px 8px",
                      borderRadius: 8,
                      border:
                        releaseCreateError && !releaseForm.packId
                          ? "1px solid #f97373"
                          : theme === "light"
                          ? "1px solid rgba(209, 213, 219, 0.9)"
                          : "1px solid rgba(55, 65, 81, 0.9)",
                      backgroundColor:
                        theme === "light"
                          ? "rgba(255,255,255,0.95)"
                          : "rgba(15,23,42,0.9)",
                      color: palette.mainText,
                      fontSize: 13,
                      outline: "none",
                    }}
                  >
                    {PACK_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Теги (например, #winter, #skating)"
                    value={createForm.tags}
                    onChange={(e) =>
                      handleCreateFieldChange("tags", e.target.value)
                    }
                    style={{
                      flex: "1 1 160px",
                      padding: "6px 8px",
                      borderRadius: 8,
                      border:
                        theme === "light"
                          ? "1px solid rgba(209, 213, 219, 0.9)"
                          : "1px solid rgba(55, 65, 81, 0.9)",
                      backgroundColor:
                        theme === "light"
                          ? "rgba(255,255,255,0.95)"
                          : "rgba(15,23,42,0.9)",
                      color: palette.mainText,
                      fontSize: 13,
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Папка со скринами (опционально)"
                    value={createForm.screensDir}
                    onChange={(e) =>
                      handleCreateFieldChange("screensDir", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      borderRadius: 8,
                      border:
                        theme === "light"
                          ? "1px solid rgba(209, 213, 219, 0.9)"
                          : "1px solid rgba(55, 65, 81, 0.9)",
                      backgroundColor:
                        theme === "light"
                          ? "rgba(255,255,255,0.95)"
                          : "rgba(15,23,42,0.9)",
                      color: palette.mainText,
                      fontSize: 13,
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <textarea
                    rows={2}
                    placeholder="Краткое описание (опционально)"
                    value={createForm.description}
                    onChange={(e) =>
                      handleCreateFieldChange("description", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      borderRadius: 8,
                      border:
                        theme === "light"
                          ? "1px solid rgba(209, 213, 219, 0.9)"
                          : "1px solid rgba(55, 65, 81, 0.9)",
                      backgroundColor:
                        theme === "light"
                          ? "rgba(255,255,255,0.95)"
                          : "rgba(15,23,42,0.9)",
                      color: palette.mainText,
                      fontSize: 13,
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>

                {createError && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "#b91c1c",
                    }}
                  >
                    {createError}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 4,
                  }}
                >
                  <button
                    type="submit"
                    disabled={createLoading}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 999,
                      border: "none",
                      backgroundColor: palette.accent,
                      color: palette.accentText,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      opacity: createLoading ? 0.8 : 1,
                    }}
                  >
                    {createLoading ? "Создание..." : "Создать пак"}
                  </button>
                </div>
              </form>

              {/* Список паков */}
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
                  Пока нет ни одного пака. Создай его выше.
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
                            flexWrap: "wrap",
                            alignItems: "center",
                            marginTop: 2,
                          }}
                        >
                          <span style={badgeStyle(getPackTypeBadgeColors(pack.type))}>
                            {packTypeLabel(pack.type)}
                          </span>
                          <span style={badgeStyle(getPackStatusBadgeColors(pack.status))}>
                            {packStatusLabel(pack.status)}
                          </span>
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
                                <div
                                  style={{
                                    display: "flex",
                                    gap: 8,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <button
                                    type="button"
                                    onClick={handleOpenReleaseForm}
                                    disabled={packs.length === 0 || releaseCreateLoading}
                                    style={{
                                      padding: "6px 12px",
                                      borderRadius: 999,
                                      border: "1px solid rgba(248, 187, 208, 0.9)",
                                      backgroundColor:
                                        theme === "light"
                                          ? "rgba(255, 247, 237, 0.9)"
                                          : "rgba(30, 64, 175, 0.5)",
                                      color: palette.mainText,
                                      cursor:
                                        packs.length === 0 || releaseCreateLoading
                                          ? "default"
                                          : "pointer",
                                      fontSize: 13,
                                      whiteSpace: "nowrap",
                                      opacity:
                                        packs.length === 0 || releaseCreateLoading ? 0.6 : 1,
                                    }}
                                  >
                                    Новый релиз
                                  </button>

                                  <button
                                    onClick={handleLoadCurrentMonthCalendar}
                                    disabled={calendarLoading}
                                    style={{
                                      padding: "6px 12px",
                                      borderRadius: 999,
                                      border: "1px solid rgba(148,163,184,0.5)",
                                      backgroundColor:
                                        theme === "light"
                                          ? "rgba(249, 250, 251, 0.9)"
                                          : "#020617",
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
                              marginBottom: 4,
                              alignItems: "center",
                              flexWrap: "wrap",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: 13,
                              }}
                            >
                              {formatDateTimeShort(event.releaseDateTime)}
                            </span>
                            <div
                              style={{
                                display: "flex",
                                gap: 6,
                                flexWrap: "wrap",
                                justifyContent: "flex-end",
                              }}
                            >
                              <span style={badgeStyle(getPackTypeBadgeColors(event.packType))}>
                                {packTypeLabel(event.packType)}
                              </span>
                              <span style={badgeStyle(getPackStatusBadgeColors(event.packStatus))}>
                                {packStatusLabel(event.packStatus)}
                              </span>
                            </div>
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
                                {isReleaseFormOpen && (
                                  <form
                                    onSubmit={handleCreateRelease}
                                    style={{
                                      marginTop: 10,
                                      padding: "10px 10px 12px",
                                      borderRadius: 12,
                                      border: `1px dashed ${palette.cardBorder}`,
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 6,
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: 13,
                                        fontWeight: 600,
                                        marginBottom: 2,
                                      }}
                                    >
                                      Новый релиз
                                    </div>

                                    <div
                                      style={{
                                        display: "flex",
                                        gap: 8,
                                        flexWrap: "wrap",
                                      }}
                                    >
                                      <input
                                        type="date"
                                        value={releaseForm.date}
                                        onChange={(e) =>
                                          handleReleaseDateChange(e.target.value)
                                        }
                                        style={{
                                          padding: "6px 8px",
                                          borderRadius: 8,
                                          border:
                                            releaseCreateError && !releaseForm.date
                                              ? "1px solid #f97373"
                                              : theme === "light"
                                              ? "1px solid rgba(209, 213, 219, 0.9)"
                                              : "1px solid rgba(55, 65, 81, 0.9)",
                                          backgroundColor:
                                            theme === "light"
                                              ? "rgba(255,255,255,0.95)"
                                              : "rgba(15,23,42,0.9)",
                                          color: palette.mainText,
                                          fontSize: 13,
                                          outline: "none",
                                        }}
                                      />
                                      <input
                                        type="time"
                                        value={releaseForm.time}
                                        onChange={(e) =>
                                          handleReleaseTimeChange(e.target.value)
                                        }
                                        style={{
                                          padding: "6px 8px",
                                          borderRadius: 8,
                                          border:
                                            releaseCreateError && !releaseForm.time
                                              ? "1px solid #f97373"
                                              : theme === "light"
                                              ? "1px solid rgba(209, 213, 219, 0.9)"
                                              : "1px solid rgba(55, 65, 81, 0.9)",
                                          backgroundColor:
                                            theme === "light"
                                              ? "rgba(255,255,255,0.95)"
                                              : "rgba(15,23,42,0.9)",
                                          color: palette.mainText,
                                          fontSize: 13,
                                          outline: "none",
                                        }}
                                      />
                                    </div>

                                    <div>
                                      <select
                                        value={releaseForm.packId ?? ""}
                                        onChange={(e) =>
                                          handleReleasePackChange(e.target.value)
                                        }
                                        style={{
                                          width: "100%",
                                          padding: "6px 8px",
                                          borderRadius: 8,
                                          border:
                                            releaseCreateError && !releaseForm.packId
                                              ? "1px solid #f97373"
                                              : theme === "light"
                                              ? "1px solid rgba(209, 213, 219, 0.9)"
                                              : "1px solid rgba(55, 65, 81, 0.9)",
                                          backgroundColor:
                                            theme === "light"
                                              ? "rgba(255,255,255,0.95)"
                                              : "rgba(15,23,42,0.9)",
                                          color: palette.mainText,
                                          fontSize: 13,
                                          outline: "none",
                                        }}
                                      >
                                        <option value="">Выбери пак</option>
                                        {packs.map((pack) => (
                                          <option key={pack.id} value={pack.id}>
                                            {pack.nameRu}
                                          </option>
                                        ))}
                                      </select>
                                    </div>

                                    <div
                                      style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 8,
                                        fontSize: 13,
                                      }}
                                    >
                                      <label
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 4,
                                          cursor: "pointer",
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={releaseForm.telegramPlanned}
                                          onChange={() => toggleReleaseFlag("telegramPlanned")}
                                        />
                                        Telegram
                                      </label>
                                      <label
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 4,
                                          cursor: "pointer",
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={releaseForm.vkPlanned}
                                          onChange={() => toggleReleaseFlag("vkPlanned")}
                                        />
                                        VK
                                      </label>
                                      <label
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 4,
                                          cursor: "pointer",
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={releaseForm.boostyPlanned}
                                          onChange={() => toggleReleaseFlag("boostyPlanned")}
                                        />
                                        Boosty
                                      </label>
                                      <label
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 4,
                                          cursor: "pointer",
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={releaseForm.tumblrPlanned}
                                          onChange={() => toggleReleaseFlag("tumblrPlanned")}
                                        />
                                        Tumblr
                                      </label>
                                    </div>

                                    {releaseCreateError && (
                                      <div
                                        style={{
                                          fontSize: 12,
                                          color: "#b91c1c",
                                        }}
                                      >
                                        {releaseCreateError}
                                      </div>
                                    )}

                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        gap: 8,
                                        marginTop: 4,
                                      }}
                                    >
                                      <button
                                        type="button"
                                        onClick={handleCancelReleaseForm}
                                        style={{
                                          padding: "6px 12px",
                                          borderRadius: 999,
                                          border: "1px solid rgba(148,163,184,0.5)",
                                          backgroundColor:
                                            theme === "light"
                                              ? "rgba(249, 250, 251, 0.9)"
                                              : "#020617",
                                          color: palette.mainText,
                                          fontSize: 13,
                                          cursor: "pointer",
                                        }}
                                      >
                                        Отмена
                                      </button>
                                      <button
                                        type="submit"
                                        disabled={releaseCreateLoading}
                                        style={{
                                          padding: "6px 12px",
                                          borderRadius: 999,
                                          border: "none",
                                          backgroundColor: palette.accent,
                                          color: palette.accentText,
                                          fontSize: 13,
                                          fontWeight: 600,
                                          cursor: "pointer",
                                          opacity: releaseCreateLoading ? 0.8 : 1,
                                        }}
                                      >
                                        {releaseCreateLoading
                                          ? "Создание..."
                                          : "Создать релиз"}
                                      </button>
                                    </div>
                                  </form>
                                )}

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
                            Для этого пака ещё нет релизов. Создай их через API
                            (пока), а здесь появится список.
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

type BadgeColors = { bg: string; border: string; text: string };

function badgeStyle(colors: BadgeColors) {
  return {
    borderRadius: 999,
    padding: "2px 8px",
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.bg,
    color: colors.text,
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.01em",
    lineHeight: 1.3,
  } as const;
}

function getPackTypeBadgeColors(type: PackType): BadgeColors {
  switch (type) {
    case "FREE":
      return {
        bg: "rgba(22, 163, 74, 0.1)",
        border: "rgba(22, 163, 74, 0.6)",
        text: "#166534",
      };
    case "SUBSCRIPTION_L1":
      return {
        bg: "rgba(59, 130, 246, 0.12)",
        border: "rgba(59, 130, 246, 0.6)",
        text: "#1d4ed8",
      };
    case "SUBSCRIPTION_L2":
      return {
        bg: "rgba(30, 64, 175, 0.18)",
        border: "rgba(30, 64, 175, 0.7)",
        text: "#1d4ed8",
      };
    case "EXCLUSIVE":
      return {
        bg: "rgba(147, 51, 234, 0.12)",
        border: "rgba(147, 51, 234, 0.7)",
        text: "#6b21a8",
      };
    case "EARLY_ACCESS":
      return {
        bg: "rgba(234, 179, 8, 0.16)",
        border: "rgba(234, 179, 8, 0.7)",
        text: "#854d0e",
      };
    default:
      return {
        bg: "rgba(148, 163, 184, 0.15)",
        border: "rgba(148, 163, 184, 0.7)",
        text: "#475569",
      };
  }
}

function getPackStatusBadgeColors(status: PackStatus): BadgeColors {
  switch (status) {
    case "IDEA":
      return {
        bg: "rgba(148, 163, 184, 0.15)",
        border: "rgba(148, 163, 184, 0.7)",
        text: "#475569",
      };
    case "IN_PROGRESS":
      return {
        bg: "rgba(59, 130, 246, 0.12)",
        border: "rgba(59, 130, 246, 0.7)",
        text: "#1d4ed8",
      };
    case "READY":
      return {
        bg: "rgba(56, 189, 248, 0.16)",
        border: "rgba(56, 189, 248, 0.8)",
        text: "#0369a1",
      };
    case "SCHEDULED":
      return {
        bg: "rgba(234, 179, 8, 0.16)",
        border: "rgba(234, 179, 8, 0.8)",
        text: "#854d0e",
      };
    case "PUBLISHED":
      return {
        bg: "rgba(34, 197, 94, 0.16)",
        border: "rgba(34, 197, 94, 0.8)",
        text: "#166534",
      };
    default:
      return {
        bg: "rgba(148, 163, 184, 0.15)",
        border: "rgba(148, 163, 184, 0.7)",
        text: "#475569",
      };
  }
}

function packTypeLabel(type: PackType): string {
  switch (type) {
    case "FREE":
      return "Free";
    case "SUBSCRIPTION_L1":
      return "Sub L1";
    case "SUBSCRIPTION_L2":
      return "Sub L2";
    case "EXCLUSIVE":
      return "Exclusive";
    case "EARLY_ACCESS":
      return "Early access";
    default:
      return type;
  }
}

function packStatusLabel(status: PackStatus): string {
  switch (status) {
    case "IDEA":
      return "Idea";
    case "IN_PROGRESS":
      return "In progress";
    case "READY":
      return "Ready";
    case "SCHEDULED":
      return "Scheduled";
    case "PUBLISHED":
      return "Published";
    default:
      return status;
  }
}
