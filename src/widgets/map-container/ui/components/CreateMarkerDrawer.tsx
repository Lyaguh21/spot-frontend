import { MapMarker } from "@/entities/map";
import { SpotDrawer } from "@/shared/ui";

export default function CreateMarkerDrawer({
  marker,
  opened,
  onClose,
}: {
  marker: MapMarker | null;
  opened: boolean;
  onClose: () => void;
}) {
  return (
    <SpotDrawer opened={opened} onClose={onClose}>
      {marker?.name}
    </SpotDrawer>
  );
}
