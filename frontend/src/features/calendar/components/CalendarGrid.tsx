// src/features/calendar/components/CalendarGrid.tsx
import {useState, useMemo} from 'react';
import {Alert, Box, Center, Loader, SimpleGrid, Stack, Text} from '@mantine/core';
import {IconAlertCircle} from '@tabler/icons-react';
import dayjs from 'dayjs';
import {useReleasesQuery} from '../hooks';
import type {CalendarDay, ReleaseDto} from '../model';
import CalendarHeader from './CalendarHeader';
import CalendarDayComponent from './CalendarDay';

// Названия дней недели (начиная с понедельника)
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * Утилита для генерации массива дней месяца с учетом недель.
 * Возвращает массив от начала первой недели до конца последней недели.
 */
function generateCalendarDays(
    year: number,
    month: number, // 0-11 (JavaScript месяцы)
    releases: ReleaseDto[]
): CalendarDay[] {
    const firstDayOfMonth = dayjs(new Date(year, month, 1));

    // Определяем день недели первого дня месяца (0 = Sunday, 1 = Monday, ...)
    // Преобразуем так чтобы Monday = 0, Sunday = 6
    const dayOfWeek = firstDayOfMonth.day();
    const startWeekday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // Начинаем с первого понедельника перед или в начале месяца
    const calendarStart = firstDayOfMonth.subtract(startWeekday, 'day');

    // Количество недель: всегда показываем полные недели (обычно 5-6)
    const totalDays = 42; // 6 недель * 7 дней

    const today = dayjs().startOf('day');

    const days: CalendarDay[] = [];

    for (let i = 0; i < totalDays; i++) {
        const date = calendarStart.add(i, 'day');
        const dayNumber = date.date();
        const isCurrentMonth = date.month() === month;
        const isToday = date.isSame(today, 'day');

        // Фильтруем релизы для этого дня
        const dayReleases = releases.filter((release) => {
            const releaseDate = dayjs(release.releaseDateTime);
            return releaseDate.isSame(date, 'day');
        });

        days.push({
            date: date.toDate(),
            dayNumber,
            isCurrentMonth,
            isToday,
            releases: dayReleases,
        });
    }

    return days;
}

interface CalendarGridProps {
    onCreateRelease?: (date: Date) => void; // Callback для создания релиза
    onViewRelease?: (releaseId: number) => void; // Callback для просмотра релиза
}

const CalendarGrid = ({onCreateRelease, onViewRelease}: CalendarGridProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Извлекаем год и месяц
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-11

    // Форматируем диапазон для API
    const from = dayjs(new Date(year, month, 1)).format('YYYY-MM-DD');
    const to = dayjs(new Date(year, month + 1, 0)).format('YYYY-MM-DD'); // Последний день месяца

    // Загружаем релизы за месяц
    const { data: releases, isLoading, isError } = useReleasesQuery(from, to);

    // Генерируем массив дней календаря
    const calendarDays = useMemo(() => {
        if (!releases) return [];
        return generateCalendarDays(year, month, releases);
    }, [year, month, releases]);

    // Навигация
    const handlePreviousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    // Обработчики кликов
    const handleDayClick = (date: Date) => {
        onCreateRelease?.(date);
    };

    const handleReleaseClick = (releaseId: number) => {
        onViewRelease?.(releaseId);
    };

    // Состояния загрузки
    if (isLoading) {
        return (
            <Center py="xl">
                <Loader size="lg"/>
            </Center>
        );
    }

    if (isError) {
        return (
            <Alert color="red" icon={<IconAlertCircle size={16}/>} variant="light">
                Не удалось загрузить релизы. Попробуйте обновить страницу.
            </Alert>
        );
    }

    return (
        <Stack gap="md">
            {/* Заголовок с навигацией */}
            <CalendarHeader
                currentDate={currentDate}
                onPreviousMonth={handlePreviousMonth}
                onNextMonth={handleNextMonth}
            />

            {/* Заголовки дней недели */}
            <SimpleGrid cols={7} spacing="xs">
                {WEEKDAYS.map((day) => (
                    <Box key={day} style={{textAlign: 'center'}}>
                        <Text size="sm" fw={600} c="dimmed">
                            {day}
                        </Text>
                    </Box>
                ))}
            </SimpleGrid>

            {/* Сетка дней */}
            <SimpleGrid cols={7} spacing="xs">
                {calendarDays.map((day, index) => (
                    <CalendarDayComponent
                        key={index}
                        day={day}
                        onDayClick={handleDayClick}
                        onReleaseClick={handleReleaseClick}
                    />
                ))}
            </SimpleGrid>
        </Stack>
    );
};

export default CalendarGrid;
