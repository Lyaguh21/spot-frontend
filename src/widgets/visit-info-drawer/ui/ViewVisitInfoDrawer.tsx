import { IMapPlaceVisits, IMapMarker } from "@/entities/map";
import { selectUser } from "@/entities/user";
import { selectView, setMapCreateMode } from "@/entities/view";
import { useAppDispatch, useAppSelector } from "@/shared/lib";
import {
  SpotActionIcon,
  SpotAvatar,
  SpotDrawer,
  SpotGlassCard,
  SpotPhotoViewer,
} from "@/shared/ui";
import {
  Badge,
  Box,
  Group,
  Rating,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconCalendar,
  IconHeart,
  IconMap,
  IconMapPin,
  IconPlus,
  IconStarFilled,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import styles from "./ViewVisitInfoDrawer.module.css";

export type VisitRatingParticipant = {
  username: string;
  name?: string;
  avatarUrl?: string;
};

const getAverageRating = (ratings: IMapMarker["ratings"]) => {
  if (!ratings.length) {
    return null;
  }

  return (
    ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
  );
};

const formatRating = (rating: number) =>
  Number.isInteger(rating) ? String(rating) : rating.toFixed(2);

export default function ViewVisitInfoDrawer({
  selectedPlace,
  selectedVisit,
  handleCloseVisitDrawer,
  setSelectedVisit,
  onCreateVisit,
  allowCreate = true,
  participants = [],
}: {
  selectedPlace: IMapPlaceVisits | null;
  selectedVisit: IMapMarker | null;
  handleCloseVisitDrawer: () => void;
  setSelectedVisit: (visit: IMapMarker | null) => void;
  onCreateVisit?: (place: IMapPlaceVisits) => void;
  allowCreate?: boolean;
  participants?: VisitRatingParticipant[];
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const viewState = useAppSelector(selectView);
  const canCreateVisit =
    allowCreate &&
    (viewState.map.createMode === "my" ||
      (viewState.map.createMode === "couple" &&
        Boolean(user.coupleId) &&
        Boolean(
          selectedPlace?.visits.some(
            (visit) =>
              visit.ownerType === "COUPLE" &&
              (!visit.coupleId || visit.coupleId === String(user.coupleId)),
          ),
        )));

  const formatVisitDate = (date: string) =>
    new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));

  const getParticipant = (nickname: string) => {
    const suppliedParticipant = participants.find(
      (participant) => participant.username === nickname,
    );

    if (suppliedParticipant) {
      return suppliedParticipant;
    }

    if (user.username === nickname) {
      return user;
    }

    if (user.partner?.username === nickname) {
      return user.partner;
    }

    return null;
  };

  const visitCoordinates =
    selectedVisit?.lat !== undefined && selectedVisit.lng !== undefined
      ? { lat: selectedVisit.lat, lng: selectedVisit.lng }
      : selectedPlace?.place;

  const handleShowVisitOnMap = () => {
    if (!visitCoordinates) {
      return;
    }

    dispatch(setMapCreateMode("friends"));
    navigate("/map", {
      state: {
        focusVisit: visitCoordinates,
      },
    });
    handleCloseVisitDrawer();
  };

  const createVisitButton =
    selectedPlace && canCreateVisit && onCreateVisit ? (
      <SpotActionIcon
        type="button"
        size={32}
        aria-label="Добавить новый визит в это место"
        title="Добавить новый визит"
        onClick={() => onCreateVisit(selectedPlace)}
      >
        <IconPlus size={22} />
      </SpotActionIcon>
    ) : null;

  return (
    <SpotDrawer
      opened={Boolean(selectedPlace || selectedVisit)}
      onClose={handleCloseVisitDrawer}
      // title={drawerTitle}
    >
      {selectedVisit ? (
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Text c="#90a5df" fz={16}>
              Добавить посещение в этом месте
            </Text>
            {createVisitButton}
          </Group>
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
                  onClick={handleShowVisitOnMap}
                >
                  <IconMap size={27} stroke={2.4} />
                </SpotActionIcon>
              )}
            </Group>

            <Group gap="xs" align="end">
              <IconCalendar size={18} color="#90a5df" />
              <Text c="#90a5df" fz={16} lh={0.9}>
                {formatVisitDate(selectedVisit.visitDate)}
              </Text>
            </Group>

            {selectedPlace?.place.address && (
              <Group gap="xs" align="end" wrap="nowrap">
                <IconMapPin size={18} color="#b9c8ff" />
                <Text c="#90a5df" fz={16} lh={0.9}>
                  {selectedPlace?.place.address}
                </Text>
              </Group>
            )}
          </Stack>

          {selectedVisit.description && (
            <Stack gap={2}>
              <Text c="#90a5df" fz={13} fw={800} tt="uppercase">
                Описание
              </Text>
              <Text
                c="#d5defc"
                fz={15}
                lh={1.55}
                className={styles.description}
              >
                {selectedVisit.description}
              </Text>
            </Stack>
          )}

          <Stack gap={2}>
            <Text c="#90a5df" fz={13} fw={800} tt="uppercase">
              Описание
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

              {selectedVisit.ratings.length && (
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
              )}
            </Stack>
          </Stack>

          <Group gap="xs">
            {selectedVisit.isFavorite && (
              <Badge leftSection={<IconHeart size={12} />} color="red">
                Любимое
              </Badge>
            )}
          </Group>
        </Stack>
      ) : (
        <Stack gap="sm">
          {}
          <Group justify="space-between" align="center">
            <Text c="#90a5df" fz={14}>
              {selectedPlace?.visits.length ?? 0} визита в этом месте
            </Text>
            {createVisitButton}
          </Group>

          {selectedPlace?.visits.map((visit, index) => {
            const averageRating = getAverageRating(visit.ratings);

            return (
              <SpotGlassCard
                key={`${visit.title ?? visit.visitDate}-${index}`}
                isButton
                role="button"
                tabIndex={0}
                onClick={() => setSelectedVisit(visit)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedVisit(visit);
                  }
                }}
                p="14px 16px"
                style={{
                  width: "100%",
                  textAlign: "left",
                  color: "#eaf1ff",
                }}
              >
                <Group
                  justify="space-between"
                  wrap="nowrap"
                  align="flex-start"
                  gap="md"
                >
                  <Box>
                    <Text fw={800} fz={16} lh={1.2}>
                      {visit.title}
                    </Text>
                    <Text c="#90a5df" fz={13} mt={4}>
                      {formatVisitDate(visit.visitDate)}
                    </Text>
                  </Box>
                  <Stack gap={1} align="flex-end" style={{ flex: "0 0 auto" }}>
                    {visit.ratings.length > 1 && (
                      <Text c="#8ea2d4" fz={10} fw={800} tt="uppercase">
                        Общий
                      </Text>
                    )}
                    <Group gap={4}>
                      <IconStarFilled size={15} color="#facc15" />
                      <Text fw={800} fz={14}>
                        {averageRating === null
                          ? "-"
                          : formatRating(averageRating)}
                      </Text>
                    </Group>
                  </Stack>
                </Group>
              </SpotGlassCard>
            );
          })}
        </Stack>
      )}
    </SpotDrawer>
  );
}
