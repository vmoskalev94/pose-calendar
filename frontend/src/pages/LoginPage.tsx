import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Alert,
    Button,
    Container,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '../features/auth/AuthContext';
import { useLoginMutation } from '../features/auth/hooks';

const LoginPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, loginFromResponse } = useAuth();
    const loginMutation = useLoginMutation();

    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin123');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // если уже залогинены — сразу переходим в /app
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/app', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        try {
            const response = await loginMutation.mutateAsync({ username, password });
            loginFromResponse(response);
            navigate('/app', { replace: true });
        } catch (error: any) {
            // простая обработка ошибок
            const msg =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                'Не удалось войти. Проверь логин и пароль.';
            setErrorMessage(msg);
        }
    };

    return (
        <Container size="xs" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <Stack gap="md">
                    <div>
                        <Title order={2}>Pose Calendar</Title>
                        <Text c="dimmed" size="sm">
                            Войдите, чтобы открыть календарь релизов и паков.
                        </Text>
                    </div>

                    {errorMessage && (
                        <Alert
                            variant="light"
                            color="red"
                            title="Ошибка"
                            icon={<IconAlertCircle size={16} />}
                        >
                            {errorMessage}
                        </Alert>
                    )}

                    <TextInput
                        label="Логин"
                        placeholder="admin"
                        value={username}
                        onChange={(event) => setUsername(event.currentTarget.value)}
                        required
                    />

                    <PasswordInput
                        label="Пароль"
                        placeholder="admin123"
                        value={password}
                        onChange={(event) => setPassword(event.currentTarget.value)}
                        required
                    />

                    <Button
                        type="submit"
                        loading={loginMutation.isPending}
                    >
                        Войти
                    </Button>

                    <Text c="dimmed" size="xs">
                        Для dev-режима сейчас используется тестовый пользователь:
                        <br />
                        <b>admin / admin123</b>
                    </Text>
                </Stack>
            </form>
        </Container>
    );
};

export default LoginPage;
