// src/features/calendar/hooks.ts
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import type {
    ReleaseDto,
    CreateReleaseRequest,
    UpdateReleaseRequest,
} from './model';
import {
    fetchReleases,
    fetchRelease,
    createRelease,
    updateRelease,
    deleteRelease,
} from './api';

// Query keys для кэширования
export const RELEASES_QUERY_KEY = ['releases'] as const;

export const releasesRangeKey = (
    ownerId: number,
    from: string,
    to: string
) => [...RELEASES_QUERY_KEY, 'range', ownerId, from, to] as const;

export const releaseDetailsKey = (releaseId: number, ownerId: number) =>
    [...RELEASES_QUERY_KEY, releaseId, ownerId] as const;

/**
 * Hook для загрузки релизов за диапазон дат.
 * Используется в календаре для отображения релизов месяца.
 */
export function useReleasesQuery(
    ownerId: number | null,
    from: string, // YYYY-MM-DD
    to: string, // YYYY-MM-DD
    enabled = true
) {
    return useQuery<ReleaseDto[]>({
        queryKey:
            ownerId != null
                ? releasesRangeKey(ownerId, from, to)
                : [...RELEASES_QUERY_KEY, 'range', 'empty'],
        queryFn: () => {
            if (ownerId == null) {
                throw new Error('ownerId is null');
            }
            return fetchReleases(ownerId, from, to);
        },
        enabled: enabled && ownerId != null,
        // Кэшируем на 5 минут
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook для загрузки одного релиза.
 * Используется в модалке просмотра/редактирования.
 */
export function useReleaseQuery(
    releaseId: number | null,
    ownerId: number | null,
    enabled = true
) {
    return useQuery<ReleaseDto>({
        queryKey:
            releaseId != null && ownerId != null
                ? releaseDetailsKey(releaseId, ownerId)
                : [...RELEASES_QUERY_KEY, 'detail', 'empty'],
        queryFn: () => {
            if (releaseId == null || ownerId == null) {
                throw new Error('releaseId or ownerId is null');
            }
            return fetchRelease(releaseId, ownerId);
        },
        enabled: enabled && releaseId != null && ownerId != null,
    });
}

/**
 * Mutation для создания релиза.
 */
export function useCreateReleaseMutation(ownerId: number | null) {
    const queryClient = useQueryClient();

    return useMutation<ReleaseDto, unknown, CreateReleaseRequest>({
        mutationFn: (request) => {
            if (ownerId == null) {
                throw new Error('ownerId is required');
            }
            return createRelease(ownerId, request);
        },
        onSuccess: () => {
            // Инвалидируем все запросы релизов для обновления календаря
            queryClient.invalidateQueries({queryKey: RELEASES_QUERY_KEY});
        },
    });
}

/**
 * Mutation для обновления релиза.
 */
export function useUpdateReleaseMutation(
    releaseId: number,
    ownerId: number | null
) {
    const queryClient = useQueryClient();

    return useMutation<ReleaseDto, unknown, UpdateReleaseRequest>({
        mutationFn: (request) => {
            if (ownerId == null) {
                throw new Error('ownerId is required');
            }
            return updateRelease(releaseId, ownerId, request);
        },
        onSuccess: () => {
            // Инвалидируем весь кэш релизов
            queryClient.invalidateQueries({queryKey: RELEASES_QUERY_KEY});
        },
    });
}

/**
 * Mutation для удаления релиза.
 */
export function useDeleteReleaseMutation(ownerId: number | null) {
    const queryClient = useQueryClient();

    return useMutation<void, unknown, number>({
        mutationFn: (releaseId) => {
            if (ownerId == null) {
                throw new Error('ownerId is required');
            }
            return deleteRelease(releaseId, ownerId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: RELEASES_QUERY_KEY});
        },
    });
}
