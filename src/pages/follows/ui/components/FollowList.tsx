import { IFollowersResponse, IFollowingResponse } from "@/entities/user";
import { ScrollArea, Stack, Text } from "@mantine/core";
import CoupleCard from "@/widgets/couple-card";
import UserCard from "@/widgets/user-card";

export default function FollowList({
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
          <Stack gap="sm">
            {couples?.map((couple) => (
              <CoupleCard
                key={couple.id}
                firstUser={couple.members[0]?.user}
                secondUser={couple.members[1]?.user}
                subtitle="Карточка пары"
              />
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
