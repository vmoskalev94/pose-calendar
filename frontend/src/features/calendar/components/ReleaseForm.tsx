// src/features/calendar/components/ReleaseForm.tsx
import {useState, type FormEvent} from 'react';
import {
    Button,
    Group,
    Select,
    Stack,
    Textarea,
    TextInput,
} from '@mantine/core';
import {DateTimePicker} from '@mantine/dates';
import 'dayjs/locale/ru';
import {usePacksQuery} from '../../packs/hooks';
import type {ReleaseStatus} from '../model';

const releaseStatusOptions = [
    {value: 'PLANNED', label: 'Запланирован'},
    {value: 'CONTENT_READY', label: 'Контент готов'},
    {value: 'POSTED', label: 'Опубликован'},
    {value: 'CANCELLED', label: 'Отменен'},
];

export interface ReleaseFormValues {
    packId: number;
    title: string;
    releaseDateTime: Date;
    notes?: string;
    status?: ReleaseStatus;
}

interface ReleaseFormProps {
    mode: 'create' | 'edit';
    initialValues?: ReleaseFormValues;
    onSubmit: (values: ReleaseFormValues) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const ReleaseForm = ({
                         mode,
                         initialValues,
                         onSubmit,
                         onCancel,
                         isSubmitting,
                     }: ReleaseFormProps) => {
    const [packId, setPackId] = useState<number | undefined>(
        initialValues?.packId
    );
    const [title, setTitle] = useState(initialValues?.title ?? '');
    const [releaseDateTime, setReleaseDateTime] = useState<Date>(
        initialValues?.releaseDateTime ?? new Date()
    );
    const [notes, setNotes] = useState(initialValues?.notes ?? '');
    const [status, setStatus] = useState<ReleaseStatus>(
        initialValues?.status ?? 'READY_FOR_RELEASE' //     {/*DRAFT*/}
    );

    // Загружаем список паков для Select
    const {data: packs, isLoading: packsLoading} = usePacksQuery();

    // Преобразуем паки в опции для Select
    const packOptions = packs?.map((pack) => ({
        value: pack.id.toString(),
        label: pack.titleRu + (pack.titleEn ? ` (${pack.titleEn})` : ''),
    })) ?? [];

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        if (!packId) {
            return; // Пак обязателен
        }

        const payload: ReleaseFormValues = {
            packId,
            title,
            releaseDateTime,
            notes: notes || undefined,
            status,
        };

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="sm">
                <Select
                    label="Пак"
                    placeholder={packsLoading ? 'Загрузка...' : 'Выберите пак'}
                    data={packOptions}
                    value={packId?.toString()}
                    onChange={(value) => {
                        if (value) {
                            setPackId(parseInt(value, 10));
                        }
                    }}
                    disabled={packsLoading}
                    required
                    searchable
                />
                <TextInput
                    label="Название релиза"
                    placeholder="Например: Winter Poses Pack"
                    value={title}
                    onChange={(event) => setTitle(event.currentTarget.value)}
                    required
                />
                <DateTimePicker
                    label="Дата и время релиза"
                    placeholder="Выберите дату и время"
                    value={releaseDateTime}
                    onChange={(value) => {
                        if (value) {
                            const date = typeof value === 'string' ? new Date(value) : value;
                            setReleaseDateTime(date);
                        }
                    }}
                    valueFormat="DD.MM.YYYY HH:mm"
                    locale="ru"
                    firstDayOfWeek={1}
                    required
                />
                <Select
                    label="Статус"
                    data={releaseStatusOptions}
                    value={status}
                    onChange={(value) => {
                        if (value) {
                            setStatus(value as ReleaseStatus);
                        }
                    }}
                    allowDeselect={false}
                />
                <Textarea
                    label="Заметки"
                    placeholder="Дополнительная информация о релизе"
                    minRows={3}
                    value={notes}
                    onChange={(event) => setNotes(event.currentTarget.value)}
                />
                <Group justify="flex-end" mt="md">
                    <Button type="button" variant="subtle" onClick={onCancel}>
                        Отмена
                    </Button>
                    <Button type="submit" loading={isSubmitting}>
                        {mode === 'create' ? 'Создать' : 'Сохранить'}
                    </Button>
                </Group>
            </Stack>
        </form>
    );
};

export default ReleaseForm;
