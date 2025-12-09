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
import PackShortCard from '../packs/components/PackShortCard';
import PackDetailsModal from '../packs/components/PackDetailsModal';
import PackForm, {type PackFormValues} from '../packs/components/PackForm';
import {useCreatePackMutation, usePacksQuery} from '../packs/hooks';
import type {PackCreateRequest} from '../packs/model';


const RightContextPanel = () => {
    const [selectedPackId, setSelectedPackId] = useState<number | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const {data: packs, isLoading, isError} = usePacksQuery();
    const createPackMutation = useCreatePackMutation();

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
                            <Text size="sm" c="dimmed">
                                Здесь позже появится список релизов и быстрый
                                переход к карточке релиза.
                            </Text>
                            <Button size="xs" variant="outline">
                                Запланировать релиз
                            </Button>
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
        </>
    );
};

export default RightContextPanel;
