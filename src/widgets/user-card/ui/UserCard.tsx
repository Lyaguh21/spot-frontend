import { IUserState } from "@/entities/user";
import { SpotGlassCard, SpotActionIcon } from "@/shared/ui";
import { Flex, Avatar, Stack, Text } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";

export default function UserCard({ userData }: { userData: IUserState }) {
  return (
    <SpotGlassCard isButton={true} p="md">
      <Flex justify="space-between" align="center">
        <Flex gap="md" align="center">
          <Avatar size="xl" src={userData.avatarUrl} alt={userData.username}>
            {userData.username.charAt(0)}
          </Avatar>

          <Stack gap={0}>
            <Text>{userData.name}</Text>
            <Text size="xs" c="dimmed">
              {userData.username}
            </Text>
          </Stack>
        </Flex>
        <SpotActionIcon size="lg">
          <IconArrowRight />
        </SpotActionIcon>
      </Flex>
    </SpotGlassCard>
  );
}
