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
