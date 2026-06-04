import { IMapPlaceVisits, IMapMarker } from "@/entities/map";
import { SpotDrawer } from "@/shared/ui";
import { Stack, Group, Badge, Box, Text } from "@mantine/core";
import {
  IconChevronLeft,
  IconMapPin,
  IconCalendar,
  IconStarFilled,
  IconHeart,
} from "@tabler/icons-react";

export default function ViewVisitInfoDrawer({
  selectedPlace,
  selectedVisit,
  handleCloseVisitDrawer,
  setSelectedVisit,
}: {
  selectedPlace: IMapPlaceVisits | null;
  selectedVisit: IMapMarker | null;
  handleCloseVisitDrawer: () => void;
  setSelectedVisit: (visit: IMapMarker | null) => void;
}) {
  const drawerTitle =
    selectedVisit?.title ?? selectedPlace?.place.title ?? "Место";

  const formatVisitDate = (date: string) =>
    new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));

  return (
    <SpotDrawer
      opened={Boolean(selectedPlace || selectedVisit)}
      onClose={handleCloseVisitDrawer}
      title={drawerTitle}
    >
      {selectedVisit ? (
        <Stack gap="md">
          {selectedPlace && (
            <button
              type="button"
              onClick={() => setSelectedVisit(null)}
              style={{
                alignSelf: "flex-start",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: 0,
                color: "#b9c8ff",
                background: "transparent",
                border: 0,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <IconChevronLeft size={18} />
              Все визиты
            </button>
          )}

          <Stack gap={8}>
            <Group gap="xs">
              <IconMapPin size={18} color="#b9c8ff" />
              <Text c="#eaf1ff" fw={800} fz={22} lh={1.15}>
                {selectedVisit.title}
              </Text>
            </Group>

            <Group gap="xs">
              <IconCalendar size={17} color="#90a5df" />
              <Text c="#90a5df" fz={14}>
                {formatVisitDate(selectedVisit.visitDate)}
              </Text>
            </Group>
          </Stack>

          {selectedVisit.description && (
            <Text c="#d5defc" fz={15} lh={1.55}>
              {selectedVisit.description}
            </Text>
          )}

          {selectedVisit.ratings.length > 0 && (
            <Stack gap="xs">
              <Text c="#90a5df" fz={13} fw={800} tt="uppercase">
                Оценки
              </Text>
              {selectedVisit.ratings.map((rating) => (
                <Group key={rating.nickname} justify="space-between">
                  <Text c="#eaf1ff" fw={700}>
                    {rating.nickname}
                  </Text>
                  <Group gap={4}>
                    <IconStarFilled size={16} color="#facc15" />
                    <Text c="#f8fafc" fw={800}>
                      {rating.rating}
                    </Text>
                  </Group>
                </Group>
              ))}
            </Stack>
          )}

          <Group gap="xs">
            <Badge
              color={selectedVisit.ownerType === "COUPLE" ? "pink" : "blue"}
            >
              {selectedVisit.ownerType === "COUPLE" ? "Пара" : "Моё"}
            </Badge>
            {selectedVisit.isFavorite && (
              <Badge leftSection={<IconHeart size={12} />} color="red">
                Любимое
              </Badge>
            )}
          </Group>
        </Stack>
      ) : (
        <Stack gap="sm">
          <Text c="#90a5df" fz={14}>
            {selectedPlace?.visits.length ?? 0} визита в этом месте
          </Text>

          {selectedPlace?.visits.map((visit, index) => (
            <button
              key={`${visit.id ?? visit.visitDate}-${index}`}
              type="button"
              onClick={() => setSelectedVisit(visit)}
              style={{
                width: "100%",
                padding: "14px 16px",
                textAlign: "left",
                color: "#eaf1ff",
                background: "rgba(18, 28, 54, 0.72)",
                border: "1px solid rgba(134, 167, 255, 0.18)",
                borderRadius: 16,
                cursor: "pointer",
              }}
            >
              <Group justify="space-between" align="flex-start" gap="md">
                <Box>
                  <Text fw={800} fz={16} lh={1.2}>
                    {visit.title}
                  </Text>
                  <Text c="#90a5df" fz={13} mt={4}>
                    {formatVisitDate(visit.visitDate)}
                  </Text>
                </Box>
                <Group gap={4} style={{ flex: "0 0 auto" }}>
                  <IconStarFilled size={15} color="#facc15" />
                  <Text fw={800} fz={14}>
                    {visit.ratings[0]?.rating ?? "-"}
                  </Text>
                </Group>
              </Group>
            </button>
          ))}
        </Stack>
      )}
    </SpotDrawer>
  );
}
