import { SpotAvatar } from "@/shared/ui";
import { Group, Stack, Text, UnstyledButton } from "@mantine/core";
import type { UserIdentityData } from "../../model/types";
import styles from "../Admin.module.css";

export default function UserIdentity({
  user,
  onClick,
}: {
  user?: UserIdentityData;
  onClick?: () => void;
}) {
  const content = (
    <Group gap={10} wrap="nowrap" className={styles.identity}>
      <SpotAvatar src={user?.avatarUrl} alt={user?.username} size={42}>
        {user?.username?.[0]?.toUpperCase()}
      </SpotAvatar>
      <Stack gap={1} className={styles.identityCopy}>
        <Text className={styles.username}>
          {user?.username ? `@${user.username}` : "Нет пользователя"}
        </Text>
        <Text className={styles.name}>{user?.name || "Имя не указано"}</Text>
      </Stack>
    </Group>
  );

  if (!onClick || !user?.username) {
    return content;
  }

  return (
    <UnstyledButton className={styles.identityButton} onClick={onClick}>
      {content}
    </UnstyledButton>
  );
}
