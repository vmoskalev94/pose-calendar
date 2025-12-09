// src/features/calendar/components/PostDraftForm.tsx
import {useState, type FormEvent} from 'react';
import {Button, Group, Select, Stack, Textarea, TextInput} from '@mantine/core';

export interface PostDraftFormValues {
    title: string;
    body: string;
    hashtags: string;
    language: string;
}

interface PostDraftFormProps {
    initialValues?: PostDraftFormValues;
    onSubmit: (values: PostDraftFormValues) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const languageOptions = [
    {value: 'ru', label: 'Русский'},
    {value: 'en', label: 'English'},
];

const PostDraftForm = ({
    initialValues,
    onSubmit,
    onCancel,
    isSubmitting,
}: PostDraftFormProps) => {
    const [title, setTitle] = useState(initialValues?.title ?? '');
    const [body, setBody] = useState(initialValues?.body ?? '');
    const [hashtags, setHashtags] = useState(initialValues?.hashtags ?? '');
    const [language, setLanguage] = useState(initialValues?.language ?? 'ru');

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        onSubmit({title, body, hashtags, language});
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="sm">
                <TextInput
                    label="Заголовок"
                    placeholder="Название поста"
                    value={title}
                    onChange={(e) => setTitle(e.currentTarget.value)}
                    maxLength={255}
                />
                <Textarea
                    label="Текст поста"
                    placeholder="Основной текст..."
                    value={body}
                    onChange={(e) => setBody(e.currentTarget.value)}
                    minRows={6}
                    autosize
                />
                <Textarea
                    label="Хэштеги"
                    placeholder="#пример #хэштеги"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.currentTarget.value)}
                    maxLength={2000}
                    minRows={2}
                />
                <Select
                    label="Язык"
                    data={languageOptions}
                    value={language}
                    onChange={(value) => value && setLanguage(value)}
                    allowDeselect={false}
                />
                <Group justify="flex-end" mt="md">
                    <Button type="button" variant="subtle" onClick={onCancel}>
                        Отмена
                    </Button>
                    <Button type="submit" loading={isSubmitting}>
                        Сохранить
                    </Button>
                </Group>
            </Stack>
        </form>
    );
};

export default PostDraftForm;
