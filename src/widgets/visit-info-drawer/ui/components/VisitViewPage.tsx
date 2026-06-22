import { IMapMarker, IMapPlaceVisits } from "@/entities/map";
import {
  SpotActionIcon,
  SpotAvatar,
  SpotGlassCard,
  SpotPhotoViewer,
} from "@/shared/ui";
import { Badge, Group, Rating, SimpleGrid, Stack, Text } from "@mantine/core";
import {
  IconCalendarEvent,
  IconHeart,
  IconMap,
  IconMapPin,
  IconStarFilled,
  IconTag,
} from "@tabler/icons-react";
import styles from "../ViewVisitInfoDrawer.module.css";
import {
  formatRating,
  formatVisitDate,
  getAverageRating,
} from "../model/visitInfoHelpers";
import { VisitRatingParticipant } from "../model/types";
import { getVisitAuthors } from "@/widgets/visit-card";
import { VisitAuthorRow } from "./VisitAuthorRow";

type CurrentUser = {
  username?: string;
  name?: string;
  avatarUrl?: string;
  partner?: VisitRatingParticipant | null;
};

type VisitViewPageProps = {
  selectedPlace: IMapPlaceVisits | null;
  selectedVisit: IMapMarker;
  participants: VisitRatingParticipant[];
  currentUser: CurrentUser;
  isCoupleMode: boolean;
  visitCoordinates?: { lat: number; lng: number };
  onShowVisitOnMap: () => void;
};

const isRatingParticipant = (
  participant: VisitRatingParticipant | undefined | null,
): participant is VisitRatingParticipant => Boolean(participant?.username);

export function VisitViewPage({
  selectedPlace,
  selectedVisit,
  participants,
  currentUser,
  isCoupleMode,
  visitCoordinates,
  onShowVisitOnMap,
}: VisitViewPageProps) {
  const authors = getVisitAuthors(selectedVisit);
  const authorCoupleId = selectedVisit.couple?.id ?? selectedVisit.coupleId;
  const ratingParticipants = [...participants, ...authors]
    .filter(isRatingParticipant)
    .filter(
      (participant, index, list) =>
        list.findIndex((item) => item.username === participant.username) ===
        index,
    );

  const getParticipant = (nickname: string) => {
    const suppliedParticipant = ratingParticipants.find(
      (participant) => participant.username === nickname,
    );

    if (suppliedParticipant) {
      return suppliedParticipant;
    }

    if (currentUser.username === nickname) {
      return currentUser;
    }

    if (currentUser.partner?.username === nickname) {
      return currentUser.partner;
    }

    return null;
  };

  return (
    <Stack gap="md">
      <VisitAuthorRow authors={authors} coupleId={authorCoupleId} />
      {selectedVisit.photos?.length ? (
        <SpotPhotoViewer
          photos={selectedVisit.photos}
          alt={selectedVisit.title}
        />
      ) : null}
      <Stack gap={8}>
        <Group
          justify="space-between"
          gap="xs"
          align="flex-start"
          wrap="nowrap"
        >
          <Text c="#eaf1ff" fw={800} fz={32} lh={1.15}>
            {selectedVisit.title}
          </Text>

          {visitCoordinates && (
            <SpotActionIcon
              type="button"
              aria-label="Показать место на карте друзей"
              title="Показать на карте"
              onClick={onShowVisitOnMap}
            >
              <IconMap size={27} stroke={2.4} />
            </SpotActionIcon>
          )}
        </Group>

        <Group gap="xs" align="end">
          <IconTag size={18} color="#90a5df" />
          <Badge color={selectedVisit.status === "PLANNED" ? "blue" : "green"}>
            {selectedVisit.status === "PLANNED"
              ? "В планах"
              : isCoupleMode
                ? "Посетили"
                : "Посетил(а)"}
          </Badge>
          {selectedVisit.isFavorite && <Badge c="pink">Любимое</Badge>}
        </Group>
        <Group gap="xs" align="end">
          <IconCalendarEvent size={18} color="#90a5df" />
          <Text c="#90a5df" fz={16} lh={0.9}>
            {formatVisitDate(selectedVisit.visitDate)}
          </Text>
        </Group>

        {(selectedVisit.address || selectedPlace?.place.address) && (
          <Group gap="xs" align="end" wrap="nowrap">
            <IconMapPin size={18} color="#b9c8ff" />
            <Text c="#90a5df" fz={16} lh={0.9}>
              {selectedVisit.address ?? selectedPlace?.place.address}
            </Text>
          </Group>
        )}
      </Stack>
      {selectedVisit.description && (
        <Stack gap={0}>
          <Text c="#90a5df" fz={13} fw={800} tt="uppercase">
            Описание
          </Text>
          <Text c="#d5defc" fz={15} lh={1} className={styles.description}>
            {selectedVisit.description}
          </Text>
        </Stack>
      )}
      {selectedVisit.ratings.length > 0 && (
        <Stack gap={4}>
          <Text c="#90a5df" fz={13} fw={800} tt="uppercase">
            Рейтинг
          </Text>
          <Stack gap="8">
            {selectedVisit.ratings.length > 1 && (
              <SpotGlassCard p={16}>
                <Group justify="space-between" align="center">
                  <Stack gap={1}>
                    <Text c="#8ea2d4" size="xs" fw={800} tt="uppercase">
                      Общий рейтинг пары
                    </Text>
                    <Text c="#eaf1ff" size="sm">
                      Среднее двух оценок
                    </Text>
                  </Stack>
                  <Group gap={6}>
                    <IconStarFilled size={22} color="#facc15" />
                    <Text c="#f8fafc" fw={900} fz={24}>
                      {formatRating(
                        getAverageRating(selectedVisit.ratings) ?? 0,
                      )}
                    </Text>
                  </Group>
                </Group>
              </SpotGlassCard>
            )}

            <SimpleGrid
              cols={selectedVisit.ratings.length === 1 ? 1 : 2}
              spacing={8}
            >
              {selectedVisit.ratings.map((rating) => {
                const participant = getParticipant(rating.nickname);

                return (
                  <SpotGlassCard key={rating.nickname} p={10}>
                    <Stack gap={8} align="center">
                      <Group w="100%" gap={7} wrap="nowrap">
                        <SpotAvatar
                          size={34}
                          radius="xl"
                          src={participant?.avatarUrl}
                          alt={rating.nickname}
                        >
                          {rating.nickname.charAt(0).toUpperCase()}
                        </SpotAvatar>
                        <Stack gap={0} style={{ minWidth: 0 }}>
                          <Text c="#eaf1ff" fz={12} fw={700} truncate>
                            {participant?.name ?? rating.nickname}
                          </Text>
                          <Text c="#8ea2d4" fz={10} truncate>
                            @{rating.nickname}
                          </Text>
                        </Stack>
                      </Group>
                      <Rating
                        color="#facc15"
                        size="md"
                        fractions={4}
                        value={rating.rating}
                        readOnly
                      />
                      <Text c="#f8fafc" fw={900} fz={16}>
                        {formatRating(rating.rating)}
                      </Text>
                    </Stack>
                  </SpotGlassCard>
                );
              })}
            </SimpleGrid>
          </Stack>
        </Stack>
      )}
      <Group gap="xs">
        {selectedVisit.isFavorite && (
          <Badge leftSection={<IconHeart size={12} />} color="red">
            Любимое
          </Badge>
        )}
      </Group>
    </Stack>
  );
}
