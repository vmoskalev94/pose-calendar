import {useState} from 'react';
import {Card, Modal, SimpleGrid, Title} from '@mantine/core';
import AppLayout from '../layout/AppLayout';
import RightContextPanel from '../features/layout/RightContextPanel';
import CalendarGrid from '../features/calendar/components/CalendarGrid';

const AppPage = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedReleaseId, setSelectedReleaseId] = useState<number | null>(null);

    const handleCreateRelease = (date: Date) => {
        setSelectedDate(date);
        // Откроем модалку создания релиза (TODO: шаг 8.2)
    };

    const handleViewRelease = (releaseId: number) => {
        setSelectedReleaseId(releaseId);
        // Откроем модалку просмотра релиза (TODO: шаг 8.3)
    };

    const handleCloseCreateModal = () => {
        setSelectedDate(null);
    };

    const handleCloseViewModal = () => {
        setSelectedReleaseId(null);
    };

    return (
        <AppLayout>
            <SimpleGrid cols={{base: 1, lg: 2}} spacing="md">
                <Card withBorder padding="lg" radius="md">
                    <Title order={3} mb="md">
                        Календарь релизов
                    </Title>
                    <CalendarGrid
                        onCreateRelease={handleCreateRelease}
                        onViewRelease={handleViewRelease}
                    />
                </Card>

                <RightContextPanel/>
            </SimpleGrid>

            {/* Модалки будут реализованы на шагах 8.2 и 8.3 */}
            <Modal
                opened={selectedDate != null}
                onClose={handleCloseCreateModal}
                title="Создать релиз"
            >
                {/* TODO: ReleaseCreateForm - будет реализовано на шаге 8.2 */}
                <p>Выбрана дата: {selectedDate?.toLocaleDateString()}</p>
            </Modal>

            <Modal
                opened={selectedReleaseId != null}
                onClose={handleCloseViewModal}
                title="Просмотр релиза"
            >
                {/* TODO: ReleaseDetailsModal - будет реализовано на шаге 8.3 */}
                <p>Release ID: {selectedReleaseId}</p>
            </Modal>
        </AppLayout>
    );
};

export default AppPage;
