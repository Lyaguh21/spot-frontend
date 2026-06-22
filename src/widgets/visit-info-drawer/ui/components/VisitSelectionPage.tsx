import { IMapMarker, IMapPlaceVisits } from "@/entities/map";
import VisitCard, { getVisitCardOwners } from "@/widgets/visit-card";
import { Group, Stack, Text } from "@mantine/core";

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
        const owners = getVisitCardOwners(visit);

        return (
          <VisitCard
            key={`${visit.id ?? visit.title ?? visit.visitDate}-${index}`}
            visit={visit}
            owners={owners}
            onClick={() => onSelectVisit(visit)}
            onAction={() => onSelectVisit(visit)}
          />
        );
      })}
    </Stack>
  );
}
