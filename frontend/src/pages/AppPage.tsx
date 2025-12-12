import {useState} from 'react';
import {Box, Card, Modal, Title} from '@mantine/core';
import dayjs from 'dayjs';
import AppLayout from '../layout/AppLayout';
import RightContextPanel from '../features/layout/RightContextPanel';
import CalendarGrid from '../features/calendar/components/CalendarGrid';
import ReleaseForm, {type ReleaseFormValues} from '../features/calendar/components/ReleaseForm';
import ReleaseDetailsModal from '../features/calendar/components/ReleaseDetailsModal';
import {useAuth} from '../features/auth/AuthContext';
import {useCreateReleaseMutation} from '../features/calendar/hooks';
import type {CreateReleaseRequest, ReleaseStatus} from '../features/calendar/model';

const AppPage = () => {
    const {user} = useAuth();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedReleaseId, setSelectedReleaseId] = useState<number | null>(null);

    const createReleaseMutation = useCreateReleaseMutation(user?.id ?? null);

    const handleCreateRelease = (date: Date) => {
        setSelectedDate(date);
    };

    const handleViewRelease = (releaseId: number) => {
        setSelectedReleaseId(releaseId);
    };

    const handleCloseCreateModal = () => {
        setSelectedDate(null);
    };

    const handleCloseViewModal = () => {
        setSelectedReleaseId(null);
    };

    const handleCreateReleaseSubmit = (values: ReleaseFormValues) => {
        const payload: CreateReleaseRequest = {
            packId: values.packId,
            title: values.title,
            releaseDateTime: dayjs(values.releaseDateTime).format(
                'YYYY-MM-DDTHH:mm:ss'
            ),
            notes: values.notes,
        };

        createReleaseMutation.mutate(payload, {
            onSuccess: () => {
                setSelectedDate(null);
            },
        });
    };

    const [status] = useState<ReleaseStatus>('READY_FOR_RELEASE');

    return (
        <AppLayout>
            <Box
                style={{
                    display: 'grid',
                    gridTemplateColumns: '7fr 3fr',
                    gap: 'var(--mantine-spacing-md)',
                }}
            >
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
            </Box>

            {/* Модалка создания релиза */}
            <Modal
                opened={selectedDate != null}
                onClose={handleCloseCreateModal}
                title="Создать релиз"
                size="lg"
            >
                {selectedDate && (
                    <ReleaseForm
                        mode="create"
                        initialValues={{
                            packId: undefined as any, // Пользователь выберет пак в форме
                            title: '',
                            releaseDateTime: selectedDate,
                            notes: '',
                            status: status,
                        }}
                        onSubmit={handleCreateReleaseSubmit}
                        onCancel={handleCloseCreateModal}
                        isSubmitting={createReleaseMutation.isPending}
                    />
                )}
            </Modal>

            {/* Модалка просмотра релиза */}
            <ReleaseDetailsModal
                releaseId={selectedReleaseId}
                opened={selectedReleaseId != null}
                onClose={handleCloseViewModal}
            />
        </AppLayout>
    );
};

export default AppPage;
