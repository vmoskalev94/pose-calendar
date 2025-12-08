import {Card, SimpleGrid, Text, Title} from '@mantine/core';
import AppLayout from '../layout/AppLayout';
import RightContextPanel from '../features/layout/RightContextPanel';

const AppPage = () => {
    return (
        <AppLayout>
            <SimpleGrid cols={{base: 1, lg: 2}} spacing="md">
                <Card withBorder padding="lg" radius="md">
                    <Title order={3} mb="xs">
                        Календарь релизов
                    </Title>
                    <Text c="dimmed" size="sm">
                        Здесь позже появится сам календарь (вид «месяц» / «список»),
                        привязка к датам и выбор дня.
                    </Text>
                </Card>

                <RightContextPanel/>
            </SimpleGrid>
        </AppLayout>
    );
};

export default AppPage;
