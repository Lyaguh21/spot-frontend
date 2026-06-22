import { IMapMarker, IMapPlaceVisits } from "@/entities/map";
import { SpotGlassCard } from "@/shared/ui";
import { Box, Group, Stack, Text } from "@mantine/core";
import { IconStarFilled } from "@tabler/icons-react";
import {
  formatRating,
  formatVisitDate,
  getAverageRating,
} from "../model/visitInfoHelpers";

type VisitSelectionPageProps = {
  selectedPlace: IMapPlaceVisits;
  onSelectVisit: (visit: IMapMarker) => void;
};

export function VisitSelectionPage({
  selectedPlace,
  onSelectVisit,
}: VisitSelectionPageProps) {
  return (
    <Stack gap="sm">
      <Group justify="space-between" align="center">
        <Text c="#90a5df" fz={14}>
          {selectedPlace.visits.length} визита в этом месте
        </Text>
      </Group>

      {selectedPlace.visits.map((visit, index) => {
        const averageRating = getAverageRating(visit.ratings);

        return (
          <SpotGlassCard
            key={`${visit.id ?? visit.title ?? visit.visitDate}-${index}`}
            isButton
            role="button"
            tabIndex={0}
            onClick={() => onSelectVisit(visit)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelectVisit(visit);
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
                    {averageRating === null ? "-" : formatRating(averageRating)}
                  </Text>
                </Group>
              </Stack>
            </Group>
          </SpotGlassCard>
        );
      })}
    </Stack>
  );
}
