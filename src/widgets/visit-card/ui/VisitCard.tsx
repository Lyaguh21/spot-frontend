import {
  IMapMarker,
  IVisitAuthor,
  markersColors,
  markersIcons,
} from "@/entities/map";
import { formatRelativeTime } from "@/shared/lib";
import { SpotAvatar, SpotButton } from "@/shared/ui";
import { Avatar, Box, Divider, Group, Stack, Text } from "@mantine/core";
import { IconStarFilled } from "@tabler/icons-react";
import { KeyboardEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./VisitCard.module.css";

type VisitCardVisit = Omit<
  Pick<
    IMapMarker,
    | "title"
    | "status"
    | "description"
    | "photos"
    | "color"
    | "icon"
    | "ratings"
    | "ownerType"
    | "visitDate"
  >,
  "description"
> & {
  description?: string | null;
};

type VisitCardProps = {
  visit: VisitCardVisit;
  owners: IVisitAuthor[];
  ownerName?: string;
  actionLabel?: string;
  onAction?: () => void;
  onClick?: () => void;
};

const formatRating = (rating: number) =>
  Number.isInteger(rating) ? String(rating) : rating.toFixed(1);

export const getVisitActivityText = (
  status: "PLANNED" | "VISITED",
  isCouple: boolean,
) => {
  if (status === "PLANNED") {
    return isCouple
      ? "Запланировали посетить новое место"
      : "Запланировал посетить новое место";
  }

  return isCouple ? "Посетили новое место" : "Посетил(а) новое место";
};

export default function VisitCard({
  visit,
  owners,
  ownerName,
  actionLabel = "Подробнее",
  onAction,
  onClick,
}: VisitCardProps) {
  const navigate = useNavigate();
  const [imageFailed, setImageFailed] = useState(false);
  const isCouple = visit.ownerType === "COUPLE" || owners.length > 1;
  const displayOwners = owners.length
    ? owners
    : [{ username: "", name: "Пользователь" }];
  const resolvedOwnerName =
    ownerName ||
    displayOwners.map(({ name, username }) => name || username).join(" и ") ||
    "Пользователь";
  const previewPhoto = visit.photos?.[0];
  const showPhoto = Boolean(previewPhoto) && !imageFailed;
  const color = markersColors[visit.color] ?? ["#7b2cff", "#22b5ff"];
  const averageRating =
    visit.ratings.length > 0
      ? visit.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
        visit.ratings.length
      : null;

  const getRatingOwner = (nickname: string) =>
    owners.find((owner) => owner.username === nickname);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!onClick) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <article
      className={styles.card}
      data-clickable={onClick ? true : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <Group gap={10} wrap="nowrap" align="center">
        <Avatar.Group className={styles.avatars} spacing={13}>
          {displayOwners.slice(0, 2).map((owner, index) => {
            const displayName = owner.username || owner.name || "Пользователь";

            return (
              <SpotAvatar
                key={owner.username || `${displayName}-${index}`}
                className={owner.username ? styles.avatar : undefined}
                src={owner.avatarUrl}
                alt={displayName}
                size={42}
                radius="xl"
                onClick={(event) => {
                  event.stopPropagation();

                  if (owner.username) {
                    navigate(`/profile/${owner.username}`);
                  }
                }}
              >
                {displayName.charAt(0).toUpperCase()}
              </SpotAvatar>
            );
          })}
        </Avatar.Group>
        <Stack gap={1} style={{ minWidth: 0 }}>
          <Text className={styles.ownerName} truncate>
            {resolvedOwnerName}
          </Text>
          <Text className={styles.activity}>
            {getVisitActivityText(visit.status, isCouple)}
          </Text>
          <Text className={styles.date}>
            {formatRelativeTime(visit.visitDate)}
          </Text>
        </Stack>
      </Group>

      <div className={styles.content} data-with-photo={showPhoto || undefined}>
        <Stack gap={9} className={styles.copy}>
          <Group gap={10} wrap="nowrap" align="center">
            <Box
              className={styles.markerIcon}
              style={{
                background: `linear-gradient(135deg, ${color[0]}, ${color[1]})`,
              }}
            >
              {markersIcons[visit.icon]}
            </Box>
            <Text className={styles.title}>{visit.title}</Text>
          </Group>

          {visit.description && (
            <Text className={styles.description}>{visit.description}</Text>
          )}
        </Stack>

        {showPhoto && (
          <img
            src={previewPhoto}
            alt={visit.title}
            className={styles.photo}
            onError={() => setImageFailed(true)}
          />
        )}
      </div>

      <Divider my={8} color="white" opacity={0.1} size="sm" />

      <Group justify="space-between" gap="sm" wrap="nowrap">
        {onAction ? (
          <SpotButton
            kind="glass"
            size="xs"
            radius="xl"
            onClick={(event) => {
              event.stopPropagation();
              onAction();
            }}
          >
            {actionLabel}
          </SpotButton>
        ) : (
          <span />
        )}

        {visit.ratings.length > 0 && (
          <Stack gap={5} align="flex-end">
            {visit.ratings.length > 1 && (
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

            {visit.ratings.length === 1 && (
              <Group gap={8} wrap="nowrap">
                {visit.ratings.map((rating) => {
                  const owner = getRatingOwner(rating.nickname);

                  return (
                    <Stack key={rating.nickname} gap={2} align="center">
                      <Text className={styles.ratingLabel}>
                        {isCouple ? owner?.name || rating.nickname : "Рейтинг"}
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
  );
}
