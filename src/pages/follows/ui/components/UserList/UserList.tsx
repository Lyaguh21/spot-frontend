import {
  IFollowersResponse,
  IFollowingResponse,
  IUserState,
} from "@/entities/user";
import { ICoupleState } from "@/entities/couple";
import { SpotActionIcon, SpotGlassCard } from "@/shared/ui";
import { Avatar, Flex, Group, ScrollArea, Stack, Text } from "@mantine/core";
import { IconArrowRight, IconChevronRight } from "@tabler/icons-react";
import styles from "./UserList.module.css";

const UserCard = function ({ userData }: { userData: IUserState }) {
  return (
    <SpotGlassCard isButton={true} p="md">
      <Flex justify="space-between" align="center">
        <Flex gap="md" align="center">
          <Avatar size="lg" src={userData.avatarUrl} alt={userData.username}>
            {userData.username.charAt(0)}
          </Avatar>

          <Stack gap={0}>
            <Text c="white" fz="lg">
              {userData.name}
            </Text>
            <Text size="sm" c="dimmed">
              @{userData.username}
            </Text>
          </Stack>
        </Flex>
        <SpotActionIcon size="lg">
          <IconArrowRight />
        </SpotActionIcon>
      </Flex>
    </SpotGlassCard>
  );
};

const CoupleCard = function ({ couple }: { couple: ICoupleState }) {
  const first = couple.members[0]?.user;
  const second = couple.members[1]?.user;
  const names = [first?.name, second?.name].filter(Boolean).join(" & ");

  return (
    <SpotGlassCard className={styles.pairCard} isButton={true} p="md">
      <Group justify="space-between" wrap="nowrap">
        <Group gap="md" wrap="nowrap">
          <Group gap={0}>
            <Avatar
              size="lg"
              src={first?.avatarUrl}
              className={styles.pairAvatar}
            >
              {first?.username?.charAt(0)}
            </Avatar>
            <Avatar
              size="lg"
              src={second?.avatarUrl}
              className={styles.pairAvatar}
            >
              {second?.username?.charAt(0)}
            </Avatar>
          </Group>
          <Stack gap={2}>
            <Text c="white" fw={600} size="sm">
              {names || "Пара"}
            </Text>
            <Text c="dimmed" size="sm">
              Карточка пары
            </Text>
          </Stack>
        </Group>
        <IconChevronRight />
      </Group>
    </SpotGlassCard>
  );
};

export default function UserList({
  followType,
  followers,
  followings,
}: {
  followType: string;
  followers?: IFollowersResponse;
  followings?: IFollowingResponse;
}) {
  const couples = followType === "following" ? (followings?.couples ?? []) : [];
  const users =
    followType === "followers" ? (followers ?? []) : (followings?.users ?? []);
  const total = couples.length + users.length;
  const hasData =
    followType === "followers"
      ? followers !== undefined
      : followings !== undefined;

  return (
    <Stack gap="sm" style={{ flex: 1 }}>
      <Text size="sm" c="dimmed">
        Всего: {total}
      </Text>
      <ScrollArea style={{ flex: 1 }}>
        {hasData && total === 0 ? (
          <Text c="dimmed" ta="center" mt="lg">
            Тут пока пусто
          </Text>
        ) : (
          <Stack gap="sm" py="md">
            {couples.map((couple) => (
              <CoupleCard key={couple.id} couple={couple} />
            ))}
            {users.map((user) => (
              <UserCard key={user.id} userData={user} />
            ))}
          </Stack>
        )}
      </ScrollArea>
    </Stack>
  );
}
