// frontend/src/api.ts

import type {
    PackDto,
    ChecklistItemDto,
    ReleaseDto,
    CalendarEventDto,
    CreatePackRequest,
    UpdatePackRequest,
    CreateReleaseRequest,
    UpdateReleaseRequest,
    // PackType,
    PackStatus,
} from "./types";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
    const response = await fetch(url, init);

    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`HTTP ${response.status}${text ? `: ${text}` : ""}`);
    }

    if (response.status === 204) {
        // нет тела
        return undefined as T;
    }

    return (await response.json()) as T;
}

function buildUrl(
    path: string,
    params?: Record<string, string | number | undefined>
): string {
    const url = new URL(path, window.location.origin);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.set(key, String(value));
            }
        });
    }
    return url.pathname + url.search;
}

// ============== Packs ==============

async function getPacks(status?: PackStatus): Promise<PackDto[]> {
    const url = status ? buildUrl("/api/packs", {status}) : "/api/packs";
    return request<PackDto[]>(url);
}

async function createPack(payload: CreatePackRequest): Promise<PackDto> {
    return request<PackDto>("/api/packs", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
    });
}

// Заготовка на будущее — обновление пака по id
// (когда доберёмся до CRUD по пакам)
async function updatePack(
    packId: number,
    payload: UpdatePackRequest
): Promise<PackDto> {
    return request<PackDto>(`/api/packs/${packId}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
    });
}

// ============== Checklist ==============

async function getChecklist(packId: number): Promise<ChecklistItemDto[]> {
    return request<ChecklistItemDto[]>(`/api/packs/${packId}/checklist`);
}

async function toggleChecklistItemDone(
    itemId: number,
    done: boolean
): Promise<ChecklistItemDto> {
    return request<ChecklistItemDto>(`/api/checklist-items/${itemId}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({done}),
    });
}

// ============== Releases ==============

async function createRelease(
    params: CreateReleaseRequest
): Promise<ReleaseDto> {
    const {
        packId,
        releaseDateTimeIso,
        telegramPlanned,
        vkPlanned,
        boostyPlanned,
        tumblrPlanned,
    } = params;

    return request<ReleaseDto>(`/api/packs/${packId}/releases`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            // бэкенд ждёт поле releaseDateTime
            releaseDateTime: releaseDateTimeIso,
            telegramPlanned,
            vkPlanned,
            boostyPlanned,
            tumblrPlanned,
        }),
    });
}

async function getReleasesForPack(packId: number): Promise<ReleaseDto[]> {
    return request<ReleaseDto[]>(`/api/packs/${packId}/releases`);
}

// На будущее: обновление/удаление релиза
async function updateRelease(
    releaseId: number,
    payload: UpdateReleaseRequest
): Promise<ReleaseDto> {
    return request<ReleaseDto>(`/api/releases/${releaseId}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
    });
}

async function deleteRelease(releaseId: number): Promise<void> {
    await request<void>(`/api/releases/${releaseId}`, {
        method: "DELETE",
    });
}

// ============== Calendar ==============

async function getCalendarEvents(
    fromIso: string,
    toIso: string
): Promise<CalendarEventDto[]> {
    const url = buildUrl("/api/calendar", {from: fromIso, to: toIso});
    return request<CalendarEventDto[]>(url);
}

// ============== Public API object ==============

export const Api = {
    getPacks,
    createPack,
    updatePack,

    getChecklist,
    toggleChecklistItemDone,

    createRelease,
    getReleasesForPack,
    updateRelease,
    deleteRelease,

    getCalendarEvents,
};
