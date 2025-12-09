// src/features/packs/api.ts
import {httpClient} from '../../shared/api/httpClient';
import type {
    PackCreateRequest,
    PackDetails,
    PackShort,
    PackTask,
    PackTaskUpdateRequest,
    PackUpdateRequest,
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

export function getPackFileDownloadUrl(fileId: string): string {
    return `/api/packs/files/${fileId}`;
}

