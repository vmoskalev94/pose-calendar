// src/features/layout/RightContextPanel.tsx
import {useState} from 'react';

import {
    Alert,
    Button,
    Card,
    Center,
    Group,
    Loader,
    Modal,
    Stack,
    Tabs,
    Text,
} from '@mantine/core';
import {
    IconAlertCircle,
    IconBox,
    IconCalendarStats,
    IconPlus,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import PackShortCard from '../packs/components/PackShortCard';
import PackDetailsModal from '../packs/components/PackDetailsModal';
import PackForm, {type PackFormValues} from '../packs/components/PackForm';
import {useCreatePackMutation, usePacksQuery} from '../packs/hooks';
import type {PackCreateRequest} from '../packs/model';
import ReleaseCard from '../calendar/components/ReleaseCard';
import ReleaseDetailsModal from '../calendar/components/ReleaseDetailsModal';
import ReleaseForm, {type ReleaseFormValues} from '../calendar/components/ReleaseForm';
import {useAuth} from '../auth/AuthContext';
import {useReleasesQuery, useCreateReleaseMutation} from '../calendar/hooks';
import type {CreateReleaseRequest} from '../calendar/model';


const RightContextPanel = () => {
    const {user} = useAuth();
    const [selectedPackId, setSelectedPackId] = useState<number | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedReleaseId, setSelectedReleaseId] = useState<number | null>(null);
    const [isCreateReleaseModalOpen, setIsCreateReleaseModalOpen] = useState(false);

    const {data: packs, isLoading, isError} = usePacksQuery();
    const createPackMutation = useCreatePackMutation();

    // Загружаем релизы на ближайшие 30 дней
    const today = dayjs();
    const from = today.format('YYYY-MM-DD');
    const to = today.add(30, 'day').format('YYYY-MM-DD');
    const {
        data: releases,
        isLoading: releasesLoading,
        isError: releasesError,
    } = useReleasesQuery(user?.id ?? null, from, to);
    const createReleaseMutation = useCreateReleaseMutation(user?.id ?? null);

    const handleOpenPack = (id: number) => {
        setSelectedPackId(id);
    };

    const handleClosePackModal = () => {
        setSelectedPackId(null);
    };

    const handleOpenCreate = () => {
        setIsCreateModalOpen(true);
    };

    const handleCloseCreate = () => {
        setIsCreateModalOpen(false);
    };

    const handleCreateSubmit = (values: PackFormValues) => {
        const payload: PackCreateRequest = {
            titleRu: values.titleRu,
            titleEn: values.titleEn,
            description: values.description,
            packType: values.packType,
            posesCount: values.posesCount,
            allInOne: values.allInOne,
            hashtags: values.hashtags,
            requirements: values.requirements,
        };

        createPackMutation.mutate(payload, {
            onSuccess: () => {
                setIsCreateModalOpen(false);
            },
        });
    };

    const handleOpenRelease = (id: number) => {
        setSelectedReleaseId(id);
    };

    const handleCloseReleaseModal = () => {
        setSelectedReleaseId(null);
    };

    const handleOpenCreateRelease = () => {
        setIsCreateReleaseModalOpen(true);
    };

    const handleCloseCreateRelease = () => {
        setIsCreateReleaseModalOpen(false);
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
                setIsCreateReleaseModalOpen(false);
            },
        });
    };

    return (
        <>
            <Card withBorder radius="md" padding="md">
                <Tabs defaultValue="packs">
                    <Tabs.List grow>
                        <Tabs.Tab
                            value="packs"
                            leftSection={<IconBox size={16}/>}
                        >
                            Паки
                        </Tabs.Tab>
                        <Tabs.Tab
                            value="releases"
                            leftSection={<IconCalendarStats size={16}/>}
                        >
                            Релизы
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="packs" pt="md">
                        <Stack gap="sm">
                            <Group justify="space-between" align="center">
                                <Text fw={500} size="sm">
                                    Паки поз
                                </Text>
                                <Button
                                    size="xs"
                                    leftSection={<IconPlus size={14}/>}
                                    onClick={handleOpenCreate}
                                >
                                    Новый пак
                                </Button>
                            </Group>

                            {isLoading && (
                                <Center py="md">
                                    <Loader size="sm"/>
                                </Center>
                            )}

                            {isError && (
                                <Alert
                                    color="red"
                                    icon={<IconAlertCircle size={16}/>}
                                    variant="light"
                                >
                                    Не удалось загрузить список паков.
                                </Alert>
                            )}

                            {!isLoading &&
                                !isError &&
                                packs &&
                                packs.length === 0 && (
                                    <Text size="sm" c="dimmed">
                                        У тебя пока нет ни одного пака. Нажми
                                        «Новый пак», чтобы создать первый.
                                    </Text>
                                )}

                            {!isLoading &&
                                !isError &&
                                packs &&
                                packs.length > 0 && (
                                    <Stack gap="xs">
                                        {packs.map((pack) => (
                                            <PackShortCard
                                                key={pack.id}
                                                pack={pack}
                                                onClick={() =>
                                                    handleOpenPack(pack.id)
                                                }
                                            />
                                        ))}
                                    </Stack>
                                )}
                        </Stack>
                    </Tabs.Panel>

                    <Tabs.Panel value="releases" pt="md">
                        <Stack gap="sm">
                            <Group justify="space-between" align="center">
                                <Text fw={500} size="sm">
                                    Ближайшие релизы
                                </Text>
                                <Button
                                    size="xs"
                                    leftSection={<IconPlus size={14}/>}
                                    onClick={handleOpenCreateRelease}
                                >
                                    Новый релиз
                                </Button>
                            </Group>

                            {releasesLoading && (
                                <Center py="md">
                                    <Loader size="sm"/>
                                </Center>
                            )}

                            {releasesError && (
                                <Alert
                                    color="red"
                                    icon={<IconAlertCircle size={16}/>}
                                    variant="light"
                                >
                                    Не удалось загрузить список релизов.
                                </Alert>
                            )}

                            {!releasesLoading &&
                                !releasesError &&
                                releases &&
                                releases.length === 0 && (
                                    <Text size="sm" c="dimmed">
                                        У тебя пока нет запланированных релизов. Нажми
                                        «Новый релиз», чтобы создать первый.
                                    </Text>
                                )}

                            {!releasesLoading &&
                                !releasesError &&
                                releases &&
                                releases.length > 0 && (() => {
                                    const groupedReleases = groupReleasesByDate(releases);

                                    return (
                                        <Stack gap="md">
                                            {Array.from(groupedReleases.entries()).map(([dateLabel, dateReleases]) => (
                                                <Stack key={dateLabel} gap="xs">
                                                    <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                                                        {dateLabel}
                                                    </Text>
                                                    <Stack gap="xs">
                                                        {dateReleases.map((release) => (
                                                            <ReleaseCard
                                                                key={release.id}
                                                                release={release}
                                                                onClick={() =>
                                                                    handleOpenRelease(release.id)
                                                                }
                                                            />
                                                        ))}
                                                    </Stack>
                                                </Stack>
                                            ))}
                                        </Stack>
                                    );
                                })()}
                        </Stack>
                    </Tabs.Panel>
                </Tabs>
            </Card>

            <PackDetailsModal
                packId={selectedPackId}
                opened={selectedPackId != null}
                onClose={handleClosePackModal}
            />

            <Modal
                opened={isCreateModalOpen}
                onClose={handleCloseCreate}
                title="Новый пак"
                size="lg"
            >
                <PackForm
                    mode="create"
                    onSubmit={handleCreateSubmit}
                    onCancel={handleCloseCreate}
                    isSubmitting={createPackMutation.isPending}
                />
            </Modal>

            <ReleaseDetailsModal
                releaseId={selectedReleaseId}
                opened={selectedReleaseId != null}
                onClose={handleCloseReleaseModal}
            />

            <Modal
                opened={isCreateReleaseModalOpen}
                onClose={handleCloseCreateRelease}
                title="Новый релиз"
                size="lg"
            >
                <ReleaseForm
                    mode="create"
                    onSubmit={handleCreateReleaseSubmit}
                    onCancel={handleCloseCreateRelease}
                    isSubmitting={createReleaseMutation.isPending}
                />
            </Modal>
        </>
    );
};

// -------- helpers --------

function groupReleasesByDate(releases: any[]): Map<string, any[]> {
    const grouped = new Map<string, any[]>();

    releases.forEach((release) => {
        const date = dayjs(release.releaseDateTime);
        const today = dayjs().startOf('day');
        const tomorrow = today.add(1, 'day');

        let key: string;
        if (date.isSame(today, 'day')) {
            key = 'Сегодня';
        } else if (date.isSame(tomorrow, 'day')) {
            key = 'Завтра';
        } else {
            key = date.format('DD.MM.YYYY');
        }

        if (!grouped.has(key)) {
            grouped.set(key, []);
        }
        grouped.get(key)!.push(release);
    });

    return grouped;
}

export default RightContextPanel;
