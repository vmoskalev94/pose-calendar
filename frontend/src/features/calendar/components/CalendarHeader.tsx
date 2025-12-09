// src/features/calendar/components/CalendarHeader.tsx
import {ActionIcon, Group, Text} from '@mantine/core';
import {IconChevronLeft, IconChevronRight} from '@tabler/icons-react';
import dayjs from 'dayjs';

interface CalendarHeaderProps {
    currentDate: Date; // Дата текущего месяца
    onPreviousMonth: () => void;
    onNextMonth: () => void;
}

const CalendarHeader = ({
                            currentDate,
                            onPreviousMonth,
                            onNextMonth,
                        }: CalendarHeaderProps) => {
    // Форматируем заголовок: "December 2025"
    const monthYear = dayjs(currentDate).format('MMMM YYYY');

    return (
        <Group justify="space-between" mb="md">
            <ActionIcon
                variant="subtle"
                size="lg"
                onClick={onPreviousMonth}
                aria-label="Previous month"
            >
                <IconChevronLeft size={20}/>
            </ActionIcon>

            <Text size="lg" fw={600}>
                {monthYear}
            </Text>

            <ActionIcon
                variant="subtle"
                size="lg"
                onClick={onNextMonth}
                aria-label="Next month"
            >
                <IconChevronRight size={20}/>
            </ActionIcon>
        </Group>
    );
};

export default CalendarHeader;
