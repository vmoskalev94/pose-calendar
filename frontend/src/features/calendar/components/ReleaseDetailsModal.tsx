// src/features/calendar/components/ReleaseDetailsModal.tsx
import {useState} from 'react';
import {
    Alert,
    Badge,
    Button,
    Group,
    Loader,
    Modal,
    ScrollArea,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import {
    IconAlertCircle,
    IconCalendar,
    IconPencil,
    IconTrash,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import {useAuth} from '../../auth/AuthContext';
import {
    useReleaseQuery,
    useUpdateReleaseMutation,
    useDeleteReleaseMutation,
    useReleasePlatformsQuery,
    usePostDraftQuery,
    useUpsertPostDraftMutation,
} from '../hooks';
import type {UpdateReleaseRequest} from '../model';
import {RELEASE_STATUS_COLORS} from '../model';
import ReleaseForm, {type ReleaseFormValues} from './ReleaseForm';
import ReleasePlatformCard from './ReleasePlatformCard';
import PostDraftForm, {type PostDraftFormValues} from './PostDraftForm';

interface ReleaseDetailsModalProps {
    releaseId: number | null;
    opened: boolean;
    onClose: () => void;
}

const statusLabelMap = {
    PLANNED: 'Запланирован',
    CONTENT_READY: 'Контент готов',
    POSTED: 'Опубликован',
    CANCELLED: 'Отменен',
};

const ReleaseDetailsModal = ({
                                  releaseId,
                                  opened,
                                  onClose,
                              }: ReleaseDetailsModalProps) => {
    const {user} = useAuth();
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedPlatformId, setSelectedPlatformId] = useState<number | null>(null);

    const {
        data: release,
        isLoading,
        isError,
    } = useReleaseQuery(releaseId, user?.id ?? null, opened);

    const {data: platforms} = useReleasePlatformsQuery(
        releaseId,
        user?.id ?? null,
        opened
    );

    const {data: postDraft} = usePostDraftQuery(
        selectedPlatformId,
        user?.id ?? null,
        selectedPlatformId != null
    );

    const updateReleaseMutation = useUpdateReleaseMutation(
        releaseId ?? 0,
        user?.id ?? null
    );
    const deleteReleaseMutation = useDeleteReleaseMutation(user?.id ?? null);

    const upsertPostDraftMutation = useUpsertPostDraftMutation(
        selectedPlatformId,
        user?.id ?? null
    );

    const handleEditSubmit = (values: ReleaseFormValues) => {
        if (!release || releaseId == null) return;

        const payload: UpdateReleaseRequest = {
            packId: values.packId,
            title: values.title,
            releaseDateTime: dayjs(values.releaseDateTime).format(
                'YYYY-MM-DDTHH:mm:ss'
            ),
            notes: values.notes,
            status: values.status,
        };

        updateReleaseMutation.mutate(payload, {
            onSuccess: () => {
                setIsEditMode(false);
            },
        });
    };

    const handleDelete = () => {
        if (!releaseId || !window.confirm('Удалить этот релиз?')) return;

        deleteReleaseMutation.mutate(releaseId, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const handleEditPost = (platformId: number) => {
        setSelectedPlatformId(platformId);
    };

    const handlePostDraftSubmit = (values: PostDraftFormValues) => {
        upsertPostDraftMutation.mutate(values, {
            onSuccess: () => {
                setSelectedPlatformId(null);
            },
        });
    };

    const handleClose = () => {
        setIsEditMode(false);
        setSelectedPlatformId(null);
        onClose();
    };

    const initialFormValues: ReleaseFormValues | undefined = release
        ? {
            packId: release.packId,
            title: release.title,
            releaseDateTime: dayjs(release.releaseDateTime).toDate(),
            notes: release.notes ?? undefined,
            status: release.status,
        }
        : undefined;

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title="Релиз"
            fullScreen
        >
            {isLoading && (
                <Group justify="center" my="md">
                    <Loader/>
                </Group>
            )}

            {isError && (
                <Alert
                    color="red"
                    icon={<IconAlertCircle size={16}/>}
                    mb="md"
                    variant="light"
                >
                    Не удалось загрузить данные релиза. Попробуй обновить страницу.
                </Alert>
            )}

            {!isLoading && !isError && release && (
                <ScrollArea>
                    <Stack gap="md">
                        {/* Заголовок + кнопки */}
                        <Group justify="space-between" align="flex-start">
                            <Stack gap={4}>
                                <Title order={4}>{release.title}</Title>
                                <Text size="sm" c="dimmed">
                                    {release.packName}
                                </Text>
                            </Stack>
                            <Stack gap={6} align="flex-end">
                                <Badge
                                    size="sm"
                                    color={RELEASE_STATUS_COLORS[release.status]}
                                >
                                    {statusLabelMap[release.status]}
                                </Badge>
                                <Group gap={6}>
                                    <Button
                                        size="xs"
                                        variant={isEditMode ? 'outline' : 'light'}
                                        leftSection={<IconPencil size={14}/>}
                                        onClick={() => setIsEditMode((prev) => !prev)}
                                    >
                                        {isEditMode ? 'Отмена' : 'Редактировать'}
                                    </Button>
                                    <Button
                                        size="xs"
                                        color="red"
                                        variant="light"
                                        leftSection={<IconTrash size={14}/>}
                                        onClick={handleDelete}
                                        loading={deleteReleaseMutation.isPending}
                                    >
                                        Удалить
                                    </Button>
                                </Group>
                            </Stack>
                        </Group>

                        {/* Режим редактирования */}
                        {isEditMode && initialFormValues && (
                            <ReleaseForm
                                mode="edit"
                                initialValues={initialFormValues}
                                onSubmit={handleEditSubmit}
                                onCancel={() => setIsEditMode(false)}
                                isSubmitting={updateReleaseMutation.isPending}
                            />
                        )}

                        {/* Режим просмотра */}
                        {!isEditMode && (
                            <>
                                {/* Дата и время */}
                                <Stack gap={4}>
                                    <Group gap={6}>
                                        <IconCalendar size={16}/>
                                        <Text fw={500} size="sm">
                                            Дата и время
                                        </Text>
                                    </Group>
                                    <Text size="sm" c="dimmed">
                                        {dayjs(release.releaseDateTime).format(
                                            'DD.MM.YYYY HH:mm'
                                        )}
                                    </Text>
                                </Stack>

                                {/* Заметки */}
                                {release.notes && (
                                    <Stack gap={4}>
                                        <Text fw={500} size="sm">
                                            Заметки
                                        </Text>
                                        <Text
                                            size="sm"
                                            c="dimmed"
                                            style={{whiteSpace: 'pre-wrap'}}
                                        >
                                            {release.notes}
                                        </Text>
                                    </Stack>
                                )}

                                {/* Платформы */}
                                <Stack gap={4}>
                                    <Text fw={500} size="sm">
                                        Платформы
                                    </Text>
                                    {!platforms || platforms.length === 0 ? (
                                        <Text size="xs" c="dimmed">
                                            Платформы пока не добавлены.
                                        </Text>
                                    ) : (
                                        <Stack gap="xs">
                                            {platforms.map((platform) => (
                                                <ReleasePlatformCard
                                                    key={platform.id}
                                                    platform={platform}
                                                    onEditPost={() => handleEditPost(platform.id)}
                                                />
                                            ))}
                                        </Stack>
                                    )}
                                </Stack>
                            </>
                        )}
                    </Stack>
                </ScrollArea>
            )}

            {/* Модалка редактирования поста */}
            <Modal
                opened={selectedPlatformId != null}
                onClose={() => setSelectedPlatformId(null)}
                title="Редактировать пост"
                size="lg"
            >
                {postDraft && (
                    <PostDraftForm
                        initialValues={postDraft}
                        onSubmit={handlePostDraftSubmit}
                        onCancel={() => setSelectedPlatformId(null)}
                        isSubmitting={upsertPostDraftMutation.isPending}
                    />
                )}
            </Modal>
        </Modal>
    );
};

export default ReleaseDetailsModal;
