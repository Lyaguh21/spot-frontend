import { IFollowersResponse, IFollowingResponse } from "@/entities/user";
import { ScrollArea, Stack, Text } from "@mantine/core";
import CoupleCard from "@/widgets/couple-card";
import UserCard from "@/widgets/user-card";
import { useNavigate } from "react-router-dom";

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
    followType === "followers"
      ? (followers?.items ?? [])
      : (followings?.users ?? []);
  const total =
    followType === "followers"
      ? (followers?.total ?? users.length)
      : couples.length + users.length;
  const hasData =
    followType === "followers"
      ? followers !== undefined
      : followings !== undefined;
  const navigate = useNavigate();
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
                subtitle={`@${couple.members[0]?.user.username} и @${couple.members[1]?.user.username}`}
                onClick={() => navigate({ pathname: `/couple/${couple.id}` })}
              />
            ))}
            {users?.map((user) => (
              <UserCard key={user.id} userData={user} />
            ))}
          </Stack>
        )}
      </ScrollArea>
    </Stack>
  );
}
