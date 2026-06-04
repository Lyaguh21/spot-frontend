import { selectUser } from "@/entities/user/model/userSelectors";
import { MapCreateMode, selectView, setMapCreateMode } from "@/entities/view";
import { useAppDispatch, useAppSelector } from "@/shared/lib";
import { SpotFloatingIndicator } from "@/shared/ui";
import MapContainer from "@/widgets/map-container";
import { Flex } from "@mantine/core";

export default function Map() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const viewState = useAppSelector(selectView);

  const data = [
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
          items={data}
          value={viewState.map.createMode}
          setValue={(value) =>
            dispatch(setMapCreateMode(value as MapCreateMode))
          }
          size="lg"
        />
      )}

      <MapContainer />
    </Flex>
  );
}
