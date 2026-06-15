import {
  useGetVisitsByCoupleIdQuery,
  useGetVisitsByUsernameQuery,
} from "@/entities/map";
import { selectUser } from "@/entities/user";
import { MapCreateMode, selectView, setMapCreateMode } from "@/entities/view";
import { useAppDispatch, useAppSelector } from "@/shared/lib";
import { SpotFloatingIndicator } from "@/shared/ui";
import MapContainer from "@/widgets/map-container";
import { Flex } from "@mantine/core";

export default function Map() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const viewState = useAppSelector(selectView);

  const { data: userMarkers } = useGetVisitsByUsernameQuery(
    { username: user.username },
    { skip: !user.username || viewState.map.createMode !== "my" },
  );

  const { data: coupleMarkers } = useGetVisitsByCoupleIdQuery(
    { coupleId: String(user.coupleId) },
    { skip: !user.coupleId || viewState.map.createMode !== "couple" },
  );

  const markers =
    viewState.map.createMode === "couple" ? coupleMarkers : userMarkers;

  const navigationItems = [
    { label: "Своя", value: "my" },
    { label: "Пара", value: "couple", disabled: !user.partner },
    { label: "Друзья", value: "friends" },
  ];

  return (
    <Flex
      direction="column"
      h={viewState.ui.mapIsFullScreen ? "100dvh" : "calc(100dvh - 80px)"}
      gap="md"
      p={viewState.ui.mapIsFullScreen ? 0 : "md"}
      style={{ transition: "all 0.4s ease-in-out" }}
    >
      {!viewState.ui.mapIsFullScreen && (
        <SpotFloatingIndicator
          items={navigationItems}
          value={viewState.map.createMode}
          setValue={(value) =>
            dispatch(setMapCreateMode(value as MapCreateMode))
          }
          size="lg"
        />
      )}

      <MapContainer
        visited={viewState.map.createMode === "friends" ? true : false}
        dataMarkers={markers}
      />
    </Flex>
  );
}
