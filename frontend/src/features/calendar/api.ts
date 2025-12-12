// src/features/calendar/api.ts
import {httpClient} from '../../shared/api/httpClient';
import type {
    CreateReleaseRequest,
    UpdateReleaseRequest,
    ReleasePlatformDto,
    UpdateReleasePlatformRequest,
    Platform,
    PostDraftDto,
    UpsertPostDraftRequest,
} from './model';
import {fetchPacksForCalendar} from '../packs/api';
import type {PackShort} from '../packs/model';
import type {ReleaseDto} from './model';

export async function fetchReleasesForCalendar(
    from: string,
    to: string,
): Promise<ReleaseDto[]> {
    const packs: PackShort[] = await fetchPacksForCalendar(from, to);

    return packs.map((pack) => ({
        id: pack.id,
        packId: pack.id,
        packName: pack.titleRu || pack.titleEn || 'Без названия',
        title: pack.titleRu || pack.titleEn || 'Без названия',
        releaseDateTime: pack.plannedReleaseAt ?? null,
        status: pack.status,
        notes: null,           // пока notes = null, если нужно – потом возьмём из pack.description
        platforms: [],         // позже сюда придут PackPlatform → ReleasePlatformDto
    }));
}


/**
 * Получить один релиз по ID.
 * Backend endpoint: GET /api/releases/{id}?ownerId=X
 */
export async function fetchRelease(
    releaseId: number,
    ownerId: number
): Promise<ReleaseDto> {
    const {data} = await httpClient.get<ReleaseDto>(
        `/api/releases/${releaseId}`,
        {params: {ownerId}}
    );
    return data;
}

/**
 * Создать новый релиз.
 * Backend endpoint: POST /api/releases?ownerId=X
 */
export async function createRelease(
    ownerId: number,
    request: CreateReleaseRequest
): Promise<ReleaseDto> {
    const {data} = await httpClient.post<ReleaseDto>(
        '/api/releases',
        request,
        {params: {ownerId}}
    );
    return data;
}

/**
 * Обновить релиз.
 * Backend endpoint: PUT /api/releases/{id}?ownerId=X
 */
export async function updateRelease(
    releaseId: number,
    ownerId: number,
    request: UpdateReleaseRequest
): Promise<ReleaseDto> {
    const {data} = await httpClient.put<ReleaseDto>(
        `/api/releases/${releaseId}`,
        request,
        {params: {ownerId}}
    );
    return data;
}

/**
 * Удалить релиз.
 * Backend endpoint: DELETE /api/releases/{id}?ownerId=X
 */
export async function deleteRelease(
    releaseId: number,
    ownerId: number
): Promise<void> {
    await httpClient.delete(`/api/releases/${releaseId}`, {
        params: {ownerId},
    });
}

/**
 * Получить платформы релиза
 * Backend endpoint: GET /api/releases/{id}/platforms?ownerId=X
 */
export async function fetchReleasePlatforms(
    releaseId: number,
    ownerId: number
): Promise<ReleasePlatformDto[]> {
    const {data} = await httpClient.get<ReleasePlatformDto[]>(
        `/api/releases/${releaseId}/platforms`,
        {params: {ownerId}}
    );
    return data;
}

/**
 * Создать/обновить платформу релиза (UPSERT)
 * Backend endpoint: PUT /api/releases/{id}/platforms/{platform}?ownerId=X
 */
export async function upsertReleasePlatform(
    releaseId: number,
    platform: Platform,
    ownerId: number,
    request: UpdateReleasePlatformRequest
): Promise<ReleasePlatformDto> {
    const {data} = await httpClient.put<ReleasePlatformDto>(
        `/api/releases/${releaseId}/platforms/${platform}`,
        request,
        {params: {ownerId}}
    );
    return data;
}

/**
 * Получить черновик поста для платформы
 * Backend endpoint: GET /api/releases/platforms/{releasePlatformId}/post-draft?ownerId=X
 */
export async function fetchPostDraft(
    releasePlatformId: number,
    ownerId: number
): Promise<PostDraftDto> {
    const {data} = await httpClient.get<PostDraftDto>(
        `/api/releases/platforms/${releasePlatformId}/post-draft`,
        {params: {ownerId}}
    );
    return data;
}

/**
 * Создать/обновить черновик поста (UPSERT)
 * Backend endpoint: PUT /api/releases/platforms/{releasePlatformId}/post-draft?ownerId=X
 */
export async function upsertPostDraft(
    releasePlatformId: number,
    ownerId: number,
    request: UpsertPostDraftRequest
): Promise<PostDraftDto> {
    const {data} = await httpClient.put<PostDraftDto>(
        `/api/releases/platforms/${releasePlatformId}/post-draft`,
        request,
        {params: {ownerId}}
    );
    return data;
}
