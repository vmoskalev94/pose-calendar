import { useState, type FormEvent } from 'react';
import {
    Button,
    Group,
    NumberInput,
    Select,
    Stack,
    Switch,
    Textarea,
    TextInput,
} from '@mantine/core';
import type { PackType, PackStatus } from '../model';

const packTypeOptions = [
    { value: 'SOLO', label: 'Solo' },
    { value: 'COUPLE', label: 'Couple' },
    { value: 'GROUP', label: 'Group' },
    { value: 'MIXED', label: 'Mixed' },
];

const statusOptions = [
    { value: 'DRAFT', label: 'Черновик' },
    { value: 'IN_PROGRESS', label: 'В работе' },
    { value: 'READY_FOR_RELEASE', label: 'Готов к релизу' },
    { value: 'RELEASED', label: 'Релизнут' },
    { value: 'ARCHIVED', label: 'Архив' },
];

export interface PackFormValues {
    titleRu: string;
    titleEn?: string;
    description?: string;
    packType: PackType;
    posesCount?: number;
    allInOne: boolean;
    hashtags?: string;
    requirements?: string;
    status?: PackStatus;
}

interface PackFormProps {
    mode: 'create' | 'edit';
    initialValues?: PackFormValues;
    onSubmit: (values: PackFormValues) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const PackForm = ({
                      mode,
                      initialValues,
                      onSubmit,
                      onCancel,
                      isSubmitting,
                  }: PackFormProps) => {
    const [titleRu, setTitleRu] = useState(initialValues?.titleRu ?? '');
    const [titleEn, setTitleEn] = useState(initialValues?.titleEn ?? '');
    const [description, setDescription] = useState(
        initialValues?.description ?? ''
    );
    const [packType, setPackType] = useState<PackType>(
        initialValues?.packType ?? 'SOLO'
    );
    const [posesCount, setPosesCount] = useState<number | undefined>(
        initialValues?.posesCount
    );
    const [allInOne, setAllInOne] = useState<boolean>(
        initialValues?.allInOne ?? false
    );
    const [hashtags, setHashtags] = useState(initialValues?.hashtags ?? '');
    const [requirements, setRequirements] = useState(
        initialValues?.requirements ?? ''
    );
    const [status, setStatus] = useState<PackStatus>(
        initialValues?.status ?? 'DRAFT'
    );

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        const payload: PackFormValues = {
            titleRu,
            titleEn: titleEn || undefined,
            description: description || undefined,
            packType,
            posesCount,
            allInOne,
            hashtags: hashtags || undefined,
            requirements: requirements || undefined,
            status,
        };

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="sm">
                <TextInput
                    label="Название (RU)"
                    placeholder="Например: Cozy Winter Poses"
                    value={titleRu}
                    onChange={(event) => setTitleRu(event.currentTarget.value)}
                    required
                />
                <TextInput
                    label="Название (EN)"
                    placeholder="Cozy Winter Poses"
                    value={titleEn}
                    onChange={(event) => setTitleEn(event.currentTarget.value)}
                />
                <Textarea
                    label="Описание"
                    minRows={3}
                    value={description}
                    onChange={(event) => setDescription(event.currentTarget.value)}
                />
                <Group grow>
                    <Select
                        label="Тип пака"
                        data={packTypeOptions}
                        value={packType}
                        onChange={(value) => {
                            if (value) {
                                setPackType(value as PackType);
                            }
                        }}
                        allowDeselect={false}
                    />
                    <NumberInput
                        label="Количество поз"
                        value={posesCount}
                        onChange={(value) => {
                            if (typeof value === 'number') {
                                setPosesCount(value);
                            } else {
                                setPosesCount(undefined);
                            }
                        }}
                        min={0}
                    />
                </Group>
                <Switch
                    label="All-in-one файл"
                    checked={allInOne}
                    onChange={(event) => setAllInOne(event.currentTarget.checked)}
                />
                <Textarea
                    label="Хэштеги"
                    description="Через пробел или перенос строки, как тебе удобнее"
                    minRows={2}
                    value={hashtags}
                    onChange={(event) => setHashtags(event.currentTarget.value)}
                />
                <Textarea
                    label="Требования (DLC, объекты, позплеер...)"
                    minRows={2}
                    value={requirements}
                    onChange={(event) => setRequirements(event.currentTarget.value)}
                />
                {mode === 'edit' && (
                    <Select
                        label="Статус"
                        placeholder="Выберите статус"
                        data={statusOptions}
                        value={status}
                        onChange={(value) => {
                            if (value) {
                                setStatus(value as PackStatus);
                            }
                        }}
                        allowDeselect={false}
                    />
                )}
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

export default PackForm;
