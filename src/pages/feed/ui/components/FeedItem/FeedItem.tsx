import { IFeedItem } from "@/entities/feed";
import { markersColors, markersIcons } from "@/entities/map";
import { formatRelativeTime } from "@/shared/lib";
import { SpotAvatar, SpotButton, SpotSkeletonLoader } from "@/shared/ui";
import ViewVisitInfoDrawer from "@/widgets/visit-info-drawer";
import { Avatar, Box, Divider, Group, Stack, Text } from "@mantine/core";
import { IconStarFilled } from "@tabler/icons-react";
import { useState } from "react";
import styles from "./FeedItem.module.css";
import { useNavigate } from "react-router-dom";

const formatRating = (rating: number) =>
  Number.isInteger(rating) ? String(rating) : rating.toFixed(1);

export default function FeedItem({ item }: { item: IFeedItem }) {
  const navigate = useNavigate();
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const isCouple = item.ownerType === "COUPLE" && Boolean(item.couple);
  const owners = isCouple
    ? (item.couple?.members.map(({ user }) => user) ?? [])
    : item.user
      ? [item.user]
      : [];
  const ownerName = isCouple
    ? item.couple?.generatedName ||
      owners.map(({ name, username }) => name || username).join(" и ")
    : item.user?.name || item.user?.username || "Пользователь";
  const showPhoto = Boolean(item.photoURL) && !imageFailed;
  const color = markersColors[item.color] ?? ["#7b2cff", "#22b5ff"];
  const averageRating =
    item.ratings.length > 0
      ? item.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
        item.ratings.length
      : null;

  const getRatingOwner = (nickname: string) =>
    owners.find((owner) => owner.username === nickname);

  return (
    <>
      <article className={styles.card}>
        <Group gap={10} wrap="nowrap" align="center">
          <Avatar.Group className={styles.avatars} spacing={13}>
            {owners.slice(0, 2).map((owner) => (
              <SpotAvatar
                key={owner.username}
                src={owner.avatarUrl}
                alt={owner.name || owner.username}
                size={42}
                radius="xl"
                onClick={() => {
                  navigate(`/profile/${owner.username}`);
                }}
              >
                {(owner.name || owner.username).charAt(0).toUpperCase()}
              </SpotAvatar>
            ))}
          </Avatar.Group>
          <Stack gap={1} style={{ minWidth: 0 }}>
            <Text className={styles.ownerName} truncate>
              {ownerName}
            </Text>
            <Text className={styles.activity}>
              {isCouple ? "посетили новое место" : "посетил новое место"}
            </Text>
            <Text className={styles.date}>
              {formatRelativeTime(item.visitDate)}
            </Text>
          </Stack>
        </Group>

        <div
          className={styles.content}
          data-with-photo={showPhoto || undefined}
        >
          <Stack gap={9} className={styles.copy}>
            <Group gap={10} wrap="nowrap" align="center">
              <Box
                className={styles.markerIcon}
                style={{
                  background: `linear-gradient(135deg, ${color[0]}, ${color[1]})`,
                }}
              >
                {markersIcons[item.icon]}
              </Box>
              <Text className={styles.title}>{item.title}</Text>
            </Group>

            {item.description && (
              <Text className={styles.description}>{item.description}</Text>
            )}
          </Stack>

          {showPhoto && (
            <img
              src={item.photoURL}
              alt={item.title}
              className={styles.photo}
              onError={() => setImageFailed(true)}
            />
          )}
        </div>

        <Divider my={8} color="white" opacity={0.1} size="sm" />

        <Group justify="space-between" gap="sm" wrap="nowrap">
          <SpotButton
            kind="glass"
            size="xs"
            radius="xl"
            onClick={() => setDetailsOpened(true)}
          >
            Подробнее
          </SpotButton>

          {item.ratings.length > 0 && (
            <Stack gap={5} align="flex-end">
              {item.ratings.length > 1 && (
                <Stack gap={2} align="center">
                  <Text className={styles.ratingLabel}>Рейтинг</Text>
                  <Group gap={4} wrap="nowrap" align="center">
                    <IconStarFilled size={15} color="#facc15" />
                    <Text className={styles.rating}>
                      {formatRating(averageRating ?? 0)}
                    </Text>
                  </Group>
                </Stack>
              )}

              {item.ratings.length === 1 && (
                <Group gap={8} wrap="nowrap">
                  {item.ratings.map((rating) => {
                    const owner = getRatingOwner(rating.nickname);

                    return (
                      <Stack key={rating.nickname} gap={2} align="center">
                        <Text className={styles.ratingLabel}>
                          {isCouple
                            ? owner?.name || rating.nickname
                            : "Рейтинг"}
                        </Text>
                        <Group gap={4} wrap="nowrap" align="center">
                          {isCouple && (
                            <SpotAvatar
                              src={owner?.avatarUrl}
                              alt={owner?.name || rating.nickname}
                              size={21}
                              radius="xl"
                            >
                              {rating.nickname.charAt(0).toUpperCase()}
                            </SpotAvatar>
                          )}
                          <IconStarFilled size={14} color="#facc15" />
                          <Text className={styles.rating}>
                            {formatRating(rating.rating)}
                          </Text>
                        </Group>
                      </Stack>
                    );
                  })}
                </Group>
              )}
            </Stack>
          )}
        </Group>
      </article>

      <ViewVisitInfoDrawer
        selectedPlace={null}
        selectedVisit={
          detailsOpened
            ? {
                ...item,
                description: item.description ?? "",
                address: item.place.address ?? item.place.title,
                lat: item.place.lat,
                lng: item.place.lng,
              }
            : null
        }
        handleCloseVisitDrawer={() => setDetailsOpened(false)}
        setSelectedVisit={() => setDetailsOpened(false)}
        allowCreate={false}
        participants={owners}
      />
    </>
  );
}

export function FeedItemSkeleton() {
  return (
    <SpotSkeletonLoader radius={20} className={styles.skeleton}>
      <div className={styles.skeletonHeader}>
        <div className={styles.skeletonAvatar} />
        <div className={styles.skeletonLines}>
          <div />
          <div />
          <div />
        </div>
      </div>
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonCopy}>
          <div />
          <div />
          <div />
        </div>
        <div className={styles.skeletonPhoto} />
      </div>
      <div className={styles.skeletonFooter} />
    </SpotSkeletonLoader>
  );
}
