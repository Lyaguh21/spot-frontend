import { IUserState } from "@/entities/user";
import { SpotAvatar, SpotGlassCard } from "@/shared/ui";
import { Flex, Stack, Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function UserCard({ userData }: { userData: IUserState }) {
  const navigate = useNavigate();
  return (
    <SpotGlassCard
      isButton={true}
      p="md"
      onClick={() => navigate({ pathname: `/profile/${userData.username}` })}
    >
      <Flex justify="space-between" align="center">
        <Flex gap="md" align="center">
          <SpotAvatar size="48" src={userData.avatarUrl} alt={userData.username}>
            {userData.username.charAt(0)}
          </SpotAvatar>

          <Stack gap={0}>
            <Text>{userData.name}</Text>
            <Text size="xs" c="dimmed">
              @{userData.username}
            </Text>
          </Stack>
        </Flex>
        <IconChevronRight />
      </Flex>
    </SpotGlassCard>
  );
}
