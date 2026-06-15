import { Avatar } from "@mantine/core";
import type { AvatarProps } from "@mantine/core";
import type { MouseEventHandler } from "react";
import styles from "./SpotAvatar.module.css";

type SpotAvatarProps = AvatarProps & {
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export default function SpotAvatar({ className, ...props }: SpotAvatarProps) {
  return (
    <Avatar
      {...props}
      className={[styles.avatar, className].filter(Boolean).join(" ")}
    />
  );
}
