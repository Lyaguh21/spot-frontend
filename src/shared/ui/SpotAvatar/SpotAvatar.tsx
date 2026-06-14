import { Avatar } from "@mantine/core";
import type { AvatarProps } from "@mantine/core";
import type { MouseEventHandler } from "react";
import styles from "./SpotAvatar.module.css";

type SpotAvatarProps = AvatarProps & {
  frameClassName?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export default function SpotAvatar({
  frameClassName,
  className,
  ...props
}: SpotAvatarProps) {
  return (
    <span
      className={[styles.frame, frameClassName].filter(Boolean).join(" ")}
    >
      <Avatar
        {...props}
        className={[styles.avatar, className].filter(Boolean).join(" ")}
      />
    </span>
  );
}
