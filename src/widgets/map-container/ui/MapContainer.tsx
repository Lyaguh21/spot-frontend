import Map, { Marker } from "react-map-gl/maplibre";
import { FullScreenButton } from "./components/FullScreenButton";
import { selectView } from "@/entities/view";
import { useAppSelector } from "@/shared/lib";
import { useState } from "react";
import { Skeleton } from "@mantine/core";
import CreateMarkerButton from "./components/CreateMarkerButton";
import { IconBurger } from "@tabler/icons-react";
import SpotMarker from "@/shared/ui/SpotMarker";
import { markersColors } from "@/entities/map";

export default function MapContainer() {
  const viewState = useAppSelector(selectView);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCreatingMarker, setIsCreatingMarker] = useState(false);

  const handleClickOnMap = (e: any) => {
    if (!isCreatingMarker) return;

    if (isCreatingMarker) {
      console.log("Clicked at:", e.lngLat);
    }
  };

  return (
    <>
      {!isLoaded && (
        <Skeleton
          height="100%"
          width="100%"
          flex={1}
          radius="lg"
          visible={!isLoaded}
        />
      )}

      <Map
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
        }}
        attributionControl={false}
        mapStyle="https://api.maptiler.com/maps/019e87aa-d3ec-7283-92ef-32ca572234ae/style.json?key=I45PE7YnKzVVaH92vG7h"
      >
        <FullScreenButton />
        <CreateMarkerButton
          isCreatingMarker={isCreatingMarker}
          onClick={() => setIsCreatingMarker((prev) => !prev)}
        />

        <Marker longitude={37.6176} latitude={55.7558} anchor="bottom">
          <SpotMarker
            colors={markersColors.violet}
            icon={<IconBurger color="white" size={28} />}
          />
        </Marker>

        <Marker longitude={40.6176} latitude={55.7558} anchor="bottom">
          <SpotMarker
            colors={markersColors.orange}
            icon={<IconBurger color="white" size={28} />}
          />
        </Marker>

        <Marker longitude={45.6176} latitude={55.7558} anchor="bottom">
          <SpotMarker
            colors={markersColors.green}
            icon={<IconBurger color="white" size={28} />}
          />
        </Marker>

        <Marker longitude={50.6176} latitude={55.7558} anchor="bottom">
          <SpotMarker
            colors={markersColors.red}
            icon={<IconBurger color="white" size={28} />}
          />
        </Marker>

        <Marker longitude={55.6176} latitude={55.7558} anchor="bottom">
          <SpotMarker
            colors={markersColors.neon}
            icon={<IconBurger color="white" size={28} />}
          />
        </Marker>
      </Map>
    </>
  );
}
