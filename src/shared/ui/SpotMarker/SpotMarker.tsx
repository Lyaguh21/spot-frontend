import { IMapMarker, markersColors } from "@/entities/map";
import { Box, Text } from "@mantine/core";
import { IconPlus, IconQuestionMark } from "@tabler/icons-react";
import { ReactNode, useEffect, useState } from "react";
import styles from "./SpotMarker.module.css";
import MarkerShape from "./components/MarkerShape";

type IMarkerComponentsProps = {
  markerInfo?: IMapMarker;
  lat: number;
  lng: number;
  colors?: [string, string];
  icon?: ReactNode;
  size?: number;
  isCreating?: boolean;
  visitCount?: number;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onChildrenClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const getShortMarkerTitle = (title: string) => {
  const words = title.trim().split(/\s+/).filter(Boolean);

  if (words.length <= 2) {
    return words.join(" ");
  }

  return `${words.slice(0, 2).join(" ")}...`;
};

export default function SpotMarker({
  colors = markersColors.lime,
  icon = <IconQuestionMark />,
  lat,
  lng,

  markerInfo,
  size = 64,
  isCreating = false,
  visitCount = 0,
  onClick,
  onChildrenClick,
}: IMarkerComponentsProps) {
  const [isCreateMenuMounted, setIsCreateMenuMounted] = useState(false);
  const [isCreateMenuVisible, setIsCreateMenuVisible] = useState(false);

  useEffect(() => {
    let showTimeoutId: number | undefined;
    let unmountTimeoutId: number | undefined;

    setIsCreateMenuVisible(false);

    if (!isCreating) {
      unmountTimeoutId = window.setTimeout(() => {
        setIsCreateMenuMounted(false);
      }, 180);
    } else {
      setIsCreateMenuMounted(true);
      showTimeoutId = window.setTimeout(() => {
        setIsCreateMenuVisible(true);
      }, 500);
    }

    return () => {
      window.clearTimeout(showTimeoutId);
      window.clearTimeout(unmountTimeoutId);
    };
  }, [isCreating, lng, lat]);

  return (
    <Box className={styles.root}>
      <Box
        pos="relative"
        style={{
          cursor: "pointer",
          overflow: "visible",
        }}
        onClick={onClick}
      >
        <MarkerShape colors={colors} size={size} />

        <Box
          className={styles.iconSlot}
          pos="absolute"
          top="32%"
          left="50%"
          style={{
            transform: "translate(-50%, -50%)",
            color: "white",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>

        {!isCreating && visitCount > 1 && (
          <Box className={styles.countBadge}>{visitCount}</Box>
        )}
      </Box>

      {!isCreating && markerInfo?.title && (
        <Text className={styles.label}>
          {getShortMarkerTitle(markerInfo.title)}
        </Text>
      )}

      {isCreateMenuMounted && (
        <button
          className={[
            styles.createMenu,
            isCreateMenuVisible ? styles.createMenuVisible : "",
          ]
            .filter(Boolean)
            .join(" ")}
          type="button"
          onClick={onChildrenClick}
        >
          <span className={styles.createIcon} aria-hidden="true">
            <IconPlus size={24} stroke={2.4} />
          </span>
          <span className={styles.createText}>Добавить новое место</span>
        </button>
      )}
    </Box>
  );
}
