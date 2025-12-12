// src/features/packs/hooks.ts
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import type {
    PackCreateRequest,
    PackDetails,
    PackTask,
    PackTaskUpdateRequest,
    PackUpdateRequest,
} from './model';
import {
    createPack,
    deletePack,
    fetchPack,
    fetchPacks,
    fetchPackTasks,
    updatePack,
    updatePackTask,
} from './api';
import {
    fetchPackFiles,
    uploadPackFile,
    deletePackFile,
} from './api';
import type {PackFile, PackFileType} from './model';

import {
    fetchPacksForCalendar,
    fetchPackPlatforms,
    updatePackPlatform,
    upsertPackPostDraft,
} from './api';

import type {
    PackPlatform,
    PackPlatformUpdatePayload,
    PackPostDraft,
    PackPostDraftPayload,
    PackShort,
} from './model';



export const PACKS_QUERY_KEY = ['packs'] as const;

export const packFilesKey = (packId: number) =>
    [...PACKS_QUERY_KEY, packId, 'files'] as const;

export const packDetailsKey = (packId: number) =>
    [...PACKS_QUERY_KEY, packId] as const;

export const packTasksKey = (packId: number) =>
    [...PACKS_QUERY_KEY, packId, 'tasks'] as const;

export function usePacksQuery() {
    return useQuery<PackShort[]>({
        queryKey: PACKS_QUERY_KEY,
        queryFn: fetchPacks,
    });
}

export function usePackQuery(packId: number | null, enabled = true) {
    return useQuery<PackDetails>({
        queryKey:
            packId != null ? packDetailsKey(packId) : ['packs', 'detail', 'empty'],
        queryFn: () => {
            if (packId == null) {
                throw new Error('packId is null');
            }
            return fetchPack(packId);
        },
        enabled: enabled && packId != null,
    });
}

export function usePackTasksQuery(packId: number | null, enabled = true) {
    return useQuery<PackTask[]>({
        queryKey:
            packId != null ? packTasksKey(packId) : ['packs', 'tasks', 'empty'],
        queryFn: () => {
            if (packId == null) {
                throw new Error('packId is null');
            }
            return fetchPackTasks(packId);
        },
        enabled: enabled && packId != null,
    });
}

export function useCreatePackMutation() {
    const queryClient = useQueryClient();

    return useMutation<PackDetails, unknown, PackCreateRequest>({
        mutationFn: createPack,
        onSuccess: (created) => {
            queryClient.invalidateQueries({queryKey: PACKS_QUERY_KEY});
            if (created.id != null) {
                queryClient.invalidateQueries({
                    queryKey: packDetailsKey(created.id),
                });
            }
        },
    });
}

export function useUpdatePackMutation(packId: number) {
    const queryClient = useQueryClient();

    return useMutation<PackDetails, unknown, PackUpdateRequest>({
        mutationFn: (request) => updatePack(packId, request),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: PACKS_QUERY_KEY});
            queryClient.invalidateQueries({queryKey: packDetailsKey(packId)});
            queryClient.invalidateQueries({queryKey: packTasksKey(packId)});
        },
    });
}

export function useDeletePackMutation() {
    const queryClient = useQueryClient();

    return useMutation<void, unknown, number>({
        mutationFn: deletePack,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: PACKS_QUERY_KEY});
        },
    });
}

export interface ToggleTaskVariables {
    packId: number;
    taskId: number;
    update: PackTaskUpdateRequest;
}

export function useToggleTaskMutation() {
    const queryClient = useQueryClient();

    return useMutation<PackTask, unknown, ToggleTaskVariables>({
        mutationFn: ({taskId, update}) => updatePackTask(taskId, update),
        onSuccess: (_task, variables) => {
            queryClient.invalidateQueries({
                queryKey: packTasksKey(variables.packId),
            });
            queryClient.invalidateQueries({
                queryKey: packDetailsKey(variables.packId),
            });
            queryClient.invalidateQueries({queryKey: PACKS_QUERY_KEY});
        },
    });
}

export function usePackFilesQuery(packId: number | null, enabled = true) {
    return useQuery<PackFile[]>({
        queryKey:
            packId != null
                ? packFilesKey(packId)
                : [...PACKS_QUERY_KEY, 'files', 'none'],
        queryFn: () => {
            if (packId == null) {
                return Promise.resolve([] as PackFile[]);
            }
            return fetchPackFiles(packId);
        },
        enabled: enabled && packId != null,
    });
}

interface UploadPackFilePayload {
    fileType: PackFileType;
    file: File;
}

export function useUploadPackFileMutation(packId: number | null) {
    const queryClient = useQueryClient();

    return useMutation<PackFile, Error, UploadPackFilePayload>({
        mutationFn: async ({fileType, file}) => {
            if (packId == null) {
                throw new Error('Pack id is required to upload files');
            }
            return uploadPackFile(packId, fileType, file);
        },
        onSuccess: () => {
            if (packId != null) {
                queryClient.invalidateQueries({queryKey: packFilesKey(packId)});
            }
        },
    });
}

export function useDeletePackFileMutation(packId: number | null) {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: async (fileId: string) => {
            await deletePackFile(fileId);
        },
        onSuccess: () => {
            if (packId != null) {
                queryClient.invalidateQueries({queryKey: packFilesKey(packId)});
            }
        },
    });
}

// Экспорт хука для безопасной загрузки изображений
export {useSecureImageUrl} from './hooks/useSecureImageUrl';

export function useCalendarPacksQuery(from: string, to: string) {
    return useQuery<PackShort[], Error>({
        queryKey: ['packs', 'calendar', { from, to }],
        queryFn: () => fetchPacksForCalendar(from, to),
        enabled: Boolean(from && to),
    });
}
export function usePackPlatformsQuery(packId: number | null | undefined) {
    return useQuery<PackPlatform[], Error>({
        queryKey: ['packs', packId, 'platforms'],
        queryFn: () => fetchPackPlatforms(packId as number),
        enabled: typeof packId === 'number',
    });
}
export function useUpdatePackPlatformMutation() {
    const queryClient = useQueryClient();

    return useMutation<PackPlatform, Error, { platformId: number; payload: PackPlatformUpdatePayload }>(
        {
            mutationFn: ({ platformId, payload }) => updatePackPlatform(platformId, payload),
            onSuccess: (data) => {
                // Инвалидируем платформы конкретного пака
                queryClient.invalidateQueries({
                    queryKey: ['packs', data.packId, 'platforms'],
                });
                // И список паков на всякий случай (календарь/панель)
                queryClient.invalidateQueries({ queryKey: ['packs'] });
                queryClient.invalidateQueries({ queryKey: ['packs', 'calendar'] });
            },
        },
    );
}

export function useUpsertPackPostDraftMutation() {
    const queryClient = useQueryClient();

    return useMutation<
        PackPostDraft,
        Error,
        { platformId: number; payload: PackPostDraftPayload; packId: number }
    >({
        mutationFn: ({ platformId, payload }) => upsertPackPostDraft(platformId, payload),
        onSuccess: (_draft, { packId }) => {
            // помечаем первый аргумент как "использованный", чтобы TS не ругался
            void _draft;

            // Обновляем платформы для соответствующего пака
            queryClient.invalidateQueries({
                queryKey: ['packs', packId, 'platforms'],
            });
        },
    });
}

