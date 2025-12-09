// src/features/calendar/model.ts

// Статусы релиза (синхронизированы с backend)
export type ReleaseStatus =
    | 'PLANNED'
    | 'CONTENT_READY'
    | 'POSTED'
    | 'CANCELLED';

// Статус платформы релиза
export type ReleasePlatformStatus =
    | 'PLANNED'
    | 'DRAFT_PREPARED'
    | 'PUBLISHED';

// Платформа
export type Platform =
    | 'TELEGRAM'
    | 'VK'
    | 'BOOSTY'
    | 'TUMBLR';

// DTO черновика поста
export interface PostDraftDto {
    id: number;
    title: string;
    body: string;
    hashtags: string;
    language: string;
}

// DTO платформы релиза
export interface ReleasePlatformDto {
    id: number;
    platform: Platform;
    status: ReleasePlatformStatus;
    plannedDateTime: string | null; // ISO-8601 LocalDateTime
    publishedDateTime: string | null; // ISO-8601 LocalDateTime
    notes: string | null;
    postDraft?: PostDraftDto; // Черновик поста для платформы
}

// Основной DTO релиза (соответствует backend)
export interface ReleaseDto {
    id: number;
    packId: number;
    packName: string;
    title: string;
    releaseDateTime: string; // ISO-8601 LocalDateTime: "2025-12-25T18:30:00"
    status: ReleaseStatus;
    notes: string | null;
    platforms: ReleasePlatformDto[];
}

// Request для создания релиза
export interface CreateReleaseRequest {
    packId: number;
    title: string;
    releaseDateTime: string; // ISO-8601 LocalDateTime
    notes?: string;
}

// Request для обновления релиза
export interface UpdateReleaseRequest {
    packId?: number;
    title?: string;
    releaseDateTime?: string;
    status?: ReleaseStatus;
    notes?: string;
}

// Request для обновления платформы релиза
export interface UpdateReleasePlatformRequest {
    status?: ReleasePlatformStatus;
    plannedDateTime?: string; // ISO-8601 LocalDateTime
    publishedDateTime?: string; // ISO-8601 LocalDateTime
    notes?: string;
}

// Request для создания/обновления черновика поста
export interface UpsertPostDraftRequest {
    title?: string;
    body?: string;
    hashtags?: string;
    language?: string;
}

// Вспомогательный тип для представления дня в календаре
export interface CalendarDay {
    date: Date; // JavaScript Date объект
    dayNumber: number; // 1-31
    isCurrentMonth: boolean; // true если день принадлежит текущему месяцу
    isToday: boolean;
    releases: ReleaseDto[]; // релизы в этот день
}

// Лейблы для статусов (для UI)
export const RELEASE_STATUS_LABELS: Record<ReleaseStatus, string> = {
    PLANNED: 'Запланирован',
    CONTENT_READY: 'Готов',
    POSTED: 'Опубликован',
    CANCELLED: 'Отменён',
};

// Цвета для статусов (Mantine colors)
export const RELEASE_STATUS_COLORS: Record<ReleaseStatus, string> = {
    PLANNED: 'blue',
    CONTENT_READY: 'green',
    POSTED: 'gray',
    CANCELLED: 'red',
};
