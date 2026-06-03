import { markersColors } from "@/entities/map";
import { Box } from "@mantine/core";
import { IconPlus, IconQuestionMark } from "@tabler/icons-react";
import { ReactNode, useEffect, useId, useState } from "react";
import styles from "./SpotMarker.module.css";

function MarkerShape({
  colors,
  size = 48,
}: {
  colors: [string, string];
  size?: number;
}) {
  const gradientId = useId();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="100%" stopColor={colors[1]} />
        </linearGradient>

        <filter
          id={`${gradientId}-glow`}
          x="-8"
          y="-8"
          width="40"
          height="40"
          filterUnits="userSpaceOnUse"
        >
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g
        fill={"none"}
        stroke={`url(#${gradientId})`}
        width={size}
        height={size}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        filter={`url(#${gradientId}-glow)`}
      >
        <path d="M17.657 16.657L13.414 20.9a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0" />
      </g>
    </svg>
  );
}

type MarkerProps = {
  colors?: [string, string];
  icon?: ReactNode;
  size?: number;
  isCreating?: boolean;
  onClick?: () => void;
  onCreateClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  latitude: number;
  longitude: number;
};

export default function SpotMarker({
  colors = markersColors.red,
  icon = <IconQuestionMark color="white" size={28} />,
  size = 64,
  isCreating = false,
  latitude,
  longitude,
  onClick,
  onCreateClick,
}: MarkerProps) {
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
      }, 1000);
    }

    return () => {
      window.clearTimeout(showTimeoutId);
      window.clearTimeout(unmountTimeoutId);
    };
  }, [isCreating, longitude, latitude]);

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
          pos="absolute"
          top="42%"
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
      </Box>

      {isCreateMenuMounted && (
        <button
          className={[
            styles.createMenu,
            isCreateMenuVisible ? styles.createMenuVisible : "",
          ]
            .filter(Boolean)
            .join(" ")}
          type="button"
          onClick={onCreateClick}
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
