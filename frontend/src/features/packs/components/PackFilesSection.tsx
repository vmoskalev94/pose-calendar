import React, {useMemo} from 'react';
import {
    Stack,
    Group,
    Text,
    Button,
    Anchor,
    Alert,
    Loader,
    Image,
    Divider,
} from '@mantine/core';
import {
    usePackFilesQuery,
    useUploadPackFileMutation,
    useDeletePackFileMutation,
} from '../hooks';
import {
    PACK_FILE_TYPE_LABELS,
    PACK_FILE_TYPE_ORDER,
    type PackFile,
    type PackFileType,
} from '../model';
import {getPackFileDownloadUrl} from '../api';

interface PackFilesSectionProps {
    packId: number | null;
    readonly?: boolean;
}

// Константа для будущего ограничения количества скриншотов
// TODO: Установить лимит в будущем (например, 25)
const MAX_SCREENSHOTS: number | null = null;

export const PackFilesSection: React.FC<PackFilesSectionProps> = ({
                                                                      packId,
                                                                      readonly = false,
                                                                  }) => {
    const {
        data: files,
        isLoading,
        isError,
        error,
    } = usePackFilesQuery(packId, !!packId);

    const uploadMutation = useUploadPackFileMutation(packId);
    const deleteMutation = useDeletePackFileMutation(packId);

    const filesByType = useMemo(() => {
        const result: Record<PackFileType, PackFile[]> = {
            COVER: [],
            PREVIEW: [],
            SCREENSHOT: [],
            ARCHIVE: [],
            INSTRUCTION: [],
            EXTRA: [],
        };

        (files ?? []).forEach((file) => {
            result[file.fileType].push(file);
        });

        return result;
    }, [files]);

    const handleFileChange = (
        fileType: PackFileType,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0 || packId == null) return;

        // Проверка для single-file типов
        if (fileType === 'COVER' || fileType === 'PREVIEW' || fileType === 'ARCHIVE') {
            const existingCount = filesByType[fileType].length;
            if (existingCount >= 1) {
                alert(`Можно загрузить только 1 файл типа ${PACK_FILE_TYPE_LABELS[fileType]}`);
                event.target.value = '';
                return;
            }
            uploadMutation.mutate({fileType, file: files[0]});
        } else {
            // Multiple files allowed для SCREENSHOT, INSTRUCTION, EXTRA
            // Проверка лимита для SCREENSHOT (опционально)
            if (fileType === 'SCREENSHOT' && MAX_SCREENSHOTS != null) {
                const existingCount = filesByType[fileType].length;
                if (existingCount + files.length > MAX_SCREENSHOTS) {
                    alert(`Максимум ${MAX_SCREENSHOTS} скриншотов`);
                    event.target.value = '';
                    return;
                }
            }

            // Загружаем все файлы
            files.forEach((file) => {
                uploadMutation.mutate({fileType, file});
            });
        }

        // очищаем, чтобы не торчало длинное имя
        event.target.value = '';
    };

    const handleDelete = (fileId: string) => {
        if (!fileId) return;
        deleteMutation.mutate(fileId);
    };

    const isBusy = uploadMutation.isPending || deleteMutation.isPending;

    return (
        <Stack gap="sm" mt="md">
            <Group justify="space-between" align="center">
                <Text fw={600} size="sm">
                    Файлы пака
                </Text>

                {isBusy && (
                    <Group gap={6}>
                        <Loader size="xs"/>
                        <Text size="xs" c="dimmed">
                            Сохранение изменений…
                        </Text>
                    </Group>
                )}
            </Group>

            {packId == null && (
                <Text size="xs" c="dimmed">
                    Сначала сохраните пак, чтобы привязать к нему файлы.
                </Text>
            )}

            {isLoading && packId != null && (
                <Group gap={8}>
                    <Loader size="xs"/>
                    <Text size="xs" c="dimmed">
                        Загрузка файлов…
                    </Text>
                </Group>
            )}

            {isError && (
                <Alert color="red" radius="md" variant="light" title="Ошибка загрузки">
                    <Text size="xs">
                        Не удалось загрузить файлы пака
                        {error instanceof Error ? `: ${error.message}` : ''}
                    </Text>
                </Alert>
            )}

            {packId != null && (
                <Stack gap="sm">
                    {PACK_FILE_TYPE_ORDER.map((type, index) => {
                        const groupFiles = filesByType[type];
                        const canUpload = !readonly;

                        return (
                            <Stack key={type} gap={6}>
                                {index > 0 && <Divider/>}

                                <Group justify="space-between" align="center">
                                    <Text fw={500} size="sm">
                                        {PACK_FILE_TYPE_LABELS[type]}
                                    </Text>

                                    {canUpload && (
                                        <Button
                                            size="xs"
                                            variant="light"
                                            color="blue"
                                            radius="xl"
                                            component="label"
                                        >
                                            Выбрать файл
                                            <input
                                                type="file"
                                                hidden
                                                accept={getAcceptForFileType(type)}
                                                multiple={shouldAllowMultiple(type)}
                                                onChange={(e) => handleFileChange(type, e)}
                                            />
                                        </Button>
                                    )}
                                </Group>

                                {groupFiles.length === 0 ? (
                                    <Text size="xs" c="dimmed">
                                        Файлы не загружены.
                                    </Text>
                                ) : (
                                    <Stack gap={6}>
                                        {groupFiles.map((file) => (
                                            <Group
                                                key={file.id}
                                                align="flex-start"
                                                justify="space-between"
                                                wrap="nowrap"
                                            >
                                                <Group align="flex-start" gap="sm" wrap="nowrap">
                                                    {isImageFile(file) && (
                                                        <Image
                                                            src={getPackFileDownloadUrl(file.id)}
                                                            w={64}
                                                            h={64}
                                                            radius="md"
                                                            fit="cover"
                                                            alt={file.originalFilename}
                                                        />
                                                    )}

                                                    <Stack gap={2}>
                                                        <Text size="sm">{file.originalFilename}</Text>
                                                        <Text size="xs" c="dimmed">
                                                            {formatFileSize(file.sizeBytes)} ·{' '}
                                                            {formatDate(file.createdAt)}
                                                        </Text>
                                                    </Stack>
                                                </Group>

                                                <Group gap="xs" wrap="nowrap">
                                                    <Anchor
                                                        href={getPackFileDownloadUrl(file.id)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        size="xs"
                                                        underline="hover"
                                                    >
                                                        Скачать
                                                    </Anchor>

                                                    {!readonly && (
                                                        <Button
                                                            size="xs"
                                                            variant="light"
                                                            color="red"
                                                            onClick={() => handleDelete(file.id)}
                                                            disabled={deleteMutation.isPending}
                                                        >
                                                            Удалить
                                                        </Button>
                                                    )}
                                                </Group>
                                            </Group>
                                        ))}
                                    </Stack>
                                )}
                            </Stack>
                        );
                    })}
                </Stack>
            )}
        </Stack>
    );
};

// -------- helpers --------

function shouldAllowMultiple(type: PackFileType): boolean {
    return type === 'SCREENSHOT' || type === 'INSTRUCTION' || type === 'EXTRA';
}

function getAcceptForFileType(type: PackFileType): string | undefined {
    switch (type) {
        case 'COVER':
        case 'PREVIEW':
        case 'SCREENSHOT':
            return 'image/*';
        case 'ARCHIVE':
            return '.zip,.rar,.7z,.tar,.gz,.package';
        case 'INSTRUCTION':
            return '.txt,.md,.pdf,.doc,.docx';
        case 'EXTRA':
        default:
            return undefined; // Любые файлы
    }
}

function formatFileSize(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes < 0) return '-';

    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'] as const;
    const e = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, e);
    return `${value.toFixed(1)} ${units[e]}`;
}

function formatDate(iso: string): string {
    if (!iso) return '-';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function isImageFile(file: PackFile): boolean {
    if (file.fileType === 'COVER' || file.fileType === 'PREVIEW' || file.fileType === 'SCREENSHOT') {
        return true;
    }
    return file.contentType?.startsWith('image/') ?? false;
}
