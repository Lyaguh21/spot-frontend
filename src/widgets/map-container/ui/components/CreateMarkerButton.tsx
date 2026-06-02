import { SpotActionIcon } from "@/shared/ui";
import { useMantineTheme } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

export default function CreateMarkerButton({
  isCreatingMarker,
  onClick,
}: {
  isCreatingMarker: boolean;
  onClick: () => void;
}) {
  const theme = useMantineTheme();

  return (
    <SpotActionIcon
      onClick={onClick}
      pos="absolute"
      bottom={20}
      right={20}
      size={72}
      radius={99}
      variant="transparent"
      style={{
        border: `2px solid ${isCreatingMarker ? theme.colors.red[6] : "#793aec"}`,
        boxShadow: isCreatingMarker
          ? "0 16px 32px var(--mantine-color-red-6)"
          : "0 16px 32px #793aec90",
      }}
    >
      <IconPlus
        size={40}
        color={isCreatingMarker ? theme.colors.red[6] : "#793aec"}
        style={{
          rotate: isCreatingMarker ? "45deg" : "0deg",
          transition: "rotate 0.2s",
        }}
      />
    </SpotActionIcon>
  );
}
