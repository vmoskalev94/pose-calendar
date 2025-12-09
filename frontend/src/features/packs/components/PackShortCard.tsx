// src/features/packs/components/PackShortCard.tsx
import {Badge, Card, Group, Progress, Stack, Text} from '@mantine/core';
import {IconBox} from '@tabler/icons-react';
import type {PackShort} from '../model';

interface PackShortCardProps {
    pack: PackShort;
    onClick?: () => void;
}

const statusLabelMap: Record<PackShort['status'], string> = {
    DRAFT: 'Черновик',
    IN_PROGRESS: 'В работе',
    READY_FOR_RELEASE: 'Готов к релизу',
    RELEASED: 'Релизнут',
    ARCHIVED: 'Архив',
};

const typeLabelMap: Record<PackShort['packType'], string> = {
    SOLO: 'Solo',
    COUPLE: 'Couple',
    GROUP: 'Group',
    MIXED: 'Mixed',
};

const PackShortCard = ({pack, onClick}: PackShortCardProps) => {
    const progress =
        pack.totalTasks > 0
            ? Math.round((pack.completedTasks / pack.totalTasks) * 100)
            : 0;

    return (
        <Card
            withBorder
            radius="md"
            padding="sm"
            onClick={onClick}
            style={{cursor: onClick ? 'pointer' : 'default'}}
        >
            <Stack gap="xs">
                <Group justify="space-between" align="flex-start">
                    <Group gap="xs">
                        <IconBox size={18}/>
                        <div>
                            <Text fw={600} size="sm">
                                {pack.titleRu}
                            </Text>
                            {pack.titleEn && (
                                <Text size="xs" c="dimmed">
                                    {pack.titleEn}
                                </Text>
                            )}
                        </div>
                    </Group>

                    <Stack gap={4} align="flex-end">
                        <Badge size="xs" variant="light">
                            {typeLabelMap[pack.packType]}
                        </Badge>
                        <Badge size="xs" variant="outline">
                            {statusLabelMap[pack.status]}
                        </Badge>
                    </Stack>
                </Group>

                {pack.totalTasks > 0 && (
                    <div>
                        <Group justify="space-between" mb={4}>
                            <Text size="xs" c="dimmed">
                                Прогресс
                            </Text>
                            <Text size="xs" c="dimmed">
                                {pack.completedTasks}/{pack.totalTasks}
                            </Text>
                        </Group>
                        <Progress value={progress} size="sm"/>
                    </div>
                )}

                {pack.posesCount != null && (
                    <Text size="xs" c="dimmed">
                        Поз: {pack.posesCount}{' '}
                        {pack.allInOne ? '· all-in-one' : undefined}
                    </Text>
                )}
            </Stack>
        </Card>
    );
};

export default PackShortCard;
