// src/features/calendar/components/ReleaseCard.tsx
import {Badge, Card, Group, Stack, Text} from '@mantine/core';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import type {ReleaseDto} from '../model';
import {RELEASE_STATUS_COLORS} from '../model';

interface ReleaseCardProps {
    release: ReleaseDto;
    onClick?: () => void;
}

/**
 * Форматирует дату релиза с умным отображением:
 * - "Сегодня в HH:mm"
 * - "Завтра в HH:mm"
 * - "DD.MM.YYYY HH:mm"
 */
const formatReleaseDate = (dateTimeString: string): string => {
    const date = dayjs(dateTimeString);
    const today = dayjs().startOf('day');
    const tomorrow = today.add(1, 'day');

    if (date.isSame(today, 'day')) {
        return `Сегодня в ${date.format('HH:mm')}`;
    } else if (date.isSame(tomorrow, 'day')) {
        return `Завтра в ${date.format('HH:mm')}`;
    } else {
        return date.format('DD.MM.YYYY HH:mm');
    }
};

const ReleaseCard = ({release, onClick}: ReleaseCardProps) => {
    const statusLabel = {
        PLANNED: 'Запланирован',
        CONTENT_READY: 'Контент готов',
        POSTED: 'Опубликован',
        CANCELLED: 'Отменен',
    }[release.status];

    return (
        <Card
            withBorder
            padding="sm"
            radius="md"
            style={{cursor: onClick ? 'pointer' : 'default'}}
            onClick={onClick}
        >
            <Stack gap="xs">
                {/* Название релиза */}
                <Text fw={600} size="sm" lineClamp={1}>
                    {release.title}
                </Text>

                {/* Название пака */}
                <Text size="xs" c="dimmed" lineClamp={1}>
                    {release.packName}
                </Text>

                {/* Дата и статус */}
                <Group justify="space-between" align="center">
                    <Text size="xs" c="dimmed">
                        {formatReleaseDate(release.releaseDateTime)}
                    </Text>
                    <Badge size="xs" color={RELEASE_STATUS_COLORS[release.status]}>
                        {statusLabel}
                    </Badge>
                </Group>
            </Stack>
        </Card>
    );
};

export default ReleaseCard;
