// src/features/calendar/components/ReleasePlatformCard.tsx
import {Badge, Button, Card, Group, Stack, Text} from '@mantine/core';
import {IconEdit} from '@tabler/icons-react';
import dayjs from 'dayjs';
import type {ReleasePlatformDto} from '../model';

interface ReleasePlatformCardProps {
    platform: ReleasePlatformDto;
    onEditPost: () => void;
}

const statusLabels: Record<ReleasePlatformDto['status'], string> = {
    PLANNED: 'Запланирован',
    DRAFT_PREPARED: 'Черновик готов',
    PUBLISHED: 'Опубликован',
};

const statusColors: Record<ReleasePlatformDto['status'], string> = {
    PLANNED: 'gray',
    DRAFT_PREPARED: 'yellow',
    PUBLISHED: 'green',
};

const ReleasePlatformCard = ({platform, onEditPost}: ReleasePlatformCardProps) => {
    return (
        <Card withBorder padding="sm" radius="md">
            <Stack gap="xs">
                <Group justify="space-between" align="center">
                    <Text fw={600} size="sm">
                        {platform.platform}
                    </Text>
                    <Badge size="xs" color={statusColors[platform.status]}>
                        {statusLabels[platform.status]}
                    </Badge>
                </Group>

                {platform.plannedDateTime && (
                    <Text size="xs" c="dimmed">
                        Планируется: {dayjs(platform.plannedDateTime).format('DD.MM.YYYY HH:mm')}
                    </Text>
                )}

                {platform.publishedDateTime && (
                    <Text size="xs" c="dimmed">
                        Опубликовано: {dayjs(platform.publishedDateTime).format('DD.MM.YYYY HH:mm')}
                    </Text>
                )}

                {platform.notes && (
                    <Text size="xs" c="dimmed" lineClamp={2}>
                        {platform.notes}
                    </Text>
                )}

                {platform.postDraft && (
                    <Text size="xs" c="dimmed">
                        Черновик: {platform.postDraft.title || '(без названия)'}
                    </Text>
                )}

                <Button
                    size="xs"
                    variant="light"
                    leftSection={<IconEdit size={14}/>}
                    onClick={onEditPost}
                >
                    Редактировать пост
                </Button>
            </Stack>
        </Card>
    );
};

export default ReleasePlatformCard;
