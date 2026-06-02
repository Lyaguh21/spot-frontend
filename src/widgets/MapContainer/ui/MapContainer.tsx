import Map from "react-map-gl/maplibre";
import { FullScreenButton } from "./components/FullScreenButton";
import { selectView } from "@/entities/view";
import { useAppSelector } from "@/shared/lib";

export default function MapContainer() {
  const viewState = useAppSelector(selectView);

  return (
    <Map
      initialViewState={{
        longitude: 37.6176,
        latitude: 55.7558,
        zoom: 12,
      }}
      style={{
        flex: 1,
        borderRadius: viewState.ui.mapIsFullScreen ? undefined : "18px",
      }}
      attributionControl={false}
      mapStyle="https://api.maptiler.com/maps/019e87aa-d3ec-7283-92ef-32ca572234ae/style.json?key=I45PE7YnKzVVaH92vG7h"
    >
      <FullScreenButton />
    </Map>
  );
}
