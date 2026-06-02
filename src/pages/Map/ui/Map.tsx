import { selectUser } from "@/entities/user/model/userSelectors";
import { selectView } from "@/entities/view";
import { useAppSelector } from "@/shared/lib";
import { SpotFloatingIndicator } from "@/shared/ui";
import MapContainer from "@/widgets/map-container";
import { Flex } from "@mantine/core";
import { useState } from "react";

export default function Map() {
  const user = useAppSelector(selectUser);
  const viewState = useAppSelector(selectView);

  const [value, setValue] = useState("my");

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
          value={value}
          setValue={setValue}
          size="lg"
        />
      )}

      <MapContainer />
    </Flex>
  );
}
