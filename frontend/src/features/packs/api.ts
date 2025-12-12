// src/features/packs/api.ts
import {httpClient, API_BASE_URL} from '../../shared/api/httpClient';
import type {
    PackCreateRequest,
    PackDetails,
    PackTask,
    PackTaskUpdateRequest,
    PackUpdateRequest,
    PackPlatform,
    PackPlatformUpdatePayload,
    PackPostDraft,
    PackPostDraftPayload,
    PackShort,
} from './model';

import type {PackFile, PackFileType} from './model';

export async function fetchPacks(): Promise<PackShort[]> {
    const {data} = await httpClient.get<PackShort[]>('/api/packs');
    return data;
}

export async function fetchPack(packId: number): Promise<PackDetails> {
    const {data} = await httpClient.get<PackDetails>(`/api/packs/${packId}`);
    return data;
}

export async function fetchPackTasks(packId: number): Promise<PackTask[]> {
    const {data} = await httpClient.get<PackTask[]>(`/api/packs/${packId}/tasks`);
    return data;
}

export async function createPack(
    request: PackCreateRequest
): Promise<PackDetails> {
    const {data} = await httpClient.post<PackDetails>('/api/packs', request);
    return data;
}

export async function updatePack(
    packId: number,
    request: PackUpdateRequest
): Promise<PackDetails> {
    const {data} = await httpClient.put<PackDetails>(
        `/api/packs/${packId}`,
        request
    );
    return data;
}

export async function deletePack(packId: number): Promise<void> {
    await httpClient.delete(`/api/packs/${packId}`);
}

export async function updatePackTask(
    taskId: number,
    request: PackTaskUpdateRequest
): Promise<PackTask> {
    const {data} = await httpClient.patch<PackTask>(
        `/api/packs/tasks/${taskId}`,
        request
    );
    return data;
}

export async function fetchPackFiles(packId: number): Promise<PackFile[]> {
    const {data} = await httpClient.get<PackFile[]>(`/api/packs/${packId}/files`);
    return data;
}

export async function uploadPackFile(
    packId: number,
    fileType: PackFileType,
    file: File,
): Promise<PackFile> {
    const formData = new FormData();
    formData.append('fileType', fileType);
    formData.append('file', file);

    const {data} = await httpClient.post<PackFile>(
        `/api/packs/${packId}/files`,
        formData,
        {
            headers: {
                // axios сам подставит boundary, но тип укажем явно
                'Content-Type': 'multipart/form-data',
            },
        },
    );

    return data;
}

export async function deletePackFile(fileId: string): Promise<void> {
    await httpClient.delete(`/api/packs/files/${fileId}`);
}

export async function fetchPackFileBlob(fileId: string): Promise<Blob> {
    const {data} = await httpClient.get<Blob>(
        `/api/packs/files/${fileId}`,
        {responseType: 'blob'}
    );
    return data;
}

export function getPackFileDownloadUrl(fileId: string): string {
    return `${API_BASE_URL}/api/packs/files/${fileId}`;
}

/**
 * Паки для календаря в диапазоне дат [from; to], формат YYYY-MM-DD.
 */
export async function fetchPacksForCalendar(from: string, to: string): Promise<PackShort[]> {
    const response = await httpClient.get<PackShort[]>('/api/packs/calendar', {
        params: { from, to },
    });
    return response.data;
}

/**
 * Платформы для конкретного пака.
 */
export async function fetchPackPlatforms(packId: number): Promise<PackPlatform[]> {
    const response = await httpClient.get<PackPlatform[]>(`/api/packs/${packId}/platforms`);
    return response.data;
}

/**
 * Обновить состояние платформы пака.
 */
export async function updatePackPlatform(
    platformId: number,
    payload: PackPlatformUpdatePayload,
): Promise<PackPlatform> {
    const response = await httpClient.put<PackPlatform>(
        `/api/packs/platforms/${platformId}`,
        payload,
    );
    return response.data;
}

/**
 * Создать/обновить черновик поста для платформы.
 */
export async function upsertPackPostDraft(
    platformId: number,
    payload: PackPostDraftPayload,
): Promise<PackPostDraft> {
    const response = await httpClient.put<PackPostDraft>(
        `/api/packs/platforms/${platformId}/post-draft`,
        payload,
    );
    return response.data;
}

