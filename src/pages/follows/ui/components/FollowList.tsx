import {
  IFollowingItem,
  IUserState,
  useGetFollowersQuery,
  useGetFollowingsQuery,
} from "@/entities/user";
import CoupleCard from "@/widgets/couple-card";
import UserCard from "@/widgets/user-card";
import { Center, Loader, ScrollArea, Stack, Text } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type FollowListItem = IFollowingItem | (IUserState & { type: "USER" });

const PAGE_LIMIT = 20;

export default function FollowList({
  followType,
  username,
  search,
}: {
  followType: string;
  username?: string;
  search: string;
}) {
  const navigate = useNavigate();
  const viewportRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = search.trim();
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<FollowListItem[]>([]);

  const followersQuery = useGetFollowersQuery(
    {
      username: username ?? "",
      page,
      limit: PAGE_LIMIT,
      search: debouncedSearch,
    },
    { skip: !username || followType !== "followers" },
  );
  const followingsQuery = useGetFollowingsQuery(
    {
      username: username ?? "",
      page,
      limit: PAGE_LIMIT,
      search: debouncedSearch,
    },
    { skip: !username || followType !== "following" },
  );

  const isFetching =
    followType === "followers"
      ? followersQuery.isFetching
      : followingsQuery.isFetching;
  const total =
    followType === "followers"
      ? (followersQuery.currentData?.total ?? 0)
      : (followingsQuery.currentData?.total ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));
  const hasMore = items.length < total;
  const canLoadMore = hasMore && page < totalPages;

  useEffect(() => {
    setPage(1);
    setItems([]);
  }, [followType, username, debouncedSearch]);

  useEffect(() => {
    const activeData =
      followType === "followers"
        ? followersQuery.currentData
        : followingsQuery.currentData;

    if (!activeData) {
      return;
    }

    const nextItems: FollowListItem[] =
      followType === "followers" && followersQuery.currentData
        ? followersQuery.currentData.items.map((user) => ({
            ...user,
            type: "USER" as const,
          }))
        : (followingsQuery.currentData?.items ?? []);

    setItems((currentItems) => {
      if (activeData.page === 1) {
        return nextItems;
      }

      const existingKeys = new Set(
        currentItems.map((item) => `${item.type}-${item.id}`),
      );
      const uniqueNextItems = nextItems.filter(
        (item) => !existingKeys.has(`${item.type}-${item.id}`),
      );

      return [...currentItems, ...uniqueNextItems];
    });
  }, [followersQuery.currentData, followingsQuery.currentData, followType]);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (
      !viewport ||
      !canLoadMore ||
      isFetching ||
      viewport.scrollHeight > viewport.clientHeight
    ) {
      return;
    }

    setPage((currentPage) => currentPage + 1);
  }, [canLoadMore, isFetching, items.length]);

  const handleScroll = ({ y }: { y: number }) => {
    const viewport = viewportRef.current;

    if (!viewport || !canLoadMore || isFetching) {
      return;
    }

    const distanceToBottom = viewport.scrollHeight - viewport.clientHeight - y;

    if (distanceToBottom < 120) {
      setPage((currentPage) => Math.min(currentPage + 1, totalPages));
    }
  };

  return (
    <Stack gap="0" style={{ flex: 1, minHeight: 0 }}>
      <Text size="sm" c="dimmed">
        Всего: {total}
      </Text>
      <ScrollArea
        viewportRef={viewportRef}
        onScrollPositionChange={handleScroll}
        style={{ flex: 1, minHeight: 0, overflow: "hidden" }}
        mb={75}
      >
        {!isFetching && total === 0 ? (
          <Text c="dimmed" ta="center" mt="lg">
            Тут пока пусто
          </Text>
        ) : (
          <Stack gap="sm" py="sm">
            {items.map((item) =>
              item.type === "COUPLE" ? (
                <CoupleCard
                  key={`${item.type}-${item.id}`}
                  firstUser={item.members[0]?.user}
                  secondUser={item.members[1]?.user}
                  subtitle={`@${item.members[0]?.user.username} и @${item.members[1]?.user.username}`}
                  onClick={() => navigate({ pathname: `/couple/${item.id}` })}
                />
              ) : (
                <UserCard key={`${item.type}-${item.id}`} userData={item} />
              ),
            )}
            {isFetching && (
              <Center py="md">
                <Loader size="sm" />
              </Center>
            )}
          </Stack>
        )}
      </ScrollArea>
    </Stack>
  );
}
