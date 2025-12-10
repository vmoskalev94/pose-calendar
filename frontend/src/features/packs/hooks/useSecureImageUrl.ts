import {useQuery} from '@tanstack/react-query';
import {useEffect, useRef} from 'react';
import {fetchPackFileBlob} from '../api';

interface UseSecureImageUrlOptions {
    fileId: string | null;
    enabled?: boolean;
}

interface UseSecureImageUrlResult {
    imageUrl: string | null;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
}

/**
 * Hook для безопасной загрузки изображений с JWT аутентификацией.
 * Загружает файл через axios, конвертирует в Blob и создает blob URL.
 * Автоматически очищает blob URL при размонтировании компонента.
 */
export function useSecureImageUrl(
    options: UseSecureImageUrlOptions
): UseSecureImageUrlResult {
    const {fileId, enabled = true} = options;
    const blobUrlRef = useRef<string | null>(null);

    const query = useQuery({
        queryKey: ['pack-file-image', fileId],
        queryFn: async () => {
            if (!fileId) throw new Error('File ID is required');

            // Загружаем файл как Blob через axios (с JWT токеном)
            const blob = await fetchPackFileBlob(fileId);

            // Создаем blob URL
            const blobUrl = URL.createObjectURL(blob);

            return blobUrl;
        },
        enabled: enabled && fileId != null,
        staleTime: 5 * 60 * 1000, // 5 минут
        gcTime: 10 * 60 * 1000, // 10 минут (ранее cacheTime)
        retry: 1, // Повторить один раз при ошибке
    });

    // Сохраняем текущий blob URL в ref для очистки
    useEffect(() => {
        if (query.data) {
            // Очищаем старый URL если есть
            if (blobUrlRef.current && blobUrlRef.current !== query.data) {
                URL.revokeObjectURL(blobUrlRef.current);
            }
            blobUrlRef.current = query.data;
        }

        // Cleanup при размонтировании
        return () => {
            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current);
                blobUrlRef.current = null;
            }
        };
    }, [query.data]);

    return {
        imageUrl: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error as Error | null,
    };
}
