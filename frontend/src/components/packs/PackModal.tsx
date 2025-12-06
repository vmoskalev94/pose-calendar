import {useEffect, useState, type FormEvent} from "react";
import type {PackType} from "../../types";
import {Button} from "../ui/Button";

export type PackModalMode = "create" | "edit";

export interface PackModalValues {
    nameRu: string;
    nameEn: string;
    type: PackType;
    tags: string;
    description: string;
    screensDir: string;
}

export interface PackModalProps {
    isOpen: boolean;
    mode: PackModalMode;
    initialValues: PackModalValues;
    onSubmit: (values: PackModalValues) => void;
    onCancel: () => void;
    submitting?: boolean;
    errorMessage?: string | null;
}

/**
 * Универсальная модалка для создания/редактирования пака.
 * Пока без чек-листа и файлов — только базовые поля, как у твоей текущей формы.
 * Интеграцию с API и открытие из UI сделаем отдельным шагом.
 */
export function PackModal({
                              isOpen,
                              mode,
                              initialValues,
                              onSubmit,
                              onCancel,
                              submitting = false,
                              errorMessage = null,
                          }: PackModalProps) {
    const [values, setValues] = useState<PackModalValues>(initialValues);
    const [localError, setLocalError] = useState<string | null>(null);

    // Сброс/инициализация формы при открытии модалки или смене initialValues
    useEffect(() => {
        if (isOpen) {
            setValues(initialValues);
            setLocalError(null);
        }
    }, [isOpen, initialValues]);

    if (!isOpen) {
        return null;
    }

    const handleChange = (
        field: keyof PackModalValues,
        value: string
    ) => {
        setValues((prev) => ({
            ...prev,
            [field]:
                field === "type"
                    ? (value as PackType)
                    : value,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // Простая фронтовая валидация обязательных полей
        if (!values.nameRu.trim()) {
            setLocalError("Название (RU) обязательно");
            return;
        }
        if (!values.nameEn.trim()) {
            setLocalError("Название (EN) обязательно");
            return;
        }

        setLocalError(null);
        onSubmit(values);
    };

    const title = mode === "create" ? "Новый пак" : "Редактирование пака";

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(15,23,42,0.55)",
                padding: "16px",
            }}
            onClick={onCancel}
        >
            <div
                style={{
                    maxWidth: 520,
                    width: "100%",
                    borderRadius: 20,
                    background: "#fff",
                    padding: "20px 22px 18px",
                    boxShadow:
                        "0 24px 60px rgba(15,23,42,0.40)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    style={{
                        marginBottom: 16,
                    }}
                >
                    <h2
                        style={{
                            fontSize: 20,
                            fontWeight: 700,
                            marginBottom: 4,
                        }}
                    >
                        {title}
                    </h2>
                    <p
                        style={{
                            fontSize: 13,
                            color: "#6b7280",
                        }}
                    >
                        Заполни основные данные пака. Детали и файлы добавим позже.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                            marginBottom: 16,
                        }}
                    >
                        <label style={{fontSize: 13}}>
                            Название (RU) *
                            <input
                                type="text"
                                value={values.nameRu}
                                onChange={(e) =>
                                    handleChange("nameRu", e.target.value)
                                }
                                style={{
                                    marginTop: 4,
                                    width: "100%",
                                    padding: "7px 10px",
                                    borderRadius: 8,
                                    border: "1px solid #e5e7eb",
                                    fontSize: 13,
                                }}
                                placeholder="Например, Christmas Market Coffee"
                            />
                        </label>

                        <label style={{fontSize: 13}}>
                            Название (EN) *
                            <input
                                type="text"
                                value={values.nameEn}
                                onChange={(e) =>
                                    handleChange("nameEn", e.target.value)
                                }
                                style={{
                                    marginTop: 4,
                                    width: "100%",
                                    padding: "7px 10px",
                                    borderRadius: 8,
                                    border: "1px solid #e5e7eb",
                                    fontSize: 13,
                                }}
                                placeholder="Например, Christmas Market Coffee"
                            />
                        </label>

                        <label style={{fontSize: 13}}>
                            Тип пака
                            <select
                                value={values.type}
                                onChange={(e) =>
                                    handleChange("type", e.target.value)
                                }
                                style={{
                                    marginTop: 4,
                                    width: "100%",
                                    padding: "7px 10px",
                                    borderRadius: 8,
                                    border: "1px solid #e5e7eb",
                                    fontSize: 13,
                                    backgroundColor: "white",
                                }}
                            >
                                <option value="FREE">Бесплатный</option>
                                <option value="SUBSCRIPTION_L1">
                                    Подписка L1
                                </option>
                                <option value="SUBSCRIPTION_L2">
                                    Подписка L2
                                </option>
                                <option value="EXCLUSIVE">Эксклюзив</option>
                                <option value="EARLY_ACCESS">
                                    Ранний доступ
                                </option>
                            </select>
                        </label>

                        <label style={{fontSize: 13}}>
                            Теги
                            <input
                                type="text"
                                value={values.tags}
                                onChange={(e) =>
                                    handleChange("tags", e.target.value)
                                }
                                style={{
                                    marginTop: 4,
                                    width: "100%",
                                    padding: "7px 10px",
                                    borderRadius: 8,
                                    border: "1px solid #e5e7eb",
                                    fontSize: 13,
                                }}
                                placeholder="#teen, #winter, #skating"
                            />
                        </label>

                        <label style={{fontSize: 13}}>
                            Папка со скринами
                            <input
                                type="text"
                                value={values.screensDir}
                                onChange={(e) =>
                                    handleChange("screensDir", e.target.value)
                                }
                                style={{
                                    marginTop: 4,
                                    width: "100%",
                                    padding: "7px 10px",
                                    borderRadius: 8,
                                    border: "1px solid #e5e7eb",
                                    fontSize: 13,
                                }}
                                placeholder="Например, D:\\Sims4\\screens\\christmas-market"
                            />
                        </label>

                        <label style={{fontSize: 13}}>
                            Краткое описание
                            <textarea
                                value={values.description}
                                onChange={(e) =>
                                    handleChange("description", e.target.value)
                                }
                                style={{
                                    marginTop: 4,
                                    width: "100%",
                                    minHeight: 70,
                                    padding: "7px 10px",
                                    borderRadius: 8,
                                    border: "1px solid #e5e7eb",
                                    fontSize: 13,
                                    resize: "vertical",
                                }}
                                placeholder="Пара предложений про настроение, сеттинг и т.п."
                            />
                        </label>
                    </div>

                    {(localError || errorMessage) && (
                        <div
                            style={{
                                marginBottom: 12,
                                fontSize: 13,
                                color: "#b91c1c",
                            }}
                        >
                            {localError || errorMessage}
                        </div>
                    )}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 8,
                        }}
                    >
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={onCancel}
                            style={{
                                borderRadius: 999,
                                padding: "6px 14px",
                                fontSize: 13,
                            }}
                        >
                            Отмена
                        </Button>

                        <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            disabled={submitting}
                            style={{
                                borderRadius: 999,
                                padding: "6px 16px",
                                fontSize: 13,
                                opacity: submitting ? 0.85 : 1,
                            }}
                        >
                            {submitting
                                ? "Сохранение..."
                                : mode === "create"
                                    ? "Создать пак"
                                    : "Сохранить"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
