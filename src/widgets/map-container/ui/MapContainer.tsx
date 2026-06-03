import Map, { MapRef, Marker } from "react-map-gl/maplibre";
import { FullScreenButton } from "./components/FullScreenButton";
import { selectView } from "@/entities/view";
import { useAppSelector } from "@/shared/lib";
import { useRef, useState } from "react";
import CreateMarkerButton from "./components/CreateMarkerButton";
import SpotMarker from "@/shared/ui/SpotMarker";
import SpotSkeletonLoader from "@/shared/ui/SpotSkeletonLoader";
import CreateMarkerDrawer from "./components/CreateMarkerDrawer";
import { useDisclosure } from "@mantine/hooks";

export default function MapContainer() {
  const viewState = useAppSelector(selectView);
  const mapRef = useRef<MapRef>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isCreatingMarker, setIsCreatingMarker] = useState(false);
  const [
    isCreateMarkerDrawerOpen,
    { open: openCreateMarkerDrawer, close: closeCreatemarkerDrawer },
  ] = useDisclosure(false);

  const [marker, setMarker] = useState<{
    name?: string;
    longitude: number;
    latitude: number;
  } | null>(null);

  const handleSwapCrateMode = () => {
    setIsCreatingMarker((prev) => !prev);
    setMarker(null);
  };

  const handleClickOnMap = (e: any) => {
    if (!isCreatingMarker) return;
    setMarker(null); // Удаляем прошлый маркер

    //? Получаем места на которые кликнули
    const map = mapRef.current?.getMap();
    const features = map
      ?.queryRenderedFeatures(e.point)
      .find((feature) => feature.properties?.name);
    console.log("features", features);
    if (isCreatingMarker) {
      setMarker({
        name: features?.properties.name ?? undefined,
        // @ts-ignore
        longitude: features?.geometry.coordinates[0] ?? e.lngLat.lng,
        // @ts-ignore
        latitude: features?.geometry.coordinates[1] ?? e.lngLat.lat,
      });
    }
  };

  const handleCreateMarker = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    openCreateMarkerDrawer();
  };

  return (
    <>
      <CreateMarkerDrawer
        marker={marker}
        opened={isCreateMarkerDrawerOpen}
        onClose={closeCreatemarkerDrawer}
      />

      {!isLoaded && (
        <SpotSkeletonLoader
          height="100%"
          width="100%"
          flex={1}
          radius="lg"
          visible={true}
        />
      )}

      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 37.6176,
          latitude: 55.7558,
          zoom: 12,
        }}
        onLoad={() => setIsLoaded(true)}
        onClick={handleClickOnMap}
        style={{
          flex: 1,
          borderRadius: viewState.ui.mapIsFullScreen ? undefined : "18px",
          display: isLoaded ? "block" : "none",
          cursor: isCreatingMarker ? "crosshair" : "default",
        }}
        attributionControl={false}
        mapStyle="https://api.maptiler.com/maps/019e87aa-d3ec-7283-92ef-32ca572234ae/style.json?key=I45PE7YnKzVVaH92vG7h"
      >
        <FullScreenButton />
        <CreateMarkerButton
          isCreatingMarker={isCreatingMarker}
          onClick={handleSwapCrateMode}
        />

        {marker && (
          <>
            <Marker
              longitude={marker.longitude}
              latitude={marker.latitude}
              anchor="bottom"
            >
              <SpotMarker
                onCreateClick={handleCreateMarker}
                isCreating
                longitude={marker.longitude}
                latitude={marker.latitude}
              />
            </Marker>
          </>
        )}
      </Map>
    </>
  );
}
