import Map, { MapRef, Marker } from "react-map-gl/maplibre";
import { FullScreenButton } from "./components/FullScreenButton";
import { selectView } from "@/entities/view";
import { useAppSelector } from "@/shared/lib";
import { useEffect, useRef, useState } from "react";
import CreateMarkerButton from "./components/CreateMarkerButton";
import SpotMarker from "@/shared/ui/SpotMarker";
import SpotSkeletonLoader from "@/shared/ui/SpotSkeletonLoader";
import CreateMarkerDrawer from "./components/CreateMarkerDrawer";
import { useDisclosure } from "@mantine/hooks";
import { useLocation } from "react-router-dom";
import {
  IMapMarker,
  IMapPlaceVisits,
  markerColorOptions,
  markersIcons,
} from "@/entities/map/model/type";
import ViewVisitInfoDrawer from "@/widgets/visit-info-drawer";

export default function MapContainer({
  dataMarkers,
  visited = false,
}: {
  dataMarkers?: IMapPlaceVisits[];
  visited?: boolean;
}) {
  const location = useLocation();
  const viewState = useAppSelector(selectView);
  const mapRef = useRef<MapRef>(null);
  const focusVisit = (
    location.state as { focusVisit?: { lat: number; lng: number } } | null
  )?.focusVisit;

  const [isLoaded, setIsLoaded] = useState(false);
  const [isCreatingMarker, setIsCreatingMarker] = useState(false);
  const [
    isCreateMarkerDrawerOpen,
    { open: openCreateMarkerDrawer, close: closeCreateMarkerDrawer },
  ] = useDisclosure(false);

  const [marker, setMarker] = useState<{
    externalId?: string;
    title: string;
    lng: number;
    lat: number;
    description?: string;
    icon?: IMapMarker["icon"];
    color?: IMapMarker["color"];
  } | null>(null);
  const [createMarkerDraft, setCreateMarkerDraft] =
    useState<typeof marker>(null);
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

  useEffect(() => {
    if (!isLoaded || !dataMarkers?.length) {
      return;
    }

    const coordinates = dataMarkers.map(({ place }) => [place.lng, place.lat]);

    if (coordinates.length === 1) {
      mapRef.current?.flyTo({
        center: coordinates[0] as [number, number],
        zoom: 14,
        duration: 600,
      });
      return;
    }

    const lngValues = coordinates.map(([lng]) => lng);
    const latValues = coordinates.map(([, lat]) => lat);

    mapRef.current?.fitBounds(
      [
        [Math.min(...lngValues), Math.min(...latValues)],
        [Math.max(...lngValues), Math.max(...latValues)],
      ],
      { padding: 52, maxZoom: 14, duration: 600 },
    );
  }, [dataMarkers, isLoaded]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const frameId = requestAnimationFrame(() => mapRef.current?.resize());

    return () => cancelAnimationFrame(frameId);
  }, [isLoaded, viewState.ui.mapIsFullScreen]);

  useEffect(() => {
    if (!isLoaded || !focusVisit) {
      return;
    }

    mapRef.current?.flyTo({
      center: [focusVisit.lng, focusVisit.lat],
      zoom: 17,
      duration: 850,
      essential: true,
    });
  }, [focusVisit, isLoaded, location.key]);

  const handleSwapCrateMode = () => {
    if (visited) return;
    setIsCreatingMarker((prev) => !prev);
    setMarker(null);
  };

  const handleClickOnMap = (e: any) => {
    if (visited || !isCreatingMarker) return;
    setMarker(null); // Удаляем прошлый маркер

    //? Получаем места на которые кликнули
    const map = mapRef.current?.getMap();
    const features = map
      ?.queryRenderedFeatures(e.point)
      .find((feature) => feature.properties?.name);

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
    setCreateMarkerDraft(marker);
    openCreateMarkerDrawer();
  };

  const handleMarkerCreated = () => {
    setIsCreatingMarker(false);
    setMarker(null);
    setCreateMarkerDraft(null);
  };

  const handleCloseCreateMarkerDrawer = () => {
    setCreateMarkerDraft(null);
    closeCreateMarkerDrawer();
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

    mapRef.current?.flyTo({
      center: [placeVisits.place.lng, placeVisits.place.lat],
      zoom: 17,
      duration: 850,
      essential: true,
    });

    setSelectedPlace({ ...placeVisits, visits });
    setSelectedVisit(visits.length === 1 ? visits[0] : null);
  };

  const handleCreateVisitAtPlace = (placeVisits: IMapPlaceVisits) => {
    const primaryVisit = getPrimaryVisit(placeVisits);

    setCreateMarkerDraft({
      externalId: primaryVisit?.externalId,
      title: placeVisits.place.title,
      lat: placeVisits.place.lat,
      lng: placeVisits.place.lng,
      icon: primaryVisit?.icon,
      color: primaryVisit?.color,
    });
    handleCloseVisitDrawer();
    openCreateMarkerDrawer();
  };

  const handleVisitDeleted = (visitId: string) => {
    setSelectedPlace((currentPlace) => {
      if (!currentPlace) {
        return currentPlace;
      }

      const visits = currentPlace.visits.filter(
        (visit) => visit.id !== visitId,
      );

      return visits.length ? { ...currentPlace, visits } : null;
    });
    setSelectedVisit(null);
  };

  const handleVisitUpdated = (updatedVisit: IMapMarker) => {
    setSelectedPlace((currentPlace) => {
      if (!currentPlace || !updatedVisit.id) {
        return currentPlace;
      }

      return {
        ...currentPlace,
        visits: currentPlace.visits.map((visit) =>
          visit.id === updatedVisit.id ? updatedVisit : visit,
        ),
      };
    });
    setSelectedVisit(updatedVisit);
  };

  return (
    <>
      {!visited && (
        <CreateMarkerDrawer
          marker={createMarkerDraft}
          opened={isCreateMarkerDrawerOpen}
          onClose={handleCloseCreateMarkerDrawer}
          onCreated={handleMarkerCreated}
        />
      )}

      <ViewVisitInfoDrawer
        selectedPlace={selectedPlace}
        selectedVisit={selectedVisit}
        handleCloseVisitDrawer={handleCloseVisitDrawer}
        setSelectedVisit={setSelectedVisit}
        onCreateVisit={handleCreateVisitAtPlace}
        onVisitDeleted={handleVisitDeleted}
        onVisitUpdated={handleVisitUpdated}
        allowCreate={!visited}
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
          longitude: 37.6174,
          latitude: 55.7505,
          zoom: 12,
        }}
        onLoad={() => setIsLoaded(true)}
        onClick={handleClickOnMap}
        style={{
          width: viewState.ui.mapIsFullScreen ? "100vw" : "100%",
          height: viewState.ui.mapIsFullScreen ? "100dvh" : "100%",
          flex: 1,
          position: viewState.ui.mapIsFullScreen ? "fixed" : "relative",
          inset: viewState.ui.mapIsFullScreen ? 0 : undefined,
          zIndex: viewState.ui.mapIsFullScreen ? 100 : undefined,
          borderRadius: viewState.ui.mapIsFullScreen ? undefined : "18px",
          display: isLoaded ? "block" : "none",
          cursor: isCreatingMarker ? "crosshair" : "default",
        }}
        attributionControl={false}
        mapStyle="https://api.maptiler.com/maps/019e87aa-d3ec-7283-92ef-32ca572234ae/style.json?key=I45PE7YnKzVVaH92vG7h"
      >
        <FullScreenButton />
        {!visited && (
          <CreateMarkerButton
            isCreatingMarker={isCreatingMarker}
            onClick={handleSwapCrateMode}
          />
        )}

        {!visited && marker && (
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
