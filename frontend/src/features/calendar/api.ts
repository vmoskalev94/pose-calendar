// src/features/calendar/api.ts
import {httpClient} from '../../shared/api/httpClient';
import type {
    ReleaseDto,
    CreateReleaseRequest,
    UpdateReleaseRequest,
} from './model';

/**
 * Получить релизы за диапазон дат.
 * Backend endpoint: GET /api/releases?ownerId=X&from=YYYY-MM-DD&to=YYYY-MM-DD
 */
export async function fetchReleases(
    ownerId: number,
    from: string, // YYYY-MM-DD format
    to: string // YYYY-MM-DD format
): Promise<ReleaseDto[]> {
    const {data} = await httpClient.get<ReleaseDto[]>('/api/releases', {
        params: {ownerId, from, to},
    });
    return data;
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
