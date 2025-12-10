// src/features/packs/components/PackDetailsModal.tsx
import {useState} from 'react';
import {
    Alert,
    Badge,
    Button,
    Checkbox,
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
    IconChecklist,
    IconHash,
    IconInfoCircle,
    IconPencil,
} from '@tabler/icons-react';
import {
    usePackQuery,
    usePackTasksQuery,
    useToggleTaskMutation,
    useUpdatePackMutation,
} from '../hooks';
import type {PackDetails, PackUpdateRequest} from '../model';
import PackForm, {type PackFormValues} from './PackForm';
import {PackFilesSection} from './PackFilesSection';

interface PackDetailsModalProps {
    packId: number | null;
    opened: boolean;
    onClose: () => void;
}

const statusLabelMap: Record<PackDetails['status'], string> = {
    DRAFT: 'Черновик',
    IN_PROGRESS: 'В работе',
    READY_FOR_RELEASE: 'Готов к релизу',
    RELEASED: 'Релизнут',
    ARCHIVED: 'Архив',
};

const typeLabelMap: Record<PackDetails['packType'], string> = {
    SOLO: 'Solo',
    COUPLE: 'Couple',
    GROUP: 'Group',
    MIXED: 'Mixed',
};

const PackDetailsModal = ({packId, opened, onClose}: PackDetailsModalProps) => {
    const [isEditMode, setIsEditMode] = useState(false);

    const {
        data: pack,
        isLoading: isPackLoading,
        isError: isPackError,
    } = usePackQuery(packId, opened);

    const {
        data: tasks,
        isLoading: isTasksLoading,
        isError: isTasksError,
    } = usePackTasksQuery(packId, opened);

    // packId может быть null до первого открытия, поэтому подставляем 0 — мутацию не вызовем раньше времени
    const updatePackMutation = useUpdatePackMutation(packId ?? 0);
    const toggleTaskMutation = useToggleTaskMutation();

    const isLoading = isPackLoading || isTasksLoading;
    const hasError = isPackError || isTasksError;

    const handleToggleTask = (taskId: number, completed: boolean) => {
        if (packId == null) {
            return;
        }

        toggleTaskMutation.mutate({
            packId,
            taskId,
            update: {completed},
        });
    };

    const handleEditSubmit = (values: PackFormValues) => {
        if (!pack || packId == null) return;

        const payload: PackUpdateRequest = {
            titleRu: values.titleRu,
            titleEn: values.titleEn,
            description: values.description,
            packType: values.packType,
            posesCount: values.posesCount,
            allInOne: values.allInOne,
            hashtags: values.hashtags,
            requirements: values.requirements,
            status: values.status ?? pack.status,
        };

        updatePackMutation.mutate(payload, {
            onSuccess: () => {
                setIsEditMode(false);
            },
        });
    };

    const handleClose = () => {
        setIsEditMode(false);
        onClose();
    };

    const initialFormValues: PackFormValues | undefined = pack
        ? {
            titleRu: pack.titleRu,
            titleEn: pack.titleEn ?? undefined,
            description: pack.description ?? undefined,
            packType: pack.packType,
            posesCount: pack.posesCount ?? undefined,
            allInOne: pack.allInOne,
            hashtags: pack.hashtags ?? undefined,
            requirements: pack.requirements ?? undefined,
            status: pack.status,
        }
        : undefined;

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title="Пак поз"
            size="lg"
        >

            {isLoading && (
                <Group justify="center" my="md">
                    <Loader/>
                </Group>
            )}

            {hasError && (
                <Alert
                    color="red"
                    icon={<IconAlertCircle size={16}/>}
                    mb="md"
                    variant="light"
                >
                    Не удалось загрузить данные пака. Попробуй обновить страницу.
                </Alert>
            )}

            {!isLoading && !hasError && pack && (
                <ScrollArea style={{height: '100%'}}>
                    <Stack gap="md">
                        {/* Заголовок + кнопка редактирования */}
                        <Group justify="space-between" align="flex-start">
                            <Stack gap={4}>
                                <Title order={4}>{pack.titleRu}</Title>
                                {pack.titleEn && (
                                    <Text size="sm" c="dimmed">
                                        {pack.titleEn}
                                    </Text>
                                )}
                            </Stack>
                            <Stack gap={6} align="flex-end">
                                <Group gap={8}>
                                    <Badge size="sm" variant="light">
                                        {typeLabelMap[pack.packType]}
                                    </Badge>
                                    <Badge size="sm" variant="outline">
                                        {statusLabelMap[pack.status]}
                                    </Badge>
                                </Group>
                                <Button
                                    size="xs"
                                    variant={isEditMode ? 'outline' : 'light'}
                                    leftSection={<IconPencil size={14}/>}
                                    onClick={() => setIsEditMode((prev) => !prev)}
                                >
                                    {isEditMode ? 'Отмена' : 'Редактировать'}
                                </Button>
                            </Stack>
                        </Group>

                        {/* Режим редактирования */}
                        {isEditMode && initialFormValues && (
                            <PackForm
                                mode="edit"
                                initialValues={initialFormValues}
                                onSubmit={handleEditSubmit}
                                onCancel={() => setIsEditMode(false)}
                                isSubmitting={updatePackMutation.isPending}
                            />
                        )}

                        {/* Режим просмотра */}
                        {!isEditMode && (
                            <>
                                {pack.description && (
                                    <Text size="sm">{pack.description}</Text>
                                )}

                                {pack.hashtags && (
                                    <Stack gap={4}>
                                        <Group gap={6}>
                                            <IconHash size={16}/>
                                            <Text fw={500} size="sm">
                                                Хэштеги
                                            </Text>
                                        </Group>
                                        <Text
                                            size="xs"
                                            c="dimmed"
                                            style={{whiteSpace: 'pre-wrap'}}
                                        >
                                            {pack.hashtags}
                                        </Text>
                                    </Stack>
                                )}

                                {pack.requirements && (
                                    <Stack gap={4}>
                                        <Group gap={6}>
                                            <IconInfoCircle size={16}/>
                                            <Text fw={500} size="sm">
                                                Требования
                                            </Text>
                                        </Group>
                                        <Text
                                            size="xs"
                                            c="dimmed"
                                            style={{whiteSpace: 'pre-wrap'}}
                                        >
                                            {pack.requirements}
                                        </Text>
                                    </Stack>
                                )}

                                <Stack gap={4}>
                                    <Group gap={6}>
                                        <IconChecklist size={16}/>
                                        <Text fw={500} size="sm">
                                            Чек-лист
                                        </Text>
                                    </Group>

                                    {tasks && tasks.length === 0 && (
                                        <Text size="xs" c="dimmed">
                                            Задачи пока не созданы.
                                        </Text>
                                    )}

                                    {tasks &&
                                        tasks.map((task) => (
                                            <Checkbox
                                                key={task.id}
                                                label={task.title}
                                                checked={task.completed}
                                                onChange={(event) =>
                                                    handleToggleTask(task.id, event.currentTarget.checked)
                                                }
                                                disabled={toggleTaskMutation.isPending}
                                            />
                                        ))}
                                </Stack>
                                <PackFilesSection packId={pack.id ?? null}/>
                            </>
                        )}
                    </Stack>
                </ScrollArea>
            )}
        </Modal>
    );
};

export default PackDetailsModal;
