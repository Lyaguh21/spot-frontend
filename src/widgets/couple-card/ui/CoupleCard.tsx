import { SpotAvatar, SpotGlassCard } from "@/shared/ui";
import { Avatar, Group, Stack, Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import styles from "./CoupleCard.module.css";
import { IUserState } from "@/entities/user";

export default function CoupleCard({
  firstUser,
  secondUser,
  title,
  subtitle,
  onClick,
  mt,
}: {
  firstUser?: Pick<IUserState, "avatarUrl" | "name" | "username"> | null;
  secondUser?: Pick<IUserState, "avatarUrl" | "name" | "username"> | null;
  title?: string;
  subtitle?: string;
  onClick?: () => void;
  mt?: string | number;
}) {
  const names =
    title ?? [firstUser?.name, secondUser?.name].filter(Boolean).join(" & ");
  const description = subtitle ?? "Карточка пары";
  return (
    <SpotGlassCard
      className={styles.pairCard}
      onClick={onClick}
      isButton={Boolean(onClick)}
      mt={mt}
    >
      <Group justify="space-between" wrap="nowrap">
        <Group gap="sm" wrap="nowrap">
          <Avatar.Group spacing={16}>
            <SpotAvatar
              size={52}
              src={firstUser?.avatarUrl}
            >
              {firstUser?.username?.charAt(0)}
            </SpotAvatar>
            <SpotAvatar
              size={52}
              src={secondUser?.avatarUrl}
            >
              {secondUser?.username?.charAt(0)}
            </SpotAvatar>
          </Avatar.Group>
          <Stack gap={2}>
            <Text c="white" fw={600} size="sm">
              {names || "Пара"}
            </Text>
            <Text c="dimmed" size="sm">
              {description}
            </Text>
          </Stack>
        </Group>
        <IconChevronRight />
      </Group>
    </SpotGlassCard>
  );
}
