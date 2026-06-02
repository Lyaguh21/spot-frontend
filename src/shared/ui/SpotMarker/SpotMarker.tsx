import { Box } from "@mantine/core";
import { ReactNode, useId } from "react";

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
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="100%" stopColor={colors[1]} />
        </linearGradient>

        <filter id={`${gradientId}-glow`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g
        fill="none"
        stroke={`url(#${gradientId})`}
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
  colors: [string, string];
  icon: ReactNode;
  size?: number;
  onClick?: () => void;
};

export default function SpotMarker({
  colors,
  icon,
  size = 64,
  onClick,
}: MarkerProps) {
  return (
    <Box
      pos="relative"
      w={size}
      h={size}
      style={{
        cursor: "pointer",
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
  );
}
