// src/types.ts

// =========================
// Domain types (живые сущности в UI)
// =========================

export type PackType =
    | "FREE"
    | "SUBSCRIPTION_L1"
    | "SUBSCRIPTION_L2"
    | "EXCLUSIVE"
    | "EARLY_ACCESS";

export type PackStatus =
    | "IDEA"
    | "IN_PROGRESS"
    | "READY"
    | "SCHEDULED"
    | "PUBLISHED";

export type Platform = "TELEGRAM" | "VK" | "BOOSTY" | "TUMBLR";

// Базовый доменный тип пака (то, чем оперирует UI)
export interface Pack {
    id: number;
    nameRu: string;
    nameEn: string | null;

    type: PackType;
    status: PackStatus;

    tags: string | null;
    description: string | null;

    posesCount: number | null;
    couplePosesCount: number | null;

    // старые поля под файловую модель (пока оставляем, потом заменим на PackFile)
    sourceDir: string | null;
    screensDir: string | null;
    coverFile: string | null;
    packageFile: string | null;
}

// Доменный тип релиза
export interface Release {
    id: number;
    packId: number;
    releaseDateTime: string; // ISO строка

    telegramPlanned: boolean;
    vkPlanned: boolean;
    boostyPlanned: boolean;
    tumblrPlanned: boolean;

    // На будущее: статус/комментарий и т.п.
    // status?: string;
    // comment?: string | null;
}

// Доменный тип элемента чек-листа
export interface ChecklistItem {
    id: number;
    packId: number;
    title: string;
    done: boolean;
}

// =========================
// DTO — то, что приходит/уходит через API
// =========================

export interface PackDto extends Pack {}

// Если нужно будет отличать доменный тип от DTO,
// можно расширить/изменить этот интерфейс отдельно.

export interface ChecklistItemDto extends ChecklistItem {}

export interface ReleaseDto extends Release {}

// Событие календаря, которое приходит с бэка
export interface CalendarEventDto {
    releaseId: number;
    releaseDateTime: string;

    packId: number;
    packNameRu: string;
    packNameEn: string | null;

    packType: PackType;
    packStatus: PackStatus;

    telegramPlanned: boolean;
    vkPlanned: boolean;
    boostyPlanned: boolean;
    tumblrPlanned: boolean;
}

// =========================
// DTO запросов (body для POST/PUT)
// =========================

// То, что мы отправляем в POST /api/packs
export interface CreatePackRequest {
    nameRu: string;
    nameEn: string | null;
    type: PackType;

    posesCount: number | null;
    couplePosesCount: number | null;

    tags: string | null;
    description: string | null;

    sourceDir: string | null;
    screensDir: string | null;
    coverFile: string | null;
    packageFile: string | null;
}

// То, что мы отправляем в PUT /api/packs/{id}
// (частичное обновление + статус)
export interface UpdatePackRequest extends Partial<CreatePackRequest> {
    status?: PackStatus;
}

// То, что мы отправляем в POST /api/packs/{packId}/releases
// Обрати внимание: packId — в path, а releaseDateTimeIso — только для фронта
export interface CreateReleaseRequest {
    packId: number;
    releaseDateTimeIso: string;

    telegramPlanned: boolean;
    vkPlanned: boolean;
    boostyPlanned: boolean;
    tumblrPlanned: boolean;
}

// Для будущего PUT /releases/{id}
export interface UpdateReleaseRequest
    extends Partial<Omit<CreateReleaseRequest, "packId">> {}

// =========================
// Form types — состояние форм в UI
// =========================

export interface PackFormValues {
    nameRu: string;
    nameEn: string;
    type: PackType;
    tags: string;
    description: string;
    screensDir: string;
    // статус, количество поз и т.п. можно будет добавить позже
}

export interface ReleaseFormValues {
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    packId: number | null;

    telegramPlanned: boolean;
    vkPlanned: boolean;
    boostyPlanned: boolean;
    tumblrPlanned: boolean;
}
