// src/features/packs/hooks.ts
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import type {
    PackCreateRequest,
    PackDetails,
    PackShort,
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

export const PACKS_QUERY_KEY = ['packs'] as const;

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
