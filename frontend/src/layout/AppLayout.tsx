// src/layout/AppLayout.tsx
import type {ReactNode} from 'react';
import {
    AppShell,
    Burger,
    Button,
    Group,
    NavLink,
    ScrollArea,
    Text,
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {
    IconCalendar,
    IconSettings,
    IconBox,
} from '@tabler/icons-react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useAuth} from '../features/auth/AuthContext';

interface AppLayoutProps {
    children: ReactNode;
}

const AppLayout = ({children}: AppLayoutProps) => {
    const [opened, {toggle}] = useDisclosure();
    const navigate = useNavigate();
    const location = useLocation();
    const {user, logout} = useAuth();

    const isCalendar = location.pathname === '/app';

    const handleLogout = () => {
        logout();
        navigate('/login', {replace: true});
    };

    return (
        <AppShell
            header={{height: 56}}
            navbar={{
                width: 260,
                breakpoint: 'sm',
                collapsed: {mobile: !opened},
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group gap="sm">
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            hiddenFrom="sm"
                            size="sm"
                        />
                        <Text fw={600}>Pose Calendar</Text>
                    </Group>

                    <Group gap="sm">
                        {user && (
                            <Text size="sm" c="dimmed">
                                {user.displayName} ({user.username})
                            </Text>
                        )}
                        <Button variant="outline" size="xs" onClick={handleLogout}>
                            Выйти
                        </Button>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="sm">
                <ScrollArea style={{height: '100%'}}>
                    <NavLink
                        label="Календарь релизов"
                        description="Главный экран"
                        leftSection={<IconCalendar size={18}/>}
                        active={isCalendar}
                        onClick={() => navigate('/app')}
                    />

                    <NavLink
                        label="Паки поз"
                        description="Список паков"
                        leftSection={<IconBox size={18}/>}
                        disabled
                    />

                    <NavLink
                        label="Настройки"
                        leftSection={<IconSettings size={18}/>}
                        disabled
                    />
                </ScrollArea>
            </AppShell.Navbar>

            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
};

export default AppLayout;
