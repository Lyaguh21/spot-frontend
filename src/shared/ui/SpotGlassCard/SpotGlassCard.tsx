import { Box } from "@mantine/core";
import type { BoxProps } from "@mantine/core";
import type { ComponentPropsWithoutRef, PropsWithChildren } from "react";
import styles from "./SpotGlassCard.module.css";

type SpotGlassCardProps = PropsWithChildren<
  BoxProps & ComponentPropsWithoutRef<"div">
>;

export default function SpotGlassCard(props: SpotGlassCardProps) {
  const { className, ...rest } = props;

  return (
    <Box
      {...rest}
      className={[styles.root, className].filter(Boolean).join(" ")}
    />
  );
}
