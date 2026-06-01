import { SpotGlassCard } from "@/shared/ui";
import { Group, Stack, Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import coupleCardStyles from "@/widgets/couple-card/ui/CoupleCard.module.css";

export default function BackToProfileCard({ username }: { username: string }) {
  const navigate = useNavigate();

  return (
    <SpotGlassCard
      className={coupleCardStyles.pairCard}
      mt="lg"
      onClick={() => navigate(`/profile/${username}`)}
      isButton={true}
    >
      <Group justify="space-between" wrap="nowrap">
        <Stack gap={2}>
          <Text c="white" fw={600}>
            Вернуться в профиль
          </Text>
          <Text c="dimmed" size="sm">
            Нажмите чтобы перейти в свой профиль
          </Text>
        </Stack>
        <IconChevronRight />
      </Group>
    </SpotGlassCard>
  );
}
