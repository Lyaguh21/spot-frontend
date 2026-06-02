import { selectView, setMapIsFullScreen } from "@/entities/view";
import { useAppDispatch, useAppSelector } from "@/shared/lib";
import { SpotActionIcon } from "@/shared/ui";

import { IconMaximize, IconMinimize } from "@tabler/icons-react";

export function FullScreenButton() {
  const dispatch = useAppDispatch();
  const viewState = useAppSelector(selectView);

  const toggleFullscreen = () => {
    dispatch(setMapIsFullScreen(!viewState.ui.mapIsFullScreen));
  };

  return (
    <SpotActionIcon
      onClick={toggleFullscreen}
      size={"xl"}
      radius="xl"
      variant="transparent"
      style={{ position: "absolute", top: 12, right: 12, zIndex: 1 }}
    >
      {viewState.ui.mapIsFullScreen ? (
        <IconMinimize size={24} />
      ) : (
        <IconMaximize size={24} />
      )}
    </SpotActionIcon>
  );
}
