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
import {
  IMapMarker,
  IMapPlaceVisits,
  markerColorOptions,
  markersIcons,
} from "@/entities/map/model/type";
import ViewVisitInfoDrawer from "./components/ViewVisitInfoDrawer";

export default function MapContainer({
  dataMarkers,
}: {
  dataMarkers?: IMapPlaceVisits[];
}) {
  const viewState = useAppSelector(selectView);
  const mapRef = useRef<MapRef>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isCreatingMarker, setIsCreatingMarker] = useState(false);
  const [
    isCreateMarkerDrawerOpen,
    { open: openCreateMarkerDrawer, close: closeCreatemarkerDrawer },
  ] = useDisclosure(false);

  const [marker, setMarker] = useState<{
    externalId?: string;
    title: string;
    lng: number;
    lat: number;
  } | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<IMapPlaceVisits | null>(
    null,
  );
  const [selectedVisit, setSelectedVisit] = useState<IMapMarker | null>(null);

  const getSortedVisits = (visits: IMapMarker[]) =>
    [...visits].sort(
      (left, right) =>
        new Date(right.visitDate).getTime() -
        new Date(left.visitDate).getTime(),
    );

  const getPrimaryVisit = (placeVisits: IMapPlaceVisits) =>
    getSortedVisits(placeVisits.visits)[0];

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
        externalId: features?.id ? String(features.id) : undefined,
        title: features?.properties.name ?? "",
        // @ts-ignore
        lng: features?.geometry.coordinates[0] ?? e.lngLat.lng,
        // @ts-ignore
        lat: features?.geometry.coordinates[1] ?? e.lngLat.lat,
      });
    }
  };

  const handleCreateMarker = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    openCreateMarkerDrawer();
  };

  const handleMarkerCreated = () => {
    setIsCreatingMarker(false);
    setMarker(null);
  };

  const handleCloseVisitDrawer = () => {
    setSelectedPlace(null);
    setSelectedVisit(null);
  };

  const handleExistingMarkerClick = (
    e: React.MouseEvent<HTMLDivElement>,
    placeVisits: IMapPlaceVisits,
  ) => {
    e.stopPropagation();

    const visits = getSortedVisits(placeVisits.visits);

    if (visits.length === 1) {
      setSelectedVisit(visits[0]);
      setSelectedPlace(null);
      return;
    }

    setSelectedPlace({ ...placeVisits, visits });
    setSelectedVisit(null);
  };

  return (
    <>
      <CreateMarkerDrawer
        marker={marker}
        opened={isCreateMarkerDrawerOpen}
        onClose={closeCreatemarkerDrawer}
        onCreated={handleMarkerCreated}
      />

      <ViewVisitInfoDrawer
        selectedPlace={selectedPlace}
        selectedVisit={selectedVisit}
        handleCloseVisitDrawer={handleCloseVisitDrawer}
        setSelectedVisit={setSelectedVisit}
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
              longitude={marker.lng}
              latitude={marker.lat}
              anchor="bottom"
            >
              <SpotMarker
                onChildrenClick={handleCreateMarker}
                isCreating
                lng={marker.lng}
                lat={marker.lat}
              />
            </Marker>
          </>
        )}

        {dataMarkers?.map((placeVisits, index) => {
          const primaryVisit = getPrimaryVisit(placeVisits);

          if (!primaryVisit) {
            return null;
          }

          const markerInfo = {
            ...primaryVisit,
            title: placeVisits.place.title,
            lat: placeVisits.place.lat,
            lng: placeVisits.place.lng,
          };

          return (
            <Marker
              key={`${placeVisits.place.lat}-${placeVisits.place.lng}-${placeVisits.place.title}-${index}`}
              longitude={placeVisits.place.lng}
              latitude={placeVisits.place.lat}
              anchor="bottom"
            >
              <SpotMarker
                markerInfo={markerInfo}
                lng={placeVisits.place.lng}
                lat={placeVisits.place.lat}
                icon={markersIcons[primaryVisit.icon]}
                colors={
                  markerColorOptions.find(
                    (opt) => opt.key === primaryVisit.color,
                  )?.colors
                }
                visitCount={placeVisits.visits.length}
                onClick={(e) => handleExistingMarkerClick(e, placeVisits)}
              />
            </Marker>
          );
        })}
      </Map>
    </>
  );
}
