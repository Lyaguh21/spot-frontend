import { SpotGlassCard } from "@/shared/ui";
import { Group, Avatar, Stack, Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import styles from "./CoupleCard.module.css";
import { IUserState } from "@/entities/user";

export default function CoupleCard({
  isOwnProfile,
  handleCoupleClick,
  userData,
}: {
  isOwnProfile: boolean;
  userData: IUserState | undefined;
  handleCoupleClick: () => void;
}) {
  if (!userData?.partner && isOwnProfile)
    return (
      <SpotGlassCard
        className={styles.pairCard}
        mt="lg"
        onClick={handleCoupleClick}
        isButton={true}
      >
        <Group justify="space-between" wrap="nowrap">
          <Stack gap={2}>
            <Text c="white" fw={600}>
              Создать свою пару
            </Text>
            <Text c="dimmed" size="sm">
              Нажмите чтобы добавить партнера
            </Text>
          </Stack>
          <IconChevronRight />
        </Group>
      </SpotGlassCard>
    );

  return (
    <Stack gap="xs" mt="lg">
      <SpotGlassCard className={styles.pairCard} onClick={handleCoupleClick}>
        <Group justify="space-between" wrap="nowrap">
          <Group gap="md" wrap="nowrap">
            <Group gap={0}>
              <Avatar
                size={52}
                src={userData?.avatarUrl}
                className={styles.pairAvatar}
              >
                {userData?.username.charAt(0)}
              </Avatar>
              <Avatar
                size={52}
                src={userData?.partner?.avatarUrl}
                className={styles.pairAvatar}
              >
                {userData?.partner?.username.charAt(0)}
              </Avatar>
            </Group>
            <Stack gap={2}>
              <Text c="white" fw={600} size="sm">
                {userData?.name} & {userData?.partner?.name}
              </Text>
              <Text c="dimmed">
                {isOwnProfile ? "Карточка пары" : `Пара пользователя`}
              </Text>
            </Stack>
          </Group>
          <IconChevronRight />
        </Group>
      </SpotGlassCard>
    </Stack>
  );
}
