import { Group, Stack, Text } from "@mantine/core";
import { ICoupleMember } from "@/entities/couple";
import { SpotAvatar } from "@/shared/ui";
import styles from "./CoupleHero.module.css";
import { useNavigate } from "react-router-dom";

export default function CoupleHero({ members }: { members?: ICoupleMember[] }) {
  const navigate = useNavigate();
  const first = members?.[0]?.user;
  const second = members?.[1]?.user;

  return (
    <Group justify="center" className={styles.hero}>
      <Group
        justify="space-between"
        gap="0"
        wrap="wrap"
        className={styles.heroTarget}
        role="button"
        tabIndex={0}
        aria-label="Действия со страницей пары"
      >
        <Stack align="center" gap={6} className={styles.memberStack}>
          <SpotAvatar
            size={96}
            src={first?.avatarUrl}
            onClick={() => {
              navigate(`/profile/${first?.username}`);
            }}
          >
            {first?.username?.charAt(0)}
          </SpotAvatar>
          <Text className={styles.memberName}>{first?.name ?? ""}</Text>
        </Stack>
        <Text fz="h2" fw="bolder">
          &
        </Text>
        <Stack align="center" gap={6} className={styles.memberStack}>
          <SpotAvatar
            size={96}
            src={second?.avatarUrl}
            onClick={() => {
              navigate(`/profile/${second?.username}`);
            }}
          >
            {second?.username?.charAt(0)}
          </SpotAvatar>
          <Text className={styles.memberName}>{second?.name ?? ""}</Text>
        </Stack>
      </Group>
    </Group>
  );
}
