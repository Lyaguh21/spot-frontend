import { SpotGlassCard } from "@/shared/ui";
import { Group, Avatar, Stack, Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import styles from "./CoupleCard.module.css";

export default function CoupleCard({
  isOwnProfile,
  handleCoupleClick,
}: {
  isOwnProfile: boolean;
  handleCoupleClick: () => void;
}) {
  return (
    <SpotGlassCard
      className={styles.pairCard}
      mt="xl"
      onClick={handleCoupleClick}
    >
      <Group justify="space-between" wrap="nowrap">
        <Group gap="md" wrap="nowrap">
          <Avatar size={52} className={styles.pairAvatar}>
            А
          </Avatar>
          <Stack gap={2}>
            <Text c="white" fw={600}>
              Аня
            </Text>
            <Text c="dimmed">
              {isOwnProfile ? "Ваша пара" : `Пара пользователя`}
            </Text>
          </Stack>
        </Group>
        <IconChevronRight />
      </Group>
    </SpotGlassCard>
  );
}
