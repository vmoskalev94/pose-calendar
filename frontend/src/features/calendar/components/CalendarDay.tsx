// src/features/calendar/components/CalendarDay.tsx
import {Badge, Box, Stack, Text} from '@mantine/core';
import type {CalendarDay} from '../model';
import {RELEASE_STATUS_COLORS} from '../model';

interface CalendarDayProps {
    day: CalendarDay;
    onDayClick: (date: Date) => void; // Клик по "телу" дня → создание релиза
    onReleaseClick: (releaseId: number) => void; // Клик по релизу → просмотр
}

const CalendarDayComponent = ({day, onDayClick, onReleaseClick}: CalendarDayProps) => {
    const handleDayClick = (e: React.MouseEvent) => {
        // Клик по телу дня (не по релизу)
        if (e.currentTarget === e.target) {
            onDayClick(day.date);
        }
    };

    const handleReleaseClick = (
        e: React.MouseEvent,
        releaseId: number
    ) => {
        e.stopPropagation(); // Предотвращаем всплытие до onDayClick
        onReleaseClick(releaseId);
    };

    return (
        <Box
            onClick={handleDayClick}
            style={{
                border: '1px solid var(--mantine-color-gray-3)',
                borderRadius: 'var(--mantine-radius-sm)',
                padding: '8px',
                minHeight: '100px',
                cursor: 'pointer',
                backgroundColor: day.isToday
                    ? 'var(--mantine-color-blue-0)'
                    : 'transparent',
                opacity: day.isCurrentMonth ? 1 : 0.4,
            }}
        >
            <Stack gap="xs">
                {/* Номер дня */}
                <Text
                    size="sm"
                    fw={day.isToday ? 700 : 400}
                    c={day.isCurrentMonth ? 'dark' : 'dimmed'}
                >
                    {day.dayNumber}
                </Text>

                {/* Релизы как бейджи */}
                {day.releases.map((release) => (
                    <Badge
                        key={release.id}
                        size="xs"
                        color={RELEASE_STATUS_COLORS[release.status]}
                        style={{cursor: 'pointer'}}
                        onClick={(e) => handleReleaseClick(e, release.id)}
                    >
                        {release.title}
                    </Badge>
                ))}
            </Stack>
        </Box>
    );
};

export default CalendarDayComponent;
