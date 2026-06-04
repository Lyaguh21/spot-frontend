import { useId } from "react";

export default function MarkerShape({
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
      viewBox="0 0 384 512"
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="100%" stopColor={colors[1]} />
        </linearGradient>

        <filter
          id={`${gradientId}-glow`}
          x="-80"
          y="-80"
          width="544"
          height="672"
          filterUnits="userSpaceOnUse"
        >
          <feGaussianBlur stdDeviation="18" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        fill={`url(#${gradientId})`}
        filter={`url(#${gradientId}-glow)`}
        d="M172.268 501.67C26.97 291.031 0 269.413 0 192C0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67c-9.535 13.774-29.93 13.773-39.464 0"
      />
    </svg>
  );
}
