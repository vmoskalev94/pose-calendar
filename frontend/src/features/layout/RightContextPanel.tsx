import {Button, Card, Stack, Tabs, Text} from '@mantine/core';
import {IconBox, IconCalendarStats} from '@tabler/icons-react';

const RightContextPanel = () => {
    return (
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
                    <Stack gap="xs">
                        <Text size="sm" c="dimmed">
                            Здесь будет список паков, связанный с выбранной датой/фильтром.
                        </Text>
                        <Button size="xs">
                            Создать новый пак
                        </Button>
                    </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="releases" pt="md">
                    <Stack gap="xs">
                        <Text size="sm" c="dimmed">
                            Здесь будет список релизов и быстрый переход к карточке релиза.
                        </Text>
                        <Button size="xs" variant="outline">
                            Запланировать релиз
                        </Button>
                    </Stack>
                </Tabs.Panel>
            </Tabs>
        </Card>
    );
};

export default RightContextPanel;
